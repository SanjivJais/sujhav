import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

interface UserProps {
    name: string
    username: string
    profileImage: string
}

export const User = ({name, username, profileImage}: UserProps) => {

    // function to get first letters of name
    function getInitials(name: string) {
        const initials = name.match(/\b\w/g) || [];
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    }

    return (
        <div>
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={profileImage} alt="@shadcn" />
                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-[1px]">
                    <div className="font-medium text-[15px]">{name}</div>
                    <div className="text-[13px] text-muted-foreground">@{username}</div>
                </div>
            </div>
        </div>
    )
}
