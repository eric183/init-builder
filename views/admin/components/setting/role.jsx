import React from 'react';
import { Layout, Input, Button, Table, Select } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed } from 'mobx';

@observer
export default class Account extends React.Component {

    @computed get dataSource (){
        return mobx.toJS(this.props.store.settingRole.dataSource);
    }
    constructor(props){
         super(props);
    }
   
    state = {
         page : 1,
         limit : 10,
         count : 10
    }
    
    
    componentDidMount(){ 
            this.props.store.settingRole.getRoleData()
       }

   componentWillReceiveProps(nextProps){


          // console.log(this.props.history.location)
          // console.log(nextProps.location.search.slice(1));

   }


    render() {

        let {page,limit,count} = this.state;


        return (
            <Layout.Content className="common-content role-content setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        <Input.Search 
                            placeholder="请输入权限名称"
                            onSearch={value => console.log(value)}
                            style={{width: 300}}
                            enterButton/>
                        <Select style={{width: 110,marginLeft: "20px"}} allowClear>
                            <Select.Option value="0">所属平台</Select.Option>
                            <Select.Option value="1">趋势网</Select.Option>
                            <Select.Option value="2">管理后台</Select.Option>
                        </Select>
                    </div>
                    <div className="button-bar">
                        <Button type="primary" href="#setting-right/role/change">新增角色权限</Button>
                    </div>
                </div>
                <div className="table-content">
                <Table columns={[{
                            title: '权限名称',
                            dataIndex: 'name',
                        },{
                            title: '所属平台',
                            dataIndex: 'platform',
                        },{
                            title: '权限范围',
                            dataIndex: 'range',
                        },{
                            title: '更新时间',
                            dataIndex: 'time',
                        },{
                            title: '备注',
                            dataIndex: 'remarks',
                        }, {
                            title: '操作',
                            render: (text, record) => (
                                <span>
                                    <a href={`#setting-right/role/change?id=${record.id}`}>编辑</a>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.dataSource}
                        pagination={{
                                        current: page,
                                        pageSize: limit,
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        total : Number(count) | 0,
                                    showTotal: function(total,pageSize){
                                        return `共${Number(count)}条`
                                    },
                                    onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                
                                        // const params = this.state.params;
                
                                        //     params.page = pageNumber;
                
                                        // this.setState({
                                        //     page: pageNumber,
                                        //     params: params,
                                        // })
                                        // const location = this.props.location;
                                        // this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);
                
                                    },
                                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                
                                        // const params = this.state.params;
                
                                        // params.limit = pageSize;
                
                                        // this.setState({
                                        //     limit: pageSize,
                                        //     params:params
                                        // })
                
                                        // const location = this.props.location;
                                        // this.props.history.push(`${location.pathname}?${qs.stringify(params)}`);
                
                                    }
                                }}
                         />
                </div>
            </Layout.Content>
        )
    }
}