import React, { Fragment } from 'react';
import mojs from 'mo-js';
import { createPortal } from 'react-dom';
import * as defaultMobx from 'mobx';
import * as mobx from 'mobx-react';
import { Progress } from 'antd';
//import RequestConfig from '../../config/request-config';
import RequestConfig from '../../views/toBoom/config/request-config';

import './index.scss';
import Store from "../../views/toBoom/store/store";

@mobx.observer
class MenuMoe extends React.Component {
    constructor(props) {
        super();
        this.escBack = this.escBack.bind(this);
        this.state = {
            show: false,
            showUserDes: false,
        }
        const V_OPTS = {
            fill: 'none',
            stroke: 'white',
            isTimelineLess: true
        }
        const DURATION = 900;

        this.openBackground = new mojs.Shape({
            className: 'shape-index',
            fill: '#f5e721',
            scale: {
                0: 20
            },
            left: 0,
            top: 0,
            isForce3d: true,
            isTimelineLess: true,
            radius: 200,
            easing: 'cubic.out',
            backwardEasing: 'cubic.in',
            // backwardEasing: 'expo.in',
            duration: 1.5 * DURATION,
            onStart(isForward) {
                // console.log(isForward);
            }
        });

        this.openTimeline = new mojs.Timeline({
            speed: 1.25
        });

        this.circle = new mojs.Shape({
            ...V_OPTS,
            left: '95%',
            top: '5%',
            radius: {
                0: 15
            },
            easing: 'cubic.out',
            strokeWidth: {
                5: 0
            },
            stroke: "#000",

            duration: 1.5 * DURATION,
            className: 'close-circle'
        });

        this.x = new mojs.Shape({
            ...V_OPTS,
            // top: "-70%",
            parent: this.circle.el,
            shape: 'cross',
            points: 50,
            radius: {
                0: 20
            },
            stroke: "#000",
            angle: 45,
            strokeWidth: {
                20: 5
            },
            // easing:   'cubic.out',
            duration: DURATION,
            delay: .4 * DURATION,
            className: 'haha'

        });

        this.closeCircle = new mojs.Shape({
            ...V_OPTS,
            left: '10%',
            // top: '-70%',
            radius: {
                0: 15
            },
            easing: 'cubic.out',
            strokeWidth: {
                5: 0
            },
            stroke: "#000",

            duration: 1.5 * DURATION,
            className: 'close-button',
            isShowEnd: false
        });

        this.closeX = new mojs.Shape({
            ...V_OPTS,
            parent: this.closeCircle.el,
            // top: '-70%',
            shape: 'cross',
            radius: {
                8: 0
            },
            // color: "#000",
            stroke: "#000",
            angle: 45,
            duration: DURATION,
            delay: .4 * DURATION,
            isShowStart: true
        });

        this.burst = new mojs.Burst({
            parent: this.circle.el,
            // top: "-70%",
            radius: {
                0: 30
            },
            stroke: "#000",
            children: {
                ...V_OPTS,
                shape: 'line',
                scaleY: 1,
            }
        });

    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true
        };
    }
    
    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
        // logErrorToMyService(error, info);
    }


    static getDerivedStateFromProps(props, state) {
        // debugger;
        return props;
    }
    componentDidUpdate(props) {
        // console.log(this.state.show);
        if (this.state.show) {

            var rects = this.refs.element.parentElement.getClientRects()[0];
            if(!this.openBackground._isShown) {
                // this.openBackground.tune({
                //     x: rects.x,
                //     y: rects.y
                // })
                this.openBackground.tune({
                    x: rects.left,
                    y: rects.top
                })
                this.openTimeline.replay();
                document.body.style.overflowY = 'hidden';
            }
        } else {
            //debugger;
            this.openBackground._isShown && this.openTimeline.playBackward();
            document.body.style.overflowY = 'auto';
        }

        return true;
    }
    goPage(event) {

        this.props.store && this.props.store.globalInfo.setLogin(true);
        // this.props.history.push('/')
        // this.props.close();
        // this.openTimeline.stop();

        // 2018-12-25 10:47 增加了 || event.currentTarget.dataset.type == 'popular' || event.currentTarget.dataset.type == 'stylegallery' 即点击 流行解读  款式图库 如果没有权限时 也跟 设计管理一样 没有权限时 弹出弹框提示。
        if(event.currentTarget.dataset.type == 'design/management' || event.currentTarget.dataset.type == 'popular' || event.currentTarget.dataset.type == 'stylegallery'){

            let userInfo = this.props.store.homePageInfo.userInfo

            // ```````````2018-12-18 14:55 lsh 注释掉的````start`````````````
            // if(typeof userInfo.is_binding  === 'undefined'){
            //     event.preventDefault();
            //     this.props.close()
            //     store.globalInfo.modalShow("请登录", 401);
            //     return false
            // }else if(! userInfo.is_binding){
            //     event.preventDefault();
            //     this.props.close()
            //     store.globalInfo.modalShow("电脑未绑定!", 406)
            //     return false
            // }
            // ```````````2018-12-18 14:55 lsh 注释掉的````end`````````````

            // ```````````2018-12-18 14:55 lsh 增加了 userInfo.is_try 的判断````start`````````````
            if(typeof userInfo.is_binding  === 'undefined'){
                event.preventDefault();
                this.props.close()
                store.globalInfo.modalShow("请登录", 401);
                return false
            }else if(!userInfo.is_try && ! userInfo.is_binding){
                event.preventDefault();
                this.props.close()
                store.globalInfo.modalShow("电脑未绑定!", 406)
                return false
            }else if(userInfo.category.length <= 0 && (event.currentTarget.dataset.type == 'popular' || event.currentTarget.dataset.type == 'stylegallery')){
                event.preventDefault();
                this.props.close()
                store.globalInfo.modalShow("未购买权限!", 403)
                return false
            }
            // ```````````2018-12-18 14:55 lsh 增加了 userInfo.is_try 的判断````end`````````````
        }

        
        if(location.hash.slice(1) == event.currentTarget.dataset.type) {
            // this.openTimeline.add(this.openBackground, this.closeX, this.burst, this.circle, this.x);
            
            this.props.close()

            return;
        }
        if(!event.currentTarget.dataset.type) {
            this.setState({
                show: false
            })
        } else {


            if(event.target.nodeName == 'IMG') {
                if(event.currentTarget.dataset.type == 'home') {
                    //debugger
                    location.hash = '/';
                } else {
                    location.hash = event.currentTarget.dataset.type;
                }
            }
        }
    }

    escBack(event) {
        // console.log(event.keyCode);
        if(event.keyCode == 27) {
            this.props.close();
        }
    }
    
    componentDidMount() {
        // debugger;
        this.openTimeline.add(this.openBackground, this.closeX, this.burst, this.circle, this.x);

        this.circle.el.addEventListener('click', ()=> {
            this.props.close()
        }, false)
        window.addEventListener('keyup', this.escBack, false);
        
        
        // window.openTimeline = openTimeline;
        window.openTimeline = this.openTimeline
        window.openBackground = this.openBackground;
    }
    componentWillUnmount() {
        // debugger
        window.removeEventListener('keyup', this.escBack, false);
        [this.openBackground, this.closeX, this.burst, this.circle, this.x].forEach((data)=> {
            data.el.remove();
        })
    }
    handleGoLoginPage(e) {
        //e.stopPropagation();
        // this.props.store.globalInfo.setLogin(false);
        this.props.store.globalInfo.setLogin(false);
    }
    handlerExit() {
        // console.log('aaaa');
        // this.props.history.push("/login");
        this.props.store.globalInfo.setLogin(false);
        this.props.store.homePageInfo.clearList();
        //localStorage.setItem('loginToken','');
        RequestConfig.resetToken('');
    }
    overUserDesc() {
        //console.log("aaaa");
        this.setState({
            showUserDes:true
        })
    }
    outUserDesc(event) {
        let _event = event;
        _event.stopPropagation();
        //console.log("bbb");
        this.setState({
            showUserDes: false
        })
    }

    // hintCompnent(userInfo) {
    //     let { role } = userInfo
    //     let txt = ''    
    //     if( role.length == 0 ) {
    //         txt = '';
    //     } else if( role.length == 1) {
    //         txt = '企业权限';
    //     } else {
    //         txt = '企业权限/个人权限';
    //     }    
    //     return txt 
    // }


    render() {
        var { userInfo } = defaultMobx.toJS(this.props.store.homePageInfo);
        //console.log(userInfo);
        return (
            <div ref="element" className="menu-stayer">
                {
                    createPortal(
                        <div className="menu-wrapper" style={{display: this.state.show ? 'flex' : 'none'}}>

                            <div className="menu-header">
                                <div className="menu-header-left">
                                    <img src="/assets/toBoom/images/loginOn/loginLogo.png" alt=""/>
                                </div>


                                <div className="menu-header-right">
                                {
                                    userInfo.length == 0 ? (
                                        <div className="menu-btn">
                                            <span className="menu-login" onClick={this.handleGoLoginPage.bind(this)}>登录</span>
                                            <i className="menu-line">|</i>
                                            <a className="menu-register"
                                                href="http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml"
                                            > 注册
                                            </a>
                                        </div>
                                    ) : (
                                        <Fragment>
                                            <div className="menu-user-area" onMouseEnter={this.overUserDesc.bind(this)}>
                                                <i className="iconfont user" style={{fontSize:18}} ></i>
                                                <span className="menu-user-name"> 
                                                        {
                                                            userInfo.username && userInfo.username.length >= 20 ? userInfo.username.slice(0, 20) + '...' : userInfo.username
                                                        }
                                                </span>
                                            </div>
                                            <div className={`menu-user-desc ${this.state.showUserDes ? "showUserDes" :"hideUserDes"}`} onMouseLeave={this.outUserDesc.bind(this)}>
                                                <div className="menu-user-header">
                                                    <span className="menu-userid-name" title={userInfo.username}>{userInfo.username}</span>
                                                    <span className="menu-user-exit" onClick={this.handlerExit.bind(this)}>退出</span>
                                                </div>
                                                <div className="menu-user-info">
                                                    <div className="menu-user-power">
                                                        <span>会员权限:</span>
                                                        {/* <span className="menu-category">{userInfo.role && userInfo.role.length > 0 ? userInfo.role : '无'}</span> */}
                                                        {/* <span 
                                                            className="menu-category" 
                                                            title={this.hintCompnent(userInfo)}
                                                        >
                                                            { userInfo.role && userInfo.role.length > 0 ?  
                                                                ( userInfo.role.length > 1 ? `${userInfo.role[0]}(${userInfo.role[1]})` : `${userInfo.role[0]}` ) 
                                                                : 
                                                                '无'
                                                            }
                                                        </span> */}
                                                        { 
                                                            userInfo.rolename && userInfo.rolename.length > 0 ? 
                                                                ( userInfo.rolename.length > 1 ?
                                                                    (   
                                                                        <Fragment>
                                                                            <span className="menu-category" title={userInfo.belongs[0]}>
                                                                                {userInfo.rolename[0]}
                                                                            </span>
                                                                            <span className="menu-category" title={userInfo.belongs[1]}>
                                                                                {`(${userInfo.rolename[1]})`}
                                                                            </span>
                                                                            
                                                                        </Fragment>
                                                                    ) :
                                                                    (   
                                                                        <span className="menu-category" title={userInfo.belongs[0]}>
                                                                            {userInfo.rolename[0]}
                                                                        </span>
                                                                    )
                                                                ) :
                                                                (   
                                                                    <span className="menu-category">
                                                                        无
                                                                    </span>
                                                                )
                                                        }    
                                                    </div>

                                                    <div className="menu-works-situation">
                                                        <span>作品数 {userInfo.works ? userInfo.works : 0} </span>
                                                        <span style={{ display:'inline-block', width: 120, marginLeft: 5 }} >
                                                            <Progress percent={Number(userInfo.percent)} size="small" showInfo={false} />
                                                        </span>
                                                    </div>
                                                    <div className="menu-other-info">
                                                        <div className="menu-client-area">
                                                            <i className="iconfont kehuduan menu-client-pic" ></i>
                                                            <a className="menu-download-client" href="http://www.wow-trend.com/app/index/gender/2.shtml">下载客户端</a>
                                                        </div>
                                                        {
                                                            userInfo.is_binding === true ? (<div className="menu-binding-computer">已绑定电脑</div>) : (<div className="menu-binding-computer">未绑定电脑</div>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                }
                                </div> 
                            </div>
                            


                            <div className="menu-center">

                                <div className="menu-item" 
                                    data-type="home" 
                                    onClick={this.goPage.bind(this)} 
                                    style={{transform: `translateY(${-100}px)`}}>
                                    
                                    <img src="/assets/toBoom/images/monster_4.png" />
                                    <section>
                                        <span>首页</span>
                                        <span>HOME</span>
                                    </section>
                                </div>
                                <div className="menu-item" 
                                    data-type="popular" 
                                    onClick={this.goPage.bind(this)} 
                                    style={{transform: `translateY(${100}px)`}}>
                                    
                                    <img src="/assets/toBoom/images/monster_2.png" />
                                    <section>
                                        <span>流行解读</span>
                                        <span>ANALYZE</span>
                                    </section>
                                </div>
                                <div className="menu-item" 
                                    data-type="stylegallery" 
                                    onClick={this.goPage.bind(this)} 
                                    style={{transform: `translateY(${-100}px)`}}>
                                    
                                    <img src="/assets/toBoom/images/monster_1.png" />
                                    <section>
                                        <span>款式图库</span>
                                        <span>MATCH</span>
                                    </section>
                                </div>
                                <div className="menu-item" 
                                    data-type="design/management" 
                                    onClick={this.goPage.bind(this)} 
                                    style={{transform: `translateY(${100}px)`}}>
                                    
                                    <img src="/assets/toBoom/images/monster_3.png" />
                                    <section>
                                        <span>设计管理</span>
                                        <span>WORKS</span>
                                    </section>
                                </div>

                            </div>

                            <div className="menu-footer">
                                <div className="menu-company">
                                    <p>Copyright © 2018 WOW-TREND. All Rights Reserved   深圳市星潮热点传播股份有限公司</p>
                                </div>
                                <div className="menu-share">
                                    <div className="menu-share-iconfont">
                                        <i className="iconfont home"></i>
                                        <i className="iconfont weibo"></i>
                                        <i className="iconfont WeChat"></i>
                                    </div>
                                    <p className="menu-company-link">by wow-trend.com</p>
                                </div>
                            </div>

                        </div>, document.body
                    )
                }
            </div>
        )
    }
} 

export { MenuMoe }