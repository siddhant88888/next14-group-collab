'use client';

import { useOrganizationList } from "@clerk/clerk-react";
import { Item } from "./item";
 
export const List = () => {
    const {userMemberships} = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    if (!userMemberships.data?.length) return null;
// if there is no data then the expression is false, then that ouput is negated using '!' at the beginning of the
// expression now the value of the expression is true and null is returned accordingly
// otherwise the complete expression is false and nothing happens

    // If the userMemberships object does not have a data property or if the data property is either null, undefined, or an empty array, then return null.
    return(
        <>
        <ul className="space-y-4">
            {userMemberships.data.map((mem) => (
               <Item 
                    key={mem.organization.id}
                    id={mem.organization.id}
                    name={mem.organization.name}
                    imageUrl={mem.organization.imageUrl}/>  
            ))}
        </ul>
        </>
    );
};