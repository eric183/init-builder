import React , { Component }  from 'react';
import { Link } from 'react-router';
import { Layout, 
Form, Input, Select, Modal, Button,Icon,
 message,Table,Radio,Upload,DatePicker,Popconfirm
} from 'antd';
import {observer} from 'mobx-react';
import qs from 'qs';
import $http from 'axios';
import * as mobx from 'mobx';
import { computed, autorun } from 'mobx';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


@observer class Recommend_dtail extends Component {
       constructor(props){ super(props) }
       state = {
           id_row : '',  // 编辑行 ID
           id : (this.props.location.search.slice(1).split('='))[1], // url id 参数
            page : 1,
            limit : 10,
            count : 10,
            visible : false,
            confirmLoading: false,
            imageUrl : '',
            filelist : [],
            files : { 
                title : '',
                link : '',
                release_time  : null,
                disabled : '',
                summary : '',
            }
       }



     // 从新渲染
     reloadAction = () => {
        let params = this.props.location.search.slice(1);
        this.props.store.recommendStore.getRecommendDetailData() 
        
     }


    // 获取 url 参数
      GetRequest(url) {   
            var theRequest = new Object();   
            if (url.indexOf("?") != -1) {   
                    var str = url.substr(1),   
                       strs = str.split("&"); 
                    for(var i = 0; i < strs.length; i ++) {   
                        theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
                        }  
                         
            }   
            return theRequest;   
     } 




     openPop = () =>{
          this.setState({
              visible : true
          })
     }


     handleOk = () =>{  this.handleSubmit()  }

     handleCancel = () =>{
         this.setState({
            visible : false,
            confirmLoading : false,
            id_row : '',
            files : { 
                title : '',
                link : '',
                release_time  : null,
                disabled : '',
                summary : '',
            }
         });

         this.props.form.resetFields();

     }


   
     handleSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            // if(this.state.filelist.length == 0 ) {
            //    message.error('未上传图片');
            //     return false;
            //   }
            if (!err) {  
                    this.setState({ confirmLoading : true })
                    let params = {
                        am_id : this.state.id,
                        release_time : values.release_time.format('YYYY-MM-DD'),
                        tag_id : 0,
                        title : values.title,
                        summary : values.summary,
                        image :  '18/158/18/158/ZVZxePlzddNn4RKgBbtAsUfn8jVHpM6ovDKyDTjO.jpeg',  //  this.state.filelist[0].thumbUrl,
                        link : values.link,
                        disabled : values.disabled
                    };

                    if(this.state.id_row){  // 编辑
                        this.props.store.recommendStore.editeRow_sub(params, this.state.id_row, () => {  this.handleCancel(); this.reloadAction()  });
                    }else{
                        this.props.store.recommendStore.addAdver_sub(params, () => {    this.handleCancel(); this.reloadAction()  });
                    }

                      
             }
        })
     }




     normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.filelist;
      }

      

       // 图片上传成功
      handleUploadChange = (info) =>{

            if(info.file.status === 'uploading'){
                  // do something 
                  return false;
            }  
            if(info.file.status === 'done'){
                    this.setState({ 
                        filelist :info.fileList
                     })
                    console.log(info);
            }
      } 


   // 移除上传
   handleRemoveFile = (file) => { this.setState({ filelist : [] }) }


     editor_row = (record) =>{
          this.setState({
            id_row : record.id,
            visible : true,
            files : { 
                title : record.title,
                link : record.link,
                release_time  : moment(record.release_time, 'YYYY-MM-DD'), 
                disabled : record.disabled,
                summary : record.summary
            }
         });



     }


     delete_row  = (record) =>{
         this.props.store.recommendStore.deleteRow_sub(record.id, () => {  this.reloadAction()  } );
     }



     mouseOver_img = (text,record,e) => {
            
        //    console.log(text);
        //    console.log(record);
        //    console.log(e.target);
     }

     mouseOut_img = () => {
           
     }


    // 数据长度
    @computed get dataLength(){
        return mobx.toJS(this.props.store.recommendStore.recommendDetailData).length;
     }



componentDidMount(){
        this.props.store.recommendStore.getRecommendDetailData()
    }

