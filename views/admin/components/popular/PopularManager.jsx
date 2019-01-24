import React , { Component }  from 'react';
import { Layout,Icon,Menu,Table,Dropdown, Modal, Form, Input,Radio, Button, Row, Col } from 'antd';
import {observer} from 'mobx-react';
import qs from 'qs';
import $http from 'axios';
import * as mobx from 'mobx';
import { list } from 'postcss';
const FormItem = Form.Item;
const RadioGroup = Radio.Group
const TextArea = Input.TextArea; 

@observer
 class Popularmanager extends Component {
        constructor(props){
            super(props);
            this.state = {
                visible : false,
                loading : false,
                rowId : '',
                addType : '',
                title: '',
                interpretation_type: undefined,
                name: ''
            }
        }


    addAction = (type,record) => {
          if(type == 'edit'){
              this.setState({
                visible : true , 
                addType : type ,
                title: record.title, 
                name: record.name,       
                interpretation_type: record.expands.interpretation_type,
                rowId : record.id   
                })
          }else{
               this.setState({ visible : true , addType : type }); 
          }
    }

   
    handleOk = () => { this.handleSubmit() }

    handleCancel = () => {    
        this.props.form.resetFields();
        if(this.state.addType == 'edit'){
            this.setState({ 
                    visible : false, 
                    loading : false ,
                    addType : '',
                    title: '', 
                    name: '',       
                    interpretation_type: undefined,
                    rowId : ''      
                });
        }else{
             this.setState({
                  visible : false, 
                  loading : false 
             })
        }
      
      }


    handleSubmit = (id = '') => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                     if(this.state.addType == 'add'){
                                  //   this.props.store.PopularStore.addListItem(values,() => {  
                                        //    this.props.form.resetFields() 
                                    //          this.setState({ visible : false, loading : false , addType : ''  });
                                    //    });
                     }else{

                            // this.props.store.PopularStore.editItem(this.state.rowId,values,() => {
                            //        this.props.form.resetFields();
                            //        this.setState({ visible : false, 
                                                    //   loading : false ,
                                                    //    addType : '',
                                                    //    title: '', 
                                                    //    name: '',       
                                                    //    interpretation_type: undefined      
                                                    //  });
                            // })
                     }
                }
                
            });


    }

   
    componentWillMount(){
         //  this.props.store.PopularStore.getListData();  获取列表数据
    }


    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
      /*通用处理antd导致的声明周期钩子调用BUG Begin*/
      if( (preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) && this.state.forbidReload) return;
      /* End*/
     this.setState({ forbidReload : true });
     const params = qs.parse(location.search.slice(1));

    //  if(params.current_page){
    //           this.setState({ current_page : params.current_page ,per_page : params.per_page })
    //           this.props.store.HomepageStore.requestList(params);
    // }else{
    //         this.props.store.HomepageStore.requestList();
    // }

}


    render(){

        const { title, name, interpretation_type } = this.state;
        const listData = mobx.toJS(this.props.store.PopularStore.listData);
        const count = listData.length;
        const { getFieldDecorator } = this.props.form;

         const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 },
            },
          };

        return (
            <Layout.Content className="popular-layout">
                  <Row style={{ marginBottom : '20px' }}><Col span={24} > <Button type="primary" onClick={ () => { this.addAction('add') }  } >添加</Button> </Col></Row>
                  <Table columns={[
                         {
                            title: '顺序编号',
                            dataIndex: 'app_id',
                            width : '20%'
                         },
                         {
                            title: '解读内容',
                            dataIndex: 'title',
                            width : '20%'
                         },{
                            title: '解读类型',
                            dataIndex: 'expands.interpretation_type',
                            width : '20%'
                         },
                         {
                            title: '发布状态',
                            dataIndex: 'disabled',
                            width : '15%',
                            render: text => <i style={{ color : text ? 'red' : 'black', fontStyle : 'normal' }}>{text}</i>,
                         },
                         {
                            title: '操作',
                            width : '25%',
                            render: (text,record) => (
                                <div className="button-box">
                                    <Button >{ record.expands.interpretation_type }</Button> 
                                    <Button onClick={ () => { this.addAction('edit',record) }}>属性</Button> 
                                   <Button>{  record.disabled == '1' ? '回收' : '发布' } </Button>    {/*   发布状态 0未发布 1发布 */}
                                    <Button type="danger" >删除</Button> 
                                </div>
                              
                            ),
                         }
                  ]} 
                        dataSource={ listData }
                        rowKey={'id'}
                        />

                    <Modal
                          width={500}
                          title=""
                          visible={this.state.visible} 
                          onOk={this.handleOk} 
                          onCancel={this.handleCancel}
                          footer={[
                            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>下一步</Button>
                          ]}
                        > 
                        <Form onSubmit={ this.handleSubmit }>

            

                            <FormItem { ...formItemLayout } label="解读内容">
                                    {getFieldDecorator('title', {
                                           initialValue : title,
                                            rules: [{
                                                required: true, 
                                                message: '请输入解读内容！',
                                            }],
                                        })(
                                             <Input />
                                        )}
                               
                            </FormItem>

                            <FormItem { ...formItemLayout } label="解读类型">
                                 {getFieldDecorator('expands.interpretation_type', {
                                          initialValue : interpretation_type,
                                            rules: [{
                                                required: true, 
                                                message: '请选择解读类型！',
                                            }],
                                        })(
                                            <RadioGroup>
                                            <Radio value="廓形">廓形</Radio>
                                            <Radio value="细形">细形</Radio>
                                           </RadioGroup>
                                        )}          
                            </FormItem>

                            <FormItem label="文字解读">
                                 {getFieldDecorator('name', {
                                           initialValue : name,
                                            rules: [{
                                                required: true, 
                                                message: '请输入文字解读！',
                                            }],
                                        })(
                                            <TextArea rows={4} width={ 500 } style={{ resize : 'none' }} />
                                        )}          
                            </FormItem>

                        </Form>
                    </Modal>

             </Layout.Content>
        )
    }

}


const PopularManager = Form.create()(Popularmanager);

export default PopularManager;