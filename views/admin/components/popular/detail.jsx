import React, { Component } from 'react';
import { Row, Col, Icon, Button, Divider, Modal, Radio ,Form, Checkbox, DatePicker, Tabs, Select } from 'antd';
import ItemComponent from './item';
import {observer} from 'mobx-react';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const arr = [1,2,3,4,5,6,7,8,9,10];

@observer
export default class DetailComponent  extends  Component {
     constructor(props){
          super(props);
          this.state = {
            visible_radio : false,
            visible_selector : false
          };
     }

     backAction = () => {
         this.props.history.push('/setting/popular_manager')
     }

     handleOk_radio = () => {
        this.setState({ visible_radio : false })
     }

     handleCancel_radio = () => {
        this.setState({ visible_radio : false })
     }

     openRadioList = () => {  this.setState({ visible_radio : true }) }

     handleRadiosChange = () => {
            
     }

   openSelector = () => {
        this.setState({
            visible_selector : true
        })
     }
   handleOk_selector = () => {
    this.setState({
        visible_selector : false
    })
     }
    handleCancel_selector = () => {
        this.setState({
            visible_selector : false
        })
     }


     render(){
         return (
            <div className="popular-detail">
                <Row>
                   <Col span={1} offset={23} style={{ textAlign : 'right' }}> <Icon type="close" className="back-btn" onClick={ this.backAction } /></Col>
                </Row>
                {/* <Row style={{ margin : '0 0 25px 0' }}>
                    <Col span={5}>内容</Col>
                    <Col span={6}>占比</Col>
                    <Col span={5}>展示图</Col>
                </Row> */}
                <Divider />
                 <Row>
                  <Col span={24}>  
                      {
                          arr.map((item, index) => (  <ItemComponent key={index} index={index} openselector={ this.openSelector } openRadioList={this.openRadioList} /> ))
                      }
                  </Col>
                 </Row>

                   <Row>
                  <Col span={24}>  
                    <Button type="primary" style={{ width : '100px', margin : '0 10px' }}>发布</Button>
                     {/* <Button style={{ width : '100px', margin : '0 10px'  }}>预览</Button> */}
                     <Button style={{ width : '100px'}} type="danger" onClick={ this.backAction } >返回</Button>
                   </Col>
                  </Row>


                 <Modal
                     width={700}
                      title="筛选列表"
                      visible={this.state.visible_radio} 
                      onOk={this.handleOk_radio} 
                      onCancel={this.handleCancel_radio}
                   >
                   <div className="popular-radios">
                        <Row>
                          <Col span={24}>A</Col>
                          <Col span={24}>
                           <RadioGroup onChange= { this.handleRadiosChange } >   {/*  value={ this.state.value } */}
                                    <Radio value={1}>A</Radio>
                                    <Radio value={2}>B</Radio>
                                    <Radio value={3}>C</Radio>
                                    <Radio value={4}>D</Radio>
                                </RadioGroup>
                           </Col>
                         </Row> 
                    </div>
                 </Modal>


               <Modal
                       width={1200}
                       title="筛选列表"
                       visible={this.state.visible_selector} 
                       onOk={this.handleOk_selector} 
                       onCancel={this.handleCancel_selector}
                     >
                   
                 <div className="select_modal">
                     <Row style={{ marginBottom : '20px'}}>
                        <Col span={24}>
                        <Form  layout="inline">
                        <FormItem>
                         <Select placeholder="选择风格" allowClear style={{ width : 100 }}>
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            </Select>
                          </FormItem>
                          <FormItem>
                           <Select placeholder="选择款式" allowClear style={{ width : 100 }}>
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            </Select>
                          </FormItem>
                          <FormItem>
                          <RangePicker onChange={() => {}} />
                          </FormItem>
                        </Form>
                        </Col>
                      </Row>

                     <Row>
                        <Col span={24}>
                            <Tabs onChange={() => {}} type="card" >
                                <TabPane tab="我的上传" key="1">

                                  <RadioGroup style={{ width: '100%' }} onChange={ this.selected_video } >
                                    <ol className="select_img_list">
                                            <li>
                                            <Radio value="A">
                                                <img src="https://b-ssl.duitang.com/uploads/item/201508/20/20150820200416_z2h58.thumb.700_0.jpeg" />
                                                <h6>图片名称图片名称图片名称图片名称</h6>
                                                </Radio> 
                                            </li>
                                        </ol>
                                     </RadioGroup>


                                 </TabPane>
                                 <TabPane tab="视频搜索" key="2">

                                   <RadioGroup style={{ width: '100%' }} onChange={ this.selected_video } >
                                    <ol className="select_img_list">
                                            <li>
                                            <Radio value="A">
                                                <img src="https://b-ssl.duitang.com/uploads/item/201508/20/20150820200416_z2h58.thumb.700_0.jpeg" />
                                                <h6>ggggggggg</h6>
                                                </Radio> 
                                            </li>
                                        </ol>
                                     </RadioGroup>

                                 </TabPane>
                            </Tabs>
                         </Col>
                      </Row>
                    </div>
                   </Modal>   

             </div>
         )
     }

}