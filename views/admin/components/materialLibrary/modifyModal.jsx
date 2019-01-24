import * as React from 'react';
import { Component }  from 'react';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import '../../../../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import PerfectScrollbar from 'perfect-scrollbar';
import { Row, Col, Button, Form,  Select,  Modal, Radio,Cascader, message, TreeSelect } from 'antd';

import qs from 'qs';
import MaterialStore from '../../store/material/materialStore';
import UploadForm from './uploadForm';
const _MaterialStore = new MaterialStore();



const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT;
const MAXTAGCOUNT = 3;

let {  defaultConfig,  config,  defualtTags } = mobx.toJS(_MaterialStore.matarialConfig);


function checkAttrs(target) {
  let b = false;
  if (target instanceof Array) {
      b = true;
  } else {
      b = !Boolean(target);
  }
  return b
}

function linkedAction( value , clearFields){
          let  _defaultConfig = {
                category_visiable : false,
                profile_visiable : false,
                part_visiable : false,
                vertype_visiable : false,
                style_visiable : false,
                clen_visiable : false,
                details_visiable : false,
                season_visiable : false, 
                angle_visiable : false 
              };
          let  visiableObjects = Object.assign({}, _defaultConfig, true);  
          defualtTags.forEach(item => {
                 if(value == item.name ) config[ item.key ].forEach((item,index) => { visiableObjects[item] = true });
          });

           clearFields(); 
          this.setState({ ...visiableObjects });

} 





function filterAttrs(attrs){
       var keysArry = [];
       var attrObject = {};
        if( attrs.vectorgraph != 'nothing') attrObject.vectorgraph = attrs.vectorgraph;
       let getkeys = function(key){  let keys = config[key].map( item => item.split('_')[0] );  return keys; };
        defualtTags.forEach(item => {
            if(attrs.vectorgraph == item.name ){
                   keysArry = getkeys( item.key );  
            }
       });

      keysArry.forEach( keyName => {  attrs[keyName] ? attrObject[keyName] = attrs[keyName] : '' });

     // if(attrObject.part && typeof attrObject.part == 'string')  attrObject.part = [ attrObject.part ];  // 部件单选的，值也要是数组。 弃！

       return attrObject;
}




