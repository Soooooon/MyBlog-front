import {BlogActionTyps, BlogState} from "./types";

const initialState:BlogState={
    blogs:[]
}

export function blogReducer(
    state = initialState,
    action:BlogActionTyps
):BlogState {
    switch (action.type) {
        case "CREATE_BLOG":
            return {
                blogs:[...state.blogs,action.payload]
            }
        case "DELETE_BLOG":
            return {
                blogs:state.blogs.filter(
                    blog=>blog.id!==action.meta.id
                )
            }
        default:
            return state
    }
}