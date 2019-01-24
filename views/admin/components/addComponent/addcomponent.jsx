import * as React from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import moment from 'moment';
import qs from 'qs';
import axios from 'axios';
import { Row, Col, Layout, Button,Icon,Form, Input, Select, Divider,Cascader, TreeSelect, Checkbox,TimePicker,message} from 'antd';
import tools from './tools';
 const  {  dataBeModified, copyObject, createSignature } = tools;
   const FormItem = Form.Item;
   const Option = Select.Option;
   const TextArea = Input.TextArea;

   const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT;
   const MAXTAGCOUNT = 3;


   // 检测字符串长度
   function strlen(str){  
    var len = 0;  
    for (var i=0; i<str.length; i++) {   
    var c = str.charCodeAt(i);   
    //单字节加1   
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
            len++;   
        }   
    else {   
            len+=2;   
         }   
    }   
    return len;  
}


  // 百分比限制
   function min_max_percentage(folders){
            let expands = 0;
            folders.map((item,index) => {  expands += Number(item.expands)  });
        if(expands != 100 ) return false;
            return true     
    }





@observer
class Addcomponent extends Component {

     state = {
        defaultFieldsValue : mobx.toJS(this.props.store.FashionStore.defaultFieldsValue),
         openTiming : false,
         loading : false,
         timing : '',
         isCached: false, // 开启缓存
         imageInfo : {}   // 点击“主图”、“模特图” 保存当前图片元素的信息 ，在关闭弹窗是清空。 
     }

     saveTimer = null;
     
     saveDraft = () => {
        this.saveTimer = setInterval(() => { 
            this.state.isCached ? '' : this.setState({ isCached : true }) ;
            let fieldsValue =  this.props.form.getFieldsValue();
            let newFieldsValue =  dataBeModified(fieldsValue);
            if(newFieldsValue){
                 this.props.util.setLocalstorage('fieldsValue',newFieldsValue);
            }
      }, 15000);  // 间隔15秒

     }


  
     // folders 字段 在新建编辑时，存于本地的与后台返回的数据格式不一致；
     process_folders( fieldValue  ){

         var _fieldValue = copyObject(fieldValue);

            _fieldValue.folders.forEach((item, index) => {

                    if( !(item.expands instanceof Object) ){

                         item.percent = item.expands;

                         fieldValue.folders[index].expands = item

                    }

              })
          return fieldValue
     }



// 如果本地有数据，进行处理
   dataFromLocalStore  = (_fieldValue,callback) => {

    let fieldValue = copyObject(_fieldValue);

    let defaultFieldsValue  = mobx.toJS(this.props.store.FashionStore.defaultFieldsValue);

         for (let key in defaultFieldsValue) {
             if (!fieldValue[key]) fieldValue[key] = defaultFieldsValue[key];
             
         }

         if (fieldValue.folders.length < 3) {
             let fieldArr = defaultFieldsValue.folders[0];
             for (let len = fieldValue.folders.length; len < 3; len++) {
                 fieldArr.id = createSignature();
                 fieldValue.folders.push(fieldArr);
             }
         }

         callback(  this.process_folders(  fieldValue  )  );
     }
 



     clearSaveTimer = () => {
        if(this.saveTimer){ 
             clearInterval(this.saveTimer);
             this.setState({ isCached : false })
        } 
     }

     onOpenTiming = (e) => {  // 此功能暂时不用
         this.setState({ openTiming : e.target.checked })
     }


     onTimePicked = (time, timeString) => {  // 此功能暂时不用
           this.setState({ openTiming : timeString })
     }


    addFormItem = () =>{
       
          let defaultFieldsValue = copyObject( this.state.defaultFieldsValue );

          if( defaultFieldsValue.folders.length >= 20 ){ // 限制创建 20 条

               message.warning('每次只能添加20条！')

          }else{

              let newField = mobx.toJS(this.props.store.FashionStore.defaultFieldsValue).folders[0];
                  newField.id = createSignature(); // 添加虚假 id
                  newField.new = 1;
                  newField.materials.forEach((item,index) =>{  item.id = createSignature()  }); // 添加虚假 id 

                  defaultFieldsValue.folders.push( newField );

                  this.setState({ defaultFieldsValue  });

          }
    }

