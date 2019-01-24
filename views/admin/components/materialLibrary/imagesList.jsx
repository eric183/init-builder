import * as React from 'react';
import * as mobx from 'mobx';
import { observable, action, runInAction, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Row, Col,Input,DatePicker, Select, Pagination,Modal,Cascader, Form, TreeSelect } from 'antd';

import MaterialStore from '../../store/material/materialStore';
const Store = new MaterialStore();



const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;

   
function throttleMe(cb){
  var start = +new Date();
  return function(){
      var now = new Date();
      if(now - start > 50){
          start  = now;
          cb();
      }
  }
}


@observer class Imageslist extends  Component{
          state = {
            page : 1,
            limit : 10,
            visiable : false,
            timeArry : [],
            profile_visiable : true,
            part_visiable : true,
            vertype_visiable : true,
            category_visiable : true,
            details_visiable : true,
            style_visiable : true,
            clen_visiable : true,
            season_visiable : true 

          }

         clickOnImage(item){   // 来自外部的方法 
               this.props.clickAction &&  this.props.clickAction(item);
               this.onCancel();

           }


    linkedAction = (value) =>{

         let {  defaultConfig,  config, defualtTags } = mobx.toJS(Store.matarialConfig);
         let  visiableObjects = Object.assign({}, defaultConfig, true);   

           defualtTags.forEach(item => {
                if(value == item.name ) config[ item.key ].forEach( item => {  visiableObjects[item] = false });
           });
     
           console

            this.props.form.resetFields();  

            this.setState({ ...visiableObjects });


       
       } 
  

   
        createParams = () => {

            let fieldsValue = this.props.form.getFieldsValue();

            let params = {  page : 1, limit : 10, attrs : {  } };

             for( let key in fieldsValue ){
                    let keyReg = /^(im_){1}/ig;
                    let realKey = '';

                    if(keyReg.test(key)){

                        if(key == 'im_release'){
                            realKey = 'is_' + key.split('_')[1];
                        }else{
                            realKey =  key.split('_')[1];
                        }

                            // 临时方法
                           if( key == 'im_time' ){

                                let { timeArry } = this.state;

                                    timeArry.length ? ( params.begin =  timeArry[0], params.end = timeArry[1] ) : '';

                             }else if(key == 'im_editor' || key == 'im_release' || key == 'im_title'){

                                        if( fieldsValue[key] instanceof Array ){

                                            fieldsValue[key].length > 0 ?  params[ realKey ] =  fieldsValue[key] : '';
                                        }else{
                                            fieldsValue[key] ?  params[ realKey ] =  fieldsValue[key] : '';
                                        }

                            }else{      

                                if( fieldsValue[key] instanceof Array ){

                                     fieldsValue[key].length > 0 ?  params.attrs[ realKey ] =  fieldsValue[key] : '';
                                }else{

                                    fieldsValue[key] ?  params.attrs[ realKey ] =  fieldsValue[key] : '';
                                }

                            }

                        }  
                 }
                 
      
                // 临时方法
                 if(  params.attrs && params.attrs.vectorgraph ){
                    let _vectorgraph = params.attrs.vectorgraph;
                    if( _vectorgraph == '封面图' || _vectorgraph == '模特图' ){
                           delete params.attrs.vectorgraph;
                           if( _vectorgraph == '封面图')  params.attrs.picture_use = _vectorgraph;
   
                           if( _vectorgraph == '模特图' )  params.attrs.ptype = _vectorgraph;
   
                    }
                }

          return params;
        }     


      category_selector = (value) => {

         this.linkedAction(value);

         let params = this.createParams();

             if(value){
                 if( value == '封面图' || value == '模特图' ){

                        delete params.attrs.vectorgraph;

                        if( value == '封面图')  params.attrs.picture_use = value;

                        if( value == '模特图' )  params.attrs.ptype = value;

                 }else{

                      params.attrs.vectorgraph = value;   

                 }
             }else{
                 params.attrs = {}
             }

           Store.request_materialList(params);

       }
       




        filterAction_selector(type,value){

            let params = this.createParams();

                if(value){
                    params.attrs[type] = value
                }else{
                   delete params.attrs[type];
                }
               Store.request_materialList(params);
        }






        filterAction_RangePicker = (time,timeString) => {
                   this.setState({ timeArry : timeString })
                    let params = this.createParams();
                    let flag = false;
                    timeString.forEach(item => { item ?  flag = true : '' })
                    flag ? (params.begin = timeString[0], params.end = timeString[1]) : (delete params.begin, delete params.end);
            
                   Store.request_materialList(params);


        }



