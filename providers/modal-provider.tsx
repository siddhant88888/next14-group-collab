'use client';
// Component marked 'use client' are still rendered server side 
// Only fact that this denotes is that it is a client side component

import { useEffect, useState } from 'react';

import { RenameModal } from '@/components/modals/rename-modal';

export const ModalProvider = () => {

    const [isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    })
    //useEffect can only be called once the rendering comes to the client side.
    // Only once the program gets to the client side, only then render the modals

    if(!isMounted) {
        return null;
    }
    // If not mounted then don't render any modals below

    // The useEffect and if condition are implemented to prevent hydration errors 
    return (
        <>
            <RenameModal />
        </>
    )
}