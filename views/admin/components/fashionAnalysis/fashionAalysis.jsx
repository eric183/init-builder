import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import Addcomponent from '../addComponent/addcomponent';
import ImagesList from  '../materialLibrary/imagesList';
import PreviewComponent from '../addComponent/preview';
import qs from 'qs';
import {  Layout, Button,Form, Input,DatePicker, Select, message, Table,  Modal, Cascader, Popconfirm, TreeSelect } from 'antd';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const ButtonGroup = Button.Group;




@observer
class Fashion_alanysis extends Component {
      state = {
        page : 1,
        limit : 10,
        selectedRowKeys : [],
        modalVisible : false,
        imageListVisiable : false,
        active : ''
      }

     child = {};
     previewObj = {};


      clickActionForImageListComponent = (data) => {
           this.child._setFieldsValue(data)

      }

     onRef = (ref)  => { this.child = ref }
     onRefPreview = (ref) => { this.previewObj = ref  }


      // 关闭图片素材弹框
      setImageListVisiable = (state) => {  this.setState({ imageListVisiable : state })  }



      modalOnOjbk = () => {
        this.setState({ modalVisible : false })
       }



      modalOnCancel = () => {
           this.child.onCancel( () => {  this.setState({ modalVisible : false })  } ); // 调用子组件方法
       }



      closePreview = () => {
              // 清除预览组件数据
              this.props.store.FashionStore.setProperties('previewVisiable',false);
              this.previewObj._onCloseAction();
       }


    
      // 新增
     openAddComponent = () => {  
        // 提交动作是新增还是修改；  2 == 编辑  1 == 新增
        let onedite = this.props.util.getLocalstorage('onedite');

        if( onedite && onedite == '2') this.props.util.setLocalstorage('onedite','1'); 

        this.setState({ modalVisible : true }, () => { 
                setTimeout(() => {    
                     this.child.onOpenAction();
                 },700)
            });

     }



    // 编辑
    editeAction(record){

            // 提交动作是新增还是修改；  2 == 编辑  1 == 新增
            this.props.util.setLocalstorage('onedite','2'); 
            // 把 record 保存到 localstore ，【在保存前先处理数据格式】
            let { title, attrs, folders } = record,
                 new_attrs = {};
               
              attrs.forEach((item,index) => {   // 临时方法
                     new_attrs[item.group_id] = item.tag_id;
               });

          this.props.util.setLocalstorage('fieldsValue', { title, attrs : new_attrs, folders });

            // 把已选择行数据存于本地，后与修改数据合拼提交后台； 完成后清除
            this.props.util.setLocalstorage('rowRecord',record); 

            this.props.util.setLocalstorage('category',new_attrs.category);

            this.setState({ modalVisible : true }, () => { 
                setTimeout(() => {    
                     this.child.onOpenAction();
                 },700)
            });
    }



     // 发布、取消发布
     onRelease_cancel = (record) => {  
        this.props.store.FashionStore.release_cancel(record.id,{ is_release : record.is_release ? 0 : 1  }, () => { 
                let  { pathname, search } = this.props.location,
                        params = qs.parse(search.slice(1));
                        params.category ? '' : params.category = this.state.category;
                     this.props.store.FashionStore.request_F_TableData( params );  // 请求列表数据  
                     this.setState({ limit : params.limit, page : params.page  });

            }); 
    }



     onSelectSort = (active) => {

             this.setState({ active });

             let  { pathname, search } = this.props.location,
                    params = {
                        attrs : { category : active  },
                        limit : 10,
                        page : 1
                    };

                  this.setState({ selectedRowKeys : [] });
                  this.props.form.resetFields();
                  this.props.history.push( `${pathname}?${qs.stringify(params)}` );

     }


     
     // 筛选方法
     filterAction = (attr,value) => {  

            let  { pathname, search } = this.props.location,
                 params = qs.parse(search.slice(1));

                    if(attr == 'state'){
                        value ? params.is_release = value : delete params.is_release ;

                    }else if(attr == 'editor'){

                        value  ?  params.editor = value : delete params.editor ;

                    }else if(attr == 'year'){

                            if(params.attrs){
                                value?  params.attrs.year = value :  delete params.attrs.year;
                            }else{
                                params.attrs = { year : value }
                            }
                        
                    }else if(attr == 'season'){
                            
                                if(params.attrs){
                                    value ? params.attrs.season = value : delete  params.attrs.season ;
                                }else{
                                    params.attrs = { season : value }
                                }
            

                    }

                    params.limit = 10;
                    params.page = 1;
              this.props.history.push( `${pathname}?${qs.stringify(params)}` );  
           
     }