          filterAction_Search = (value) =>{
              let params = this.createParams();
                  value ?  params.title = value : delete params.title;
                 Store.request_materialList(params);
          
        }



        filterAction_Cascader(type,value){
                    let params = this.createParams();
                    value ? params.attrs[type] = value : delete params.attrs[type];
                    Store.request_materialList(params);

        }


        selectAction(type,value){
            let params = this.createParams();
             value ?  params[type] = value : delete params[type];
             Store.request_materialList(params);

        }






      componentDidMount(){
            Store.request_materialList();

               // 获取角度标签
               Store.request_tags('season');  
               Store.request_tags('vectorgraph');  
               Store.request_tags('angle');  
               Store.request_tags('details');  
               Store.request_tags('style');  
               Store.request_tags('clen');  
               
               Store.request_editors();

                Store.request_Allsubtags({ group  : 'part' });
                Store.request_Allsubtags({ group  : 'profile' });
                Store.request_Allsubtags({ group  : 'angle' });
                Store.request_Allsubtags({ group  : 'vertype' });
                Store.request_Allsubtags({ group  : 'category' });   // 所属品类

        }



        componentWillReceiveProps(nextProps) {
               // 每次点的时候，都请求数据 
               if(nextProps.visiable != this.state.visiable)  this.setState({  visiable : nextProps.visiable })
        }


        onCancel = () => {
             this.props.onClose &&  this.props.onClose();
        }




