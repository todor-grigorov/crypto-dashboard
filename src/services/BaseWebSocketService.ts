import { Dispatch, SetStateAction } from "react";
import { ISocketMessage } from "../interfaces/ISocketMessage";
import { CoinType } from "../types/CoinType";

export enum MessageType {
    POSITION_UPDATE = 1,
    HEARTBEAT = 2,
    SUBSCRIBE_EVENT = 3,
    INFO_EVENT = 4,
    CLOSED_EVENT = 5
}

export interface WSEventResponse {
    chanId: number; //316714
    channel: string; //"ticker"
    event: "subscribed" | "info";
    pair: string; //"BTCUSD"
    symbol: string; //"tBTCUSD"
}

export abstract class BaseWebSocketService<T> {
    protected _websocket?: WebSocket;
    protected _protocols: string | string[] | undefined;
    protected _endpoint: string | URL;
    protected _msg: ISocketMessage = {} as ISocketMessage;
    protected _channel: string;
    protected _coinType: CoinType;
    protected _chanId: number = 0;
    protected _subscibed = false;

    constructor(channel: string, coinType: CoinType, url: string | URL, protocols?: string | string[] | undefined) {
        this._channel = channel;
        this._coinType = coinType;
        this._endpoint = url;
        this._protocols = protocols;
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

    public abstract mapData(data: [number, Array<number>] | [number, string, Array<number>]): T;

    public start(setPositionItem?: Dispatch<SetStateAction<T | undefined>> | null): void {
        this._websocket = new WebSocket(this._endpoint, this._protocols);

        this._websocket.addEventListener('open', this.onOpenHandler.bind(this, setPositionItem));
    }

    protected configureListeners(setTickerItem?: Dispatch<SetStateAction<string | undefined>> | null) {
        if (!this._websocket) return;

        this._websocket.addEventListener('message', (message: any) => {
            const msgType = this.handleMessageType(JSON.parse(message.data));

            switch (msgType) {
                case MessageType.POSITION_UPDATE: {
                    if (setTickerItem) {
                        let data = JSON.parse(message?.data);
                        data = JSON.parse(JSON.stringify(this.mapData(data)));
                        setTickerItem(data);
                    }
                    break;
                }
                case MessageType.INFO_EVENT:
                case MessageType.HEARTBEAT:
                    break;
                case MessageType.SUBSCRIBE_EVENT: {
                    let data = JSON.parse(message?.data);
                    this._subscibed = true;
                    this._chanId = data.chanId;
                    break;
                }
                // case MessageType.CLOSED_EVENT: {
                //     this._subscibed = true;

                //     let msg = JSON.stringify({
                //         event: "unsubscribe",
                //         chanId: this._chanId,
                //     });

                //     this._websocket?.send(msg);
                //     break;
                // }
                default: {
                    break;
                }
            }

        });
    }

    protected handleMessageType(message: WSEventResponse | Array<unknown>): MessageType {
        if (Array.isArray(message)) {
            if (message.length >= 2 && Array.isArray(message[1])) {
                return MessageType.POSITION_UPDATE;
            } else {
                return MessageType.HEARTBEAT;
            }
        } else if (typeof message === 'object' && message.hasOwnProperty("event") && message.event === "subscribed") {
            return MessageType.SUBSCRIBE_EVENT;
        } else if (typeof message === 'object' && message.hasOwnProperty("event") && message.event === "info") {
            return MessageType.INFO_EVENT;
        } else {
            return MessageType.CLOSED_EVENT;
        }
    }

    protected onOpenHandler(setTickerItem?: Dispatch<SetStateAction<any | undefined>> | null) {
        this._msg = {
            event: "subscribe",
            channel: this._channel,
            symbol: `${this._coinType}USD`,
        };

        this._websocket?.send(JSON.stringify(this._msg));

        this.configureListeners(setTickerItem);
    }

}