     category_filter = (value) => {
        let  { pathname, search } = this.props.location,
                params = qs.parse(search.slice(1));

                if(value){
                    if(params.attrs){
                        params.attrs.category = value;
                    }else{
                        params.attrs = {  category : value }
                    }
                     params.limit = 10;
                     params.page = 1;
                }else{
                    params.attrs.category = this.state.active;
                }

             this.props.history.push( `${pathname}?${qs.stringify(params)}` );


      }



 searchAction = (value) => {
            let  { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
            value ? params.title = value : delete params.title ;
            params.limit = 10;
            params.page = 1;
           this.props.history.push( `${pathname}?${qs.stringify(params)}` );
     }




 rangePickerAction = (dates, dateStrings) => {
         let flag = true;
         dateStrings.forEach(function(item,index){ if(item == '')  flag = false });
         let  { pathname, search } = this.props.location,
         params = qs.parse(search.slice(1));
         params.limit = 10;
         params.page = 1;
    
         if(flag){
            params.begin = dateStrings[0];
            params.end = dateStrings[1];
         }else{
             delete params.begin;  
             delete params.end; 
         }
         this.props.history.push( `${pathname}?${qs.stringify(params)}` )
    
     }


     deleteAction = () => {
          let { selectedRowKeys } = this.state;
          this.props.store.FashionStore.deleteItem({ ids : selectedRowKeys } , () => {
                   this.setState({ selectedRowKeys : [] });
                   const params = qs.parse(location.search.slice(1));
                        params.category ? '' : params.category = this.state.category;
                     message.success('删除成功！', () => {
                        this.props.store.FashionStore.request_F_TableData(params);  // 请求列表数据     
                     })
          })

     }




     componentWillReceiveProps(nextProps) {

        const location = nextProps.location;
        const preLocation = this.props.location;

        /*通用处理antd导致的声明周期钩子调用BUG Begin*/
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;

         const params = qs.parse(location.search.slice(1));

         if(params.attrs){
              if(!params.attrs.category) params.attrs.category = this.state.active; 
         }else{
               params.attrs = {};
               params.attrs.category = this.state.active;
         }
         params.category = this.state.active; 

         this.props.store.FashionStore.request_F_TableData( params );  // 请求列表数据  

         this.setState({ limit : params.limit, page : params.page  });
    }

     componentDidMount(){
                 this.props.history.push( `${this.props.location.pathname}` ); 
                            // 获取角色权限
                            this.props.store.FashionStore.request_userInfo(( data ) => {  
                                 if( data.category && data.category.length ){
                                    this.setState({  active : data.category[0]  });
                                    
                                    // 请求列表数据
                                    this.props.store.FashionStore.request_F_TableData({ 
                                                                                page : this.state.page,
                                                                                limit : this.state.limit,
                                                                                attrs : { 
                                                                                    category : data.category[0]
                                                                                 }, 
                                                                                category : data.category[0] });  

                                    this.props.store.FashionStore.request_editors();
                                    this.props.store.FashionStore.request_tags('year');
                                    this.props.store.FashionStore.request_tags('season');
                                    this.props.store.FashionStore.request_tags('details');
                                    this.props.store.FashionStore.request_tags('style');
                                    this.props.store.FashionStore.request_tags('clen');
                                // this.props.store.FashionStore.request_subsort({ category : this.state.active }); 
                                    this.props.store.FashionStore.request_Allsubtags({ group  : 'part' });  // 部件
                                    this.props.store.FashionStore.request_Allsubtags({ group  : 'profile' });  // 廓形
                                    this.props.store.FashionStore.request_Allsubtags({ group  : 'vertype' });  // 版型

                                 }else{

                                    // 如果没权限，就不进行请求
                                   // this.props.store.FashionStore.request_F_TableData({ attrs : { category : data.category[0] }, category :this.state.active }); 

                                 }
                             });
     }






     render(){  

        let dataArray = mobx.toJS(this.props.store.FashionStore.get_F_TableData);
        let count = this.props.store.FashionStore.f_TableData_total;

        let userInfo = mobx.toJS( this.props.store.FashionStore.get_userinfo );

        const { getFieldDecorator } = this.props.form;

        let { page, limit, modalVisible, imageListVisiable, selectedRowKeys } = this.state;

        let previewVisiable = this.props.store.FashionStore.previewVisiable;

        let { active } = this.state;

       let  _yearOptions = mobx.toJS(this.props.store.FashionStore.get_yearOptions),
            _seasonArry = mobx.toJS(this.props.store.FashionStore.get_seasonArry),
            _editors =  mobx.toJS(this.props.store.FashionStore.get_editors),
            _subsort =  mobx.toJS(this.props.store.FashionStore.get_subsort);

        let rowSelection = {
            selectedRowKeys : selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                 this.setState({ selectedRowKeys  });

            },
            onSelect : (record, selected, selectedRows, nativeEvent) => {
                 
            },
            onSelectAll : (selected, selectedRows, changeRows) => {
                 //  console.log('selectedAll');
            }
      }

          return (
            <Layout.Content className="utopia-layout">
                <header>
                    <div className="m-header-bottom">
                            <span className="m-tabs">
                                    {
                                         userInfo.category.map(( item,index ) =>(
                                            <a href="javascript:void(0)" key={index} 
                                                 onClick={  this.onSelectSort.bind(this,item) }  
                                                 className={ active == item ? 'active' : '' }>{ item }</a>
                                         ))
                                    }
                              </span>
                     
                        </div>
                    </header>

                  {/* 筛选列表 start  */}
                 <div className="m-filter-bar">
                     <Form layout="inline" >

                            <FormItem>
                                {getFieldDecorator('_time', {  initialValue : [] })(
                                        <RangePicker style={{ width: 300 }}  onChange={ this.rangePickerAction.bind(this) }/>
                                    )}
                               </FormItem>


                           <FormItem>                            
                               {getFieldDecorator('_state', { initialValue : undefined, })(
                                        <Select placeholder="状态" allowClear style={{ width : 150 }} onChange={ this.filterAction.bind(this,'state') } >
                                        <Option value="0">未发布</Option>
                                        <Option value="1">已发布</Option>
                                      </Select>
                                    )}
                                </FormItem>



                                 <FormItem>                            
                                   {getFieldDecorator('_editor', { initialValue : undefined, })(
                                            <Select placeholder="修改人" allowClear style={{ width : 150 }} onChange={ this.filterAction.bind(this,'editor') } >
                                             {
                                               _editors.map((item, index) => (<Option key={index} value={ item.editor.user_id }>{  item.editor.realname }</Option>) )
                                             }
                                        </Select>
                                        )}
                                  </FormItem>

                               
                                  <FormItem>
                                    {getFieldDecorator('_title', {  initialValue : [] })(
                                          <Search onPressEnter={ (e) => {   this.searchAction(e.target.value)  } }  style={{ width: 200 }} placeholder="请输入主题名称" onSearch={ this.searchAction } />
                                    )}
                                    </FormItem>



                           </Form>
                    </div>
                   {/* 筛选列表 end  */}     


                  <div className="m-data-list">
                      <div className="m-data-list-panel">
                        <div className="m-data-list-p-top">
                           <Popconfirm placement="topLeft" title={'确定删除？'} onConfirm={ this.deleteAction } okText="是" cancelText="否">
                                <Button type="danger" disabled={ selectedRowKeys.length > 0 ? false : true } >删除</Button>
                              </Popconfirm>
                            <ButtonGroup></ButtonGroup>

                            <ButtonGroup onClick={   this.openAddComponent  }><Button type="primary" icon="plus"> 新建</Button></ButtonGroup>
                             </div>
                         
                        </div>
                        {/* end of m-data-list-panel */}

                        <Table ref="Table_test"
                               scroll={{ y: 480 }}
                               rowSelection={rowSelection}
                               columns={[
                                            {
                                             title: '序号',
                                             dataIndex: 'id',
                                             width : '10%'
                                            },
                                             {
                                                title: '主题名称',
                                                dataIndex: 'title',
                                                width : '20%'
                                               },
                                        
                                               {
                                                title: '状态',
                                                dataIndex: 'is_release',
                                                width : '20%',
                                                render : (text, record, index) => {
                                                      return text == '1' ? ('已发布') :('未发布')
                                                  }
                                               },
                                               { 
                                                title: '修改人',
                                                dataIndex: 'editor.realname',
                                                width : '10%'
                                               },
                                               {
                                                title: '最后修改时间',
                                                dataIndex: 'updated_at',
                                                width : '20%'
                                               },
                                               {
                                                title: '操作',
                                                width : '20%',
                                                render:(text, record, index) => {
                                                        return (
                                                            <span className="f-table-btns">
                                                                <Button onClick={  this.editeAction.bind( this, record )  }>编辑</Button>
                                                                <Button onClick={ this.onRelease_cancel.bind(this,record) }>{ record.is_release ? '下架' : '发布' }</Button>
                                                                
                                                            </span>
                                                        )
                                                   }
                                               }
                                             
                                          
                                         ]}  
                                  pagination={{
                                             current: Number(page), 
                                             pageSize: Number(limit),
                                             showQuickJumper: true,
                                             showSizeChanger: true,
                                             total : Number(count) | 0,
                                         showTotal: function(total,pageSize){
                                             return `共${Number(count)}条`
                                         },
                                         onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                                                let  { pathname, search } = this.props.location,
                                                params = qs.parse(search.slice(1));
                                                params.page = pageNumber;
                                            this.props.history.push( `${pathname}?${qs.stringify(params)}` );
                     
                                         },
                                         onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                            let  { pathname, search } = this.props.location,
                                                   params = qs.parse(search.slice(1));
                                                   params.limit = pageSize;
                                               this.props.history.push( `${pathname}?${qs.stringify(params)}` );

                                            }
                                         }}
                                 dataSource={ dataArray } 
                                 rowKey={'id'}
                                 />
                   </div>

