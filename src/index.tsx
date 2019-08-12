import React from "react";
import ReactDOM from "react-dom";
import CheckLogin from "./components/CheckLogin";
import BlogHome from "./containers/BlogHome";
import {BrowserRouter as Router,Route} from "react-router-dom";
import BlogText from "./containers/BlogCreateText";
import WrappedBlogCreateText from "./containers/BlogCreateText";
import {Provider} from "react-redux";
import configureStore from "./redux";
import * as path from "path";
import WrappedBlogModifyText from "./containers/BlogModifyText";
import BlogList from "./containers/BlogList";

export const store=configureStore();
// console.log(store.getState());
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path='/home' component={BlogHome}/>
            <Route path='/write' component={WrappedBlogCreateText}/>
            <Route path='/edit/:id' component={WrappedBlogModifyText}/>
            <Route path={'/list'} component={BlogList} />
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);

