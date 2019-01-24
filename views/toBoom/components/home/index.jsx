import React, { Fragment } from 'react';
import { HomeLogo } from '@/components/slogen';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { Progress } from 'antd';
import HomePics from '@/views/toBoom/common/home-pics';
import { MenuMoe } from '@/components/menu';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import RequestConfig from '../../config/request-config';



@mobx.observer
export default class homePage extends React.Component {
    constructor(props) {
        super(props);
        //let ff = localStorage.getItem('loginToken');
        //debugger;
        this.state = {
            ...props,
            resizeHeight: 0,
            HomePics: HomePics, 
            belt: HomePics.belt, 
            neckline: HomePics.neckline,
            oversize: HomePics.oversize,
            placket: HomePics.placket,
            pocket: HomePics.pocket,
            sleeve: HomePics.sleeve,
            //showName: !!ff,
            showUserDes: false,
            show: false,


            // picArray: [{
            //     pic_name:'廓形',
            //     class_name:'oversize-area',
            //     pic_url:'/assets/toBoom/images/homePage/dressBg.png'
            // },{
            //     pic_name:'领子',
            //     class_name:'neckline-area',
            //     pic_url:'/assets/toBoom/images/homePage/collarBg.png'
            // },{
            //     pic_name:'袖子',
            //     class_name:'sleeve-area',
            //     pic_url:'/assets/toBoom/images/homePage/sleeveBg.png'
            // },{
            //     pic_name:'口袋',
            //     class_name:'pocket-area',
            //     pic_url:'/assets/toBoom/images/homePage/pocketBg.png'
            // },{
            //     pic_name:'腰带',
            //     class_name:'belt-area',
            //     pic_url:'/assets/toBoom/images/homePage/beltBg.png'
            // },{
            //     pic_name:'门襟',
            //     class_name:'placket-area',
            //     pic_url:'/assets/toBoom/images/homePage/clothButtonBg.png'
            // }]
        }
    }



    handlerMenu() {
        this.setState({
            //show: true
            show: !this.state.show
        })
    }

    setEvent() { 
        this.setState({
            resizeHeight: this.resizeAsA4(this.refs.homeLeft.clientWidth).height
        });
    }
  
    resizeAsA4(width) {
        //    let width = height / math.sqrt(2) 
        return {
            width: width,
            height: Math.sqrt(2) * width
        }
    }

    hintCompnent(userInfo) {
        let { role } = userInfo
        let txt = ''    
        if( role.length == 0 ) {
            txt = '';
        } else if( role.length == 1) {
            txt = '企业权限';
        } else {
            txt = '企业权限/个人权限';
        }        
        return txt 
    }
    

