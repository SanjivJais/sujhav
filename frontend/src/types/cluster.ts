export interface ICluster {
    id: string;
    topic: string;
    clusterSummary: string;
    posts: Array<string>;
    regions: Array<string>;
    tags: Array<string>;
    labels: Array<string>;
    createdAt: string;
    updatedAt: string;
}