export interface Blog {
    id:number;
    title:string;
    content:string;
    createTime?:Date;
    refreshTime?:Date;
}

export interface BlogState {
    blogs:Blog[]
}


export const CREATE_BLOG='CREATE_BLOG';
export const DELETE_BLOG='DELETE_BLOG';

interface CreateBlogAction {
    type:typeof CREATE_BLOG;
    payload:Blog;
}

interface DeleteBlogAction {
    type:typeof DELETE_BLOG;
    meta:{
        id:number
    }
}

export type BlogActionTyps=CreateBlogAction|DeleteBlogAction;