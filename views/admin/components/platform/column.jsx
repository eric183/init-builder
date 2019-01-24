import React , { Component }  from 'react';
import { Layout, Input, Button, Table, Select, Form, Modal, Popconfirm, Upload, Icon } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;


import AssoLabel from "./assoLabel";

@observer
class settingColumnComponent extends Component {
    @computed get columnList() {
        return mobx.toJS(this.props.store.settingColumn.columnList);
    }
    @computed get platfromList() {
        return mobx.toJS(this.props.store.settingColumn.platfromList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增栏目',
        formdata: {
            logo:[]
        },
        id: '',
        params: {
            page:1,
            limit: 5
        },
        labelVisible: false
    }
    handleClick(string,formdata){
        this.props.store.settingColumn.getPlatfromList();
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑栏目",id: formdata.id});
        }else {
            this.setState({
                title: "新增栏目",
                formdata: {logo:[]},
                id: ''
            });
        }
        this.setState({visible: true});
    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/columns/${id}`);
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                if(requestData.data.logo){
                    const obj = {};
                    obj.uid = 1;
                    obj.url = requestData.data.logo;
                    requestData.data.logo = [];
                    requestData.data.logo.push(obj);
                }
                this.setState({formdata: requestData.data});
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
    handleCloseModal(){
        this.setState({visible: false, id:'',labelVisible: false});
    }
    async editColumn(object,id) {
        var requestData = await axios.put(`/api/admin/columns/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const params = qs.parse(this.props.location.search.slice(1));
                params.page =  1;
                this.props.store.settingColumn.getColumnList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addColumn(object) {
        var requestData = await axios.post(`/api/admin/columns`, object);
        requestData = requestData.data;
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const params = qs.parse(this.props.location.search.slice(1));
                params.page =  1;
                this.props.store.settingColumn.getColumnList(params);
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
        var requestData = await axios.delete(`/api/admin/columns/${id}`);
        runInAction(()=> {
            
            if(requestData.status == 204) {
                const params = qs.parse(this.props.location.search.slice(1));
                this.props.store.settingColumn.getColumnList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {
        if(this.props.location.search){
            this.setState({params: qs.parse(this.props.location.search.slice(1))});
        }
        this.props.store.settingColumn.getColumnList(qs.parse(this.props.location.search.slice(1)))
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(location.search){
            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.settingColumn.getColumnList(params);
        }
    }
    handleSetstate(value) {
        this.state.formdata.logo = value;
        this.setState({formdata:  this.state.formdata});
    }
    //关联标签组
    handleLabelGroup(record){
        this.setState({labelVisible: true, id: record.id});
        this.props.store.settingColumn.getAssoLabelList(record.id);
    }
    render(){
        const pagination = {
            current: this.state.params.page,
            pageSize:this.state.params.limit,
            showQuickJumper: true,
            showSizeChanger: false,
            total: Number(this.props.store.settingColumn.count),
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
                        {/* <Input.Search 
                            placeholder="请输入栏目名称"
                            onSearch={value => this.handleSearch(value)}
                            style={{width: 300}}
                            enterButton/> */}
                    </div>
                    <div className="button-bar">
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '编号',
                            dataIndex: 'id',
                            width:80,
                        }, {
                            title: '栏目名称',
                            dataIndex: 'title',
                            width: 120,
                            render: (text,record) => <a href={`#setting-platform/column?pid=${record.id}`}>{text}</a>,
                        },{
                            title: '栏目英文名',
                            dataIndex: 'title_en',
                            width: 140
                        },{
                            title: '栏目拼音',
                            dataIndex: 'pinyin',
                            width: 120
                        },{
                            title: 'logo',
                            dataIndex: 'logo',
                            width: 100,
                            render: text => <img src={text} style={{width: "35px"}}/>, 
                            
                        },{
                            title: '关键词',
                            dataIndex: 'keywords',
                            width: 220,
                            render: text => <p style={{height:'45px',overflowY  :"auto"}}>{text}</p>,
                        },{
                            title: '排序',
                            dataIndex: 'sort',
                            width: 100,
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>[编辑]</a>
                                    <a href="javascript:;" onClick={this.handleLabelGroup.bind(this, record)}>[关联标签组]</a>
                                    <Popconfirm title="确定删除该栏目?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">[删除]</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        scroll={{ y: 450 }}
                        dataSource={this.columnList}
                        pagination={ pagination }/>
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editColumn={this.editColumn.bind(this)}
                    addColumn={this.addColumn.bind(this)}
                    platfromList={this.platfromList}
                    handleSetstate={this.handleSetstate.bind(this)} />

                <AssoLabel 
                 {...this.props}
                 {...this.state}
                 handleCloseModal={this.handleCloseModal.bind(this)}/>
            </Layout.Content>
        )
    }

}
export default settingColumnComponent;



class ModalTemplate extends React.Component {
    constructor(props){
        super(props);
        
    }
    state = {
        loading: false,
        imgUrl: ""
    }
    handleCancel(){
        this.props.handleCloseModal();
        this.props.form.resetFields();
    }
    handleOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(!values.logo && this.props.formdata.logo.length) {
                    values.logo = this.props.formdata.logo[0].thumbUrl
                }else {
                    this.props.store.tools.message.error("logo上传不能为空！");
                    return ;
                }
                if(this.props.params.pid){
                    values.pid = this.props.params.pid;
                }
                if(this.props.id){
                    this.props.editColumn(values,this.props.id);
                }else {
                    this.props.addColumn(values);
                }
                this.props.handleCloseModal();
                this.props.form.resetFields();
            }
        });
        // this.props.form.resetFields();
    }
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = ({file,fileList}) => {
        if(file.status === "done") {
            fileList = fileList.slice(-1);
        }
        else if(file.status === "removed"){
            fileList = [];
        }
        this.props.handleSetstate(fileList);
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
                        label="栏目名称">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="英文名">
                        {getFieldDecorator('title_en', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title_en
                            
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="拼音">
                        {getFieldDecorator('pinyin', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.pinyin
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="首字母大写">
                        {getFieldDecorator('initials', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.initials
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关键词">
                        {getFieldDecorator('keywords', {
                            rules: [{required: true,type:'array'}],
                            initialValue: this.props.formdata.keywords
                        })(
                            <Select mode="tags">

                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关联平台">
                        {getFieldDecorator('app_id', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.app_id
                        })(
                            <Select>
                                {
                                   
                                    this.props.platfromList.map((item,index) => {
                                        return (
                                            <Option value={`${item.id}`} key={index}>{item.title}</Option>  
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="logo">
                        <Upload
                            action="/api/uploads"
                            className="uploader-logo"
                            listType="picture-card"
                            beforeUpload={this.beforeUpload}
                            fileList={this.props.formdata.logo}
                            showUploadList={{showPreviewIcon:false}}
                            onChange={this.handleChange}
                            >
                            {this.props.formdata.logo.length >= 1 ? null : <Icon type="plus" />}
                        </Upload>
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('sort',{
                            rules: [{required: true}],
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