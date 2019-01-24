import React from 'react';
import { Layout, Table, Input, Select, Button, Pagination } from 'antd';

export default class Staff extends React.Component {
    componentDidMount() {
        // console.log(this.props.util.setQsInfo());
    }
    goPage(data) {
        // console.log(data);
        // this.props.util.setQsInfo()
        var qsInfo = this.props.util.setQsInfo({page: data});
        this.props.history.push('/setting-right/staff?' + qsInfo);
    }
    render() {
        const dataSource = [{
            key: '1',
            name: '胡彦斌',
            account: "renwenjun",
            stage: "产品",
            phonenumber: "1102819233",
            age: 32,
            department: "男装组",
            role: "主管",
            statue: "待激活",
            address: '西湖区湖底公园1号'
          },{
            key: '2',
            name: '胡彦祖',
            account: "renwenjun",
            stage: "产品",
            phonenumber: "1102819233",
            age: 42,
            department: "男装组",
            role: "主管",
            statue: "待激活",
            address: '西湖区湖底公园1号'
          }];
          
          const columns = [{
                title: '账号',
                dataIndex: 'account',
                key: 'account',
            }, {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: '职位',
                dataIndex: 'stage',
                key: 'stage',
            }, {
                title: '手机号',
                dataIndex: 'phonenumber',
                key: 'phonenumber',
            }, {
                title: '所属部门',
                dataIndex: 'department',
                key: 'department',
            }, {
                title: '所属角色权限',
                dataIndex: 'role',
                key: 'role',
            }, {
                title: '状态',
                dataIndex: 'statue',
                key: 'statue',
            }, {
                title: '操作',
                render: (text, record, index)=> (
                    <Button>详情</Button>
                )
            }
        ];
        return (
            <Layout.Content className="common-content staff-content">
                <header>
                    <div className="staff-filter">
                        <Input.Search  
                            placeholder="请输入姓名/手机号/用户名"
                            onSearch={value => console.log(value)}
                            style={{ width: 320 }} />
                        <Select defaultValue="jack" style={{ width: 120 }}>
                            <Option value="jack">全部部门</Option>
                            <Option value="lucy">技术支持组</Option>
                            <Option value="disabled">男装</Option>
                            <Option value="Yiminghe">女装</Option>
                        </Select>
                        <Select defaultValue="jack" style={{ width: 120 }}>
                            <Option value="jack">全部角色权限</Option>
                            <Option value="lucy">男装主管</Option>
                            <Option value="disabled">男装设计</Option>
                            <Option value="Yiminghe">女装主管</Option>
                        </Select>
                    </div>
           

                    <Button type="primary">新增账号</Button>

                </header>
                <Table dataSource={dataSource} columns={columns} pagination={false}/>

                
                <Pagination className="common-page" defaultCurrent={1} total={50} onChange={this.goPage.bind(this)}/>
            </Layout.Content>
        )
    }
}