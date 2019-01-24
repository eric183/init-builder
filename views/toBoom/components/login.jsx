import React from 'react';
import { observer, Provider } from 'mobx-react';

import axios from 'axios';
import { MenuMoe } from '@/components/menu';
import { Modal } from '@/components/modal';

@observer
export default class loginOn extends React.Component {

    constructor(props) {
        super();
        
        let f = localStorage.getItem('formInfo'); // f = "{"username":"13245600000","password":"123456"}"
        //debugger

        let formInfo = !!f ? JSON.parse(f) : { username: '' , password: '' };
  
        this.state = {
            userName: formInfo.username,
            password: formInfo.password,
            loading: false,
            //isShow: false,
            rememberMe: !!f ? true : false,
            show: false,
            showLogin: false,
            showLoginErroMessage: '',
            errorText: {
                account: '',
                password: ''
            },
        }
    }

    MenuClick() {
        //console.log('6666');
        //debugger
        this.setState({
            //show: true
            show: !this.state.show
        })
    }
    
    
    inputHandler(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
        //console.log(event.target.value);
        //debugger
        if(event.target.dataset.type ==="userName") {
            this.state.errorText.account = '';
        }
        if(event.target.dataset.type ==="password") {
            this.state.errorText.password = '';
        }
    }

    //点击登录按钮
    postHandler() {
        // debugger
        // console.log('登录');
        //document.cookie = `userName=${this.state.userName}`;
        //document.cookie = `password=${this.state.password}`;
        // let errorUserText = "account-error";
        let formInfo = {
            username: this.state.userName,
            password: this.state.password
        }
         
        this.state.rememberMe ? localStorage.setItem('formInfo', JSON.stringify(formInfo)) : localStorage.setItem('formInfo', "");
        
        this.state.errorText.account = '';
        this.state.errorText.password = '';


        this.setState({ 
            loading: true,
            errorText: this.state.errorText
        });
        // debugger;
        // $.ajax({
        //     url: "http://service.wow-trend.test/api/login",
        //     method: 'post',
        //     data: {
        //         password: "123456"
        //     },

        // });
       

        if(!this.state.userName.trim()) {
            // alert('用户名不能为空')
            this.state.errorText.account = '请输入您的账号';
            this.setState({
                errorText: this.state.errorText  
            })
            return; 
        }
        
        if(!this.state.password.trim()) {
            // alert('密码不能为空')
            this.state.errorText.password = '请输入您的密码'
            
            this.setState({
                errorText: this.state.errorText  
            })
            
            return;
        }
       
        axios.post('/api/login', {
            username: this.state.userName,  
            password: this.state.password
            // password: this.state.password
        }).then(({data})=> {
            // console.log(data);
            // debugger;
            // this.setState({
            //     loading: false
            // })
            if(data.status_code == 407) {
                //alert(data.message);
                if(data.message == "您输入的账号不存在") {

                    // this.setState({
                    //     showLogin: true,
                    //     showLoginErroMessage: data.message
                    // });

                    this.state.errorText.account = data.message;
                    this.setState({
                        errorText: this.state.errorText  
                    });

                    return;
                }
                
                if(data.message == "您输入的密码有误") {

                    this.state.errorText.password = data.message;
                    this.setState({
                        errorText: this.state.errorText  
                    });

                    return;

                }
                


            } else {
                //获取登陆token成功
                
                // sessionStorage.setItem("loginToken", 'Bearer' + data.data);
                // debugger;

                this.props.RequestConfig.resetToken(data.data);
                
                // this.props.store.globalInfo.cubeToggle(false);

                this.props.store.globalInfo.setLogin(true);
                this.props.store.homePageInfo.getHomePageData();

                // alert('登录成功');
                // this.props.store.tools.message.success('登录成功(*^▽^*)');
            }
        }).catch(({data})=> {
            if(data.status_code != 200) {
                alert(data.message);
            }
            //console.log(response);
            // this.props.store.tools.message.error(response.statusText);
            // debugger
            // console.error(response.data.message, 54);
            // this.setState({
            //     loading: false,
            //     isShow: true
            // })
        }) 

    }
    handerKeydown = (e) => {
    //    console.error(73)
       if(e.keyCode === 13) {
           this.postHandler()
        }
    }

