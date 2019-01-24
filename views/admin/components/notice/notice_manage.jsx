import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Divider, Form, Modal, Radio, Select, Checkbox, Row, Col, Popconfirm } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@observer
class NoticeComponent extends Component {
    @computed get noticeList (){
        return mobx.toJS(this.props.store.noticeManage.noticeList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增通知',
        formdata: {},
        id: '',
        params: {
            page:1,
            limit: 5
        },
    }
    // handleSorteChange(i,1sd){

    // }
    handleClick(string, formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑通知",id: formdata.id});
        }else {
            this.setState({
                title: "新增通知",
                formdata: {}
            });
        }
        this.setState({visible: true});
    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/notice/templates/${id}`);
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                this.setState({formdata: requestData.data})
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    }
    handleCloseModal(){
        this.setState({visible: false});
    }
    async editPlatform(object,id) {
        var requestData = await axios.put(`/api/admin/notice/templates/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.noticeManage.getNoticeList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/notice/templates`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.noticeManage.getNoticeList(params);
                this.props.store.tools.message.success("新增成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    handleWarnChange(record){
        this.deletePlatform(record.id);
    }
    async deletePlatform(id) {
        var requestData = await axios.delete(`/api/admin/notice/templates/${id}`);
        
        runInAction(()=> {
            if(requestData.status == 204) {
                const location = this.props.location;
                const params = this.state.params;
                this.props.store.noticeManage.getNoticeList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {
        const location = this.props.location;
        // if(!qs.parse(location.search.slice(1)).page) {
            const params = qs.parse(qs.parse(location.search.slice(1)).page ? qs.parse(location.search.slice(1)) : Object.assign(qs.parse(location.search.slice(1)),this.state.params));
            this.setState({params});
            this.props.store.noticeManage.getNoticeList(params);
            // this.props.store.noticeManage.getNoticeCreate();
        // }
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(!!qs.parse(location.search.slice(1)).page){
            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.noticeManage.getNoticeList(params);
        }
    }
    render(){
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: false,
            total: Number(this.props.store.noticeManage.count),
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
            
        }
        return (
            <Layout.Content className="common-content setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '通知标题',
                            dataIndex: 'title',
                        }, {
                            title: '通知内容',
                            dataIndex: 'body',
                        },{
                            title: '语言',
                            dataIndex: 'lang_data',
                            render:(text) =>(!!text ? text.name:"")
                        },{
                            title: '通知类型',
                            dataIndex: 'cascade_data',
                            render:(text) =>(!!text ? text.name:"")
                        },{
                            title: '激活/未激活',
                            dataIndex: 'active',
                            render:(text) =>(text ? "激活" : "未激活")
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>编辑</a>
                                    <Popconfirm title="确定删除该通知?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.noticeList} 
                        pagination={ pagination }
                        scroll={{ y: 450 }}/>
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editPlatform={this.editPlatform.bind(this)}
                    addPlatform={this.addPlatform.bind(this)}  />
            </Layout.Content>
        )
    }
}
export default NoticeComponent;

class ModalTemplate extends React.Component {
    constructor(props){
        super(props);
    }

    handleCancel(){
        this.props.handleCloseModal();
        this.props.form.resetFields();
    }
    handleOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                if(this.props.id){
                    this.props.editPlatform(Object.assign(values, {nm_id: this.props.params.nm_id}),this.props.id);
                }else {
                    this.props.addPlatform(Object.assign(values, {nm_id: this.props.params.nm_id}));
                }
                this.props.handleCloseModal();
                this.props.form.resetFields();
            }
        });
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

       const { getFieldDecorator } = this.props.form;

        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}>
                <Form className="_platform" onSubmit={this.handleOk.bind(this)}>
                <FormItem
                        {...formItemLayout}
                        label="通知标题">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input maxLength={50}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知内容">
                        {getFieldDecorator('body', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.body
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 3 }} maxLength={255} placeholder="请输入通知内容"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="通知类型">
                        {getFieldDecorator('nt_code', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.nt_code
                        })(
                            <Select>
                                {
                                    mobx.toJS(this.props.store.noticeManage.nt_list).map((value,index) => {
                                        return (
                                            <Option value={value.code}>{value.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="语言">
                        {getFieldDecorator('lang_code', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.lang_code
                        })(
                            <Select>
                                {
                                    mobx.toJS(this.props.store.noticeManage.lang_list).map((value,index) => {
                                        return (
                                            <Option value={value.code}>{value.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="激活">
                        {getFieldDecorator('active', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.active
                        })(
                            <RadioGroup>
                                <Radio value={0}>未激活</Radio>
                                <Radio value={1}>激活</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}


ModalTemplate = Form.create({})(ModalTemplate);