            {/* 添加数据弹窗 start  */}
                 <Modal
                    title="编辑主题"
                    maskClosable={false}
                    width={1000}
                    style={{ top: 20 }}
                    visible={ modalVisible }
                    onOk={ this.modalOnOjbk }
                    onCancel={ this.modalOnCancel }
                    footer={null}
                    >
                   <section> 
                       <Addcomponent  
                                store={ this.props.store }
                                util={ this.props.util } 
                                modalOnCancel={this.modalOnCancel} 
                                setImageListVisiable={ this.setImageListVisiable }
                                onRef={ this.onRef }  
                                parentRef={this}
                                />
                   </section>
                    </Modal>
                 {/* 添加数据弹窗 end  */}


                   {/* 图片列表悬浮框  start  */}
                   <ImagesList  
                        visiable={ imageListVisiable  }  
                        onClose={ this.setImageListVisiable.bind(this,false) } 
                        clickAction={ this.clickActionForImageListComponent } 
                         />
                   {/* 图片列表悬浮框  end  */}
 

                  {/* 预览弹窗 start  */}
                  <Modal
                    title="预览"
                    width={850}
                    visible={ previewVisiable }
                    onCancel={ this.closePreview }
                    footer={null}
                    >
                    <PreviewComponent onRefPreview={this.onRefPreview}  
                                      getFieldsvalue={ this.child._getFieldsValue }  
                                      {...this.props}  
                                      parentState={this.state} />
                    </Modal>
                  {/* 预览弹窗  end  */}

             </Layout.Content>

          )
     }
}






const FashionAlanysis = Form.create()(Fashion_alanysis);
export default FashionAlanysis;