import * as React from 'react';
import { Component }  from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import UploadForm from './uploadForm';
import qs from 'qs';
import {  UploadInfoComponent, UploadStatusComponent  } from './uploadInfoComponents';
import { ExamineModifier, BulkEditor } from './modifyModal';


import { Row, Col, Layout, Button,Icon,Alert,
          Form, Input,DatePicker, Select, 
          Table, Checkbox, Pagination,TimePicker,
          Modal,Tabs, Radio,Cascader,message,Dropdown,Menu,TreeSelect
         } from 'antd';



const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;

function _transform(date){
  var _date = date.substring(0,19);    
  _date = _date.replace(/-/g,'/'); 
 return new Date(_date).getTime();
}




@observer
class Material_lib extends Component{
     state = {
           page : 1,
           limit : 10,
           activeKey : '1',
           dateString : '',
           timeString : '',
           columnIndex : '0', // 0 == 全部， 1 == 我们
           dispayForm : true, // true == table , false == list
           loading : false,
           modalVisiable_ft : false,
           dirTag : 'asc',   // asc desc

            profile_visiable : true,
            part_visiable : true,
            vertype_visiable : true,
            category_visiable : true,
            details_visiable : true,
            style_visiable : true,
            clen_visiable : true,
            season_visiable : true

     }


    reloadAction = () => {
          let  { pathname, search } = this.props.location,
                 params = qs.parse(search.slice(1));
                this.props.history.push( `${pathname}?${qs.stringify(params)}` );
    }


     toggle_dispayForm = () => {
           this.setState({ dispayForm : !this.state.dispayForm })   
      }




    selectedComponent = (e) => { 
            let value = e.target.value;
          if(value == 2){
               this.props.store.MaterialStore.request_ConflictList({ page : 1, limit : 18 }); // 冲突资源列表
               this.props.store.MaterialStore.request_CompletedList({ type : 'conflict' });   // review 待审核 conflict 冲突 similarity 相似
          }else if(value == 3){  
               this.props.store.MaterialStore.request_ForApprovList({ page : 1, limit : 18 });   // 待审核资源列表
               this.props.store.MaterialStore.request_CompletedList({ type : 'review' });   // review 待审核 conflict 冲突 similarity 相似
          }

         this.props.history.push( `${this.props.location.pathname}` );
         this.props.store.MaterialStore.setProperties({ 'componentIndex': value,  'selectedValue' : undefined }); 
         
    }



    tableChild = {};
    listChild = {};



    getSibling = (key) => { return this[key] }

    onRefTable = (child) => {
            this.tableChild = child
    }
    onRefList = (child) => {
        this.listChild = child
    }

    onRef_uploadForm = (child) => { this.uploadform = child }



     // 上传弹窗 上传成功
    modalOnOk = () => { 
      this.cancelCallback();
        // this.setState({ activeKey : 2 });  暂时不跳转
       // this.props.store.MaterialStore.setProperties( 'componentIndex', value ); 
    }



 // 上传弹窗 
    modalOnCancel = () => {
        this.cancelCallback();
    }

   

   cancelCallback = () => {
        this.props.store.MaterialStore.setProperties('modalVisible',false);
        this.props.store.MaterialStore.uploaderInitialValue ?  this.props.store.MaterialStore.setProperties('uploaderInitialValue',null) : '';   
   }

    


    // 单个编辑、批量编辑
   onEditeAction = (state) => {
       let selectedRows = mobx.toJS(this.props.store.MaterialStore.getSeletedRows); 
        if(selectedRows.length > 1){
              this.bulkEditorAction(state);
        }else if( selectedRows.length == 1  ){
              this.singleEditorAction(state)
        }
    }

    bulkEditorAction = (state) =>{
      this.props.store.MaterialStore.setProperties('bulkEditor',state);
    }


    singleEditorAction = (state) => {
        if(state){
            let selectedRows = mobx.toJS(this.props.store.MaterialStore.getSeletedRows);
               this.props.store.MaterialStore.request_flatData(selectedRows[0]);
        }else{
              this.props.store.MaterialStore.setProperties('imageAttrsInitialValue', []);
        } 
             this.props.store.MaterialStore.setProperties('singleEditor',state);

    }




