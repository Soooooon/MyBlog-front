import * as React from "react";
import axios from "axios";
import BlogSection from "./BlogSection";
import {Button} from "antd";
import BlogText from "./BlogCreateText";
import {RouteComponentProps} from "react-router-dom";
import browerHistory from "react-router";
import {createStore} from "redux";
import {connect, Provider} from "react-redux";
import "../less/home.css";
import {Blog, BlogState} from "../redux/types";
import {store} from "../index";
import {creaeteBlog} from "../redux/actions";

// const reducer=function(state:any,action:any){
//     return state;
// }


interface IProps extends RouteComponentProps{
}

interface IState {
    blogs:Blog[]
}
export default class BlogHome extends React.Component<IProps,IState>{

    constructor(props:IProps){
        super(props);
        this.state={
            blogs:[]
        };
        axios.defaults.baseURL='http://localhost:8080';
        this.handleClick=this.handleClick.bind(this);
    }

    componentDidMount(): void{
        // console.log(store.getState().blogs)
        axios.get('/myblog/list')
            .then(response=>{
                // store.dispatch(creaeteBlog(response.data))
                // console.log(store.getState().blogs)
                // console.log(response.data);
                // console.log(typeof response.data);
                // console.log(typeof store.getState().blogs[0]);
                this.setState(
                    {blogs:response.data}
                )
            })
    }


    render(){

        return(
            <div className={'home'}>

                <h1>欢迎来到我的博客</h1>
                {this.state.blogs.map(item=>
                    <BlogSection {...this.props} key={item.id} title={item.title} content={item.content} id={item.id}/>)}

                 <Button type={'primary'} icon={'download'} onClick={this.handleClick}>
                     写博客
                 </Button>
            </div>
        )
    }

    //进入编辑
    handleClick(){
        this.props.history.push('/write')
    }

}

