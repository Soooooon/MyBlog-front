import DateUtil from "../utils/DateUtil";
import BaseEntity from "../base/BaseEntity";
import Filter from "../base/filter/Filter";
import SortFilter from "../base/filter/SortFilter";
import InputFilter from "../base/filter/InputFilter";

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


    assign(obj: any) {
        super.assign(obj);

        this.assignEntity("createTime",Date);
        this.assignEntity("refreshTime",Date);
    }

    getFilters(): Filter[] {
        return [
            ...super.getFilters(),
            new SortFilter('文章ID','articleId'),
            new InputFilter('标题','title'),
            new InputFilter('内容','content'),
        ]
    }


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