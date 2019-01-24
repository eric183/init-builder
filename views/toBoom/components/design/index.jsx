import React from 'react';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { Progress } from 'antd';
import { HomeLogo } from '@/components/slogen';
import { Modal }  from '@/components/modal';
import Store from "../../store/store";

@mobx.observer
export default class LeftPublicContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            selectAllworks: true,
            selectMycollection: false,
            selectRecyclebin: false,
            selectRecentlymodify: false,
            selectProductmana: false,
            showNoGoDesign: false,
            showNoGoDesignMessage: ''
        };
    }

    // componentDidMount() {
    //     //debugger
    //     this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();
    // }

    handleGoNewDesign(worksTotalNumberInfo,event) {
        //console.log(event.currentTarget.dataset.newdesign);
        //console.log(worksTotalNumberInfo.all_count);
        let userInfo = this.props.store.homePageInfo.userInfo
        // ```````````2018-12-18 14:38 lsh 注释掉的````start`````````````
        // if(typeof userInfo.is_binding  === 'undefined'){
        //     event.preventDefault();
        //     store.globalInfo.modalShow("请登录", 401);
        //     return false
        // }else if(! userInfo.is_binding){
        //     event.preventDefault();
        //     store.globalInfo.modalShow("电脑未绑定!", 406)
        //     return false
        // }
        // ```````````2018-12-18 14:38 lsh 注释掉的````end`````````````
        // ```````````2018-12-18 14:38 lsh 增加了 userInfo.is_try 的判断````start`````````````
        if(typeof userInfo.is_binding  === 'undefined'){
            event.preventDefault();
            store.globalInfo.modalShow("请登录", 401);
            return false
        }else if(!userInfo.is_try && !userInfo.is_binding){
            event.preventDefault();
            store.globalInfo.modalShow("电脑未绑定!", 406)
            return false
        }
        // ```````````2018-12-18 14:38 lsh 增加了 userInfo.is_try 的判断````end`````````````

        if(worksTotalNumberInfo.all_count <= worksTotalNumberInfo.use_count) {
            this.setState({
                showNoGoDesign: true,
                showNoGoDesignMessage: '作品数已达到上限'
            })
        }else {
            // console.log(location.hash);
            // location.hash = event.currentTarget.dataset.gonewdesign;
            // console.log(location.hash);

            //console.log(location);
            let {  origin, pathname } = location;
            window.open( origin + pathname  + '#' + event.currentTarget.dataset.gonewdesign  );
        }
 
    }
    

    replacePicture(string) {
        let object = {
            selectAllworks: false,
            selectMycollection: false,
            selectRecyclebin: false,
            selectRecentlymodify: false,
            selectProductmana: false
        }
        object[string] = true;
        this.setState(object);
    }

    handleGoPage(event) {
        //console.log(event.currentTarget.dataset.pagename);
        location.hash = event.currentTarget.dataset.pagename;
        
        //debugger;
        switch(event.currentTarget.dataset.pagename) {
            case 'design/management':
                this.replacePicture('selectAllworks');
            break;

            case 'design/my-collection':
                this.replacePicture('selectMycollection');
            break;

            case 'design/recycle-bin':
                this.replacePicture('selectRecyclebin');
            break;

            case 'design/recently-modify':
                this.replacePicture('selectRecentlymodify');
            break;

            case 'design/product-management':
                this.replacePicture('selectProductmana');
            break;

            default:
                console.log('no match');
            break;
        }
    }

    activeBinber(props) {
        switch (props.location.pathname.slice(1)) {
            case 'design/management':
                this.replacePicture('selectAllworks');
                break;

            case 'design/my-collection':
                this.replacePicture('selectMycollection');
                break;

            case 'design/recycle-bin':
                this.replacePicture('selectRecyclebin');
                break;

            case 'design/recently-modify':
                this.replacePicture('selectRecentlymodify');
                break;

            case 'design/product-management':
                this.replacePicture('selectProductmana');
                break;

            default:
                console.log('no match');
                break;
        }
    }
    componentDidMount() {
        // this.props.store.homePageInfo    .getHomePagePicData();
        this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();
        // console.log(this.props.location.pathname.slice(1));
        // console.log(this.props.location.pathname);
        this.activeBinber(this.props);      
    }   
    componentWillReceiveProps(nextProps) {
        this.activeBinber(nextProps);
    }


    render() {
        var { worksTotalNumberInfo, worksAllMessageInfo } = defaultMobx.toJS(this.props.store.worksTotalNumberInfo);
        //console.log(worksTotalNumberInfo);
        //console.log(worksAllMessageInfo);
        var { userInfo } = defaultMobx.toJS(this.props.store.homePageInfo);
        //console.log(userInfo);
        //console.log(homePagePicList);
        //debugger
        return (
            <div className="all-collection-content">
                <div className="left-public">
                    <div className="small-left-public"  style={{ paddingTop:50}}>

                        <HomeLogo />

                        <div 
                            className="new-design-btn" 
                            data-gonewdesign="design-do" 
                            onClick={this.handleGoNewDesign.bind(this,worksTotalNumberInfo)}
                        >

                            <img src="/assets/toBoom/images/designManager/leftPublic/newDesignBtn.png" alt=""/>
                        </div> 

                        <div className="all-picture-btn">

                            <div className="allworks-area" data-pagename="design/management" onClick={this.handleGoPage.bind(this)}>
                                <div className="allworks-pic">
                                    {/* <img src="/assets/toBoom/images/designManager/leftPublic/sallworkspic.png" alt=""/> */}
                                    <img src={`/assets/toBoom/images/designManager/leftPublic/${this.state.selectAllworks ? 'sallworkspic.png':'allworkspic.png'}`} alt=""/>
                                </div>
                                <p className="allworks-text">全部作品</p>
                            </div>

                            <div className="mycollection-area" data-pagename="design/my-collection" onClick={this.handleGoPage.bind(this)} >
                                <div className="mycollection-pic">
                                {/* <img src="/assets/toBoom/images/designManager/leftPublic/mycollectionpic.png" alt=""/> */}
                                    <img src={`/assets/toBoom/images/designManager/leftPublic/${this.state.selectMycollection ? 'smycollectionpic.png':'mycollectionpic.png'}`} alt=""/>
                                </div>
                                <p className="mycollection-text">我的收藏</p>
                            </div>

                            <div className="recyclebin-area" data-pagename="design/recycle-bin" onClick={this.handleGoPage.bind(this)}>
                                <div className="recyclebin-pic">
                                    {/* <img src="/assets/toBoom/images/designManager/leftPublic/recyclebinpic.png" alt=""/> */}
                                    <img src={`/assets/toBoom/images/designManager/leftPublic/${this.state.selectRecyclebin ? 'srecyclebinpic.png':'recyclebinpic.png'}`} alt=""/>
                                </div>
                                <p className="recyclebin-text">回收站</p>
                            </div>

                            <div className="recentlymodify-area" data-pagename="design/recently-modify" onClick={this.handleGoPage.bind(this)}>
                                <div className="recentlymodify-pic">
                                    {/* <img src="/assets/toBoom/images/designManager/leftPublic/recentlymodifypic.png" alt=""/> */}
                                    <img src={`/assets/toBoom/images/designManager/leftPublic/${this.state.selectRecentlymodify ? 'srecentlymodifypic.png':'recentlymodifypic.png'}`} alt=""/>
                                </div>
                                <p className="recentlymodify-text">最近修改</p>
                            </div>
                       
                                
                            { userInfo && (userInfo.role && userInfo.is_private) &&  ( 
                                <div 
                                    className="productmana-area" 
                                    data-pagename="design/product-management" 
                                    onClick={this.handleGoPage.bind(this)}
                                    
                                >
                                    <div className="productmanagement-pic">
                                        {/* <img src="/assets/toBoom/images/designManager/leftPublic/productmanapic.png" alt=""/> */}
                                        <img src={`/assets/toBoom/images/designManager/leftPublic/${this.state.selectProductmana ? 'sproductmanapic.png':'productmanapic.png'}`} alt=""/>
                                    </div>
                                    <p className="productmana-text">成品管理</p>
                                </div>) 
                            } 
                           
                  
                        </div>

                        <div className="left-footer">
                            <div className="left-footer-info">
                                <span>作品数 </span>
                                <i>{worksTotalNumberInfo.use_count}/{worksTotalNumberInfo.all_count}</i>
                                <div className="progress-area">
                                    <Progress percent={Number(worksTotalNumberInfo.percent)} showInfo={false}  status='success' />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                    <Modal
                        show={this.state.showNoGoDesign}
                        text={this.state.showNoGoDesignMessage}
                        title="温馨提醒您"
                        onConfirm={()=>{this.setState({showNoGoDesign: false})}}
                        onCancel={()=>{this.setState({showNoGoDesign: false})}}
                        hideCancel={true}
                        isAlert
                    ></Modal>

                    {this.props.children}
                
            </div>
        )
    }
}