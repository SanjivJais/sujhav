import Link from 'next/link'
import React from 'react'

export const SideMenu = () => {
    const menu = [
        {
            name: "For you",
            href: "/u",
        },
        {
            name: "Hot Clusters",
            href: "#",
        },
        {
            name: "Business Opportunities",
            href: "#",
        },
        {
            name: "Government Solvables",
            href: "#",
        },
    ]
    return (
        <div className='bg-accent rounded-md p-4 flex flex-col items-center gap-3'>
            {menu.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className='text-muted-foreground hover:text-primary text-center w-fit'
                >
                    {item.name}
                </Link>
            ))}
        </div>
    )
}
