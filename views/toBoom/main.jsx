import './styles/index.scss';

import 'antd/dist/antd.css';

import 'modules/nprogress/nprogress.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"
import Store from './store/store';

import qs from 'qs';

import { observer } from 'mobx-react'; 
import { computed } from 'mobx';


import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link, Switch, withRouter } from "react-router-dom";
// import _ from 'lodash';
import RequestConfig from './config/request-config';
import { CubeLoading } from './common/loading-tools';

import axios from 'axios';
import Util from 'util';

import Login from './components/login';

import Home from './components/home/index';

import Sider from './components/sider-content';

import Design from './components/design';

import DesignDo from './components/design/do';
import DesignManagement from './components/design/management';
import DesignRecycleBin from './components/design/recycle-bin';
import DesignRecentlyModify from './components/design/recently-modify';
import DesignMyCollection from './components/design/my-collection'; 
import DesignProductManagement from './components/design/product-management';


import PopularComponent from './components/popular/popularComponent';  
import PopularDetail from './components/popular/popularDetail';
import StyleGallery from './components/styleGallery/styleGallery';
import  WelcomeComponent from './components/home/welcome';
import ZooComponent from './components/zoo/monster';
import cookie from 'react-cookies'


import mojs from 'mo-js';

import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';

import { Modal } from '@/components/modal';

import { Alert } from 'antd';

// import { Switch } from 'antd';
window.Util = Util;
window.store = Store;

@observer
class Main extends React.Component {
    constructor(props) {
        super(props);
        // Util.fontInit(3.75);
        RequestConfig.setStore(Store);

        this.state = {
              showWarning : false
        }

    }
    
    @computed get isLogin() {
        // debugger;
        return Store.globalInfo.isLogin;
    }


    // 检查浏览器版本
    browser_check(){
            var browser = window.Util.sayswho().split(' ')[0];
            if( browser == 'IE' || browser == 'Edge' ){
                     this.setState({ showWarning : true })
            }
      }


    componentWillMount() {}
    
    componentDidMount() {

        // 检查浏览器版本
        this.browser_check( )

        /*
         *  checking Token whether effective
         *  created by Kuangkuang
         */
        const HREFTOKEN = /\?token\=.+/.exec(location.href);
        const TOKENKEEPER = qs.parse(HREFTOKEN && HREFTOKEN[0].slice(1));
        if(TOKENKEEPER.token) {
              RequestConfig.resetToken(TOKENKEEPER.token);
               history.replaceState({ page: history.length }, "",   location.origin + location.pathname + location.hash.replace(/\?token.+/, '') );
         
        } 

        
        
        
        // window.axios = axios;
        
        // debugger;
        //统一处理403报错
        // RequestConfig.errorHandler(()=> {
        //     Store.globalInfo.goLoginPage();
        // })

        const burst = new mojs.Burst({
            left: 0,
            top: 0,

            radius: {
                15: 50
            },
            children: {
                fill: ['deeppink', 'cyan', 'orange'],
            },
            isShowEnd: false,
            isSoftHide: false
        });

        window.addEventListener('click', function (e) {
            const coords = {
                x: e.pageX,
                y: e.pageY
            };

            burst.tune(coords);
            burst.play();
        }, false);
        Store.homePageInfo.getHomePageData();


    }
    scrollBinder() {
        this.setState({
            hasScroll: true
        })
    }
    handleConfirm() {console.log('aaa')
        if(Store.globalInfo.modalInfo.code == "401") {
            // this.refs.clickRef.click();
            Store.globalInfo.setLogin(false);
            Store.globalInfo.modalHide();
        }else if(Store.globalInfo.modalInfo.code == "409") {

            Store.globalInfo.modalHide();
            Store.homePageInfo.clearList();
            RequestConfig.resetToken('');
            cookie.remove('loginToken')
            Store.globalInfo.setLogin(false);
        } else {
            Store.globalInfo.modalHide();
            this.refs.clickRef.click();
            // location.href = "http://www.wow-trend.com/app/index/gender/2.shtml";
        }
    }

    // handlerCancel() {
    //     if(Store.globalInfo.modalInfo.code == "401") {
    //         //location.href = "http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml";
    //     } else {
    //         // Store.globalInfo.setLogin(false);
    //         Store.globalInfo.modalHide();
    //     }
    // }
    handlerCancel() {
        if(Store.globalInfo.modalInfo.code == "401") {
            //location.href = "http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml";
            Store.globalInfo.modalHide();
        }else if(Store.globalInfo.modalInfo.code == "409") {
            Store.globalInfo.setLogin(false)
            cookie.remove('loginToken')
            Store.globalInfo.modalHide();
            this.refs.goHome.click();
        }else{
            Store.globalInfo.modalHide();
        }
    }





