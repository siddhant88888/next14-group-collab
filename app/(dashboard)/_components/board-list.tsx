'use client';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { EmptyBoards } from "./empty-boards";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { BoardCard } from './board-card';
import { NewBoardButton } from './new-board-button';

interface BoardListProps {
    orgId: string;
    query: {
        search?: string;
        favorites?: string;
    }
}

export const BoardList = ({
    orgId,
    query,
}: BoardListProps) => {

    const data = useQuery(api.boards.get, {
        orgId,
        ...query, 
    }); // This will later be replaced by an api call, and has been replaced.


    if (data === undefined) {
        return(
            <div>
            <h2 className='text-3xl '>
                {query.favorites ? 'Favorite boards' : 'Team boards'}
                {/* if favorites is clicked on the say Favorite boards 
                else say Team boards, that is pretty neat right there */}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10'>
                <NewBoardButton orgId={orgId} disabled />
                <BoardCard.Skeleton />
                <BoardCard.Skeleton />  
                <BoardCard.Skeleton />
            </div>
            {/* If there is no data then convex automatically returns null
            But if convex returns that the data is undefined, then
             it is probably loading, that is why there is a div
             for loading */}
            </div>
            
        )
    }
    if (!data?.length && query.search) {  
        return (// If user searches for something that doesn't exist 
                <EmptySearch />
        )
    }

    if (!data?.length && query.favorites) {
        return (
            <EmptyFavorites />
        )
    }

    if (!data.length) {
        return (
            <EmptyBoards />
        )
    }
    return (
        <div>
            <h2 className='text-3xl '>
                {query.favorites ? 'Favorite boards' : 'Team boards'}
                {/* if favorites is clicked on the say Favorite boards 
                else say Team boards, that is pretty neat right there */}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10'>

                <NewBoardButton orgId={orgId}/> {/*new organizaiton*/}
                {data?.map((board) => ( 
                    <BoardCard 
                        key={board._id}
                        id={board._id}
                        title={board.title}
                        imageUrl={board.imageUrl}
                        authorId={board.authorId}
                        authorName={board.authorName}
                        createdAt={board._creationTime}
                        orgId={board.orgId}
                        isFavorite={board.isFavorite} // as of now this value is hard coded but later it will be dynamic
                    />
                ))}
            </div>
        </div>

    )
}