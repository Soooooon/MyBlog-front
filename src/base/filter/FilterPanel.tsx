import React from "react";
import "./FilterPanel.less";

import {Button} from "antd";
import Filter from "./Filter";
import SafeUtil from "../../utils/SafeUtil";
import InputFilter from "./InputFilter";
import DateTimeFilter from "./DateTimeFilter";
import CheckFilter from "./CheckFilter";
import HttpSelectionFilter from "./HttpSelectionFilter";
import SelectionFilter from "./SelectionFilter";
import SortFilter from "./SortFilter";
import SortFilterBox from "./SortFilterBox";
import HttpSelectionFilterBox from "./HttpSelectionFilterBox";
import SelectionFilterBox from "./SelectionFilterBox";
import CheckFilterBox from "./CheckFilterBox";
import DateTimeFilterBox from "./DateTimeFilterBox";
import InputFilterBox from "./InputFilterBox";


interface IProps {
  onChange?: (value: any, key: any) => void

  filters: Filter[]

  //Selection 筛选宽松模式 会使用Button，单独占一行的模式。
  selectionButtonLoose?: boolean

  //重置按钮触发
  onReset?: () => void

  //懒搜索模式，点击按钮时才触发搜索的动作，当传递了内容，就会出现搜索按钮。
  onSearch?: () => void

}

interface IState {
}


/**
 * 这里是筛选面板。
 * 如果需要调整筛选面板的样式。
 * 请在自己的类中，通过css覆盖的方式来修改样式。
 */
export default class FilterPanel extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {};
  }


  //当改变某个filter的值
  onChildChange(value: any, key: any) {

    let that = this

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onChange)(value, key)

    //更新UI
    that.setState({})

  }

  //当改变某个filter的值
  onReset() {

    let that = this
    let filters = that.props.filters

    for (let i = 0; i < filters.length; i++) {
      let filter = filters[i]
      filter.reset()
    }


    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onReset)()

    //更新UI
    that.setState({})
  }


  //当改变某个filter的值
  onSearch() {

    let that = this

    //通知外面变化了。
    SafeUtil.safeCallback(that.props.onSearch)()

    //更新UI
    that.setState({})

  }


  render() {

    let that = this
    //router中传入的路由相关对象
    let filters = this.props.filters

    let needSearchButton: boolean = !!this.props.onSearch

    let needResetButton: boolean = !!this.props.onReset

    return (
      <div className={`widget-filter-panel ${this.props.selectionButtonLoose ? 'selection-button-loose' : ''}`}>
        {
          filters.map(((filter: Filter, index: number) => {

            if ((filter instanceof InputFilter) && filter.visible) {
              return (
                <InputFilterBox key={index} inputFilter={filter} onChange={(val:any) => {
                  that.onChildChange(val, filter.key)
                }}/>
              )
            } else if ((filter instanceof DateTimeFilter) && filter.visible) {
              return (
                <DateTimeFilterBox key={index} dateTimeFilter={filter} onChange={(val:any) => {
                  that.onChildChange(val, filter.key)
                }}/>
              )
            } else if ((filter instanceof CheckFilter) && filter.visible) {
              return (
                <CheckFilterBox key={index} checkFilter={filter} onChange={(val:any) => {
                  that.onChildChange(val, filter.key)
                }}/>
              )
            } else if ((filter instanceof HttpSelectionFilter) && filter.visible) {
              //注意，子类放前面，父类放后面
              return (
                <HttpSelectionFilterBox key={index} httpSelectionFilter={filter}
                                        onChange={(val:any) => {
                                          that.onChildChange(val, filter.key)
                                        }}/>
              )
            } else if ((filter instanceof SelectionFilter) && filter.visible) {
              return (
                <SelectionFilterBox key={index} selectionFilter={filter} onChange={(val:any) => {
                  that.onChildChange(val, filter.key)
                }}/>
              )
            } else if ((filter instanceof SortFilter) && filter.visible) {
              return (
                <SortFilterBox key={index} sortFilter={filter}
                               onChange={(val:any) => {
                                 that.onChildChange(val, filter.key)
                               }}/>
              )
            } else {
              return null
            }

          }))
        }

        <div className="operation-area">
          <Button
            className={`${needResetButton ? '' : 'display-none'}`}
            icon="close-circle"
            onClick={this.onReset.bind(this)}>
            重置条件
          </Button>

          <Button
            className={`${needSearchButton ? '' : 'display-none'}`}
            icon="search"
            type="primary"
            onClick={this.onSearch.bind(this)}>
            搜索
          </Button>

        </div>

      </div>
    );
  }
}

