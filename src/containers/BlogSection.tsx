import * as React from "react";
import BlogItem from "./BlogItem";
import {Button} from "antd";
import axios from "axios";
import {RouteComponentProps} from "react-router-dom";
import "../less/section.css";
import {store} from "../index";
import {DELETE_BLOG} from "../redux/types";
import {deleteBlog} from "../redux/actions";


interface IProps extends RouteComponentProps{
    id:number;
    title:string;
    content:string;
}

interface IState {

}
// 这里添加交互的按钮
export default class BlogSection extends React.Component<IProps,IState>{
    constructor(props:IProps) {
        super(props);
        this.state={};
    }

    render(){
        return(
            <div className={'section'}>
                <BlogItem id={this.props.id} title={this.props.title} content={this.props.content}/>
                <Button type="primary" onClick={()=>this.modify()}>编辑</Button>
                <Button type="danger" onClick={()=>this.delete()}>删除</Button>
            </div>

        );
    }
    // 点击删除按钮
    delete(){
        axios.defaults.baseURL='http://localhost:8080';
        const url='/myblog/delete/'+this.props.id;
        axios.get(url)
            .then(response=>{
                console.log(response.data);
            })

        window.location.reload();
        // store.dispatch(deleteBlog(this.props.id))
        // this.props.history.push('/home')
    }

    modify(){
        let url='/modify/'+this.props.id;
        console.log(url);
        this.props.history.push(url);
    }



}