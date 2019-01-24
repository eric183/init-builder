import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import AddMenuModal from './addmenu';
import {  Layout, Row, Col, Button,Input, Table ,Select ,message } from 'antd';
const Search = Input.Search;
const Option = Select.Option;



@observer
export default class MenuItem extends Component {
    state = {
        addMenuModal_title : '新增节点',
        order : '批量操作',
        page : 1,
        limit : 50,
        selectedRowKeys : [],
        sortState : false, // 'ascend' 'descend'
        tableLoading : false,
        confirmLoading : false,
        visible: false,
    }

    parentId = undefined; // 上级id
    menu_id = undefined; // 编辑sid

    COLUMNS = [
        {
            title: '菜单名称',
            dataIndex: 'name', 
            align : 'left',
            width : '14%'
         },
         {
            title: '层级',
            dataIndex: 'depth', 
            align : 'center',
            width : '14%'
         },
         {
            title: '排序',
            dataIndex: 'sort', 
            align : 'center',
            sorter: true,
            // onHeaderCell :( column ) => {  不需要排序
            //      return {
            //         onClick : this.table_sort_handler.bind(this, column)
            //      }
            // },
            width : '8%'
         },
         {
            title: '请求地址',
            dataIndex: 'link', 
            align : 'center',
            width : '20%'
         },
         {
            title: '权限标识',
            dataIndex: 'abilitie', 
            align : 'center',
            width : '14%'
         },
         {
            title: '打开方式',
            dataIndex: 'target', 
            align : 'center',
            width : '14%'
         },
        {
            title: '操作',
            align : 'center',
            width : '14%',
            render: (text, record) => (
                <div style={{width : '100%' }}>
                  <span style={{ cursor : 'pointer', marginRight: 5 }} onClick={ this.table_operation_edit.bind(this, record ) } >编辑</span>
                </div>
               
            ),
        }
    ]

   // 返回上级
    goBoack = () => {
          this.parentId = undefined;
          this.props.store.groupStore.setProperties('menuItem',{ dataArry: [], count: 0  })
          this.props.history.push('/menu_management/group');
    }


    
  relaodAction = () =>{
        let { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
              params.page = 1;
              params.limit = this.state.limit;
             this.props.store.groupStore.requs_menuItem( params ); // 请求数据

    }



   // 应用
   execute_order = () => {
            let { selectedRowKeys, order }  = this.state;
             if( selectedRowKeys.length && this.order != '批量操作' ){
                 let flag = true;
                   switch( order ){
                       case 'delete' : this.props.store.groupStore.delete_menu({ ids : selectedRowKeys }, this.relaodAction )  ;
                       break;
                       default : flag = false;
                       break;
                 }
                 flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
             }
        }
   

 
    show_role_modal = () => {
          this.setState({  visible : true  })
      }




    okAction = ( values, form ) => {
          this.setState({ confirmLoading : true });
          this.props.store.groupStore.add_menuItem( values, this.menu_id, ( method, msg ) => {
                    message[method](msg);
                   this.relaodAction();
                   this.cancelAction(form);
            })
    }

    cancelAction = (form) => {
         form.resetFields(); // 重置表单
         this.setState({  visible : false, confirmLoading : false,  addMenuModal_title : '新增节点' });
         this.props.store.groupStore.setProperties('menuInitialValue',{});
         this.menu_id = undefined;
    }






    /* table methods start   */ 


    // 字段sort排序,0默认asc排序，1desc排序  不需要排序
//     table_sort_handler( column ){
//           if( this.state.tableLoading == false ){
//                this.setState({  tableLoading : true });
//                let sortState = 'ascend';
//                if( this.state.sortState == 'ascend' ) sortState = 'descend';
//                this.COLUMNS[2].sortOrder = sortState
//                this.props.store.groupStore.requs_menuItem({ sort : sortState == 'ascend' ? 0 : 1 }, () => {
//                      this.setState({ sortState,tableLoading : false })
//                }); // 请求数据
//           }
//    }




    table_operation_edit( record ){

        console.log( record )

            this.menu_id = record.id;

            let { title, pid, link, abilitie, target, icon_url, icon, sort, iconInfo } = record;

            this.props.store.groupStore.setProperties('menuInitialValue', { title, pid, link, abilitie, target, icon_url, icon, sort, isEdited : true, iconInfo : [ iconInfo ] } );

            this.setState({ visible : true, addMenuModal_title : '编辑节点' });

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
        let { groupStore } = this.props.store;
        let  { pathname, search } = this.props.location,
               params = qs.parse( search.slice(1));
               this.parentId = params.pid;
             groupStore.requs_menuItem( params ); // 请求数据
             groupStore.requs_allMenuItem(); // 获取所有的上级菜单
    }


    componentWillUnmount(){
          this.parentId = undefined;
          this.menu_id =  undefined;
    }



      render(){

        let { order , selectedRowKeys, page, limit, tableLoading, visible, confirmLoading, addMenuModal_title } = this.state;
        let { dataArry, count } = mobx.toJS( this.props.store.groupStore.get_menuItem );

           return (
            <Layout.Content className="common-layout">

                <Row className="common-panel">
                <Col span={8}>
                     <Button onClick={ this.goBoack  }  style={{  marginRight : 15 }}  > 返回上级 </Button>
                     <Button type="primary" onClick={ this.show_role_modal } > 新增菜单 </Button>
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
                 

                <AddMenuModal
                        title={ addMenuModal_title }
                        parentRef={ this }
                        store={ this.props.store }
                        visible={ visible }
                        confirmLoading={ confirmLoading }
                        okAction={ this.okAction }
                        cancelAction={ this.cancelAction }
                    
                     />

             </Layout.Content>
           )
      }
}