import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Checkbox, Form, Modal, Select, Popconfirm, Upload, Icon, Radio } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@observer
class LabelGroupComponent extends Component {
    @computed get labelGroupList (){
        return mobx.toJS(this.props.store.settingLabelGroup.labelGroupList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增标签组',
        formdata: {},
        id: '',
        params: {
            page:1,
            limit: 5
        },
        checkboxData: []
    }
    handleClick(string,formdata){
        this.getCheckboxData();
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
        var requestData = await axios.get(`/api/admin/tags/groups/${id}`);
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
        this.setState({visible: false});
    }
    async editPlatform(object,id) {
        var requestData = await axios.put(`/api/admin/tags/groups/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabelGroup.getLabelGroupList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/tags/groups`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const location = this.props.location;
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabelGroup.getLabelGroupList(params);
                this.props.store.tools.message.success("新增成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }

    async getCheckboxData() {
        var requestData = await axios.get(`/api/admin/tags/groups-dics`,{params: {is_page: 0}});
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
               this.setState({checkboxData: requestData.data});
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    handleWarnChange(record){
        this.deletePlatform(record.id);
      
       
    }
    async deletePlatform(id) {
        var requestData = await axios.delete(`/api/admin/tags/groups/${id}`);
        requestData = requestData.data;
        runInAction(()=> {
            this.props.store.tools.nprogress.done();
            if(requestData.status_code == 204) {
                const location = this.props.location;
                const params = this.state.params;
                this.props.store.settingLabelGroup.getLabelGroupList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {

        const location = this.props.location;
        this.props.store.settingLabelGroup.getLabelGroupList(qs.parse(location.search.slice(1)));
    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        if(!!qs.parse(location.search.slice(1)).page){
            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.settingLabelGroup.getLabelGroupList(params);
        }
    }
    render(){
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: false,
            // total: Number(this.props.store.settingLabelGroup.count),
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
                        <Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增标签组</Button>
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '编号',
                            dataIndex: 'id',
                            width: 80,
                        }, {
                            title: '标签组名称',
                            dataIndex: 'title',
                            width: 150,
                            render: (text, record) => ( <a href={`#setting/label?group_id=${record.id}&pid=0`}>{text}</a>)
                        }, {
                            title: '标签组标识',
                            width: 150,
                            dataIndex: 'name',
                        },{
                            title: '简介',
                            width: 250,
                            dataIndex: 'summary',
                        },{
                            title: 'Logo',
                            dataIndex: 'logo',
                            width: 100,
                            render: text => <img src={text} style={{width: "35px"}}/>, 
                        },{
                            title: '类型',
                            dataIndex: 'type',
                            width: 100,
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>编辑</a>
                                    <a href={`#setting/group_dics?group_id=${record.id}`}>查看字典</a>
                                    <Popconfirm title="确定删除该标签组?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">删除</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.labelGroupList} 
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
export default LabelGroupComponent;

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
                    values.logo = "";
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
                        label="标签组名称">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input maxLength={50}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="标签组标识">
                        {getFieldDecorator('name', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="logo">
                        {getFieldDecorator('logo', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.logo
                        })(
                            <Upload name="logo" action="/api/uploads" listType="picture">
                                <Icon type="upload"/><a href="javascript:;">上传ICON</a>
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="简介">
                        {getFieldDecorator('summary', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.summary
                        })(
                            <Input.TextArea autosize={{ minRows: 2, maxRows: 3 }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="数据类型">
                        {getFieldDecorator('type', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.type
                        })(
                            <Select>
                                <Option value="select">select</Option>
                                <Option value="checkbox">checkbox</Option>
                                <Option value="select-asyn">select-asyn</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="显示类型">
                        {getFieldDecorator('display_type', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.display_type
                        })(
                            <RadioGroup>
                                <Radio value={"title"}>中文</Radio>
                                <Radio value={"title_en"}>英文</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="是否联动">
                        {getFieldDecorator('is_tree', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.is_tree
                        })(
                            <RadioGroup>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="关联字典">
                        {getFieldDecorator('dictionarys', {
                            rules: [{required: true, type: "array"}],
                            initialValue: this.props.formdata.dictionarys
                        })(
                            <Checkbox.Group style={{ width: '100%' }}>
                                {
                                    this.props.checkboxData.map((item,key) => {
                                        return (
                                            <Checkbox value={item.id} key={key}>{item.title}</Checkbox>
                                        )
                                    })    
                                }
                                
                            </Checkbox.Group>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ModalTemplate = Form.create({})(ModalTemplate);