    removeFormItem = (fieldData) => { 

          this.props.store.FashionStore.deleteFolder(fieldData.id);

          let defaultFieldsValue = copyObject( this.state.defaultFieldsValue );

          if(defaultFieldsValue.folders.length <= 3) return false;

            defaultFieldsValue.folders.forEach((field, i) => {

               if( field.id == fieldData.id) defaultFieldsValue.folders.splice(i, 1);  // 通过 id 删除指定数据

          });

          this.setState({ defaultFieldsValue });
    }


    
    onSubmit = () => {
         this.props.form.validateFields((err, values) => {


            if (!err) {

                    // 回调函数
                    var callbackFN = () =>{  
                            
                        this.setState({ loading : false });   
                        this.props.modalOnCancel();
            
                    let  { pathname, search } = this.props.location,
                            params = qs.parse(search.slice(1));
            
                            if(!params.attrs) params.attrs = {  category :  this.props.parentRef.state.active }
                                
                            this.props.store.FashionStore.request_F_TableData(params);  // 请求列表数据
            
                         // this.props.history.push( `${pathname}?${qs.stringify(params)}`); // 请求列表数据
                    
                    };


             let  onedite = this.props.util.getLocalstorage('onedite');


                // 如果是编辑 
                if(onedite == '2' ){  
                     let rowRecord = this.props.util.getLocalstorage('rowRecord');
                       values.folders.forEach((item, index ) => {   
                                if(rowRecord.folders[index]){ // 判断rowRecord 在该索引是否有值
                                     item.id =  rowRecord.folders[index].id
                                }else{
                                    item.id =  createSignature();
                                    item.new = 1;
                                }

                                 for(let key in item){
                                    if(item[key] instanceof Array){
                                       item[key].length ? '' : delete item[key];
                                    }else{
                                       item[key] ? '' : delete item[key];
                                    }
                                }
                         });


                        rowRecord.attrs = values.attrs;
                        rowRecord.folders = values.folders;
                        rowRecord.title = values.title;

                     if(min_max_percentage(rowRecord.folders)){ // 验证百分比
                          this.setState({ loading : true });
                          this.props.store.FashionStore.edit_F_Item(rowRecord, callbackFN); // 请求完成回调， 清空表单，清除缓存。关闭弹窗。
                      }else{
                           message.warning('百分比总和需等于100！')
                      }


                 }else{ //如果是新增  

                     let values_copy = Object.assign({}, values, true);
                     let { folders, title, attrs } = values_copy;
                     
                        folders.forEach((item, index) => {
                                item.materials = item.materials.map((item, index) => { return item.entity_id  });     //  在新增时，需处理 materials 数组
                               // if( index > 2 ) item.new = 1;
                                for(let key in item){
                                       if(item[key] instanceof Array){
                                          item[key].length ? '' : delete item[key];
                                       }else{
                                          item[key] ? '' : delete item[key];
                                       }
                                }

                        });


                          if(min_max_percentage( folders )){ // 验证百分比
                                this.setState({ loading : true });
                               this.props.store.FashionStore.add_F_Item( { folders, title, attrs } , callbackFN);    // 请求完成回调， 清空表单，清除缓存。关闭弹窗。
                          }else{
                               message.warning('百分比总和需等于100！')
                          }

                 }


              
            }

          })

    }



   
    onOpenAction = () => {


       let  onedite  = this.props.util.getLocalstorage('onedite');

          //如果是新建打开，并之前保存有编辑数据，清除掉编辑数据
          if( onedite == '1'){
                         this.props.util.removeLocalstorage('onedite');  
                         this.props.util.removeLocalstorage('rowRecord'); 
                         this.props.util.removeLocalstorage('fieldsValue');           
          }


          // 检查本地是否存在数据【 排除编辑数据 】
          let localData = this.props.util.getLocalstorage('fieldsValue');
          
          if(localData){  // 如果有数据
              this.props.util.setLocalstorage('category',localData.attrs.category);
              this.props.store.FashionStore.request_limitedSort({ category : localData.attrs.category });  // ‘所属品类’
              this.dataFromLocalStore(localData,(newFieldsValue) => { 
                             this.setState({ defaultFieldsValue : newFieldsValue })
                 })

           }else{

              this.props.store.FashionStore.request_limitedSort({ category : this.props.parentRef.state.active }); 

           }

         if(onedite != '2') this.saveDraft();  // 开启间隔15秒保存草稿 【编辑状态不开启缓存】 


    }



