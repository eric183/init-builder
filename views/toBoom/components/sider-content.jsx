import React from 'react';
import {observer} from 'mobx-react';
import { Link } from 'react-router-dom';

@observer export default class Sider extends React.Component {
    state = {
        isClicked: false,
        hiddenUser: true
    }
    
    toggleHandler(event) {
        // debugger;
        // event.target.parentElement.classList.remove('no-animation');
        this.setState({
            isClicked: !this.state.isClicked
        })
        if(!this.state.isClicked) {
            this.refs.toggleContent.classList.remove('toggle-back');
            this.refs.toggleContent.classList.add('toggle-open');
            this.refs.arrowIcon.classList.add('arrow-open');
        } else {
            this.refs.arrowIcon.classList.remove('arrow-open');
            this.refs.toggleContent.classList.remove('toggle-open');
            this.refs.toggleContent.classList.add('toggle-back');
        }
        
    }
    removeAnimationHandler(event) {
        this.setState({
            isClicked: false
        })
        this.refs.arrowIcon.classList.remove('arrow-open');
        this.refs.toggleContent.classList.remove('toggle-open');
        this.refs.toggleContent.classList.add('toggle-back');
    }
   
    hiddenHistoryListener() {
        var { pathname } = this.props.location;
        
        
        switch(pathname) {
            case "/":
                return true;
            break;
            case "/home":
                return true
            break;
            case "/editor":
                return true;
            break;
            default:
                return false;   
        }
        
    }
    goExit() {
        localStorage.setItem("loginToken",  '');
        alert('退出成功');
        this.props.store.globalInfo.goLoginPage();
        this.props.history.push('/');
    }
    componentWillMount() {
        // console.log(location);
        // if(this.hiddenHistoryListener(this.props)) {
        //     this.setState({
        //         show
        //     })
        // };    
    }
    componentWillReceiveProps(nextProps) {

        // console.log(nextProps);
        // this.removeAnimationHandler(nextProps);
        // this.setState({
        //     isClicked: false
        // })
        this.toggleHandler();
    }
    componentDidMount() {
        // console.log('渲染');
    }
    mouseEnterBinder() {
        // debugger;
        if(!this.props.store.globalInfo.isLogin) return;
        this.setState({
            hiddenUser: false
        })
    }
    render() {
        // console.log('渲染');
        var { isLogin } = this.props.store.globalInfo; 
        // debugger;
        return (
            <div className="sider-content" style={{display: this.hiddenHistoryListener() && !!isLogin ? 'none' : "block"}}>
                
                <div className="logo" onClick={()=>{this.props.history.push('/')}}> 
                    <img src="/assets/images/wow_logo.png" />
                </div>

                <div className="common-toggle" style={{display: !isLogin ? 'none' : 'block'}}>
                    
                    <section style={{display: this.state.isClicked ? "block" : "none"}}>
                        <Link to={"/popular"}>流行解读</Link>
                        <Link to={"/category"}>分类检索</Link>
                        <a target="_blank" href="/#editor">我的设计</a>
                        {/* <Link to={"/editor"}>我的设计</Link> */}
                    </section>
                    <div className="toggle-content" ref="toggleContent">
                        <div className="click-area" onClick={this.toggleHandler.bind(this)}>
                            <i className="iconfont align"></i>
                        </div>
                        <i className="iconfont arrow-icon jiantou-copy" onClick={this.removeAnimationHandler.bind(this)} ref="arrowIcon"></i>
                    </div>
                    <div className="toggle-modal" style={{display: this.state.isClicked ? "block" : "none"}} onClick={this.removeAnimationHandler.bind(this)}></div>
                </div>
                <div 
                    className="bottom-group"
                    onMouseEnter={this.mouseEnterBinder.bind(this)} 
                    onMouseLeave={()=>{this.setState({hiddenUser: true})}} >
                    <span className="iconfont sider-user" style={{display: this.state.hiddenUser ? "block" : "none"}}>
                    </span>
                    
                    <div className="hidden-text" style={{display: this.state.hiddenUser ? "none" : "block"}}>
                        <p>用户名称</p>
                        <p onClick={this.goExit.bind(this)}>退出</p>
                    </div>
                    <div className="logo">
                        <img src="/assets/images/wow_trend_text.png" />
                    </div>
                </div>
            </div>
        )
    }
}