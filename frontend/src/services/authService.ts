import apiClient from "@/lib/apiClient";
import { IUser, LoginData, RegisterData } from "@/types/user";

export const loginUser = async (data: LoginData): Promise<string> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
};

export const registerUser = async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
};

// Fetch user data with token
export const fetchUserProfile = async (): Promise<IUser> => {
    const response = await apiClient.get("/auth/users/me");
    return response.data;
};