import React from "react";
import { useAppSelector } from "../../redux/hooks";
import Table from "../Table/Table";
import "./trades.css";

interface ParentProps {}

type Props = ParentProps;

const Trades: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const trades = useAppSelector((state) => state.trades.trades);

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

  return (
    <div className="trading">
      <div className="tarding__heading">Recent Trades</div>
      <Table columns={columns} data={trades} />
    </div>
  );
};

export default React.memo(Trades);
