import * as React from "react";
import {withRouter} from "react-router-dom";
import axios from "axios"

// @withRouter
export default class CheckLogin extends React.Component{
    axios=require("axios");

    componentDidMount(): void {
        axios.get("localhost:8080/myblog")
            .then(res=>{
               if (res.status===200){
                   console.log(res)
                   // if ((res.data.code===0)){
                   //
                   // } else {
                   //     this.props.history.push("/login");
                   // }

               }
            });
    }
}