import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import AssociatedModal from './associatedModal';
import SetPassword from './setpassword';
import {  Layout, Row, Col, Button,Input, Table, Switch ,Select ,Modal  } from 'antd';
const Search = Input.Search;
const Option = Select.Option;


@observer
export default class AccountManagement extends Component {

    state = {
         page : 1,
         limit : 50,
         name : undefined,
         selectedRowKeys : [],
         order : '批量操作', 
         visiable : false, 
         confirmLoading  : false,  
         sVisiable : false, 
         sConfirmLoading  : false,  
    }

    account_id = undefined;  // 编辑数据id

    COLUMNS = [
        {
            title: '编号',
            dataIndex: 'id', 
            align : 'center',
            width : 40
         },
         {
            title: '手机号码',
            dataIndex: 'mobile', 
            align : 'center',
            width : 100
         },
         {
            title: '真实姓名',
            dataIndex: 'name', 
            align : 'center',
            width : 100
         },
         {
            title: '角色',
            dataIndex: 'roles.title', 
            align : 'center',
            width : 100,
            render: function(text, record){
                if( record.roles.length ){
                    return ( <p> { record.roles[0].title } </p> )   
                }else{
                    return ( <p></p> )
                }
            }
         },
         {
            title: '部门',
            dataIndex: 'depts.name', 
            align : 'center',
            width : 100,
            render: function(text, record){
                if( record.depts.length ){
                    return ( <p> { record.depts[0].title } </p> )   
                }else{
                    return ( <p> - </p> )
                }
            }
         },
        {
            title: '上传登录',
            dataIndex: 'user.last_login_time', 
            align : 'center',
            width : 100
         },
         {
            title: '登录次数',
            dataIndex: 'user.login_count', 
            align : 'center',
            width : 100
         },
         {
            title: '启用',
            align : 'center',
            width : 100,
            render: (text, record) => (
                <Switch checkedChildren="开" unCheckedChildren="关" onChange={ this.table_enableAction.bind(this, record ) }   
                   checked={  record.disabled == '0' ? true : false } />
            ),
        },
        {
            title: '操作',
            align : 'center',
            width : 100,
            render: (text, record) => (
                <div style={{width : '100%' }}>
                  <span style={{ cursor : 'pointer', marginRight: 5 }} onClick={ this.table_operation_edit.bind(this, record ) } >编辑</span>
                  <span style={{ cursor : 'pointer', marginLeft:5 }} onClick={ this.table_operation_role.bind(this, record ) } >管理成员</span> 
                </div>
               
            ),
        }

    ];



    
   // 数据重载
   relaodAction = ( callback = function(){} ) => {
    let { pathname, search } = this.props.location,
         params = qs.parse(search.slice(1)); 
      let { page = this.state.page, limit = this.state.limit } = params;
      let p = {  page, limit };
              params.name ? p.name = params.name : '';
       this.props.store.accountStore.requs_accounts( p, callback ); //获取账户数据 

  }





      // 应用
      execute_order = () => {
        let { selectedRowKeys, order }  = this.state;
         if( selectedRowKeys.length && this.order != '批量操作' ){
              let flag = true;
               switch( order ){
                   case 'yes' : this.table_enableAction( { id : selectedRowKeys, disabled : 1 } );
                   break;
                   case 'no' :  this.table_enableAction( { id : selectedRowKeys, disabled : 0 } );
                   break;
                   case 'delete' : this.props.store.accountStore.delete_nodes({ ids : selectedRowKeys }, this.relaodAction )  ;
                   break;
                   default : flag = false ;
                   break;
             }

             flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
                 
         }
    }




