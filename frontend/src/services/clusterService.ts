import apiClient from "@/lib/apiClient";
import { ICluster } from "@/types/cluster";

export const fetchClusters = async (): Promise<ICluster[]> => {
    const response = await apiClient.get("/clusters");
    return response.data;
};

export const fetchCluster = async (id: string): Promise<ICluster> => {
    const response = await apiClient.get(`/clusters/${id}`);
    return response.data;
};

