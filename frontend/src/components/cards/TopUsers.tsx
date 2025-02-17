import React from 'react'
import { User } from '../User'

export const TopUsers = () => {

    const topUsers = [
        {
            name: "Sanjiv Jaiswal",
            username: "sanjivjaiswal",
            profileImage: "https://github.com/shadcn.png",
        },
        {
            name: "Aayush Manandhar",
            username: "aayushkoinbox",
            profileImage: "https://github.com/shadcn.png",
        },
        {
            name: "Yogesh Gurung",
            username: "yogeshgurung",
            profileImage: "https://github.com/shadcn.png",
        },
        {
            name: "Rajan Pudasaini",
            username: "rajanpudasaini",
            profileImage: "https://github.com/shadcn.png",
        },
    ]

    return (
        <div className='bg-accent rounded-md p-4 flex flex-col gap-4'>
            <h2 className='font-semibold'>Top Contributors</h2>
            {topUsers.map((user, index) => (
                <User
                    key={index}
                    profileImage={user.profileImage}
                    name={user.name}
                    username={user.username}
                />
            ))}
        </div>
    )
}
