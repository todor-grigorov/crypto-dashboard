import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import config from "../configs/config";
import { ISocketMessage } from "../interfaces/ISocketMessage";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  subscribeTicker,
  updateTickerOperationalData,
} from "../redux/slices/tickerSlice";
import {
  subscribeBook,
  addBookData,
  addSnapshotOrderBook,
} from "../redux/slices/orderBookSlice";
import {
  subscribeTrades,
  addTradeData,
  addSnapshotTrades,
} from "../redux/slices/tradesSlice";
import {
  subscribeCharts,
  addChartData,
  addSnapshotCharts,
} from "../redux/slices/chartsSlice";
import { CoinType } from "../types/CoinType";
import { SocketChanelType } from "../types/SocketChannelType";

const url = config.urls.wsUrl;
const webSocket = new WebSocket(url);
// const webSocket = new SocketManager(url);

export const SocketContext = createContext({
  socket: webSocket,
  subscribeToChannel: (channel: string, coinType: CoinType) => {},
  unSubscribe: (chanId: number) => {},
  subscribeAllChannels: (coinType: CoinType) => {},
  unsubscribeAllChannels: (ids: Array<number>) => {},
});

interface ISocketProviderProps {
  children: ReactNode;
}

export interface ISocketProvider {
  socket: WebSocket;
  subscribeToChannel: (channel: string, coinType: CoinType) => void;
  unSubscribe: (chanId: number) => void;
  subscribeAllChannels: (coinType: CoinType) => void;
  unsubscribeAllChannels: (ids: Array<number>) => void;
}

export const SocketProvider = (props: ISocketProviderProps) => {
  const [provider, setProvider] = useState<ISocketProvider>({
    socket: webSocket,
    subscribeToChannel,
    unSubscribe,
    subscribeAllChannels,
    unsubscribeAllChannels,
  });
  const tickerState = useAppSelector((state) => state.ticker);
  const orderBookState = useAppSelector((state) => state.orderBook);
  const tradesState = useAppSelector((state) => state.trades);
  const chartsState = useAppSelector((state) => state.charts);
  const currency = useAppSelector((state) => state.currency.value);

  const tickerIdRef = useRef(tickerState.chanId);
  const orderBookIdRef = useRef(orderBookState.chanId);
  const tradesIdRef = useRef(tradesState.chanId);
  const chartsIdRef = useRef(chartsState.chanId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    provider.socket.addEventListener("close", onClose);
    addEventLIsteners();

    return () => {
      provider.socket.removeEventListener("close", onClose);
    };
  }, [provider, setProvider]);

  useEffect(() => {
    tickerIdRef.current = tickerState.chanId;
    orderBookIdRef.current = orderBookState.chanId;
    tradesIdRef.current = tradesState.chanId;
    chartsIdRef.current = chartsState.chanId;
  }, [
    tickerState.chanId,
    orderBookState.chanId,
    tradesState.chanId,
    chartsState.chanId,
  ]);

  const onOpen = (): void => {
    // subscribeAllChannels(currency);
  };

  function subscribeToChannel(channel: string, coinType: CoinType): void {
    let msg = JSON.stringify({
      event: "subscribe",
      channel: channel,
      symbol: `t${coinType}USD`,
    } as ISocketMessage);

    if (channel === "candles") {
      msg = JSON.stringify({
        event: "subscribe",
        channel: channel,
        key: `trade:1m:t${coinType}USD`,
      } as ISocketMessage);
    }

    provider.socket.send(msg);
  }

  const onMessage = useCallback((msg: any): void => {
    let data = JSON.parse(msg?.data);

    if (data.hasOwnProperty("chanId") && data.hasOwnProperty("channel")) {
      if (data.channel === "ticker") dispatch(subscribeTicker(data));
      if (data.channel === "book") dispatch(subscribeBook(data));
      if (data.channel === "trades") dispatch(subscribeTrades(data));
      if (data.channel === "candles") dispatch(subscribeCharts(data));
    }

    if (
      Array.isArray(data) &&
      data.length === 2 &&
      Array.isArray(data[1]) &&
      Array.isArray(data[1][0])
    ) {
      // Init for Trades, OrderBook and Candles
      if (tradesIdRef.current === data[0]) {
        dispatch(addSnapshotTrades(data[1]));
      }
      if (orderBookIdRef.current === data[0]) {
        dispatch(addSnapshotOrderBook(data[1]));
      }
      if (chartsIdRef.current === data[0]) {
        dispatch(addSnapshotCharts(data[1]));
      }
    }

    if (
      Array.isArray(data) &&
      tradesIdRef.current === data[0] &&
      data.length === 3 &&
      typeof data[1] === "string" &&
      Array.isArray(data[2])
    ) {
      dispatch(addTradeData(data[2]));
    }

    if (
      Array.isArray(data) &&
      Array.isArray(data[1]) &&
      !Array.isArray(data[1][0])
    ) {
      if (tickerIdRef.current === data[0]) {
        dispatch(updateTickerOperationalData(data[1]));
      }
      if (orderBookIdRef.current === data[0]) {
        dispatch(addBookData(data[1]));
      }
      if (tradesIdRef.current === data[0]) {
        dispatch(addTradeData(data[1]));
      }
      if (chartsIdRef.current === data[0]) {
        dispatch(addChartData(data[1]));
      }
    }
    // console.log(data);
  }, []);

  function unSubscribe(chanId: number): void {
    let msg = JSON.stringify({
      event: "unsubscribe",
      chanId: chanId,
    });

    provider.socket.send(msg);
  }

  function subscribeAllChannels(coinType: CoinType): void {
    Object.values(SocketChanelType).forEach((channel) => {
      subscribeToChannel(channel, coinType);
    });
  }

  function unsubscribeAllChannels(ids: Array<number> = []): void {
    ids.forEach((chanId) => {
      unSubscribe(chanId);
    });
  }

  const onClose = () => {
    setTimeout(() => {
      // setProvider(new WebSocket(url));
      setProvider({
        socket: new WebSocket(url),
        subscribeToChannel,
        unSubscribe,
        subscribeAllChannels,
        unsubscribeAllChannels,
      });
    }, 500);
  };

  const addEventLIsteners = (): void => {
    provider.socket.addEventListener("open", onOpen);
    provider.socket.addEventListener("message", onMessage);
    provider.socket.addEventListener("close", onClose);
  };

  return (
    <SocketContext.Provider value={provider}>
      {props.children}
    </SocketContext.Provider>
  );
};
