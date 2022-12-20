import { CoinType } from "../types/CoinType";
import { SocketChanelType } from "../types/SocketChannelType"

export interface ISocket {
    chanId: number;
    channel: SocketChanelType;
    event: string;
    pair: string;
    symbol: string;
    coinType: CoinType;
}