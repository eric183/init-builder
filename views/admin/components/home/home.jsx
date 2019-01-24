import React from 'react';
import { Modal, Cascader, Table, Button, Form, Input, Layout } from 'antd';
import axios from 'axios';
import * as mobx from 'mobx';
import qs from 'qs';
import { observer } from 'mobx-react'; 
// import InputTool from '../../components/input-tool';

@observer
class Home extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props);
    }
    render() {
        return (
            <Layout.Content className="common-content">
                Layout.Content
            </Layout.Content>
        )
    }
} 

export default Home;








