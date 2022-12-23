import React, { useCallback } from "react";
import { useTable, Column } from "react-table";
import "./table.css";

import { styled } from "@mui/material/styles";
import MaUTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CustomCell from "./CustomCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0c1b21",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&td, th": {
    border: 0,
  },
  "&:nth-of-type(odd)": {
    // backgroundColor: "#204555",
    backgroundColor: "#102831",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface ParentProps {
  columns: Array<Column<any>>;
  data: Array<any>;
}

type Props = ParentProps;

const Table: React.FunctionComponent<Props> = (props: Props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable({
    columns: props.columns,
    data: props.data,
  });

  const RenderRows = useCallback(
    (props: any) => {
      return props.rows.map((row: any) => {
        prepareRow(row);
        return (
          <StyledTableRow {...row.getRowProps()} key={row.original.id}>
            {row.cells.map((cell: any) => {
              return (
                <StyledTableCell
                  {...cell.getCellProps()}
                  component="th"
                  scope="row"
                  align="left"
                  padding="checkbox"
                >
                  <CustomCell cell={cell} row={row} columns={props.columns} />
                </StyledTableCell>
              );
            })}
          </StyledTableRow>
        );
      });
    },
    [prepareRow, rows]
  );

  const RenderRow = React.useCallback(
    ({ index, style }: { index: any; style: any }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <StyledTableRow {...row.getRowProps(style)} key={row.original.id}>
          {row.cells.map((cell: any) => {
            return (
              <StyledTableCell
                {...cell.getCellProps()}
                component="th"
                scope="row"
                align="left"
                padding="checkbox"
              >
                <CustomCell cell={cell} row={row} columns={props.columns} />
                {/* <div {...cell.getCellProps()} className="td">
                  {cell.render("Cell")}
                </div> */}
              </StyledTableCell>
            );
          })}
        </StyledTableRow>
      );
    },
    [prepareRow, rows]
  );

  return (
    // <div {...getTableProps()} className="table">
    //   <>
    //     {headerGroups.map((headerGroup) => (
    //       <div {...headerGroup.getHeaderGroupProps()} className="tr">
    //         {headerGroup.headers.map((column) => (
    //           <div {...column.getHeaderProps()} className="th">
    //             {column.render("Header")}
    //           </div>
    //         ))}
    //       </div>
    //     ))}
    //   </>

    //   <div {...getTableBodyProps()}>
    //     <FixedSizeList
    //       height={500}
    //       itemCount={rows.length}
    //       itemSize={35}
    //       width={"100%"}
    //     >
    //       {RenderRow}
    //     </FixedSizeList>
    //   </div>
    // </div>

    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <StyledTableCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </StyledTableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        <RenderRows rows={rows} />
        {/* {RenderRow} */}
      </TableBody>
    </MaUTable>
  );
};

export default React.memo(Table);
