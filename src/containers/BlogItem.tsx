import * as React from "react";
import "../less/blogItem.css"

interface IProps {
    id:number;
    title:string;
    content:string;
}
interface IState {

}


export default class BlogItem extends React.Component<IProps,IState>{
    constructor(props:IProps){
        super(props);
        this.state={};
    }

    render() {
        return (
            <div className={'blogItem'}>
                <h2>{this.props.title}</h2>
                <h3>{this.props.content}</h3>
            </div>
        );
    }
}