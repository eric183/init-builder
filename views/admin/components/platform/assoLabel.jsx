import React ,{ Component }  from 'react';
import { Layout, Radio, Button, Table, Select, Form, Modal, Popconfirm, Checkbox } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;



@observer
export default class AssoLabel extends Component {
    @computed get AssoLabelList() {
        return mobx.toJS(this.props.store.settingColumn.AssoLabelList);
    }
    @computed get AssoLabelGroupList() {
        return mobx.toJS(this.props.store.settingColumn.AssoLabelGroupList);
    }
    state = {
        vtitle: "新增关联标签组",
        viosible: false,
        record_id:'',
        groupdata: {
            tag_id: []
        },
        labelList:[],
        checkedList: [],
        indeterminate: false,
        checkAll: false,
        plainOptions: []
    }
    handleOk(){

    }
    handleCancel(){
        this.props.handleCloseModal();
    }
    handleClick(string,record){
        if(string == "add"){
            this.setState({vtitle: "新增关联标签组",record_id:''});
            this.props.store.settingColumn.getAssoLabelGroupList(this.props.id);
            this.setState({
                labelList:[],
                checkedList: [],
                indeterminate: false,
                checkAll: false,
                plainOptions: [],
                groupdata: {
                    tag_id: []
                },
            })
        }else {
            this.getLabelList(record.id);
            this.setState({vtitle: "编辑关联标签组",record_id: record.id});
            this.getDetail(this.props.id,record.id);
        }
        this.setState({viosible: true});
    }
    //删除
    handleWarnChange(record){
        this.deleteColumn(this.props.id, record.id);
    }

    handleCloseModale(){
        this.setState({viosible: false});
    }
    async deleteColumn(id,group_id) {
        var resquestdata = await axios.delete(`/api/admin/columns/ref-groups/${id}`,{ params:{
            group_id: group_id
        }});
        runInAction(() => {
            if(resquestdata.status === 204){
                this.props.store.settingColumn.getAssoLabelList(this.props.id);
                this.props.store.tools.message.success("删除成功！");
            }
        })
    }
    async getDetail(id,group_id) {
        var resquestdata = await axios.get(`/api/admin/columns/ref-groups/${id}`,{params:{
            group_id: group_id
        }});
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code === 200){
                this.setState({
                    groupdata: resquestdata.data,
                    checkedList: resquestdata.data.tags,
                    indeterminate: !!resquestdata.data.tags.length && (resquestdata.data.tags.length < this.state.plainOptions.length),
                    checkAll: resquestdata.data.is_all ? true: false,
                });
                
            }
        })
    }
    async getLabelList(id) {
        var resquestdata = await axios.get("/api/admin/tags",{
            params: {
                group_id: id,
                is_page: 0
            }
        });
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200){
                
                this.setState({
                    labelList: resquestdata.data,
                    plainOptions: resquestdata.data.map((item,index) => (item.id)),
                    checkedList: [],
                    indeterminate: false,
                    checkAll: false
                });

            }
        })
    }
    change(field,value) {
        this.setState({
            [field]:value
        })
    }
    render(){
        return (
            <div>
            <Modal
                title="关联标签组"
                visible={this.props.labelVisible}
                onCancel={this.handleCancel.bind(this)}
                footer={null}
                width={800}>
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
                            title: '标签组名称',
                            dataIndex: 'title',
                            width: 120,
                        },{
                            title: '标签组标识',
                            dataIndex: 'name',
                            width: 120
                        },{
                            title: '是否搜索',
                            dataIndex: 'is_search',
                            width: 120
                        },{
                            title: '是否全选',
                            dataIndex: 'is_all',
                            width: 100,
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    <a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>[编辑]</a>
                                    <Popconfirm title="确定删除该栏目?" onConfirm={() => this.handleWarnChange(record)}>
                                        <a href="javascript:;">[删除]</a>
                                    </Popconfirm>
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        scroll={{ y: 300 }}
                        dataSource={this.AssoLabelList}
                       />
                </div>
                </Layout.Content>
                
            </Modal>
            <ModalLabelComponent 
                {...this.state}
                {...this.props}
                handleCloseModale={this.handleCloseModale.bind(this)}
                AssoLabelGroupList={this.AssoLabelGroupList}
                getLabelList={this.getLabelList.bind(this)}
                change={this.change.bind(this)}/>
            </div>
        )
    }
}


