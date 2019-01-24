import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import AddnodeModal from './addnode';
import {  Layout, Row, Col, Button,Input, Table, Switch ,Select   } from 'antd';
const Search = Input.Search;
const Option = Select.Option;


@observer
export default class PowerComponent extends Component {
    state = {
        selectedRowKeys : [],
        loading: false,
        page : 1,
        limit : 50, // 后台默认 50,
        pid : 0, // 0代表最顶层节点，创建子节点，该值为指定节点ID
        order : '批量操作',  // 应用操作类型
        visible : false,
        confirmLoading : false,
        title : undefined,
     }


   COLUMNS = [
        {
            title: '编号',
            dataIndex: 'id', 
            align : 'center',
            width : 100
        },
        {
            title: '资源',
            dataIndex: 'name',
            align : 'center',
            width : 100,
            render: (text, record) => (      
               <span style={{ cursor : 'pointer' }} onClick={ this.table_goIntoAction.bind(this, record ) } > { text } </span>
            ),
        },
        {
            title: '显示名',
            dataIndex: 'title', 
            align : 'center',
            width : 100
        },
        {
            title: '类型',
            dataIndex: 'entity_type', 
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
               <span style={{ cursor : 'pointer' }} onClick={ this.table_operation.bind(this, record ) } >编辑</span> 
            ),
        }
    ]


    

    // 搜索
    searchAction = ( value ) => {
           console.log( value )
           let { pid, page, limit, selectedRowKeys } = this.state;
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
        }, 200)

           
    }





    // 打开弹窗按钮
    show_modal = () =>{
        this.setState({ visible : true })
    }

  
   /* 编辑弹窗方法 start  */ 
    okAction = ( values, formInstance ) => {
        this.setState({ confirmLoading : true })
         values.pid = this.state.pid;
        // values.scope instanceof Array ? values.scope = values.scope[0] : '';
         this.props.store.powerStore.add_edit_nodes(values, () => {
             this.relaodAction();
             this.cancelAction();
         })

    }

    cancelAction = ( formInstance ) => {
         formInstance.resetFields(); // 重置表单
         this.setState({ visible : false, confirmLoading : false });
         this.props.store.powerStore.reset_addNodeInitialValue();
    }

  /* 编辑弹窗方法 end  */ 

  
     // table 多选框
     onSelectChange = (selectedRowKeys) => {
           this.setState({ selectedRowKeys });
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
                    case 'delete' : this.props.store.powerStore.delete_nodes({ ids : selectedRowKeys }, this.relaodAction )  ;
                    break;
                    default : flag = false;
                    break;
              }
              flag ? this.setState({ selectedRowKeys : [], order : '批量操作' }) : '';
          }
     }


    // 数据重载
    relaodAction = ( callback = function(){} ) =>{
         let { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
         let { pid = 0, page = this.state.page, limit = this.state.limit } = params;
         let p = { pid, page, limit };
             this.state.title ?  p.title = this.state.title : '';
         this.props.store.powerStore.request_abilities( p , callback); // 请求节点列表数据
    }


  // 返回上级
  goBack = () =>{
    let { pathname, search } = this.props.location,
          params = {};
     // 选用第一个数据的pid【 因为pid都是相同 】
    let abilities = mobx.toJS( this.props.store.powerStore.get_abilities );
        abilities.length <= 0 ?  abilities = [ { pid : 0 } ] : '';
   if(  abilities[0].pid == 0 ){ // 最顶层节点
            params.pid = 0;
            params.page = 1;
            params.limit = this.state.limit;
         this.props.history.push( `${pathname}` );
   }else{
          // 把pid存到路由
            params.pid = abilities[0].pid;
            params.page = 1;
            params.limit = this.state.limit;
           this.props.history.push( `${pathname}?${qs.stringify(params)}` );
   }
    // 请求节点列表数据
     this.props.store.powerStore.request_abilities( params , () => {  
              this.setState( params ) 
         }); 

  } 




     /* table start  */ 

     // 深入下级 ‘资源’
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
        this.props.store.powerStore.request_abilities( params, 
              () => {  this.setState(params) } );
         
    }


    // 启用、禁用
    table_enableAction( record ){
          let { id, disabled } = record;
          let param = { ids : [ id ],  disabled : disabled == '0' ? 1 : 0 };
          this.state.pid != 0 ? param.pid = this.state.pid : '';
          this.props.store.powerStore.set_desabled( param, this.relaodAction );
         console.log( record )
    }



    // 操作
    table_operation( record ){
         let { name,title, sort,scope,disabled, type = undefined } = record; 
              typeof disabled == 'number' ?  disabled =  disabled.toString() : '';
              typeof type == 'number' ? type = type.toString() : '';
              scope instanceof Array ? '' : scope = [ scope ];
        this.props.store.powerStore.setProperties('addNodeInitialValue', { name,  title,  sort,  scope,  disabled, type } )
           this.setState({ visible : true })
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

     /* table  end  */ 




     componentDidMount(){

        // 检查url是否带有pid
        let { pathname, search } = this.props.location,
             params = qs.parse(search.slice(1));
        let { pid = 0, page = this.state.page, limit = this.state.limit  } = params;
        let parem = { pid, page, limit }
         this.props.store.powerStore.request_abilities( parem , () => { this.setState( parem ) }); // 请求节点列表数据
     }

  
     
     componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        /*通用处理antd导致的声明周期钩子调用BUG Begin*/
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
    }


    componentWillUnmount(){
        this.setState({ selectedRowKeys : [], order : '批量操作', searchValue : undefined });
    }



    render(){
        const { powerStore } = this.props.store;
        const { loading, selectedRowKeys, page, limit, pid, order, visible, confirmLoading, title } = this.state;
        let count = powerStore.get_abilities_count;
        let abilities = mobx.toJS( powerStore.get_abilities )


         return (
            <Layout.Content className="common-layout">

                <Row className="common-panel">
                  <Col span={8}>
                       <Button  onClick={ this.goBack } style={{ display : pid != 0 ? 'inline-block' : 'none', marginRight : 15 }}>返回上一级</Button>
                       <Button type="primary" onClick={ this.show_modal }>新增节点</Button>
                     </Col>
                  <Col span={ 4 } offset={ 12 } style={{ textAlign : 'right' }}>
                   <Search
                     value={ title }
                     placeholder="请输入节点显示名"
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
                    dataSource={ abilities }
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

               <AddnodeModal 
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