import { v } from 'convex/values';
//  v is used to make sure that the data matches the expected type
import { query } from './_generated/server';

import { getAllOrThrow } from 'convex-helpers/server/relationships';

export const get = query({
    args: {
        orgId: v.string(),
        search: v.optional(v.string()),
        favorites: v.optional(v.string()),
        nigga: v.optional(v.string())
    }, 

    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();    //get user identity

        if (!identity) {      // If there is no user identity then print Unauthorized
            throw new Error('Unauthorized');
        }

        if (args.favorites) {
            const favoriteBoards = await ctx.db
            .query('userFavorites')
            .withIndex('by_user_org', (q) => 
                q
                    .eq('userId', identity.subject)
                    .eq('orgId', args.orgId)
            )
            .order('desc')
            .collect();

            const ids = favoriteBoards.map((b) => b.boardId);

            const boards = await getAllOrThrow(ctx.db, ids);
            // using the ids find and fetch into boards, all the boards that match with the provided ids

            return boards.map((board) => ({
                // This code is adding another property isFavorite to the return value of get function
                // is called with the 'favorites' argument. 
                ...board,
                isFavorite: true,  // The origin of isFavorite
            }));
        }


        const title = args.search as string;
        let boards = [];

        if (title) {
            boards = await ctx.db
            .query('boards')
            .withSearchIndex('search_title', (q) =>
            q
                .search('title', title)
                .eq('orgId', args.orgId) 
        )
        .collect();
            
        } 
        else { 

        boards = await ctx.db  
        .query('boards')
        .withIndex('by_org', (q) => q.eq('orgId', args.orgId)) 
        .order('desc') // duh
        .collect();

        
        
    
    }

        // So these successive .xyz then .abc --> This is called method chaining, here the result of the preceeding 
        // method is passed as input to the next succeeding method 

        const boardsWithFavoriteRelation = boards.map((board) => {
            return ctx.db
                .query('userFavorites')             
                .withIndex('by_user_board', (q) =>
            q
                .eq('userId', identity.subject)  //checks in the useFavorites db if the user's userId||identity.subject
                                                // that is logged in matches the userId from the userFavorites table
                .eq('boardId', board._id)       // It also checks if the current board's id matches any boardId from the useFavorites table
            )
                .unique()
                .then((favorite) => {
                    return {
                        ...board,
                        isFavorite: !!favorite, // !! converts favorite from an object type to a boolean type
                    };
                });
        });

        const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelation)
        return boardsWithFavoriteBoolean;
    }
})