    show_role_modal = () =>{
        this.setState({ visiable : true });
         // 这里需要进行权限判断
        // Modal.error({
        //     width : 320,
        //     title: '信息提示',
        //     content: '您没有无权限！',
        //   });

    }

 
  // 搜索
  searchAction = ( value ) => {
      let { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
            if( value ){
               params.name = value;
            }else{
               params.name ? delete params.name : ''; 
            }

      this.props.history.push( `${pathname}?${qs.stringify(params)}` );

      this.setState((state) => {
                   if( state.selectedRowKeys.length ) state.selectedRowKeys = [];
                   if( state.order != '批量操作' ) state.order = '批量操作';
                   return state;
           });

   setTimeout(() => {
       this.relaodAction( () => { this.setState({ name : undefined }) } );
   }, 300)

      
}




// 设置密码
sHandleOK = ( values, form ) => {
      this.setState({ sConfirmLoading : true });
       this.props.store.accountStore.set_password({ id : this.account_id, password : values.newPassword } , () => {
                Modal.success({
                    title: '密码修改成功！',
                    content : '新密码已发送到用户手机上！',
                    width: 320
                });
              this.sHandleCancel( form );
       });
    
}

sHandleCancel = ( form ) => {
      this.account_id = undefined;
      form.resetFields(); 
      this.setState({ sVisiable : false, sConfirmLoading : false })
}











// 关联，编辑账号
// 200 => ok, 408 => 前台网站注册，后台已经关联过, 407 => 前台网站没注册过. 410 => 该员工不存在
handleOK = ( values, form ) => {
         this.setState({ confirmLoading : true });
         this.props.store.accountStore.assoctedAction( values, this.account_id, ( code   ) => {
                   if( code == 200 ){
                        this.handleCancel( form );
                        Modal.success({
                            title: '账号关联成功！',
                            width: 320
                        });
                   }else if( code == 408 ){
                       this.setState({ confirmLoading : false });
                        Modal.warning({
                            title: '关联后台账号失败！',
                            content: '该手机号码已经关联过后台账号',
                            width: 320
                        });
                   }else if( code == 407 ){
                    this.setState({ confirmLoading : false });
                        Modal.warning({
                            title: '关联后台账号失败！',
                            content: '该手机号码没在前台注册过账户',
                            width: 320
                        });
                }else if( code = 410 ){
                       this.setState({ confirmLoading : false });
                        Modal.warning({
                            title: '关联后台账号失败！',
                            content: '该员工不存在',
                            width: 320
                        }); 
                }


         })
   }
 
   handleCancel = ( form ) => {
       form.resetFields(); 
       this.setState(( state ) => {
           state.visiable = false;
           state.confirmLoading = false;
           return state;
       });
       this.props.store.accountStore.reset_aInitialValue();
       this.account_id = undefined;
   }




    /*  table methods start   */ 

    // 启用、禁用
    table_enableAction( record ){
        let { id, disabled } = record;
        let param = { ids : [ id ],  disabled : disabled == '0' ? 1 : 0 };
        this.props.store.accountStore.set_desabled( param, this.relaodAction );
     }




    table_operation_edit( record ){
         let { depts, disabled, mobile, name, roles  } = record;
         this.props.store.accountStore.setProperties('aInitialValue', {  depts, disabled, mobile, name, roles });
         this.account_id = record.id;
         this.setState({ visiable : true });
        // 这里需要进行权限判断
        // Modal.error({
        //     width : 320,
        //     title: '信息提示',
        //     content: '您没有无权限！',
        //   });

    }

    table_operation_role( record ){
          this.account_id = record.user.id;
          this.setState({ sVisiable : true });
    }


  
     // 页码改变的回调，参数是改变后的页码及每页条数
     table_onChange = (pageNumber) => {  
        let  { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
              params.page = pageNumber;
           this.props.history.push( `${pathname}?${qs.stringify(params)}` );
           this.setState({ page : pageNumber }, this.relaodAction)
  
       }

  
     // pageSize 变化的回调 (改变每页显示条目数。)
     table_onShowSizeChange = (current,pageSize) => {  
           let  { pathname, search } = this.props.location,
                  params = qs.parse(search.slice(1));
                  params.limit = pageSize;
              this.props.history.push( `${pathname}?${qs.stringify(params)}` );
              this.setState({ limit : pageSize }, this.relaodAction)

           }


      // table 多选框
      onSelectChange = (selectedRowKeys) => {
          this.setState({ selectedRowKeys });
     }



  /*  table methods end   */ 






  componentDidMount(){
            // 检查url是否带有pid
            let { accountStore  }  =  this.props.store;
            let { pathname, search } = this.props.location,
                params = qs.parse(search.slice(1));
            let { pid = 0, page = this.state.page, limit = this.state.limit  } = params;
            let parem = { pid, page, limit }
                params.name ? parem.name = params.name : '';
            // params.role ? p.app_id = params.role : '';

            accountStore.fetch_allroles();
            accountStore.fetch_alldepst();
            accountStore.requs_accounts( params ); //获取账户数据



  }


    render(){
         let { name, page,limit, order, selectedRowKeys, visiable, confirmLoading, sVisiable, sConfirmLoading  } = this.state;
         let { dataArry, count } = mobx.toJS( this.props.store.accountStore.get_accountList );
         
         


         return(
            <Layout.Content className="common-layout">
                <Row className="common-panel">
                <Col span={8}>
                    <Button type="primary" onClick={ this.show_role_modal }  style={{  marginRight : 15 }}  >关联账号</Button>
                    </Col>

                    <Col span={ 4 } offset={ 12 } style={{ textAlign : 'right' }}>
                    <Search
                        value={ name }
                        placeholder="请输入角色名称"
                        onSearch={ this.searchAction }
                        onChange={ ( event ) => {  this.setState({ name : event.target.value })  } }  
                        style={{ width: 200 }}
                    />
                </Col>
                </Row>


                  <Row className="common-panel">
                      <Col span={24}>
                         <Table 
                            scroll={{ y: 550 }}
                            rowSelection={{  selectedRowKeys,  onChange:  this.onSelectChange }} 
                            columns={ this.COLUMNS } 
                            dataSource={ dataArry }
                            pagination={{
                                pageSizeOptions: ['10','20', '30', '50'],
                                current: Number(page), 
                                pageSize: Number(limit),
                                showQuickJumper: true,
                                showSizeChanger: true,
                                total : Number(count) | 0,
                            showTotal: function(total,pageSize){
                                return `共${Number(count)}条`
                            },
                            onChange: this.table_onChange,
                            onShowSizeChange: this.table_onShowSizeChange
                            }} 
                            rowKey={'id'}
                       />

                    <div className="footer-panel">
                      <Select defaultValue="批量操作" style={{ width: 120, marginRight : 15 }} value={ order } onChange={( value ) => {  this.setState({ order : value })  } }>
                        <Option value="yes">启用</Option>
                        <Option value="no">禁用</Option>
                        <Option value="delete">删除</Option>
                        </Select>
                        <Button type="primary" onClick={ this.execute_order }>应用</Button>
                    </div>
                   </Col>
                 </Row>


                 <AssociatedModal
                         parentRef={ this }
                         store={ this.props.store } 
                         location={ this.props.location }
                         visible={ visiable  }
                         okAction={ this.handleOK }
                         cancelAction={ this.handleCancel }
                         confirmLoading={ confirmLoading }
                   />

                 <SetPassword 
                         store={ this.props.store } 
                         location={ this.props.location }
                         visible={ sVisiable  }
                         okAction={ this.sHandleOK }
                         cancelAction={ this.sHandleCancel }
                         confirmLoading={ sConfirmLoading }
                  />

             </Layout.Content>   
         )
    }
}