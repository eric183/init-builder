import React , { Component }  from 'react';
import { Link } from 'react-router';
import { Layout, Row, Col,Form, Input, Select, Modal, Button,Icon,Table,Radio,message,Popconfirm
} from 'antd';
import {observer} from 'mobx-react';
const FormItem = Form.Item;
const RadioGroup = Radio.Group
import qs from 'qs';
import * as mobx from 'mobx';



@observer
class HomePage_recommend_manage extends Component {
      constructor(props){
            super(props);
            this.state = {
                forbidReload : true,
                visible : false,
                app_id : '',
                nav_id : '',
                addType : '',
                title : '',
                id : '',
                disabled : '',
                loading : false,
                current_page : 1,
                per_page : 50
            }
      }


    editTitle = (type,text,id) => {
         this.props.form.resetFields();
        if(type == 'new'){
            this.setState({ visible : true, addType : 'new' })
        }else{
            this.setState({ title : text,  id : id, visible : true , addType : 'add' })  
        }
    }


    handleOk = () => { 
         this.handleSubmit();
     }

    handleCancel = () => {
          this.setState({ visible : false, title : '', id : '' , addType : ''})
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
               this.setState({ loading : true });

               let { title, id, addType } = this.state;

               if(addType == 'add'){
                   this.props.store.HomepageStore.ModifyTitle( title, id, () => {
                        this.setState({ visible : false, loading : false, forbidReload : false, id : '', title : '', addType : '' });   
                        this.props.form.resetFields();
                        // 触发 componentWillReceiveProps 重新加载数据 (刷新)
                        this.props.history.push(this.props.location.pathname);

                      });

               }else{
                     this.props.store.HomepageStore.addData(values,() => {   
                            this.setState({ visible : false, loading : false, forbidReload : false, title : '',id : '', addType : ''  });   
                            this.props.form.resetFields();
                            // 触发 componentWillReceiveProps 重新加载数据 (刷新)
                            this.props.history.push(this.props.location.pathname);
                       });

               }

           }
        });
      }


  deleteRow = (id) => {
           this.props.store.HomepageStore.deleteRowAction(id, () => { 
               // 触发 componentWillReceiveProps 重新加载数据 (刷新)
                 this.setState({ forbidReload : false });
                 this.props.history.push(this.props.location.pathname);
               
               })   
      }

   changeState = (state,id) => {
            this.props.store.HomepageStore.changeState(state,id,() => {
                    // 触发 componentWillReceiveProps 重新加载数据 (刷新)
                    this.setState({ forbidReload : false });
                    this.props.history.push(this.props.location.pathname);

            })
   }


   componentDidMount(){
         this.props.store.HomepageStore.requestList();
   }

   componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
      /*通用处理antd导致的声明周期钩子调用BUG Begin*/
      if( (preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) && this.state.forbidReload) return;
      /* End*/
     this.setState({ forbidReload : true });
     const params = qs.parse(location.search.slice(1));
     if(params.current_page){
              this.setState({ current_page : params.current_page ,per_page : params.per_page })
              this.props.store.HomepageStore.requestList(params);
    }else{
            this.props.store.HomepageStore.requestList();
    }

}



      render(){

        const { current_page, per_page } = this.state;
        const { getFieldDecorator } = this.props.form;
        const listData = mobx.toJS(this.props.store.HomepageStore.ListData);
        const count = listData.length;
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
            <Layout.Content className=" homepage_rec_layout">
                   <Row style={{ marginBottom : '20px' }}>
                    <Col span={24} > 
                      <Button type="primary" 
                            style={{ width : '80px' }} 
                             onClick={ () => { this.editTitle('new')  } }>添加</Button> 
                          </Col>
                        </Row>
                  <Table columns={[
                         {
                            title: '编号',
                            dataIndex: 'app_id',
                            width : '20%'
                         },
                         {
                            title: '身型',
                            dataIndex: 'title',
                            width : '20%',
                            render: (text, record) => <span onClick={ () => { this.editTitle('edit',text,record.id)  }} style={{ display : 'block' ,cursor: 'pointer' }}>{text}</span>
                         },{
                            title: '部件数量',
                            dataIndex: 'lists_count',
                            width : '20%'
                         },
                         {
                            title: '发布状态',
                            dataIndex: 'disabled',  
                            width : '20%',
                            render: text => <i style={{ color : text == 0 ? '' : 'red', fontStyle : 'normal' }}>{ text == 0 ? '启用' : '禁用' }</i>,
                         },
                         {
                            title: '操作',
                            width : '20%',
                            render: (text,record) => (
                                <div className="button-box">
                                  <Button onClick={ () => { this.props.history.push('/setting/recommendation_manager/select_type?id=' +  record.id ) } }>内容</Button> 
                                    <Button onClick={ () => { this.changeState( record.disabled, record.id)  } } >{ record.disabled == '0' ? '回收' : '发布' }</Button> 
                                    <Popconfirm placement="top" 
                                        onConfirm={ () => { this.deleteRow(record.id)  } } 
                                        title="确定删除？" 
                                         okText="是" 
                                         cancelText="否">
                                        <Button type="danger" >删除</Button>
                                    </Popconfirm>
                                </div>
                              
                            ),
                         }
                     ]} 
                      scroll={{ y: 620 }}
                        dataSource={ listData }
                        rowKey={'id'}
                        pagination={{
                            current: current_page, 
                            pageSize: per_page,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            total : Number(count) | 0,
                        showTotal: function(total,pageSize){
                            return `共${Number(count)}条`
                        },
                        onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                             this.props.history.push( this.props.location.pathname + `?per_page=${per_page}&current_page=${pageNumber}`);
    
                        },
                        onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                               this.props.history.push( this.props.location.pathname + `?per_page=${pageSize}&current_page=${current}`);
                           }
                        }}

                        />


                <Modal
                    visible={this.state.visible}
                    title=""
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="submit" type="primary" loading={ this.state.loading } onClick={this.handleOk}> 提交 </Button>,
                    ]}
                   >
                       <Form  onSubmit={ this.handleSubmit }  >
                            <FormItem  { ...formItemLayout } label="名称">
                                {getFieldDecorator('title', {
                                    initialValue : this.state.title,
                                    rules: [{
                                        required: true, 
                                        message: '请输入名称',
                                    }],
                                })(
                                    <Input onBlur={ (e) => {  this.setState({ title : e.target.value })  } }  placeholder="请输入名称" />
                                )}
                            </FormItem>
                        </Form>
                </Modal>

              </Layout.Content>
           )
      } 
}




const HomePage_Recommend_manage = Form.create()(HomePage_recommend_manage);

export default  HomePage_Recommend_manage;