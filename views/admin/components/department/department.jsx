import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import AddDepart from './adddepart';
import DepartModal from './departModal';
import {  Layout, Row, Col, Button,Input, Table, Switch ,Select   } from 'antd';
const Search = Input.Search;
const Option = Select.Option;


@observer
export default class Department extends Component {

        state = {
            pid : 0, // 0代表最顶层节点，创建子节点，该值为指定节点ID
            title : undefined,
            selectedRowKeys : [],
            page : 1,
            limit : 50,
            visiable : false,
            order : '批量操作',
            confirmLoading: false,
            visiable_m: false,
            confirmLoading_m: false,
            edit_title : '新增部门'
        }

        COLUMNS = [
            {
                title: '编号',
                dataIndex: 'id', 
                align : 'center',
                width : 40
             },
             {
                title: '部门名称',
                dataIndex: 'title', 
                align : 'center',
                width : 100,
                render:(text, record) => (
                    <span style={{ cursor : 'pointer' }} onClick={ this.table_goIntoAction.bind(this, record ) } > { text } </span>
                )
             },
             {
                title: '职能描述',
                dataIndex: 'desc', 
                align : 'center',
                width : 100
             },
             {
                title: '当前部门人数',
                dataIndex: 'self_satffs_count', 
                align : 'center',
                width : 100
             },
             {
                title: '总人数（含下属部门）',
                dataIndex: 'depts_staff_count', 
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

        ];


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
                 case 'delete' : this.props.store.departStore.delete_nodes({ ids : selectedRowKeys }, this.relaodAction )  ;
                 break;
                 default : flag = false ;
                 break;
           }
           flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
       }
  }



   // 返回上级
  goBack = () =>{
   let { pathname, search } = this.props.location,
         params = {};
    // 选用第一个数据的pid【 因为pid都是相同 】
    let {  dataArry  } = mobx.toJS( this.props.store.departStore.get_departsList);
       dataArry.length <= 0 ?  dataArry = [ { pid : 0 } ] : '';
  if( dataArry[0].pid == 0 ){ // 最顶层节点
           params.pid = 0;
           params.page = 1;
           params.limit = this.state.limit;
          this.props.history.push( `${pathname}` );
  }else{
         // 把pid存到路由
           params.pid = dataArry[0].pid;
           params.page = 1;
           params.limit = this.state.limit;
          this.props.history.push( `${pathname}?${qs.stringify(params)}` );
  }
   // 请求节点列表数据
   this.props.store.departStore.requs_departs( params , () => {  
             this.setState(params) 
        }); 

 } 



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
       this.relaodAction( () => { this.setState({ title : undefined }) } );
   }, 300)

      
}



   // 数据重载
   relaodAction = ( callback = function(){} ) => {
      let { pathname, search } = this.props.location,
           params = qs.parse(search.slice(1)); 
        let { page = this.state.page, limit = this.state.limit, pid = 0 } = params;
        let p = {  page, limit, pid };
                params.title ? p.title = params.title : '';
               // params.role ? p.app_id = params.role : '';
         this.props.store.departStore.requs_departs( p, callback ); // 请求列表数据  
  
    }





 show_role_modal = () => {
      this.setState({  visiable : true })
 }



  // 新增，编辑部门  
  handleOK = ( values, form ) => {
   this.setState({ confirmLoading : true });
        this.props.store.departStore.add_departs( values, () => {
                  this.handleCancel( form );
                  this.relaodAction();
        })
  }

  handleCancel = ( form ) => {
      form.resetFields(); 
      this.setState(( state ) => {
          state.visiable = false;
          state.confirmLoading = false;
          state.edit_title != '新增部门' ?  state.edit_title = '新增部门' : '';
          return state;
      });
      this.props.store.departStore.reset_departInitialValue();
  }




 // 管理成员编辑框
  handleOK_m = ( ids ) =>{
   this.setState({ confirmLoading_m : true  });
   this.props.store.departStore.set_member( { ids : ids  }, this.set_member_id, () => {
             this.relaodAction();
             this.handleCancel_m();
       });

}


