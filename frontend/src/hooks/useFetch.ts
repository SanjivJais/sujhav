import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

const useFetch = (key: string, url: string) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data } = await apiClient.get(url);
      return data;
    },
  });
};

export default useFetch;
