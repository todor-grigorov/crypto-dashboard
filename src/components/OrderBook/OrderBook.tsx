import React from "react";
import { useAppSelector } from "../../redux/hooks";
import Table from "../Table/Table";
import "./orderBook.css";

interface ParentProps {}

type Props = ParentProps;

const OrderBook: React.FunctionComponent<Props> = (
  props: Props
): JSX.Element => {
  const bids = useAppSelector((state) => state.orderBook.bids);
  const asks = useAppSelector((state) => state.orderBook.asks);

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
