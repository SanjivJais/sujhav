export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface IUser {
    id: string;
    email: string;
    username: string;
    role: string;
    displayName: string;
    createdAt: string;
}

export interface DecodedUser {
    role: string
    userId?: string
    email?: string
}