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


interface ViewClusterProps {
    clusterId: string
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const ViewCluster = ({ clusterId, isOpen, setIsOpen }: ViewClusterProps) => {

    const { data: cluster, isLoading: clusterLoading } = useFetchCluster(clusterId)
    const {data: posts, isLoading: postsLoading} = useFetchPostsByIds(cluster?.posts || [])
    

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
                            <DialogHeader className='space-y-2 p-4 border-b'>
                                <DialogTitle>{cluster?.topic}</DialogTitle>
                                <DialogDescription className=''>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="max-h-[70vh] min-h-[56vh] flex flex-col gap-5 overflow-y-auto px-4 pb-4">

                                <div className='border-b-2 border-dotted pb-4'>
                                    {cluster?.clusterSummary}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    {postsLoading ?
                                        <>
                                            <div className='min-h-60 flex items-center justify-center'><ScaleLoader color="#36d7b7" /></div>
                                        </>
                                        :
                                        <>
                                            {posts?.map((post) => (
                                                <div key={post.id} className='flex flex-col gap-2 border-b-2 border-dotted'>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='text-sm text-muted-foreground'>{post.user.username}</div>
                                                        <div className='text-sm text-muted-foreground'>{post.createdAt}</div>
                                                    </div>
                                                    <div className=''>{post.content}</div>
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
