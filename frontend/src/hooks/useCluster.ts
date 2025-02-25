import { fetchCluster, fetchClusters } from "@/services/clusterService";
import { ICluster } from "@/types/cluster";
import { useQuery } from "@tanstack/react-query";

export const useFetchClusters = () => {
    return useQuery<ICluster[], Error>({
        queryKey: ["clusters"],
        queryFn: async () => {
            const response = await fetchClusters();
            return response;
        },
        staleTime: 1000 * 60 * 5, // ✅ Cache for 5 minutes
        refetchOnWindowFocus: true, // ✅ Refresh data when user refocuses app
    })
}

export const useFetchCluster = (id: string) => {
    return useQuery<ICluster, Error>({
        queryKey: ["cluster", id],
        queryFn: async () => {
            const response = await fetchCluster(id);
            return response;
        },
    })
}