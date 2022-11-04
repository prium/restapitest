import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TransactionsTable } from "./Components/TransactionsTable";
import "./scss/App.scss";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">Bench Test</header>
        <TransactionsTable />
      </div>
    </QueryClientProvider>
  );
}

export default App;
