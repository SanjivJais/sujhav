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
import { toast } from 'sonner';

interface RegionCreateProps {
    setSelectedRegions: (regions: string[]) => void;
}

export const RegionCreateDropdown = ({ setSelectedRegions }: RegionCreateProps) => {
    const { data: regions } = useFetchRegions();
    const { mutate: createRegion } = useCreateRegion()
    const { data: user } = useUserProfile();


    const [filteredRegions, setFilteredRegions] = useState<IRegion[]>([]);
    const [isRegionOpen, setIsRegionOpen] = useState(false)
    const [selRegions, setSelRegions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");



    useEffect(() => {
        if (regions && regions?.length > 0) {
            const filtered = regions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .filter((region) => region.regionName.toLowerCase().includes(inputValue.toLowerCase()));

            setFilteredRegions(filtered);
        }
    }, [regions, inputValue]);

    // ===============================================//

    const toggleRegionSelection = (regionName: string) => {
        setSelRegions((prev) => {
            if (prev.includes(regionName)) {
                // Remove if already selected
                return prev.filter((r) => r !== regionName);
            } else {
                // Add if less than 3 regions selected
                return prev.length < 3 ? [...prev, regionName] : prev;
            }
        });
    };

    // ===============================================//

    useEffect(() => {
        setSelectedRegions(selRegions);
    }, [selRegions, setSelectedRegions])

    // ===============================================//

    const handleCreateRegion = async () => {
        try {
            const regionName = inputValue.trim();
            if (regionName.length > 2) {
                if (!user) {
                    toast.error("Something went wrong, please try again!");
                    return;
                }

                createRegion({ createdBy: user.id, regionName },
                    {
                        onSuccess: async (response) => {
                            setSelRegions((prev) => {
                                const filtered = prev.filter((r) => r !== inputValue);
                                return [...filtered, response.regionName]; // Add only the new region
                            });
                            setInputValue("");
                        },
                        onError: () => {
                            toast.error("Region couldn't be created!");
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Error creating region:", error);
        }
    }


    const handleCreateRegionClick = async () => {
        await handleCreateRegion(); // Ensure the region is created first
        toggleRegionSelection(inputValue);
    };


    // ===============================================//




    return (
        <Popover open={isRegionOpen} onOpenChange={setIsRegionOpen}>
            <PopoverTrigger id='region' asChild>
                <Button variant="outline" role="combobox" aria-expanded={isRegionOpen} className={`font-normal justify-between ${selRegions.length > 0 ? "" : "text-muted-foreground"}`}>
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
                        value={inputValue || ""}
                        onValueChange={(value) => {
                            setInputValue(value)
                        }}
                    />
                    <CommandList className='max-h-[170px] overflow-y-auto'>
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
                            !filteredRegions.some((r) => r.regionName.trim().toLowerCase() === inputValue.trim().toLowerCase()) &&
                            selRegions.length < 3 && ( // Prevent adding more than 3 regions
                                <CommandItem
                                    className='cursor-pointer'
                                    onSelect={handleCreateRegionClick}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create &quot;{capitalizeString(inputValue)}&quot;
                                </CommandItem>
                            )
                        }
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
