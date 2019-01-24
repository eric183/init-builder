import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import Addgroup from './addgroup';
import {  Layout, Row, Col, Button,Input, Table, Switch ,Select ,Modal  } from 'antd';
const Search = Input.Search;
const Option = Select.Option;



@observer
export default class MenuGroupManagement extends Component {
    state = {
        order : '批量操作',
        page : 1,
        limit : 50,
        selectedRowKeys : [],
        sortState : false, // 'ascend' 'descend'
        tableLoading : false,
        confirmLoading : false,
        visible: false,
    }

    menu_id = undefined; // 菜单id


    COLUMNS = [
        {
            title: '编号',
            dataIndex: 'id', 
            align : 'center',
            width : '4%'
         },
         {
            title: '菜单组名称',
            dataIndex: 'name', 
            align : 'center',
            width : '30%'
         },
         {
            title: '备注',
            dataIndex: 'desc', 
            align : 'center',
            width : '32%'
         },
         {
            title: '排序',
            dataIndex: 'sort', 
            align : 'center',
            sorter: true,
            onHeaderCell :( column ) => {
                 return {
                    onClick : this.table_sort_handler.bind(this, column)
                 }
            },
            width : '8%'
         },
        {
            title: '操作',
            align : 'center',
            width : '30%',
            render: (text, record) => (
                <div style={{width : '100%' }}>
                  <span style={{ cursor : 'pointer', marginRight: 5 }} onClick={ this.table_operation_edit.bind(this, record ) } >编辑</span>
                  <span style={{ cursor : 'pointer', marginLeft:5 }} onClick={ this.table_operation_role.bind(this, record ) } >管理菜单</span> 
                </div>
               
            ),
        }
    ]

  relaodAction = () =>{
        let { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
              params.page = 1;
              params.limit = this.state.limit;
          this.props.store.groupStore.requs_menugroup( params ); // 请求数据
    }



   // 应用
   execute_order = () => {
            let { selectedRowKeys, order }  = this.state;
             if( selectedRowKeys.length && this.order != '批量操作' ){
                 let flag = true;
                   switch( order ){
                       case 'delete' : this.props.store.groupStore.delete_nodes({ ids : selectedRowKeys }, this.relaodAction )  ;
                       break;
                       default : flag = false;
                       break;
                 }
                 flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
             }
        }
   


        
    show_role_modal = () => {
               this.setState({  visible : true })
        }


    okAction = ( values, form ) => {
          this.setState({ confirmLoading : true })
          this.props.store.groupStore.add_group(values, this.menu_id, () => {
                   this.relaodAction();
                   this.cancelAction(form);
            })
    }

    cancelAction = (form) => {
        this.menu_id = undefined;
        form.resetFields(); // 重置表单
        this.setState({  visible : false, confirmLoading : false });
        this.props.store.groupStore.reset_groupInitialValue();
    }






    /* table methods start   */ 
    // 字段sort排序,0默认asc排序，1desc排序
    table_sort_handler( column ){
          if( this.state.tableLoading == false ){
               this.setState({  tableLoading : true });
               let sortState = 'ascend';
               if( this.state.sortState == 'ascend' ) sortState = 'descend';
               this.COLUMNS[3].sortOrder = sortState
               this.props.store.groupStore.requs_menugroup({ sort : sortState == 'ascend' ? 0 : 1 }, () => {
                     this.setState({ sortState,tableLoading : false })
               }); // 请求数据
          }
   }


    table_operation_edit( record ){
            this.menu_id = record.id;
            let { title, desc, app_id, sort } = record;
            this.props.store.groupStore.setProperties('groupInitialValue',{ title, desc, app_id, sort });
            this.setState({ visible : true });

    }



    table_operation_role( record ){
        this.props.history.push({ pathname : '/menu_management/menu', search: `pid=${record.id}` })
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


    /* table methods end   */ 




    componentDidMount(){
         this.props.store.groupStore.requs_menugroup(); // 请求数据
    }



      render(){

        

        let { order , selectedRowKeys, page, limit, tableLoading, visible, confirmLoading } = this.state;
        let { dataArry, count } = mobx.toJS( this.props.store.groupStore.get_menuGroup );
     
           return (
            <Layout.Content className="common-layout">
                <Row className="common-panel">
                <Col span={8}>
                    <Button type="primary" onClick={ this.show_role_modal }  style={{  marginRight : 15 }}  > 新增菜单组 </Button>
                    </Col>
                </Row>  

                 <Row className="common-panel">
                      <Col span={24}>
                         <Table 
                            loading={ tableLoading }
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
                        <Option value="delete">删除</Option>
                        </Select>
                        <Button type="primary" onClick={ this.execute_order }>应用</Button>
                    </div>
                   </Col>
                 </Row>


                 <Addgroup 
                      store={ this.props.store } 
                      location={ this.props.location }
                      visible={ visible }
                      okAction={ this.okAction }
                      cancelAction={ this.cancelAction }
                      confirmLoading={ confirmLoading }
                   />

             </Layout.Content>
           )
      }
}