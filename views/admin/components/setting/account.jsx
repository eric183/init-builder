import React from 'react';
import { Layout, Modal, Button, Input } from 'antd';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 

export default class Account extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
        isFogot: false,
        testArray: [1,,2,3,45,5,6]
    }
    handleOk() {
        this.setState({
            visible: false
        })
    }
    onCancel() {
        this.setState({
            visible: false
        })
    }
    testHandler() {
        // this.state.testArray.push(5555);
        this.setState({
            testArray: this.state.testArray
        })
    }
    render() {
        return (
            <Layout.Content className="common-content account-content">

                <h1>账号信息</h1>
                <p>用户姓名: 附小小 <a href="javascript:void(0)" onClick={()=> {this.setState({visible: true})}}>更改密码</a></p>
                <p>联系电话: 181**12321  <a href="javascript:void(0)" onClick={()=> {}}>更改手机</a></p>
                <p>所属部门: 技术研发中心-产品组</p>
                <p>账号权限: 超级管理员</p>
                <p>备注: 无</p>
            
                <Modal 
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                    confirmLoading={this.state.confirmLoading}>
                    
                    {/* <ReactCSSTransitionGroup
                        transitionName="commonpagemove"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={100}> */}
                        {
                            this.state.isFogot ? <p key={1}>我忘记了呢</p> : (
                                <div className="change-password-content" key={2}>
                                    <label htmlFor="">
                                        <span>原密码:</span>
                                        <Input />
                                        <a href="javascript: void(0)" onClick={x=>(this.setState({isFogot: true}))}>忘记密码？</a>
                                    </label>
                                    <label htmlFor="">
                                        <span>新密码:</span>
                                        <Input />
                                    </label>
                                    <label htmlFor="">
                                        <span>确认密码:</span>
                                        <Input />
                                    </label>
                                </div>
                            )
                        }
                        
                    {/* </ReactCSSTransitionGroup> */}
                </Modal>
            </Layout.Content>
        )
    }
}