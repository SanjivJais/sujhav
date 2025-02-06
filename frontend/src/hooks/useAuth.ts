import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, fetchUserProfile } from "@/services/authService";
// import { useAuthStore } from "@/store/authStore";
import { getToken, removeToken, setToken } from "@/lib/token";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Login Hook
export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setToken(data);
        },
    });
};

// Register Hook
export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success("Registration successful!");
        },
    });
};

// Fetch User Hook
export const useUserProfile = () => {
    const queryClient = useQueryClient();
    const router = useRouter()
    // const { setUser } = useAuthStore();

    const query = useQuery({
        queryKey: ["user"],
        queryFn: fetchUserProfile,
        enabled: !!getToken(), // Only fetch if token exists
        staleTime: 1000 * 60 * 5, // 5 minutes before refetching in background
        retry: false, // Don't retry failed requests
    });

    if(query.isError){
        removeToken(); // Remove token
        router.push("/auth/login"); // Redirect to login page
    }

    // ✅ Sync Zustand store when query data changes
    if (query.data) {
        // setUser(query.data);
        queryClient.setQueryData(["user"], query.data);
    }

    return query;
};