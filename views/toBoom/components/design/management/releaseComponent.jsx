import React,{ Fragment, Component } from 'react';
import { Icon, Modal, Row, Col, Form, Radio, TreeSelect,Input, Select, message } from 'antd';
import { DatePicker } from 'antd';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_ALL;
const Option = Select.Option;



@observer
class Releasecomponent extends Component {
     state = {
         positiveSide : true,
      }


    confirmHandler = () => {
        this.props.form.validateFields((err, values) => {
          if (!err) {
               this.props.conformBinder( values , this.cancelHandler )
          }
        })
     }


    cancelHandler = () => {
          this.props.cancelBinder();
          this.props.form.resetFields();
          this.props.store.allWorksInfo.setAttrsObject( {} );
    }

    check_attrsObject( ){

       var attrsObject = mobx.toJS( this.props.store.allWorksInfo.attrsObject ),
          { back_image = [], attrs } = attrsObject;


       if( attrsObject.attrs ){
         return {
                title : attrsObject.title,
                release : attrsObject.is_release,
                category : attrs.category || [] ,
                profile :attrs.profile || [] ,
                part : attrs.part || [] ,
                style : attrs.style || [] ,
                clen : attrs.clen || [] ,
                details : attrs.details || [],
                season : attrs.season || [],
                front :  attrsObject.preview_url,    // 正反面图片  '/assets/toBoom/images/clother.png'
                reverse : back_image.length ? back_image[0].url : ''    // 正反面图片

          }

       }else{

         return { 
                  title :'',
                  release : '',
                  category : [] ,
                  profile : [],
                  part : [],
                  style : [],
                  clen : [],
                  details : [],
                  season : [],
                  front :  attrsObject.preview_url,    // 正反面图片
                  reverse : back_image.length ? back_image[0].url : ''    // 正反面图片
          }

       }

    
    }


   switchImage = () => {  
      this.setState({ positiveSide : !this.state.positiveSide }) 
  }



