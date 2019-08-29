import BaseEntity from "./BaseEntity";
import React from "react"
import {PaginationConfig, SorterResult, SortOrder, TableCurrentDataSource} from "antd/lib/table";
import HttpBase from "./HttpBase";
import Filter from "./filter/Filter";
import BrowserUtil from "../utils/BrowserUtil";
import NumberUtil from "../utils/NumberUtil";
import SortFilter from "./filter/SortFilter";
import SafeUtil from "../utils/SafeUtil";
import StringUtil from "../utils/StringUtil";
import ObjectUtil from "../utils/ObjectUtil";

/**
 * 一个分页帮助器，可以去后台请求数据，也可以渲染需要数据源。
 * 这个类具有非常神奇的能力，可以说是整个项目含金量最高的一个类！
 */
export default class Pager<T> extends HttpBase {

  static MAX_PAGE_SIZE = 500

  /**
   * 当前分页大小 1基
   */
  pageNum: number = 1
  /**
   * 每一页的大小
   */
  pageSize: number = 0
  /**
   * 总的条目数量
   */
  totalItems: number = 0
  /**
   * 总的页数
   */
  totalPages: number = 0

  /**
   * 返回的数据，类型为泛型
   */
  data: T[] = []

  /**
   * 类。这个很特殊。
   */
  Clazz: any = null

  /**
   * 分页的url链接地址
   */
  urlPage: string | null = null

  /**
   * 过滤筛选器
   */
  filters: Filter[] = []

  /**
   * 是否要求在浏览器中保存参数
   */
  history: boolean = false


  constructor(reactComponent: React.Component | null, Clazz: any, pageSize = 20) {

    super(reactComponent)

    this.pageSize = pageSize

    //这里的处理利用了js的原型调用链，比较魔法。
    if (Clazz && (Clazz.prototype instanceof BaseEntity)) {
      this.Clazz = Clazz

      let urlPage = Clazz.prototype.getUrlList()
      if (urlPage) {
        this.urlPage = urlPage
      } else {
        console.error(Clazz + '必须定义分页url')
      }

      if (Clazz.prototype.getFilters) {

        //直接获取该类的过滤器。
        this.filters = Clazz.prototype.getFilters()

      } else {

        console.error('The Clazz MUST define a prototype method named \'getFilters\'')

      }

    } else {
      console.error('You MUST specify a Clazz extended BaseEntity')
    }
  }

  //把obj中的属性，赋值到this中来。采用深拷贝。
  assign(obj: any,) {

    // console.log('pager:',this)
    // console.log('obj',obj)

    super.assign(obj)

    this.assignList('data', this.Clazz)

  }


  //该方法是在地址栏添加上query参数，参数就是filters中的key和value.
  //同时地址栏上有的参数也会自动读取到filters中去
  //因此，启用该方法后返回时可以停留在之前的页码中。
  enableHistory() {
    this.history = true

    let queryPageNum: string | null = BrowserUtil.getParameterByName("pageNum")
    let queryPageSize: string | null = BrowserUtil.getParameterByName("pageSize")

    if (queryPageNum !== null && queryPageNum !== "") {
      this.pageNum = parseInt(queryPageNum)
    }

    if (queryPageSize !== null && queryPageSize !== "") {
      this.pageSize = parseInt(queryPageSize)
    }

    if (!NumberUtil.isInteger(this.pageNum)) {
      this.pageNum = 1
    }
    if (!NumberUtil.isInteger(this.pageSize)) {
      this.pageSize = 10
    }


    //从请求参数中传值。
    for (let i = 0; i < this.filters.length; i++) {

      let filter: Filter = this.filters[i]

      let queryValue = BrowserUtil.getParameterByName(filter.key)

      if (queryValue !== null && queryValue !== "") {

        filter.putValue(queryValue)

      }
    }
  }


