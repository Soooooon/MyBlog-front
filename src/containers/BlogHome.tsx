import * as React from "react";
import axios from "axios";
import BlogSection from "./BlogSection";
import {Button} from "antd";
import BlogText from "./BlogCreateText";
import {RouteComponentProps} from "react-router-dom";
import browerHistory from "react-router";
import {createStore} from "redux";
import {connect, Provider} from "react-redux";
import "../less/home.less";
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
        // axios.defaults.baseURL='http://localhost:8080';
        this.handleClick=this.handleClick.bind(this);
    }

    componentWillUnmount(): void {
        console.log('BlogHome生命周期：componentWillUnmount')
    }

    componentDidMount(): void{
        console.log('BlogHome生命周期：componentDidMount')

        this.refresh()
    }

    refresh(){
        // console.log(store.getState().blogs)
        axios.get('api/article/queryall')
            .then(response=>{
                // store.dispatch(creaeteBlog(response.data))
                // console.log(store.getState().blogs)
                console.log('response返回:'+response.data.data);
                // console.log(typeof response.data);
                // console.log(typeof store.getState().blogs[0]);
                this.setState(
                    {blogs:response.data.data}
                )
                // console.log(this.state.blogs)
            })
    }

    componentWillUpdate(nextProps: Readonly<IProps>, nextState: Readonly<IState>, nextContext: any): void {
        console.log('Blog生命周期：componentWillUpdate')
        // window.location.reload();
    }


    render(){
        console.log('渲染BlogHome');
        return(
            <div className={'home'}>

                <div className={'homeTitle'}>
                    <div className={'homeTitleWelcome'}>
                        <h1 >欢迎来到我的博客</h1>
                    </div>
                    <div className={'homeTitleButton'}>
                        <span>
                            <Button type={'primary'} icon={'detail'} onClick={()=>{
                                this.props.history.push('list');
                            }}>
                                明细表
                            </Button>
                        </span>
                        <span>
                            <Button type={'primary'} icon={'edit'} onClick={this.handleClick}>
                             写博客
                            </Button>
                        </span>


                    </div>
                </div>

                <div className={'blogItems'}>
                    {this.state.blogs.map(item=>
                        <BlogSection {...this.props} key={item.id}
                                     onChange={()=>{
                                         this.refresh()
                                     }}
                                     title={item.title} content={item.content} id={item.id}/>)}
                </div>
            </div>
        )
    }

    //进入编辑
    handleClick(){
        this.props.history.push('/write')
    }

}