    render() {

        // var SiderComponent = withRouter(Sider);

        let LoginComponent = withRouter(Login);
        let infoText = () => {
            let code = Store.globalInfo.modalInfo.code;
            if(code == 401) {
                return "未登录";
            } else if(code == 406) {
                return "电脑未绑定";
            } else {
                let type = Store.globalInfo.currentCategary?Store.globalInfo.currentCategary+'品类':'';
                return "未购买"+type+"会员";
            }
        };


   
        return (
            <Router hashType="noslash">
                <div className="root-wrapper" >
                    {/* <CubeLoading store={Store} />  onScroll={this.scrollBinder.bind(this)}  */}

                    {/* <SiderComponent store={Store}/>  */}
                    
                    <Alert
                        style={{ display : this.state.showWarning ? 'block' : 'none' }}
                        message="温馨提示"
                        description="推荐使用Chrome、Firefox 或 360浏览器极速模式进行访问"
                        type="warning"
                        showIcon
                        closeText="知道了" 
                        className="browser-alert"
                        afterClose={( event ) =>{  this.setState({ showWarning : false }) }}
                        />



                    {Store.globalInfo.modalInfo.code == 409?(
                        <Modal
                            title={ "下线通知" }
                            show={ Store.globalInfo.modalInfo.showAlert }
                            confirmText={ Store.globalInfo.modalInfo.confirmText }
                            onCancel={  this.handlerCancel.bind(this)  }
                            onCross = {this.handlerCancel.bind(this)}
                            onConfirm={this.handleConfirm.bind(this)}
                            confirmText={  "重新登录"}
                            cancelText="确认"
                            // isAlert
                            hideCancel={ Store.globalInfo.modalInfo.code != 409 }
                            isSubmit={ false }
                            handleCross = {true}
                        >
                            <div className="right-alert-content">
                                <h3>您的账号已在别处登录</h3>
                                <a ref="goHome" href="/"></a>
                                <a ref="clickRef" href="http://www.wow-trend.com/app/index/gender/2.shtml" target="_blank"></a>
                            </div>
                        </Modal>):(<Modal
                        title={ Store.globalInfo.modalInfo.code == 401 ? "请登录" : (Store.globalInfo.modalInfo.code == 409?"下线通知":"下载客户端") }
                        show={ Store.globalInfo.modalInfo.showAlert }
                        confirmText={ Store.globalInfo.modalInfo.confirmText }
                        onCancel={  this.handlerCancel.bind(this)  }
                        onConfirm={this.handleConfirm.bind(this)}
                        onCross = {this.handlerCancel.bind(this)}
                        confirmText={ Store.globalInfo.modalInfo.code == 401 ? "登录" : (Store.globalInfo.modalInfo.code == 409?"登录":"下载客户端")}
                        cancelText="注册"
                        // isAlert
                        hideCancel={ Store.globalInfo.modalInfo.code != 401 }
                        isSubmit={ true }
                        handleCross = {true}
                    >
                        <div className="right-alert-content">
                            <h3>您正在使用的是收费内容，由于您<span className="pink-text">{ infoText() }</span>，暂时无权限查看</h3>
                            <p>请联系您的资讯顾问购买后进行电脑授权，或拨打<span className="orange-text">400-061-0662</span>咨询</p>

                            <a ref="clickRef" href="http://www.wow-trend.com/app/index/gender/2.shtml" target="_blank"></a>
                        </div>
                    </Modal>)}
                    { 
                        !this.isLogin ? <LoginComponent store={Store} RequestConfig={ RequestConfig } util={ Util } /> : (
                            <Switch>
                                <Route exact path="/" render={(location)=> (
                                    <Home store={Store} location={location} />
                                )} />
                                
                                <Route exact path="/welcome" render={(location)=> (
                                    <WelcomeComponent store={Store} location={location} />
                                )} />



                                 <Route exact path="/mascot" render={(location)=> (
                                    <ZooComponent store={Store} location={location} />
                                )} />



                                {/* <Route exact path="/home" render={({history})=> (
                                    <Home store={Store} history={history} />
                                )} /> */}

                                    
                                <Route exact path="/popular" render={(location)=> (
                                    <PopularComponent store={Store} location={location} />
                                )} />

                                <Route exact path="/populardetail/:category/:id/:index/:tag" render={(location)=> (
                                    <PopularDetail store={Store} location={location} />
                                )} />

                                <Route exact path="/styleGallery" render={(location)=> (
                                    <StyleGallery store={Store} location={location} />
                                )} />
                                
                                <Route path="/design-do"  render={(location) => (
                                    <DesignDo store={Store} {...location} />)
                                }/>

                                {/* 设计管理--BEGIN */}
                                <Route path="/design" render={({location})=> (
                                    <Design store={Store} location={location}>
                                        <TransitionGroup>
                                            <CSSTransition key={location.pathname} classNames="transformrole" timeout={300}>
                                                <Switch location={location}>
                                                    <Route path="/design/management" render={(location)=> (
                                                        <DesignManagement store={Store} />
                                                    )} />
                                                    {/* <Route path="/design/management" render={(location)=> (
                                                        <DesignManagement store={Store} />
                                                    )} /> */}
                                                    <Route path="/design/recycle-bin" render={(location)=> (
                                                        <DesignRecycleBin store={Store} />
                                                    )} />
                                                    <Route path="/design/recently-modify" render={(location)=> (
                                                        <DesignRecentlyModify store={Store} />
                                                    )} />
                                                    <Route path="/design/my-collection" render={(location)=> (
                                                        <DesignMyCollection store={Store} />
                                                    )} />
                                                    <Route path="/design/product-management" render={(location)=> (
                                                        <DesignProductManagement store={Store}  location={location} />
                                                    )} />
                                                </Switch>
                                            </CSSTransition>

                                        </TransitionGroup>
                                        
                                    </Design>
                                )} />
                                {/* 设计管理--END */}
                                

                            </Switch>
                         )
                    } 
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<Main />, document.querySelector('#root'))