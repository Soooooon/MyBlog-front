import * as React from "react";
import {Form,Button,Input,message as MessageBox} from "antd";
import {ChangeEvent, FormEvent} from "react";
import {RouteComponentProps} from "react-router-dom";
import {FormComponentProps} from 'antd/lib/form/Form';
import Article from "../entity/Article";
import axios from "axios";
import "../less/blogText.less"
import qs from "qs"

interface RouteParam{
    id:string
}


interface IProps extends RouteComponentProps<RouteParam>,FormComponentProps{

}
interface IState {

}

const FormItem=Form.Item;


class BlogCreateText extends React.Component<IProps,IState>{

    article:Article=new Article();

    constructor(props:IProps) {
        super(props);
        this.state={};
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
                    console.log('上传博客结果:',response.data);
                    console.log('新建博客提交完成，准备跳回home');
                    that.props.history.push('/home')
                });


                // console.log('创建博客：'+article);
                // // axios.defaults.baseURL='http://localhost:8080';
                // let params=qs.stringify(article.getForm());
                // axios.post('/api/myblog/create',params,{
                //     headers:{
                //         'Content-Type': 'application/x-www-form-urlencoded'
                //     }
                // })
                //     .then(res=>{
                //
                //         console.log('上传博客结果：'+res.data);
                //
                //         console.log('新建博客提交完成，准备跳回home');
                //         this.props.history.push('/home');
                //     })
            } else {
                MessageBox.error(err);
            }
        });
    }
}

const WrappedBlogCreateText=Form.create<IProps>({
    name:'edit',
})(BlogCreateText);

export default WrappedBlogCreateText;