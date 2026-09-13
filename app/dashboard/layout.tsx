import { requireAuth } from '@/lib/auth-guard'
import React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();
    return (
        <div className='flex flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black h-screen'>
            {children}
        </div>
    )
}

export default AuthLayout