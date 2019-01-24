import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Divider,Icon , Form, Modal, Radio, Select, Checkbox, Row, Col, Popconfirm } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;



@observer
class UserComponent extends Component {
    @computed get userList (){
        return mobx.toJS(this.props.store.settingUser.userList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        params: {
            page:1,
            limit:10
        },
    }

    userEditorComponent = {};

    onref = (child) => {   
           this.userEditorComponent = child 
     }


    handleWarnChange(record){
        this.deletePlatform(record.id);
    }


    async deletePlatform(id) {

        var requestData = await axios.delete(`/api/admin/notice/templates/${id}`);

        console.log(requestData);
        
        // runInAction(()=> {
        //     this.props.store.tools.nprogress.done();
        //     if(requestData.status == 204) {
        //         const location = this.props.location;
        //         const params = this.state.params;
        //         params.page =  1;
        //         var qsInfo = this.props.util.setQsInfo(params);
        //         this.props.history.push(`${location.pathname}?${qsInfo}`);
        //         this.props.store.tools.message.success("删除成功！");
        //     } else {
        //         this.props.store.tools.message.error(requestData.message);
        //     }
        // })


    }
    componentDidMount() {

        this.userList.length == 0 ? 
        this.props.store.settingUser.getUserList(qs.parse(this.props.location.search.slice(1))) : 
        this.props.store.settingUser.refillDefaultList();
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(!!qs.parse(location.search.slice(1)).page){
            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.settingUser.getUserList(params);
        }
    }
    render(){
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: true,
            // total: Number(this.props.store.supperTemp.count),
            showTotal: function(total,pageSize){
                return `共${total}条`
            },
            onChange:(pageNumber) => {
                const params = this.state.params;
                params.page = pageNumber;
                this.setState({params});
                const location = this.props.location;
                var qsInfo = this.props.util.setQsInfo(params);
                this.props.history.push(`${location.pathname}?${qsInfo}`);
            },
            onShowSizeChange: (current,pageSize) => {
                const params = this.state.params;
                params.page = 1;
                params.limit = pageSize;
                this.setState({params});
                const location = this.props.location;
                var qsInfo = this.props.util.setQsInfo(params);
                this.props.history.push(`${location.pathname}?${qsInfo}`);
            }
        }



        return (
            <Layout.Content className="setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={ () => {  this.userEditorComponent.userEditor_visiable(true) } } >新增用户</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '序号',
                            dataIndex: 'index',
                            render:(text,record,index) =>(index+1)
                        },{
                            title: '用户头像',
                            dataIndex: 'avatar',
                            render:(text) =>(
                                <img className="_avatar" src={text} alt=""/>
                            )
                        }, {
                            title: '账号',
                            dataIndex: 'username',
                        }, {
                            title: '昵称',
                            dataIndex: 'nickname',
                        },{
                            title: '邮箱',
                            dataIndex: 'email',
                        },{
                            title: '手机',
                            dataIndex: 'mobile',
                        },{
                            title: '积分',
                            dataIndex: 'integral',
                        },{
                            title: '等级',
                            dataIndex: 'level',
                        },{
                            title: '注册IP',
                            dataIndex: 'register_ip',
                        },{
                            title: '登录次数',
                            dataIndex: 'login_count',
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={ () => {  this.userEditorComponent.editedAction(record)  } } >编辑</a>
                                    <Popconfirm title="确定删除该用户?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.userList} 
                        pagination={ pagination }/>
                </div>

               <UserEditorComponent onRef={ this.onref }  {...this.props}  />

            </Layout.Content>
        )
    }
}
export default UserComponent;



class userEditor_component extends Component {
         state = {
            visiable : false,
            isEdited : false,
            userId : '',
            loading : false,
            userinfo : {
                username : '',
                nickname : '',
                email : '',
                mobile : '',
                country_code : ''
            }
         }


        componentWillMount(){  this.props.onRef(this) }

       userEditor_visiable = (state) => {   this.setState({ visiable : state }) }

       addItemAction =() =>{ }


