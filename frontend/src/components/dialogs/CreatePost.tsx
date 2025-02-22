"use client";

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RegionCreateDropdown } from '../RegionCreateDropdown';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useAuth';
import { moderateText } from '@/services/moderateService';
import { getEmbedding } from '@/services/textEmbedding';
import { useCreatePost } from '@/hooks/usePost';


interface CreatePostProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const CreatePost = ({ isOpen, setIsOpen }: CreatePostProps) => {

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [isPostProcessing, setIsPostProcessing] = useState(false);
    const { data: user } = useUserProfile()
    const { mutate: createPost } = useCreatePost()


    const handlePostCreate = async () => {
        setIsPostProcessing(true);
        if (content.length > 10) {
            if (selectedRegions.length >= 1) {
                try {

                    if (!user) {
                        toast.error("Your account could not be fetched, please try again!");
                        return
                    }

                    const modResponse = await moderateText(content);
                    if (modResponse && modResponse.role === "assistant") {
                        if (JSON.parse(modResponse.content || "{}").status !== "unsafe") {
                            const embedResponse = await getEmbedding(content);
                            if (embedResponse && embedResponse.float) {

                                const postData = {
                                    content: content,
                                    embedding: embedResponse.float[0],
                                    regions: selectedRegions,
                                    user: {
                                        id: user.id,
                                        username: user.username
                                    }
                                }
                                createPost(postData, {
                                    onSuccess: () => {
                                        toast.success("Post created successfully!");
                                        setIsOpen(false);
                                    },
                                    onError: (error) => {
                                        toast.error("Post failed to upload!")
                                        console.log(error)
                                    }
                                })

                            } else {
                                toast.error("Post couldn't be processed :(")
                            }
                        } else {
                            toast.error("Your post seems to be inapproariate, please try again!");
                        }
                    } else {
                        toast.error("Post couldn't be processed :(")
                    }

                } catch (error) {
                    console.log(error);
                }

            } else {
                toast.error("Please select at least one region!");
            }
        } else {
            toast.error("Content should be at least 10 characters long");
        }

        setIsPostProcessing(false);
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='w-[90vw] max-w-[600px] p-0'>
                <DialogHeader className='space-y-2 p-4 border-b'>
                    <DialogTitle>Create post</DialogTitle>
                    <DialogDescription className=''>
                        Let entrepreneurs and concerned authorities know your thoughts!
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[50vh] flex flex-col gap-5 overflow-y-auto px-4 pb-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor='content' className='w-fit text-muted-foreground '>Content</Label>
                        <Textarea
                            id='content'
                            value={content}
                            placeholder='Have any suggestion, idea, or saw a problem anywhere? Write it down...'
                            className='w-full'
                            rows={6}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isPostProcessing}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className='w-fit text-muted-foreground '>Regional Context <span className='text-[12px]'>(up to 3)</span></Label>
                        <RegionCreateDropdown setSelectedRegions={setSelectedRegions} />
                    </div>
                </div>

                <DialogFooter className='p-4 pt-0'>
                    <Button onClick={() => setIsOpen(false)} variant={'ghost'}>Cancel</Button>
                    <Button disabled={isPostProcessing} onClick={handlePostCreate} variant={'default'}>{isPostProcessing ? "Processing..." : "Post"}</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>

    )
}