    componentDidMount() {


       // debugger
        // this.props.store.homePageInfo.getHomePagePicData();

        window.addEventListener('resize', this.setEvent.bind(this));
        this.setEvent();

        // debugger;
        
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setEvent.bind(this));
         
    }
    handlerLoginEvent() {
        //debugger;
        this.props.store.globalInfo.setLogin(false);
    }
    handlerExit() {
        // console.log('aaaa');
        // this.props.history.push("/login");
        this.props.store.globalInfo.setLogin(false);
        this.props.store.homePageInfo.clearList();
        localStorage.setItem('loginToken','');
        RequestConfig.resetToken('');

    }
    handlerStartDesign() {
        //this.props.history.push("/popular");

        let userInfo = this.props.store.homePageInfo.userInfo

        if(typeof userInfo.is_binding  === 'undefined'){
            event.preventDefault();
            // this.props.close()
            store.globalInfo.modalShow("请登录", 401);
            return false
        }else if(!userInfo.is_try && ! userInfo.is_binding){
            event.preventDefault();
            // this.props.close()
            store.globalInfo.modalShow("电脑未绑定!", 406)
            return false
        }else if(userInfo.category.length <= 0 ){
            event.preventDefault();
            // this.props.close()
            store.globalInfo.modalShow("未购买权限!", 403)
            return false
        }

        location.replace('#popular');
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
    changePictrueBinder(value) {
        this.state[value].unshift(this.state[value].pop());
        this.setState({[value]: this.state[value] });    
    }

    //点击每个小图标 后 更换 其对应的 中间的那个大图片
    handlerChangePic(event) {
        switch(event.currentTarget.dataset.type) {
            
            case 'oversize':
                this.changePictrueBinder('oversize');
            break;
            case 'neckline':
                this.changePictrueBinder('neckline');
            break;
            case 'sleeve':
                this.changePictrueBinder('sleeve');
            break;
            case 'pocket':
                this.changePictrueBinder('pocket');
            break;
            case 'belt':
                this.changePictrueBinder('belt');
            break;
            case 'placket':
                this.changePictrueBinder('placket');
            break;
            default:
            break;
        }
        
    }

    render() {
        //debugger
        //console.log(this.state.HomePics);
        //console.log(this.state.belt);
        var { userInfo, homePagePicList } = defaultMobx.toJS(this.props.store.homePageInfo);
        //console.log( 'userInfo的值是:'+ userInfo );
        //console.log(homePagePicList);
        //debugger;
        //console.log(this.state.showName);
        return(
            <div className="home-page-content">

                <div className="big-right-top">
                    <img src="/assets/toBoom/images/homePage/bigRightTop.png" alt=""/>
                </div>

               <div className="goToZoon">
                <a href="#/mascot">
                   <img src="/assets/toBoom/images/homePage/goToZoon.png" alt=""/>
                    </a>
                </div>

                <div className="home-header">

                    <HomeLogo />

                    <div className="home-header-right">
                       

                        {
                            userInfo.length == 0 ? (
                                <div className="home-btn">
                                    <span className="home-login" onClick={this.handlerLoginEvent.bind(this)}>登录</span>
                                    <i className="home-line">|</i>
                                    <a 
                                        className="home-register" 
                                        href="http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml"
                                    >
                                    注册
                                    </a>
                                </div>         
                               
                                ) : (
                                <Fragment>
                                    <div className="user-area" onMouseEnter={this.overUserDesc.bind(this)}>
                                        <i className="iconfont user" style={{fontSize:18}} ></i>
                                        <span className="home-user-name"> 
                                                {
                                                    userInfo.username && userInfo.username.length >= 20 ? userInfo.username.slice(0, 20) + '...' : userInfo.username
                                                }
                                        </span>
                                    </div>
                                    <div className={`user-desc ${this.state.showUserDes ? "showUserDes" :"hideUserDes"}`} onMouseLeave={this.outUserDesc.bind(this)}>
                                        <div className="user-header">
                                            <span className="userid-name" title={userInfo.username}>{userInfo.username}</span>
                                            <span className="user-exit" onClick={this.handlerExit.bind(this)}>退出</span>
                                        </div>
                                        <div className="user-info">

                                            <div className="user-power">

                                                <span>会员权限:</span>
                                               
                                                { 
                                                    userInfo.rolename && userInfo.rolename.length > 0 ? 
                                                        ( userInfo.rolename.length > 1 ?
                                                            (   
                                                                <Fragment>
                                                                    <span className="category" title={userInfo.belongs[0]}>
                                                                        {userInfo.rolename[0]}
                                                                    </span>
                                                                    <span className="category" title={userInfo.belongs[1]}>
                                                                        {`(${userInfo.rolename[1]})`}
                                                                    </span>
                                                                </Fragment>
                                                            ) :
                                                            (   
                                                                <span className="category" title={userInfo.belongs[0]}>
                                                                    {userInfo.rolename[0]}
                                                                </span>
                                                            )
                                                        ) :
                                                        (   
                                                            <span className="category">
                                                                无
                                                            </span>
                                                        )
                                                }    
                                            </div>

                                            <div className="works-situation">
                                                <span>作品数 {userInfo.works ? userInfo.works : 0} </span>
                                                <span style={{ display:'inline-block', width: 120, marginLeft: 5 }} >
                                                    <Progress percent={Number(userInfo.percent)} size="small" showInfo={false} />
                                                </span>
                                            </div>
                                            <div className="other-info">
                                                <div className="client-area">
                                                    <i className="iconfont kehuduan client-pic" ></i>
                                                    <a className="download-client" href="http://www.wow-trend.com/app/index/gender/2.shtml">下载客户端</a>
                                                </div>
                                                {
                                                    userInfo.is_binding === true ? (<div className="binding-computer">已绑定电脑</div>) : (<div className="binding-computer">未绑定电脑</div>)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            )

                        }

                    
                        <div className="home-menu"  onClick={this.handlerMenu.bind(this)}>
                            <img src="/assets/toBoom/images/designManager/menubtn.png" alt=""/>
                            <MenuMoe store={this.props.store} show={this.state.show} close={x=> {this.setState({show: false}) }}/>
                        </div>


                    </div>  

                </div>


                <div className="home-center">
                    <div className="home-center-left" style={{height: this.state.resizeHeight + 'px'}} ref="homeLeft">
                        <i></i>
                        <div className="cloth-picture">
                            {/* <img src="/assets/toBoom/images/homePage/cloth.png" alt=""/> */}
                            {/* <TransitionGroup> */}
                                {/* <CSSTransition classNames="transformrole" timeout={300}> */}
                                    <img src={this.state.sleeve[this.state.sleeve.length - 1]} alt=""/>
                                    <img src={this.state.oversize[this.state.oversize.length - 1]} alt=""/>
                                    <img src={this.state.placket[this.state.placket.length - 1]} alt=""/>
                                    <img src={this.state.pocket[this.state.pocket.length - 1]} alt=""/>
                                    <img src={this.state.neckline[this.state.neckline.length - 1]} alt=""/>
                                    <img src={this.state.belt[this.state.belt.length - 1]} alt=""/>
                                {/* </CSSTransition> */}
                            {/* </TransitionGroup> */}

                        </div>
                        <div className="neckline-area erea-move" data-type="neckline" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/collarBg.png" alt=""/>
                        </div>

                        <div className="oversize-area erea-move" data-type="oversize" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/dressBg.png" alt=""/>
                        </div>

                        <div className="belt-area erea-move" data-type="belt" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/beltBg.png" alt=""/>
                        </div>
                        <div className="sleeve-area erea-move" data-type="sleeve" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/sleeveBg.png" alt=""/>
                        </div>

                        <div className="pocket-area erea-move" data-type="pocket" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/pocketBg.png" alt=""/>
                        </div>
                        <div className="placket-area erea-move" data-type="placket" onClick={this.handlerChangePic.bind(this)}>
                            <img src="/assets/toBoom/images/homePage/clothButtonBg.png" alt=""/>
                        </div>
                    </div>
                    <div className="home-center-right">
                        <p className="english-name">DESIGNED BY YOU</p>
                        <p className="chinese-name">WOW托邦 — 由你设计</p>
                        <div className="start-design-box"  >
                            <div 
                                className="start-design-btn"
                                onClick={this.handlerStartDesign.bind(this)}
                            >
                                <img src="/assets/toBoom/images/homePage/startDesignBtn.png" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                

                <div className="home-footer">
                    <p>Copyright © 2018 WOW-TREND. All Rights Reserved   深圳市星潮热点传播股份有限公司</p>
                </div>


          
             
            </div>
        )
    }
} 