handleCancel_m = () =>{
      delete this.set_member_id;
      this.setState({  visiable_m : false,  confirmLoading_m : false });
}






    /*  table methods start  */ 

      // 进入子部门
      table_goIntoAction( record ){
         let { id } = record;
      // 把pid存到路由
      let { pathname, search } = this.props.location,
               params = {
                  pid : id,
                  page : 1,
                  limit : this.state.limit
               };
         this.props.history.push( `${pathname}?${qs.stringify(params)}` );
               // 请求节点列表数据
             this.props.store.departStore.requs_departs( params, () => {  
                this.setState({...params,
                           selectedRowKeys : [],
                           order : '批量操作',
                           title : undefined,
                         })
               } );
               
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



    // 启用、禁用
    table_enableAction( record ){
         console.log( record )
         let { id, disabled } = record;
         let param = { ids : [ id ],  disabled : disabled == '0' ? 1 : 0 };
         this.state.pid != 0 ? param.pid = this.state.pid : '';
         this.props.store.departStore.set_desabled( param, this.relaodAction );

}


    table_operation_edit( record ){
          let { title, desc, pid, sort, disabled, permission_ids = undefined } = record;
            this.props.store.departStore.setProperties('departInitialValue', { title, desc, pid, sort, disabled, permission_ids });
            this.setState({ visiable : true, edit_title : '编辑部门' });

    }


  
     // 管理
     table_operation_role = ( record ) => {
            this.set_member_id =  record.id;
            this.setState({ visiable_m : true  });
      }



      // table 多选框
     onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
     }

    /*  table methods end  */ 




    componentDidMount(){
           // 检查url是否带有pid
      let { departStore, roleStore }  =  this.props.store;
      let { pathname, search } = this.props.location,
             params = qs.parse(search.slice(1));
      let { pid = 0, page = this.state.page, limit = this.state.limit  } = params;
      let parem = { pid, page, limit }
                  params.title ? parem.title = params.title : '';
               // params.role ? p.app_id = params.role : '';

           // 请求列表数据
          departStore.requs_departs( parem , () => {  this.setState({ page : parem.page, limit : parem.limit, pid : parem.pid }); }); 
         
           roleStore.requs_power();  // 获取权限信息 【 调用 roleStore 方法 】

           departStore.requs_deptsTree(); // 获取上级部门
    }



         render(){

              let { visiable_m, confirmLoading_m, pid , selectedRowKeys, page, limit, order, title, confirmLoading, visiable, edit_title } = this.state;
              let {  dataArry, count  } = mobx.toJS( this.props.store.departStore.get_departsList);


              return (
                <Layout.Content className="common-layout">

                      <Row className="common-panel">
                        <Col span={8}>
                           <Button  onClick={ this.goBack } style={{ display : pid != 0 ? 'inline-block' : 'none', marginRight : 15 }}>返回上一级</Button>
                            <Button type="primary" onClick={ this.show_role_modal }  style={{  marginRight : 15 }}  >新增部门</Button>
                            </Col>

                         <Col span={ 4 } offset={ 12 } style={{ textAlign : 'right' }}>
                          <Search
                                value={ title }
                                placeholder="请输入部门名称"
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


                 <DepartModal 
                          parentRef={ this }
                          store={ this.props.store } 
                          location={ this.props.location }
                          visible={ visiable_m  }
                          okAction={ this.handleOK_m }
                          cancelAction={ this.handleCancel_m }
                          confirmLoading={ confirmLoading_m }
                     />

                 <AddDepart  
                        parentRef={ this }
                        store={ this.props.store } 
                        location={ this.props.location }
                        visible={ visiable  }
                        okAction={ this.handleOK }
                        cancelAction={ this.handleCancel }
                        confirmLoading={ confirmLoading }
                        title={ edit_title }
                    />

                  </Layout.Content>
              )
         }
}