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
  class Adddepart extends Component {

    handleOk = () => {
         let { form } = this.props;
         form.validateFields((err, values) => {
            if (!err){
                let { pid, sort, desc } = values;
                desc ? '' :  delete values.desc;
                sort ? '' :  delete values.sort; 
                ( pid instanceof Array && pid.length ) ? '' : delete values.pid; 
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
            let departInitialValue = mobx.toJS( store.departStore.get_departInitialValue );
            let allAbilities = mobx.toJS( store.roleStore.get_allAbilities );
            let deptsTree = mobx.toJS( store.departStore.get_deptsTree ); 
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
                    <FormItem {...formItemLayout} label="部门名称">
                        {getFieldDecorator('title', {
                            initialValue : departInitialValue.title,
                            rules: [{
                                required: true,
                                message: '部门名称不能为空',
                            }],
                        })(
                            <Input placeholder="请求输入部门名称" />
                        )}
                        </FormItem>  

                          <FormItem {...formItemLayout} label="部门描述">
                            {getFieldDecorator('desc', {
                                initialValue : departInitialValue.desc,
                               //  rules: [{ required: true,  message: '角色描述不能为空', }],
                            })(
                                <TextArea placeholder="请输入部门描述" rows="3" cols="20" style={{ resize : ' none' }} />
                            )}
                        </FormItem>   


                         <FormItem {...formItemLayout} label="上级部门">
                            {getFieldDecorator('pid', {
                                initialValue : departInitialValue.pid,
                               //  rules: [{   required: true, message: '请选择上级部门', }],
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    showCheckedStrategy={ SHOW_PARENT } 
                                    treeData={ deptsTree }
                                    placeholder="请选择上级部门"
                            />
                            )}
                         </FormItem>

                         <FormItem {...formItemLayout} label="排序">
                            {getFieldDecorator('sort', {
                                initialValue : departInitialValue.sort,
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


                         <FormItem {...formItemLayout} label="启用状态">
                            {getFieldDecorator('disabled', {
                                initialValue : typeof departInitialValue.disabled == 'number' ?
                                                     departInitialValue.disabled.toString()
                                                  : departInitialValue.disabled ,
                               rules: [{ required: true, message: '请选择启用状态', }],
                            })(
                                <Select placeholder="请选择启用状态">
                                    <Option value="0">启用</Option>
                                    <Option value="1">禁用</Option>
                                </Select>
                            )}
                            </FormItem>


                         <FormItem {...formItemLayout} label="部门权限">
                            {getFieldDecorator('permission_ids', {
                                initialValue : departInitialValue.permission_ids,
                                rules: [{   required: true, message: '请选择部门权限', }],
                            })(
                                <TreeSelect
                                    allowClear
                                   // style={{ width : 240 }} 
                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                    showCheckedStrategy={ SHOW_PARENT } 
                                    multiple
                                    treeData={ allAbilities }
                                    placeholder="请选择部门权限"
                            />
                            )}
                         </FormItem>

                  </Form>
                </Modal> 
             )
         }
  }

  Adddepart.defaultProps = {
    title : '新增部门',
    visible : false,
    okAction : function(){},
    cancelAction : function(){},
    okText : '提交',
    confirmLoading : false,
  }

  const AddDepart =  new Form.create()(Adddepart);
  export default AddDepart;