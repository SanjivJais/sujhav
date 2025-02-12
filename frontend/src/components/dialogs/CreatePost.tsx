"use client";

import React, { useEffect, useState } from 'react'
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
import { capitalizeString } from '@/utils/capitalizeString'
import { useCreateRegion, useFetchRegions } from '@/hooks/useRegion';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { IRegion } from '@/types/region';


interface CreatePostProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export const CreatePost = ({ isOpen, setIsOpen }: CreatePostProps) => {

    const { data: regions } = useFetchRegions();
    const regionMutate = useCreateRegion();
    const { data: user } = useUserProfile()
    const queryClient = useQueryClient();

    const [isRegionOpen, setIsRegionOpen] = useState(false)
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [content, setContent] = useState('');

    const toggleRegionSelection = async (regionName: string) => {
        setSelectedRegions((prev) => {
            if (prev.includes(regionName)) {
                // Remove if already selected
                return prev.filter((r) => r !== regionName);
            } else {
                // Add if less than 3 regions selected
                return prev.length < 3 ? [...prev, regionName] : prev;
            }
        });
    };

    const [inputValue, setInputValue] = useState("");

    const filteredRegions = regions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).filter((region) =>
        region.regionName.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setInputValue("");
            setSelectedRegions([]);
            setContent("");
        }
    }, [isOpen]);

    const handleCreateRegion = async () => {
        try {
            const regionName = inputValue.trim();
            if (regionName.length > 2) {
                if (!user) {
                    toast.error("Something went wrong, please try again!");
                    return;
                }

                // Create the region via API
                const response = await regionMutate.mutateAsync({ createdBy: user.id, regionName });

                // ✅ Update TanStack Query cache immediately
                queryClient.setQueryData(["regions"], (oldRegions: IRegion[] = []) => [...oldRegions, response]);

                // Update selected regions, removing inputValue if it was there
                setSelectedRegions((prev) => {
                    const filtered = prev.filter((r) => r !== inputValue);
                    return [...filtered, response.regionName]; // Add only the new region
                });

                // Clear input field
                setInputValue("");
            } else {
                toast.error("Region name must contain at least 3 letters");
            }
        } catch (error) {
            console.error("Error creating region:", error);
        }
    };

    const handlePostCreate = async () => {
        console.log(content, selectedRegions);
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
                            value={content}
                            placeholder='Have any suggestion, idea, or saw a problem anywhere? Write it down...'
                            className='w-full text-sm text-muted-foreground'
                            rows={6}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor='region' className='w-fit'>Regional Context</Label>
                        <Popover open={isRegionOpen} onOpenChange={setIsRegionOpen}>
                            <PopoverTrigger id='region' asChild>
                                <div className="flex flex-col gap-1">
                                    <Button variant="outline" role="combobox" aria-expanded={isRegionOpen} className={`font-normal justify-between text-muted-foreground`}>
                                        {selectedRegions.length > 0
                                            ? selectedRegions.join(", ") // Show selected regions
                                            : "Search or create region..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    <p className='text-muted-foreground text-[12px] ml-1'>Select up to 3 regions</p>
                                </div>

                            </PopoverTrigger>
                            <PopoverContent className="lg:w-[568px] md:w-[400px] w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        value={inputValue}
                                        onValueChange={setInputValue}
                                        placeholder="Search or create region..."
                                    />
                                    <CommandList className='max-h-[150px] overflow-y-auto'>
                                        {filteredRegions && filteredRegions.length > 0 ? (
                                            <CommandGroup>
                                                {filteredRegions.map((region) => (
                                                    <CommandItem
                                                        key={region.id}
                                                        value={region.regionName}
                                                        onSelect={() => toggleRegionSelection(region.regionName)}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedRegions.includes(region.regionName) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {region.regionName}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ) : (
                                            <CommandEmpty>No region found.</CommandEmpty>
                                        )}

                                        {inputValue && filteredRegions &&
                                            !filteredRegions.some((r) => r.regionName.toLowerCase() === inputValue.toLowerCase()) &&
                                            selectedRegions.length < 3 && ( // Prevent adding more than 3 regions
                                                <CommandItem
                                                    onSelect={() => {
                                                        toggleRegionSelection(inputValue);
                                                        handleCreateRegion();
                                                    }}
                                                    className='cursor-pointer'
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Create &quot;{capitalizeString(inputValue)}&quot;
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
