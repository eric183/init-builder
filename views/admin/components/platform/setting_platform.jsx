import React , { Component }  from 'react';
import { Layout, Input, Button, Table, Divider, Icon, Form, Modal, Radio, Upload, Popconfirm } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;

@observer
class SettingNodeComponent extends Component {
    @computed get platformList() {
        return mobx.toJS(this.props.store.settingPlatform.platformList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增平台',
        formdata: {},
        id: '',
        params: {
            page:1,
            limit:5
        },
    }
    handleSearch(value) {
        const params = this.state.params;
        params.title = value;
        this.props.store.settingPlatform.getPlatformList(params);
    }
    handleClick(string,formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑平台",id: formdata.id});
        }else {
            this.setState({
                title: "新增平台",
                formdata: {},
                id: ''
            });
        }
        this.setState({visible: true});
    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/apps/${id}`);
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                this.setState({formdata: requestData.data});
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
    handleCloseModal(){
        this.setState({visible: false, id:''});
    }
    async editPlatform(object,id) {
        var requestData = await axios.put(`/api/admin/apps/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingPlatform.getPlatformList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/apps`, object);
        requestData = requestData.data;
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingPlatform.getPlatformList(params);
                this.props.store.tools.message.success("添加成功！");      
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    handleWarnChange(record){
      
        this.deletePlatform(record.id);
    }
    async deletePlatform(id) {
        var requestData = await axios.delete(`/api/admin/apps/${id}`);
        runInAction(()=> {
            
            if(requestData.status == 204) {
                const location = this.props.location;
                const params = this.state.params;
                this.props.store.settingPlatform.getPlatformList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {
        this.props.store.settingPlatform.getPlatformList(qs.parse(this.props.location.search.slice(1)));
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(location.search){
            const params = qs.parse(location.search.slice(1));
            this.props.store.settingPlatform.getPlatformList(params);
        }
    }
    render(){
        const pagination = {
            current: this.state.params.page,
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: false,
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
        }
        return (
            <Layout.Content className="setting_platform">
                <div className="operation-menu">
                    <div className="search-bar">
                        <Input.Search 
                            placeholder="请输入平台名称"
                            onSearch={value => this.handleSearch(value)}
                            style={{width: 300}}
                            enterButton/>
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '序号',
                            dataIndex: 'index',
                            width:80,
                            render:(text,row,index)=>(index+1)
                        }, {
                            title: '平台名称',
                            dataIndex: 'name',
                            width: 120
                        },{
                            title: '标识',
                            dataIndex: 'code',
                            width: 100
                        },{
                            title: '平台地址',
                            dataIndex: 'link',
                            render: text => <a href={text ? text : "javascript:;"}>{text}</a>,
                            width: 200
                        },{
                            title: '网站标题',
                            dataIndex: 'title',
                            width: 100
                        },{
                            title: '关键词',
                            dataIndex: 'keywords',
                            width: 220,
                            // render: text => <p style={{height:'45px',overflowY  :"auto"}}>{text}</p>,
                        },{
                            title: '描述',
                            dataIndex: 'descript',
                            width: 250,
                            render: text => <p style={{height:'45px',overflowY  :"auto"}}>{text}</p>,
                        },{
                            title: '版权信息',
                            dataIndex: 'copyright',
                            width: 100
                        },{
                            title: '语言',
                            dataIndex: 'language',
                            width: 80,
                            render: text => (text ? "中文":"英文"),
                        },{
                            title: '内部平台',
                            dataIndex: 'is_private',
                            width: 90,
                            render: text => (text ? "是":"否"),
                        }, {
                            title: '状态',
                            dataIndex: 'disabled',
                            width: 80,
                            render: (text,row,index)=>{
                                if(text == 0) {
                                    return (<span style={{color: 'red'}}>禁用</span>)
                                }else{
                                    return (<span>启用</span>)
                                }
                            },
                        }, {
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>编辑</a>
                                    <Popconfirm title="确定删除该平台?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        scroll={{ y: 550 }}
                        dataSource={this.platformList}
                        pagination={ pagination }/>
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editPlatform={this.editPlatform.bind(this)}
                    addPlatform={this.addPlatform.bind(this)} />
            </Layout.Content>
        )
    }

}
export default SettingNodeComponent;



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
                        label="平台名称">
                        {getFieldDecorator('name', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="标识">
                        {getFieldDecorator('code', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.code
                            
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="平台地址">
                        {getFieldDecorator('link', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.link
                        })(
                            <Input />
                        )}
                    </FormItem>
                    {/* <FormItem {...formItemLayout} label="ICON">
                        {getFieldDecorator('username3', {
                            rules: [{required: true}],

                        })(
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Icon type="upload"/><a href="javascript:;">上传ICON</a>
                            </Upload>
                        )}
                    </FormItem> */}
                    <FormItem {...formItemLayout} label="网站标题">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关键词">
                        {getFieldDecorator('keywords', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.keywords
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="描述">
                        {getFieldDecorator('descript', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.descript
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="版权信息">
                        {getFieldDecorator('copyright', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.copyright
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="语言">
                        {getFieldDecorator('language',{
                            initialValue: this.props.formdata.language
                        })(
                            <Radio.Group>
                                <Radio value={0}>英文</Radio>
                                <Radio value={1}>中文</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="内部平台">
                        {getFieldDecorator('is_private',{
                            initialValue: this.props.formdata.is_private
                        })(
                            <Radio.Group>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="状态">
                        {getFieldDecorator('disabled',{
                            initialValue: this.props.formdata.disabled
                        })(
                            <Radio.Group>
                                <Radio value={0}>禁用</Radio>
                                <Radio value={1}>启用</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('sort',{
                            initialValue: this.props.formdata.sort || 0
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}
ModalTemplate = Form.create({})(ModalTemplate);