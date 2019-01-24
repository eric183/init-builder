import * as React from 'react';
import { Layout, Icon, Modal } from 'antd';
import { Link } from 'react-router-dom'
import CollapseToggle from './header/collapse-toggle';
import PlatformSelector from './header/platform-selector';

import {observer} from 'mobx-react';


@observer export default class Header extends React.Component {
    state = {
        visibleClassName: ''
    }

    // top-search-change
    inputActiver() {
        this.setState({visibleClassName: "top-search-change" });
        // console.log(this.refs.inputComponent);
        // setTimeout(() => {            
        this.refs.inputComponent.focus();
        // }, 520);
        
    }
    exitHandler() {
        Modal.info({
            title: '确定退出吗?',
            okText: '确定',
            cancelText: '取消',
            maskClosable: true,
            onOk: function() {
                localStorage.setItem('loginToken', '');
                location.reload();
            }
            // onCancel: funciton() {}

        })
    }
    render() {
        var userInfo = this.props.store.globalInfo.userData;
        // console.log(userInfo);
        return (
            <Layout.Header className="common-header" style={this.props.style}>
                <div className="left-part header-group">
                    <CollapseToggle toggleHandler={this.props.toggleHandler}/>
                    <PlatformSelector />
                    {this.props.children}
                </div>
                <div className="right-part header-group">
                    <div className="top-search-content">
                        <input 
                            type="text" 
                            ref="inputComponent"
                            className={this.state.visibleClassName} 
                            onBlur={()=> { this.setState({visibleClassName: "" })}}
                            />
                        <Icon 
                            type="search" 
                            className="header-common-icon" 
                            onClick={this.inputActiver.bind(this)}/>
                    </div>
                    <div className="right-part-wrapper">
                        <Icon type="bell" className="header-common-icon"/>
                        <div className="user-info">
                            <i style={{backgroundImage: `url(${userInfo.avatar})`}}></i>
                            <p>
                                <span>{userInfo.username}</span>
                                {/* <span>部门信息</span> */}
                            </p>
                        </div>
                        <Link to={"/"} onClick={this.exitHandler.bind(this)}>
                            <Icon className="setting" type="setting"/>
                        </Link>
                    </div>
                    
                </div>
            </Layout.Header>
        )
    }
}