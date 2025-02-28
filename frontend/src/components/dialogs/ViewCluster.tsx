"use client";

import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useFetchCluster } from '@/hooks/useCluster';
import { ScaleLoader } from 'react-spinners';
import { useFetchPostsByIds } from '@/hooks/usePost';
import { format } from 'date-fns-tz';
import { utcToLocal } from '@/lib/dateTime';
import { Box, Dot } from 'lucide-react';


interface ViewClusterProps {
    clusterId: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const ViewCluster = ({ clusterId, isOpen, setIsOpen }: ViewClusterProps) => {

    const { data: cluster, isLoading: clusterLoading } = useFetchCluster(clusterId)
    const { data: posts, isLoading: postsLoading } = useFetchPostsByIds(cluster?.posts || [])


    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='w-[90vw] max-w-[600px] p-0'>
                    {clusterLoading ?
                        <>
                            <div className='min-h-60 flex items-center justify-center'><ScaleLoader color="#36d7b7" /></div>
                        </>
                        :
                        <>
                            <DialogHeader className='space-y-1 px-4 py-3 border-b'>
                                <DialogTitle className='font-medium'>Topic</DialogTitle>
                                <DialogDescription className='text-xs text-muted-foreground'>Updated at: {cluster && format(utcToLocal(cluster?.updatedAt), "hh:mm aaa - d MMM")}</DialogDescription>
                            </DialogHeader>

                            <div className="max-h-[70vh] min-h-[56vh] flex flex-col gap-5 overflow-y-auto px-4 pb-4">
                                <div className="flex flex-col border-b pb-2">
                                    <div className='text-lg font-medium'>{cluster?.topic}</div>
                                    <div className='text-[15px] text-neutral-900 dark:text-neutral-300 mt-2'>{cluster?.clusterSummary}</div>

                                    <div className="flex flex-col gap-0 5 mt-2">
                                        {/* <div className='text-xs text-muted-foreground my-2'>Regional Context</div> */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {cluster?.regions.map((region) => (
                                                    <div key={region} className='text-sm text-muted-foreground bg-primary/20 px-2 py-1 rounded'>{region}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            <div title='Posts' className="flex items-center gap-1 group hover:cursor-pointer hover:text-primary">
                                                <Box className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                                {cluster?.posts.length}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-4 pl-4'>
                                    {postsLoading ?
                                        <>
                                            <div className='min-h-60 flex items-center justify-center'><ScaleLoader color="#36d7b7" /></div>
                                        </>
                                        :
                                        <>
                                            {posts?.map((post) => (
                                                <div key={post.id} className={`flex flex-col gap-2 ${post.id === posts[posts.length - 1].id ? '' : 'border-b'} border-dotted pb-3`}>
                                                    <div className='flex items-center gap-0.5'>
                                                        <div className='text-sm text-muted-foreground'>By @{post.user.username}</div>
                                                        <Dot className='h-4 w-4 text-muted-foreground' />
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
                                        </>
                                    }
                                </div>

                            </div>
                        </>
                    }

                </DialogContent>
            </Dialog>
        </div>
    )
}
