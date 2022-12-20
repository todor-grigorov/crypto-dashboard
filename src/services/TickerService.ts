import { Dispatch, SetStateAction } from "react";
import { ISocketMessage } from "../interfaces/ISocketMessage";
import { CoinType } from "../types/CoinType";
import { BaseWebSocketService, WebSocketData } from "./BaseWebSocketService";

export interface ITickerData {
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
    channelId: 0,
    data: [
        {
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
        }
    ]

} as WebSocketData<ITickerData>;

export class TickerService extends BaseWebSocketService<ITickerData> {
    mapUpdateData(data: [number, Array<number>]): WebSocketData<ITickerData> {
        let result: WebSocketData<ITickerData> = initialState;
        const [channelId, update] = data;
        result.channelId = channelId;

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

        result.data[0].BID = BID;
        result.data[0].BID_SIZE = BID_SIZE;
        result.data[0].ASK = ASK;
        result.data[0].ASK_SIZE = ASK_SIZE;
        result.data[0].DAILY_CHANGE = DAILY_CHANGE;
        result.data[0].DAILY_CHANGE_RELATIVE = DAILY_CHANGE_RELATIVE;
        result.data[0].LAST_PRICE = LAST_PRICE;
        result.data[0].VOLUME = VOLUME;
        result.data[0].HIGH = HIGH;
        result.data[0].LOW = LOW;

        return result;
    }

    mapSnapshotData(data: [number, Array<Array<number>>]): WebSocketData<ITickerData> {
        return initialState;
    }
}