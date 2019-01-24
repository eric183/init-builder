import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Divider, Form, Modal, Radio, Select, Checkbox, Row, Col, Popconfirm } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;

@observer
class NoticeTemplateComponent extends Component {
    @computed get noticeList (){
        return mobx.toJS(this.props.store.noticeTemplate.templateList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增模板',
        formdata: {},
        id: '',
        params: {
            page:1,
            limit: 5
        },
    }
    handleClick(string,formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑模板",id: formdata.id});
        }else {
            this.setState({
                title: "新增模板",
                formdata: {},
                id: ''
            });
        }
        this.setState({visible: true});
    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/notice/manages/${id}`);
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
        var requestData = await axios.put(`/api/admin/notice/manages/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.noticeTemplate.getNoticeTemplateList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/notice/manages`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.noticeTemplate.getNoticeTemplateList(params); 
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
        var requestData = await axios.delete(`/api/admin/notice/manages/${id}`);
        
        runInAction(()=> {
            if(requestData.status == 204) {
                const location = this.props.location;
                const params = this.state.params;
                this.props.store.noticeTemplate.getNoticeTemplateList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {
        //有缓存则不请求
        this.props.store.noticeTemplate.getNoticeTemplateList(qs.parse(this.props.location.search.slice(1)));
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(location.search){
            const params = qs.parse(location.search.slice(1));
            this.props.store.noticeTemplate.getNoticeTemplateList(params);
        }
    }
    render(){
        const pagination = {
            current: this.state.params.page,
            showQuickJumper: true,
            showSizeChanger: false,
            total: Number(this.props.store.noticeTemplate.count),
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
            <Layout.Content className="setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '模板标识',
                            dataIndex: 'name',
                            render: (text, record) => ( <a href={`#notice/notice_template/notice_manage?nm_id=${record.id}`}>{text}</a>)
                        }, {
                            title: '模板名称',
                            dataIndex: 'title',
                        },{
                            title: '创建时间',
                            dataIndex: 'created_at',
                        },{
                            title: '修改时间',
                            dataIndex: 'updated_at',
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>编辑</a>
                                    <Popconfirm title="确定删除该模板?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.noticeList} 
                        pagination={pagination}
                        scroll={{ y: 450 }} 
                    />
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
export default NoticeTemplateComponent;

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
                    this.props.editPlatform(values,this.props.id);
                }else {
                    this.props.addPlatform(values);
                }
                this.props.handleCloseModal();
                this.props.form.resetFields();
            }
        });
        // this.props.form.resetFields();
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
                        label="模板标识">
                        {getFieldDecorator('name', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.name
                        })(
                            <Input maxLength={20}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="模板描述">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 3 }} maxLength={50} placeholder="请输入模板描述"/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}


ModalTemplate = Form.create({})(ModalTemplate);
