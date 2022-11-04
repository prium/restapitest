import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useAPI } from "../hooks/useAPI";
import { TransactionJSONType, TransactionType } from "../Types/TransactionType";
import { useEffect, useState } from "react";
import { reduceToSum, toCurrency } from "../utils/toCurrency";

const tableHeadData = ["Date", "Company", "Account"];

export const TransactionsTable = () => {
  const [page, setPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [transactions, setTransactions] = useState([] as TransactionType[]);

  const [count, setCount] = useState(1);

  const { status, data, error } = useAPI({
    page: page,
    dataLoaded: dataLoaded,
  }) as {
    status: string;
    data: TransactionJSONType;
    error: Error;
  };

  useEffect(() => {
    if (!data || dataLoaded) return;

    setTransactions((prev) => [...prev, ...data.transactions]);

    //Adding data.transactions.length because useEffect is always one render cycle behind
    if (data.totalCount > transactions.length + data.transactions.length) {
      setPage((prev) => prev + 1);
    } else setDataLoaded(true);
  }, [data?.page]);

  return (
    <div className="transaction-table">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Transaction table">
          <TableHead>
            <TableRow className="transaction-table-header">
              {tableHeadData.map((item, i) => {
                return <TableCell key={i}>{item}</TableCell>;
              })}

              <TableCell align="right">
                {!dataLoaded ? "Calculating..." : reduceToSum(transactions)}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody className="transaction-table-body">
            {transactions.map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.Company}</TableCell>
                  <TableCell>{item.Ledger}</TableCell>
                  <TableCell align="right">{toCurrency(item.Amount)}</TableCell>
                </TableRow>
              );
            })}

            <TableRow>
              <TableCell colSpan={5}>
                {status === "loading" ? (
                  `Loading: Page ${page}`
                ) : status === "error" ? (
                  <span style={{ color: "red" }}>
                    Error: {error?.message} <br />
                  </span>
                ) : (
                  <span style={{ color: "green" }}>
                    All {transactions.length} transactions are loaded
                    successfully.
                  </span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
