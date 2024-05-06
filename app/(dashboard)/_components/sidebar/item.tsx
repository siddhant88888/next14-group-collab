'use client';

import Image from 'next/image';

import {
    useOrganization,
    useOrganizationList,
} from '@clerk/nextjs';

import { Hint } from "@/components/hint";
import { cn } from '@/lib/utils';
// used to dynamically style tailwind elements 

interface ItemProps {
    id: string;
    name: string;
    imageUrl: string;

};

export const Item = ({
    id,
    name,
    imageUrl,
}: ItemProps) => {
    const {organization} = useOrganization();
    // get the current organization 
    const {setActive} = useOrganizationList();

    const isActive = organization?.id==id;
    // to check if the current organization is the active organization 
    // if true then the opacity of the organization button will turned up to 100
    const onClick = () => {
        if (!setActive) return;
        // If setActive doesn't exist then it will be a falsy
        // !falsy = truthy, which means the function will return early
        // if setActive does exist then it will be a truthy
        // !truthy = falsy meaning, the code below will be executed
        setActive({organization: id});
    }
    return (
        <div className='aspect-square relative'>
            <Hint
                label= {name}
                side='right'
                align='center'
                sideOffset={18}
                >
            <Image
                fill
                alt={name}
                src={imageUrl}
                onClick={onClick}
                className={cn(
                    "rounded-md cursor-pointer opacity-50 hover:opacity-100 transition",
                    isActive && "opacity-100"
                    // if isActive is true then the item will appear selected (background will not shine through) 

                )}
                />
            </Hint>
        </div>
    )
}

