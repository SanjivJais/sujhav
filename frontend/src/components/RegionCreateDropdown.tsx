"use client"

import { useEffect, useState } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

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
import { useFetchRegions } from "@/hooks/useRegion"
import { IRegion } from "@/types/region"
import { capitalizeString } from "@/utils/capitalizeString"
// import { toast } from "sonner"
// import { useUserProfile } from "@/hooks/useAuth"

interface RegionCreateProps {
    setSelectedRegions: (regions: string[]) => void;
}

export function RegionCreateDropdown({ setSelectedRegions }: RegionCreateProps) {
    const { data: regions } = useFetchRegions()
    // const { mutate: createRegion } = useCreateRegion()
    // const { data: user } = useUserProfile()

    const [open, setOpen] = useState(false)
    const [selRegions, setSelRegions] = useState<string[]>([])
    const [filteredRegions, setFilteredRegions] = useState<IRegion[]>([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (regions && regions?.length > 0) {
            const filtered = regions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .filter((region) => region.regionName.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredRegions(filtered);
        }
    }, [regions, inputValue]);

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

    // const handleCreateRegion = async () => {
    //     try {
    //         const regionName = inputValue.trim();
    //         if (regionName.length > 2) {
    //             if (!user) {
    //                 toast.error("Something went wrong, please try again!");
    //                 return;
    //             }
    //             createRegion({ createdBy: user.id, regionName },
    //                 {
    //                     onSuccess: async (response) => {
    //                         setSelRegions((prev) => {
    //                             const filtered = prev.filter((r) => r !== inputValue);
    //                             return [...filtered, response.regionName]; // Add only the new region
    //                         });
    //                         setInputValue("");
    //                     },
    //                     onError: () => {
    //                         toast.error("Region couldn't be created!");
    //                     },
    //                 }
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error creating region:", error);
    //     }
    // }

    // const handleCreateRegionClick = async () => {
    //     await handleCreateRegion(); // Ensure the region is created first
    // };

    useEffect(() => {
        setSelectedRegions(selRegions);
    }, [selRegions, setSelectedRegions]);

    // useEffect(() => {
    //     if (regions?.some((r) => r.regionName === inputValue)) {
    //         toggleRegionSelection(inputValue);
    //     }
    // }, [regions, inputValue]); // Runs only when `regions` update, avoiding extra renders

    // if (isRegionsLoading) return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {selRegions.length > 0
                        ? selRegions.join(", ") // Show selected regions
                        : "Search or create region..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        value={inputValue}
                        onValueChange={setInputValue}
                        placeholder="Search or create region..."
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
                            !filteredRegions.some((r) => r.regionName.toLowerCase() === inputValue.toLowerCase()) &&
                            selRegions.length < 3 && ( // Prevent adding more than 3 regions
                                <CommandItem
                                    // onSelect={handleCreateRegionClick}
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
