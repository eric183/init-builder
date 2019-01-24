import React from 'react';
import { Layout, Input, Button, Table, Select, Modal } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed } from 'mobx';

@observer class MemberTableComponent extends React.Component {
    constructor(props){ super(props) }

     @computed get memberData (){
         return mobx.toJS(this.props.store.settingRole.memberData);
     }

 render(){
       return (
        <div style={{maxHeight: '600px',overflow:'auto'}}> 
        <Table className="customer-table" 
                scroll={{ y: 550}}
                columns={[
                    {
                        title: '姓名',
                       dataIndex: 'name',  
                        width : '9%',
                        align:'center'
                    },
                    {
                        title: '职位',
                       dataIndex: 'post',  
                       width : '9%',
                        align:'center'  
                    },
                    {
                        title: '账号',
                       dataIndex: 'account',   
                       width : '9%',
                        align:'center' 
                    },
                    {
                        title: '绑定手机',
                       dataIndex: 'tel',  
                       width : '9%',
                        align:'center'  
                    },
                    {
                        title: '内容权限',
                       dataIndex: 'content_right',  
                       width : '9%',
                        align:'center'  
                    },
                    {
                        title: '管理权限',
                       dataIndex: 'manage_right',   
                       width : '9%',
                        align:'center' 
                    },
                    {
                        title: '绑定方式',
                        dataIndex: 'way',   
                        width : '9%',
                         align:'center' 
                    },
                    {
                        title: '状态',
                       dataIndex: 'state', 
                       width : '9%',
                        align:'center'   
                    },
                    {
                        title: '操作',
                        width : '9%',
                        align:'center',   
                        render: (text, record) => {
                              if(true){
                                  return (
                                    <span className="table-cell-btns">
                                        <a href='javascript:void(0)'>改权限</a>
                                        <a href='javascript:void(0)'>设为管理员</a>
                                        <a href='javascript:void(0)'>登录日志</a>
                                   </span>
                                  )
                              }else{
                                (   <span>
                                    <a href='javascript:void(0)'>删除</a>
                               </span> )
                              }
                        }
                    }
                ]} 
                dataSource={this.memberData} 
                pagination={ false }
                loading={ false }
                rowKey={ () => Math.ceil(Math.random() * 123425)  }
                />
            </div>
       )
 }
}


export default MemberTableComponent;