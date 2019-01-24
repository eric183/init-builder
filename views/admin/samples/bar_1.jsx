import React from 'react';
import { Layout, Breadcrumb } from 'antd';

export default class Dynamic extends React.Component {
    functionReader(a,b,c,d) {
        console.log(a,b,c,d)
    }
    render() {
        const routes = [{
            path: 'index',
            breadcrumbName: '首页'
          }, {
            path: 'first',
            breadcrumbName: '一级面包屑'
          }, {
            path: 'second',
            breadcrumbName: '当前页面'
          }];
        return (
            <Layout.Content className="common-content">
                bar_1;
                <Breadcrumb itemRender={this.functionReader.bind(this)} routes={routes}/>
            </Layout.Content>
        )
    }
}