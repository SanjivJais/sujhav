"use client"
import { Button } from '@/components/ui/button'
import { removeToken } from '@/lib/token'
import React from 'react'

const page = () => {

    const logoutUser = () => {
        removeToken()
        window.location.reload()
    }

    return (
        <div>
            <h1>Profile</h1>
            <Button variant={"destructive"} className='' onClick={logoutUser}>Logout</Button>
        </div>
    )
}

export default page