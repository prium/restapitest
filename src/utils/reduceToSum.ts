import { TransactionType } from "../Types/TransactionType";

export const reduceToSum = (
  transactions: TransactionType[] | { Amount: number }[]
) => {
  return transactions
    .map((item) => {
      return Number(item.Amount);
    })
    .reduce((a, b) => a + b);
};
