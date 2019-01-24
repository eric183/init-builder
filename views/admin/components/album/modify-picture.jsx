import React from 'react';
import { Button,Input,Form, Radio, Select, Icon, Upload, Modal, Spin } from 'antd';
import * as mobx from 'mobx';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@observer
class ModifyPicture extends React.Component {
    constructor(props) {
        super(props);
        this.lastFetchId = 0;
        this.fetchUser = debounce(this.fetchUser, 800);
        this.state = {
            isTrue: false,
            picInfo: {
                title: "正左"
            },
            picVisible: false,
            data: [],
            value: [{key:"123",label:"frank voldsund"}],
            fetching: false,
            f_file: {tags:[]},
            annex_id: ""
        }
    }
    @computed get secondList() {
        return mobx.toJS(this.props.store.AlbumStore.secondList);
    }
    @computed get threeList() {
        return mobx.toJS(this.props.store.AlbumStore.threeList);
    }
    @computed get annexs() {
        return mobx.toJS(this.props.store.AlbumStore.annexs);
    }
    //关闭弹窗
    handleClose(){
        this.refs.modify_picture.style.transform = `translateX(100%)`;
        this.refs.modify_picture.style.opacity = 0;
    }
    handleChangePic(url) {
        this.refs.main_pic.src = url;
    }