    onCancel = ( callBack ) => { // 提供父组件调用

        let onedite = this.props.util.getLocalstorage('onedite');

        let flag = true;
        
          if(onedite == '2'){ // 如果是编辑
                let fValues =  this.props.form.getFieldsValue();
                    flag = min_max_percentage( fValues.folders );
          }


        if( flag ){ // 通过

                this.setState({ 
                    openTiming : false,
                    timing : '' ,
                });


                this.props.form.resetFields(); 
        
                // 清除saveTimer
                this.clearSaveTimer();
        
                // 清除localstorage
                this.props.util.removeLocalstorage('fieldsValue');

                this.props.util.removeLocalstorage('onedite');

                this.props.util.removeLocalstorage('rowRecord');

                this.props.util.removeLocalstorage('category');
        
                // “主图”、“模特图” 当前图片元素的信息 ，在关闭弹窗清空。 
                this.setState({ imageInfo : { }, defaultFieldsValue : mobx.toJS(this.props.store.FashionStore.defaultFieldsValue) });

                callBack && callBack(); 
               
        }else{

              message.warning('百分比总和需等于100, 确定修改,请先保存！')
              
         }

      
    }




     /*
       * @param { Array[object] } fieldName  getFieldDecorator的ID名称
       * @param { number } index  模特图索引
       * @param { object } target  当前点击元素
       * */
   clickOnImage = (fieldName, index,target) => {  // FormItemComponent 组件调用
           //  打开“图片悬浮列表”
            this.props.setImageListVisiable(true);
            this.setState({ imageInfo : { fieldName, index, target } })
   }

    
    _setFieldsValue = (imgInfo) => {  // 该方法通过父组件传给 【imageList】 组件的回调

        let { fieldName, index, target } = this.state.imageInfo,
            _form = this.props.form,
            groupName = fieldName[0],
            foldersIndex = fieldName[1],    //  foldersIndex  folders数组索引
            subName =  fieldName[2],

            fieldsValue = _form.getFieldsValue();

            let _value = Object.assign({},fieldsValue[groupName][foldersIndex][subName][index], true);   // 临时方法

               _value.entity_id =  imgInfo.preview.id;

               _value.image = imgInfo.preview.path; 

             fieldsValue[groupName][foldersIndex][subName][index] = _value;

             target.src = imgInfo.preview.path;

           _form.setFieldsValue(fieldsValue);



    
    }


   _getFieldsValue = () => {  //  该方法通过父组件传给 【 preview 】 组件的调用
        return this.props.form.getFieldsValue();
   }


   onPreview = () => {
    let fValues =  this.props.form.getFieldsValue();
       if( min_max_percentage( fValues.folders ) ){
                this.props.store.FashionStore.setProperties('previewVisiable',true);
                setTimeout(() => {  this.props.parentRef.previewObj._onOPenAction() }, 700);
       }else{
           message.warning('百分比总和需等于100！')
       }

   }



   limitAction = (value) => {  // 暂时无用

        let _form = this.props.form,
            fieldsValue = _form.getFieldsValue();
           fieldsValue.folders.forEach( item =>{  item.title = [];   });

          _form.setFieldsValue(fieldsValue);

           this.props.store.FashionStore.request_limitedSort( { category : value } );

           this.props.util.setLocalstorage('category',value);

   }



   // 验证标题重复
   checkTitleBeforSubmit = () => {
        let value = this.props.form.getFieldsValue(['title']);
        let  onedite = this.props.util.getLocalstorage('onedite');

        let defaultFieldsValue = this.state.defaultFieldsValue;

        let flag = false; 

        if(onedite == 2 && ( value.title != defaultFieldsValue.title ))  flag = true;  
        if( onedite != 2 )  flag = true;  

        if( flag ){  // 标题查重
              if(value.title){
                    this.props.store.FashionStore.check_title( value , (state) => { 
                                if(state == 'true'){
                                    this.onSubmit();
                                }else{
                                    this.props.form.setFields({
                                        title: {
                                            value: value.title,
                                            errors: [new Error('主题名称已存在！')],
                                        },
                                    })
                                }
                            
                        });
                }else{
                        this.onSubmit();
                }

        }else{

            this.onSubmit();
              
        } 
   }




    componentWillMount(){  this.props.onRef(this) }
    componentDidMount(){   }
    componentWillUnmount(){ 
        this.onCancel();
        this.clearSaveTimer();
     }



