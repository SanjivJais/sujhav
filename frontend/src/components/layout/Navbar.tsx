"use client"
import { Input } from "../ui/input"
import { ModeToggle } from "../ModeToggle"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CreatePost } from "../dialogs/CreatePost"

export function Navbar() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
        <header className="flex justify-center h-[68px] sticky top-0 bg-background z-50 w-full items-center shadow-sm dark:border-b">
            <div className="max-w-[1200px] w-full flex items-center justify-between px-4">
                <h1 className="text-2xl font-extrabold">SUJHAV<span className="text-primary font-bold text-4xl">.</span></h1>
                <Input placeholder="Search" className="max-w-[400px] w-[30vw] hidden md:block" />
                <div className="flex gap-3 items-center">
                    <Button onClick={() => setIsCreateOpen(true)} variant={"default"} className="rounded-full"><Plus /> Create</Button>
                    <ModeToggle />
                </div>
            </div>
            <CreatePost isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
        </header>
    )
}
