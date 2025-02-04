import { ICluster } from '@/types/cluster'
import React from 'react'
import { ClusterCard } from '../cards/ClusterCard'

export const ClusterFeed = () => {

    const clusters: ICluster[] = [
        {
            id: "1",
            topic: "Infrastructure Issues in Kathmandu",
            clusterSummary: "Posts discussing poor road conditions, traffic congestion, and lack of public transportation in Kathmandu.",
            posts: ["Post 1", "Post 2"],
            regions: ["Kathmandu"],
            tags: ["transportation", "roads", "public infrastructure"],
            labels: ["GS"],
            createdAt: "2023-10-02T10:15:00Z",
            updatedAt: "2023-10-06T09:45:00Z"
        },
        {
            id: "2",
            topic: "Solar Energy Solutions for Rural Areas",
            clusterSummary: "Posts proposing solar energy as a solution to power shortages in rural regions of Nepal.",
            posts: ["Post 3", "Post 4"],
            regions: ["Sindhuli", "Dhading", "Chitwan"],
            tags: ["solar energy", "renewable energy", "rural development"],
            labels: ["BO", "GS"],
            createdAt: "2023-10-02T10:15:00Z",
            updatedAt: "2023-10-06T09:45:00Z"
        },
        {
            id: "3",
            topic: "Eco-Tourism Opportunities in Mustang",
            clusterSummary: "Posts discussing the potential for eco-tourism in Mustang and how it can boost the local economy.",
            posts: ["Post 5", "Post 6"],
            regions: ["Mustang"],
            tags: ["eco-tourism", "tourism", "local economy"],
            labels: ["BO"],
            createdAt: "2023-10-02T10:15:00Z",
            updatedAt: "2023-10-06T09:45:00Z"
        },
        {
            id: "4",
            topic: "Solar Energy Solutions for Rural Areas",
            clusterSummary: "Posts proposing solar energy as a solution to power shortages in rural regions of Nepal.",
            posts: ["Post 3", "Post 4"],
            regions: ["Sindhuli", "Dhading", "Chitwan"],
            tags: ["solar energy", "renewable energy", "rural development"],
            labels: ["BO", "GS"],
            createdAt: "2023-10-02T10:15:00Z",
            updatedAt: "2023-10-06T09:45:00Z"
        },
        {
            id: "5",
            topic: "Eco-Tourism Opportunities in Mustang",
            clusterSummary: "Posts discussing the potential for eco-tourism in Mustang and how it can boost the local economy.",
            posts: ["Post 5", "Post 6"],
            regions: ["Mustang"],
            tags: ["eco-tourism", "tourism", "local economy"],
            labels: ["BO"],
            createdAt: "2023-10-02T10:15:00Z",
            updatedAt: "2023-10-06T09:45:00Z"
        },
    ]

    return (
        <div className='flex flex-col gap-4 hide-scrollbar max-h-full overflow-y-auto'>
            {clusters.map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
        </div>
    )
}
