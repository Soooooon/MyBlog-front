import {Blog, BlogActionTyps, CREATE_BLOG, DELETE_BLOG} from "./types";

export function creaeteBlog(newBlog: Blog):BlogActionTyps {
    return {
        type:CREATE_BLOG,
        payload:newBlog,
    }
}

export function deleteBlog(id: number):BlogActionTyps {
    return {
        type:DELETE_BLOG,
        meta:{
            id
        }
    }
}