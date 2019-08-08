import HttpUtil from "../utils/HttpUtil";
import SafeUtil from "../utils/SafeUtil";
import qs from "qs";
import ViewBase from "./ViewBase";

export default class HttpBase extends ViewBase{

    //是否需要自动刷新State
    needReactComponentUpdate: boolean = true

    //当前是否正在进行http请求
    loading: boolean = false

    //请求http的时候是否有错误
    errorMessage: string | null = null

    //我们认为每个实体都会存放于某个react组件中，当然可以不传入。
    constructor(reactComponent?: React.Component | null) {

        super()

        if (reactComponent) {
            this.reactComponent = reactComponent
        }

    }

    //更新当前的视图，只在需要更新的情况下才更新。
    updateUI() {
        if (this.needReactComponentUpdate && this.reactComponent) {
            ViewBase.updateComponentUI(this.reactComponent, this)
        }
    }


    /**
     * 基类中http的get请求
     * @param url
     * @param params
     * @param successCallback
     * @param errorCallback
     * @param finallyCallback
     * @param opts
     */
    httpGet(url:string,params={},successCallback?:any,errorCallback?:any,finallyCallback?:any,opts?:any){

        let that=this;

        if (!opts){
            opts={};
        }

        that.loading = true

        //更新react控件的状态
        that.updateUI()


        HttpUtil.httpGet(url,params,function (response:any) {
            SafeUtil.safeCallback(successCallback)(response);
        },function (err: any) {
            let response=err.response;
            console.log("请求出错啦",response);
        },function (res:any) {

            that.loading = false

            //更新react控件的状态
            that.updateUI()

            SafeUtil.safeCallback(finallyCallback)(res);

        },opts);
    }

    httpPost(url:any,params={},successCallback?:any,errorCallback?:any,finallyCallback?:any,opts?:any){

        let that=this;

        if (!opts){
            opts={}
        }

        that.loading = true;

        //更新react控件的状态
        that.updateUI();


        let formData=qs.stringify(params);

        if (!opts["headers"]) {
            opts["headers"] = {}
        }
        opts["headers"]['Content-Type'] = 'application/x-www-form-urlencoded'

        HttpUtil.httpPost(url,formData,function (response:any) {
            SafeUtil.safeCallback(successCallback)(response);
        },function (err: any) {
            let response=err.response;
            console.log("请求出错啦",response);
        },function (res:any) {

            that.loading = false

            //更新react控件的状态
            that.updateUI()

            SafeUtil.safeCallback(finallyCallback)(res);

        },opts);
    }


}