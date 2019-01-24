import React from 'react';
import { Layout } from 'antd'

export default class supper extends React.Component {
    componentDidMount() {
        console.log(this.props.location.search);
        console.log(this.props.Util.searchStr());

    }
    render() {
        return (
            <Layout.Content className="common-content">
                { this.props.location.search ? this.props.location.search.slice(1) : 'defaultSupper' }
            </Layout.Content>
        )
    } 
} 