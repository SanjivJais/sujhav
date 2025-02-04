import Link from 'next/link'
import React from 'react'
import { TagBadge } from './TagBadge'
import { IRegion } from '@/types/region'


export const RegionBadgeRow = () => {

    const regionList: IRegion[] = [
        {
            id: "1",
            createdBy: "1",
            regionName: "Kathmandu"
        },
        {
            id: "2",
            createdBy: "2",
            regionName: "Pokhara"
        },
        {
            id: "3",
            createdBy: "3",
            regionName: "Bhaktapur"
        },
        {
            id: "4",
            createdBy: "4",
            regionName: "Lalitpur"
        },
        {
            id: "5",
            createdBy: "5",
            regionName: "Biratnagar"
        },
        {
            id: "6",
            createdBy: "6",
            regionName: "Chitwan"
        },
        {
            id: "7",
            createdBy: "7",
            regionName: "Butwal"
        },
    ]

    return (
        <div className='w-full overflow-x-auto hide-scrollbar flex gap-2'>
            {regionList.map((item, index) => (
                <Link key={index} href={`/u?region=${item.regionName}`} className='text-center'><TagBadge label={item.regionName} /></Link>
            ))}
        </div>
    )
}