    handleSaveChange(){
        // var keywords = this.props.albumInfo.attrs.keywords
        // this.props.albumInfo.attrs.keywords = keywords.map((item,index) => {
        //     return item.key;
        // })
        this.handleSave(this.props.albumInfo);
    }
    async handleSave(object) {
        var _this = this;
        if(!_this.props.albumInfo.title) {
            _this.props.store.tools.message.error("图片标题必填项！");
            return;
        }
        var resquestdata = await axios.put(`/api/admin/toboom/vectors/${object.id}`,object);

        resquestdata =  resquestdata.data;

        mobx.runInAction(() => {
            if(resquestdata.status_code == 200) {
                this.handleClose();
                this.setState({isTrue: false});
            }else {
                _this.props.store.tools.message.error(resquestdata.message); 
            }
        })
    }
    async handleSaveInfo(object) {
        var _this = this;
        if(!_this.props.albumInfo.title) {
            _this.props.store.tools.message.error("图片标题必填项！");
        }
        var resquestdata = await axios.put(`/api/admin/toboom/vectors/${object.id}`,object);
        resquestdata =  resquestdata.data;
        mobx.runInAction(() => {
            if(resquestdata.status_code == 200) {
                _this.props.store.tools.message.success("保存成功！");
                _this.handleClose();
            }else {
                _this.props.store.tools.message.error(resquestdata.message); 
            }
        })
    }
    handleCloseIcon() {
        var _this = this;
        if(this.state.isTrue) {
            Modal.confirm({
                title: '提示',
                content: '未保存数据是否退出!',
                okText:"保存退出",
                cancelText:"不保存",
                closable: true,
                onOk() {
                    _this.handleSaveInfo(_this.props.albumInfo);
                },
                onCancel() {
                    _this.handleClose();
                },
            });
        }else {
            _this.handleClose();
        }
        _this.setState({isTrue: false});
    }
    changeAlbumInfo(string1,string2,value) {
        this.setState({isTrue: true});
        this.props.store.AlbumStore.changeAlbumInfo(string1,string2,value);
    }
    //添加主图附件
    handleUploadChange(event) {
        event.preventDefault;
        var formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append("resource_id",this.props.albumInfo.id);
        
        axios.post("/api/admin/resource/uploads/annex", formData).then((data)=> {
            if(data.data.status_code == 200) {
                this.props.store.AlbumStore.changeAnnexs()
                this.props.store.tools.message.success("上传附件成功！");
                // this.props.handleCloseModal();
            };
        })
    }
    //编辑附图
    handleEditPic(item){
        this.setState({picVisible: true,f_file: item, annex_id: item.annex_id});
    }
    handleCloseModal(){
        this.setState({picVisible: false});
    }
    //
    async fetchUser(value) {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        var responsedata = await axios.get(`${this.props.constructorData.keywords.search_url}${value}&limit=${5}`);
            responsedata = responsedata.data;

        if (fetchId !== this.lastFetchId) { // for fetch callback order
            return;
        }
        if(responsedata.status_code == 200 ) {
            this.setState({ data: responsedata.data.data , fetching: false });
        }

       
    }
    handleChange(string,value){
        this.setState({
            data: [],
            fetching: false,
            isTrue: true
        });
        this.props.store.AlbumStore.changeAlbumInfo("attrs",string,value);
    }
    handleChangeFile(value) {
        this.state.f_file.tag = value;
        this.setState({f_file: this.state.f_file});
    }
    //上传附图
    handleChangeIcon(event) {
        event.preventDefault;
        var formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append("resource_id",this.props.photoList.id);
        
        axios.post("/api/admin/resource/uploads/drawing", formData).then((data)=> {
            if(data.data.status_code == 200) {
                this.props.store.AlbumStore.getPhotoList(this.props.photoList.id);
                this.props.store.tools.message.success("上传成功！");
            };
        })
    }
    change(string) {
        this.setState({[string]: true});
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const SelectInputStyle = {
           style: {
            width: "70%"
           }
        }
        return (
            <div className="modify_picture" ref="modify_picture">
                <Icon className="modify_close" type="close" onClick={this.handleCloseIcon.bind(this)}/>
                <div className="show_picture">
                    <img className="main_pic" ref="main_pic" src={this.props.photoList.hd} alt="主图"/>
                    <ul>
                        {/* <li>
                            <Icon className="edit" type="edit" onClick={this.handleEditPic.bind(this)}/>
                            <Icon className="picture file-ppt-fill" type="file-ppt-fill" />
                            <img src="http://f2.topitme.com/2/6a/bc/113109954583dbc6a2o.jpg" alt=""/>
                            <div className="pic_info">正面图</div>
                        </li> */}
                        {
                            this.props.photoList.id ? (
                                <li onClick={this.handleChangePic.bind(this,this.props.photoList.hd)}>
                                    <img src={this.props.photoList.hd} alt={this.props.photoList.title}/>
                                    <div className="pic_info">主图</div>
                                </li>
                            ) :("")
                        }
                        {
                            this.props.photoList.refs.map((item,index) => {
                                return (
                                    <li key={index}  onClick={this.handleChangePic.bind(this,item.hd)}>
                                        <Icon className="edit" type="edit" onClick={this.handleEditPic.bind(this,item)}/>
                                        {
                                            item.annex_id ? (<Icon className="picture file-ppt-fill" type="file-ppt-fill"/>): ("")
                                        }
                                        <img src={item.hd} alt={item.title}/>
                                        <div className="pic_info">{item.tag_title}</div>
                                    </li>
                                )
                            })
                        }
                        {
                            this.props.photoList.refs.length >= 8 ? ("") : (
                                <div className="upload_icon">
                                    <Icon type="plus-circle">
                                        <input type="file" onChange={this.handleChangeIcon.bind(this)}/>
                                    </Icon>
                                </div>
                            )
                        }
                    </ul>
                </div>
                <div className="modify_form">
                    <div className="status_info">
                        <div>
                            <Icon type="dashboard" /> {this.props.albumInfo.created_date}
                        </div>
                        <div>
                            <Icon type="eye" /> {this.props.albumInfo.extend ? this.props.albumInfo.extend.pv : 0}
                        </div>
                        <div>
                            <Icon type="heart" style={{color: "red"}}/>  {!!this.props.albumInfo.extend ? this.props.albumInfo.extend.like: 0}
                        </div>
                        <div>
                            <Icon type="download" /> {!!this.props.albumInfo.extend ? this.props.albumInfo.extend.download : 0}
                        </div>
                    </div>   
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="来源">
                            <div>
                                {"**"}栏目一一{"***"}上传       
                            </div>
                            {/* <Upload action="/api/admin/resource/uploads/annex" data={{resource_id: this.props.albumInfo.id}} onChange={this.handleUploadChange}>
                                <a href="javascript:;">
                                    <Icon type="upload" />+ 添加附件
                                </a>
                            </Upload> */}
                             <a href="javascript:;" className="upload_f_file">
                                {
                                    this.annexs ? ("已上传附件") : ("上传附件")
                                }
                                <input type="file" onChange={this.handleUploadChange.bind(this)} style={{opacity: 0}}/>
                            </a>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="图片名称">
                            <Input style={{width: "50%"}} value={this.props.albumInfo.title}  onChange={value => this.changeAlbumInfo("title","",value.target.value)}/>
                        </FormItem>
                        
                        <FormItem
                            {...formItemLayout}
                            label="类型">
                            <RadioGroup value={this.props.albumInfo.attrs.select} onChange={value => this.changeAlbumInfo("attrs","select",value.target.value)}>
                                {
                                    <Radio value={this.props.constructorData.toboom_sort.id}>{this.props.constructorData.toboom_sort.title}</Radio>
                                }
                                {
                                    <Radio value={this.props.constructorData.detail.id}>{this.props.constructorData.detail.title}</Radio>
                                }
                                {
                                    <Radio value={this.props.constructorData.part.id}>{this.props.constructorData.part.title}</Radio>
                                }
                            </RadioGroup>
                            {
                                this.props.albumInfo.attrs.select == this.props.constructorData.toboom_sort.id ? (
                                    <div>
                                        <Select style={{width: "100px",marginRight: "10px"}} value={this.props.albumInfo.attrs.toboom_sort[0]} onChange={value => this.props.store.AlbumStore.handleTier("attrs","toboom_sort",value,0)}>
                                            {
                                                this.props.constructorData.toboom_sort.tags.map((item,index) => {
                                                    return (
                                                        <Option value={item.id} key={index}>{item.title}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        {
                                            this.props.albumInfo.attrs.toboom_sort.length >= 1 ? (
                                            <Select style={{width: "100px",marginRight: "10px"}} value={this.props.albumInfo.attrs.toboom_sort[1]} onChange={value => this.props.store.AlbumStore.handleTier("attrs","toboom_sort",value,1)}>
                                                {
                                                    this.secondList.map((item,index) => {
                                                        return (<Option value={item.id} key={index}>{item.title}</Option>)
                                                    })
                                                }
                                            </Select>) : ("")
                                        }
                                        {
                                            this.props.albumInfo.attrs.toboom_sort.length >= 2 ? (
                                            <Select style={{width: "100px",marginRight: "10px"}} value={this.props.albumInfo.attrs.toboom_sort[2]} onChange={value => this.props.store.AlbumStore.handleTier("attrs","toboom_sort",value,2)}>
                                                {
                                                    this.threeList.map((item,index) => {
                                                        return (<Option value={item.id} key={index}>{item.title}</Option>)
                                                    })
                                                }
                                            </Select>):("")
                                        }
                                    </div>
                                ) : ("")
                            }
                            {
                                this.props.albumInfo.attrs.select == this.props.constructorData.detail.id ? (
                                    <div>
                                        <Select style={{width: "50%"}} value={this.props.albumInfo.attrs.detail} onChange={value => this.changeAlbumInfo("attrs","detail",value)}>
                                            {
                                                this.props.constructorData.detail.tags.map((item,index) => {
                                                    return (
                                                        <Option value={item.id} key={index}>{item.title}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                               ):("") 
                            }
                            {
                                this.props.albumInfo.attrs.select == this.props.constructorData.part.id ? (
                                <div>
                                    <RadioGroup value={this.props.albumInfo.attrs.part}  onChange={value => this.changeAlbumInfo("attrs","part",value.target.value)}>
                                        {
                                            this.props.constructorData.part.tags.map((item,index) => {
                                                return (
                                                    <Radio value={item.id} key={index}>{item.title}</Radio>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                                ) : ("")
                            }
                        </FormItem>
                        {/* {
                            <FormItem
                                {...formItemLayout}
                                label={this.props.constructorData.contrast.title}>
                                <RadioGroup value={this.props.albumInfo.attrs.contrast} onChange={value => this.changeAlbumInfo("attrs","contrast",value.target.value)}>
                                    {
                                        this.props.constructorData.contrast.tags.map((item,index) => {
                                            return (
                                                <Radio value={item.id} key={index}>{item.title}</Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                        } */}
                        {/* {
                            <FormItem
                                {...formItemLayout}
                                label={this.props.constructorData.front_back.title}>
                                <RadioGroup value={this.props.albumInfo.attrs.front_back} onChange={value => this.changeAlbumInfo("attrs","front_back",value.target.value)}>
                                    {
                                        this.props.constructorData.front_back.tags.map((item,index) => {
                                            return (
                                                <Radio value={item.id} key={index}>{item.title}</Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                        } */}
                        {/* {
                            <FormItem
                                {...formItemLayout}
                                label={this.props.constructorData.left_right.title}>
                                <RadioGroup value={this.props.albumInfo.attrs.left_right} onChange={value => this.changeAlbumInfo("attrs","left_right",value.target.value)}>
                                    {
                                        this.props.constructorData.left_right.tags.map((item,index) => {
                                            return (
                                                <Radio value={item.id} key={index}>{item.title}</Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                        } */}
                        {
                            <FormItem
                                {...formItemLayout}
                                label={this.props.constructorData.v_season.title}>
                                <RadioGroup value={this.props.albumInfo.attrs.v_season} onChange={value => this.changeAlbumInfo("attrs","v_season",value.target.value)}>
                                    {
                                        this.props.constructorData.v_season.tags.map((item,index) => {
                                            return (
                                                <Radio value={item.id} key={index}>{item.title}</Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormItem>
                        }
                        <FormItem
                            {...formItemLayout}
                            label="其他标签">
                            {/* <Select
                                mode="tags"
                                dropdownStyle={{display:"none"}}
                                {...SelectInputStyle}
                                value={this.props.albumInfo.tags} onChange={value => this.changeAlbumInfo("tags","",value)}>

                            </Select> */}
                            <Select
                                mode="multiple"
                                labelInValue
                                value={this.props.albumInfo.attrs.keywords || []}
                                notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={this.fetchUser.bind(this)}
                                onChange={this.handleChange.bind(this,"keywords")}
                                {...SelectInputStyle}>
                                {this.state.data.map(d => <Option key={d.id}>{d.title}</Option>)}
                            </Select>
                            <p className="warm_tips">提示：1. 只能通过按"Enter"搜索，下拉选项选中标签；2. 可点击“删除”按钮或者图标删除标签</p>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="图片描述">
                            <Input.TextArea autosize={{ minRows: 4, maxRows: 4 }} {...SelectInputStyle} value={this.props.albumInfo.desc} onChange={value => this.changeAlbumInfo("desc","",value.target.value)}/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="谨慎操作">
                            <div className="warning_opration">
                                <a href="javascript:;">删除图片</a>
                                <a href="javascript:;">清空属性</a>
                                <a href="javascript:;">操作记录</a>
                            </div>
                            {
                                // 这部分功能暂时不做
                            }
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="是否发布">
                            <RadioGroup  value={this.props.albumInfo.is_release || 0} onChange={value => this.changeAlbumInfo("is_release","",value.target.value)}>
                                <Radio value={0}>未发布</Radio>
                                <Radio value={1}>发布</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem className="modify_form_button">
                            <Button type="primary" disabled={!this.state.isTrue} onClick={this.handleSaveChange.bind(this)}>保存</Button>
                        </FormItem>
                    </Form>
                </div>
                <ModalTemplats { ...this.props } { ...this.state } 
                    handleCloseModal={this.handleCloseModal.bind(this)}
                    handleChangeFile={this.handleChangeFile.bind(this)}
                    change={this.change.bind(this)}/>
            </div>
        )
    }
}
export default ModifyPicture;


class ModalTemplats extends React.Component {
    constructor(props) {
        super(props);
    }
    handleOk() {
        if(this.props.f_file.tag) {
            this.props.tools.message.error("位置选项为必填项");
            return;
        }
        var object = {};
        object.tag_id = this.props.f_file.tag;
        this.props.photoList.choose_tag.forEach((item,index) => {
            if(object.tag_id == item.id) {
                object.group_id = item.group_id;
            }
        })
        axios.put(`/api/admin/toboom/vectors/${this.props.photoList.id}`,{
            drawing_id: this.props.f_file.id,
            attrs: object
        }).then((data) => {
            if(data.data.status_code == 200) {
                this.props.handleCloseModal();
                this.props.store.AlbumStore.getPhotoList(this.props.photoList.id);
                this.props.store.tools.message.success("修改成功！");
            }
        })

        // 
    }
    handleCancel () {
        this.props.handleCloseModal();
    }
    handleUploadChange(event) {
        event.preventDefault;
        var formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append("drawing_id",this.props.f_file.id);
        
        axios.post("/api/admin/resource/drawings", formData).then((data)=> {
            if(data.data.status_code == 200) {
                this.props.change("annex_id");
                this.props.store.AlbumStore.getPhotoList(this.props.photoList.id);
                this.props.store.tools.message.success("上传附件成功！");
            };
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 17 },
            },
        };
        return (
            <Modal
                title={this.props.f_file.title}
                visible={this.props.picVisible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="位置">
                       <RadioGroup value={this.props.f_file.tag} onChange={value => this.props.handleChangeFile(value.target.value)}> 
                            {
                                this.props.photoList.choose_tag.map((item,index) => {
                                    return (
                                        <Radio value={item.id} key={index}>{item.title}</Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="附件">
                        <a href="javascript:;" className="upload_f_file">
                            {
                                this.props.annex_id ? ("已上传附件") : ("上传附件")
                            }
                            <input type="file" onChange={this.handleUploadChange.bind(this)} style={{opacity: 0}}/>
                        </a>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}