import {Blog, BlogState} from "./redux/types";
import {ThunkAction} from "redux-thunk";
import {Action} from "redux-action";
import {creaeteBlog} from "./redux/actions";

// export const thunkCreateBlog=(
//     blog:Blog
// ):ThunkAction<void, BlogState, null, Action<string>> => async dispatch => {
//     dispatch(
//         creaeteBlog({
//
//         })
//     );
//
//
//
// }