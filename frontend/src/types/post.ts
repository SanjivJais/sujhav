export interface IPost {
    id: string;
    user: {
        id: string;
        username: string;
    }
    content: string;
    upvotes: number;
    downvotes: number;
    regions: string[];
    embedding: number[];
    createdAt: string;
    updatedAt: string;
}

export interface PostCreate {
    user: {
        id: string;
        username: string;
    }
    content: string;
    regions: string[];
    embedding: number[]
}