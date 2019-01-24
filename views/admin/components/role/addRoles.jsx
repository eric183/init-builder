import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import {  Form, Select, Input , Modal, TreeSelect } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

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
  class Addroles extends Component {

    handleOk = () => {
         let { form } = this.props;
         form.validateFields((err, values) => {
            if (!err){
                let { disabled, sort, remarks } = values;
                disabled == undefined ? delete values.disabled: ''; 
                remarks ? '' :  delete values.remarks;
                sort ? '' :  delete values.sort; 
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
            let addRolesInitialValue =  mobx.toJS( store.roleStore.get_addRolesInitialValue );
            let allAbilities = mobx.toJS( store.roleStore.get_allAbilities );
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
                    <FormItem {...formItemLayout} label="角色名称">
                        {getFieldDecorator('title', {
                            initialValue : addRolesInitialValue.title,
                            rules: [{
                                required: true,
                                message: '角色名称不能为空',
                            }],
                        })(
                            <Input placeholder="请求输入角色名称" />
                        )}
                        </FormItem>  

                          <FormItem {...formItemLayout} label="角色描述">
                            {getFieldDecorator('remarks', {
                                initialValue : addRolesInitialValue.remarks,
                               //  rules: [{ required: true,  message: '角色描述不能为空', }],
                            })(
                                <TextArea placeholder="请求输入角色描述" rows="3" cols="20" style={{ resize : ' none' }} />
                            )}
                        </FormItem>   

                         <FormItem {...formItemLayout} label="排序">
                            {getFieldDecorator('sort', {
                                initialValue : addRolesInitialValue.sort,
                                rules: [
                                   // { required: true, message: '排序不能为空' }
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
                              ],
                            })(
                                <Input placeholder="请求输入排序" />
                            )}
                            </FormItem>

                       <FormItem {...formItemLayout} label="所属网站">
                            {getFieldDecorator('app_id', {
                                initialValue : addRolesInitialValue.app_id,
                                rules: [{
                                    required: true,
                                    message: '请选择所属平台',
                                }],
                            })(
                                <Select placeholder="请选择所属平台"  mode="multiple" >
                                    <Option value="1">趋势网</Option>
                                </Select>
                            )}
                            </FormItem>

                         <FormItem {...formItemLayout} label="启用状态">
                            {getFieldDecorator('disabled', {
                                initialValue : typeof addRolesInitialValue.disabled == 'number' ? addRolesInitialValue.disabled.toString() : addRolesInitialValue.disabled ,
                              //  rules: [{ required: true, message: '请选择启用状态', }],
                            })(
                                <Select placeholder="请选择启用状态">
                                    <Option value="0">启用</Option>
                                    <Option value="1">禁用</Option>
                                </Select>
                            )}
                            </FormItem>


                         <FormItem {...formItemLayout} label="角色权限">
                            {getFieldDecorator('permission_ids', {
                                initialValue : addRolesInitialValue.permission_ids,
                                rules: [{   required: true, message: '请选择角色权限', }],
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    showCheckedStrategy={ SHOW_PARENT } 
                                    multiple
                                    treeData={ allAbilities }
                                    placeholder="请选择角色权限"
                            />
                            )}
                         </FormItem>

                  </Form>
                </Modal> 
             )
         }
  }

  Addroles.defaultProps = {
    title : '新增角色',
    visible : false,
    okAction : function(){},
    cancelAction : function(){},
    okText : '提交',
    confirmLoading : false,
  }

  const AddRoles =  new Form.create()(Addroles);
  export default AddRoles;