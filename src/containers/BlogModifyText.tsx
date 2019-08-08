import * as React from "react";
import {Form,Button,Input,message as MessageBox} from "antd";
import {ChangeEvent, FormEvent} from "react";
import {RouteComponentProps} from "react-router-dom";
import {FormComponentProps} from 'antd/lib/form/Form';
import Article from "../entity/Article";
import axios from "axios";
import "../less/blogText.less"
import StringUtil from "../utils/StringUtil";

interface RouteParam{
    id:string
}


interface IProps extends RouteComponentProps<RouteParam>,FormComponentProps{
    id:number
}
interface IState {
    // title:string|null;
    // content:string|null;
}

const FormItem=Form.Item;


class BlogModifyText extends React.Component<IProps,IState>{

    article:Article=new Article(this);

    constructor(props:IProps) {
        super(props);
        this.state={
            // title:null,
            // content:null,
        };
        // axios.defaults.baseURL='http://localhost:8080';
        this.article.id=this.props.match.params.id;
    }

    initFormValue(){
        let that=this;

        let article=that.article;

        let obj:any=article.getForm();

        that.props.form.setFieldsValue(obj);

    }




    componentDidMount(): void {
        let that=this;

        console.log('拿博客:');

        let article=that.article;

        article.httpDetail(function (response: any) {
            let data=response.data.data;

            console.log(data);

            that.initFormValue();

            // that.setState({
            //     title:data.title,
            //     content:data.content,
            // });

        });



        // axios.get('/api/myblog/article/'+this.props.match.params.id)
        //     .then(response=>{
        //         let data=response.data.data;
        //
        //         console.log(data);
        //
        //         this.setState({
        //             title:data.title,
        //             content:data.content
        //         })
        //         // this.textEntity.title=data.title;
        //         // this.textEntity.content=data.content;
        //     })
    }


    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const {getFieldDecorator} =this.props.form;

        return(
            <div className={'blogText'}>
                <Form onSubmit={(e)=>this.handleSubmit(e)}>
                    写博客
                    <FormItem className={'title'}
                              {...formItemLayout}
                              label={'标题'}>
                        {getFieldDecorator('title',{
                            rules:[{message:'输入标题'}],
                        })(
                            <Input className={'inputTitle'}/>
                        )}
                        {/*<Input type='textarea' placeholder='输入标题' />*/}
                    </FormItem>

                    <FormItem className={'content'}
                              {...formItemLayout}
                              label='正文'>

                        {getFieldDecorator('content',{
                            rules:[{message:'随便写点什么'}],
                        })(
                            <Input className={'inputContent'} type='textarea'/>
                        )}
                        {/*<Input type='textarea' placeholder='随便写点什么' onChange={(e)=>this.handleContentChange(e)}/>*/}
                    </FormItem>

                    <FormItem className={'button'}>
                        <Button type={'primary'} htmlType={'submit'}>提交</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }


    handleSubmit(e:FormEvent){
        e.preventDefault();

        let that=this;
        let article=that.article;

        this.props.form.validateFieldsAndScroll((err,fieldsValue)=>{
            if (!err){
                article.content=fieldsValue['content'];
                article.title=fieldsValue['title'];

                article.author='leon';
                article.createTime=new Date();
                article.refreshTime=new Date();


                article.httpSave(function (response: any) {

                    console.log('修改请求返回值:',response.data)

                    that.goToIndex();

                });

                // axios.defaults.baseURL='http://localhost:8080';
                // axios.post('/api/myblog/modify',article)
                //     .then(res=>{
                //         console.log('修改blog：'+article);
                //         console.log('修改请求返回值:'+res.data);
                //         this.props.history.push('/home');
                //     })
            } else {
                MessageBox.error(err);
            }
        });
    }

    // getPrePath(){
    //     let match=this.props.match;
    //
    //     return StringUtil.prePath(match.path,2);
    // }


    goToIndex(){
        this.props.history.push('/home');
    }

}

const WrappedBlogModifyText=Form.create<IProps>({
    name:'edit',
})(BlogModifyText);

export default WrappedBlogModifyText;