import React , { Component }  from 'react';
import { Link } from 'react-router';
import { Layout, 
Form, Input, Select, Modal, Row,Col, Button,
 message, Pagination,Table, Cascader,Checkbox,Radio , Popconfirm
} from 'antd';
import {observer} from 'mobx-react';
import qs from 'qs';
import $http from 'axios';
import * as mobx from 'mobx';
import { computed, autorun } from 'mobx';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


@observer class Recommendlist extends Component {

    constructor(props){ super(props) }

    state = {
        page : 1,
        limit : 10,
        count : 10,
        id : '',
        visible : false,
        confirmLoading : false,
        files : {
            name: '',
            title: '',
            app_nav: undefined,
            width: '',
            height: '',
            max_count: ''
        }
    }


     // 从新渲染
   reloadAction = () => {
      let params = this.props.location.search.slice(1);
       if(params == ''){  
             this.props.store.recommendStore.getRecommendData() 
       }
   }

    
  handleOk = () => { this.handleSubmit()  }

    handleCancel  = () => {
        this.setState({
            visible : false,
            id : '',
            files : {
                name: '',
                title: '',
                app_nav: undefined,
                width: '',
                height: '',
                max_count: ''
            }
        });

      this.props.form.resetFields();
    
    }


    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {   

                this.setState({ confirmLoading : true  })

                let params = {
                        app_id:values.app_nav[0],
                        nav_id:values.app_nav[1],
                        name:values.name,
                        title:values.title,
                        width:values.width,
                        height:values.height,
                        max_count:values.max_count
                };

               
                     if(this.state.id){  // 编辑
                                this.props.store.recommendStore.editeRow( params, this.state.id, () => {
                                         this.handleCancel();  
                                         this.setState({ confirmLoading : false  }) 
                                })

                            }else{

                                this.props.store.recommendStore.addAdver(params, () =>{ 
                                    this.handleCancel(); 
                                    this.setState({ confirmLoading : false  }) 
                                    this.props.store.recommendStore.getRecommendData();  // 更新列表数据

                                })
                                
                            }
               }

          })
    }


     openPop = () => {
            this.setState({
                visible : true
            });

          // 获取下拉列表数据
           this.props.store.recommendStore.getNodes();

      }


      editor_row = (record) => {
         this.setState({
                 visible : true,
                 id : record.id,
                 files : {
                    name: record.name,
                    title: record.title,
                    app_nav: [record.app_id,record.nav_id],
                    width: record.width,
                    height: record.height,
                    max_count: record.max_count
                }
         })


    
      }


      delete_row = (record,event) => {
            this.props.store.recommendStore.deleteRow(record.id, () => {  this.reloadAction()  });
      }

      PopconfirmCancel = () => {}



      handleCascader = (value) => {
           
            let files = Object.assign({},this.state.files,true);
                files.app_nav = value;

                console.log(files);

            this.setState({
                files : files
            })


      }


    
    componentDidMount(){
           this.props.store.recommendStore.getRecommendData()
    }

   componentWillReceiveProps(nextProps){
        //  console.log(this.props.history.location)
        //  console.log(nextProps.location.search.slice(1));
   }

    

    render(){

        let { page, limit, count, visible, confirmLoading } = this.state;

        const { getFieldDecorator } = this.props.form;

        const formItemLayout ={
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 6 }
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 16 }
                    },
          };


        return ( 
        <Layout.Content className=" role-content setting_platform">
            <div className="operation-menu">
                    <div className="button-bar">
                        <Button type="primary" onClick={this.openPop} >添加推荐位</Button>
                    </div>
                </div>
          <div className="recommend-table">
          <Table columns={[{
                            title: '广告标识',
                            dataIndex: 'name',
                        },{
                            title: '广告名称',
                            dataIndex: 'title'
                          
                        },{
                            title: '应用/栏目',
                            dataIndex: 'app',
                            render : (text, record) => ( record.app.name +'-'+ record.app.title )   
                        },

                        {
                            title: '最大保存条数',
                            dataIndex: 'max_count',
                        },
                        {
                            title: '宽',
                            dataIndex: 'width',
                        },
                        {
                            title: '高',
                            dataIndex: 'height',
                        },
                        
                        {
                            title: '操作',
                            render: (text, record) => (
                                <span>
                                    <a  href={`#setting/recommend_list/detail?id=${record.id}`} >信息管理</a>
                                    <a  href='javascript:void(0)'  onClick={ () =>{ this.editor_row(record) } } style={{ marginRight:'5px',marginLeft:'5px' }} >编辑</a>
                                    <Popconfirm title="确定要删除?" onConfirm={  this.delete_row.bind(this,record)  } onCancel={ this.PopconfirmCancel } okText="Yes" cancelText="No">
                                        <a href='javascript:void(0)'>删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={ mobx.toJS(this.props.store.recommendStore.recommendData)  } 
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
                
                                    },
                                    onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
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
                            footer={ [
                                <Button key="back" onClick={this.handleCancel }>取消</Button>,
                                <Button key="submit" type="primary" loading={confirmLoading} onClick={this.handleOk}>确定</Button>,
                            ]}>   

                  <div style={{maxHeight: '600px',overflow:'auto'}}>
                      <Form className="addedForm-node" onSubmit={ this.handleSubmit } >
                          <FormItem {...formItemLayout} label="广告标识">
                            {getFieldDecorator('name', {
                                initialValue : this.state.files.name,
                                rules: [{ required: true, message: '请输入正确的广告标识' }],
                              })(
                                <Input placeholder='' />
                               )}
                            </FormItem>

                        <FormItem {...formItemLayout} label="广告名称">
                            {getFieldDecorator('title', {
                                initialValue : this.state.files.title, 
                                rules: [{ required: true, message: '请输入正确的广告名称' }],
                              })(
                                <Input />
                               )}
                            </FormItem>

                             <FormItem {...formItemLayout} label="应用和栏目ID">
                                {getFieldDecorator('app_nav',{ 
                                                 initialValue : this.state.files.app_nav ,
                                                rules: [{ required: true, message: '请选择其中一项' }] 
                                            })(
                                             <Cascader
                                                // onChange={ this.handleCascader }  
                                                 filedNames={{ label: 'title', value: 'id', children: 'navs' }} 
                                                 options={mobx.toJS(this.props.store.recommendStore.selectOpions)}  placeholder='' />
                                )}
                            </FormItem>


                             <FormItem {...formItemLayout} label="图片宽">
                            {getFieldDecorator('width', {
                                initialValue : this.state.files.width, 
                                rules: [{ pattern : /^[0-9]*$/, message: '请输入数值' },{ required: true, message: '请选择其中一项' }],
                              })(
                                <Input  />
                               )}
                            </FormItem>


                             <FormItem {...formItemLayout} label="图片高">
                            {getFieldDecorator('height', {
                                initialValue : this.state.files.height, 
                                rules: [{ required: true, message: '请输入数值' },{  pattern : /^[0-9]*$/, message: '请输入正确数值'    }],
                              })(
                                <Input />
                               )}
                            </FormItem>


                             <FormItem {...formItemLayout} label="最大保存条数">
                            {getFieldDecorator('max_count', {
                                initialValue : this.state.files.max_count, 
                                rules: [{ required: true, message: '请输入数值'}, {   pattern : /^[0-9]*$/,  message: '请输入正确数值' } ],
                              })(
                                <Input />
                               )}
                            </FormItem>

                          
                        
                       </Form>
                 </div>
            </Modal>                   
           </Layout.Content>)

        }


}






const RecommendList = Form.create({})(Recommendlist);

export default RecommendList;