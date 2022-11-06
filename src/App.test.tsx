import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app without crashing with bench test text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Bench Test/i);
  expect(linkElement).toBeInTheDocument();
});
