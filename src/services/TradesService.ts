import { BaseWebSocketService, WebSocketData } from "./BaseWebSocketService";


export interface ITradesResponse {
    MTS: number,
    ID: number,
    AMOUNT: number,
    PRICE: number,
};

const initialState = {
    channelId: 0,
    data: [
        {
            ID: 0,
            MTS: 0,
            AMOUNT: 0,
            PRICE: 0,
        }
    ]

} as WebSocketData<ITradesResponse>;

export class TradesService extends BaseWebSocketService<ITradesResponse> {
    mapUpdateData(data: [number, string, Array<number>]): WebSocketData<ITradesResponse> {
        let result: WebSocketData<ITradesResponse> = initialState;
        const [channelId, abbreviation, update] = data;
        result.channelId = channelId;
        result.abbreviation = abbreviation;

        if (update.length !== 4) return result;

        const [
            ID,
            MTS,
            AMOUNT,
            PRICE,
        ] = update;

        result.data[0].ID = ID;
        result.data[0].MTS = MTS;
        result.data[0].AMOUNT = AMOUNT;
        result.data[0].PRICE = PRICE;

        return result;
    }

    mapSnapshotData(data: [number, Array<Array<number>>]): WebSocketData<ITradesResponse> {
        let result: WebSocketData<ITradesResponse> = {
            channelId: 0,
            data: []

        } as WebSocketData<ITradesResponse>;

        const [channelId, nestedArray] = data;
        result.channelId = channelId;

        nestedArray.forEach((update) => {
            const [
                ID,
                MTS,
                AMOUNT,
                PRICE,
            ] = update;

            result.data.push({ ID, MTS, AMOUNT, PRICE });
        });

        return result;
    }
}