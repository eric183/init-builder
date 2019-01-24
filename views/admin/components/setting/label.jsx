import React , { Component }  from 'react';
import { Layout, Button, Table, Input, Form, Modal, Radio, Select, Popconfirm, Upload, Icon, Checkbox, DatePicker  } from 'antd';
import { observer } from 'mobx-react'; 
import * as mobx from 'mobx';
import { computed, runInAction } from 'mobx';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

@observer
class LabelComponent extends Component {
    @computed get labelList (){
        return mobx.toJS(this.props.store.settingLabel.labelList);
    }
    constructor(props){
        super(props);
    }
    state = {
        visible: false,
        title: '新增标签',
        formdata: {logo:[]},
        id: '',
        params: {
            page:1,
            limit: 5
        },
        extendsList: [],
        sortVisible: false,
        sort: '',
        labelVisible: false,
        cityData: [],
        areaData: [],
        api:'',
        vtitle: "新增标签"
    }
    handleClick(string,formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            this.setState({title: "编辑标签",id: formdata.id});
            this.setState({visible: true});
            
        }else if(string === "edit_sort") {
            this.getNoticeInfo(formdata.id);
            this.setState({sortVisible: true,id: formdata.id,sort: formdata.sort});
        }else {
            this.setState({
                title: "新增标签",
                formdata: {logo:[]},
                id: '',
                extendsList: []
            });  
            this.setState({visible: true});
        }
       
    }
    handleLableClick(string,formdata){
        if(string === "edit") {
            this.getNoticeInfo(formdata.id);
            if(this.state.params.group_id) this.getExtends({group_id: this.state.params.group_id,tag_id: formdata.id});
            this.setState({vtitle: "编辑标签",id: formdata.id,labelVisible: true});
        }else {
            if(this.state.params.group_id) this.getExtends({group_id: this.state.params.group_id});
            this.setState({
                vtitle: "新增标签",
                formdata: {logo:[]},
                id: '',
                extendsList: [],
                labelVisible: true
            });  
        }

    }
    async getNoticeInfo(id) {
        var requestData = await axios.get(`/api/admin/tags/${id}`);
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
                requestData.data.keywords = requestData.data.keywords.length ? requestData.data.keywords: [];
                this.setState({formdata: requestData.data});
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
    async getExtends(object) {
        var requestData = await axios.get(`/api/admin/tags/extends`, {params: object});
        runInAction(()=> {
            requestData = requestData.data;
            if(requestData.status_code == 200) {
                requestData.data = requestData.data.map((item,index) => {
                    if(item.typeof == "file" && item.value) {
                        var obj = {};
                        obj.uid = index;
                        obj.url = item.value
                        item.value = [];
                        item.value.push(obj);
                    }
                    return item;
                })
                this.setState({extendsList: requestData.data});
            } else {
                this.tools.message.error(requestData.message);
            }
        })
    } 
    handleWarnChange(record){
    
        this.deletePlatform(record.id);
    }
    handleCloseModal(){
        this.setState({visible: false,sortVisible: false, labelVisible: false});
    }
    //修改
    async editPlatform(object,id) {
        var requestData = await axios.put(`/api/admin/tags/${id}`, object);
        requestData = requestData.data;
        runInAction(()=> {
            
            if(requestData.status_code == 200) {
                this.handleCloseModal();
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async addPlatform(object) {
        var requestData = await axios.post(`/api/admin/tags`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("新增成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async editSortform(object) {
        var requestData = await axios.put(`/api/admin/tags/groups-ref/1`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("添加成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async handleLabelAss(object) {
        var requestData = await axios.post(`/api/admin/tags/groups-ref`, object);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("修改成功！");     
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    handleWarnChange(record){
        this.deletePlatform(record.id);
    }
    handleSortChange(record) {
        this.deleteSort(record.id);
    }
    async deletePlatform(id) {
        var requestData = await axios.delete(`/api/admin/tags/${id}`);
        runInAction(()=> {
            if(requestData.status == 204) {
                const params = this.state.params;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async deleteSort(id) {
        var requestData = await axios.delete(`/api/admin/tags/groups-ref/1`,{params:{
            group_id: this.state.params.group_id,
            tag_id: id
        }});
        runInAction(()=> {
            if(requestData.status == 204) {
                const params = this.state.params;
                this.props.store.settingLabel.getLabelList(params);
                this.props.store.tools.message.success("删除成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    componentDidMount() {
        const location = this.props.location;
        this.props.store.settingLabel.getLabelList(qs.parse(location.search.slice(1)));
        if(location.search){
            this.setState({params: Object.assign(this.state.params, qs.parse(location.search.slice(1)))});
        }
        qs.parse(location.search.slice(1)).group_id ? this.props.store.settingLabel.getLabelSearch({group_id: qs.parse(location.search.slice(1)).group_id }) : "";

    }
    componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;

        const params = qs.parse(location.search.slice(1));
        this.setState({params});
        this.props.store.settingLabel.getLabelList(params);
       
    }
    handleChangeFormData(value,key){
        const extendsList = this.state.extendsList;
        extendsList[key].value = value;
        this.setState({extendsList});
    }
    
    //area
    async handleChangeArea(api,string, value) {
        var requestData = await axios.get(`${api}${value}`);
        requestData = requestData.data;

        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.setState({cityData: requestData.data.data, api,areaData: []});
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
        const location = this.props.location;
        const params = qs.parse(location.search.slice(1));
        params.page = 1;
        params[string] = value;
        
        var qsInfo = this.props.util.setQsInfo(params);
        this.props.history.push(`${location.pathname}?${qsInfo}`);
    }
    //city
    async handleChangeCity(string,value){
        var requestData = await axios.get(`${this.state.api}${value}`);
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.setState({areaData: requestData.data.data});
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
        
        const location = this.props.location;
        const params = qs.parse(location.search.slice(1));
        params.page = 1;
        params.area_id = value;
        var qsInfo = this.props.util.setQsInfo(params);
        this.props.history.push(`${location.pathname}?${qsInfo}`);
        
    }
    handleChangeSearch(string, value) {
        const location = this.props.location;
        const params = qs.parse(location.search.slice(1));
        params.page = 1;
        params[string] = value;
        var qsInfo = this.props.util.setQsInfo(params);
        this.props.history.push(`${location.pathname}?${qsInfo}`);
    }
    handleSetstate(value) {
        this.state.formdata.logo = value;
        this.setState({formdata:  this.state.formdata});
    }
    render(){
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: false,
            total: Number(this.props.store.settingLabel.count),
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
                        {
                            mobx.toJS(this.props.store.settingLabel.findData).map((item,key) => {
                                if(item.typeof == "group") {
                                    if(item.group.type == "select" && item.group.is_tree == 0){
                                        return (
                                            <Select allowClear onChange={this.handleChangeSearch.bind(this,item.name)} key={key} name={item.name} style={{width: 120,marginRight: 10}} placeholder={`请选择${item.group.title}`}>
                                                {
                                                    item.group.tags.map((value,index) => {
                                                        return(<Option value={value.id} key={index}>{item.group.display_type === "title" ? value.title : value.title_en}</Option>)
                                                    })
                                                }
                                                
                                            </Select>
                                        )
                                    }
                                }
                            })
                        }
                        { mobx.toJS(this.props.store.settingLabel.findData).map((item,key) => {
                                if(item.typeof == "group") {
                                    if(item.group.type == "select" && item.group.is_tree != 0){
                                        if(item.group.tags.length > 0) {
                                            return (
                                                <Select allowClear onChange={this.handleChangeArea.bind(this,item.group.search_url,item.name)} key={key} name={item.name} style={{width: 100,marginRight: 10}} placeholder={`请选择${item.group.title}`}>
                                                    {
                                                        item.group.tags.map((value,index) => {
                                                            return(<Option value={value.id} key={index}>{item.group.display_type === "title" ? value.title : value.title_en}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    }
                                }
                            })       
                        }
                        {
                            this.state.cityData.length > 0 ? (
                                <Select style={{width: 100,marginRight: 10}} onChange={this.handleChangeCity.bind(this,"city")} allowClear>
                                    {
                                        this.state.cityData.map((value,index) => {
                                            return(<Option value={value.id} key={index}>{value.title}</Option>)
                                        })
                                    }
                                </Select>
                            ):""
                        }
                        {
                            this.state.areaData.length > 0 ? (
                                <Select style={{width: 100,marginRight: 10}} onChange={this.handleChangeCity.bind(this,"district")} allowClear>
                                    {
                                        this.state.areaData.map((value,index) => {
                                            return(<Option value={value.id} key={index}>{value.title}</Option>)
                                        })
                                    }
                                </Select>
                            ):""
                        }
                    </div>
                    <div className="button-bar">
                        {
                            this.state.params.group_id ? (<Button type="primary" onClick={this.handleLableClick.bind(this, "add")}>新增标签</Button>): (<Button type="primary" onClick={this.handleClick.bind(this,"add")}>新增标签</Button>)
                        }
                        
                    </div>
                </div>
                <div className="table-content">
                    <Table columns={[{
                            title: '编号',
                            dataIndex: 'id',
                            width: 80
                        },{
                            title: '标签名称',
                            dataIndex: 'title',
                            width: 120,
                            render: (text, record) => this.state.params.group_id ? ( <a href={`#setting/label?group_id=${this.state.params.group_id}&pid=${record.id}`}>{text}</a>):(text)
                        }, {
                            title: '标签英文',
                            width: 120,
                            dataIndex: 'title_en',
                        }, {
                            title: '标签拼音',
                            dataIndex: 'pinyin',
                            width: 120,
                        },{
                            title: '首字母',
                            dataIndex: 'initials',
                            width: 100,
                        },{
                            title: '标签Logo',
                            dataIndex: 'logo',
                            width: 100,
                            render: text => <img src={text} style={{width: "35px"}}/>, 
                        },{
                            title: '联想词',
                            dataIndex: 'keywords',
                            width: 250,
                            render: text => <p style={{height:'45px',overflowY  :"auto"}}>{text}</p>,
                        },{
                            title: this.state.params.group_id ? "排序": "",
                            dataIndex: 'sort',
                            width: 80,
                        },{
                            title: '操作',
                            render: (text, record) => (
                                <span className="_opration">
                                    {
                                        this.state.params.group_id ? (<a href="javascript:;" onClick={this.handleLableClick.bind(this,"edit",record)}>编辑</a>) :(<a href="javascript:;" onClick={this.handleClick.bind(this,"edit",record)}>编辑</a>)
                                    }
                                    {
                                        this.state.params.group_id ? (<a href="javascript:;" onClick={this.handleClick.bind(this,"edit_sort",record)}>修改排序</a>):('')
                                    }
                                    {
                                        this.state.params.group_id ? (
                                            <Popconfirm title="确定删除关联?" onConfirm={() => this.handleSortChange(record)}>
                                                <a href="javascript:;">删除关联</a>
                                            </Popconfirm>
                                        ):(
                                            <Popconfirm title="确定删除该标签?" onConfirm={() => this.handleWarnChange(record)}>
                                                <a href="javascript:;">删除</a>
                                            </Popconfirm>
                                        )
                                    }
                                    
                                </span>
                            ),
                        }]}
                        rowKey="id"  
                        dataSource={this.labelList} 
                        pagination={ pagination }
                        scroll={{ y: 500 }} />
                </div>
                <ModalTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editPlatform={this.editPlatform.bind(this)}
                    addPlatform={this.addPlatform.bind(this)}
                    handleSetstate={this.handleSetstate.bind(this)} />
                <ModalSortTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    editSortform={this.editSortform.bind(this)} />

                <ModalLabelTemplate 
                    {...this.props}
                    {...this.state}
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    handleLabelAss={this.handleLabelAss.bind(this)}
                    handleChangeFormData={this.handleChangeFormData.bind(this)}
                    handleSetstate={this.handleSetstate.bind(this)}
                    editPlatform={this.editPlatform.bind(this)} />
            </Layout.Content>
        )
    }
}
export default LabelComponent;

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
                if(!values.logo && this.props.formdata.logo.length) {
                    values.logo = this.props.formdata.logo[0].url || this.props.formdata.logo[0].thumbUrl
                }else {
                    this.props.store.tools.message.error("logo上传不能为空！");
                    return ;
                }
                if(this.props.params.group_id){
                    if(this.props.id){
                        this.props.editPlatform(Object.assign(values, {group_id: this.props.params.group_id}),this.props.id);
                        
                    }else {
                        this.props.addPlatform(Object.assign(values, {group_id: this.props.params.group_id}));
                    }
                }else {
                    if(this.props.id){
                        this.props.editPlatform(values,this.props.id);
                    }else {
                    this.props.addPlatform(values);

                    }
                }
                this.props.handleCloseModal();
                this.props.form.resetFields();
            }
        });
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
                        label="标签名称">
                        {getFieldDecorator('title', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title
                        })(
                            <Input maxLength={50}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="标签英文">
                        {getFieldDecorator('title_en', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.title_en
                        })(
                            <Input placeholder="请输入标签英文"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="标签拼音">
                        {getFieldDecorator('pinyin', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.pinyin
                        })(
                            <Input placeholder="请输入标签拼音"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="首字母">
                        {getFieldDecorator('initials', {
                            rules: [{required: true}],
                            initialValue: this.props.formdata.initials
                        })(
                            <Input placeholder="请输入首字母"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="标签logo">
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
                    <FormItem {...formItemLayout} label="联想词">
                        {getFieldDecorator('keywords', {
                            rules: [{required: true,type:'array'}],
                            initialValue: this.props.formdata.keywords
                        })(
                            <Select mode="tags"
                                dropdownStyle={{display: "none"}}>
                            </Select>
                        )}
                    </FormItem>
        
                </Form>
            </Modal>
        )
    }
}

ModalTemplate = Form.create({})(ModalTemplate);

//修改排序
class ModalSortTemplate extends React.Component {
    constructor(props){
        super(props);
    }

    handleSortCancel(){
        this.props.handleCloseModal();
        this.props.form.resetFields();
    }
    handleSortOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.id){
                    values.tag_id = this.props.id;
                    values.group_id = this.props.params.group_id;
                    this.props.editSortform(values);
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
                visible={this.props.sortVisible}
                title="修改排序"
                onOk={this.handleSortOk.bind(this)}
                onCancel={this.handleSortCancel.bind(this)}>
                <Form className="_platform" onSubmit={this.handleSortOk.bind(this)}>
                    <FormItem {...formItemLayout} label="排序">
                        {getFieldDecorator('sort', {
                            rules: [{required: true}],
                            initialValue: this.props.sort || 0
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

ModalSortTemplate = Form.create({})(ModalSortTemplate);



//关联标签组件
class ModalLabelTemplate extends React.Component {
    constructor(props){
        super(props);
    }
    state = {
        labelAss: {},
        data: []
    }

    handleSortCancel(){
        this.props.handleCloseModal();
        this.props.form.resetFields();
    }
    handleSortOk(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.params.group_id && this.props.id){
                    if(!values.logo && this.props.formdata.logo.length) {
                        values.logo = this.props.formdata.logo[0].thumbUrl
                    }else {
                        this.props.store.tools.message.error("logo上传不能为空！");
                        return ;
                    }
                    this.props.editPlatform(values,this.props.id);
                    this.setState({data: []});
                    this.changeExtendsList(this.props.id);
                }else {
                    var extendsList = this.props.extendsList.map((value,index) => {
                        const ob = {};
                        ob.name = value.name;
                        ob.value = value.value;
                        return ob;
                    });
                    this.props.handleLabelAss(Object.assign(values, {group_id: this.props.params.group_id, pid: this.props.id,extends: extendsList}));
                }

                this.props.handleCloseModal();
                this.props.form.resetFields();
            }
        });
    }
    async handleChangeLabelGroup(val){
        var params = {
            title: val,
            limit: 5
        }
        var requestData = await axios.get(`/api/admin/tags`,{params: params});
        requestData = requestData.data;
        runInAction(()=> {
            if(requestData.status_code == 200) {
                this.setState({data: requestData.data.data})
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
    }
    async changeExtendsList(id) {
        var extendsList = this.props.extendsList.map((item,index) => {
            if(item.typeof == "file" && item.value.length) {
                var a = item.value[0].url || item.value[0].thumbUrl;
                item.value = a;
            }
            return item;
        });
        extendsList = this.props.extendsList.map((value,index) => {
            let ob = {};
            ob.name = value.name;
            ob.value = value.value;
            return ob;
        });

        var requestData = await axios.post(`/api/admin/tags/extends`,{
            group_id: this.props.params.group_id,
            tag_id: id,
            extends: extendsList
        });
        
        runInAction(()=> {
            if(requestData.status_code == 201) {
                this.handleCloseModal();
                const params = this.state.params;
                params.page =  1;
                this.props.store.settingLabel.getLabelList(params);
                // this.props.store.tools.message.success("修改成功！");
            } else {
                this.props.store.tools.message.error(requestData.message);
            }
        })
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
    handleChangeUpload(index, {file,fileList}) {

        if(file.status === "done") {
            fileList = fileList.slice(-1);
        }
        else if(file.status === "removed"){
            fileList = [];
        }
        this.props.handleChangeFormData(fileList,index);
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
       const options = this.state.data.map((d,key) => <Option value={d.title} key={key}>{d.title}</Option>);
        return (
            <Modal
                visible={this.props.labelVisible}
                title={this.props.vtitle}
                onOk={this.handleSortOk.bind(this)}
                onCancel={this.handleSortCancel.bind(this)}>
                {
                        this.props.id ? (
                            <Form className="_platform" onSubmit={this.handleSortOk.bind(this)}>
                                <FormItem
                                    {...formItemLayout}
                                    label="标签名称">
                                    {getFieldDecorator('title', {
                                        rules: [{required: true}],
                                        initialValue: this.props.formdata.title
                                    })(
                                        <Input maxLength={50}/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="标签英文">
                                    {getFieldDecorator('title_en', {
                                        rules: [{required: true}],
                                        initialValue: this.props.formdata.title_en
                                    })(
                                        <Input placeholder="请输入标签英文"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="标签拼音">
                                    {getFieldDecorator('pinyin', {
                                        rules: [{required: true}],
                                        initialValue: this.props.formdata.pinyin
                                    })(
                                        <Input placeholder="请输入标签拼音"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="首字母">
                                    {getFieldDecorator('initials', {
                                        rules: [{required: true}],
                                        initialValue: this.props.formdata.initials
                                    })(
                                        <Input placeholder="请输入首字母"/>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="标签logo">
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
                                <FormItem {...formItemLayout} label="联想词">
                                    {getFieldDecorator('keywords', {
                                        rules: [{required: true,type:'array'}],
                                        initialValue: this.props.formdata.keywords
                                    })(
                                        <Select mode="tags"
                                            dropdownStyle={{display: "none"}}>
                                        </Select>
                                    )}
                                </FormItem>
                                {
                                    this.props.extendsList.map((value, index) => {
                                        if(value.typeof == "group"){
                                            if(value.group.type == "select"){
                                                return (
                                                    <FormItem {...formItemLayout} label={value.title} key={index}>
                                                        <Select value={value.value} onChange={valu => this.props.handleChangeFormData(valu,index)}>
                                                            {
                                                                value.group.tags.map((item, key) => (
                                                                    <Option key={key} value={`${item.id}`}>{item.title}</Option>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                )
                                            }else if(value.group.type == "checkbox"){
                                                return (
                                                    <FormItem {...formItemLayout} label={value.title} key={index}>
                                                        <CheckboxGroup  style={{ width: '100%' }} value={value.value || []} onChange={valu => this.props.handleChangeFormData(valu,index)}>
                                                            {
                                                                value.group.tags.map((item,key) => (
                                                                    <Checkbox value={`${item.id}`} key={key}>{item.title}</Checkbox>
                                                                ))
                                                            }
                                                        </CheckboxGroup >
                                                    </FormItem>
                                                )
                                            }
                                        }else if(value.typeof == "file"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <Upload
                                                        action="/api/uploads"
                                                        className="uploader-logo"
                                                        listType="picture-card"
                                                        beforeUpload={this.beforeUpload}
                                                        fileList={value.value || []}
                                                        showUploadList={{showPreviewIcon:false}}
                                                        onChange={this.handleChangeUpload.bind(this,index)}
                                                        >
                                                        {value.value.length >= 1 ? null : <Icon type="plus" />}
                                                    </Upload>
                                                </FormItem>
                                            )
                                        }else if(value.typeof == "date"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <DatePicker onChange={valu => this.props.handleChangeFormData(valu,index)} defaultValue={value.value}/>
                                                </FormItem>
                                            )
                                        }else if(value.typeof == "boolean"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <RadioGroup onChange={valu => this.props.handleChangeFormData(valu,index)} value={value.value}>
                                                        <Radio value={0}>否</Radio>
                                                        <Radio value={1}>是</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            )
                                        }else {
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <Input value={value.value} onChange={valu => this.props.handleChangeFormData(valu.target.value,index)}/>
                                                </FormItem>
                                            )
                                        }
                                        
                                    })
                                }
                            </Form>
                        ) : (
                            <Form className="_platform" onSubmit={this.handleSortOk.bind(this)}>
                                <FormItem {...formItemLayout} label="标签">
                                    {getFieldDecorator('title', {
                                        rules: [{required: true}],
                                        initialValue: this.state.labelAss.title
                                    })(
                                        <Select
                                            mode="combobox"
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onChange={this.handleChangeLabelGroup.bind(this)}>
                                            {options}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="排序">
                                    {getFieldDecorator('sort', {
                                        rules: [{required: true}],
                                        initialValue: this.props.sort || 0
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                {
                                    this.props.extendsList.map((value, index) => {
                                        if(value.typeof == "group"){
                                            if(value.group.type == "select"){
                                                return (
                                                    <FormItem {...formItemLayout} label={value.title} key={index}>
                                                        <Select value={value.value} onChange={valu => this.props.handleChangeFormData(valu,index)}>
                                                            {
                                                                value.group.tags.map((item, key) => (
                                                                    <Option key={key} value={`${item.id}`}>{item.title}</Option>
                                                                ))
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                )
                                            }else if(value.group.type == "checkbox"){
                                                return (
                                                    <FormItem {...formItemLayout} label={value.title} key={index}>
                                                        <CheckboxGroup  style={{ width: '100%' }} value={value.value || []} onChange={valu => this.props.handleChangeFormData(valu,index)}>
                                                            {
                                                                value.group.tags.map((item,key) => (
                                                                    <Checkbox value={`${item.id}`} key={key}>{item.title}</Checkbox>
                                                                ))
                                                            }
                                                        </CheckboxGroup >
                                                    </FormItem>
                                                )
                                            }
                                        }else if(value.typeof == "file"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <Upload
                                                        action="/api/uploads"
                                                        className="uploader-logo"
                                                        listType="picture-card"
                                                        beforeUpload={this.beforeUpload}
                                                        fileList={value.value || []}
                                                        showUploadList={{showPreviewIcon:false}}
                                                        onChange={this.handleChangeUpload.bind(this,index)}
                                                        >
                                                        {value.value.length >= 1 ? null : <Icon type="plus" />}
                                                    </Upload>
                                                </FormItem>
                                            )
                                        }else if(value.typeof == "date"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <DatePicker onChange={valu => this.props.handleChangeFormData(valu,index)} defaultValue={value.value}/>
                                                </FormItem>
                                            )
                                        }else if(value.typeof == "boolean"){
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <RadioGroup onChange={valu => this.props.handleChangeFormData(valu,index)} value={value.value}>
                                                        <Radio value={0}>否</Radio>
                                                        <Radio value={1}>是</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            )
                                        }else {
                                            return (
                                                <FormItem {...formItemLayout} label={value.title} key={index}>
                                                    <Input value={value.value} onChange={valu => this.props.handleChangeFormData(valu.target.value,index)}/>
                                                </FormItem>
                                            )
                                        }
                                        
                                    })
                                }
                            </Form>
                        )
                    }
            </Modal>
        )
    }
}

ModalLabelTemplate = Form.create({})(ModalLabelTemplate);

