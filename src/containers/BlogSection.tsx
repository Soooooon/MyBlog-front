import * as React from "react";
import BlogItem from "./BlogItem";
import {Button} from "antd";
import axios from "axios";
import {RouteComponentProps} from "react-router-dom";
import "../less/section.less";
import {store} from "../index";
import {DELETE_BLOG} from "../redux/types";
import {deleteBlog} from "../redux/actions";
import Article from "../entity/Article";


interface IProps extends RouteComponentProps{
    id:number;
    title:string;
    content:string;
    onChange:()=>void
}

interface IState {

}
// 这里添加交互的按钮
export default class BlogSection extends React.Component<IProps,IState>{


    article:Article=new Article();

    constructor(props:IProps) {
        super(props);
        this.state={};

        this.article.assign(this.props);

    }

    render(){
        return(
            <div className={'section'}>
                <BlogItem id={this.props.id} title={this.props.title} content={this.props.content}/>
                <div className={'sectionButton'}>
                    <Button type="primary" icon={'form'} onClick={()=>this.modify()}>编辑</Button>
                    <Button type="danger" icon={'delete'} onClick={()=>this.delete()}>删除</Button>
                </div>
            </div>

        );
    }
    // 点击删除按钮
    delete(){

        let that = this;


        that.article.httpDel(function (response: any) {
            console.log(response.data);
            that.props.onChange();
        })


        // axios.defaults.baseURL='http://localhost:8080';
        // const url='api/aritcle/delete/'+this.props.id;
        // axios.get(url)
        //     .then(response=>{
        //         console.log(response.data);
        //
        //         this.props.onChange()
        //     })

        //window.location.reload();
        // store.dispatch(deleteBlog(this.props.id))
        // this.props.history.push('/home')


    }

    modify(){
        let url='modify/'+this.props.id;
        console.log(url);
        this.props.history.push(url);
    }



}