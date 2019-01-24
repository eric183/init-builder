import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import {  Form, Input , Modal, } from 'antd';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };



 @observer
  class Setpassword extends Component {

    handleOk = () => {
         let { form } = this.props;
         form.validateFields((err, values) => {
            if (!err){
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
                    <FormItem {...formItemLayout} label="新密码">
                        {getFieldDecorator('newPassword', {
                            rules: [{
                                required: true,
                                message: '新密码不能为空',
                             },
                             {
                                min : 6,
                                message: '密码最短6位数',
                             }
                           ],
                        })(
                            <Input placeholder="请输入新密码" />
                        )}
                        </FormItem>  

                          <FormItem {...formItemLayout} label="确认新密码">
                            {getFieldDecorator('confirmPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: '密码不能为空',
                                     },
                                     {
                                        validator : (rule, value, callback) => {
                                            const { getFieldValue } = this.props.form
                                            if (value && value !== getFieldValue('newPassword')) {
                                                callback('两次输入不一致！')
                                            }
                                            callback()
                                        }
                                    }
                            ],
                            })(
                                <Input placeholder="请确认新密码" />
                            )}
                        </FormItem>   

                  </Form>
                </Modal> 
             )
         }
  }

  Setpassword.defaultProps = {
    title : '设置密码',
    visible : false,
    okAction : function(){},
    cancelAction : function(){},
    okText : '提交',
    confirmLoading : false,
  }

  const SetPassword =  new Form.create()(Setpassword);
  export default SetPassword;