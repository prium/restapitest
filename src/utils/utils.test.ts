import { reduceToSum } from "./reduceToSum";
import { toCurrency } from "./toCurrency";

test("It reduces to sum to an given array", () => {
  const data = [{ Amount: 1 }, { Amount: 2 }]
  expect(reduceToSum(data)).toEqual(3);
});

test("It converts to currency format", ()=>{
    expect(toCurrency(-110.71)).toEqual("-$110.71")
    expect(toCurrency("-110.71")).toEqual("-$110.71")
})
