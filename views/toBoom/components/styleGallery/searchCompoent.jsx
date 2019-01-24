
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import  * as mobx from 'mobx';
import { observable, computed, autorun } from 'mobx';





export default class SearchCompoent extends React.Component {
    componentDidMount(){
        document.addEventListener("keydown",this.handleEnterKey);
    }
    componentWillUmount(){
        document.removeEventListener("keydown",this.handleEenterKey);
    }
    handleEnterKey = (e) => {
        if(e.keyCode === 13){
            this.props.searchAction( this.refs.inputElem.value )
        }
    }

    searchAction = () => {

        this.props.searchAction( this.refs.inputElem.value )
    }

render(){
    return (
        <label className="sg-search">
            <input type="text" ref="inputElem" />
            <i onClick={ this.searchAction } ></i>
        </label>
     )
}
}

