"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { useCreateRegion, useFetchRegions } from "@/hooks/useRegion"
import { IRegion } from "@/types/region"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useUserProfile } from "@/hooks/useAuth"

interface RegionCreateProps {
    setSelectedRegions: (regions: string[]) => void;
}

export function RegionCreateDropdown({ setSelectedRegions }: RegionCreateProps) {
    const { data: regions = [] } = useFetchRegions()
    const { mutate: createRegion } = useCreateRegion()
    const { data: user } = useUserProfile()

    const [open, setOpen] = useState(false)
    const [selRegions, setSelRegions] = useState<string[]>([])
    const [filteredRegions, setFilteredRegions] = useState<IRegion[]>([]);
    const [inputValue, setInputValue] = useState("");
    const queryClient = useQueryClient(); // Get the query client

    useEffect(() => {
        if (regions && regions?.length > 0) {
            const filtered = regions
                ?.filter(region => region && region.regionName) // Ensure valid region objects
                ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                ?.filter((region) => region.regionName.toLowerCase().includes(inputValue.toLowerCase())) || [];
            setFilteredRegions(filtered);
        } else {
            setFilteredRegions([]); // Ensure it's always an array
        }
    }, [regions, inputValue]);

    const trimmedInput = inputValue.trim().toLowerCase();

    // Check if input exactly matches any region
    const isExactMatch = filteredRegions && filteredRegions.some(
        (r) => r.regionName.toLowerCase() === trimmedInput
    );

    const toggleRegionSelection = async (regionName: string) => {
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

    const handleCreateRegion = () => {
        try {
            const regionName = inputValue.trim();
            if (regionName.length > 2) {

                if (!user) {
                    toast.error("Your account could not be fetched, please try again!");
                    return
                }

                // Optimistically update the cache
                queryClient.setQueryData(['regions'], (oldData: IRegion[]) => {
                    return [...oldData, { regionName }];
                });


                createRegion({ createdBy: user?.id, regionName },
                    {
                        onSuccess: async (response) => {
                            // Invalidate the 'regions' query to trigger a refetch
                            await queryClient.invalidateQueries({ queryKey: ['regions'] });

                            setSelRegions((prev) => {
                                const filtered = prev.filter((r) => r !== inputValue);
                                return [...filtered, response.regionName]; // Add only the new region
                            });
                            setInputValue("");
                        },
                        onError: () => {
                            // Rollback the optimistic update on error
                            queryClient.setQueryData(['regions'], (oldData: IRegion[]) => {
                                return oldData.filter((r) => r.regionName !== regionName);
                            });
                            toast.error("Region could not be created!");
                        },
                    }
                );
            } else {
                toast.error("Region name should be at least 3 characters long");
            }
        } catch (error) {
            console.error("Error creating region:", error);
        }
    }

    useEffect(() => {
        setSelectedRegions(selRegions);
    }, [selRegions, setSelectedRegions]);


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selRegions.length > 0
                        ? selRegions.join(", ") // Show selected regions
                        : "Search or create region..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[568px] p-0">
                <Command className="relative">
                    <CommandInput
                        value={inputValue}
                        onValueChange={setInputValue}
                        placeholder="Search or create region..."
                    />

                    {trimmedInput.length > 0 && !isExactMatch && <PlusIcon
                        onClick={handleCreateRegion}
                        className={cn(
                            "absolute right-2 top-2 cursor-pointer bg-background p-[6px] h-7 w-7 rounded-md",
                        )}
                    />}

                    <CommandList className='max-h-[170px] overflow-y-auto'>
                        {filteredRegions && filteredRegions.length > 0 ? (
                            <CommandGroup>
                                {filteredRegions?.map((region) => (
                                    region &&
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
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
