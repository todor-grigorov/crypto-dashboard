
import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './slices/tickerSlice';
import currencyReducer from './slices/currencySlice';
import tradesReducer from './slices/tradesSlice';
import chartsReducer from './slices/chartsSlice';
import orderBookReducer from './slices/orderBookSlice';
// import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: {
        ticker: tickerReducer,
        trades: tradesReducer,
        charts: chartsReducer,
        orderBook: orderBookReducer,
        currency: currencyReducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;