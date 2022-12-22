import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import config from "../../configs/config";
import { useAppSelector } from "../../redux/hooks";
import {
  addSnapshotTrades,
  addTradeData,
  setLoading,
} from "../../redux/slices/tradesSlice";
import { WebSocketData } from "../../services/BaseWebSocketService";
import { ITradesResponse, TradesService } from "../../services/TradesService";
import { CoinType } from "../../types/CoinType";
import Table from "../Table/Table";
import "./trades.css";

const columns = [
  { Header: "Price", accessor: "price" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Time", accessor: "time" },
];

const data = [
  { price: 1, amount: 0.1, time: 11111, isUp: true },
  { price: 2, amount: 0.2, time: 22222, isUp: true },
  { price: 3, amount: 0.3, time: 33333, isUp: false },
  { price: 4, amount: 0.4, time: 44444, isUp: true },
  { price: 32876, amount: 1, time: 55555, isUp: false },
];

interface ParentProps {}

type Props = ParentProps;

const Trades: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const [tradeUpdates, setTradeUpdates] =
    useState<WebSocketData<ITradesResponse>>();
  const [TradesSnapshot, setTradesSnapshot] =
    useState<WebSocketData<ITradesResponse>>();
  const [service, setService] = useState<TradesService>();

  const trades = useAppSelector((state) => state.trades.trades);

  const currency = useAppSelector((state) => state.currency.value);
  const dispatch = useDispatch();

  const serviceConnect = useCallback((currCurrency: CoinType) => {
    const initService = new TradesService(
      setTradeUpdates,
      "trades",
      currCurrency,
      config.urls.wsUrl,
      undefined,
      setTradesSnapshot
    );

    initService.start();
    setService(initService);
  }, []);

  useEffect(() => {
    if (!TradesSnapshot) return;

    dispatch(addSnapshotTrades(TradesSnapshot));
    dispatch(setLoading(false));
  }, [TradesSnapshot]);

  useEffect(() => {
    if (!tradeUpdates) return;

    dispatch(addTradeData(tradeUpdates));
  }, [tradeUpdates]);

  /**
   * Unsunscribe to current currency pair and subscribe to the new pair
   */
  useEffect(() => {
    if (!service) return;

    service?.unSubscribe();
    dispatch(setLoading(true));
    service?.reconnect(currency);
  }, [currency]);

  useEffect(() => {
    serviceConnect(currency);
  }, []);

  return (
    <div className="trading">
      <div className="tarding__heading">Recent Trades</div>
      <Table columns={columns} data={trades} />
    </div>
  );
};

export default React.memo(Trades);
