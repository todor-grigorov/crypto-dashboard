import React, { useState, useEffect } from "react";
import config from "../../configs/config";
import { useAppSelector } from "../../redux/hooks";
import { WebSocketData } from "../../services/BaseWebSocketService";
import {
  IOrderBookData,
  OrderBookService,
} from "../../services/OrderBookService";
import { SocketChanelType } from "../../types/SocketChannelType";
import Table from "../Table/Table";
import { processBookData } from "../../helpers";
import "./orderBook.css";

export interface BookState {
  count: number; // millisecond time stamp
  amount: number; // Amount bought(positive) or sold(negative).
  price: number; // Price at which the trade was executed
  id: string;
  isUp: boolean;
}

export interface OrderBookState {
  chanId: number;
  channel: SocketChanelType;
  bids: Array<BookState>;
  asks: Array<BookState>;
}

const initialState: OrderBookState = {
  chanId: 0,
  channel: SocketChanelType.BOOK,
  bids: [],
  asks: [],
};

interface ParentProps {}

type Props = ParentProps;

const OrderBook: React.FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  const [orderBookData, setOrderBookData] =
    useState<OrderBookState>(initialState);
  const [orderBookUpdates, setOrderBookUpdates] =
    useState<WebSocketData<IOrderBookData>>();
  const [orderBookSnapshot, setOrderBookSnapshot] =
    useState<WebSocketData<IOrderBookData>>();
  const [service, setService] = useState<OrderBookService>();

  // const bids = useAppSelector((state) => state.orderBook.bids);
  // const asks = useAppSelector((state) => state.orderBook.asks);
  const bids = orderBookData.bids;
  const asks = orderBookData.asks;
  const currency = useAppSelector((state) => state.currency.value);

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

  const data = [
    { price: 1, count: 0.1, amount: 11, id: 1 },
    { price: 2, count: 0.2, amount: 22222, id: 2 },
    { price: 3, count: 0.3, amount: 33333, id: 3 },
    { price: 4, count: 0.4, amount: 44444, id: 4 },
    { price: 32876, count: 1, amount: 55555, id: 5 },
  ];

  useEffect(() => {
    console.log(orderBookSnapshot);
    if (!orderBookSnapshot) return;

    setOrderBookData(processBookData(orderBookSnapshot, orderBookData));
  }, [orderBookSnapshot]);

  useEffect(() => {
    console.log(orderBookUpdates);
    if (!orderBookUpdates) return;

    setOrderBookData(processBookData(orderBookUpdates, orderBookData));
  }, [orderBookUpdates]);

  /**
   * Unsunscribe to current currency pair and subscribe to the new pair
   */
  useEffect(() => {
    service?.unSubscribe();
    service?.reconnect(currency);
    setOrderBookData(initialState);
  }, [currency]);

  useEffect(() => {
    const initService = new OrderBookService(
      setOrderBookUpdates,
      "book",
      currency,
      config.urls.wsUrl,
      undefined,
      setOrderBookSnapshot
    );

    initService.start();
    setService(initService);
  }, []);

  return (
    <div className="orderBook">
      <div className="orderBook__heading">Order Book</div>
      <div className="orderBook__tables">
        <Table columns={asksColumns} data={asks} />
        <Table columns={bidsColumns} data={bids} />
      </div>
    </div>
  );
};

export default React.memo(OrderBook);
