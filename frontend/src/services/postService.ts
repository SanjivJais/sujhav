import apiClient from "@/lib/apiClient";
import { IPost, PostCreate } from "@/types/post";

export const createPost = async (data: PostCreate): Promise<IPost> => {
    const response = await apiClient.post("/posts", data);
    return response.data;
};

export const fetchPosts = async ({ page = 1, pageSize = 10 }): Promise<IPost[]> => {
    const response = await apiClient.get(`/posts/paginated?page=${page}&pageSize=${pageSize}`);
    return response.data;
};

export const fetchPost = async (id: string): Promise<IPost> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
};