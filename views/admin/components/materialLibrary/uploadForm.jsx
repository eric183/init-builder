import * as React from 'react';
import {  Component  } from 'react'; 
import * as mobx from 'mobx';
import { observer } from 'mobx-react';
import { Modal, Button,Icon,Form, Select,  Radio, Upload, message, Cascader, TreeSelect  } from 'antd'

const Dragger = Upload.Dragger;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_ALL ; // TreeSelect.SHOW_PARENT;
const MAXTAGCOUNT = 3;


function removeFromArray(info,type){
    let fileList = info.concat();
    fileList.forEach((item, index) => {
        (item.type && item.type !== type) ? fileList.splice(index,1) : '';
    });
    return fileList;
}



@observer
class Uploadform extends Component { 

    constructor(props){
          super(props);
          this.lastFetchId = 0;
    }

        state = {
             value : [],
             selectData: [],
             fetching: false,
             fileList : [],
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


        onCancel = () => {
            this.props.onClose();  
            this.props.form.resetFields();
            this.setState({ fileList : [], loading : false });
            this.linkedAction('nothing');

        }


     linkedAction(value){

     let {  config, defualtTags } = mobx.toJS(this.props.store.MaterialStore.matarialConfig);

     let defaultConfig = {
            category_visiable : false,
            profile_visiable : false,
            part_visiable : false,
            vertype_visiable : false,
            style_visiable : false,
            clen_visiable : false,
            details_visiable : false,
            season_visiable : false
     };
     let  visiableObjects = Object.assign({}, defaultConfig, true);   

      defualtTags.forEach(item => {

            if(value == item.name ) config[ item.key ].forEach((item,index) => {  visiableObjects[item] = true });


      }); 

      this.props.form.resetFields();  
      this.setState({ ...visiableObjects });
       
  } 
  




    handleSubmit = () => {

     const { fileList } = this.state;

     // 把form表单数据都赋值给 formData
      this.props.form.validateFields((err, values) => {

             if(fileList.length > 0){

                const formData = new FormData();

                let attrsArry = {};

                fileList.forEach((file) => {   formData.append('file', file ) });

                formData.append('app_id', 11);

                let { vectorgraph, category, profile, part, vertype, style, clen, details, season  } = values;

                 attrsArry = { vectorgraph, category, profile, part, vertype, style, clen, details, season }; 

            

                 if( vectorgraph == '封面图' || vectorgraph == '模特图' ){
                       if( vectorgraph == '封面图')   attrsArry.picture_use = vectorgraph;
                       if( vectorgraph == '模特图' )  attrsArry.ptype = vectorgraph;
                       delete attrsArry.vectorgraph;
                 }


                for(let key in attrsArry){

                      if(attrsArry[key] instanceof Array){

                          attrsArry[key].length ? '' : delete attrsArry[key];

                      }else{
                           
                          if(attrsArry[key] == "nothing"){

                                   delete attrsArry[key];
                          }else{

                                attrsArry[key] ? '' :  delete attrsArry[key]; 

                          }
                      }
                }

                if(Object.keys(attrsArry).length) formData.append('attrs', JSON.stringify(attrsArry));  

                     this.setState({ loading : true });

                     this.props.store.MaterialStore.uploadeFile(formData, () => {   this.onCancel(); })

             }else{
                  
                      message.warning('请上传文件')
                  
             }

        })


    }



    selectPurpose = (e) => {
           let value = e.target.value;
           this.linkedAction(value);
    }


    componentDidMount(){
        this.props.onRef(this);
    }
  


     render(){
         

         let purposeOptions = mobx.toJS(this.props.store.MaterialStore.purposeOptions),
                seasonOptions = mobx.toJS(this.props.store.MaterialStore.seasonOptions),
                oversizeOptions = mobx.toJS(this.props.store.MaterialStore.get_Profiletags),
                partOptions = mobx.toJS(this.props.store.MaterialStore.get_PartTags),
                editorOptions = mobx.toJS(this.props.store.MaterialStore.get_editorOptions),
                detailOptions = mobx.toJS(this.props.store.MaterialStore.get_detailOptions),
                styleOptions = mobx.toJS(this.props.store.MaterialStore.get_styleOptions),
                clenOptions = mobx.toJS(this.props.store.MaterialStore.get_clenOptions),
                vertypeTags = mobx.toJS(this.props.store.MaterialStore.get_VertypeTags),
                subsortOptions = mobx.toJS(this.props.store.MaterialStore.get_subsortOptions);
  
      
        const formItemLayout = {  labelCol: { span: 6 }, wrapperCol: { span: 14 } };

        const itemWidth = { width : 300 };
        
        let { getFieldDecorator } = this.props.form;

        let {    loading,
                category_visiable,
                profile_visiable,
                part_visiable,
                vertype_visiable,
                style_visiable,
                clen_visiable,
                details_visiable,
                season_visiable,
           } = this.state; 

        let  isEdite = this.props.store.MaterialStore.get_isEdite;

        let visiable = this.props.store.MaterialStore.getModalVisible;


         /* 手动上传  */
         const props = {
                name : 'file',
                action : '',
                headers : {
                    authorization: 'authorization-text',
                },
                onRemove: (file) => {
                    this.setState(({ fileList }) => {
                      const index = fileList.indexOf(file);
                      const newFileList = fileList.slice();
                      newFileList.splice(index, 1);
                      return {  fileList: newFileList  };
                    });
            
                  },
              beforeUpload: (file) => {
                    if(/(zip)$/g.test(file.name)){   // /(rar|zip)$/g
                            if(this.state.fileList.length > 0 ){ 
                                message.warning('每次限制仅上传一个文件')
                             }else{
                                this.setState(({ fileList }) => ( { fileList: [...fileList, file] }));
                             }
                           
                    }else{
                       message.warning('仅支持ZIP压缩文件')   // 仅支持ZIP、RAR压缩文件
                    }
                    return false;
                  },
            
            fileList: this.state.fileList,
              
         };

    
         return (
              <Modal
                    title="上传素材"
                    width={800}
                    style={{ top: 40 }}
                    visible={ visiable  }
                    onOk={ this.onOk }
                    onCancel={ this.onCancel }
                    maskClosable={false}
                    footer={[
                        <Button key="submit" type="primary" loading={loading} onClick={  this.handleSubmit }> 提交</Button>,
                        <Button key="back" onClick={this.onCancel}>取消</Button>,
                    ]}
                    >
                <section className="modal_upload_main">
                  <Form className="material_upload_form">
                        <FormItem  required {...formItemLayout} label="上传文件" > 
                                    {getFieldDecorator('file')(
                                            <Dragger {...props}>
                                            <p className="ant-upload-drag-icon"><Icon type="inbox" /></p>
                                            <p className="ant-upload-text">点击或拖拽压缩包到该区域 </p>
                                            <p className="ant-upload-hint"> 仅支持ZIP格式 </p>
                                            </Dragger>
                                    )}   
                              </FormItem>

                      <FormItem {...formItemLayout} label="素材用途" >
                        {getFieldDecorator('vectorgraph',{ initialValue : 'nothing' })(
                            <RadioGroup  onChange={ this.selectPurpose }>
                                <Radio value='nothing' > 无 </Radio>
                                {
                                    purposeOptions.map((item, index) => (
                                        <Radio key={index} value={ item.name } > { item.name } </Radio>
                                    ))
                                }
                            </RadioGroup>
                        )}
                        </FormItem>

         

                            {/*  wrapperCol={{ span: 8, offset:6  }}  */}
                         <FormItem  {...formItemLayout} label="廓形"  style={{ display :  profile_visiable ?  'block' : 'none' }}  >
                                {getFieldDecorator('profile')(
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
                                {getFieldDecorator('part')(
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

                                 
                        <FormItem   {...formItemLayout} label="品类" style={{ display :  category_visiable ?  'block' : 'none' }} >
                                {getFieldDecorator('category')(
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
                                {getFieldDecorator('vertype')(
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
                              {getFieldDecorator('style')(
                                <Select style={itemWidth} placeholder="风格" allowClear  mode="multiple" >
                                     {
                                        styleOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                      }
                                    </Select>
                               )}   
                             </FormItem>


                         <FormItem  {...formItemLayout} label="衣长"  style={{ display : clen_visiable ?  'block' : 'none' }} > 
                              {getFieldDecorator('clen')(
                                <Select style={itemWidth} placeholder="衣长" allowClear>
                                     {
                                        clenOptions.map((item,index) => ( <Option key={index} value={ item.name } > { item.name } </Option> ))
                                     }
                                    </Select>
                               )}   
                             </FormItem>


                            <FormItem {...formItemLayout} label="细节"  style={{ display : details_visiable ?  'block' : 'none' }} >
                               {getFieldDecorator('details')(
                                <Select mode="multiple"  mode="multiple"  style={itemWidth} placeholder="细节" allowClear  >
                                      {  
                                        detailOptions.map((item,index) => (<Option key={index} value={item.name } > { item.name }</Option>))
                                      }
                              </Select>
                              )}
                            </FormItem>


                          <FormItem  {...formItemLayout} label="季度"  style={{ display : season_visiable ?  'block' : 'none' }}  > 
                              {getFieldDecorator('season')(
                                <Select style={itemWidth} placeholder="季度"  mode="multiple"  allowClear >
                                        {
                                            seasonOptions.map((item,index) => (  <Option key={index} value={ item.name } > { item.name } </Option> ))
                                        }
                                    </Select>
                               )}   
                             </FormItem>

                   </Form>
                 </section>
             </Modal>
         )
     }
}






const UploadForm = Form.create()(Uploadform);
export default UploadForm;
 


