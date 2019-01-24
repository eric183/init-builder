import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import Addroles from './addRoles';
import AddPower from './addpower';
import {  Layout, Row, Col, Button,Input, Table, Switch ,Select   } from 'antd';
const Search = Input.Search;
const Option = Select.Option;



@observer
export default class RoleComponent extends Component {
        state = {
            selectedRowKeys : [],
            page : 1,
            limit : 50,
            visiable : false,
            order : '批量操作',
            title : undefined,
            confirmLoading: false,
            visiable_power: false,
            confirmLoading_power: false,
            role : undefined,  // 角色筛选
        }

   COLUMNS = [
             {
                title: '编号',
                dataIndex: 'id', 
                align : 'center',
                width : 100
             },
             {
                title: '角色名称',
                dataIndex: 'title', 
                align : 'center',
                width : 100
             },
             {
                title: '角色描述',
                dataIndex: 'app.descript', 
                align : 'center',
                width : 100
             },
             {
                title: '关联账号数',
                dataIndex: 'level', 
                align : 'center',
                width : 100
             },
             {
                title: '所属网站',
                dataIndex: 'scope', 
                align : 'center',
                width : 100
             },
             {
                title: '排序',
                dataIndex: 'sort', 
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
        ]




 // 搜索
 searchAction = ( value ) => {
            let { pathname, search } = this.props.location,
                  params = qs.parse(search.slice(1));
                  if( value ){
                     params.title = value;
                  }else{
                     params.title ? delete params.title : ''; 
                  }

            this.props.history.push( `${pathname}?${qs.stringify(params)}` );

            this.setState((state) => {
                         if( state.selectedRowKeys.length ) state.selectedRowKeys = [];
                         if( state.order != '批量操作' ) state.order = '批量操作';
                         return state;
                 });

             setTimeout(() => {
                    this.relaodAction( () => {  this.setState({ title : undefined })  } );
             }, 200)
          
     }


     
 // 选择角色
 selectedRole = ( value ) => {
    let  { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
       if( value ){
           params.role = value;
       }else{
           delete params.role;
           value = undefined; 
       }

      this.props.history.push( `${pathname}?${qs.stringify(params)}` );
      this.setState({ role : value });
      setTimeout(() => {
             this.relaodAction();
      }, 300)

 }
  
 show_role_modal = () =>{
      this.setState({  visiable : true })
 }


  // 新增，编辑角色
  onOk_role = ( values, form ) => {
       this.setState({ confirmLoading : true });
      this.props.store.roleStore.add_roles( values, () => {
            this.relaodAction();
            this.onCancel_role( form );
      })
  }

  onCancel_role = ( form ) => {
        this.props.store.roleStore.reset_addRolesInitialValue();
        form.resetFields(); 
        this.setState({  visiable : false, confirmLoading : false });
  }


  // 管理成员编辑框
  handleOK = ( ids ) =>{
       this.setState({ confirmLoading_power : true  });
       this.props.store.roleStore.set_roles( { staff_ids : ids  }, this.set_role_id, () => {
                 delete this.set_role_id;
                 this.setState({  visiable_power : false, confirmLoading_power : false });
                 this.relaodAction();
           });

  }


  handleCancel = () =>{
    delete this.set_role_id;
    this.setState({  visiable_power : false,  confirmLoading_power : false });
  }



  // 数据重载
  relaodAction = ( callback = function(){} ) => {
    let { pathname, search } = this.props.location,
         params = qs.parse(search.slice(1)); 
      let { page = this.state.page, limit = this.state.limit } = params;
      let p = {  page, limit };
             params.title ? p.title = params.title : '';
             params.role ? p.app_id = params.role : '';
      this.props.store.roleStore.requs_roles( p, callback); // 获取角色列表数据

  }

    // 应用
    execute_order = () => {
        let { selectedRowKeys, order }  = this.state;
         if( selectedRowKeys.length && this.order != '批量操作' ){
             let flag = true;
               switch( order ){
                   case 'yes' : this.table_enableAction( { id : selectedRowKeys, disabled : 0 } );
                   break;
                   case 'no' :  this.table_enableAction( { id : selectedRowKeys, disabled : 1 } );
                   break;
                   case 'delete' : this.props.store.roleStore.delete_nodes({ ids : selectedRowKeys }, this.relaodAction )  ;
                   break;
                   default : flag = false;
                   break;
             }
             flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
         }
    }



  /* table methods  start */




  // 启用、禁用
      table_enableAction( record ){
        let { id, disabled } = record;
        let param = { ids :  id instanceof Array ? id : [ id ] ,  disabled : disabled == '0' ? 1 : 0 };
        this.props.store.roleStore.set_desabled( param, this.relaodAction );
     }
  

      // table 多选框
      onSelectChange = (selectedRowKeys) => {
           this.setState({ selectedRowKeys });
      }


     // 编辑
     table_operation_edit = ( record ) => {
        this.props.store.roleStore.requs_power( { app_id : record.id } );  // 获取权限信息
        let { title, remarks, sort, app_id = [ '1' ], disabled, permission_ids = [] } = record;
        this.props.store.roleStore.setProperties('addRolesInitialValue',{ title, remarks, sort, app_id, disabled, permission_ids })
        this.setState({ visiable : true });

     }


     // 管理
     table_operation_role = ( record ) => {
            this.set_role_id =  record.id;
            this.setState({ visiable_power : true  });
     }



    // 页码改变的回调，参数是改变后的页码及每页条数
   table_onChange = ( pageNumber ) => {
    let  { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
            params.page = pageNumber;
            this.props.history.push( `${pathname}?${qs.stringify(params)}` );
           this.setState({ page : pageNumber }, this.relaodAction);
   }

     // pageSize 变化的回调 (改变每页显示条目数。)
   table_onShowSizeChange = ( current,pageSize ) => {
       let  { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
            params.limit = pageSize;
        this.props.history.push( `${pathname}?${qs.stringify(params)}` );
        this.setState({ limit : pageSize }, this.relaodAction)
   }

  /* table methods  end */


   componentDidMount(){
         // 检查url是否带有title
         let { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
        let { page = this.state.page, limit = this.state.limit  } = params;
        let p = { page, limit };
          params.role ? (  p.app_id = params.role, this.setState({ role :  params.role  }) ) : '';
          params.title ? p.title = params.title : '';

        let { roleStore } = this.props.store;
            roleStore.requs_roles( p ); // 获取角色列表数据
            roleStore.requs_power();  // 获取权限信息
            roleStore.requs_seleteRoles();
   }



   componentWillUnmount(){
        this.setState({ 
                selectedRowKeys : [],
                order : '批量操作', 
                searchValue : undefined
            });
    }




    render(){
        let { roleStore } = this.props.store;
        let seleteRoles = mobx.toJS( roleStore.get_seleteRoles ); 
        let rolesList =  mobx.toJS( roleStore.get_rolesList ); 
        let { page,limit, visiable , confirmLoading, selectedRowKeys, title, order, visiable_power, confirmLoading_power, role } = this.state;
        let count = roleStore.get_rolesList_count;

         return (
            <Layout.Content className="common-layout">
                        <Row className="common-panel">
                        <Col span={8}>
                            <Button type="primary" onClick={ this.show_role_modal }  style={{  marginRight : 15 }}  >新增角色</Button>
                            <Select defaultValue="筛选角色" 
                                      allowClear
                                     value={  role ? Number( role ) : '' }
                                     style={{  width : 120 }}
                                     onChange={ this.selectedRole } >
                                        {
                                            seleteRoles.map((item,index) => (
                                                <Option key={ index } value={ item.id }> { item.title } </Option>
                                            ))
                                        }
                               </Select>
                            </Col>

                        <Col span={ 4 } offset={ 12 } style={{ textAlign : 'right' }}>
                        <Search
                            value={ title }
                            placeholder="请输入角色名称"
                            onSearch={ this.searchAction }
                            onChange={ ( event ) => {  this.setState({ title : event.target.value })  } }  
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
                            dataSource={ rolesList }
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
                 
                 <Addroles
                       store={ this.props.store } 
                       location={ this.props.location }
                       visible={ visiable }
                       okAction={ this.onOk_role }
                       cancelAction={ this.onCancel_role }
                       confirmLoading={ confirmLoading }
                         />

                  <AddPower 
                          parentRef={ this }
                          store={ this.props.store } 
                          location={ this.props.location }
                          visible={ visiable_power  }
                          okAction={ this.handleOK }
                          cancelAction={ this.handleCancel }
                          confirmLoading={ confirmLoading_power }
                     />

             </Layout.Content> 
         )
    }
     
}