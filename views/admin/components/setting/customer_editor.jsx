import React from 'react';
import { Layout, Input, Button, Table, Select, Modal,
         Form, Row, Col, Card, Checkbox, Radio, DatePicker } from 'antd';
import moment from 'moment';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed } from 'mobx';

import MemberTableComponent from './customer_table';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;



/// sdgsdfgsdfgsdfgsdfgsdf

@observer
 class Customereditor extends React.Component {
      constructor(props){ super(props) }

      state = {
         visible_Invited : false,
         confirmLoading_Invited : false,
         visible_apply : false,
         confirmLoading_apply : false
      }

      invitedHandler = () => {
           this.setState({visible_Invited : true})
      }
      apllyHandler = () => {
           this.setState({visible_apply : true})
      }

      handleOk_Invited = () => {
         this.setState({visible_Invited : false})
      }
      handleCancel_Invited  = () => {
        this.setState({visible_Invited : false})
      }

      handleOk_apply = () => {
            this.setState({visible_apply : false})
      }
      handleCancel_apply = () => {
            this.setState({visible_apply : false})
      }



      handleSubmit = (e) => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                   console.log('Received values of form: ', values);
                });
      }
    

      handleReset = () => {

        this.props.form.resetFields();
        this.props.history.replace('/setting-right/customer');
        console.log(this.props.history);

    
      }


      render(){

        let { visible_apply, visible_Invited, 
            confirmLoading_apply, confirmLoading_Invited 
        } = this.state;

        const dateFormat = 'YYYY/MM/DD';

        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 4 }  
            },
          };

       const formItemLayout_c = {
                    labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                    },
                    wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 10 }  
                    },
                };
        
        const { getFieldDecorator } = this.props.form;
        
           return (
            <Layout.Content className="common-content" style={{'overflow' : 'scroll'}}>
                <Form onSubmit={this.handleSubmit}>

                <FormItem {...formItemLayout} label="账号">
                    {getFieldDecorator('account', {
                        rules: [{
                            required: true, message: 'Please input your E-mail!',
                          }],
                    })(
                        <Input />
                    )}
                    </FormItem>

                  <FormItem {...formItemLayout} label="密码" >
                    {getFieldDecorator('password', {
                        rules: [{
                               required: true, message: 'Please input your E-mail!',
                          }],
                    })(
                        <Input />
                    )}
                    </FormItem>

                      <FormItem    labelCol = { {
                                    xs: { span: 24 },
                                    sm: { span: 2 },
                                    }}
                            wrapperCol = {{
                                    xs: { span: 24 },
                                    sm: { span: 7 }  
                               }}
                             label="账号状态" >
                        {getFieldDecorator('state', {
                            rules: [{
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                             <RadioGroup>
                                <Radio value="a">启动</Radio>
                                <Radio value="b">禁用</Radio>
                                </RadioGroup>
                        )}
                      </FormItem>

                    <Row>
                         <Col span={24}> <h3>客户信息</h3></Col>
                         <Col span={24}> <hr /></Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={10}>
                            <Card title="企业信息" bordered={false}>
                              <FormItem {...formItemLayout_c} label="公司名称" >
                                    {getFieldDecorator('company_name', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>

                                     <FormItem {...formItemLayout_c} label="行业" >
                                        {getFieldDecorator('industry', {
                                            rules: [{
                                                required: true, message: 'Please input your E-mail!',
                                            }],
                                        })(
                                         <Select >
                                                <Option value="rmb">RMB</Option>
                                                <Option value="dollar">Dollar</Option>
                                            </Select>
                                       )}
                                    </FormItem>

                                      <FormItem {...formItemLayout_c} label="主营" >
                                        {getFieldDecorator('business', {
                                            rules: [{
                                                required: true, message: 'Please input your E-mail!',
                                            }],
                                        })(
                                         <Select >
                                                <Option value="rmb">RMB</Option>
                                                <Option value="dollar">Dollar</Option>
                                            </Select>
                                       )}
                                    </FormItem>

                                      <FormItem {...formItemLayout_c} label="贸易类型" >
                                        {getFieldDecorator('business_type', {
                                            rules: [{
                                                required: true, message: 'Please input your E-mail!',
                                            }],
                                        })(
                                         <Select   >
                                                <Option value="rmb">RMB</Option>
                                                <Option value="dollar">Dollar</Option>
                                            </Select>
                                       )}
                                    </FormItem>

                                      <FormItem {...formItemLayout_c} label="公司地址" >
                                        {getFieldDecorator('address', {
                                            rules: [{
                                                required: true, message: 'Please input your E-mail!',
                                            }],
                                        })(
                                         <Select >
                                                <Option value="rmb">RMB</Option>
                                                <Option value="dollar">Dollar</Option>
                                            </Select>
                                       )}
                                    </FormItem>


                                 <FormItem {...formItemLayout_c} label="详细地址" >
                                    {getFieldDecorator('address_detail', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                             </Card>
                        </Col>

                        <Col span={10}>
                            <Card title="联系人信息" bordered={false}>
                                    
                                 <FormItem {...formItemLayout_c} label="姓名" >
                                    {getFieldDecorator('user_name', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                                    
                                 <FormItem {...formItemLayout_c} label="职位" >
                                    {getFieldDecorator('user_post', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                                    
                                 <FormItem {...formItemLayout_c} label="手机号" >
                                    {getFieldDecorator('user_tel', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                                    
                                 <FormItem {...formItemLayout_c} label="邮箱" >
                                    {getFieldDecorator('user_email', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                                    
                                 <FormItem {...formItemLayout_c} label="固定电话" >
                                    {getFieldDecorator('user_number', {
                                        rules: [{
                                            required: true, message: 'Please input your E-mail!',
                                        }],
                                    })(
                                        <Input />
                                       )}
                                    </FormItem>
                             </Card>
                           </Col>
                        </Row>

                        <Row>
                         <Col span={24}> <h3>会员权限</h3></Col>
                         <Col span={24}> <hr /></Col>
                       </Row>

                     <Table 
                           bordered={true}
                            columns={[
                                {
                                    title: '前台',
                                    dataIndex: 'platform',
                                    width: '20%',
                                    render: (text, record,index) => (
                                            <Checkbox value='1'>趋势网</Checkbox>   
                                       
                                    )
                                },
                                {
                                    title: '角色权限',
                                    dataIndex: 'right',
                                    width: '35%',
                                    render: (text, record,index) => (
                                        <Checkbox.Group style={{ width: '100%' }}>
                                          <Row>
                                                <Col span={8}><Checkbox value='1'>男装主管</Checkbox></Col>
                                                <Col span={8}><Checkbox value='2'>男装主管</Checkbox></Col>
                                                <Col span={8}><Checkbox value='3'>男装主管</Checkbox></Col>
                                                <Col span={8}><Checkbox value='4'>男装主管</Checkbox></Col>
                                                <Col span={8}><Checkbox value='5'>男装主管</Checkbox></Col>
                                            </Row>
                                        </Checkbox.Group>
                                    )
                                },
                                {
                                    title: '会员期限',
                                    dataIndex: 'members',
                                    width: '45%',
                                    render: (text, record,index) => (
                                           <RangePicker defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]} format={dateFormat} />
                                    )
                                }

                               
                            ]} 
                            dataSource={[
                                 {
                                    id : '1',
                                    qiantai : 'platform',
                                    right : '10'
                                 }
                            ]} 
                         rowKey={'id'}
                      />


                  <Row>
                    <Col span={24}>
                     <Row >
                      <Col span={4}><h3 style={{'display':'inline-block'}}>客户信息</h3><i>*最多可添加5个成员</i> </Col>
                       <Col span={10}>
                         <Button type="primary" style={{'marginRight': '20px'} } onClick={this.invitedHandler} >+邀请</Button> 
                         <Button type="primary"  onClick={this.apllyHandler} >申请增加成员数量</Button>
                        </Col>
                       </Row>
                     </Col>
                     <Col span={24}> <hr /></Col>
                     </Row>
                     
                      <Row>
                          <Col span={24}>
                             <MemberTableComponent {...this.props} {...this.state} />
                           </Col>
                      </Row>            

                        
                        <FormItem >
                          <hr /> 
                          <Button type="primary" size="large"  style={{'marginRight': '10px'}} htmlType="submit" >保存</Button>
                          <Button type="button" size="large"  onClick={this.handleReset} >取消</Button>
                        </FormItem>

                 </Form>

                      <Modal title="邀请企业成员"
                             visible={visible_Invited}
                             onOk={this.handleOk_Invited}
                             confirmLoading={confirmLoading_Invited}
                             onCancel={this.handleCancel_Invited}
                             width="500px"
                            >
                            <div style={{width: '100%'}}>
                                <Row>
                                    <Col span={4}> <h3 style={{'textAlign':'right'}}>方法1：</h3> </Col>
                                    <Col span={20}> 
                                      <p>将需要邀请的企业成员的手机号添加到输入框（可批量添加，每行输入一个手机号），添加后的手机号直接登录即可激活</p>
                                       <Input.TextArea rows={4} style={{resize:'none'}} />
                                     </Col>
                                </Row>
                                <Row style={{'marginTop': '10px'}}>
                                 <Col span={4}><h3 style={{'textAlign':'right'}}>方法2：</h3> </Col>
                                 <Col span={20}> 
                                     <p>企业成员可在微信关注【热点趋势】公众号，并使用微信扫描以下二维码，扫描成功后登录，即可绑定企业账号</p>
                                     <figure className="invited_code">
                                     <img src="shanghai_lupu_bridge.jpg" width="150" height="150" />
                                     <figcaption>企业专属二维码</figcaption>
                                     <figcaption>可复制该二维码发给企业成员扫描绑定</figcaption>
                                    </figure>
                                   </Col>
                                </Row>
                              </div>
                            </Modal>

                         <Modal title="申请增加成员数量"
                             visible={visible_apply}
                             onOk={this.handleOk_apply}
                             confirmLoading={confirmLoading_apply}
                             onCancel={this.handleCancel_apply}
                             width="400px"
                            >
                            <div style={{width: '100%'}}>
                            <Form layout={'inline'}>
                            <FormItem label="申请数量">
                              <Select defaultValue="lucy" style={{ width: 200 }}>  
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled">Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                    </Select>
                             </FormItem>
                            </Form>
                            </div>
                        </Modal>


                            

             </Layout.Content>
           )
      }
}



const  CustomerEditor = Form.create()(Customereditor);
export default  CustomerEditor;