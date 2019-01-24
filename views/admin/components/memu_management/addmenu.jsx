import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import {  Form, Select, Input , Modal, Upload, TreeSelect, Icon } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT;
const MAXTAGCOUNT = 3;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };


  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }


 function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
   // return isJPG && isLt2M;
   return false
  }
  


  function values_filter( values ){
       var _values = Object.assign(values,{},true);
       var keys = Object.keys( values );
           keys.forEach(( key, index ) => {
                 var obj = values[key];
                 if( obj == undefined ){
                        delete _values[key];
                 }else{
                     
                     if( obj instanceof Array ){
                          obj.length ? '' : delete _values[key];
                     }else{
                          obj == '' ?  delete _values[key] : '';
                     }
                 }     
           });
      return _values
  }




@observer
class AddmenuModal extends  Component {
        state = {
            fileList:[],
            imgLoading: false,
            errors : [],
        };


    handleOk = ( ) => {
        let { form } = this.props;
        let { errors } = this.state;

        if( errors.length ){ 
            var TextCom = function(){
                       let link = '';
                       let abilitie = '';
                        errors.forEach((item,index) => {
                            switch( item ){
                            case 'abilitie' : abilitie = '权限不存在！';
                            break;
                            case 'link' : link = '请求地址不存在！';
                            break;
                            }
                    });
                  return (<div> <p style={{  margin : 0 }}>{ link }</p> <p style={{  margin : 0 }}>{ abilitie }</p> </div>)
            }
            Modal.warning({  title:'温馨提示',  content: <TextCom />  });
        }
         
     form.validateFields(['title','target'],(err, values) => {

          if (!err && errors.length == 0 ) {

                let _values = values_filter( this.props.form.getFieldsValue() );
                    _values.group_id = this.props.parentRef.parentId;
                    _values.app_id = 5;
                    _values.pid ? '' : _values.pid = 0; // 顶级菜单比用传，临时写法

        

                if( _values.icon && !_values.icon[0].hasOwnProperty('isEdited') ){ // 如果已选择上传图标，先上传图标. 

                    const formData = new FormData();
                    _values.icon.forEach((file) => { 
                         formData.append('file', new Blob([file]) ) 
                        //  formData.append('file', file ) 
                     });


                     if( !this.state.imgLoading ){ 
                            this.setState({ imgLoading : true });
                            this.props.store.groupStore.upload_icon( formData ).then(( { data } ) => {
                                this.setState({ imgLoading : false });
                                if( data.status_code == 201 ){
                                    _values.icon = data.data.id; // 已上传图标id
                                     console.log( _values )
                                    this.props.okAction( _values, form ); // 传入表单实例

                                }   
                         })

                     }

                }else{
                     //  如果是编辑 
                    if( _values.isEdited ){  
                            let menuInitialValue = mobx.toJS( this.props.store.groupStore.get_menuInitialValue );
                            _values.icon = menuInitialValue.icon;
                    }

                      console.log('_values.isEdited', _values)

                     this.props.okAction( _values, form ); // 传入表单实例 

                } 
          }
        });


    }
    
    handleCancel = () => {
        this.setState({ imageUrl : '', errors : [] });
        let { form } = this.props;
        this.props.cancelAction( form );// 传入表单实例
    }
    


     // 移除上传图片
    removeImage = ( file ) =>{
         this.props.form.setFieldsValue({ icon : undefined });
         this.setState({ imageUrl : '' }, () => { return true })
           
    }

   
  

     normFile = (e) => {
          console.log('Upload event:', e);
           var spliceFn = function( arry ){
                    var uIndex = -1;
                    arry.forEach((f,index) => { if( f.uid == -1 ) uIndex = index  });
                    if( uIndex > -1 ) arry.splice(uIndex,1);
           };

         // Get this url from response in real world.
         if( e.fileList && e.fileList.length  ){
                spliceFn( e.fileList  );
                getBase64(e.fileList[0].originFileObj, imageUrl => this.setState({
                    imageUrl,
                    loading: false
                })); 
         }
    
        if (Array.isArray(e)) {
             spliceFn( e );
              return e;
        }
        return e && e.fileList;
        
      }

