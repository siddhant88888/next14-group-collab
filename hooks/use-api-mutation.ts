import { useState } from 'react';

import { useMutation } from 'convex/react';

export const useApiMutation = (mutationFunction: any) => {
    const [pending, setPending] = useState(false); // false is the default value of useState
    const apiMutation = useMutation(mutationFunction);
// useApiMutation --> create ,   now apiMutation --> uses the mutation (create) we defined in board.tsx
    const mutate = (payload: any) => {
        setPending(true);
        return apiMutation(payload)
            .finally(() => setPending(false))
            .then((result) => {
                return result;
            })
            .catch ((error) => {
                throw error;
            });
    };
    return {
        mutate,
        pending,

    };
};