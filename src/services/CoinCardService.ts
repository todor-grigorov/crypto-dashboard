import { Dispatch, SetStateAction } from "react";
import { ISocketMessage } from "../interfaces/ISocketMessage";
import { CoinType } from "../types/CoinType";
import { BaseWebSocketService } from "./BaseWebSocketService";

// export enum MessageType {
//     POSITION_UPDATE = 1,
//     HEARTBEAT = 2,
//     SUBSCRIBE_EVENT = 3,
//     INFO_EVENT = 4,
//     CLOSED_EVENT = 5
// }

// export interface WSEventResponse {
//     chanId: number; //316714
//     channel: string; //"ticker"
//     event: "subscribed" | "info";
//     pair: string; //"BTCUSD"
//     symbol: string; //"tBTCUSD"
// }

export interface ITickerData {
    CHANNEL_ID: number,
    BID: number,
    BID_SIZE: number,
    ASK: number,
    ASK_SIZE: number,
    DAILY_CHANGE: number,
    DAILY_CHANGE_RELATIVE: number,
    LAST_PRICE: number,
    VOLUME: number,
    HIGH: number,
    LOW: number
};

const initialState = {
    CHANNEL_ID: 0,
    BID: 0,
    BID_SIZE: 0,
    ASK: 0,
    ASK_SIZE: 0,
    DAILY_CHANGE: 0,
    DAILY_CHANGE_RELATIVE: 0,
    LAST_PRICE: 0,
    VOLUME: 0,
    HIGH: 0,
    LOW: 0
} as ITickerData;

export class CoinCardService extends BaseWebSocketService<ITickerData> {
    mapData(data: [number, Array<number>]): ITickerData {
        let result: ITickerData = initialState;
        const [channelId, update] = data;
        result.CHANNEL_ID = channelId;

        if (update.length !== 10) return result;

        const [
            BID,
            BID_SIZE,
            ASK,
            ASK_SIZE,
            DAILY_CHANGE,
            DAILY_CHANGE_RELATIVE,
            LAST_PRICE,
            VOLUME,
            HIGH,
            LOW
        ] = update;

        result.BID = BID;
        result.BID_SIZE = BID_SIZE;
        result.ASK = ASK;
        result.ASK_SIZE = ASK_SIZE;
        result.DAILY_CHANGE = DAILY_CHANGE;
        result.DAILY_CHANGE_RELATIVE = DAILY_CHANGE_RELATIVE;
        result.LAST_PRICE = LAST_PRICE;
        result.VOLUME = VOLUME;
        result.HIGH = HIGH;
        result.LOW = LOW;

        return result;
    }
}