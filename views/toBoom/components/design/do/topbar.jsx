import React from 'react';
import { HomeLogo } from '@/components/slogen';
// import { MenuMoe } from '@/components/menu';
import { Tooltip } from 'antd';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import mojs from 'mo-js';



export default class TopBar extends React.Component {
    state = {
        show: false,
        tranY : '49px',  // 22px
        topMouseEnterImg: false
    }


    topBarBinder(event) {
        // debugger;
        //按钮置灰，不做向上处理
        if(event.target.dataset.active == 1) {
            this.props.topBarBinder(event);
        }


    }
    // 保存编辑图形新建作品
    saveBinder() {
        if(!this.checkPower()) return ;
        this.props.onSave();
    }
    clickBinder() {
        if(!this.checkPower()) return ;
        this.props.resetCanvases();
        // this.setState({
        //     show: true
        // })
    }

    // ```````````2018-12-18 11:31 lsh 注释掉的````start`````````````
    // checkPower(){
    //     let userInfo = store.homePageInfo.userInfo
    //     if(typeof userInfo.is_binding  === 'undefined'){
    //         store.globalInfo.modalShow("请登录", 401);
    //         return false
    //     }else if(! userInfo.is_binding){
    //         store.globalInfo.modalShow("电脑未绑定!", 406)
    //         return false
    //     }else if( userInfo.category.length == 0){
    //         store.globalInfo.modalShow("没有权限!", 403)
    //         return false
    //     }
    //     return true
    // }
    // ```````````2018-12-18 11:31 lsh 注释掉的````end`````````````
    // ```````````2018-12-18 11:35 lsh 增加了 userInfo.is_try 的判断````start`````````````
    checkPower(){
        let userInfo = store.homePageInfo.userInfo
        if(typeof userInfo.is_binding  === 'undefined'){
            store.globalInfo.modalShow("请登录", 401);
            return false
        }else if(!userInfo.is_try && ! userInfo.is_binding){
            store.globalInfo.modalShow("电脑未绑定!", 406)
            return false
        }else if( userInfo.category.length == 0){
            store.globalInfo.modalShow("没有权限!", 403)
            return false
        }
        return true
    }
    // ```````````2018-12-18 11:35 lsh 增加了 userInfo.is_try 的判断````end`````````````



    componentDidMount() {}
    render() {
        
        let { selectInfo, undo, redo } = this.props;
        // console.log(selectInfo);
        let objects = this.props.canvas.item ? this.props.canvas.getObjects() : 0;

        return (
            <div className="top-bar">
                <section>

                    <HomeLogo onClick={x=>{this.props.history.push('/')}}/>

                    <img 
                        style={{ transform : `translateY(${ this.state.tranY })` }}
                        className="pos" 
                        src="/assets/toBoom/images/monster_3.png"  
                        onMouseEnter={ (event) =>{  this.setState({ tranY : '22px', topMouseEnterImg: true })  } }
                        onMouseLeave={ (event) =>{  this.setState({ tranY : '49px', topMouseEnterImg: false })   }  }
                        onClick={ x=>{this.props.history.push('/design/management')}}
                    />

                    {this.props.children}

                    <TransitionGroup>
                        {
                            this.state.topMouseEnterImg ? (
                                <CSSTransition  
                                    classNames="picslide"
                                    timeout={300}
                                    unmountOnExit                                   
                                >
                                    <div className="top-bubble-box">
                                        <img src="/assets/toBoom/images/noviceGuide/top-bubble-back.png" alt=""/>
                                    </div>
                                </CSSTransition>
                            ) : ''
                        }
                    </TransitionGroup>
                    
                </section>
                <section onClick={this.topBarBinder.bind(this)}>
                    <Tooltip placement="bottom" title="撤销">
                        <i style={{color: undo.length > 1 ? "#000": "#999" }} data-length={undo.length} className="iconfont shejiye-fanhuiL" data-fire="undoBinder" data-active="1"></i>
                    </Tooltip>
                    <Tooltip placement="bottom" title="重做">
                        <i style={{color: redo.length > 0 ? "#000": "#999" }} className="iconfont shejiye-fanhuiR" data-fire="redoBinder" data-active="1"></i>
                    </Tooltip>
                    <Tooltip placement="bottom" title="水平翻转">
                        <i style={{color: selectInfo.objects.length > 0 ? "#000": "#999" }} className="iconfont shejiye-shuipingfanzhuan" data-fire="mirrorBinder" data-active="1"></i>
                    </Tooltip>

                     {/*  暂时隐藏 2018-11-27
                    
                        <Tooltip placement="bottom" title="放大">
                            <i className="iconfont shejiye-fangda" data-fire="enlargeBinder" data-active="1"></i>
                        </Tooltip>
                        <Tooltip placement="bottom" title="缩小">
                            <i className="iconfont shejiye-suoxiao" data-fire="scaleBinder" data-active="1"></i>
                        </Tooltip>
                
                    */}

                    <Tooltip placement="bottom" title="上移一层">
                        <i style={{color: objects.length > 1  && selectInfo.objects.length > 0 ? "#000": "#999" }} className="iconfont shejiye-shangyiceng" data-fire="upBinder" data-active="1"></i>
                    </Tooltip>
                    <Tooltip placement="bottom" title="下移一层">
                        <i style={{color: objects.length > 1  && selectInfo.objects.length > 0 ? "#000": "#999" }} className="iconfont shejiye-xiayiceng" data-fire="downBinder" data-active="1"></i>
                    </Tooltip>
                    <Tooltip placement="bottom" title="移除">
                        <i style={{color: selectInfo.objects.length > 0 ? "#000": "#999" }} className="iconfont shejiye-shanchu" data-fire="deleteBinder" data-active="1"></i>
                    </Tooltip>
                    <img className="design-top-bg" src="/assets/toBoom/images/design_bg.png"/>
                </section>
                <section>
                    <button style={{backgroundImage: `url(/assets/toBoom/images/create.png)`}} onClick={this.clickBinder.bind(this)}>
                        {/* <MenuMoe show={this.state.show} close={x=> {this.setState({show: false}) }}/> */}
                    </button>
                    <button style={{backgroundImage: `url(/assets/toBoom/images/save.png)`}} onClick={this.saveBinder.bind(this)}></button>
                    <button style={{backgroundImage: `url(/assets/toBoom/images/download.png)`}} onClick={this.props.onDownload.bind(this)}></button>
                </section>
            </div>
        )
    }
}