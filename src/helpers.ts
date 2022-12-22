import { OrderBookState } from "./redux/slices/orderBookSlice";
import { WebSocketData } from "./services/BaseWebSocketService";
import { IOrderBookResponse } from "./services/OrderBookService";
import { CoinType } from "./types/CoinType";

export const getUrlCurrency = () => {
    const pathname = window.location.pathname;
    const currency = pathname.substring(1).toUpperCase();
    const type = Object.values(CoinType).find((t) => t === currency);

    return type;
};

const create_UUID = (): string => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export const processBookData = (response: WebSocketData<IOrderBookResponse>, state: OrderBookState): OrderBookState => {
    let result = JSON.parse(JSON.stringify(state)) as OrderBookState;

    response.data.forEach(item => {
        const { PRICE, AMOUNT, COUNT } = item;
        let price = PRICE;
        let count = COUNT;
        let amount = AMOUNT;
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



