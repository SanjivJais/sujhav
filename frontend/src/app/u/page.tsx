"use client"
import { ProfileHighlight } from '@/components/cards/ProfileHighlight'
import { TopTags } from '@/components/cards/TopTags'
import { TopUsers } from '@/components/cards/TopUsers'
import { ClusterFeed } from '@/components/layout/ClusterFeed'
import { SideMenu } from '@/components/layout/SideMenu'
import { RegionBadgeRow } from '@/components/RegionBadgeRow'
import React from 'react'

const page = () => {
    return (
        <div className='grid grid-cols-12 w-full gap-4'>
            {/* left sidebars */}
            <div className='md:col-span-3 hidden md:flex flex-col gap-4'>
                <ProfileHighlight />
                <SideMenu />
            </div>

            {/* feed area */}
            <div className='lg:col-span-6 md:col-span-9 col-span-12 flex flex-col gap-4'>
                <RegionBadgeRow />
                <ClusterFeed />
            </div>

            {/* right sidebars */}
            <div className='lg:col-span-3 hidden lg:flex flex-col gap-4'>
                <TopUsers />
                <TopTags />
            </div>
        </div>
    )
}

export default page