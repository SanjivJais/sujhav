import React from 'react'
import { ClusterCard } from '../cards/ClusterCard'
import { useFetchClusters } from '@/hooks/useCluster';

export const ClusterFeed = () => {

    const { data: clusters } = useFetchClusters();

    return (
        <div className='flex flex-col gap-4 hide-scrollbar max-h-full overflow-y-auto'>
            {clusters && clusters.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((cluster) => (
                <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
        </div>
    )
}
