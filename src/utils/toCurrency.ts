import { TransactionType } from "../Types/TransactionType";
export const toCurrency = (amount: string | number) => {
  let converted;
  typeof amount == "string" && (amount = Number(amount));

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const reduceToSum = (transactions: TransactionType[]) => {
  return toCurrency(
    transactions
      .map((item) => {
        return Number(item.Amount);
      })
      .reduce((a, b) => a + b)
  );
};