@observer
 class Similarmodifier extends Component {
     state = {
         cascaderIndex : 0,
         loading : false,
         category_visiable : false,
         profile_visiable : false,
         part_visiable : false,
         vertype_visiable : false,
         style_visiable : false,
         clen_visiable : false,
         details_visiable : false,
         season_visiable : false, 
         angle_visiable : false
     }


    clearFieldsAction = () =>{
              this.props.form.setFieldsValue({  
                  c_attrs : {
                      category : undefined,
                      profile : undefined,
                      part : undefined,
                      vertype : undefined,
                      style : undefined,
                      clen : undefined,
                      details : undefined,
                      season : undefined,
                      angle : undefined
            }})
    }


     linkedAction_agent = (value) =>{
           linkedAction.call(this,value, () => { }); // 显示对应的字段  
     }


     closeAction = () => {
        this.props.onClose();

        this.props.form.resetFields();

        this.props.store.MaterialStore.setProperties( { 'seletedRows' : [], 'oldImage' : { attrs: [] }} );

        this.props.store.MaterialStore.setProperties('modalVisible2',false)

       // this.linkedAction_agent('nothing'); // 显示对应的字段

     }


    seletedPurpose = (e) => {
         let value = e.target.value || 'nothing';
         let oldImage  = mobx.toJS(this.props.store.MaterialStore.get_OldImage);
         oldImage.attrs.vectorgraph = value
         this.props.store.MaterialStore.setProperties('oldImage', oldImage);   // 显示对应的字段
      //   this.linkedAction_agent(value); // 显示对应的字段

  }


   submitAction = () => {

        this.props.form.validateFields((err, values) => {

          let  { pathname, search } = this.props.location,
                p = qs.parse(search.slice(1));
                p.cParams ? '' : p.cParams = { page: "1", limit: "10" };

              let params = { attrs : values.c_attrs , resource_id : values.c_attrs.resource_id };

              let _attrs = filterAttrs( params.attrs );  //  根据 vectorgraph 的值返回对应的数据

                 for(let key in _attrs){
                        if(_attrs[key] instanceof Array){
                             _attrs[key].length ? '' : delete  _attrs[key];

                        }else{
                             _attrs[key] ?   _attrs[key] = [  _attrs[key] ]  : delete  _attrs[key];

                        }

                       if(key == 'resource_id')  delete  _attrs[key];

                  }

                  let _value = _attrs.vectorgraph;

                  if( _value == '封面图' || _value == '模特图' ){
                          if( _value == '封面图')  _attrs.picture_use = _value;
                          if( _value == '模特图' ) _attrs.ptype = _value;
                          delete _attrs.vectorgraph;
                    }

                params.attrs = _attrs;
                this.props.store.MaterialStore.conflictSave(params, () => {
                            this.closeAction();
                          this.props.store.MaterialStore.request_ConflictList(p.cParams); // 上传文件冲突列表
                });

        })
     }


     

     componentDidMount(){
            mobx.autorun(() => {
              let oldImage  = mobx.toJS(this.props.store.MaterialStore.get_OldImage);  // 旧数据
              if(!checkAttrs(oldImage.attrs)){   // attr 有可能是 null 或 数组
                      if(oldImage.attrs.vectorgraph) this.linkedAction_agent(oldImage.attrs.vectorgraph || 'nothing'); 
                }

          })
     }



        render(){

            let oldImage  = mobx.toJS(this.props.store.MaterialStore.get_OldImage);  // 旧数据

            let purposeOptions = mobx.toJS(this.props.store.MaterialStore.purposeOptions),
                seasonOptions = mobx.toJS(this.props.store.MaterialStore.seasonOptions),
                oversizeOptions = mobx.toJS(this.props.store.MaterialStore.get_Profiletags),
                partOptions = mobx.toJS(this.props.store.MaterialStore.get_PartTags),
                detailOptions = mobx.toJS(this.props.store.MaterialStore.get_detailOptions),
                styleOptions = mobx.toJS(this.props.store.MaterialStore.get_styleOptions),
                clenOptions = mobx.toJS(this.props.store.MaterialStore.get_clenOptions),
                vertypeTags = mobx.toJS(this.props.store.MaterialStore.get_VertypeTags),
                angleOptions = mobx.toJS(this.props.store.MaterialStore.get_AngleTags),
                subsortOptions = mobx.toJS(this.props.store.MaterialStore.get_subsortOptions);


            const formItemLayout = {  labelCol: { span: 4 },  wrapperCol: { span:20 }  };

            const { getFieldDecorator } = this.props.form;

            const itemWidth = { width : 230 };


            const { 
                loading,
                category_visiable,
                profile_visiable,
                part_visiable,
                vertype_visiable,
                style_visiable,
                clen_visiable,
                details_visiable,
                season_visiable,
                angle_visiable 
             } = this.state;



             // 保存修改文件ID
           getFieldDecorator('c_attrs.resource_id',{ initialValue : oldImage.id });

             return (
              <Modal
                  className="custom-modal-style"
                  maskClosable={false}
                  width={850}
                  visible={ this.props.store.MaterialStore.getModalVisible2 }
                  onCancel={ this.closeAction }
                    footer={null} >
                  <Row className="modifyModal-container">
                     <Col span={24}> <h3 style={{ textAlign:'center', fontSize : 18 }}>完善标签</h3> </Col>
                      <Col span={11}>
                      <div className="imageBox">
                        <h4>{ oldImage.title }</h4>
                        <figure>
                           <span className="imageBox-span">
                            <img src={ oldImage.preview ? oldImage.preview.cpath : '' } onClick={ () => { // 放大图片
                                      this.props.store.MaterialStore.setProperties({ 'bigPictureUrl': oldImage.preview ? oldImage.preview.path : '', 'bigPictureVisiable' : true  }) 
                              }} 
                              alt=""/>
                            </span>
                        </figure>
                      </div> 
                       </Col>

                        <Col span={13} style={{ maxHeight : 650, overflowY : 'scroll' }}>
                         <Form>
                             <FormItem label="素材用途" {...formItemLayout}>
                              {
                                getFieldDecorator('c_attrs.vectorgraph',{ initialValue : oldImage.attrs.vectorgraph || 'nothing' })(
                                    <RadioGroup onChange={ this.seletedPurpose }>
                                       <Radio value="nothing"> 无 </Radio>
                                      {
                                        purposeOptions.map((item,index) => (
                                              <Radio value={item.name  } key={index} > { item.name } </Radio>
                                        ))
                                      }
                                  </RadioGroup>   
                                )   
                              }
                             </FormItem>


                            {/*  wrapperCol={{ span: 8, offset:6  }}  */}
                            <FormItem  {...formItemLayout} label="廓形"  style={{ display :  profile_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('c_attrs.profile', { initialValue : oldImage.attrs.profile })(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="廓形"
                                                    treeData={ oversizeOptions } 
                                            />
      
                                )}
                           </FormItem>

                             <FormItem {...formItemLayout} label="部件"  style={{ display :  part_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('c_attrs.part', {  initialValue : oldImage.attrs.part })(
                                         <TreeSelect  style={itemWidth}
                                                      maxTagCount={ MAXTAGCOUNT }
                                                      dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                      showCheckedStrategy={SHOW_PARENT} 
                                                      multiple
                                                      allowClear  
                                                      placeholder="部件"
                                                      treeData={ partOptions } 
                                            />

                                )}
                           </FormItem>


                       <FormItem   {...formItemLayout} label="品类"  style={{ display :  category_visiable ?  'block' : 'none' }}>
                                {getFieldDecorator('c_attrs.category',{ initialValue : oldImage.attrs.category })(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={ subsortOptions } 
                                                   
                                            />
                                )}
                           </FormItem>


                         <FormItem {...formItemLayout} label="版型"  style={{ display : vertype_visiable ?  'block' : 'none' }} >
                                {getFieldDecorator('c_attrs.vertype', { initialValue : oldImage.attrs.vertype })(
                                         <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="版型"
                                                    treeData={ vertypeTags } 
                                            />
                                )}
                           </FormItem>

                           
                          <FormItem  {...formItemLayout} label="风格"  style={{ display : style_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('c_attrs.style', { initialValue : oldImage.attrs.style })(
                                <Select style={itemWidth} placeholder="风格" allowClear  mode="multiple" >
                                     {
                                        styleOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                         <FormItem  {...formItemLayout} label="衣长"  style={{ display : clen_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('c_attrs.clen', { initialValue : oldImage.attrs.clen })(
                                <Select style={itemWidth} placeholder="衣长" allowClear >
                                     {
                                        clenOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>


                            <FormItem {...formItemLayout} label="细节"  style={{ display : details_visiable ?  'block' : 'none' }} >
                               {getFieldDecorator('c_attrs.details', { initialValue : oldImage.attrs.details })(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear  mode="multiple"  >
                                      {  
                                        detailOptions.map((item,index) => (<Option key={index} value={item.name } > { item.name }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>


                          <FormItem  {...formItemLayout} label="季度"  style={{ display : season_visiable ?  'block' : 'none' }}  > 
                              {getFieldDecorator('c_attrs.season', {  initialValue :  oldImage.attrs.season })(
                                <Select style={itemWidth} placeholder="季度"  allowClear  mode="multiple" >
                                        {
                                            seasonOptions.map((item,index) => (  <Option key={index} value={ item.name } > { item.name } </Option> ))
                                        }
                                    </Select>
                               )}   
                             </FormItem>


                     <FormItem label="角度" {...formItemLayout} style={{ display : angle_visiable ?  'block' : 'none' }} >
                        {
                            getFieldDecorator('c_attrs.angle', { initialValue : oldImage.attrs.angle })(
                              <RadioGroup>
                                 {
                                   angleOptions.map((item, index) => {
                                        return (  <Radio key={index} value={ item.name }> { item.name } </Radio> )
                                   })
                                 }
                             </RadioGroup>   
                          )   
                        }
                      </FormItem>
                           <Row><Col span={ 24 }> 
                               <Button type="primary" style={{ width : 100, marginRight : 15 }}  onClick={ this.submitAction  }  loading={ loading } >保存</Button> 
                               <Button  style={{ width : 100 }}  onClick={ this.closeAction  }  >取消</Button> 
                             </Col> </Row>
                          </Form>
                       </Col>
                  </Row>
               </Modal>
             )
        }          
}

 export const SimilarModifier = Form.create()(Similarmodifier);






// 滑块走马灯
class SliderCompoenet extends Component {

     psInstance = null;

   componentWillReceiveProps(nextProps){
        if(nextProps.update){
             this.psInstance ? '' :  this.psInstance = new PerfectScrollbar('#container',{ useBothWheelAxes  : true });
        }else{
            this.psInstance && this.psInstance.destroy();
            this.psInstance = null;
        }
   }

    componentDidMount(){
           this.psInstance && this.psInstance.destroy();
           this.psInstance = null;
          this.psInstance = new PerfectScrollbar(this.refs.container,{ useBothWheelAxes  : true });

     }

     clickAction(item){ 
            // attr 有可能是 null 或 数组
            if(checkAttrs(item.attrs)){
                this.props.linkedAction('nothing')  
            }else{
                this.props.linkedAction( item.attrs.vectorgraph )  
            }
            this.props.updateImageAttrs(item);
       }


      render(){
        let imageAttrsInitialValue = this.props.imageAttrsInitialValue; 

         return (
             <div className="sliderCompoenet">
                <div className="container" id="container" ref="container">
                  <ol className="content">
                    {/*  {  item.preview.path } */}
                     {
                         imageAttrsInitialValue.map((item, index) => {
                                return (
                                  <li key={ index } onClick={  this.clickAction.bind(this,item) } ><img src={ item.preview ? item.preview.path : ''  } alt="1" /></li> 
                                )
                         })
                     }
                  </ol>
                 </div>
             </div>
         )
      }
}








@observer
export class Examinemodifier extends Component {

  state = {
      visiable : false,
      checkecd : false,
      stored : false,
      category_visiable : false,
      profile_visiable : false,
      part_visiable : false,
      vertype_visiable : false,
      style_visiable : false,
      clen_visiable : false,
      details_visiable : false,
      season_visiable : false, 
      angle_visiable : false
  }

  selectTagGrouop = (e) => {  console.log(e)  }



  linkedAction_agent = (value) =>{
        linkedAction.call(this,value, () => {}); // 显示对应的字段  
  }



  onCancel = () => {
      this.props.onClose();
      this.setState({ checkecd : false });   //  stored : false
      this.props.form.resetFields();

      this.setState({    
        category_visiable : false,
        profile_visiable : false,
        part_visiable : false,
        vertype_visiable : false,
        style_visiable : false,
        clen_visiable : false,
        details_visiable : false,
        season_visiable : false, 
        angle_visiable : false })

      this.props.store.MaterialStore.setProperties({ 'seletedRows' : [], 'editeImage' : { attrs: []} });

  }


  onsubmit(type){
    
    let imageAt = this.props.form.getFieldsValue(['imageID']);
    this.updateImageAttrs(imageAt.imageID);
    let imageAttrsInitialValue = mobx.toJS(this.props.store.MaterialStore.get_imageAttrsInitialValue);

       imageAttrsInitialValue.forEach( (item, index) => {
                let value =  item.attrs ? item.attrs.vectorgraph  : '';
                 if( value == '封面图' || value == '模特图' ){
                      if( value == '封面图')  imageAttrsInitialValue[index].attrs.picture_use = value;
                      if( value == '模特图' )  imageAttrsInitialValue[index].attrs.ptype = value;
                      delete imageAttrsInitialValue[index].attrs.vectorgraph;
                }

               for(let key in item.attrs) item.attrs[key] instanceof Array ? '' : item.attrs[key] = [ item.attrs[key] ];  // 值全部改成数组，传给后台


        });

      let seletedRows =  mobx.toJS(this.props.store.MaterialStore.seletedRows);

      this.props.submitAction( { datas : imageAttrsInitialValue, is_release : type, resource_id : seletedRows[0] } );

  }


 
  // 只做隐藏显示处理
   seletedPurpose = (e) => {
            let editeImage = mobx.toJS(this.props.store.MaterialStore.editeImage);
            if(checkAttrs(editeImage.attrs)) editeImage.attrs = {};   // attr 有可能是 null 或 数组
               editeImage.attrs.vectorgraph =  e.target.value;
              this.props.store.MaterialStore.setProperties("editeImage",editeImage);
   }



  updateImageAttrs = (record) => { // 在切换图片或提交是跟新 store 里的 imageAttrsInitialValue

          let fieldsValue =  this.props.form.getFieldsValue();

          let imageAttrsInitialValue = mobx.toJS(this.props.store.MaterialStore.get_imageAttrsInitialValue);

          let editeImage = mobx.toJS(this.props.store.MaterialStore.editeImage);

           if(checkAttrs(editeImage.attrs)) editeImage.attrs = {};   // attr 有可能是 null 或 数组

               editeImage.attrs = filterAttrs(fieldsValue.imageAttrs);  // filterAttrs 根据 vectorgraph 的值返回对应的数据

               // 把修改的属性赋值给源数据
              imageAttrsInitialValue.forEach((item,index) => {  item.id == editeImage.id ?  imageAttrsInitialValue[index] = editeImage : ''  }); // 临时方法
              if(fieldsValue.masterImage == 1){ // 临时方法
                    imageAttrsInitialValue.forEach((item,index) => {
                           ( item.id == editeImage.id) ? imageAttrsInitialValue[index].is_master = 1 : imageAttrsInitialValue[index].is_master = 2;
                     }); 
              }

            this.props.store.MaterialStore.set_imageAttrsInitialValue( imageAttrsInitialValue );
            this.props.store.MaterialStore.findEditeImage( record.id );
            this.props.form.resetFields();
  
  }


  
   findEditeImage = (id ) => {
      if(id){
              this.state.imageAttrsInitialValue.forEach((item, index) => {
                if (item.id == id) {
                  this.props.store.MaterialStore.setProperties('editeImage',item)
                      return false;
                }
              })
      }else{
        let imageAttrsInitialValue = mobx.toJS(this.props.store.MaterialStore.imageAttrsInitialValue);

        this.props.store.MaterialStore.setProperties('editeImage',item)
            this.setState({ editeImage : imageAttrsInitialValue[0] })
      }
  }




 componentWillReceiveProps(nextProps){

        if(nextProps.visiable != this.state.visiable) this.setState({ visiable : nextProps.visiable  });


  }

 
  componentDidMount(){
       mobx.autorun(() => {
        let editeImage = mobx.toJS(this.props.store.MaterialStore.editeImage);
        if(!checkAttrs(editeImage.attrs)){   // attr 有可能是 null 或 数组
                if(editeImage.attrs.vectorgraph){ 
                    this.linkedAction_agent(editeImage.attrs.vectorgraph);
                }
          }

       })
  }


 render(){

  const formItemLayout = {  labelCol: { span: 4 },   wrapperCol: { span:20 }};
  const { getFieldDecorator } = this.props.form;
  const itemWidth = { width : 230 };

                   
     let purposeOptions = mobx.toJS(this.props.store.MaterialStore.purposeOptions),
          seasonOptions = mobx.toJS(this.props.store.MaterialStore.seasonOptions),
          oversizeOptions = mobx.toJS(this.props.store.MaterialStore.get_Profiletags),
          partOptions = mobx.toJS(this.props.store.MaterialStore.get_PartTags),
          detailOptions = mobx.toJS(this.props.store.MaterialStore.get_detailOptions),
          styleOptions = mobx.toJS(this.props.store.MaterialStore.get_styleOptions),
          clenOptions = mobx.toJS(this.props.store.MaterialStore.get_clenOptions),
          vertypeTags = mobx.toJS(this.props.store.MaterialStore.get_VertypeTags),
          angleOptions = mobx.toJS(this.props.store.MaterialStore.get_AngleTags),
          subsortOptions = mobx.toJS(this.props.store.MaterialStore.get_subsortOptions);


     
      let {  
         visiable,
        category_visiable,
        profile_visiable,
        part_visiable,
        vertype_visiable,
        style_visiable,
        clen_visiable,
        details_visiable,
        season_visiable,
        angle_visiable 
          } = this.state;

      let imageAttrsInitialValue = mobx.toJS(this.props.store.MaterialStore.imageAttrsInitialValue); 

      let editeImage = mobx.toJS(this.props.store.MaterialStore.get_EditeImage);

      let _attrs = {};


        if(checkAttrs(editeImage.attrs)){   // attr 有可能是 null 或 数组

               _attrs = { vectorgraph : '' };

        }else{
               _attrs = editeImage.attrs;

        } 


        // 注册一个字段存储 点击图片对象ID
         getFieldDecorator('imageID',{ initialValue : editeImage.id });

      return (
        <Modal
              width={950}
              title="素材编辑"
              visible={ visiable }
              onCancel={ this.onCancel }
              footer={null}
              maskClosable={ false }
              style={{ top: 40 }}
          >
            <Form>
             <Row className="modifyModal-container">
               <Col span={12}>
                <div className="imageBox">
                  <h4>{ editeImage.title }</h4>
                  <figure>
                    <span className="span-img-box">
                     <img src={ editeImage.preview ? editeImage.preview.cpath  : '' }   
                         onClick={ () => { // 放大  
                    this.props.store.MaterialStore.setProperties({ 'bigPictureUrl': editeImage.preview ?  editeImage.preview.cpath  : '' , 'bigPictureVisiable' : true  }) 
                                  }}   
                               alt=""/>
                     </span>
                       <FormItem className="imageBox-radio">
                            {
                            getFieldDecorator('masterImage', { initialValue :  editeImage.is_master })(
                              <RadioGroup > 
                                <Radio value={ 1 }> <i style={{ color : '#fff', fontStyle : 'normal' }} >主图</i>  </Radio> 
                              </RadioGroup>
                            )   
                          }
                        </FormItem>
                  </figure>

                </div> 

                  <SliderCompoenet {...this.props} update={ visiable } linkedAction={ this.linkedAction_agent }  imageAttrsInitialValue={ imageAttrsInitialValue } updateImageAttrs={ this.updateImageAttrs }  />
                </Col>

                 <Col span={12} style={{ maxHeight : 700, overflowY : 'scroll', minHeight : 600 }}>
                
                      <FormItem label="素材用途" {...formItemLayout}>
                       {
                         getFieldDecorator('imageAttrs.vectorgraph',{ initialValue : _attrs.vectorgraph  })(
                             <RadioGroup   onChange={ this.seletedPurpose }> 
                                  <Radio  value="nothing" > 无 </Radio>
                                {
                                  purposeOptions.map((item,index) => {
                                      return (  <Radio key={index} value={ item.name } >{ item.name }</Radio> )
                                  })
                                }
                           </RadioGroup>   
                         )   
                       }
                      </FormItem>

                    
                         <FormItem  {...formItemLayout} label="廓形"  style={{ display :  profile_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('imageAttrs.profile', { initialValue : _attrs.profile })(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="廓形"
                                                    treeData={ oversizeOptions } 
                                            />
      
                                )}
                           </FormItem>


                            <FormItem {...formItemLayout} label="部件"  style={{ display :  part_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('imageAttrs.part',{ initialValue : _attrs.part })(
                                         <TreeSelect  style={itemWidth}
                                                      maxTagCount={ MAXTAGCOUNT }
                                                      dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                      showCheckedStrategy={SHOW_PARENT} 
                                                     // treeCheckable={ true } 
                                                      multiple
                                                      allowClear  
                                                      placeholder="部件"
                                                      treeData={ partOptions } 
                                            />

                                )}
                           </FormItem>


                          <FormItem   {...formItemLayout} label="品类"  style={{ display :  category_visiable ?  'block' : 'none' }}>
                                {getFieldDecorator('imageAttrs.category',{ initialValue : _attrs.category })(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={ subsortOptions } 
                                                   
                                            />
                                )}
                           </FormItem>


                         <FormItem {...formItemLayout} label="版型"  style={{ display : vertype_visiable ?  'block' : 'none' }} >
                                {getFieldDecorator('imageAttrs.vertype',{ initialValue : _attrs.vertype })(
                                         <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="版型"
                                                    treeData={ vertypeTags } 
                                            />
                                )}
                           </FormItem>

                           
                          <FormItem  {...formItemLayout} label="风格"  style={{ display : style_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('imageAttrs.style',{ initialValue : _attrs.style })(
                                <Select style={itemWidth} placeholder="风格" allowClear  mode="multiple" >
                                     {
                                        styleOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                         <FormItem  {...formItemLayout} label="衣长"  style={{ display : clen_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('imageAttrs.clen',{ initialValue : _attrs.clen })(
                                <Select style={itemWidth} placeholder="衣长" allowClear>
                                     {
                                        clenOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>


                            <FormItem {...formItemLayout} label="细节"  style={{ display : details_visiable ?  'block' : 'none' }} >
                               {getFieldDecorator('imageAttrs.details',{ initialValue : _attrs.details })(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear   mode="multiple" >
                                      {  
                                        detailOptions.map((item,index) => (<Option key={index} value={item.name } > { item.name }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>


                          <FormItem  {...formItemLayout} label="季度"  style={{ display : season_visiable ?  'block' : 'none' }}  > 
                              {getFieldDecorator('imageAttrs.season',{ initialValue : _attrs.season })(
                                <Select style={itemWidth} placeholder="季度"  allowClear  mode="multiple" >
                                        {
                                            seasonOptions.map((item,index) => (  <Option key={index} value={ item.name } > { item.name } </Option> ))
                                        }
                                    </Select>
                               )}   
                             </FormItem>


                     <FormItem label="角度" {...formItemLayout} style={{ display : angle_visiable ?  'block' : 'none' }} >
                        {
                            getFieldDecorator('imageAttrs.angle',{  initialValue : _attrs.angle || ''  })(
                              <RadioGroup>
                                 {
                                   angleOptions.map((item, index) => {
                                        return (  <Radio key={index} value={ item.name }> { item.name } </Radio> )
                                   })
                                 }
                             </RadioGroup>   
                          )   
                        }
                      </FormItem>


                        <Row> 
                           <Col span={24}>
                               <Button style={{ width : 120, marginRight : 10 }} type='primary'  onClick={ this.onsubmit.bind(this,'0') } >保存后台</Button> 

                                 {/*   暂时注释
                                   <Button style={{ width : 120, display: 'none' }}   onClick={ this.onsubmit.bind(this,'1') } >保存发布</Button>  
                               */}

                              </Col> 
                           </Row>
                   </Col>
                </Row>
                </Form>
           </Modal>
      )
   }          
}


export const ExamineModifier = Form.create()(Examinemodifier);






@observer
export class Bulkeditor extends Component {

    state = { 
       loading : false,

       category_visiable : false,
       profile_visiable : false,
       part_visiable : false,
       vertype_visiable : false,
       style_visiable : false,
       clen_visiable : false,
       details_visiable : false,
       season_visiable : false 
       }


    handleOk = () => { 

         this.props.form.validateFields((err, values) => {

             if(!err){

              this.setState({ loading : true });
              let { bulkAttrs } = values;
              let params = { attrs : {}, ids : [] };

               for(let key in bulkAttrs){
                       if(bulkAttrs[key] instanceof Array){
                           bulkAttrs[key].length ?  params.attrs[key] = bulkAttrs[key] : '';
                       }else{
                           bulkAttrs[key] ?  params.attrs[key] = bulkAttrs[key] : '';
                       }
               }


               let value =  params.attrs.vectorgraph;
            
                  if( value == '封面图' || value == '模特图' ){
                        if( value == '封面图')   params.attrs.picture_use = value;
                        if( value == '模特图' )  params.attrs.ptype = value;
                        delete params.attrs.vectorgraph;
                  }

                   let seletedRows =  mobx.toJS(this.props.store.MaterialStore.getSeletedRows);

                        params.ids = seletedRows;
                
                   this.props.store.MaterialStore.request_multiEdit( params, () => {  
                            this.onCancel();
                            this.props.store.MaterialStore.setSelectedRows([]);  // 清空已勾选
                      });


              
             }


          });
      
    }


    clearFieldsAction = () =>{
      this.props.form.setFieldsValue({  
          bulkAttrs : {
              category : undefined,
              profile : undefined,
              part : undefined,
              vertype : undefined,
              style : undefined,
              clen : undefined,
              details : undefined,
              season : undefined,
              angle : undefined
    }})
  }


    onCancel = () => {   
              this.props.form.resetFields(); 
              this.props.store.MaterialStore.setProperties({'seletedRows' : [], 'bulkEditor' : false });
              linkedAction.call(this,'nothing', this.clearFieldsAction );
              this.setState({ loading : false });
         }


    checkedAction = (e) => {
          let value  = e.target.value;
          linkedAction.call(this,value,  this.clearFieldsAction );
    }


  


   render(){

    let { loading,
        category_visiable,
        profile_visiable,
        part_visiable,
        vertype_visiable,
        style_visiable,
        clen_visiable,
        details_visiable,
        season_visiable
       } = this.state;

    let bulkEditor = this.props.store.MaterialStore.getBulkEditor;

    const formItemLayout = { labelCol: { span: 8 },  wrapperCol: { span: 16 }  };
    const { getFieldDecorator } = this.props.form;
    const itemWidth = { width : 230 };


          
     let purposeOptions = mobx.toJS(this.props.store.MaterialStore.purposeOptions),
         seasonOptions = mobx.toJS(this.props.store.MaterialStore.seasonOptions),
         oversizeOptions = mobx.toJS(this.props.store.MaterialStore.get_Profiletags),
         partOptions = mobx.toJS(this.props.store.MaterialStore.get_PartTags),
         detailOptions = mobx.toJS(this.props.store.MaterialStore.get_detailOptions),
         styleOptions = mobx.toJS(this.props.store.MaterialStore.get_styleOptions),
         clenOptions = mobx.toJS(this.props.store.MaterialStore.get_clenOptions),
         vertypeTags = mobx.toJS(this.props.store.MaterialStore.get_VertypeTags),
         subsortOptions = mobx.toJS(this.props.store.MaterialStore.get_subsortOptions);



        return (
          <Modal
              width={700}
              title="批量编辑"
              visible={ bulkEditor }
              onCancel={ this.onCancel }
              footer={[ <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}> 保存 </Button> ]}
          >
              <Row className="bulkEditing-container">
                <Col span={24}>
                  <Form>
                      <FormItem label="素材用途" {...formItemLayout}>
                       {
                         getFieldDecorator('bulkAttrs.vectorgraph',{ initialValue : undefined, rules : [  { required: true, message: '请选择用途' } ] })(
                             <RadioGroup onChange={ this.checkedAction } >
                                 {
                                     purposeOptions.map((item,index) => {
                                      return (  <Radio key={index} value={ item.name }   >{ item.name }</Radio> )
                                    })
                                 }
                           </RadioGroup>   
                         )   
                       }
                      </FormItem>

                

                            {/*  wrapperCol={{ span: 8, offset:6  }}  */}
                         <FormItem  {...formItemLayout} label="廓形"  style={{ display :  profile_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('bulkAttrs.profile')(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="廓形"
                                                    treeData={ oversizeOptions } 
                                            />
      
                                )}
                           </FormItem>


                            <FormItem {...formItemLayout} label="部件"  style={{ display :  part_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('bulkAttrs.part')(
                                         <TreeSelect  style={itemWidth}
                                                      maxTagCount={ MAXTAGCOUNT }
                                                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                      showCheckedStrategy={SHOW_PARENT} 
                                                      multiple
                                                      allowClear  
                                                      placeholder="部件"
                                                      treeData={ partOptions } 
                                            />

                                )}
                           </FormItem>



                                <FormItem   {...formItemLayout} label="品类"  style={{ display :  category_visiable ?  'block' : 'none' }}>
                                {getFieldDecorator('bulkAttrs.category')(
                                 <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="品类"
                                                    treeData={ subsortOptions } 
                                            />
                                )}
                           </FormItem>




                         <FormItem {...formItemLayout} label="版型"  style={{ display : vertype_visiable ?  'block' : 'none' }} >
                                {getFieldDecorator('bulkAttrs.vertype')(
                                         <TreeSelect  style={itemWidth}
                                                    maxTagCount={ MAXTAGCOUNT }
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    showCheckedStrategy={SHOW_PARENT} 
                                                    multiple
                                                    allowClear  
                                                    placeholder="版型"
                                                    treeData={ vertypeTags } 
                                            />
                                )}
                           </FormItem>

                           
                          <FormItem  {...formItemLayout} label="风格"  style={{ display : style_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('bulkAttrs.style')(
                                <Select style={itemWidth} placeholder="风格" allowClear  mode="multiple" >
                                     {
                                        styleOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                         <FormItem  {...formItemLayout} label="衣长"  style={{ display : clen_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('bulkAttrs.clen')(
                                <Select style={itemWidth} placeholder="衣长" allowClear  >
                                     {
                                        clenOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>


                            <FormItem {...formItemLayout} label="细节"  style={{ display : details_visiable ?  'block' : 'none' }} >
                               {getFieldDecorator('bulkAttrs.details')(
                                <Select mode="multiple"  style={itemWidth} placeholder="细节" allowClear   mode="multiple" >
                                      {  
                                        detailOptions.map((item,index) => (<Option key={index} value={item.name } > { item.name }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>


                          <FormItem  {...formItemLayout} label="季度"  style={{ display : season_visiable ?  'block' : 'none' }}  > 
                              {getFieldDecorator('bulkAttrs.season')(
                                <Select style={itemWidth} placeholder="季度" allowClear  mode="multiple" >
                                        {
                                            seasonOptions.map((item,index) => (  <Option key={index} value={ item.name } > { item.name } </Option> ))
                                        }
                                    </Select>
                               )}   
                             </FormItem>

                 </Form>
              </Col>
            </Row> 
           </Modal>    
        )
   
   }
}


export const BulkEditor = Form.create()(Bulkeditor);