     componentWillReceiveProps( nextProps ){
          if( nextProps.visible &&  nextProps.visible != this.props.visible ){
               let menuInitialValue = mobx.toJS( this.props.store.groupStore.get_menuInitialValue ),
                  { iconInfo,  isEdited = false } = menuInitialValue;
                  if( isEdited ){
                      iconInfo[0].url ? this.setState({ imageUrl : iconInfo[0].url  }) : '';  
                  }
               
          }
        
     }




    render(){

        let { title, visible, store, confirmLoading } = this.props;
        let menuInitialValue = mobx.toJS( store.groupStore.get_menuInitialValue );
        let allMenuItem = mobx.toJS( store.groupStore.get_allMenuItem );
        const { getFieldDecorator } = this.props.form;





         allMenuItem.unshift({ id : undefined, title : '无上级菜单', });





        const uploadButton = (
               <div>
                  <Icon type={this.state.imgLoading ? 'loading' : 'plus'} />
                  <div className="ant-upload-text">Upload</div>
               </div>
          );

        const imageUrl = this.state.imageUrl;


        // 编辑状态
        getFieldDecorator('isEdited', {  initialValue : menuInitialValue.isEdited ? true : false });


         return (
            <Modal
                title={ title }
                visible={ visible }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="提交"
                confirmLoading={ confirmLoading }
                 // okButtonProps={ { disabled :  this.state.errors.length > 0 ? true : false  } }
              >
              <Form>
                  <FormItem {...formItemLayout} label="菜单名称">
                    {getFieldDecorator('title', {
                        initialValue : menuInitialValue.title,
                        rules: [{
                            required: true,
                            message: '菜单名称不能为空',
                        }],
                    })(
                        <Input placeholder="请输入菜单名称" />
                    )}
                    </FormItem>

                     <FormItem {...formItemLayout} label="上级菜单">
                            {getFieldDecorator('pid', {
                                    initialValue : menuInitialValue.pid,
                                 // rules: [{   required: true, message: '请选择上级菜单', }],
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    // showCheckedStrategy={ SHOW_PARENT } 
                                    // multiple
                                    treeData={ allMenuItem }
                                    placeholder="请选择上级菜单"
                            />
                            )}
                         </FormItem>


                            
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('sort', {
                            initialValue : menuInitialValue.sort,
                            rules : [
                                // { required: true,   message: '排序不能为空',}
                                {
                                    validator : function(rule, value, callback){
                                        if( value ){
                                            if ( /^\d+$/.test( value )  ) {
                                                callback()
                                            }else{
                                                callback( '请输入整数' ) 
                                            }
                                        }else{
                                            callback( )
                                        }                                  
                                    }
                                }
                            ]
                        })(
                            <Input placeholder="请求输入排序" />
                        )}
                        </FormItem>



                    <FormItem {...formItemLayout} label="请求地址">
                    {getFieldDecorator('link', {
                        validateTrigger: 'onBlur',
                        initialValue : menuInitialValue.link,
                        rules: [
                            {
                                validator : (rule, value, callback) =>{
                                     if(value !== ''){
                                      // this.props.form.setFields({ link : { value, errors : [ new Error('验证失败！') ] }  });
                                         store.groupStore.verify_link( value ).then(( resp ) => { 
                                                var data = resp.data,
                                                    status_code = data.status_code;
                                                if( status_code == 200 || status_code == 201 ){
                                                    this.setState(( state ) =>{
                                                         var index = state.errors.indexOf( 'link' )
                                                         if( index == -1 ) state.errors.splice( index, 1 );
                                                         return state;
                                                     })
                                                }else{

                                                    this.setState(( state ) => {
                                                        state.errors.indexOf( 'link' ) == -1 ?  state.errors.push( 'link' ) : '';
                                                        return state;
                                                    }) 

                                                }

                                         }).catch(( err ) =>{
                                                this.setState(( state ) => {
                                                       state.errors.indexOf( 'link' ) == -1 ?  state.errors.push( 'link' ) : '';
                                                       return state;
                                                })
                                         })
                                     }else{
                                            this.setState(( state ) =>{
                                                     var index = state.errors.indexOf( 'link' )
                                                    if( index > -1 ) state.errors.splice( index, 1 );
                                                    return state;
                                            })
                                     }
                                     callback()
                                }
                            }
                        ],
                    })(
                        <Input placeholder="请输入请求地址" />
                    )}
                    </FormItem>


                 <FormItem {...formItemLayout} label="权限标识">
                    {getFieldDecorator('abilitie', {
                         initialValue : menuInitialValue.abilitie,
                         validateTrigger: 'onBlur',
                         rules: [
                            {
                                validator : (rule, value, callback) =>{
                                     if(value !== ''){
                                        store.groupStore.verify_ability( { app_id : 5, ability : value } ).then(( resp )=>{
                                                        var data = resp.data,
                                                           status_code = data.data || 0;
                                                    if( status_code == 1 ){  // 验证通过 => 1，不通过 => 0
                                                        this.setState(( state ) =>{
                                                            var index = state.errors.indexOf( 'abilitie' )
                                                            if( index == -1 ) state.errors.splice( index, 1 );
                                                            return state;
                                                        })

                                                    }else{

                                                        this.setState(( state ) => {
                                                            state.errors.indexOf( 'abilitie' ) == -1 ?  state.errors.push( 'abilitie' ) : '';
                                                            return state;
                                                        }) 

                                                    }

                                          }).catch(( err ) => {
                                    
                                            this.setState(( state ) => {
                                                  state.errors.indexOf( 'abilitie' ) == -1 ?  state.errors.push( 'abilitie' ) : '';
                                                  return state;
                                              })
                                               
                                          })
                                     }else{
                                            this.setState(( state ) =>{
                                                  var index = state.errors.indexOf( 'abilitie' )
                                                    if( index > -1 ) state.errors.splice( index, 1 );
                                                    return state;
                                            })
                                     }
                                     callback()
                                }
                            }
                        ]
                    })(
                        <Input placeholder="请输入权限标识" />
                    )}
                    </FormItem>



                    <FormItem {...formItemLayout} label="打开方式">
                    {getFieldDecorator('target', {
                        initialValue :  menuInitialValue.target,
                        rules: [{  required: true, message: '请选择打开方式',}],
                    })(
                        <Select placeholder="请选择打开方式" >
                            <Option value="_self">当前窗口</Option>
                            <Option value="_blank">新窗口</Option>
                            <Option value="_top">弹出窗口</Option>
                         </Select>
                    )}
                    </FormItem>

            <FormItem {...formItemLayout} label="图标">
                {getFieldDecorator('icon', {
                        initialValue : menuInitialValue.iconInfo,
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                    })(
                     <Upload
                             name="avatar"
                             listType="picture-card"
                             className="avatar-uploader"
                             showUploadList={ true }
                             beforeUpload={beforeUpload}
                             onRemove={ this.removeImage }
                          >
                            { 
                          //  imageUrl ? <img style={{ display: 'inline-block', width : 100, height : 100 }} src={ imageUrl } alt="avatar" /> : uploadButton 
                               imageUrl ? null : uploadButton
                            }
                      </Upload>
                    )}
                
             </FormItem>
             </Form>   
          </Modal>   
         )
    }
}


AddmenuModal.defaultProps = {
     title : '新增节点',
     visible : false,
     confirmLoading : false,
     okAction : function(){},
     cancelAction : function(){}
}


const AddMenuModal = Form.create()(AddmenuModal);
export default AddMenuModal;