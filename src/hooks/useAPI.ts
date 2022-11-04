import { TransactionJSONType, TransactionType } from "../Types/TransactionType";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useAPI = ({
  page,
  dataLoaded,
}: {
  page: Number;
  dataLoaded: boolean;
}) => {
  const API_URL = `https://resttest.bench.co/transactions/${page}.json`;

  return useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 2000)); //Simulating slow API calls
      const { data } = await axios.get<TransactionJSONType>(API_URL);

      return data;
    },
    enabled: !dataLoaded,
  });
};
