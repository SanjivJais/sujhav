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
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/popoverDialog"

import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { IRegion } from '@/types/region';

const regions: IRegion[] = [
    { id: "1", createdBy: "1", regionName: "Kathmandu", createdAt: "2023-10-02T10:15:00Z" },
    { id: "2", createdBy: "2", regionName: "Pokhara", createdAt: "2023-10-02T10:15:00Z" },
    { id: "3", createdBy: "3", regionName: "Bhaktapur", createdAt: "2023-10-02T10:15:00Z" },
    { id: "4", createdBy: "4", regionName: "Lalitpur", createdAt: "2023-10-02T10:15:00Z" },
    { id: "5", createdBy: "5", regionName: "Biratnagar", createdAt: "2023-10-02T10:15:00Z" },
];


interface CreatePostProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const CreatePost = ({ isOpen, setIsOpen }: CreatePostProps) => {

    const [isRegionOpen, setIsRegionOpen] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const [inputValue, setInputValue] = useState("");

    const filteredRegions = regions.filter((region) =>
        region.regionName.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handlePostCreate = async () => {
        return
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
                        <Label htmlFor='content' className='w-fit'>Content</Label>
                        <Textarea
                            id='content'
                            placeholder='Have any suggestion, idea, or saw a problem anywhere? Write it down...'
                            className='w-full text-sm text-muted-foreground'
                            rows={7}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor='region' className='w-fit'>Regional Context</Label>
                        <Popover open={isRegionOpen} onOpenChange={setIsRegionOpen}>
                            <PopoverTrigger id='region' asChild>
                                <Button variant="outline" role="combobox" aria-expanded={isRegionOpen} className={`font-normal justify-between text-muted-foreground`}>
                                    {selectedRegion || "Search or create region..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="lg:w-[568px] md:w-[400px] w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        value={inputValue}
                                        onValueChange={setInputValue}
                                        placeholder="Search or create region..."
                                    />
                                    <CommandList>
                                        {filteredRegions.length > 0 ? (
                                            <CommandGroup>
                                                {filteredRegions.map((region) => (
                                                    <CommandItem
                                                        key={region.id}
                                                        value={region.regionName}
                                                        onSelect={() => {
                                                            setSelectedRegion(region.regionName);
                                                            setInputValue(region.regionName); // Update input with selected region
                                                            setIsRegionOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedRegion === region.regionName ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {region.regionName}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ) : (
                                            <CommandEmpty>No region found.</CommandEmpty>
                                        )}

                                        {inputValue &&
                                            !filteredRegions.some(
                                                (r) => r.regionName.toLowerCase() === inputValue.toLowerCase()
                                            ) && (
                                                <CommandItem
                                                    onSelect={() => {
                                                        setSelectedRegion(inputValue);
                                                        setInputValue(inputValue); // Set input value to searched region
                                                        setIsRegionOpen(false);
                                                    }}
                                                    className='cursor-pointer'
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Create &quot;{inputValue}&quot;
                                                </CommandItem>
                                            )}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                    </div>

                </div>

                <DialogFooter className='p-4 pt-0'>
                    <Button onClick={() => setIsOpen(false)} variant={'ghost'}>Cancel</Button>
                    <Button onClick={handlePostCreate} variant={'default'}>Post</Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>

    )
}