     render(){

           let { defaultFieldsValue, loading, isCached } = this.state;

            const { getFieldDecorator } = this.props.form;

            const formItemLayout = {
                    labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                    },
                    wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                    }
            };


            console.log( defaultFieldsValue )


          return (
            <Layout.Content className="add-component-layout">
                 {/* add-component-main start  */}
               <div className="add-component-main">
              <Form>

                  <Row>
                    <Col span={12}> 
                            <FormItem required label="主题名称" {...formItemLayout} >
                            { getFieldDecorator('title',{ initialValue : defaultFieldsValue.title,  rules: [
                                  { required: true, message: '请输入主题名称' },
                                  {
                                    validator : function(rule, value, callback){
                                                 if(value){
                                                    value.length > 50 ? callback('输入字符限制50个内') : callback();
                                                 }else{
                                                    callback()
                                                 }  
                                    }
                                  }] })(
                                    <Input placeholder="请输入名称" />  
                            )
                            }
                        </FormItem>
                      </Col> 

                      <Col span={12}>
                      <FormItem label="品类" {...formItemLayout}>
                            { getFieldDecorator('attrs.category',{ initialValue : defaultFieldsValue.attrs.category || this.props.parentRef.state.active ,  rules: [{ required: true, message: '请选择品类' }] })(
                                    <Select allowClear placeholder="请选择品类" onChange={ this.limitAction } disabled >
                                    <Option value='外套'> 外套 </Option>
                                    <Option value='裙装'> 裙装 </Option>
                                    <Option value='上装'> 上装 </Option>
                                    <Option value='下装 '> 下装 </Option>
                                   </Select>
                            )
                            }
                        </FormItem>
                      </Col>      
                    </Row>    
                    <Divider />   

        
                     {/* 动态添加组件 start  */}
                      {
                         defaultFieldsValue.folders.map((item, index) => {
                              return (
                                <FormItemComponent itemData={ item } 
                                                   key={index} 
                                                   index={index} 
                                                  {...this.props}
                                                  removeFormItem={this.removeFormItem}
                                                  clickOnImage={ this.clickOnImage }/> 
                              )
                           })
                      }
                     {/* 动态添加组件 end */}


                   <FormItem   wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 5 }}} >
                     <Button type="dashed" onClick={this.addFormItem} style={{ width: '60%' }}> <Icon type="plus" /> 添加 </Button>
                    </FormItem>
            
                 </Form>
                </div>
              {/* add-component-main end  */}
                
            <Divider />

              <div className="add-component-footer">

               <Row type="flex" justify="space-between">
               <Col span={4}><p style={{ marginTop: '5px', display : isCached ? 'block' : 'none' }}  > 已缓存草稿 </p></Col>
                {/* 暂时隐藏 start  */}
                <Col span={4}><p style={{ marginTop: '5px' }}></p> </Col>
                 <Col span={6}>
                    <Row>
                      <Col span={12} style={{ marginTop: '5px', visibility : 'hidden' }}> 定时发布 : <Checkbox onChange={ this.onOpenTiming  }>开启</Checkbox></Col>
                      <Col span={12} style={{  visibility : 'hidden'  }} > <TimePicker onChange={ this.onTimePicked }  allowEmpty defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} /> </Col>
                      </Row> 
                 </Col>
                  {/* 暂时隐藏 end  onSubmit */}

                <Col span={8} style={{ textAlign: 'right' }}>  
                    <Button  style={{ border : 'none' }} onClick={ this.onPreview } >预览</Button>    
                    <Button onClick={ this.props.modalOnCancel } style={{ marginRight : '10px', marginLeft : '10px' }}>取消</Button>    
                    <Button type="primary" onClick={ this.checkTitleBeforSubmit  } loading={loading} >保存</Button>    
                 </Col>

                </Row>
              </div>
             </Layout.Content>   
          )
     }
}





@observer
class FormItemComponent extends Component {

       touchedImage = (fieldName, index, event) => {
             this.props.clickOnImage(fieldName, index, event.target);
    }

     // 自定义  getFieldDecorator 验证
    customeValidation =  (rule, value, callback) => {
        let flag = 0;
         value.forEach((item, index) => {
               if(item.entity_id){ flag += 1 } 
         });
          if (flag == 4) {
                callback();
                return;
              };

         callback('请添加所有模特图');
    }


   


