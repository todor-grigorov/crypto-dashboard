import { ISocketMessage } from "../interfaces/ISocketMessage";
import { CoinType } from "../types/CoinType";

export default class SocketManager {
    private static readonly PAIR_LIST = {
        tBTCUSD: CoinType.BTC,
        tETHUSD: CoinType.ETH,
        tSOLUSD: CoinType.SOL,
        tUDCUSD: CoinType.UDC,
    }

    private _socket: WebSocket;

    constructor(url: string | URL, protocols?: string | string[] | undefined) {
        this._socket = new WebSocket(url, protocols);

        this.addEventLIsteners();
        this.init();
    }


    public get socket(): WebSocket {
        return this._socket;
    }

    private init(): void {
        this.subscibeTicker();
    }

    private subscibeTicker(): void {
        this._socket.onopen = () => {
            Object.values(CoinType).forEach((type) => {
                let msg = JSON.stringify({
                    event: "subscribe",
                    channel: "ticker",
                    symbol: `t${type}USD`,
                } as ISocketMessage);

                this._socket.send(msg);
            });
        };
    }

    private onTickerMessage(msg: any): void {
        let temp = JSON.parse(msg?.data);
        let data;
        console.log(temp);

        if (Array.isArray(temp)) {
            data = JSON.parse(msg?.data) as [][];
        } else if (typeof temp === 'string') {

        } else if (typeof temp === 'object') {
            console.log("object");

        }
        console.log(data);

    }

    private onTradeMessage(msg: any): void {

    }

    private onBookMessage(msg: any): void {

    }

    private onCandleMessage(msg: any): void {

    }

    private addEventLIsteners(): void {
        this._socket.addEventListener("message", this.onTickerMessage);
        this._socket.addEventListener("message", this.onTradeMessage);
        this._socket.addEventListener("message", this.onBookMessage);
        this._socket.addEventListener("message", this.onCandleMessage);
    }
}