import React from "react";
import Chart from "../../components/Chart/Chart";
import OrderBook from "../../components/OrderBook/OrderBook";
import Trades from "../../components/Trades/Trades";
import "./main.css";

interface ParentProps {}

type Props = ParentProps;

const Main: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  return (
    <div className="main">
      <OrderBook />
      <Chart />
      <Trades />
    </div>
  );
};

export default Main;