    handleRememberMe() {
        this.setState({
            rememberMe: !this.state.rememberMe
        })
    }


    componentDidMount(){
        // debugger;
        document.addEventListener("keydown",this.handerKeydown);
    }
    componentWillUmount(){
        //document.removeEventListener("keydown",this.handerKeydown);
    }
    componentWillReceiveProps() {
        // debugger;
    }



    render() {
        
        // let errorPassText = "password-error";
        
        
        return (
            <div className="login-on-content">
                <div className="left-top-bg">
                    <img src="/assets/toBoom/images/loginOn/loginLeftTopBg.png" alt=""/>
                </div>

                <div className="login-header">
                    <div className="login-header-left">
                        <img src="/assets/toBoom/images/loginOn/loginLogo.png" alt=""/>
                    </div>
                    <div className="login-header-right" onClick={this.MenuClick.bind(this)}>
                        <img src="/assets/toBoom/images/designManager/menubtn.png" alt=""/>
                        <MenuMoe show={this.state.show} store={this.props.store} close={x=> {this.setState({show: false}) }}/>
                    </div>
                </div>

                <div className="login-center">
            
                    <div className="account-number-area">

                        <div className="title-area">
                            <div className="login-title">
                                <img src="/assets/toBoom/images/loginOn/loginTitleBg.png" alt=""/>
                            </div>
                        </div>

                        
                        
                        <div className="account-name-area">
                            <div className="name-input-area area-error">
                                <i className="iconfont zhanghaoicon" ></i>
                                <input 
                                    type="text" 
                                    placeholder="请输入手机号码、邮箱或账号登录"
                                    name="userName"
                                    data-type="userName"
                                    value={this.state.userName}
                                    //value={13245600000}
                                    onChange={this.inputHandler.bind(this)}
                                />
                            </div>
                            <p className="account-error">{this.state.errorText.account}</p>
                        </div>

                        <p className="other-account">您可直接使用WOW-TREND账号登录</p>


                        <div className="password-area">
                            <div className="password-input-area area-error">
                                <i className="iconfont mimaicon" ></i>
                                <input 
                                    type="password"  
                                    name="password"
                                    placeholder="请输入密码"
                                    value={this.state.password}
                                    data-type="password"
                                    //value={123456}
                                    onChange={this.inputHandler.bind(this)}
                                />
                            </div>
                            <p className="password-error">{this.state.errorText.password}</p>
                        </div>

                        <div className="choice-area">
                            <a className="forget-password" href="http://www.wow-trend.com/join/findpwd/t/1/gender/2.shtm">忘记密码</a>
                            <p 
                                className="remember-me" 
                                onClick={this.handleRememberMe.bind(this)}
                            >
                                <i className={`iconfont ${this.state.rememberMe ? 'xuanze':'xuanzecopy'}`} style={{marginRight:7}}></i>
                                记住我
                            </p>
                        </div>

                        <div className="login-register-area">
                            {/* 登录 */}
                            <div 
                                className="login-button" 
                                onClick={this.postHandler.bind(this)}
                            >
                                <img src="/assets/toBoom/images/loginOn/loginBtn.png" alt=""/>
                            </div>
                            {/* 注册 */}
                            <div className="register-button">
                                <a href="http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml">
                                    <img src="/assets/toBoom/images/loginOn/registerBtn.png" alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-footer">
                    <p>Copyright © 2018 WOW-TREND. All Rights Reserved   深圳市星潮热点传播股份有限公司</p>
                </div>

                {/*  */}
                <Modal
                    show={this.state.showLogin}
                    text={this.state.showLoginErroMessage}
                    title="温馨提醒您"
                    onConfirm={()=>{this.setState({showLogin: false})}}
                    onCancel={()=>{this.setState({showLogin: false})}}
                    hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
            
            </div>
        )
    }
}