class ModalLabelComponent  extends React.Component {
    constructor(props) {
        super(props);
    }
    handleOk(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(!this.props.checkedList.length){
                    this.props.store.tools.message.error("请选择标签");
                    return;
                }
                values.tag_id = this.props.checkedList;
                values.is_all = this.props.checkAll ? 1 : 0;
                values.group_id = this.props.groupdata.group_id;
                if(!this.props.record_id){
                    values.id = this.props.id;
                    this.addRefGroups(values);
                }else {
                    this.fileRefGroups(values,this.props.id);
                }
            }
        })
    }
    async addRefGroups(object){
        var resquestdata = await axios.post("/api/admin/columns/ref-groups", object);
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 201) {
                this.props.store.tools.message.success("关联成功");
                this.props.store.settingColumn.getAssoLabelList(this.props.id);
                this.props.form.resetFields();
                this.props.change("labelList",[]);
                this.props.change("checkedList",[]);
                this.props.change("indeterminate",false);
                this.props.change("checkAll",false);
                this.props.change("plainOptions",[]);
                this.props.handleCloseModale();
            }
        })
    }
    async fileRefGroups(object,id){
        var resquestdata = await axios.put(`/api/admin/columns/ref-groups/${id}`, object);
        resquestdata = resquestdata.data;
        runInAction(() => {
            if(resquestdata.status_code == 200) {
                this.props.store.tools.message.success("关联成功");
                this.props.store.settingColumn.getAssoLabelList(this.props.id);
                this.props.form.resetFields();
                this.props.change("labelList",[]);
                this.props.change("checkedList",[]);
                this.props.change("indeterminate",false);
                this.props.change("checkAll",false);
                this.props.change("plainOptions",[]);
                this.props.handleCloseModale();
            }
        })
    }
    handleCancel(){
        this.props.handleCloseModale();
        this.props.form.resetFields();
    }
    handleChange(value){
        this.props.getLabelList(value);
        let groupdata = this.props.groupdata;
        groupdata.group_id = value;
        this.props.change("groupdata",groupdata);
    }
    
    handleChangeCheckbox(checkedList) {
        this.props.change("checkedList",checkedList);
        this.props.change("indeterminate",!!checkedList.length && (checkedList.length < this.props.plainOptions.length));
        this.props.change("checkAll",checkedList.length === this.props.plainOptions.length);
    }
    onCheckAllChange(e) {
        this.props.change("checkedList",e.target.checked ? this.props.plainOptions : []);
        this.props.change("indeterminate",false);
        this.props.change("checkAll",e.target.checked);
    }
    render(){
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
                title={this.props.vtitle}
                visible={this.props.viosible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                zIndex={1000}>
                <Form className="_platform" onSubmit={this.handleOk.bind(this)}>
                    {
                        !this.props.record_id ? (
                            <FormItem
                                {...formItemLayout}
                                label="关联标签组">
                               
                                    <Select value={this.props.groupdata.group_id} onChange={this.handleChange.bind(this)}>
                                        {
                                            this.props.AssoLabelGroupList.map((item,index) => {
                                                return (
                                                    <Option value={item.id} key={index}>{item.title}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                
                            </FormItem>
                        ) :("")
                    }
                    <FormItem
                        {...formItemLayout}
                        label="标签">
                        <Checkbox
                            indeterminate={this.props.indeterminate}
                            onChange={this.onCheckAllChange.bind(this)}
                            checked={this.props.checkAll}>全选</Checkbox>
                            <br />
                        <CheckboxGroup value={this.props.checkedList} onChange={this.handleChangeCheckbox.bind(this)}>
                            {
                                this.props.labelList.map((item,index) => {
                                    return (
                                        <Checkbox value={item.id} key={index}>{item.title}</Checkbox>
                                    )
                                })
                            }
                            
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否可搜索">
                        {getFieldDecorator('is_search', {
                            rules: [{required: true}],
                            initialValue: this.props.groupdata.is_search || 0
                        })(
                            <RadioGroup>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否附图属性">
                        {getFieldDecorator('is_drawing_attr', {
                            rules: [{required: true}],
                            initialValue: this.props.groupdata.is_drawing_attr || 0
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
ModalLabelComponent = Form.create({})(ModalLabelComponent);