    singleEditeSubmit = (data) => {  // 单个编辑提交

      // let  { pathname, search } = this.props.location,
      //         params = qs.parse(search.slice(1));

        this.props.store.MaterialStore.submit_singleEdit(data,() => {
                  this.singleEditorAction(false);
                  this.props.store.MaterialStore.setSelectedRows([]);  // 清空已勾选
              })
    }






   componentWillMount(){

          this.props.history.push( `${this.props.location.pathname}` );  

         this.props.store.MaterialStore.request_materialList({ page : 1, limit : 10 });
         this.props.store.MaterialStore.request_tags('season');  
         this.props.store.MaterialStore.request_tags('vectorgraph');  
         this.props.store.MaterialStore.request_tags('angle');  
         this.props.store.MaterialStore.request_tags('details');  
         this.props.store.MaterialStore.request_tags('style');  
         this.props.store.MaterialStore.request_tags('clen');  

         this.props.store.MaterialStore.request_editors();

         this.props.store.MaterialStore.request_Allsubtags({ group  : 'part' });

         this.props.store.MaterialStore.request_Allsubtags({ group  : 'profile' });
         
         this.props.store.MaterialStore.request_Allsubtags({ group  : 'angle' });

         this.props.store.MaterialStore.request_Allsubtags({ group  : 'vertype' });

         this.props.store.MaterialStore.request_Allsubtags({ group  : 'category' });   // 所属品类


   }




