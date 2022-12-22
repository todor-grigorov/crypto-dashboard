import { Dispatch, SetStateAction } from "react";
import { ISocketMessage } from "../interfaces/ISocketMessage";
import { CoinType } from "../types/CoinType";
import { ResponseEventType } from "../types/ResponseEventType";
import { SendEventType } from "../types/SendEventType";

export enum MessageType {
    POSITION_UPDATE = 1,
    SNAPSHOT = 2,
    HEARTBEAT = 3,
    SUBSCRIBE_EVENT = 4,
    INFO_EVENT = 5,
    UNSUBSCRIBED_EVENT = 6,
    CLOSED_EVENT = 7
}

export interface WSEventResponse {
    chanId: number; //316714
    channel: string; //"ticker"
    event: ResponseEventType;
    pair: string; //"BTCUSD"
    symbol: string; //"tBTCUSD"
}

export interface WebSocketData<T> {
    channelId: number;
    abbreviation?: string;
    data: Array<T>;
}

export abstract class BaseWebSocketService<T> {
    protected _websocket?: WebSocket;
    protected _protocols: string | string[] | undefined;
    protected _endpoint: string | URL;
    protected _setPositionItem: Dispatch<SetStateAction<WebSocketData<T> | undefined>> | null;
    protected _setSnapshot: Dispatch<SetStateAction<WebSocketData<T> | undefined>> | null | undefined;
    protected _msg: ISocketMessage = {} as ISocketMessage;
    protected _channel: string;
    protected _coinType: CoinType;
    protected _chanId: number = 0;
    protected _subscibed = false;

    constructor(setPositionItem: Dispatch<SetStateAction<WebSocketData<T> | undefined>> | null, channel: string, coinType: CoinType, url: string | URL, protocols?: string | string[] | undefined, setSnapshot?: Dispatch<SetStateAction<WebSocketData<T> | undefined>> | null) {
        this._setPositionItem = setPositionItem;
        this._channel = channel;
        this._coinType = coinType;
        this._endpoint = url;
        this._protocols = protocols;
        this._setSnapshot = setSnapshot;
    }

    public get Endpoint(): string | URL {
        return this._endpoint;
    }

    public get Msg(): ISocketMessage {
        return this._msg;
    }

    public get ChannelId(): number {
        return this._chanId;
    }

    public get IsSubscribed(): boolean {
        return this._subscibed;
    }

    public get CoinType(): CoinType {
        return this._coinType;
    }

    public set CoinType(value: CoinType) {
        this._coinType = value;
    }

    public abstract mapUpdateData(data: [number, Array<number>] | [number, string, Array<number>]): WebSocketData<T>;
    public abstract mapSnapshotData(data: [number, Array<Array<number>>]): WebSocketData<T>;

    public start(): void {
        this._websocket = new WebSocket(this._endpoint, this._protocols);

        this._websocket.addEventListener('open', this.onOpenHandler.bind(this));
    }

    public reconnect(coinType?: CoinType): void {
        if (coinType) {
            this._coinType = coinType;
        }

        this._msg = {
            event: SendEventType.SUBSCRIBE,
            channel: this._channel,
            symbol: `${this._coinType}USD`,
        };

        this._websocket?.send(JSON.stringify(this._msg));
        this.configureListeners();
    }

    public unSubscribe(): void {
        let msg = JSON.stringify({
            event: SendEventType.UNSUBSCRIBE,
            chanId: this._chanId,
        });

        this._websocket?.send(msg);
    }

    public closeWebSocketConnection(): void {
        this._websocket?.close();

        this._websocket?.addEventListener("close", () => {
            this._websocket = undefined;
        });
    }

    protected configureListeners() {
        if (!this._websocket) return;

        this._websocket.addEventListener('message', (message: any) => {
            const msgType = this.handleMessageType(JSON.parse(message.data));

            switch (msgType) {
                case MessageType.POSITION_UPDATE: {
                    if (this._setPositionItem && this._subscibed) {
                        let data = JSON.parse(message?.data);
                        data = JSON.parse(JSON.stringify(this.mapUpdateData(data)));
                        this._setPositionItem(data);
                    }
                    break;
                }
                case MessageType.SNAPSHOT:
                    if (this._setSnapshot && this._subscibed) {
                        let data = JSON.parse(message?.data);
                        data = JSON.parse(JSON.stringify(this.mapSnapshotData(data)));
                        this._setSnapshot(data);
                    }
                    break;
                case MessageType.INFO_EVENT:
                case MessageType.HEARTBEAT:
                    break;
                case MessageType.SUBSCRIBE_EVENT: {
                    let data = JSON.parse(message?.data);
                    this._subscibed = true;
                    this._chanId = data.chanId;
                    break;
                }
                case MessageType.UNSUBSCRIBED_EVENT: {
                    let data = JSON.parse(message?.data);
                    this._subscibed = false;
                    this._chanId = data.chanId;
                    break;
                }
                default: {
                    console.error('Received unknown message type');
                    break;
                }
            }

        });
    }

    protected handleMessageType(message: WSEventResponse | Array<unknown>): MessageType {
        if (Array.isArray(message)) {
            const [firstElement, secondElement] = message;
            if (message.length === 2 && Array.isArray(secondElement) && Array.isArray(secondElement[0])) {
                return MessageType.SNAPSHOT;
            } else if (message.length === 2 && Array.isArray(secondElement)) {
                return MessageType.POSITION_UPDATE;
            } else if (message.length === 2 && typeof secondElement === "string") {
                return MessageType.HEARTBEAT;
            } else {
                return MessageType.POSITION_UPDATE;
            }
        } else if (typeof message === 'object' && message.hasOwnProperty("event") && message.event === ResponseEventType.SUBSCRIBED) {
            return MessageType.SUBSCRIBE_EVENT;
        } else if (typeof message === 'object' && message.hasOwnProperty("event") && message.event === ResponseEventType.INFO) {
            return MessageType.INFO_EVENT;
        } else if (typeof message === 'object' && message.hasOwnProperty("event") && message.event === ResponseEventType.UNSUBSCRIBED) {
            return MessageType.UNSUBSCRIBED_EVENT;
        } else {
            return MessageType.CLOSED_EVENT;
        }
    }

    protected onOpenHandler() {
        this._msg = {
            event: SendEventType.SUBSCRIBE,
            channel: this._channel,
            symbol: `${this._coinType}USD`,
        };

        this._websocket?.send(JSON.stringify(this._msg));

        this.configureListeners();
    }

}