      render(){

       let tagsArray =  mobx.toJS( this.props.store.allWorksInfo.get_tagsArray );
       
       let categoryOptions =  mobx.toJS( this.props.store.allWorksInfo.get_categoryOptions );

        const formItemLayout = {  labelCol: { span: 7 },  wrapperCol: { span:17 }  };

        const itemWidth = { width : 230 };
        const { getFieldDecorator } = this.props.form;

        let { visiable, releaseContrl } = this.props;

        let attrsObject =  this.check_attrsObject();

        // let ImageForEdit = mobx.toJS(  this.props.store.productManagementInfo.ImageForEdit );
        //  getFieldDecorator('singleItem.id',{ initialValue : ImageForEdit.id });  // 设置id

          return (
            <Modal
                title="成品发布"
                className="edit-modal-style"
                maskClosable={ false }
                width={850}
                visible={ visiable }
                onCancel={ this.cancelHandler }
                footer={null} 
            >
                <Row>

                   <Col span={ 12 } className="modal-image-block">
                        <figure>
                             <span> 
                                <img ref="edit-image" src={ this.state.positiveSide ? attrsObject.front : attrsObject.reverse }  alt=""/>
                             </span>
                             <button type="button" onClick={ this.switchImage }> {  this.state.positiveSide ? '显示反面' : '显示正面'  } </button>
                        </figure>
                     </Col>


                    <Col span={ 12 } className="modal-image-info">
                        <Form>

                          <FormItem { ...formItemLayout } label="成品名称" >
                              {getFieldDecorator('singleItem.title',{ initialValue : attrsObject.title  ,  rules : [{ required: true, message: '请输入作品名称' }] })(
                                <Input  placeholder="显示原作品名称" style={{ width : 225 }}   />
                              )}
                            </FormItem>
                             {
                                 releaseContrl ? (
                                    <FormItem label="发布状态" {...formItemLayout}>
                                    {
                                      getFieldDecorator('singleItem.release',{ initialValue : attrsObject.release , rules : [{ required: true, message: '请选择状态' }] })(
                                          <RadioGroup onChange={ this.seletedPurpose }>
                                            <Radio value={ 0 }  > 未发布 </Radio>
                                            <Radio value={ 1 }  > 已发布 </Radio>
                                        </RadioGroup>   
                                      )   
                                    }
                                  </FormItem>
                                 ) : null
                             }
                              
                          <FormItem   {...formItemLayout} label="品类" >
                                {getFieldDecorator('singleItem.category',{ initialValue : attrsObject.category , rules : [{ required: true, message: '请输入品类' }] })(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ 5 }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={ SHOW_PARENT } 
                                                    multiple
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={  categoryOptions } 
                                            />
                                )}
                          </FormItem>

        
                          <FormItem  {...formItemLayout} label="廓形" >
                              {getFieldDecorator('singleItem.profile', {  initialValue : attrsObject.profile })(
                                <TreeSelect  style={itemWidth}
                                                  maxTagCount={ 5 }
                                                  dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                  showCheckedStrategy={ SHOW_PARENT } 
                                                  multiple
                                                  allowClear  
                                                  placeholder="廓形"
                                                  treeData={ tagsArray.profile.children } 
                                                
                                          />
    
                              )}
                          </FormItem>



                          <FormItem {...formItemLayout} label="部件" >
                            {getFieldDecorator('singleItem.part', {  initialValue : attrsObject.part })(
                                      <TreeSelect style={itemWidth}
                                                  maxTagCount={ 5 }
                                                  dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                  showCheckedStrategy={ SHOW_PARENT } 
                                                  multiple
                                                  allowClear  
                                                  placeholder="部件"
                                                  treeData={ tagsArray.part.children } 
                                                
                                        />

                            )}
                          </FormItem>

                    

                          <FormItem  {...formItemLayout} label="风格" > 
                                  {getFieldDecorator('singleItem.style', {  initialValue : attrsObject.style })(
                                    <Select style={ itemWidth } placeholder="风格" allowClear  mode="multiple"  >
                                        {
                                          tagsArray.style.children.map((item,index) => ( <Option key={index} value={ item.value } > { item.title } </Option> ))
                                          }
                                        </Select>
                                  )}   
                          </FormItem>


                          <FormItem  {...formItemLayout} label="衣长" > 
                                {getFieldDecorator('singleItem.clen', {  initialValue : attrsObject.clen })(
                                  <Select style={itemWidth} placeholder="衣长" allowClear  mode="multiple"   >
                                      {
                                        tagsArray.clen.children.map((item,index) => ( <Option key={index} value={ item.value } > {  item.title  } </Option> ))
                                      }
                                      </Select>
                                )}   
                          </FormItem>

                          <FormItem {...formItemLayout} label="细节"  >
                               {getFieldDecorator('singleItem.details', {  initialValue : attrsObject.details })(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"   >
                                      {  
                                        tagsArray.details.children.map((item,index) => (<Option key={index} value={item.value } > {  item.title  }</Option>))
                                      }
                              </Select>
                              )}
                          </FormItem>

                          <FormItem  {...formItemLayout} label="季度"  > 
                            {getFieldDecorator('singleItem.season', {  initialValue : attrsObject.season })(
                              <Select style={itemWidth} placeholder="季度"  allowClear  mode="multiple"  >
                                      {
                                        tagsArray.season.children.map((item,index) => (  <Option key={index} value={ item.value } > { item.title } </Option> ))
                                      }
                                  </Select>
                              )}   
                          </FormItem>

                        </Form>
                    </Col>


                  <Col span={ 24 } className="modal-btns">
                      <button type="button" onClick={ this.confirmHandler } > 确定 </button>
                      <button type="button" onClick={ this.cancelHandler }> 取消 </button>
                  </Col>

                </Row>
            </Modal>
             )
      }
}





Releasecomponent.defaultProps = {
         conformBinder : function(){},
         cancelBinder : function(){},
         source : [],
         visiable : false,
         releaseContrl: false     // 只有在成品管理中才有 “ 发布状态 ” 项目
};



export const ReleaseComponent = Form.create()(Releasecomponent);
