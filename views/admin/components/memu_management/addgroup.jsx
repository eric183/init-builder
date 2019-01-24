import React, { Component } from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import qs from 'qs';
import {  Form, Select, Input , Modal} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

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
class Addgroup extends  Component {

    handleOk = (  ) => {
         let { form } = this.props;
          form.validateFields((err, values) => {
          if (!err) {
              let { desc, app_id, sort } =  values;
                    app_id ? '' : delete values.app_id ;
                    desc ? '' : delete values.desc ;
                    sort ? '' : delete values.sort ;
              this.props.okAction( values, form ); // 传入表单实例
          }
        });
    }
    handleCancel = () => {
        let { form } = this.props;
         this.props.cancelAction( form );// 传入表单实例
    }
    render(){
        let { title, visible, store, confirmLoading } = this.props;
        let groupInitialValue = mobx.toJS( store.groupStore.get_groupInitialValue );
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

                  <FormItem {...formItemLayout} label="菜单组名称">
                    {getFieldDecorator('title', {
                        initialValue : groupInitialValue.title,
                        rules: [{
                            required: true,
                            message: '菜单组名称不能为空',
                        }],
                    })(
                        <Input placeholder="请输入菜单组名称" />
                    )}
                    </FormItem>


                    <FormItem {...formItemLayout} label="备注">
                    {getFieldDecorator('desc', {
                         initialValue : groupInitialValue.desc,
                       // rules: [{  required: true, message: '显示名不能为空', }],
                    })(
                        <TextArea placeholder="请求输入角色描述" rows="3" cols="20" style={{ resize : ' none' }} />
                    )}
                    </FormItem>


                    <FormItem {...formItemLayout} label="所属平台">
                    {getFieldDecorator('app_id', {
                        initialValue :  groupInitialValue.app_id ? groupInitialValue.app_id.toString()
                                        : groupInitialValue.app_id,
                       // rules: [{  required: true, message: '请选择所属平台',}],
                    })(
                        <Select placeholder="请选择所属平台" >
                            <Option value="1">趋势网</Option>
                         </Select>
                    )}
                    </FormItem>


                 <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator('sort', {
                         initialValue : groupInitialValue.sort,
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

                

        
             </Form>   
          
          </Modal>   
         )
    }
}


Addgroup.defaultProps = {
     title : '新增节点',
     visible : false,
     confirmLoading : false,
     okAction : function(){},
     cancelAction : function(){}
}


const AddGroup = Form.create()(Addgroup);
export default AddGroup;