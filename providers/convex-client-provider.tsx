'use client';

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import {
    AuthLoading, 
    Authenticated,
    ConvexReactClient,
} from 'convex/react';
import {Loading} from "@/components/auth/loading";

// This will protect all of our app with authentication 
interface ConvexClientProviderProps {
    children: React.ReactNode;
};

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
// '!' is used to ensure that NEXT_PUBLIC_CONVEX_URL is not empty 

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
    children,
}: ConvexClientProviderProps) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                <AuthLoading>
                    <Loading />
                </AuthLoading>
                
                
                <Authenticated>
                    {children}
                </Authenticated>
                
                

                
            </ConvexProviderWithClerk>
          
        </ClerkProvider>
    )
}


