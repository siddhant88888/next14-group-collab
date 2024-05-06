import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const images = [
    '/placeholders/1.svg',
    '/placeholders/2.svg',
    '/placeholders/3.svg',
    '/placeholders/4.svg',
    '/placeholders/5.svg',
    '/placeholders/6.svg',
    '/placeholders/7.svg',
    '/placeholders/8.svg',
    '/placeholders/9.svg',
    '/placeholders/10.svg'
];

export const create = mutation({
    args: {
        orgId: v.string(),          // This is the input that will be passed to convex for mutation
        title: v.string(),

    },

    handler: async(ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
                
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];
        console.log(randomImage);
        const board = await ctx.db.insert('boards', {  // 'board' is an individual value that is inserted into boards table
            title: args.title,  // This means add what is passed in args.title(front-end) from the front end to the database 
                                // column named title(backend)
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            // authorName --> string name--> string | undefined
            // putting the "! " point tells ts to treat name as a 
            // non-null/non-undefined variable
            imageUrl: randomImage,
        });

        return board;
    }
})

export const remove = mutation({
    args: {
        id: v.id('boards')  //id = id is a column from boards schema
    },

    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error('Unauthorized')
        }
        const userId = identity.subject;

        const existingFavorite = await ctx.db
        .query('userFavorites')
        .withIndex("by_user_board", (q) => 
        q
            .eq('userId', userId)
            .eq('boardId', args.id)    
        )
        .unique();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id);
        }

        await ctx.db.delete(args.id);
        
    }
})

export const update = mutation({
    args: {
        id: v.id('boards'),  // boards is the name of the convex database that is to be updated.
        title: v.string()
    },

    handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized')
        }
        const title = args.title.trim();
        // trim is used to get rid of any white spaces from the beginnning
        //and the end of the users input.
        if (!title) {
            throw new Error('Title is required')
        }

        if (title.length> 60) {
            throw new Error('Title cannot be longer than 60 characters')
        }

        const board = await ctx.db.patch(args.id,{
            title: args.title,
        })

        return board;  
    }
})

export const favorite = mutation({
    args: {
        id: v.id('boards'),
        orgId: v.string()
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error('Board not found');
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db 
        .query('userFavorites')
        .withIndex('by_user_board', (q) => 
            q
                .eq('userId', userId)
                .eq('boardId', board._id)
        )
        .unique();

        if(existingFavorite) {
            throw new Error('Board already favorited')
        }

        await ctx.db.insert('userFavorites', {
            userId, 
            boardId: board._id,
            orgId: args.orgId,

        });

        return board;
    }
})


export const unfavorite = mutation({
    args: {
        id: v.id('boards')
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error('Board not found');
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db 
        .query('userFavorites')
        .withIndex('by_user_board', (q) => 
            q
                .eq('userId', userId)
                .eq('boardId', board._id)
        )
        .unique();

        if(!existingFavorite) {
            throw new Error('Favorited board not found')
        }

        await ctx.db.delete(existingFavorite._id)

        

        return board;
    }
})

export const get = query({ 
    args: {id: v.id('boards')},
    
    handler: async (ctx, args) => {
        const board = ctx.db.get(args.id);
        return board;
    }
})
