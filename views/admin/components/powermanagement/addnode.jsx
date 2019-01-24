import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import {  Form, Select, Input , Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

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

@observer
class Addnodemodal extends  Component {

    handleOk = (  ) => {
         let { form } = this.props;
          form.validateFields((err, values) => {
          if (!err) {
              let { disabled, scope, sort, type} =  values;
               disabled == undefined ? delete values.disabled : '';
               scope.length <= 0 ? delete values.scope : '';
               type == undefined ? delete values.type : '';
               sort == '' ? delete values.sort : '';
             this.props.okAction( values, form ); // 传入表单实例
              form.resetFields(); 
          }
        });
    }
    handleCancel = () => {
        let { form } = this.props;
         form.resetFields(); 
         this.props.cancelAction( form );// 传入表单实例
    }
    render(){
        let { title, visible, store, confirmLoading } = this.props;
        let addNodeInitialValue = mobx.toJS( store.powerStore.get_addNodeInitialValue );
        const { getFieldDecorator } = this.props.form;
      
         return (
            <Modal
                title={ title }
                visible={ visible }
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText="提交"
                confirmLoading={ confirmLoading }
              >
              <Form>
                <FormItem {...formItemLayout} label="资源">
                    {getFieldDecorator('name', {
                        initialValue : addNodeInitialValue.name,
                        rules: [{
                            required: true,
                            message: '资源不能为空',
                        }],
                    })(
                        <Input placeholder="请输入资源" />
                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="显示名">
                    {getFieldDecorator('title', {
                         initialValue : addNodeInitialValue.title,
                        rules: [{
                            required: true,
                            message: '显示名不能为空',
                        }],
                    })(
                        <Input placeholder="请求输入显示名" />
                    )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator('sort', {
                         initialValue : addNodeInitialValue.sort,
                         rules : [
                             // { required: true,   message: '排序不能为空',}
                            {
                                validator : function(rule, value, callback){
                                    if( value ){
                                        if ( /^\d+$/.test( value )  ) {
                                            callback( )
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


                    <FormItem {...formItemLayout} label="所属平台">
                    {getFieldDecorator('scope', {
                        initialValue : addNodeInitialValue.scope,
                       // rules: [{  required: true, message: '请选择所属平台',}],
                    })(
                        <Select placeholder="请选择所属平台"  mode="multiple" >
                            <Option value="1">趋势网</Option>
                         </Select>
                    )}
                    </FormItem>

                    
                    <FormItem {...formItemLayout} label="启用状态">
                    {getFieldDecorator('disabled', {
                        initialValue : addNodeInitialValue.disabled,
                      //  rules: [{  required: true,  message: '请选择启用状态', }],
                    })(
                        <Select placeholder="请选择启用状态">
                            <Option value="0">启用</Option>
                            <Option value="1">禁用</Option>
                         </Select>
                    )}
                    </FormItem>

                    <FormItem {...formItemLayout} label="节点类型">
                    {getFieldDecorator('type', {
                        initialValue : addNodeInitialValue.type,
                       // rules: [{   required: true, message: '请选择节点类型', }],
                    })(
                        <Select placeholder="请选择节点类型">
                            <Option value="controller">功能</Option>
                            <Option value="model">数据</Option>
                         </Select>
                    )}
                    </FormItem>


             </Form>   
          
          </Modal>   
         )
    }
}


Addnodemodal.defaultProps = {
     title : '新增节点',
     visible : false,
     confirmLoading : false,
     okAction : function(){},
     cancelAction : function(){}
}


const AddnodeModal = Form.create()(Addnodemodal);
export default AddnodeModal;