import { ITag } from '@/types/tag'
import React from 'react'
import { TagBadge } from '../TagBadge'
import Link from 'next/link'

export const TopTags = () => {

    // TODO: Get top tags from backend (using Tanstack Query)
    const tags: ITag[] = [
        {
            id: "1",
            tagName: "Infrastructure"
        },
        {
            id: "2",
            tagName: "Taxation"
        },
        {
            id: "3",
            tagName: "PrimaryEducation"
        },
        {
            id: "4",
            tagName: "Unemployment"
        },
    ]

    return (
        <div className='bg-background border rounded-md p-4 flex flex-col gap-4'>
            <h2 className='font-semibold'>Top Tags</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link href={`/u?tag=${tag.tagName}`} key={tag.id}><TagBadge key={tag.id} label={`#${tag.tagName}`} /></Link>
                ))}

            </div>
        </div>
    )
}
