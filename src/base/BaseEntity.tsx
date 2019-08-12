import HttpBase from "./HttpBase";
import ObjectUtil from "../utils/ObjectUtil";
import Filter from "./filter/Filter";
import SortFilter from "./filter/SortFilter";
import StringUtil from "../utils/StringUtil";
import SafeUtil from "../utils/SafeUtil";

export default class BaseEntity extends HttpBase{

    /**
     * id
     */
    id:string|null=null;

    /**
     * 创建时间
     */
    createTime:Date|null=null;

    /**
     * 修改时间
     */
    refreshTime:Date|null=null;


    //************ 前端辅助字段 ****************/
    //加载详情的指示
    detailLoading: boolean = false

    //我们认为每个实体都会存放于某个react组件中，当然可以不传入。
    constructor(reactComponent?: React.Component | null) {

        super(reactComponent)


    }

    //把obj中的属性，赋值到this中来。采用深拷贝。
    assign(obj:any){
       super.assign(obj);

       // this.assignEntity("createTime",Date);
       // this.assignEntity("refreshTime",Date);
    }


    //获取过滤器，必须每次动态生成，否则会造成filter逻辑混乱。
    getFilters(): Filter[] {
        return [
            new SortFilter("排序", "id"),
            new SortFilter("修改时间排序", "refreshTime"),
            new SortFilter("创建时间排序", "createTime"),
        ]
    };


    //提交之前对自己进行验证。返回错误信息，null表示没有错误。
    validate() {

        return null
    }

    //提交的表单
    getForm(): any {
        console.error('getForm: you should override this base method.')
    }

    //获取到当前类的单数标签。比如 Project便得到 project
    getTAG(): string {

        let className = this.constructor.name

        //IE无法直接通过this.constructor.name获取到相应名称
        if (!className) {
            className = StringUtil.functionName(this.constructor)
        }

        return StringUtil.lowerCamel(className)
    }

    getUrlPrefix():string{
        return '/api/'+StringUtil.lowerSlash(this.getTAG());
    }

    getUrlCreate():string{
        let prefix=this.getUrlPrefix();

        return prefix+'/create';
    }

    getUrlDel():string{
        let prefix=this.getUrlPrefix();

        return prefix+'/delete';
    }

    getUrlEdit(): string {
        let prefix = this.getUrlPrefix()

        return prefix + '/edit'
    }

    getUrlDetail(): string {
        let prefix = this.getUrlPrefix()

        return prefix + '/detail'
    }

    getUrlList(): string {
        let prefix = this.getUrlPrefix()

        return prefix + '/list'
    }

    getUrlSort(): string {
        let prefix = this.getUrlPrefix()

        return prefix + '/sort'
    }

    // 上传或修改
    httpSave(successCallback?: any, errorCallback?: any, finallyCallback?: any){

        let that=this;

        let url:string='';
        if (this.id){
            url=this.getUrlEdit();
        } else {
            url=this.getUrlCreate();
        }

        this.httpPost(url,this.getForm(),function (response: any) {
            that.assign(response.data.data);

            SafeUtil.safeCallback(successCallback)(response);
        },errorCallback,finallyCallback);

    }


    httpDetail(successCallback?: any, errorCallback?: any, finallyCallback?: any){

        let that=this;
        if (!this.id){

            console.log("请求未指定id");

            return;
        }

        let url=this.getUrlDetail()+'/'+this.id;

        this.detailLoading=true;

        this.httpGet(url,{},function (response: any) {
            that.detailLoading=false;

            that.assign(response.data.data);

            SafeUtil.safeCallback(successCallback)(response);
        },function (error: any) {
            console.log("请求发生错误!")
        },finallyCallback)

    }


    httpDel(successCallback?: any, errorCallback?: any, finallyCallback?: any){

        let that=this;

        if (!this.id){

            console.log("请求未指定id");
            return;
        }

        let url=this.getUrlDel()+'/'+this.id;

        this.httpPost(url,{},function (response: any) {

            SafeUtil.safeCallback(successCallback)(response);

        },errorCallback,finallyCallback)

    }



}