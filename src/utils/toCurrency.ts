export const toCurrency = (amount: string | number) => {
  let converted;
  typeof amount == "string" && (amount = Number(amount));

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

