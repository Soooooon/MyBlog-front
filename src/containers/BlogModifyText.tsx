import * as React from "react";
import {Form,Button,Input,message as MessageBox} from "antd";
import {ChangeEvent, FormEvent} from "react";
import {RouteComponentProps} from "react-router-dom";
import {FormComponentProps} from 'antd/lib/form/Form';
import TextEntity from "../entity/TextEntity";
import axios from "axios";
import "../less/blogText.less"

interface RouteParam{
    id:string
}


interface IProps extends RouteComponentProps<RouteParam>,FormComponentProps{
    id:number
}
interface IState {
    title:string|null;
    content:string|null;
}

const FormItem=Form.Item;


class BlogModifyText extends React.Component<IProps,IState>{

    textEntity:TextEntity=new TextEntity();

    constructor(props:IProps) {
        super(props);
        this.state={
            title:null,
            content:null,
        };
        // axios.defaults.baseURL='http://localhost:8080';
        this.textEntity.id=this.props.match.params.id
    }

    componentDidMount(): void {
        console.log('拿博客:');
        axios.get('/api/myblog/article/'+this.props.match.params.id)
            .then(response=>{
                let data=response.data.data;

                console.log(data);

                this.setState({
                    title:data.title,
                    content:data.content
                })
                // this.textEntity.title=data.title;
                // this.textEntity.content=data.content;
            })
    }


    render(){
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        const {getFieldDecorator} =this.props.form;

        return(
            <Form onSubmit={(e)=>this.handleSubmit(e)} className={'blogText'}>
                写博客
                <FormItem
                    {...formItemLayout}
                    label={'标题'}>
                    {getFieldDecorator('title',{
                        rules:[{message:'输入标题'}],
                        initialValue:this.state.title
                    })(
                        <Input/>
                    )}
                    {/*<Input type='textarea' placeholder='输入标题' />*/}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label='正文'>

                    {getFieldDecorator('content',{
                        rules:[{message:'随便写点什么'}],
                        initialValue:this.state.content
                    })(
                        <Input type='textarea'/>
                    )}
                    {/*<Input type='textarea' placeholder='随便写点什么' onChange={(e)=>this.handleContentChange(e)}/>*/}
                </FormItem>

                <FormItem>
                    <Button type={'primary'} htmlType={'submit'}>提交</Button>
                </FormItem>
            </Form>
        );
    }


    handleSubmit(e:FormEvent){
        e.preventDefault();

        let that=this;
        let textEntity=that.textEntity;

        this.props.form.validateFieldsAndScroll((err,fieldsValue)=>{
            if (!err){
                textEntity.content=fieldsValue['content'];
                textEntity.title=fieldsValue['title'];

                textEntity.author='leon';
                textEntity.createTime=new Date();
                textEntity.refreshTime=new Date();

                axios.defaults.baseURL='http://localhost:8080';
                axios.post('/api/myblog/modify',textEntity)
                    .then(res=>{
                        console.log('修改blog：'+textEntity);
                        console.log('修改请求返回值:'+res.data);
                        this.props.history.push('/home');
                    })
            } else {
                MessageBox.error(err);
            }
        });
    }
}

const WrappedBlogModifyText=Form.create<IProps>({
    name:'edit',
})(BlogModifyText);

export default WrappedBlogModifyText;