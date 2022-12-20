import React, { useState, useEffect, useCallback } from "react";
import config from "../../configs/config";
import { useAppSelector } from "../../redux/hooks";
import { WebSocketData } from "../../services/BaseWebSocketService";
import {
  IOrderBookData,
  OrderBookService,
} from "../../services/OrderBookService";
import { SocketChanelType } from "../../types/SocketChannelType";
import Table from "../Table/Table";
import "./orderBook.css";
import { CoinType } from "../../types/CoinType";
import {
  addBookData,
  addSnapshotOrderBook,
  setLoading,
} from "../../redux/slices/orderBookSlice";
import { useDispatch } from "react-redux";

const bidsColumns = [
  { Header: "Amount", accessor: "amount" },
  { Header: "Count", accessor: "count" },
  { Header: "Price", accessor: "price" },
];

const asksColumns = [
  { Header: "Price", accessor: "price" },
  { Header: "Count", accessor: "count" },
  { Header: "Amount", accessor: "amount" },
];

// const data = [
//   { price: 1, count: 0.1, amount: 11, id: 1 },
//   { price: 2, count: 0.2, amount: 22222, id: 2 },
//   { price: 3, count: 0.3, amount: 33333, id: 3 },
//   { price: 4, count: 0.4, amount: 44444, id: 4 },
//   { price: 32876, count: 1, amount: 55555, id: 5 },
// ];

interface ParentProps {}

type Props = ParentProps;

const OrderBook: React.FunctionComponent<Props> = (): JSX.Element => {
  const [orderBookUpdates, setOrderBookUpdates] =
    useState<WebSocketData<IOrderBookData>>();
  const [orderBookSnapshot, setOrderBookSnapshot] =
    useState<WebSocketData<IOrderBookData>>();
  const [service, setService] = useState<OrderBookService>();

  const bids = useAppSelector((state) => state.orderBook.bids);
  const asks = useAppSelector((state) => state.orderBook.asks);
  const loading = useAppSelector((state) => state.orderBook.loading);

  const currency = useAppSelector((state) => state.currency.value);
  const dispatch = useDispatch();

  const serviceConnect = useCallback((currCurrency: CoinType) => {
    const initService = new OrderBookService(
      setOrderBookUpdates,
      "book",
      currCurrency,
      config.urls.wsUrl,
      undefined,
      setOrderBookSnapshot
    );

    initService.start();
    setService(initService);
  }, []);

  useEffect(() => {
    if (!orderBookSnapshot) return;

    dispatch(addSnapshotOrderBook(orderBookSnapshot));
    dispatch(setLoading(false));
  }, [orderBookSnapshot]);

  useEffect(() => {
    if (!orderBookUpdates) return;

    dispatch(addBookData(orderBookUpdates));
  }, [orderBookUpdates]);

  /**
   * Unsunscribe to current currency pair and subscribe to the new pair
   */
  useEffect(() => {
    if (!service) return;

    service?.unSubscribe();
    dispatch(setLoading(true));
    service?.reconnect(currency);
    // service?.closeWebSocketConnection();
    // serviceConnect(currency);
  }, [currency]);

  useEffect(() => {
    serviceConnect(currency);
  }, []);

  return (
    <div className="orderBook">
      <div className="orderBook__heading">Order Book</div>
      <div className="orderBook__tables">
        {!loading ? (
          <Table columns={asksColumns} data={asks} />
        ) : (
          <Table columns={asksColumns} data={[]} />
        )}
        {!loading ? (
          <Table columns={bidsColumns} data={bids} />
        ) : (
          <Table columns={bidsColumns} data={[]} />
        )}
      </div>
    </div>
  );
};

export default React.memo(OrderBook);
