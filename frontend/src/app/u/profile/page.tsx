"use client"
import { ProfileHighlight } from '@/components/cards/ProfileHighlight'
import { Button } from '@/components/ui/button'
import { useUserProfile } from '@/hooks/useAuth'
import { useFetchPostsByUserId } from '@/hooks/usePost'
import { utcToLocal } from '@/lib/dateTime'
import { removeToken } from '@/lib/token'
import { format } from 'date-fns-tz'
import React from 'react'

const ProfilePage = () => {

    const logoutUser = () => {
        removeToken()
        window.location.reload()
    }

    const { data: user } = useUserProfile()
    const { data: userPosts } = useFetchPostsByUserId(user?.id || "")

    return (
        <div className='grid grid-cols-3 gap-6'>
            <div className="col-span-1 flex flex-col gap-3">
                <ProfileHighlight />
                <Button variant={"destructive"} className='' onClick={logoutUser}>Logout</Button>
            </div>

            <div className='col-span-2 flex flex-col gap-3'>
                <h2 className='text-lg font-semibold'>Your Posts</h2>
                <div className="">
                    {userPosts?.map((post) => (
                        <div key={post.id} className={`flex flex-col gap-2 py-3 ${post.id === userPosts[userPosts.length - 1].id ? '' : 'border-b'} border-dotted`}>
                            <div className='flex items-center gap-0.5'>
                                <div className='text-sm text-muted-foreground'>{format(utcToLocal(post.createdAt), "hh:mm aaa - d MMM")}</div>
                            </div>
                            <p className='text-[15px] text-neutral-900 dark:text-neutral-300'>{post.content}</p>
                            <div className="flex gap-2">
                                {post?.regions.map((region) => (
                                    <div key={region} className='text-xs text-muted-foreground bg-primary/20 px-2 py-0.5 rounded'>{region}</div>
                                ))}

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage