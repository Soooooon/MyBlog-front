import { createStore } from "redux";
import {blogReducer} from "./reducers";

export default function configureStore(){
    const store=createStore(
        blogReducer
    );

    return store;
}


