import { render, screen } from "@testing-library/react";
import { useAPI } from "../hooks/useAPI";
import { TransactionsTable } from "../Components/TransactionsTable";

import moment from "moment";
import { toCurrency } from "../utils/toCurrency";
import { reduceToSum } from "../utils/reduceToSum";

// Solves TypeScript Errors
const mockedUseAPI = useAPI as jest.Mock<any>;

// Mock the module
jest.mock("../hooks/useAPI");

describe("<TransactionsTable />", () => {
  beforeEach(() => {
    mockedUseAPI.mockImplementation(() => ({ status: "loading" }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Renders without crashing", () => {
    render(<TransactionsTable />);
  });

  it("Fetches the first page from API", () => {
    render(<TransactionsTable />);

    // Start fetching from the API from page 1
    expect(useAPI).toHaveBeenCalledWith({
      page: 1,
      dataLoaded: false,
    });
  });

  it("Displays loading indicators", () => {
    const { getByText } = render(<TransactionsTable />);

    expect(getByText(/Calculating.../i)).toBeVisible();
    expect(getByText(/Loading: Page 1/i)).toBeVisible();
  });

  it("Displays error message", () => {
    mockedUseAPI.mockImplementation(() => ({
      status: "error",
      error: { message: "Unable to fetch the product data" },
    }));
    const { getByText, queryByText } = render(<TransactionsTable />);

    expect(queryByText(/Loading: Page/i)).toBeFalsy(); // We don't want the loading flag to be displayed
    getByText(/Error!/i);
  });

  it("Loads transaction data currectly", async () => {
    const mockedProductData = {
      totalCount: 20,
      page: 1,
      transactions: [
        {
          Date: "2013-12-22",
          Ledger: "Phone & Internet Expense",
          Amount: "-110.71",
          Company: "SHAW CABLESYSTEMS CALGARY AB",
        },
        {
          Date: "2013-12-21",
          Ledger: "Travel Expense, Nonlocal",
          Amount: "-8.1",
          Company: "BLACK TOP CABS VANCOUVER BC",
        },
        {
          Date: "2013-12-21",
          Ledger: "Business Meals & Entertainment Expense",
          Amount: "-9.88",
          Company: "GUILT & CO. VANCOUVER BC",
        },
        {
          Date: "2013-12-20",
          Ledger: "Travel Expense, Nonlocal",
          Amount: "-7.6",
          Company: "VANCOUVER TAXI VANCOUVER BC",
        },
        {
          Date: "2013-12-20",
          Ledger: "Business Meals & Entertainment Expense",
          Amount: "-120",
          Company: "COMMODORE LANES & BILL VANCOUVER BC",
        },
        {
          Date: "2013-12-20",
          Ledger: "Business Meals & Entertainment Expense",
          Amount: "-177.5",
          Company: "COMMODORE LANES & BILL VANCOUVER BC",
        },
        {
          Date: "2013-12-20",
          Ledger: "Equipment Expense",
          Amount: "-1874.75",
          Company: "NINJA STAR WORLD VANCOUVER BC",
        },
        {
          Date: "2013-12-19",
          Ledger: "",
          Amount: "20000",
          Company: "PAYMENT - THANK YOU / PAIEMENT - MERCI",
        },
        {
          Date: "2013-12-19",
          Ledger: "Web Hosting & Services Expense",
          Amount: "-10.99",
          Company: "DROPBOX xxxxxx8396 CA 9.99 USD @ xx1001",
        },
        {
          Date: "2013-12-19",
          Ledger: "Business Meals & Entertainment Expense",
          Amount: "-35.7",
          Company: "NESTERS MARKET #x0064 VANCOUVER BC",
        },
      ],
    };

    mockedUseAPI.mockImplementation(() => ({
      status: "loading",
      data: mockedProductData,
    }));

    // Rendering with Moc data
    const { rerender, getByText, queryByText } = render(<TransactionsTable />);

	// All the rows are rendered for page 1
    // Todo: Verify each row is containing the exact data it suppose to contain
    expect(
      (screen.queryByTestId("transactions-body") as HTMLElement)
        .childElementCount
    ).toEqual(mockedProductData.transactions.length + 1); //+1 to include the last row with the feedback text

    // Changing the "page" for API call to 2
    mockedProductData.page = 2;

    mockedUseAPI.mockImplementation(() => ({
      status: "success", //API call chain is done
      data: mockedProductData,
    }));

    // Rerendering for the second API call
    rerender(<TransactionsTable />);

    // The useAPI is now suppose to featch page 2
    expect(useAPI).toHaveBeenCalledWith({
      page: 2,
      dataLoaded: false,
    });

    // We don't want the loading flag to be displayed anymore
    expect(queryByText(/Loading: Page/i)).toBeFalsy();
    expect(queryByText(/Calculating.../i)).toBeFalsy();

    //displays the sum in table header
    getByText(toCurrency(reduceToSum(mockedProductData.transactions) * 2));

    // displays the success text in table footer
    getByText(
      `All ${mockedProductData.totalCount} transactions are loaded successfully.`
    );

    // All the rows are rendered
    // Todo: Verify each row is containing the exact data it suppose to contain
    expect(
      (screen.queryByTestId("transactions-body") as HTMLElement)
        .childElementCount
    ).toEqual(mockedProductData.totalCount + 1); //+1 to include the last row with the feedback text
  });
});
