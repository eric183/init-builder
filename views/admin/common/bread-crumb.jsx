import React from 'react';
import { Breadcrumb } from 'antd';


/**
 * 
 * 面包屑通用组件
 * @class BreadCrub
 * @extends {React.Component}
 */
export default class BreadCrumb extends React.Component {
    constructor() {
        super();

        // this.linkHandler = this.linkHandler.bind(this);
    }
    renderBread() {
        var _split = this.props.location.pathname.split('/').slice(1);

        var new_array = [];
        var objArray = [];
        var _obj, slice_str, _reg;
        function loop(data) {
                slice_str = _split.shift();
                _reg = new RegExp(slice_str)
                if(!data) return;
                for(let i = 0; i < data.length; i++) {
                    if(_reg.test(data[i].baseUrl) || _reg.test(data[i].url)) {
                        // _obj = {
                        //     label: data[i].label,
                        //     url: data[i].baseUrl || data[i].url 
                        // };
                        new_array.push(data[i]);
                        if(_split.length > 0) {
                            loop(data[i].items);
                    }
                }    
            }
        }
        loop(this.props.productObject);
        // console.log(objArray);
        return new_array;
    }
    linkHandler(data, event) {
        // console.log(data);
        if(this.props.location.pathname == event.target.dataset.url) {
            return;
        }
        
        this.props.history.push(event.target.dataset.url);
    }
    componentDidMount() {
    //    debugger;
    }
    componentWillReceiveProps() {
        // debugger;
    }
    render() {

        return (
            <Breadcrumb>
                {/* {BreadcrumbComponent} */}

                {
                    this.renderBread().map((bread, index)=> (
                        <Breadcrumb.Item key={index}>
                            <a href="javascript:void(0)" data-url={bread.url} onClick={this.linkHandler.bind(this, bread)}>{bread.label}</a>
                        </Breadcrumb.Item>
                    ))
                }
            </Breadcrumb>
        )
    }
}