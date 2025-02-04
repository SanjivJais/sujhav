import React from 'react'
import { Badge } from './ui/badge'

export const TagBadge = ({ label }: { label: string }) => {
    return (
        <div>
            <Badge variant={'outline'} className='text-sm hover:text-white bg-accent font-medium rounded-md py-1 px-3 hover:bg-primary border-none'>{label}</Badge>
        </div>
    )
}
