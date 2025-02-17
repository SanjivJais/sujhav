"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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


export function RegionCreateDropdown() {
    // const { data: regions, isLoading: isRegionsLoading } = useFetchRegions()

    const regions = [
        { id: "1", regionName: "Kathmandu" },
        { id: "2", regionName: "Lalitpur" },
        { id: "3", regionName: "Biratnagar" },
        { id: "4", regionName: "Pokhara" },
        { id: "5", regionName: "Bhaktapur" },
        { id: "6", regionName: "Chitwan" },
        { id: "7", regionName: "Dhading" },
        { id: "8", regionName: "Sindhuli" },
    ]

    const [open, setOpen] = React.useState(false)
    const [selectedRegion, setSelectedRegion] = React.useState<string>("")

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
                    {regions && selectedRegion
                        ? regions.find((region) => region.regionName === selectedRegion)?.regionName
                        : "Select region..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>


                        <CommandEmpty>No framework found.</CommandEmpty>

                        {regions && regions?.length > 0 && <CommandGroup>
                            {regions.map((region) => (
                                <CommandItem
                                    key={region.id}
                                    value={region.regionName}
                                    onSelect={(currentValue) => {
                                        setSelectedRegion(currentValue === selectedRegion ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {region.regionName}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedRegion === region.regionName ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
