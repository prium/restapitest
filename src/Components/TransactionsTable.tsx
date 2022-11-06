import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";

import { useAPI } from "../hooks/useAPI";
import { TransactionType } from "../Types/TransactionType";
import { useEffect, useState } from "react";
import { toCurrency } from "../utils/toCurrency";
import { reduceToSum } from "../utils/reduceToSum";

const tableHeadData = ["Date", "Company", "Account"];

export const TransactionsTable = () => {
  const [page, setPage] = useState(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [transactions, setTransactions] = useState([] as TransactionType[]);

  const { status, data, error } = useAPI({
    page: page,
    dataLoaded: dataLoaded,
  });

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
        <Table sx={{ minWidth: 1320 }} aria-label="Transaction table">
          <colgroup>
            <col width="160px" />
            <col width="630px" />
            <col style={{minWidth: "400px"}} />
            <col width="200px" />
          </colgroup>
          <TableHead>
            <TableRow className="transaction-table-header">
              {tableHeadData.map((item, i) => {
                return <TableCell key={i}>{item}</TableCell>;
              })}

              <TableCell align="right">
                {!dataLoaded
                  ? "Calculating..."
                  : toCurrency(reduceToSum(transactions))}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            className="transaction-table-body"
            data-testid="transactions-body"
          >
            {transactions.map((item, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    {moment(item.Date).format("MMM Do, YYYY")}
                  </TableCell>
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
                    Error! {error instanceof Error && error.message}
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
