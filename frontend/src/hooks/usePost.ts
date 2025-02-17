import { createPost, fetchPosts } from "@/services/postService";
import { IPost, PostCreate } from "@/types/post";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePost = () => {
    return useMutation({
        mutationFn: async (data: PostCreate) => {
            return await createPost(data);
        },
        onSuccess: () => { },
        onError: () => {
            toast.error("Post couldn't be created!");
        }
    });
}

export const useFetchPosts = (page = 1, pageSize = 10) => {
    const query = useQuery<IPost[], Error>({
        queryKey: ["posts", page, pageSize], // Include parameters in queryKey
        queryFn: () => fetchPosts({ page, pageSize }), // Pass parameters to fetchPosts
        staleTime: 1000 * 60 * 20, // Enables smooth pagination
    });

    if (query.isError) {
        toast.error("Posts couldn't be fetched!");
    }

    return query;
};