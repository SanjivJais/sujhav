import Link from 'next/link'
import React from 'react'
import { TagBadge } from './TagBadge'
import { useFetchRegions } from '@/hooks/useRegion'


export const RegionBadgeRow = () => {

    const { data: regions} = useFetchRegions()

    return (
        <div className='w-full overflow-x-auto hide-scrollbar flex gap-2'>
            {regions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((item, index) => (
                <Link key={index} href={`/u?region=${item.regionName}`} className='text-center'><TagBadge label={item.regionName} /></Link>
            ))}
        </div>
    )
}