   componentWillReceiveProps(nextProps) {

    const location = nextProps.location;
    const preLocation = this.props.location;

    /*通用处理antd导致的声明周期钩子调用BUG Begin*/
   // if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;

      const params = qs.parse(location.search.slice(1));
          if(params.zipParams) delete params.zipParams; // 压缩包列表的请求参数。
          if(params.cParams) delete params.cParams; // 压缩包冲突列表的请求参数。
          this.props.store.MaterialStore.request_materialList( params ); // 请求列表数据
         params.page ? this.setState({ page :  params.page  }) : '';
         params.limit ? this.setState({ limit :  params.limit  }) : '';
         params.order ? this.setState({ dirTag : params.order }) : '';

}


   


selectedColumn = (e) => {

    this.props.form.resetFields();
    let  { pathname, search } = this.props.location;
    if(e.target.value == 1){
      this.props.history.push( `${pathname}?me=${e.target.value}&page=1&limit=10` );
    }else{
      this.props.history.push( `${pathname}?page=1&limit=10` );
    }
    this.setState({ columnIndex : e.target.value });

}


searchAction = (value) => {
  let  { pathname, search } = this.props.location,
         params = qs.parse(search.slice(1));
         params.limit = 10;
         params.page = 1;
         params.me = this.state.columnIndex;
        (value != '') ?  params.title = value : delete  params.title;
       this.props.history.push( `${pathname}?${qs.stringify(params)}` );

}



selectAction (key,value){ 
    let  { pathname, search } = this.props.location,
            params = qs.parse(search.slice(1));
            params.limit = 10;
            params.page = 1;
            params.me = this.state.columnIndex;
    if( value == undefined ){
          delete params[key];
    }else{
          params[key] = value;
    }

   this.props.history.push( `${pathname}?${qs.stringify(params)}` );
    
}



linkedAction(value){
      let {  defaultConfig,  config, defualtTags } = mobx.toJS(this.props.store.MaterialStore.matarialConfig);
      let  visiableObjects = Object.assign({}, defaultConfig, true);   
      defualtTags.forEach(item => {
            if(value == item.name ) config[ item.key ].forEach((item,index) => {  visiableObjects[item] = false });
      }); 
      this.props.form.setFieldsValue({
        m_profile : undefined,
        m_part : undefined,
        m_vertype : undefined,
        m_category : undefined,
        m_details : undefined,
        m_style : undefined,
        m_clen : undefined,
        m_season : undefined,
        m_time : undefined,
        m_editor : undefined,
        m_release : undefined,
        m_title : undefined
      });  

      this.setState({ ...visiableObjects });
     
} 




category_selector = (value) => {
        this.linkedAction(value);
        let  { pathname, search } = this.props.location,
                params = {
                  limit : 10,
                  page : 1,
                  me : this.state.columnIndex,
                  attrs : {}
                };

        if(value){
            if( value == '封面图' || value == '模特图' ){
                  delete params.attrs.vectorgraph;
                  if( value == '封面图')  params.attrs.picture_use = value;
                  if( value == '模特图' )  params.attrs.ptype = value;
            }else{
                params.attrs.vectorgraph = value;
            }
           this.props.history.push( `${pathname}?${qs.stringify(params)}` );
        }else{
             this.props.history.push( `${pathname}` );
        }
}




selectAction_attrs (key,value){ 

       if( key == 'vectorgraph') this.linkedAction(value);

       let  { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
              params.limit = 10;
              params.page = 1;
              params.me = this.state.columnIndex;
              params.attrs ? '' : params.attrs = {};

      if( value == undefined ){
           key == 'vectorgraph' ?  params.attrs = {} :  delete  params.attrs[key];
      }else{
           params.attrs[key] = value;
      }

    this.props.history.push( `${pathname}?${qs.stringify(params)}` );
    
 }









 rangePickerAction = (time, timeString) => {
  let flag = false;
  let  { pathname, search } = this.props.location,
        params = qs.parse(search.slice(1));
        params.limit = 10;
        params.page = 1;
        params.me = this.state.columnIndex;

        timeString.forEach((item,index) => {  item != '' ?  flag = true : '';   });

      if(flag){
         params.begin = timeString[0];
         params.end = timeString[1] 
      }else{
       delete params.begin;
       delete params.end;
      }

     this.props.history.push( `${pathname}?${qs.stringify(params)}` );
        
 }


 treeSelectorAction = (key,value) => {
        let  { pathname, search } = this.props.location,
              params = qs.parse(search.slice(1));
              params.limit = 10;
              params.page = 1;
              params.me = this.state.columnIndex;          
        if( value == undefined ){
            delete params.attrs[key];
        }else{
            params.attrs ? '' : params.attrs = {};
            params.attrs[key] = value;
        }

     this.props.history.push( `${pathname}?${qs.stringify(params)}` );

 }






 // 排序
 sortAction = () => {  //  asc desc
   let  { pathname, search } = this.props.location,
          params = qs.parse(search.slice(1));
        let { dirTag } = this.state;
        dirTag == 'asc' ? dirTag = 'desc' : dirTag = 'asc';

        params.order = dirTag
        params.me = this.state.columnIndex;
        
        this.props.history.push( `${pathname}?${qs.stringify(params)}`);



 }


 
// 取消查看大图
 onCancel_bigPcture = () => {
  this.props.store.MaterialStore.setProperties('bigPictureVisiable', false);
  this.props.store.MaterialStore.setProperties('bigPictureUrl','')

}




  onDateSelected = (date,datestring) => {  this.setState({ dateString : datestring}) }
  onTimeSelected = (time,timestring) => {  this.setState({ timeString : timestring  }) }


 // 定时发布
 fixedTime_ok = () => {

      let { dateString, timeString } = this.state;
           var timestamp1 = Date.parse(new Date( dateString +' '+ timeString)),
               timestamp2 = new Date().getTime();
            if( timestamp1  > timestamp2 ){
                        if(dateString && timeString ){
                          let seletedRows =  mobx.toJS(this.props.store.MaterialStore.seletedRows);
                          this.props.store.MaterialStore.cancel_Release({ ids : seletedRows, is_release : 1, release_time : dateString + ' ' + timeString },() => {
                            message.success('设置定时发布！', () => { 
                                          this.reloadAction();
                                          this.props.store.MaterialStore.setSelectedRows([]);
                                          this.setState({ modalVisiable_ft : false, dateString : '',  timeString : '' })
                                })
                            
                          })
                      }else{
                          message.warning('日期和时间必选！')
                      }   

            }else{
                message.warning('设定时间要大于当前时间！')
            }

        
}


 // 关闭定时发布弹窗
fixedTime_cancel = () => {
   this.setState({ modalVisiable_ft : false, dateString : '',  timeString : '' })
}



// 立即发布
release_immediately = () => {
      let seletedRows =  mobx.toJS(this.props.store.MaterialStore.seletedRows);
      this.props.store.MaterialStore.cancel_Release({ ids : seletedRows, is_release : 1 },() => {
        message.success('发布成功！', () => { 
                      this.reloadAction();
                      this.props.store.MaterialStore.setSelectedRows([]);
          } );
        
       })
}





// 取消发布,发布
cancelRelease(state,e){
       let seletedRows =  mobx.toJS(this.props.store.MaterialStore.seletedRows);
       this.props.store.MaterialStore.cancel_Release( { ids : seletedRows, is_release : state } ,() => {
            message.success('取消发布成功！', () => { 
                          this.reloadAction();
                          this.props.store.MaterialStore.setSelectedRows([]);
               } );
            
       });
}


// 删除行
deleteRow = () => {
        let seletedRows = mobx.toJS(this.props.store.MaterialStore.seletedRows);
        this.props.store.MaterialStore.delete_rows({ ids : seletedRows }, () => {
                     message.success('删除成功！',2, () => {
                            this.props.store.MaterialStore.setSelectedRows([]);
                            this.props.store.MaterialStore.setProperties('selectedRows', []);
                            this.reloadAction();
                     })
                
        });
}





     render(){

          let { 
            loading,
            activeKey, 
             modalVisiable_ft,
             columnIndex, 
             dirTag, 
             season_visiable,
              profile_visiable,
              part_visiable,
              vertype_visiable,
              category_visiable,
              details_visiable,
              style_visiable,
              clen_visiable
          } = this.state;



          let componentIndex = this.props.store.MaterialStore.getComponentIndex;

          let selectedRows = mobx.toJS(this.props.store.MaterialStore.getSeletedRows);

          const { getFieldDecorator } = this.props.form;
          const formItemStyle = { width : 160 };

          let purposeOptions = mobx.toJS(this.props.store.MaterialStore.purposeOptions),
              seasonOptions = mobx.toJS(this.props.store.MaterialStore.seasonOptions),
              oversizeOptions = mobx.toJS(this.props.store.MaterialStore.get_Profiletags),
              partOptions = mobx.toJS(this.props.store.MaterialStore.get_PartTags),
              editorOptions = mobx.toJS(this.props.store.MaterialStore.get_editorOptions),
              detailOptions = mobx.toJS(this.props.store.MaterialStore.get_detailOptions),
              styleOptions = mobx.toJS(this.props.store.MaterialStore.get_styleOptions),
              clenOptions = mobx.toJS(this.props.store.MaterialStore.get_clenOptions),
              vertypeTags = mobx.toJS(this.props.store.MaterialStore.get_VertypeTags),
              subsortOptions = mobx.toJS(this.props.store.MaterialStore.get_subsortOptions);

    
              


        return (
            <Layout.Content className="utopia-layout">

               <Tabs animated={false}  activeKey={ activeKey }   onTabClick={ (value) => { this.setState({ activeKey : value })  } } >

                 <TabPane tab="素材" key="1">
                     <Row>
                         <Col span={6}>
                           <Radio.Group value={ columnIndex  } onChange={ this.selectedColumn } style={{ marginBottom: 16 }}>
                            <Radio.Button value="0">全部</Radio.Button>
                             <Radio.Button value="1">我的</Radio.Button>
                             </Radio.Group>
                            </Col>
                            <Col span={2} offset={16} style={{ textAlign: 'right' }}>
                            <Button type="primary" icon="plus" onClick={() => { this.props.store.MaterialStore.setProperties('modalVisible',true);  }}>上传</Button>
                           </Col>
                     </Row>
                  

                     {/* 筛选列表 start  */}
                      <Form layout="inline" >
                           <FormItem>
                              {getFieldDecorator('m_vectorgraph')(
                                     <Select placeholder="图片用途" allowClear style={formItemStyle} onChange={ this.category_selector }  >
                                      {
                                        purposeOptions.map((item,index) => {
                                            return ( <Option key={index} value={ item.name } > { item.name } </Option>)
                                        })
                                      }
                                    </Select>
                                  )}
                                  
                              </FormItem>


                              <FormItem >
                                   {getFieldDecorator('m_profile')(
                                            <TreeSelect
                                            allowClear
                                            disabled={ profile_visiable }
                                            style={{ width : 240 }} 
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={  oversizeOptions  }
                                            placeholder="请选择廓形"
                                            treeDefaultExpandAll
                                            onChange={ this.treeSelectorAction.bind(this,'profile') }
                                        />

                                    )}
                                  </FormItem>


                                 <FormItem >
                                     {getFieldDecorator('m_part')(
                                              <TreeSelect
                                                  allowClear
                                                  disabled={ part_visiable }
                                                  style={{ width : 240 }} 
                                                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                  treeData={  partOptions  }
                                                  placeholder="请选择部件"
                                                  treeDefaultExpandAll
                                                  onChange={ this.treeSelectorAction.bind(this,'part') }
                                              />

              

                                     )}
                                  </FormItem>

                            
                                 <FormItem >
                                     {getFieldDecorator('m_vertype')(
                                         <TreeSelect
                                              allowClear
                                              disabled={ vertype_visiable }
                                              style={{ width : 240 }} 
                                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                              treeData={  vertypeTags  }
                                              placeholder="请选择版型"
                                              treeDefaultExpandAll
                                              onChange={ this.treeSelectorAction.bind(this,'vertype') }
                                          />

                                     )}
                                  </FormItem>


                                 <FormItem >
                                     {getFieldDecorator('m_category')(
                                            <TreeSelect
                                                  allowClear
                                                  disabled={ category_visiable }
                                                  style={{ width : 240 }} 
                                                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                  treeData={  subsortOptions  }
                                                  placeholder="请选择品类"
                                                  treeDefaultExpandAll
                                                  onChange={ this.treeSelectorAction.bind(this,'category') }
                                              />


                                     )}
                                  </FormItem>

                                           
                            <FormItem >
                               {getFieldDecorator('m_details')(
                                     <Select placeholder="细节" allowClear style={formItemStyle}   disabled={ details_visiable }  onChange={ this.selectAction_attrs.bind(this,'details') } >
                                       {
                                          detailOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>


                            <FormItem >
                               {getFieldDecorator('m_style')(
                                     <Select placeholder="风格" allowClear style={formItemStyle}   disabled={ style_visiable }  onChange={ this.selectAction_attrs.bind(this,'style') } >
                                       {
                                         styleOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>


                               <FormItem >
                                 {getFieldDecorator('m_clen')(
                                     <Select placeholder="衣长" allowClear style={formItemStyle}   disabled={ clen_visiable }  onChange={ this.selectAction_attrs.bind(this,'clen') } >
                                       {
                                         clenOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>

                                  
                            <FormItem >
                              {getFieldDecorator('m_season')(
                                     <Select placeholder="季度" allowClear style={formItemStyle}   disabled={ season_visiable }  onChange={ this.selectAction_attrs.bind(this,'season') } >
                                       {
                                         seasonOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                     
                                    </Select>
                                  )}
                              </FormItem>

                                 <FormItem>
                                  {getFieldDecorator('m_time')(
                                      <RangePicker style={{ width: 300 }}   onChange={ this.rangePickerAction } />
                                     )}
                                  </FormItem>
                                  

                            <FormItem>
                              {getFieldDecorator('m_editor', { initialValue : undefined, })(
                                     <Select placeholder="修改人" allowClear style={formItemStyle}  onChange={ this.selectAction.bind(this,'editor') } >
                                       {
                                         editorOptions.map((item,index) => (
                                            <Option key={index} value={ item.editor ? item.editor.user_id : '' } > { item.editor ? item.editor.realname : '' } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>


                               <FormItem label="">
                                 {getFieldDecorator('m_release', { initialValue : undefined, })(
                                     <Select placeholder="发布状态" allowClear style={formItemStyle}  onChange={ this.selectAction.bind(this,'is_release') }  >
                                      <Option value="0">未发布</Option>
                                      <Option value="1">已发布</Option>
                                    </Select>
                                  )}
                              </FormItem>


                              <FormItem>
                                {getFieldDecorator('m_title')(
                                        <Search  placeholder="请输入图片名称" style={{ width: 210 }} onSearch={ this.searchAction } onPressEnter={ (e) => { this.searchAction(e.target.value)  } }  />
                                   )}
                              </FormItem>


                         </Form>
                      {/* 筛选列表 end  */}     

                  <div className="m-data-list">
                    {/* 这里有两种表现形式，table 和 列表形 */}
                    <div className="m-data-list-panel">
                      <div className="m-data-list-p-top">
                       <div className="left-item">
                        <ButtonGroup>
                          <Button type="danger" disabled={selectedRows.length ? false : true} onClick={ this.deleteRow } >删除</Button>
                          <Button disabled={selectedRows.length ? false : true} onClick={ this.onEditeAction.bind(this,true) } >编辑</Button>
                           <Button disabled={selectedRows.length ? false : true}  onClick={ this.cancelRelease.bind(this,0) } >取消发布</Button>
                               <Dropdown disabled={selectedRows.length ? false : true} overlay={ ( <Menu>
                                 <Menu.Item key="1" onClick={ this.release_immediately } >立即发布</Menu.Item>
                                 <Menu.Item key="2" onClick={ () => {  this.setState({ modalVisiable_ft : true })  } } >定时发布</Menu.Item></Menu>)}>
                                <Button>发布<Icon type="down" /></Button>
                             </Dropdown> 

                           </ButtonGroup>
                            <Alert message={`已经选择${selectedRows.length}项目`} 
                               style={{ width : 300, display : selectedRows.length? 'block' : 'none' }} 
                               type="info" showIcon />
                             </div>
                              <span>
                                  <Button style={{ border : 'none' }} onClick={ this.sortAction } >AZ  {  dirTag == 'asc' ? ( <Icon type="arrow-up" style={{ marginLeft : 0 }}/> ) : ( <Icon type="arrow-down" style={{ marginLeft : 0 }} />  ) }</Button>
                                  <Button  style={{ border : 'none' }} onClick={this.toggle_dispayForm} ><Icon type="bars" /></Button>
                              </span>
                           </div>
                       
                      </div>
                        {/* end of m-data-list-panel */}

                        

                         <TableForm onRefTable={ this.onRefTable  }   {...this.props} parentState={ this.state }  getSibling={ this.getSibling } /> 
                         <ListForm  onRefList={  this.onRefList  }   {...this.props} parentState={ this.state }   />

                        </div>

                    </TabPane>
                     {/* end of 素材 */}


                    <TabPane tab="待处理" key="2">
                        <Row>
                          <Col span={10}>
                           <Radio.Group value={ componentIndex } onChange={this.selectedComponent} style={{ marginBottom: 16 }}>
                               <Radio.Button value="1">解压处理</Radio.Button>
                               <Radio.Button value="2">相似检测</Radio.Button>
                               <Radio.Button value="3">待审核</Radio.Button>
                             </Radio.Group>
                            </Col>

                            <Col span={2} offset={ 12 } style={{ textAlign: 'right' }}>
                            <Button type="primary" icon="plus" onClick={() => { this.props.store.MaterialStore.setProperties('modalVisible',true);  }}>上传</Button>
                           </Col>
                         </Row>


                         <UploadInfoComponent  {...this.props} parentState={this.state}   parentRef={ this } />

                         <UploadStatusComponent {...this.props} parentState={this.state}  parentRef={ this }  />


                    </TabPane>
                    {/* end of 待处理 */}
                </Tabs>



                 {/* 定时发布弹窗 start  */}
                 <Modal
                     width={400}
                     title="定时发布"
                     visible={ modalVisiable_ft }
                     onCancel={ this.fixedTime_cancel }
                     footer={null}
                  >
                    <Row>
                       <Col span={24} style={{ marginBottom : 20 }}> <DatePicker  onChange={ this.onDateSelected }/> <TimePicker onChange={ this.onTimeSelected } /></Col>
                        <Col span={24}>
                           <Button type="danger" style={{ marginRight : 10 }} onClick={ this.fixedTime_cancel }  >取消</Button>
                           <Button onClick={ this.fixedTime_ok } >定时发布</Button>
                          </Col>
                     </Row>
                  </Modal>
               {/* 定时发布弹窗 end  */}


                {/* 上传弹窗 start  */}
               <UploadForm {...this.props} parentState={this.state}  onRef={ this.onRef_uploadForm } onClose={ this.modalOnCancel.bind(this) }  />                     
               {/* 上传弹窗 end  */}



               {/* 单个编辑弹窗 start  */}
                <ExamineModifier      store={ this.props.store }
                                      submitAction={ this.singleEditeSubmit }
                                      visiable={ this.props.store.MaterialStore.getSingleEditor } 
                                      onClose={ this.singleEditorAction.bind(this,false) } 
                                      />
               {/* 单个编辑弹窗 end  */}



                  {/* 批量编辑弹窗 start  */}
                  <BulkEditor  store={ this.props.store }  />
               {/* 批量编辑弹窗 end  */}


               
                 {/* 查看大图弹窗 start       */}
                 <Modal
                   className="viewBigPicture"
                   style={{ top: 40 }}
                   width={ 900 }
                   visible={ this.props.store.MaterialStore.getBigPictureVisiable }
                   closable={ false }
                   onCancel={  this.onCancel_bigPcture }
                   maskClosable={ true }
                   footer={null} >
                    <div className="bigPicture"> 
                         <figure> <img src={ this.props.store.MaterialStore.getBigPictureUrl } /> </figure>
                       </div>
                </Modal>
                 {/* 查看大图弹窗 end */}




              </Layout.Content>
        )
     }
}





@observer
class TableForm extends Component{
      state = {
        sortedInfo: {
            order: 'descend',
            columnKey: 'time',
          },
      }

    componentDidMount(){
          this.props.onRefTable(this);
    }


     render(){

           let { dispayForm } = this.props.parentState;
           let { sortedInfo } = this.state;
           let { page, limit } = this.props.parentState;

           let materialList =  mobx.toJS(this.props.store.MaterialStore.get_materialList);

           let count = this.props.store.MaterialStore.get_materialList_total;

        let rowSelection = {
                selectedRowKeys : mobx.toJS(this.props.store.MaterialStore.getSeletedRows),
                onChange: (selectedRowKeys, selectedRows) => {
               let sibling = this.props.getSibling('listChild');
                   sibling.updateCheckState(selectedRowKeys);  // 联动操作 List
                    this.props.store.MaterialStore.setSelectedRows(selectedRowKeys);
                },
                onSelect : (record, selected, selectedRows, nativeEvent) => {
                     
                },
                onSelectAll : (selected, selectedRows, changeRows) => {
                       //  console.log('selectedAll');
                }
          }


          return (
                 <div className="m-data-table" style={{ display :dispayForm? 'block' : 'none' }}> 
                      <Table 
                        scroll={{ y: 400 }}
                         rowSelection={rowSelection}
                         onRow={(record) => {
                           return  {
                                  onClick : () => {  // 不要了
                                    // this.props.store.MaterialStore.setProperties('modalVisible',true);
                                    // this.props.store.MaterialStore.setProperties('uploaderInitialValue',record);   // 提交或关闭弹窗都清空
                                }
                              }
                        }}
                    
                         rowClassName='m-rows'
                           columns={[
                                       {
                                        title: '图片名称',
                                        dataIndex: 'title',
                                        width : '25%'
                                       },
                                       {
                                        title: '附件',
                                        dataIndex: 'annexs_length', 
                                        width : '25%'
                                       },
                                       {
                                        title: '修改人',
                                        dataIndex: 'editor.realname',
                                        width : '25%'
                                       },
                                       {
                                        title: '修改时间',
                                        dataIndex: 'updated_at',
                                        width : '25%',
                                        // sorter: (a, b) => { return (_transform(a.time) > _transform(b.time))  },
                                        //  sortOrder: sortedInfo.columnKey === 'time' && sortedInfo.order,
                                       }
                                    ]} 
                             pagination={{
                                        current: ( Number(page) ) , 
                                        pageSize: ( Number(limit) ),
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        total : Number(count) | 0,
                                    showTotal: function(total,pageSize){
                                        return `共${Number(count)}条`
                                    },
                                    onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                                      let  { pathname, search } = this.props.location,
                                                  params = qs.parse(search.slice(1));
                                                  params.limit = 10;
                                                  params.page = pageNumber;

                                       this.props.history.push( `${pathname}?${qs.stringify(params)}` );

                           

                                    },
                                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)

                                            let  { pathname, search } = this.props.location,
                                                    params = qs.parse(search.slice(1));
                                                    params.limit = pageSize;

                                              this.props.history.push(`${pathname}?${qs.stringify(params)}` );

                                       }
                                    }}
                            dataSource={ materialList  } 
                            rowKey={'id'}
                            />
                 </div>
            ) 
       }      
}




@observer
class ListForm  extends Component {
      state = {
        indeterminate: false,
        checkAll: false
       
      }

      onCheckAllChange = (e) => {
            if(e.target.checked){

              let materialList =  mobx.toJS(this.props.store.MaterialStore.get_materialList);

                 let checkedList = materialList.map(item => {  return item.id  });

                 this.props.store.MaterialStore.setSelectedRows(checkedList);

            }else{
                this.props.store.MaterialStore.setSelectedRows([]);
            }

        this.setState({
              indeterminate: false,
             checkAll: e.target.checked,
        });


      }

 
     updateCheckState(seletedRows){  

      let materialList =  mobx.toJS(this.props.store.MaterialStore.get_materialList);

        this.setState({
            indeterminate: !!seletedRows.length && (seletedRows.length < materialList.length),
            checkAll: seletedRows.length === materialList.length,
        });    
     }


     onChange = (seletedRows) => {
        this.props.store.MaterialStore.setSelectedRows(seletedRows);
        this.updateCheckState(seletedRows);
      }




      componentDidMount(){  
        this.props.onRefList(this);
      }


    render(){

        
      let materialList =  mobx.toJS(this.props.store.MaterialStore.get_materialList);

      let count = this.props.store.MaterialStore.get_materialList_total;

        let { indeterminate, checkAll } = this.state;

        let { page, limit } = this.props.parentState;

        let { dispayForm } = this.props.parentState;

        let seletedRows = mobx.toJS(this.props.store.MaterialStore.getSeletedRows) || [];
        
        return (
             <div className="m-data-card" style={{ display : dispayForm ? 'none' : 'block' }}>
               <div style={{ borderBottom: '1px solid #E9E9E9', paddingBottom : '4px' }}>
                     <Checkbox indeterminate={indeterminate}  onChange={this.onCheckAllChange} checked={checkAll} > 全选</Checkbox>
                 </div>
                  <Checkbox.Group style={{ width: '100%' }} value={ seletedRows } onChange={this.onChange} >
                    <ul className="m-data-ul">
                        {
                            materialList.map((item, index) =>{
                                 return (
                                      <li key={index}> 
                                          <figure>   
                                               <Icon type="file-pdf" style={{ display  : item.annexs_length ? 'block' : 'none' }}  />
                                                <span className="img-box">
                                                  <img src={ item.preview.cpath }   alt=""/>   
                                                 </span>
                                                <Checkbox value={ item.id }><em className="img-title">{item.picture}</em></Checkbox>
                                                <figcaption>{ item.title }</figcaption> 
                                                <figcaption>{ item.preview.created_at }</figcaption> 
                                            </figure>   
                                       </li>
                                    )
                            })
                        }
                 </ul>
                </Checkbox.Group>

                <Row>
                  <Col span={10} offset={6}>
                          
                <Pagination 
                current={ Number( page ) } 
                pageSize={ Number( limit ) }
                showQuickJumper={true}
                showSizeChanger={true}
                total={Number(count) | 0} 
                showTotal={function(total,pageSize){
                    return `共${Number(count)}条`
                }}
                onChange={(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数

                    let  { pathname, search } = this.props.location,
                                params = qs.parse(search.slice(1));
                                params.limit = 10;
                                params.page = pageNumber;
                      this.props.history.push( `${pathname}?${qs.stringify(params)}` );

                }} 
                onShowSizeChange={(current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                              let  { pathname, search } = this.props.location,
                              params = qs.parse(search.slice(1));
                              params.page = current;
                              params.limit = pageSize;
                    this.props.history.push( `${pathname}?${qs.stringify(params)}` );

                }}
          />
                   </Col>
                </Row>

               
             </div>
        ) 
   }      
}





const MaterialLib = Form.create()(Material_lib);

export default MaterialLib;





