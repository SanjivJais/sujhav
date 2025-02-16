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
// import { moderateText } from '@/services/moderateService';
import { RegionCreateDropdown } from '../RegionCreateDropdown';
import { toast } from 'sonner';
// import { getEmbedding } from '@/services/textEmbedding';
// import { ComboboxDemo } from '../Combobox';


interface CreatePostProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const CreatePost = ({ isOpen, setIsOpen }: CreatePostProps) => {

    // const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [isPostProcessing, setIsPostProcessing] = useState(false);



    const handlePostCreate = async () => {
        setIsPostProcessing(true);
        if (content.length > 10) {
            try {
                // const response = await moderateText(content);
                // if (response && response.role === "assistant") {
                //     toast.info(`Moderation result: ${response.content}`);
                // } else {
                //     toast.error("Post couldn't be processed :(")
                // }

                // const response = await getEmbedding(content);
                // if (response) {
                //     console.log(response.float);
                //     toast.success("Post created successfully!");
                // } else {
                //     toast.error("Post couldn't be processed :(")
                // }

                // toast.success("Post created successfully!");

            } catch (error) {
                console.log(error);
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
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor='region' className='w-fit text-muted-foreground '>Regional Context <span className='text-[12px]'>(up to 3)</span></Label>
                        <RegionCreateDropdown/>

                        {/* <ComboboxDemo /> */}

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
