import * as React from 'react';
import { withRouter } from 'react-router-dom';

import { Layout, Icon} from 'antd';
// import DefaultNav from './nav';
import DefaultNav from './nav';

const { Sider } = Layout;


export default class SiderContent extends React.Component {
    componentDidMount() {
        // console.log(this.props.collapsed);
    }
    render() {
        var Nav = withRouter(DefaultNav);

        return (
            <Sider
                className="sider-style"
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}>
                <div className="logo">
                    logo
                </div>
                <Nav 
                    Store={this.props.Store} 
                    productObject={this.props.productObject}  
                    collapsed={this.props.collapsed} />
            </Sider>
        )
    }
}