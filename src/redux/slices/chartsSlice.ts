import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebSocketData } from '../../services/BaseWebSocketService';
import { IChartResponse } from '../../services/ChartService';
import { SocketChanelType } from '../../types/SocketChannelType';

function roundToTwo(num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export interface ChartState {
    mts: number,    // millisecond time stamp
    open: number,	// First execution during the time frame
    close: number,	// Last execution during the time frame
    high: number,	// Highest execution during the time frame
    low: number,    // Lowest execution during the timeframe
    volume: number,	// Quantity of symbol traded within the timeframe
}

export interface ChartsState {
    chanId: number,
    channel: SocketChanelType,
    candles: Array<ChartState>,
}

const initialState: ChartsState = {
    chanId: 0,
    channel: SocketChanelType.CANDLES,
    candles: [],
};

export const chartsSlice = createSlice({
    name: 'charts',
    initialState,
    reducers: {
        addSnapshotCharts: (state, action: PayloadAction<WebSocketData<IChartResponse>>) => {
            state.candles = action.payload.data.map(details => ({
                mts: roundToTwo(details.MTS),
                open: roundToTwo(details.OPEN),
                close: roundToTwo(details.CLOSE),
                high: roundToTwo(details.HIGH),
                low: roundToTwo(details.LOW),
                volume: roundToTwo(details.VOLUME),
            }));

            state.candles.sort((a, b) => (a.mts - b.mts));

            return state;
        },

        addChartData: (state, action: PayloadAction<WebSocketData<IChartResponse>>) => {
            if (!action.payload.data.length) return;

            const update = action.payload.data[0];
            state.candles.pop();
            state.candles.unshift({
                mts: roundToTwo(update.MTS),
                open: roundToTwo(update.OPEN),
                close: roundToTwo(update.CLOSE),
                high: roundToTwo(update.HIGH),
                low: roundToTwo(update.LOW),
                volume: roundToTwo(update.VOLUME),
            } as ChartState);

            return state;
        },

        setLoading: (state, { payload }) => {
            const newState = { ...state, loading: payload };

            return newState;
        }
    }
});

export const { addChartData, addSnapshotCharts, setLoading } = chartsSlice.actions;

export default chartsSlice.reducer;