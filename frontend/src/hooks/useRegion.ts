import { createRegion, fetchRegions } from "@/services/regionService";
import { ICreateRegion, IRegion } from "@/types/region";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateRegion = () => {
    return useMutation({
        mutationFn: async ({createdBy, regionName}: ICreateRegion) => {
          return await createRegion({createdBy, regionName});
        },
        onSuccess: () => { },
        onError: () => {
            toast.error("Region couldn't be created!");
        }
    });
}


export const useFetchRegions = () => {
    return useQuery<IRegion[], Error>({
      queryKey: ["regions"],
      queryFn: async () => {
        const response = await fetchRegions();
        return response;
      },
      staleTime: 1000 * 60 * 5, // ✅ Cache for 5 minutes
      refetchOnWindowFocus: true, // ✅ Refresh data when user refocuses app
    });
  };