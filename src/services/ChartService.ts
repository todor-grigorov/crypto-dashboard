import { BaseWebSocketService, WebSocketData } from "./BaseWebSocketService";


export interface IChartResponse {
    MTS: number,
    OPEN: number,
    CLOSE: number,
    HIGH: number,
    LOW: number,
    VOLUME: number,
};

const initialState = {
    channelId: 0,
    data: [
        {
            MTS: 0,
            OPEN: 0,
            CLOSE: 0,
            HIGH: 0,
            LOW: 0,
            VOLUME: 0,
        }
    ]

} as WebSocketData<IChartResponse>;

export class ChartService extends BaseWebSocketService<IChartResponse> {
    mapUpdateData(data: [number, string, Array<number>]): WebSocketData<IChartResponse> {
        let result: WebSocketData<IChartResponse> = initialState;
        const [channelId, abbreviation, update] = data;
        result.channelId = channelId;
        result.abbreviation = abbreviation;

        if (update.length !== 6) return result;

        const [
            MTS,
            OPEN,
            CLOSE,
            HIGH,
            LOW,
            VOLUME,
        ] = update;

        result.data[0].MTS = MTS;
        result.data[0].OPEN = OPEN;
        result.data[0].CLOSE = CLOSE;
        result.data[0].HIGH = HIGH;
        result.data[0].LOW = LOW;
        result.data[0].VOLUME = VOLUME;

        return result;
    }

    mapSnapshotData(data: [number, Array<Array<number>>]): WebSocketData<IChartResponse> {
        let result: WebSocketData<IChartResponse> = {
            channelId: 0,
            data: []

        } as WebSocketData<IChartResponse>;

        const [channelId, nestedArray] = data;
        result.channelId = channelId;

        nestedArray.forEach((update) => {
            const [
                MTS,
                OPEN,
                CLOSE,
                HIGH,
                LOW,
                VOLUME,
            ] = update;

            result.data.push({ MTS, OPEN, CLOSE, HIGH, LOW, VOLUME });
        });

        return result;
    }
}