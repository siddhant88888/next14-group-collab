'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Overlay } from './overlay';

import { useAuth } from '@clerk/nextjs';
import { Actions } from '@/components/actions';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';

import { Footer } from './footer';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface BoardCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createdAt: number;
    imageUrl: string;
    orgId: string;
    isFavorite: boolean;
};

export const BoardCard = ({
    id,
    title,
    authorName,
    authorId,
    createdAt,
    imageUrl,
    orgId,
    isFavorite
}: BoardCardProps) => {
    const {userId} = useAuth();

    const authorLabel = userId === authorId ? 'You' : authorName; // Display you if it's your board and the author's name if it's somebody else
    const createdAtLabel = formatDistanceToNow(createdAt, {
        addSuffix: true, 
    });

    const { 
        mutate: onFavorite,            // mutate and pending are destructured from useApiMutation and renamed to
        pending: pendingFavorite       // onFavorite and pendingFavorite 
     } = useApiMutation(api.board.favorite);

    const { 
        mutate: onUnFavorite,
        pending: pendingUnFavorite
    } = useApiMutation(api.board.unfavorite);

    const toggleFavorite = () => {
        if (isFavorite) {
            onUnFavorite( {id} )
                .catch(() => toast.error('Failed to unfavorite'))
        } else {
            onFavorite({id, orgId})
            .catch(() => toast.error('Failed to favorite'))
        }
    };
    

    return (
        <Link href={`/board/${id}`}>
            <div className='group aspect-[100/127] border rounded-lg
            flex flex-col justify-between overflow-hidden'>  
                {/* flex-col makes it so that all the elements inside the board card are arranged one below the other and in a single line  */}
                <div className='relative flex-1 bg-amber-50'>
                  <Image 
                    src={imageUrl}
                    alt={title}
                    fill 
                    className='object-fit'
                    />  
                  <Overlay />
                  <Actions id={id} title={title} side='right'>
                    <button
                    className='absolute top-1 right-1 opacity-0
                    group-hover:opacity-100 transition-opacity
                    px-3 py-2 outline-none'
                    >
                        <MoreHorizontal
                        className='text-white opacity-75 
                        hover:opacity-100 transition-opacity'
                        />
                        {/* When a custom element like actions here has a prop called children, then you add in the element like <a></a> 
                        instead of <a />. Inside <a>'here'</a> there has to be something, ui element, text, etc, but can't be empty 
                        because in actions props we defined a parameter called children. */}
                    </button>
                  </Actions>
                </div>
                <Footer 
                    isFavorite = {isFavorite}
                    title = {title}
                    authorLabel = {authorLabel}
                    createdAtLabel = {createdAtLabel}
                    onClick = {toggleFavorite} // toggle btw favoriting and unfavoriting
                    disabled = {pendingFavorite || pendingUnFavorite}
                />
            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className='aspect-[100/127] rounded-lg
             overflow-hidden'> 
             <Skeleton className='h-full w-full' />

        </div>
    )
}