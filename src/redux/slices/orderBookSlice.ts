import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { SocketChanelType } from '../../types/SocketChannelType';

export interface BookState {
    count: number,	// millisecond time stamp
    amount: number,	// Amount bought(positive) or sold(negative).
    price: number,	// Price at which the trade was executed
    id: string,
    isUp: boolean,
}

export interface OrderBookState {
    chanId: number,
    channel: SocketChanelType,
    bids: Array<BookState>,
    asks: Array<BookState>,
}

const create_UUID = (): string => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const processBookData = (data: Array<Array<number>>, state: OrderBookState): OrderBookState => {
    let result = state;

    data.forEach(item => {
        let price = item[0];
        let count = item[1];
        let amount = item[2];
        let id = create_UUID();

        if (count > 0) {
            if (amount > 0) {
                const bidIndex = result.bids.findIndex(bid => bid.price === price);

                if (bidIndex >= 0) {
                    result.bids[bidIndex].amount = amount;
                } else {
                    if (result.bids.length < 25) result.bids.push({ price, count, amount, id, isUp: true });
                    if (result.bids.length >= 25) {
                        // TODO:
                        // Maybe result.bids.shift() THEN result.bids.push({ price, count, amount });
                    }
                }
            } else if (amount < 0) {
                const askIndex = result.asks.findIndex(ask => ask.price === price);

                if (askIndex >= 0) {
                    result.asks[askIndex].amount = amount;
                } else {
                    if (result.asks.length < 25) result.asks.push({ price, count, amount, id, isUp: false });
                    if (result.asks.length >= 25) {
                        // TODO:
                        // Maybe result.asks.shift() THEN result.asks.push({ price, count, amount });
                    }
                }
            }
        } else if (count === 0) {
            if (amount === 1) {
                const bidIndex = result.bids.findIndex(bid => bid.price === price);

                result.bids.splice(bidIndex, 1);
            } else if (amount === -1) {
                const askIndex = result.asks.findIndex(ask => ask.price === price);

                result.asks.splice(askIndex, 1);
            }
        }
    });

    return result;
}



const initialState: OrderBookState = {
    chanId: 0,
    channel: SocketChanelType.BOOK,
    bids: [],
    asks: []
}

export const orderBookSlice = createSlice({
    name: 'orderBook',
    initialState,
    reducers: {
        subscribeBook: (state, { payload }) => {
            state.chanId = payload["chanId"];
            state.channel = payload["channel"];
            return state;
        },

        addSnapshotOrderBook: (state, action: PayloadAction<Array<Array<number>>>) => {
            const newState = processBookData(action.payload, state);

            return newState;
        },

        addBookData: (state, { payload }) => {
            const newState = processBookData([payload], state);

            return newState;
        }
    }
});

export const { subscribeBook, addBookData, addSnapshotOrderBook } = orderBookSlice.actions;

export default orderBookSlice.reducer;