      editedAction = (record) => {
            let { id, mobile, nickname, username, country_code,  email } = record,
               userinfo = { mobile, nickname, username, country_code, email  };

               this.setState({ userId : id, userinfo : userinfo , isEdited : true }, () => {  this.userEditor_visiable(true)  });
      }


    reloadAction = () => {
        let  { pathname, search } = this.props.location,
               params = qs.parse(search.slice(1));
               params.page ? '' : params.page = 1;
               params.limit ? '' :  params.limit = 10;
               var qsInfo = this.props.util.setQsInfo(params);
             this.props.history.push(`${pathname}?${qsInfo}`);
    }


         handleOk = () => {
            this.props.form.validateFieldsAndScroll((err, values) => {
                 if (!err) {
                    this.setState({ loading : true })
                    this.state.isEdited ? this.props.store.settingUser.userInfor_edite(this.state.userId,values, () => {   
                        this.handleCancel();
                        this.reloadAction();
                      }) 
                        :  this.props.store.settingUser.userInfor_add(values, () => {   
                            this.handleCancel();
                            this.reloadAction();
                          });
                 }
              })
         }

        
     handleCancel = () => {
            this.props.form.resetFields();
            this.setState({ userId : '', loading : false, isEdited : false, visiable : false , userinfo : { username : '',  email : '', mobile : '', country_code : '' } });
         }


     render(){

         let { visiable, userinfo,loading } = this.state;
         const { getFieldDecorator } = this.props.form;
         const formItemLayout = {
                        labelCol: {
                        xs: { span: 24 },
                        sm: { span: 5 },
                        },
                        wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 16 },
                        }
                    };
            
           return (
                 <Modal
                    title="信息编辑"
                    visible={  visiable  } 
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type="primary" key="submit" loading={loading} onClick={ this.handleOk }> 提交 </Button>
                      ]}
                    >
                    <Row>
                        <Col span={ 24 }>
                        <Form className="usereditor-form">
                        
                             <FormItem { ...formItemLayout } label="用户名" >
                                {getFieldDecorator('username', {
                                     initialValue : userinfo.username,
                                    rules: [{ required: true, message: '请输入用户名！' }],
                                })(
                                 <Input  placeholder="用户名" type="text"  />
                                )}
                                </FormItem>

                               <FormItem { ...formItemLayout } label="昵称" >
                                {getFieldDecorator('nickname', {
                                     initialValue : userinfo.nickname,
                                    rules: [{ required: true, message: '请输入昵称！' }],
                                })(
                                 <Input  placeholder="昵称" type="text"  />
                                )}
                                </FormItem>

                              <FormItem { ...formItemLayout } label="邮箱" >
                                {getFieldDecorator('email',{ initialValue : userinfo.email })(
                                    <Input placeholder="邮箱"   />
                                )}
                                </FormItem>


                             <FormItem { ...formItemLayout }  label="手机号" >
                                {getFieldDecorator('mobile', {
                                     initialValue : userinfo.mobile,
                                    rules: [{ required: true, pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确手机!' }],
                                })(
                                    <Input placeholder="手机号"  />
                                )}
                                </FormItem>

                                <FormItem { ...formItemLayout }  label="区号"  >
                                {getFieldDecorator('country_code',{ initialValue : userinfo.country_code || '86',
                                    rules: [{ required: true, pattern:/^[0-9]*$/, message: '请输入正确区号!' }, { max : 3, message: '长度不能小于3位！' }]
                                 })(   
                                    <Input  placeholder="区号"  />
                                )}
                                </FormItem>


                                <FormItem { ...formItemLayout }  label="密码" >
                                {getFieldDecorator('password', {
                                    initialValue : undefined,
                                    rules: [{ required: true, message: '请输入密码！' }, { min : 6, message: '密码长度不能小于8位！' } ],
                                })(
                                     <Input  type="password" placeholder="密码"   autoComplete="new-password" />
                                )}
                                </FormItem>

                            </Form>
                        </Col>
                    </Row>
                </Modal>
           )
     }
}


const UserEditorComponent = Form.create()(userEditor_component);