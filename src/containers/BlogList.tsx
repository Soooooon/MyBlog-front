import React from "react";
import {Table, Icon, Popconfirm, Button} from "antd";
import Pager from "../base/Pager";
import Article from "../entity/Article";
import SortDirection from "../base/filter/SortDirection";
import {ColumnProps} from "antd/lib/table";
import {Link, RouteComponentProps} from "react-router-dom";
import StringUtil from "../utils/StringUtil";
import "../less/BlogList.less"
import FilterPanel from "../base/filter/FilterPanel";
import DateUtil from "../utils/DateUtil";
import format from 'date-fns/format'

interface IProps extends RouteComponentProps {

}

interface IState {
}

export default class BlogList extends React.Component<IProps, IState> {

    pager: Pager<Article> = new Pager<Article>(this, Article, 10);

    constructor(props: IProps) {
        super(props);
        this.state = {};
    }


    componentDidMount(): void {

        let that = this;

        that.pager.enableHistory();

        that.refresh();

    }

    search() {
        let that = this
        that.pager.pageNum = 1


        that.refresh()
    }

    refresh() {

        let that = this;
        let pager = that.pager;


        //如果没有任何的排序，默认使用id倒序
        let currentSortFilter = pager.getCurrentSortFilter();
        if (!currentSortFilter) {
            pager.setFilterValue("orderId", SortDirection.DESC)
        }


        pager.httpList(function (response: any) {

            console.log("page返回结果：", pager);

        })


    }


    render() {

        let that = this;

        let match = this.props.match;
        let pager = that.pager;

        pager.data.map((article: Article) => {

            // @ts-ignore
            // console.log(format(article.createTime, 'YYYY-MM-DD HH:mm:ss'))
            // @ts-ignore
            article.createTime = format(article.createTime, 'YYYY-MM-DD HH:mm:ss');
            // @ts-ignore
            article.refreshTime = format(article.refreshTime, 'YYYY-MM-DD HH:mm:ss')
        })

        const columns: ColumnProps<Article>[] = [{
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            sortOrder: pager.getDefaultSortOrder('orderId'),
            sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
        }, {
            title: '作者',
            dataIndex: 'author',
        }, {
            title: '标题',
            dataIndex: 'title',
        }, {
            title: '内容',
            dataIndex: 'content',
        },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                sorter: true,
                sortOrder: pager.getDefaultSortOrder("articleCreateTime"),
                sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
                render: (text: any, record: Article, index: number): React.ReactNode => (
                    DateUtil.simpleDateTime(text)
                )
            },
            {
                title: '修改时间',
                dataIndex: 'refreshTime',
                sorter: true,
                sortOrder: pager.getDefaultSortOrder("articleRefreshTime"),
                sortDirections: [SortDirection.DESCEND, SortDirection.ASCEND],
                render: (text: any, record: Article, index: number): React.ReactNode => (
                    DateUtil.simpleDateTime(text)
                )
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text: any, article: Article) => (
                    <span>
                    <Link to={'/edit/' + article.id}>
                        <Icon className={'btn-action'} type={'edit'}/>
                    </Link>

                    <Popconfirm title='确认删除该文章，删除后不可恢复？' onConfirm={(e: any) => {
                        article.httpDel(function () {
                            that.refresh();
                        })
                    }} okText={'确认'} cancelText={'取消'}>
                        <Icon title={'编辑'} className={'btn-action text-danger'} type='delete'/>
                    </Popconfirm>
                </span>
                )
            }];

        return (

            <div className={'article-list-index'}>

                <div className={'title-navigation'}>
                    <span className={'item active'}>博客明细表</span>
                    <span className={'tool'}>
                        <Link to={'/write'}>
                            <Button type={'primary'} icon={'plus'}>
                                新建博客
                            </Button>
                        </Link>
                    </span>

                </div>

                <div>
                    <FilterPanel filters={pager.filters} onChange={this.search.bind(this)}/>
                </div>

                <Table className={'article-list'}
                       rowKey={'id'}
                       loading={pager.loading}
                       dataSource={pager.data}
                       columns={columns}
                       pagination={pager.getPagination()}
                       onChange={pager.tableOnChange.bind(pager)}
                />
            </div>

        );

    }
}