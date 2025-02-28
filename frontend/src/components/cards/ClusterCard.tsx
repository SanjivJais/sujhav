import { ICluster } from '@/types/cluster'
import { toPascalCase } from '@/utils/toPascalCase'
import { Box } from 'lucide-react'
import React from 'react'
import { format } from "date-fns-tz";
import Link from 'next/link';
import { ViewCluster } from '../dialogs/ViewCluster';
import { utcToLocal } from '@/lib/dateTime';

export const ClusterCard = ({ cluster }: { cluster: ICluster }) => {

    const [isViewOpen, setIsViewOpen] = React.useState(false);

    return (
        <div className='bg-transparent border rounded-xl p-4 flex flex-col gap-2 hover:bg-accent/50'>
            <div className="flex gap-2">
                <div className='text-[12px] text-muted-foreground'>Updated: {format(utcToLocal(cluster.updatedAt), "hh:mm aaa - d MMM")}</div>
            </div>
            <div
                className='text-lg font-medium hover:text-primary cursor-pointer w-fit'
                onClick={() => setIsViewOpen(true)}
            >
                {cluster.topic}
            </div>
            <p className='text-muted-foreground text-sm'>{cluster.clusterSummary}</p>

            <div className="flex flex-wrap gap-2">
                {cluster.tags.map((tag) => {
                    const tagLabel = toPascalCase(tag);
                    return (<Link href={`/u?tag=${tag}`} key={tag} className='text-blue-400 text-sm hover:underline'>{`#${tagLabel}`}</Link>)
                })}
            </div>
            <div className="flex flex-wrap gap-2">
                {cluster.regions.map((region) => {
                    const regionLabel = toPascalCase(region);
                    return (<Link href={`/u?region=${region}`} key={region} className='text-blue-400 text-sm hover:underline'>{`#${regionLabel}`}</Link>)
                })}
            </div>

            <div className="flex mt-2">
                <div title='Posts' className="flex items-center gap-1 group hover:cursor-pointer hover:text-primary">
                    <Box className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    {cluster.posts.length}
                </div>
            </div>
            <ViewCluster clusterId={cluster.id} isOpen={isViewOpen} setIsOpen={setIsViewOpen} />
        </div>
    )
}
