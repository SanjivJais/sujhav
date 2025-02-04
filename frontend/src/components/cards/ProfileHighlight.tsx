import React from 'react'
import { Separator } from '../ui/separator'
import { User } from '../User'

export const ProfileHighlight = () => {
    return (
        <div className='bg-accent rounded-md p-4 flex flex-col gap-3'>
            <User
                profileImage="https://github.com/shadcn.png"
                name='Sanjiv Jaiswal'
                username='sanjivjaiswal'
            />
            <Separator className='bg-muted-foreground/20 h-[0.5px]' />
            <div className="flex w-full justify-between">
                <div className="flex flex-col items-center gap-[1px]">
                    <div className="text-sm text-muted-foreground">Posts</div>
                    <div className="font-medium">632</div>
                </div>
                <div className="flex flex-col items-center gap-[1px]">
                    <div className="text-sm text-muted-foreground">Upvotes</div>
                    <div className="font-medium">520K</div>
                </div>
                <div className="flex flex-col items-center gap-[1px]">
                    <div className="text-sm text-muted-foreground">Level</div>
                    <div className="font-medium">21</div>
                </div>

            </div>
        </div>
    )
}
