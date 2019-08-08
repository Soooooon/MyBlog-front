import DateUtil from "../utils/DateUtil";
import BaseEntity from "../base/BaseEntity";

export default class Article extends BaseEntity{

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