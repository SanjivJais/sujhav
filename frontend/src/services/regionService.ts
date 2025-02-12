import apiClient from "@/lib/apiClient";
import { ICreateRegion, IRegion } from "@/types/region";

export const createRegion = async (data: ICreateRegion): Promise<IRegion> => {
    const response = await apiClient.post("/regions", data);
    return response.data;
}

export const fetchRegions = async (): Promise<IRegion[]> => {
    const response = await apiClient.get("/regions");
    return response.data;
}

