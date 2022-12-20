import { BaseWebSocketService, WebSocketData } from "./BaseWebSocketService";


export interface IOrderBookData {
    PRICE: number,
    COUNT: number,
    AMOUNT: number,


};

const initialState = {
    channelId: 0,
    data: [
        {
            PRICE: 0,
            COUNT: 0,
            AMOUNT: 0,
        }
    ]

} as WebSocketData<IOrderBookData>;

export class OrderBookService extends BaseWebSocketService<IOrderBookData> {
    mapUpdateData(data: [number, Array<number>]): WebSocketData<IOrderBookData> {
        let result: WebSocketData<IOrderBookData> = initialState;
        const [channelId, update] = data;
        result.channelId = channelId;

        if (update.length !== 3) return result;

        const [
            PRICE,
            COUNT,
            AMOUNT,
        ] = update;

        result.data[0].PRICE = PRICE;
        result.data[0].COUNT = COUNT;
        result.data[0].AMOUNT = AMOUNT;

        return result;
    }

    mapSnapshotData(data: [number, Array<Array<number>>]): WebSocketData<IOrderBookData> {
        let result: WebSocketData<IOrderBookData> = {
            channelId: 0,
            data: []

        } as WebSocketData<IOrderBookData>;

        const [channelId, nestedArray] = data;
        result.channelId = channelId;

        nestedArray.forEach((update, idx) => {
            const [
                PRICE,
                COUNT,
                AMOUNT,
            ] = update;

            result.data.push({ PRICE, COUNT, AMOUNT });
        });

        return result;
    }
}