"use client"
import React from 'react'
import { Separator } from '../ui/separator'
import { User } from '../User'
import { useUserProfile } from '@/hooks/useAuth'
import { toast } from 'sonner'
import Link from 'next/link'

export const ProfileHighlight = () => {
    const { data: user, isError } = useUserProfile();

    if (isError) {
        toast.error("Something went wrong");
    }

    return (
        <div className='bg-accent rounded-md p-4 flex flex-col gap-3'>
            <Link href="/u/profile">
                <User
                    profileImage="https://github.com/shadcn.png"
                    name={user?.displayName || user?.username || '...'}
                    username={user?.username || '...'}
                />
            </Link>
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
