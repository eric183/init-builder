import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Radio, Form, Modal, Select, Popconfirm, Icon } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@observer
class GroupDicsComponent extends Component {
    @computed get groupsDicsList (){
        return mobx.toJS(this.props.store.settingGroupDics.groupsDicsList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        searchVisible: false,
        title: '新增标签组',
        formdata: {},
        id: '',
        params: {
            page:1,
            limit:5
        },
        record: {}
    }
    handleClick(string,formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑标签组",id: formdata.id});
        }else {
            this.setState({
                title: "新增标签组",
                formdata: {},
                id: ''
            });
        }
        this.setState({visible: true});
    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/tags/groups-dics/${id}`);
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                this.setState({formdata: requestData.data})
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
    handleWarnChange(record){
    
        this.deletePlatform(record.id);
    }
    handleCloseModal(){
        this.setState({visible: false,searchVisible: false});
    }
    async editPlatform(object,id) {
        var requestData = await axios.put(`/api/admin/tags/groups-dics/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingGroupDics.getgroupsDicsList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/tags/groups-dics`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingGroupDics.getgroupsDicsList(params);
                this.props.store.tools.message.success("新增成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async deletePlatform(id) {
        var requestData = await axios.delete(`/api/admin/tags/groups-dics/${id}`);
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status == 204) {
                const location = this.props.location;
                const params = this.state.params;
                this.props.store.settingGroupDics.getgroupsDicsList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {

        const location = this.props.location;
        this.props.store.settingGroupDics.getgroupsDicsList(qs.parse(location.search.slice(1)));
        if(location.search){
            this.setState({params: Object.assign(this.state.params, qs.parse(location.search.slice(1)))});
        }
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        debugger;
        if(!!qs.parse(location.search.slice(1)).page){
            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.settingGroupDics.getgroupsDicsList(params);
        }
    }

    //是否搜索
    handleSearch(record) {
        this.setState({searchVisible: true,id: record.id,record});
    }
    async changeGroupDics(object) {
        object.tgd_id = this.state.id;
        object.group_id = this.state.params.group_id;
        var requestData = await axios.get(`/api/admin/tags/groups-dics-search`, {params:object});
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                this.props.store.settingGroupDics.getgroupsDicsList(qs.parse(this.props.location.search.slice(1)));
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    render(){
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            pageSizeOptions:['10', '20', '30', '40'],
            total: Number(this.props.store.settingGroupDics.count),
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
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增标签</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                           title: '编号',
                           dataIndex: 'id',
                           width: 80,
                        }, {
                            title: '字典名称',
                            dataIndex: 'title',
                            width: 200,
                            // render: (text, record) => ( <a href={`#setting/label?group_id=${record.id}`}>{text}</a>)
                        }, {
                            title: '字典标识',
                            width: 200,
                            dataIndex: 'name',
                        },{
                            title: '数组类型',
                            width: 100,
                            dataIndex: 'typeof',
                        },{
                            title: '验证规则',
                            dataIndex: 'validate',
                            width: 100,
                        },{
                            title: '字段长度',
                            dataIndex: 'strlen',
                            width: 100,
                        },{
                            title: '默认值',
                            dataIndex: 'default',
                            width: 100,
                        },{
                            title: '联动',
                            dataIndex: 'is_cascade',
                            width: 100,
                            render: text =>(text ? "是":"否")
                        },{
                            title: '描述',
                            dataIndex: 'desc',
                            width: 250,
                        },{
                            title:this.state.params.group_id ? "搜索": "",
                            dataIndex: 'is_search',
                            width: 100,
                            render: text =>(this.state.params.group_id ? (text ? <Icon type="check-circle" style={{color: "ersd"}} />:<Icon type="close-circle" />): "")
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                   
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>[编辑]</a>
                                    {
                                        this.state.params.group_id ? <a href="javascript:;" onClick={this.handleSearch.bind(this,record)}>[是否搜索]</a> : ""
                                    }
                                    <Popconfirm title="确定删除该标签组?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">[删除]</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.groupsDicsList} 
                        pagination={ pagination }
                        scroll={{ y: 450 }}/>
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editPlatform={this.editPlatform.bind(this)}
                    addPlatform={this.addPlatform.bind(this)}  />
                <ModalRadioTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    changeGroupDics={this.changeGroupDics.bind(this)} />
            </Layout.Content>
        )
    }
}
export default GroupDicsComponent;

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
                        label="字典名称">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input maxLength={50}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="字典标识">
                        {getFieldDecorator('name', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="数据类型">
                        {getFieldDecorator('typeof', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.typeof
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('sort', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.sort
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="默认值">
                        {getFieldDecorator('default', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.default
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="字段长度">
                        {getFieldDecorator('strlen', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.strlen
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="验证规则">
                        {getFieldDecorator('validate', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.validate
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="联动">
                        {getFieldDecorator('is_cascade', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.is_cascade
                        })(
                            <RadioGroup>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('desc', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.desc
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 3 }}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ModalTemplate = Form.create({})(ModalTemplate);


//是否可搜索
class ModalRadioTemplate extends React.Component {
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
                this.props.changeGroupDics(values);
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
                title="是否搜索"
                visible={this.props.searchVisible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}>
                <Form className="_platform" onSubmit={this.handleOk.bind(this)}>
                    <FormItem {...formItemLayout} label="是否可搜索">
                        {getFieldDecorator('is_search', {
                            rules: [{required: true}],
                            initialValue: this.props.record.is_search || 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    
                </Form>
            </Modal>
        )
    }
}

ModalRadioTemplate = Form.create({})(ModalRadioTemplate);