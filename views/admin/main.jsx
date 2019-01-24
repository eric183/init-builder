import 'antd/dist/antd.css';
import './styles/index.scss';
import 'nprogress/nprogress.css';
import 'slick-carousel/slick/slick.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RequestConfig from './config/request-config';


import Store from './store/index';
import Util from './util/util';
import productObject from './config/rules.js'; 

import Login from './components/login/login.jsx';

import Sider from './common/sider';
import Header from './common/header';
import BreadCrumb from './common/bread-crumb';
import { CubeLoading, SpinLoading} from './common/loading-tools';

import ActiveComponent from './config/ActiveComponent';

import { HashRouter as Router, Route, Link, withRouter, Switch } from 'react-router-dom';

import { Layout, Menu, Icon, LocaleProvider, Spin } from 'antd';

const { Content } = Layout;

import { observer, Provider } from 'mobx-react';
import { computed } from 'mobx';
// import { Spin, Alert, LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

// import _ from 'lodash';




 console.log(ENV);



// interface Props {
//     name?: string;
// }
@observer class Main extends React.Component {
    // constructor(props: object) {
        
    //     super()
    //     this.toggle = this.toggle.bind(this)
    // }
    @computed get Loading() {
        return Store.tools.loading;
    }
    @computed get isLogin() {
        return Store.globalInfo.isLogin;
    }
    state = {
        collapsed: false
        // isLogin: Store.globalInfo.isLogin
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    rebuildArray() {
        // var _obj;
        // var objArray = [];
        // function loop(data) {
            
        //         for(let i = 0; i < data.length; i++) {
        //             // if(_reg.test(data[i].baseUrl) || _reg.test(data[i].url)) {
        //                 _obj = {
        //                     name: data[i].name,
        //                     link: data[i].baseLink || data[i].link 
        //                 };
        //                 objArray.push(_obj);
        //                 // new_array.push(_obj);
        //                 if(!!data[i].items) {
        //                     loop(data[i].items);
        //                 }
        //         }    
            
        // }
        // debugger;
        // loop(productObject.devNav);
        // return objArray;
    }
    componentWillMount() {}

    componentDidMount() {
        Store.globalInfo.checkLogin();
    }

    render() {
      
        return (
            <Router hashType="noslash">
                <div className="root-content">
                    <CubeLoading store={Store} />

                    <LocaleProvider locale={zhCN}>
                        { !this.isLogin ? 
                            <Login store={Store} RequestConfig={RequestConfig} util={Util} /> : (
                            <Route render={(location)=> (

                                <Layout className="main-layout" hasSider={true}>

                                    {/* 导航区 */}
                                    <Sider  
                            
                                        collapsed={this.state.collapsed}
                                        store={Store} 
                                        Util={Util}
                                        // productObject={productObject}> 
                                        productObject={ENV == 'production' ? Store.globalInfo.productObject: productObject}> 
                                    </Sider>


                                
                                    {/* 内容区 */}
                
                                    <Layout className="container">
                                    
                                        <Header 
                                            store={Store} 
                                            style={{ background: '#fff', padding: 0 }}
                                            toggleHandler={this.toggle.bind(this)}
                                        >
                                            {/* <p className="header-class-manager">
                                                <a javascript="void(0)">内容管理</a>
                                                <a javascript="void(0)">运营管理</a>
                                            </p> */}
                                        </Header>
                
                                        {/* 面包屑 */}
                                        {/* <BreadCrumb {...location} productObject={this.rebuildArray()} /> */}
                
                                        {/* 页面组件 */}
                                        <Layout.Content className="common-content">
                                            <SpinLoading store={Store}>
                                                <ActiveComponent {...location} store={Store} util={Util} />
                                            </SpinLoading>
                                        </Layout.Content>
                                    </Layout>
                                </Layout>
                            )}/>)
                        }
                    </LocaleProvider>
                </div>
            </Router>
        )
    }
}



ReactDOM.render(<Main />, document.querySelector('#root'))