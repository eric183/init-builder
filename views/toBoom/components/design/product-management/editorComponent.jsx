import React,{ Fragment, Component } from 'react';
import { Icon, Modal, Row, Col, Form, Radio, TreeSelect,Input, Select, message } from 'antd';
import { DatePicker } from 'antd';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT; 
const Option = Select.Option;





function DisableHandler(){
      let disabledStates = {
          'profile_disabled' : false, 
          'part_disabled': false, 
          'style_disabled': false, 
          'clen_disabled': false, 
          'details_disabled': false, 
          'season_disabled' : false
      };
 
       
  
}






@observer
class Editorcomponent extends Component {
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
          this.setState({  positiveSide : true });
          this.props.form.resetFields();
          this.props.store.productManagementInfo.setProperties('ImageForEdit', {
          attr : { 
            category : [],
            clen : [],
            details : [],
            part : [],
            picture_use : [],
            profile : [],
            season : [],
            style : [],
            profile : []
            } 
          })
    }


    switchImage = () => {  
           this.setState({ positiveSide : !this.state.positiveSide }) 
       }


      render(){

        const formItemLayout = {  labelCol: { span: 5 },  wrapperCol: { span:19 }  };
        const itemWidth = { width : 230 };
        const { getFieldDecorator } = this.props.form;
        let { visiable } = this.props;

        let tagsArray = mobx.toJS( this.props.store.productManagementInfo.get_tagsArray );
        let categoryOptions = mobx.toJS( this.props.store.productManagementInfo.get_categoryOptions ); 

        let ImageForEdit = mobx.toJS(  this.props.store.productManagementInfo.ImageForEdit );

        let front = ImageForEdit.src ? ImageForEdit.src[1].value : '',  // /assets/toBoom/images/clother.png
             reverse =  ( ImageForEdit.back_image && ImageForEdit.back_image.length ) ? ImageForEdit.back_image[0].url : '' //  '/assets/toBoom/images/clother.png'; 


          getFieldDecorator('singleItem.id',{ initialValue : ImageForEdit.id });  // 设置id

          return (
            <Modal
                title="编辑成品"
                className="edit-modal-style"
                maskClosable={ false }
                width={850}
                visible={ visiable }
                onCancel={ this.cancelHandler }
                footer={null} 
                bodyStyle={{ maxHeight : 750, overflowY : 'scroll' }}
                 >
                <Row>

                  <Col span={ 12 } className="modal-image-block">
                        <figure>
                             <span> 
                                <img ref="edit-image" src={ this.state.positiveSide ? front : reverse }  alt=""/>
                             </span>
                             <button type="button" onClick={ this.switchImage }> {  this.state.positiveSide ? '显示反面' : '显示正面'  } </button>
                        </figure>
                     </Col>
                     

                    <Col span={ 12 } className="modal-image-info">
                        <Form>
                          <FormItem { ...formItemLayout } label="图片名称" >
                              {getFieldDecorator('singleItem.title', { initialValue : ImageForEdit.title, rules : [{ required: true, message: '请输入图片名称' }]   })(
                                <Input  placeholder="图片名称" style={{ width : 225 }}   />
                              )}
                            </FormItem>


                            <FormItem label="发布状态" {...formItemLayout}>
                              {
                                getFieldDecorator('singleItem.release',{ initialValue : ImageForEdit.is_release })(
                                    <RadioGroup onChange={ this.seletedPurpose }>
                                      <Radio value={ 0 }  > 未发布 </Radio>
                                      <Radio value={ 1 }  > 已发布 </Radio>
                                  </RadioGroup>   
                                )   
                              }
                             </FormItem>

        
                            <FormItem  {...formItemLayout} label="廓形" >
                                {getFieldDecorator('singleItem.profile', { initialValue : ImageForEdit.attr.profile })(
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
                         {getFieldDecorator('singleItem.part', {  initialValue : ImageForEdit.attr.part })(
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
             
                         <FormItem   {...formItemLayout} label="品类" >
                                {getFieldDecorator('singleItem.category' ,{ initialValue : ImageForEdit.attr.category, rules : [{ required: true, message: '请输入品类' }] } )(
                                 <TreeSelect  style={itemWidth}
                                                     maxTagCount={ 5 }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={ SHOW_PARENT } 
                                                    multiple
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={ categoryOptions } 
                                            />
                                )}
                           </FormItem>



                      <FormItem  {...formItemLayout} label="风格" > 
                              {getFieldDecorator('singleItem.style', { initialValue : ImageForEdit.attr.style })(
                                <Select style={ itemWidth } placeholder="风格" allowClear  mode="multiple"  >
                                     {
                                       tagsArray.style.children.map((item,index) => ( <Option key={index} value={ item.value } > { item.title } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                        <FormItem  {...formItemLayout} label="衣长" > 
                              {getFieldDecorator('singleItem.clen', { initialValue : ImageForEdit.attr.clen })(
                                <Select style={itemWidth} placeholder="衣长" allowClear  mode="multiple"   >
                                     {
                                       tagsArray.clen.children.map((item,index) => ( <Option key={index} value={ item.value } > {  item.title  } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>

                           <FormItem {...formItemLayout} label="细节"  >
                               {getFieldDecorator('singleItem.details', { initialValue : ImageForEdit.attr.details })(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"   >
                                      {  
                                        tagsArray.details.children.map((item,index) => (<Option key={index} value={item.value } > {  item.title  }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>

                            <FormItem  {...formItemLayout} label="季度"  > 
                              {getFieldDecorator('singleItem.season', {  initialValue :  ImageForEdit.attr.season })(
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





Editorcomponent.defaultProps = {
         conformBinder : function(){},
         cancelBinder : function(){},
         source : [],
         visiable : false
};



export const EditorComponent = Form.create()(Editorcomponent);








class Bulkediting extends Component {

  confirmHandler = () => {
      this.props.form.validateFields((err, values) => {

        if (!err) {

            let bulkItem =  values.bulkItem,
                keysArray  = Object.keys( bulkItem ),
                { checkedList } = this.props.parent.state,
                param = { ids : checkedList, attrs : {}, is_release : undefined };

         //  let b = keysArray.some((item,index,arr) => { return bulkItem[item] != undefined });

             for( let key in bulkItem){
                  if( key == 'release' ){
                    bulkItem[ key ] != undefined ?  param.is_release = bulkItem[key] : '';
                  }else{
                    bulkItem[ key ] != undefined ?  param.attrs[key] = bulkItem[ key ] : '';
                  }
                  
             }

             this.props.conformBinder( param , this.cancelHandler )

        }
      })
  }

  cancelHandler = () => { 
      this.props.cancelBinder();
      this.props.form.resetFields()
     }


    render(){

      let tagsArray = mobx.toJS( this.props.store.productManagementInfo.get_tagsArray );
      
      let categoryOptions = mobx.toJS( this.props.store.productManagementInfo.get_categoryOptions ); 
      
      const formItemLayout = {  labelCol: { span: 8 },  wrapperCol: { span:16 }  };
      const itemWidth = { width : 230 };
      const { getFieldDecorator } = this.props.form;
      let { visiable } = this.props;

       



       return (
        <Modal
            title="批量编辑"
            className="edit-modal-style"
            maskClosable={ false }
            width={600}
            visible={ visiable }
            onCancel={ this.cancelHandler }
            footer={null} 
         >
                <Row>
                    <Col span={ 24 } className="modal-image-info">
                        <Form>

                            <FormItem label="发布状态" {...formItemLayout}>
                              {
                                getFieldDecorator('bulkItem.release',{ rules : [{ required: true, message: '请选择发布状态' }] })(
                                    <RadioGroup onChange={ this.seletedPurpose }>
                                      <Radio value={ 0 }  > 未发布 </Radio>
                                      <Radio value={ 1 }  > 已发布 </Radio>
                                  </RadioGroup>   
                                )   
                              }
                             </FormItem>

                               {/*  rules : [{ required: true, message: '请输入品类' }]   */}

                              <FormItem   {...formItemLayout} label="品类" >
                                {getFieldDecorator('bulkItem.category')(  
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ 5 }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={ SHOW_PARENT } 
                                                    treeCheckable={ true } 
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={ categoryOptions } 
                                            />
                                )}
                           </FormItem>

                            <FormItem  {...formItemLayout} label="廓形" >
                                  {getFieldDecorator('bulkItem.profile')(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ 5 }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={ SHOW_PARENT } 
                                                    treeCheckable={ true } 
                                                    allowClear  
                                                    placeholder="廓形"
                                                    treeData={ tagsArray.profile.children } 
                                                 
                                            />
      
                                )}
                           </FormItem>


                      <FormItem {...formItemLayout} label="部件" >
                         {getFieldDecorator('bulkItem.part')(
                                  <TreeSelect style={itemWidth}
                                              maxTagCount={ 5 }
                                              dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                              showCheckedStrategy={ SHOW_PARENT } 
                                              treeCheckable={ true } 
                                              allowClear  
                                              placeholder="部件"
                                              treeData={ tagsArray.part.children } 
                                             
                                    />

                        )}
                           </FormItem>

                      
                      <FormItem  {...formItemLayout} label="风格" > 
                              {getFieldDecorator('bulkItem.style')(
                                <Select style={ itemWidth } placeholder="风格" allowClear  mode="multiple"  >
                                     {
                                       tagsArray.style.children.map((item,index) => ( <Option key={index} value={ item.value } > { item.title } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                        <FormItem  {...formItemLayout} label="衣长" > 
                              {getFieldDecorator('bulkItem.clen')(
                                <Select style={itemWidth} placeholder="衣长" allowClear mode="multiple" >
                                     {
                                       tagsArray.clen.children.map((item,index) => ( <Option key={index} value={ item.value } > {  item.title  } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>

                           <FormItem {...formItemLayout} label="细节"  >
                               {getFieldDecorator('bulkItem.details')(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"   >
                                      {  
                                        tagsArray.details.children.map((item,index) => (<Option key={index} value={item.value } > {  item.title  }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>

                            <FormItem  {...formItemLayout} label="季度"  > 
                              {getFieldDecorator('bulkItem.season')(
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


export const BulkEditing = Form.create()(Bulkediting);

