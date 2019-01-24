import * as React from 'react';
import { Layout, Button } from 'antd';
import { observer, Provider } from 'mobx-react';

import axios from 'axios';

@observer 
export default class Login extends React.Component {
    state = {
        userName: '',
        password: '',
        loading: false
    }
    
    inputHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        // console.log(event.target.value);
    }

    postHandler() {
        // document.cookie = `userName=${this.state.userName}`;
        // document.cookie = `password=${this.state.password}`;
        this.setState({
            loading: true
        }) 
        axios.post('/api/login', {
            username: this.state.userName,
            // mobile: this.state.userName,  
            password: this.state.password
            // password: this.state.password
        }).then(({data})=> {
            // console.log(data);
            // debugger;
            this.setState({
                loading: false
            })
            if(data.status_code == 200) {
                //获取登录token成功
                
                localStorage.setItem("loginToken", 'Bearer' + data.data);
                // debugger;

                this.props.RequestConfig.resetToken(data.data);
                this.props.store.globalInfo.checkLogin();

                // this.props.store.globalInfo.setLogin(true);
                this.props.store.tools.message.success('登录成功(*^▽^*)');
            } else {
                // debugger;
                this.props.store.tools.message.error(data.message);
            }
        }).catch(({response})=> {
            // debugger;
            this.props.store.tools.message.error(response.statusText);
            this.setState({
                loading: false
            })
        }) 

        // this.props.checkLogin();
        // if(this.props.util.checkReg("userName") != 'admin' || this.props.util.checkReg("password") != '1234') {
        //     alert('用户名: admin, 密码: 1234');
        //     return;
        // } else {
        //     // callback && callback();
        //     this.props.store.globalInfo.setLogin(true)
        // }

    }
    componentWillReceiveProps() {
        // debugger;
    }
    render() {
        // debugger;
        return (
            <Layout.Content className="common-content login-content" style={{display: this.props.store.globalInfo.isLogin ? "none" : "block" }}>

                <div className="center-block" >
                    <input 
                        type="text" 
                        name="userName" 
                        placeholder="用户名"
                        value={this.state.userName} 
                        // value={13245600000} 
                        onChange={this.inputHandler.bind(this)} />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="密码"
                        value={this.state.password} 
                        // value={123456} 
                        onChange={this.inputHandler.bind(this)} />
                    <Button type="primary" onClick={this.postHandler.bind(this)} loading={this.state.loading}>提交</Button>
                    
                </div>
            </Layout.Content>
        )
    }
}