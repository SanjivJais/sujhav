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

export const fetchPostsByIds = async (postIds: string[]): Promise<IPost[]> => {
    const response = await apiClient.post("/posts/get-posts-by-ids", postIds);
    return response.data;
};

export const fetchPostsByUserId = async (userId: string): Promise<IPost[]> => {
    const response = await apiClient.get(`/posts/user/${userId}`);
    return response.data;
};