      render(){

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
            xs: { span: 24 },
            sm: { span: 3 },
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 10 },
          }
        };

        const  itemWidth = { width : 250 };
        const _index = this.props.index;
        
         const _itemData = this.props.itemData;

         !_itemData.expands ? _itemData.expands = {} : '';

         let limitedSort = mobx.toJS(this.props.store.FashionStore.get_limitedSort);
         let seasonArry = mobx.toJS(this.props.store.FashionStore.get_seasonArry);
         let detailOptions = mobx.toJS(this.props.store.FashionStore.get_detailOptions);
         let styleOptions = mobx.toJS(this.props.store.FashionStore.get_styleOptions);
         let clenOptions = mobx.toJS(this.props.store.FashionStore.get_clenOptions);
         let profiletags = mobx.toJS(this.props.store.FashionStore.get_profiletags);
         let partTags = mobx.toJS(this.props.store.FashionStore.get_partTags);

        //  let vertypeTags = mobx.toJS(this.props.store.FashionStore.get_vertypeTags);


     return(
          <Row>
            <Col span={1}><strong>{ _index + 1 } :</strong> </Col>
              <Col span={23}>
                 <Row>
                     <Col span={14}>
                            <FormItem id="treeSelectBox" labelCol={{
                            xs: { span: 24 },
                            sm: { span: 5 }
                            }} 
                            wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 17 },
                            }}  label="扇形名称" >

                            {getFieldDecorator(`folders[${_index}].title`, {   // 'member[0].name.firstname   group_1[0].name
                                initialValue: _itemData.title, 
                                rules: [
                                    { required: true, message: '请输入名称!' },
                                    {
                                        validator : function(rule, value, callback){
                                                     if(value){
                                                        value.length > 50 ? callback('输入字符限制50个内') : callback();
                                                     }else{
                                                        callback()
                                                     }  
                                              }
                                    }
                                ],
                               })(
                                   <Input style={{ width : 250 }} placeholder="扇形名称" />
                            )}
                            </FormItem>  
                       </Col>
                    <Col span={10}>
                     <FormItem labelCol={{
                                        xs: { span: 24 },
                                        sm: { span: 7 }
                                    }} 
                                    wrapperCol={{
                                        xs: { span: 24 },
                                        sm: { span: 17 },
                                      }}
                                    label="占百分比(%)" >
                         { getFieldDecorator(`folders[${_index}].expands`, {
                            initialValue: _itemData.expands.percent || '',
                            rules: [{  required: true, pattern:/^(100|[1-9]?\d(\.\d\d?)?)$/, message: '非法输入!' }],
                        })(
                            <Input style={{ width : 60 }} />
                        )}
                        </FormItem>   
                     </Col>
                  </Row>



                   <FormItem { ...formItemLayout }  label="所属品类" >
                         {getFieldDecorator(`folders[${_index}].category`, {
                            initialValue: _itemData.expands.category, 
                            rules: [{ required: true, message: '请输入品类!' }],
                        })(
                            <TreeSelect
                                allowClear
                                style={{ width : 240 }} 
                                dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                showCheckedStrategy={ SHOW_PARENT } 
                                multiple
                                treeData={ limitedSort }
                                placeholder="请选择品类"
                            />
                        )}
                     </FormItem>   

                            <FormItem  {...formItemLayout} label="廓形" >
                                {getFieldDecorator(`folders[${_index}].profile`,{  initialValue: _itemData.expands.profile  })( 
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="廓形"
                                                    treeData={ profiletags } 
                                            />
      
                                )}
                           </FormItem>


                            <FormItem {...formItemLayout} label="部件" >
                                {getFieldDecorator(`folders[${_index}].part`, {  initialValue: _itemData.expands.part })( 
                                         <TreeSelect  style={itemWidth}
                                                      maxTagCount={ MAXTAGCOUNT }
                                                      dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                      showCheckedStrategy={SHOW_PARENT} 
                                                      multiple
                                                      allowClear  
                                                      placeholder="部件"
                                                      treeData={ partTags } 
                                            />

                                )}
                           </FormItem>


                           {/*
                                <FormItem {...formItemLayout} label="版型" >
                                    {getFieldDecorator(`folders[${_index}].vertype`, {  initialValue: _itemData.expands.vertype })(
                                            <TreeSelect  style={itemWidth}
                                                        maxTagCount={ 5 }
                                                        dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                        showCheckedStrategy={SHOW_PARENT} 
                                                        treeCheckable={ true } 
                                                        allowClear  
                                                        placeholder="版型"
                                                        treeData={ vertypeTags } 
                                                />
                                    )}
                                </FormItem>
                             */}


                           
                          <FormItem  {...formItemLayout} label="风格"> 
                              {getFieldDecorator(`folders[${_index}].style`,  { initialValue : _itemData.expands.style })( 
                                <Select style={itemWidth} placeholder="风格" allowClear  mode="multiple" >
                                     {
                                        styleOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                         <FormItem  {...formItemLayout} label="衣长"> 
                              {getFieldDecorator(`folders[${_index}].clen`,  { initialValue : _itemData.expands.clen  })(  
                                <Select style={itemWidth} placeholder="衣长" allowClear  mode="multiple" >
                                     {
                                        clenOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>


                            <FormItem {...formItemLayout} label="细节" >
                               {getFieldDecorator(`folders[${_index}].details`,  { initialValue : _itemData.expands.details })( 
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"  >
                                      {  
                                        detailOptions.map((item,index) => (<Option key={index} value={item.name } > { item.name }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>


                          <FormItem  {...formItemLayout} label="季度" > 
                              {getFieldDecorator(`folders[${_index}].season`,  { initialValue : _itemData.expands.season })( 
                                <Select style={itemWidth} placeholder="季度"  allowClear  mode="multiple" >
                                        {
                                            seasonArry.map((item,index) => (  <Option key={index} value={ item.name } > { item.name } </Option> ))
                                        }
                                    </Select>
                               )}   
                             </FormItem>
      

                   <FormItem {...formItemLayout}  label="解读内容" >
                         {getFieldDecorator(`folders[${_index}].desc`, {
                            initialValue: _itemData.desc,
                            rules: [{ required: true, message: '请输入解读内容!' },
                            {
                                validator : function(rule, value, callback){
                                             if(value){
                                                value.length > 500 ? callback('输入字符限制500个内') : callback();
                                             }else{
                                                callback()
                                             }  
                                      }
                            } ],
                        })(
                            <TextArea  style={{ resize : 'none' }} rows={4} placeholder="请输入解读内容" />
                        )}
                     </FormItem>   

                
                    <FormItem labelCol={{
                                        xs: { span: 24 },
                                        sm: { span: 3 }
                                    }} 
                                    wrapperCol={{
                                        xs: { span: 24 },
                                        sm: { span: 16 },
                                      }}  label="封面图" >
                         { getFieldDecorator(`folders[${_index}].materials`, {
                            initialValue: _itemData.materials,
                            rules: [{ required: true, message: '请添加封面图!' }],
                           })(
                               
                            <div className="add-component-img-box">
                                <figure>
                                     <img src={ (_itemData.materials.length &&  _itemData.materials[0].image ) ? _itemData.materials[0].image : "assets/images/addimg.jpg" }  
                                   onClick={ (event) => { this.touchedImage([`folders`, _index,'materials'], 0 , event)} } />
                                 </figure>  
                            </div>
                           )
                        }
                     </FormItem>   

                       <FormItem required style={{ marginBottom : 0 }}  labelCol={{
                                        xs: { span: 24 },
                                        sm: { span: 3 }
                                    }} 
                                    wrapperCol={{
                                        xs: { span: 24 },
                                        sm: { span: 16 },
                                      }}  label="模特图" >
                         { getFieldDecorator(`folders[${_index}].materials`, {
                            initialValue: _itemData.materials,
                           rules: [{ validator : this.customeValidation }],
                           })(
                            <div className="add-component-img-box">
                                <figure>
                                     <img onClick={ (event) => { this.touchedImage([`folders`, _index, 'materials'], 1, event)}}  
                                         src={ (_itemData.materials.length >= 2 && _itemData.materials[1].image ) ? _itemData.materials[1].image : "assets/images/addimg.jpg"}  />
                                    </figure>
                                <figure>
                                     <img onClick={ (event) => { this.touchedImage([`folders`, _index, 'materials'], 2, event) }}  
                                          src={ (_itemData.materials.length >= 3 &&  _itemData.materials[2].image) ? _itemData.materials[2].image : "assets/images/addimg.jpg" }  />
                                     </figure>  
                                <figure>
                                     <img  onClick={ (event) => { this.touchedImage([`folders`, _index, 'materials'], 3, event) }} 
                                           src={  (_itemData.materials.length >= 4 && _itemData.materials[3].image ) ? _itemData.materials[3].image : "assets/images/addimg.jpg"}  />
                                     </figure>  
                            </div>
                           )
                        }
                     </FormItem>  
                     <div className="add-component-delete-btn" style={{ display : ( _index == 0 || _index == 1 || _index == 2) ? 'none' : 'block' }}>
                       <Button type="danger" size="small" onClick={ () => { this.props.removeFormItem && this.props.removeFormItem(_itemData) } } >移除</Button>
                      </div> 
                   <Divider dashed style={{ marginTop : 0 }} />  
                </Col>
            </Row>
           )
      
      }
}








const AddComponent = Form.create()(Addcomponent);
export default AddComponent;