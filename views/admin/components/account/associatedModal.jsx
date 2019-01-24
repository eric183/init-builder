import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import {  Form, Select, Input , Modal, TreeSelect } from 'antd';
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



 @observer
  class Associatedmodal extends Component {

    handleOk = () => {
         let { form } = this.props;
         form.validateFields((err, values) => {
            if (!err){
                let { disabled, depts, roles } = values;
                disabled == undefined ? delete values.disabled: ''; 
                if( depts instanceof Array ){
                    depts.length ? '' : delete values.depts;
                }else{
                     depts ? '' :  delete values.depts;
                }
                if( roles instanceof Array ){
                     roles.length ? '' : delete values.roles;
                }else{
                    roles ? '' :  delete values.roles;
                }

                this.props.okAction( values, form )
            }
        })

       
    }
    handleCancel = () => {
            let { form } = this.props;
            this.props.cancelAction( form )
    }


    render(){

            let { title, visible, okText, confirmLoading, store } = this.props;

            let aInitialValue = mobx.toJS( store.accountStore.get_aInitialValue );

            let { roles, depts } = mobx.toJS( store.accountStore.get_roles_depts );

            const { getFieldDecorator } = this.props.form;

             return (
                <Modal
                    title={ title }
                    visible={ visible }
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={ okText }
                    confirmLoading={ confirmLoading }
                 >
                  <Form>

                    <FormItem {...formItemLayout} label="手机号码">
                        {getFieldDecorator('mobile', {
                            initialValue : aInitialValue.mobile,
                            rules: [{
                                required: true,
                                message: '手机号码不能为空',
                             },
                             {
                                validator : function(rule, value, callback){
                                    if( value ){
                                        if (/^1[34578]\d{9}$/.test( value ) ) {
                                            callback( )
                                        }else{
                                            callback( '请输入正确手机号码' ) 
                                        }
                                    }else{
                                        callback( )
                                    }                                  
                                }
                            }
                           ],
                        })(
                            <Input placeholder="请输入手机号码" />
                        )}
                        </FormItem>  


                          <FormItem {...formItemLayout} label="真实姓名">
                            {getFieldDecorator('name', {
                                initialValue : aInitialValue.name,
                                rules: [{ required: true,  message: '真实姓名不能为空', }],
                            })(
                                <Input placeholder="请输入真实姓名" />
                            )}
                        </FormItem>   



                         <FormItem {...formItemLayout} label="启用状态">
                            {getFieldDecorator('disabled', {
                                initialValue : typeof aInitialValue.disabled == 'number' ? 
                                                        aInitialValue.disabled.toString() :
                                                        aInitialValue.disabled ,
                            })(
                                <Select placeholder="请选择启用状态">
                                    <Option value="0">启用</Option>
                                    <Option value="1">禁用</Option>
                                </Select>
                            )}
                            </FormItem>

                     <FormItem {...formItemLayout} label="部门">
                            {getFieldDecorator('depts', {
                                initialValue : aInitialValue.depts,
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    showCheckedStrategy={ SHOW_PARENT } 
                                    multiple
                                    treeData={ depts }
                                    placeholder="请选择部门"
                            />
                            )}
                         </FormItem>



                         <FormItem {...formItemLayout} label="角色">
                            {getFieldDecorator('roles', {
                                initialValue : aInitialValue.roles,
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    showCheckedStrategy={ SHOW_PARENT } 
                                    treeData={ roles }
                                    placeholder="请选择角色"
                               />
                            )}
                         </FormItem>

                  </Form>
                </Modal> 
             )
         }
  }

  Associatedmodal.defaultProps = {
    title : '关联账号',
    visible : false,
    okAction : function(){},
    cancelAction : function(){},
    okText : '提交',
    confirmLoading : false,
  }

  const AssociatedModal =  new Form.create()(Associatedmodal);
  export default AssociatedModal;