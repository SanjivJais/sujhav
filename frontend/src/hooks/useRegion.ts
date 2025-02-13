import { createRegion, fetchRegions } from "@/services/regionService";
// import { IRegion } from "@/types/region";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateRegion = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRegion,
        // onMutate: async (newRegion) => {

            // // @ts-expect-error This type mismatch is intentional
            // await queryClient.cancelQueries(["regions"]);
            // const previousRegions = queryClient.getQueryData<IRegion[]>(["regions"]);

            // queryClient.setQueryData(["regions"], (oldRegions: IRegion[] | undefined) => {
            //     if (oldRegions) {
            //         return [...oldRegions, newRegion];
            //     } else {
            //         return [newRegion];
            //     }
            // });

            // return { previousRegions };
        // },
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