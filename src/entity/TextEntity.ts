import DateUtil from "../utils/DateUtil";

export default class TextEntity {


    /**
     * id
     */
    id:string|null=null;

    /**
     * 标题
     */
    title:string|null=null;


    /**
     * 内容
     */
    content:string|null=null;

    /**
     * 作者
     */
    author:string|null=null;

    /**
     * 创建时间
     */
    createTime:Date=new Date();


    /**
     * 修改时间
     */
    refreshTime:Date= new Date();




    getForm(){
        return{
            id:this.id,
            author:this.author,
            title:this.title,
            content:this.content,
            createTime:DateUtil.simpleDateTime(this.createTime),
            refreshTime:DateUtil.simpleDateTime(this.refreshTime),
        }
    }
}