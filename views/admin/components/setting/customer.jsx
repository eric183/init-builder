import React from 'react';
import { Layout, Input, Button, Table, Select, Modal } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed } from 'mobx';

import MemberTableComponent from './customer_table';

@observer
export default class SettingCustomer extends React.Component {

    @computed get customerData (){
        return mobx.toJS(this.props.store.settingRole.customerData);
    }


    constructor(props){
        super(props);
    }

    state = {
        visible : false,
        confirmLoading : false
    }



    handleOk = () => {    this.setState({'visible' : false})    }
    handleCancel = () => {  this.setState({'visible' : false})   } 


    memberDetail = (record) => {
        this.setState({'visible' : true})  
    }

    render() {
        return (
            <Layout.Content className="common-content setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        <Input.Search 
                            placeholder="请输入权限名称"
                            onSearch={value => console.log(value)}
                            style={{width: 300}}
                            enterButton/>

                        <Select style={{width: 110,marginLeft: "20px"}} allowClear>
                            <Select.Option value="0">全部会员权限</Select.Option>
                            <Select.Option value="1">男装VIP</Select.Option>
                            <Select.Option value="2">女装VIP</Select.Option>
                        </Select>

                        <Select style={{width: 110,marginLeft: "20px"}} allowClear>
                            <Select.Option value="0">账号状态</Select.Option>
                            <Select.Option value="1">正常</Select.Option>
                            <Select.Option value="2">禁用</Select.Option>
                        </Select>
                    </div>

                    <div className="button-bar">
                        <Button type="primary" href="#setting-right/role/change">新增客户</Button>
                    </div>
                </div>



                <div className="table-content">
                <Table columns={[{
                            title: '企业名称',
                            dataIndex: 'company_name',
                        },{
                            title: '账号',
                            dataIndex: 'account',
                        },{
                            title: '会员权限',
                            dataIndex: 'right',
                        },{
                            title: '会员期限',
                            dataIndex: 'deadline',
                        },{
                            title: '企业成员',
                            dataIndex: 'members',
                            render: (text, record,index) => (
                                <span>
                                    <a style={{'textDecoration' : 'underline'}} href='javascript:void(0)' onClick={ this.memberDetail.bind(this) } >{text}</a>
                                </span>
                            )
                        },
                        {
                            title: '联系人',
                            dataIndex: 'contacts',
                        },{
                            title: '联系方式',
                            dataIndex: 'contact_way',
                        }, {
                            title: '账号状态',
                            dataIndex: 'state',
                        }, {
                            title: '操作',
                            render: (text, record) => (
                                <span>
                                    <a href={`#setting-right/customer/editor?id=${record.id}`}>编辑</a>
                                </span>
                            )
                        }]}
                        rowKey="id"  
                        dataSource={this.customerData} />
                </div>

                <MemberdetailComponent {...this.props} {...this.state} handleOk={  this.handleOk.bind(this) } handleCancel={ this.handleCancel.bind(this) } />
                    
            </Layout.Content>
        )
    }
}




@observer class MemberdetailComponent extends React.Component {
    constructor(props){ super(props) }

     @computed get memberData (){
         return mobx.toJS(this.props.store.settingRole.memberData);
     }

 render(){
       return ( 
            <Modal title='查看企业成员'
                 visible={this.props.visible}
                 handleOk={this.props.handleOk }
                 confirmLoading={this.props.confirmLoading}
                 onCancel={ this.props.handleCancel }
                 className={'adder_pop'}
                 width={'85%'}
                 footer={ [
                     <Button key="back" onClick={this.props.handleCancel }>取消</Button>,
                     <Button key="submit" type="primary" loading={this.props.confirmLoading} onClick={ this.props.handleOk }>确定</Button>,
                 ]}>

                 <MemberTableComponent {...this.props} {...this.state} />
                 
            </Modal>
       )
 }
}