componentWillReceiveProps(nextProps){
     //  console.log(this.props.history.location)
     //  console.log(nextProps.location.search.slice(1));
}




       render(){

           let { page, limit, count, visible, confirmLoading, filelist } = this.state;

           const { getFieldDecorator } = this.props.form;


           const uploadButton = (
            <div className="upload-button-style">
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">上传</div>
            </div>
          );

    
            const imageStyle = {
                    display : 'inline-block',
                    width : 45,
                    height :45,
                    margin : '0 auto'
            };

            const formItemLayout ={
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 }
                }
          };

        

      return (
            <Layout.Content className=" role-content setting_platform">
                 <div className="operation-menu">
                    <div className="button-bar">
                        <Button type="primary" href={`#setting/recommend_list`} >返回上一栏</Button>
                        <Button type="primary" onClick={this.openPop} style={{ top: '1px', marginLeft :'10px' }}>添加信息</Button>
                    </div>
                  </div>
                  <div className="recommend-table">
                  <Table
                      columns={[
                          {
                            title: '广告标题',
                            dataIndex: 'title'
                          },
                          {
                            title: '图片',
                            dataIndex: 'image',
                            render: (text, record) => (
                                 <img src='http://pic36.photophoto.cn/20150801/0029014163022318_b.png' 
                                 style={imageStyle} 
                                 // onMouseOut={this.mouseOut_img} 
                                // onMouseOver={this.mouseOver_img.bind(this,text,record)} 
                                 />
                            )
                          },
                          {
                            title: '链接',
                            dataIndex: 'link'
                          },
                          {
                            title: '发布时间',
                            dataIndex: 'release_time'
                          },
                          {
                            title: '操作',
                            render: (text, record) => (
                                <span>
                                    <a  href='javascript:void(0)'  onClick={ () =>{ this.editor_row(record) } } style={{ marginRight:'5px',marginLeft:'5px' }} >编辑</a>
                                    <Popconfirm title="确定要删除?" onConfirm={  this.delete_row.bind(this,record)  } okText="Yes" cancelText="No">
                                        <a href='javascript:void(0)'>删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }
                      ]}
                      rowKey='id'
                      dataSource={ mobx.toJS(this.props.store.recommendStore.recommendDetailData) }
                      pagination={{
                        current: page,
                        pageSize: limit,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        total : Number(count) | 0,
                    showTotal: function(total,pageSize){
                        return `共${Number(count)}条`
                    },
                    onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                        this.setState({ page : pageNumber })
                        this.props.history.push(pathname + `?id=${this.state.id}&limit=${pageSize}&page=${pageNumber}`);

                    },
                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                           let { pathname } = this.props.history.location;
                           this.props.history.push(pathname + `?id=${this.state.id}&limit=${pageSize}&page=${current}`);
                           this.setState({ limit : pageSize })
                       }
                    }}
                    />
                  </div>

                    <Modal title='添加推荐位'
                            visible={visible}
                            onOk={this.handleOk }
                            confirmLoading={confirmLoading}
                            onCancel={ this.handleCancel }
                            className={'addFollowUp_pop'}
                            width={'500px'}
                            bodyStyle={{ maxHeight : '750px', overflow : 'auto' }}
                            footer={ [
                                <Button key="back" onClick={this.handleCancel }>取消</Button>,
                                <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk}>确定</Button>,
                            ]}>  
                             <div style={{maxHeight: '600px',overflow:'auto'}}>
                               <Form className="addedForm-node" onSubmit={ this.handleSubmit } >

                               <FormItem {...formItemLayout} label="广告标题">
                                    {getFieldDecorator('title', {
                                        initialValue : this.state.files.title,
                                        rules: [{ required: true, message: '请输入标题!' }],
                                    })(
                                        <Input />
                                    )}
                                  </FormItem>
                                  
                                
                                  <FormItem {...formItemLayout} label="Upload" required extra="只能上传图片" >
                                         <div>
                                             <Upload 
                                                     name="file" 
                                                     action="/api/uploads" 
                                                     listType="picture"
                                                     onChange={ this.handleUploadChange }
                                                     beforeUpload={this.handleBeforeUpload}
                                                     onRemove={this.handleRemoveFile}
                                                     defaultFileList={ filelist }
                                                    >
                                                 <Button disabled={ filelist.length == 1 ? true : false }><Icon type="upload" /> 上传 </Button>
                                              </Upload>
                                            </div>
                                    </FormItem>

                                   

                                     <FormItem {...formItemLayout} label="链接">
                                        {getFieldDecorator('link', {
                                            initialValue : this.state.files.link,
                                            rules: [{ required: true, message: '请输入链接!' }],
                                        })(
                                            <Input />
                                          )}
                                     </FormItem>

                                     
                                     <FormItem {...formItemLayout} label="发布时间">
                                        {getFieldDecorator('release_time', {
                                            initialValue : this.state.files.release_time,
                                            rules: [{ required: true, type : 'object', message: '请选择时间！' }],
                                        })(

                                            <DatePicker style={{ width : '100%' }}/>

                                          )}
                                      </FormItem>


                                         <FormItem {...formItemLayout} label="是否禁用">
                                            {getFieldDecorator('disabled',{ initialValue : this.state.files.disabled })(
                                                    <RadioGroup>
                                                        <Radio value={0}>禁用</Radio>
                                                        <Radio value={1}>启用</Radio>
                                                    </RadioGroup>
                                            )}
                                            </FormItem>
                                             

                                       <FormItem {...formItemLayout} label="简介">
                                        {getFieldDecorator('summary', {
                                            initialValue : this.state.files.summary,
                                            rules: [{ required: true, message: '请输入简介!' }],
                                        })(
                                            <Input.TextArea rows={4} style={{ resize : 'none' }} />
                                        )}
                                     </FormItem>
                        



                                </Form>
                             </div>
                        </Modal>

              </Layout.Content>
           )
           
       }

         
}


const RecommendDtail = Form.create({})(Recommend_dtail);

export default RecommendDtail;