  //重置所有过滤器
  resetFilter() {
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      filter.reset()
    }

  };

  //重置排序过滤器
  resetSortFilters() {
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      if (filter instanceof SortFilter) {
        filter.reset()
      }
    }
    console.log('重置所有过滤器结果：',this.filters)
  };


  //手动设置过滤器的值
  setFilterValue(key: string, value: any) {
    if (!this.filters || !this.filters.length) {
      return
    }

    for (let i = 0; i < this.filters.length; i++) {

      let filter = this.filters[i]

      if (filter.key === key) {
        filter.putValue(value)
      }

    }
  };


  //根据key来删除某个Filter
  removeFilter(key: string) {
    if (!this.filters || !this.filters.length) {
      return
    }
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      if (filter.key === key) {
        this.filters.splice(i, 1)
        break
      }
    }
  };


  //隐藏某个Filter，实际上我们可以根据这个filter来筛选，只不过不出现在NbFilter中而已。
  showFilter(key: string, visible = true) {
    if (!this.filters || !this.filters.length) {
      return
    }
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      if (filter.key === key) {
        filter.visible = visible
        break
      }
    }
  };

  showAllFilter(visible = true) {
    if (!this.filters || !this.filters.length) {
      return
    }
    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      filter.visible = visible
    }
  }

  //根据一个key来获取某个filter
  getFilter(key: string): Filter | null {
    if (!this.filters || !this.filters.length) {
      return null
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      if (filter.key === key) {
        return filter
      }
    }

    return null
  };


  /**
   * 获取当前进行sort的那个filter
   * 我们认为一次只有一个排序值
   */
  getCurrentSortFilter(): Filter | null {

    if (!this.filters || !this.filters.length) {
      return null
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]
      if (filter instanceof SortFilter) {
        if (!filter.isEmpty()) {
          return filter;
        }
      }

    }
    return null
  }


  //获取所有的filter参数，键值对形式
  getParams(): { [s: string]: string | number } {

    let filter=this.getFilter('orderId');
    console.log('orderId filter:',filter)

    let params: { [s: string]: string | number } = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }

    if (!this.filters || !this.filters.length) {
      return params
    }

    for (let i = 0; i < this.filters.length; i++) {
      let filter = this.filters[i]

      // console.log('filter:',filter)
      // console.log(filter.key,':',filter.getValueString())
      if (!filter.isEmpty()) {
        params[filter.key] = filter.getValueString()
      }
    }

    // console.log('params:',params)
    return params;
  };


  //元素是否为空
  isEmpty(): boolean {
    return !this.data || !this.data.length
  }

  //去服务器端进行请求
  httpList(successCallback?: any, errorCallback?: any, finalCallback?: any) {

    let that = this

    let params: { [s: string]: string | number } = this.getParams()


    if (this.history) {
      window.history.replaceState({}, '', window.location.pathname + '?' + ObjectUtil.param(params))
    }


    //准备去请求，所有错误置为空
    this.errorMessage = null

    console.log('params:',params)

    this.httpPost(this.urlPage, params, function (response: any) {
      // handle success

      that.assign(response.data.data)

      SafeUtil.safeCallback(successCallback)(response)

    }, function (errorMessage: any, response: any) {

      //失败了就清空
      that.data = []

      SafeUtil.safeCallback(errorCallback)(errorMessage, response)

    }, finalCallback)

  }


  //从pager中获取当前的分页情况，在table的分页器中显示
  getPagination(): PaginationConfig | false {
    let that = this

    if (this.totalPages > 1) {
      return {
        current: that.pageNum,
        pageSize: that.pageSize,
        total: that.totalItems,
        showTotal: (totalNum: number) => "共" + totalNum + "条",
        showSizeChanger: true
      };
    } else {
      return false
    }


  }

  //获取默认的排序顺序,提供给table使用
  getDefaultSortOrder(columnKey: string): SortOrder | boolean {

    //将变化的这个情况更新。
    let filterKey = "order" + StringUtil.capitalize(columnKey)

    //直接放进排序值即可，底层会自动兼容
    let sortFilter = this.getFilter(filterKey)

    if (sortFilter && (sortFilter instanceof SortFilter)) {

      let antdSortValue: SortOrder | null = sortFilter.getAntdValue()
      if (antdSortValue) {
        return antdSortValue
      } else {
        return false
      }

    } else {
      return false
    }

  }


  //在table的分页器 发生变化调用
  tableOnChange(pagination: PaginationConfig, filters: Record<keyof T, string[]>, sorter: SorterResult<T>, extra: TableCurrentDataSource<T>) {
    let that = this

    if (pagination.current !== undefined) {
      that.pageNum = pagination.current
    }

    if (pagination.pageSize !== undefined) {

      that.pageSize = pagination.pageSize
    }

    console.log('!!!!!',sorter)

    //重置所有的sort
    that.resetSortFilters()
    // console.log('that:',that)
    if (!StringUtil.isEmptyObject(sorter)) {

      //将变化的这个情况更新。
      let filterKey = "order" + StringUtil.capitalize(sorter.field)

      //直接放进排序值即可，底层会自动兼容
      that.setFilterValue(filterKey, sorter.order)

    }


    //直接去刷新
    that.httpList()
  }

}