         render(){

     
            let imageListData = mobx.toJS( Store.get_materialList ),
                purposeOptions = mobx.toJS(  Store.purposeOptions),
                seasonOptions = mobx.toJS(  Store.seasonOptions),
                oversizeOptions = mobx.toJS(  Store.get_Profiletags),
                partOptions = mobx.toJS(  Store.get_PartTags),
                editorOptions = mobx.toJS( Store.get_editorOptions ),
                detailOptions = mobx.toJS(  Store.get_detailOptions),
                styleOptions = mobx.toJS(  Store.get_styleOptions),
                clenOptions = mobx.toJS(  Store.get_clenOptions),
                vertypeTags = mobx.toJS(  Store.get_VertypeTags),
                subsortOptions = mobx.toJS(  Store.get_subsortOptions);

          let count = Store.get_materialList_total;

           let { visiable, page, limit,
                    profile_visiable,
                    part_visiable,
                    vertype_visiable,
                    category_visiable,
                    details_visiable,
                    style_visiable,
                    clen_visiable,
                    season_visiable
            } = this.state;

           const formItemStyle = { width : 160 };

           const { getFieldDecorator } = this.props.form;
      

              return (
                <Modal
                className="imageLIst-modal"
                title="图片素材列表"
                style={{ top: 30 }}
                width={1200}
                visible={ visiable }
                onCancel={ this.onCancel }
                footer={null}
                >
            
                  <div className="imageList-wrapper" style={{ width : 1200 }}>
                    <div className="imageList-bar">
                     {/* 筛选列表 start  */}
                        <Form layout="inline" >
                           <FormItem>
                              {getFieldDecorator('im_vectorgraph')(
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
                                   {getFieldDecorator('im_profile')(
                                      <TreeSelect
                                            allowClear
                                            disabled={ profile_visiable }
                                            style={{ width : 220 }} 
                                            dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                            treeData={  oversizeOptions  }
                                            placeholder="请选择廓形"
                                            treeDefaultExpandAll
                                            onChange={ this.filterAction_Cascader.bind(this,'profile') }
                                        />

                                  
                                    )}
                                  </FormItem>


                                 <FormItem >
                                     {getFieldDecorator('im_part')(
                                        <TreeSelect
                                             allowClear
                                             disabled={ part_visiable }
                                             style={{ width : 220 }} 
                                             dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                             treeData={  partOptions  }
                                             placeholder="请选择部件"
                                             treeDefaultExpandAll
                                             onChange={ this.filterAction_Cascader.bind(this,'part') } 
                                         />


                                     )}
                                  </FormItem>

                            
                                 <FormItem >
                                     {getFieldDecorator('im_vertype')(
                                          <TreeSelect
                                            allowClear
                                            disabled={ vertype_visiable }
                                            style={{ width : 220 }} 
                                            dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                            treeData={  vertypeTags  }
                                            placeholder="请选择版型"
                                            treeDefaultExpandAll
                                            onChange={ this.filterAction_Cascader.bind(this,'vertype') }
                                         />
                                     )}
                                  </FormItem>


                                 <FormItem >
                                     {getFieldDecorator('im_category')(
                                             <TreeSelect
                                                allowClear
                                                disabled={ category_visiable }
                                                style={{ width : 220 }} 
                                                dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                treeData={  subsortOptions  }
                                                placeholder="请选择品类"
                                                treeDefaultExpandAll
                                                onChange={ this.filterAction_Cascader.bind(this,'category') }
                                           />
                                     )}
                                  </FormItem>

                                           
                            <FormItem >
                               {getFieldDecorator('im_details')(
                                     <Select placeholder="细节" allowClear style={formItemStyle}   disabled={ details_visiable }  onChange={ this.filterAction_selector.bind(this,'details') } >
                                       {
                                         detailOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>



                            <FormItem >
                               {getFieldDecorator('im_style')(
                                     <Select placeholder="风格" allowClear style={formItemStyle}   disabled={ style_visiable }  onChange={ this.filterAction_selector.bind(this,'style') } >
                                       {
                                         styleOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>


                               <FormItem >
                                 {getFieldDecorator('im_clen')(
                                     <Select placeholder="衣长" allowClear style={formItemStyle}   disabled={ clen_visiable }  onChange={ this.filterAction_selector.bind(this,'clen') } >
                                       {
                                         clenOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                    </Select>
                                  )}
                              </FormItem>

                                  
                            <FormItem >
                              {getFieldDecorator('im_season')(
                                     <Select placeholder="季度" allowClear style={formItemStyle}   disabled={ season_visiable }  onChange={ this.filterAction_selector.bind(this,'season') } >
                                       {
                                         seasonOptions.map((item,index) => (
                                          <Option key={index} value={ item.name } > { item.name } </Option>
                                         ))
                                       }
                                     
                                    </Select>
                                  )}
                              </FormItem>

                                 <FormItem>
                                  {getFieldDecorator('im_time')(
                                      <RangePicker style={{ width: 300 }}   onChange={ this.filterAction_RangePicker } />
                                     )}
                                  </FormItem>
                                  

                            <FormItem>
                             {getFieldDecorator('im_editor', { initialValue : undefined, })(
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
                                 {getFieldDecorator('im_release', { initialValue : undefined, })(
                                     <Select placeholder="发布状态" allowClear style={formItemStyle}  onChange={ this.selectAction.bind(this,'is_release') }  >
                                      <Option value="0">未发布</Option>
                                      <Option value="1">发布</Option>
                                    </Select>
                                  )}
                              </FormItem>


                              <FormItem>
                                {getFieldDecorator('im_title')(
                                        <Search  placeholder="请输入图片名称或标签名称" style={{ width: 210 }} onSearch={ this.filterAction_Search } onPressEnter={ (e) => { this.filterAction_Search(e.target.value) } }  />
                                   )}
                              </FormItem>


                         </Form>
                      {/* 筛选列表 end  */}     
                      </div>


                
                     {/* imageList-main start  */}
                       <div className="imageList-main"   ref="isrcoll">
                         <ul ref="scrollBox">
                          {
                            imageListData.length > 0 ? imageListData.map((item, index) => {
                                                    return (
                                                    <li key={index} onClick={ this.clickOnImage.bind(this,item) }>
                                                    <figure>
                                                        <img src={ item.preview && item.preview.path } alt=""/>
                                                        </figure>
                                                        <p> { item.title } </p>
                                                    </li>
                                                    )
                                            }) : 
                                 ( <li className="imageList_empty" >  暂无数据  </li> )
                           }
                           </ul>
                          </div>
                      {/* imageList-main end  , display : imageListData.length > 0 ? 'block' : 'none'   */}


                     <Row>
                       <Col span={ 9 } offset={ 7 } >
                       <Pagination  style={{ margin: '15px 0'}}
                         size="small" 
                         total={ Number( count ) } 
                         current={  Number( page )  }
                         pageSize={   Number( limit )   }
                         showSizeChanger 
                         showQuickJumper 
                         onChange={(page, pageSize) => {
                              let params = this.createParams(); 
                                   params.page = page;
                              this.setState({ page :  page });
                              Store.request_materialList(params);

                           }}
                         onShowSizeChange={(current, size) => {
                               let params = this.createParams(); 
                                    params.page = current;
                                    params.limit = size;
                                    this.setState({ limit :  size });
                                    Store.request_materialList(params);

                        
                           }}
                        />
                           
                        </Col>
                     </Row>
                  </div>
              </Modal>
              )
         }
   }




const ImagesList = Form.create()(Imageslist);
export default ImagesList;

