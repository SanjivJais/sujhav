"use client"
import React, { useEffect, useState } from 'react'
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
import { Button } from './ui/button';
import { IRegion } from '@/types/region';
import { useCreateRegion, useFetchRegions } from '@/hooks/useRegion';
import { useUserProfile } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RegionCreateProps {
    setSelectedRegions: (regions: string[]) => void;
}

export const RegionCreateDropdown = () => {

    const [filteredRegions, setFilteredRegions] = useState<IRegion[]>([]);
    const [isRegionOpen, setIsRegionOpen] = useState(false)
    const [selRegions, setSelRegions] = useState<string[]>([]);

    const [inputValue, setInputValue] = useState("");


    return (
        <Popover open={isRegionOpen} onOpenChange={setIsRegionOpen}>
            <PopoverTrigger id='region' asChild>
                <Button variant="outline" role="combobox" aria-expanded={isRegionOpen} className={`font-normal justify-between text-muted-foreground`}>
                    {selRegions.length > 0
                        ? selRegions.join(", ") // Show selected regions
                        : "Search or create region..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="lg:w-[568px] md:w-[400px] w-[300px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or create region..."
                    />
                    <CommandList className='max-h-[170px] overflow-y-auto'>
                        {filteredRegions && filteredRegions.length > 0 ? (
                            <CommandGroup>
                                {filteredRegions.map((region) => (
                                    <CommandItem
                                        key={region.id}
                                        value={region.regionName}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selRegions.includes(region.regionName) ? "opacity-100" : "opacity-0"
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
                            selRegions.length < 3 && ( // Prevent adding more than 3 regions
                                <CommandItem
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
    )
}
