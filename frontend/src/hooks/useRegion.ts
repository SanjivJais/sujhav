import { createRegion, fetchRegions } from "@/services/regionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateRegion = () => {
    return useMutation({
        mutationFn: createRegion,
        onSuccess: () => { },
        onError: () => {
            toast.error("Region couldn't be created!");
        }
    });
}

export const useFetchRegions = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["regions"],
        queryFn: fetchRegions,
        staleTime: 1000 * 60 * 5,
        retry: false
    });

    if (query.isError) {
        toast.error("Regions couldn't be fetched!");
    }

    if (query.data) {
        queryClient.setQueryData(["regions"], query.data);
    }

    return query;
}