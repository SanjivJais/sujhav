import { Input } from "../ui/input"
import { ModeToggle } from "../ModeToggle"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"

export function Navbar() {
    return (
        <header className="flex justify-center h-[68px] sticky top-0 bg-background z-50 w-full items-center shadow-sm dark:border-b">
            <div className="max-w-[1200px] w-full flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">LOGO</h1>
                <Input placeholder="Search" className="max-w-[400px] w-[30vw]" />
                <div className="flex gap-3 items-center">
                    <Button variant={"default"} className="rounded-full"><Plus/> Create</Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
