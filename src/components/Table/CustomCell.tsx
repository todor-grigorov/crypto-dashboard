import React from "react";
import { Column, Row, Cell, CellValue } from "react-table";
import { ArrowType } from "../../types/ArrowType";
import "./table.css";

interface ICustomCell {
  row: Row;
  cell: Cell<{
    price: string;
    amount?: number;
    isUp?: boolean;
    time?: string;
    size?: number;
    total?: number;
    id: number;
  }>;
  className?: string;
  //   setRowBackgroundColor?: (row: Row<any>) => string;
  columns: Column<any>[];
}

const CustomCell: React.FunctionComponent<ICustomCell> = (
  props: ICustomCell
): JSX.Element => {
  return (
    <div
      {...props.cell.getCellProps()}
      className={`custom-cell ${props.className || ""}`}
      style={
        props.cell.column.id === "price"
          ? props.cell.row.original.isUp
            ? { color: "green" }
            : { color: "red" }
          : { color: "#fff" }
      }
    >
      {props.cell.column.id === "price" ? (
        <div style={{ margin: "0 5px", fontSize: "18px", fontWeight: "bold" }}>
          {props.cell.row.original.isUp
            ? ArrowType.UP_ARROW
            : ArrowType.DOWN_ARROW}
        </div>
      ) : null}
      {props.cell.column.id === "amount" ? (
        <p
          className="test"
          style={
            props.cell.row.original?.isUp
              ? {
                  backgroundColor: "green",
                  width: `${
                    props.cell.row.original.amount &&
                    props.cell.row.original.amount > 100
                      ? 100
                      : props.cell.row.original.amount
                  }%`,
                  height: "100%",
                  paddingRight: "3px",
                  minHeight: "20px",
                  position: "absolute",
                  left: 5,
                }
              : {
                  backgroundColor: "red",
                  width: `${
                    props.cell.row.original.amount &&
                    props.cell.row.original.amount > 100
                      ? 100
                      : props.cell.row.original.amount
                  }%`,
                  height: "100%",
                  paddingRight: "3px",
                  minHeight: "20px",
                  position: "absolute",
                  left: 5,
                }
          }
        ></p>
      ) : null}
      <p
        style={{
          position: "absolute",
          right: 10,
          zIndex: 9,
        }}
      >
        {props.cell.render("Cell")}
      </p>
    </div>
  );
};

export default CustomCell;
