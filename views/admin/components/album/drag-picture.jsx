import React from 'react';
import { Button, Icon } from 'antd';
import axios from "axios";
import { runInAction } from 'mobx';

class DragPicture extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        picArr: [
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
            {hd:""},
        ],
        is_true: true
    }
    change(count,arr){
        this.state.picArr[count] = arr;
        this.setState({picArr: this.state.picArr});
    }
    changeTrue() {
        this.setState({is_true: false})
    }
    //关闭弹窗
    handleClose(){
        this.refs.drag_picture.style.transform = `translateX(110%)`;
        this.refs.drag_picture.style.opacity = 0;
        this.setState({
            picArr: [
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
                {hd:""},
            ],
            is_true: true
        })
    }
    //下一步
    handleNextSteps() {

        var post_data = {
            refs:[]
        };
        
        this.state.picArr.forEach((item,index) => {
            if(item.tag) {
                var obj = {};
                obj.tag = item.tag;
                obj.id = item.id;
                post_data.refs.push(obj);
            }
        })
        if(this.state.picArr[0].id) {
            post_data.main_id = this.state.picArr[0].id;
        }
        this.nextSteps(post_data);
       

    }
    //下一步接口
    async nextSteps(object) {
        if(!object.main_id) {
            this.props.store.tools.message.error("请上传主图!");
        }else {
            var resquestdata = await axios.post("/api/admin/toboom/vectors",object);
            resquestdata = resquestdata.data;
            runInAction(() => {
                if(resquestdata.status_code == 200) {
                    this.handleClose();
                    this.props.handleClick(resquestdata.data.id);
                }
            })
        }
       
    }
    //附件上传
    handleUploadFile(count, event) {
        event.preventDefault;
        var formData = new FormData();
        formData.append('file', event.target.files[0]);
        if(count == 0) {
            formData.append("resource_id",this.state.picArr[count].id);
            axios.post("/api/admin/resource/uploads/annex", formData).then((data)=> {
                if(data.data.status_code == 200) {
                    this.state.picArr[count].f_status = 1;
                    this.setState({picArr:this.state.picArr });
                        
                    this.props.store.tools.message.success("上传附件成功！");
                };
            }).catch((data)=> {

            })
        }else {
            formData.append("drawing_id",this.state.picArr[count].id);
            axios.post(`api/admin/resource/drawings`, formData).then((data)=> {
                if(data.data.status_code == 200) {
                    this.state.picArr[count].f_status = 1;
                    this.setState({picArr:this.state.picArr });

                    this.props.store.tools.message.success("上传附件成功！");
                };
            }).catch((data)=> {

            })
        }
        
    }

    render(){
        return (
            <div className="drag_picture" ref="drag_picture">
                <Icon type="close" onClick={this.handleClose.bind(this)}/>
                <div className="upload_title">
                    <h2>上传图片</h2>
                    <p>点击选择电脑图片上传或直接拖入上传</p>
                </div>
                <div className="show_pic">
                    <div className="main_pic">
                        <div className="pic_main">
                            <UploadWrapper name="0" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[0].id ? (<img src={this.state.picArr[0].hd} alt={this.state.picArr[0].title} />) : (<span>主图正面（左）</span>)
                                }
                            </UploadWrapper>
                            <Button size="small" type="primary" disabled={!this.state.picArr[0].id}>
                                {this.state.picArr[0].f_status ? "已添加附件" : "添加附件"}
                                <input type="file" onChange={this.handleUploadFile.bind(this,0)}/>
                            </Button>
                        </div>
                        
                    </div>
                    <div className="extra_pic">
                        <ul>
                            <li>
                                <UploadWrapper name="1" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[1].id ? (<img src={this.state.picArr[1].hd} alt={this.state.picArr[1].title} />) : (<span>背面（右）</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[1].id}>
                                    {this.state.picArr[1].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,1)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="2" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[2].id ? (<img src={this.state.picArr[2].hd} alt={this.state.picArr[2].title} />) : (<span>正反对比</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[2].id}>
                                    {this.state.picArr[2].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,2)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="3" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[3].id ? (<img src={this.state.picArr[3].hd} alt={this.state.picArr[3].title} />) : (<span>模特正面</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[3].id}>
                                {this.state.picArr[3].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,3)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="4" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[4].id ? (<img src={this.state.picArr[4].hd} alt={this.state.picArr[4].title} />) : (<span>模特背面</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[4].id}>
                                    {this.state.picArr[4].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,4)}/>
                                </Button>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <UploadWrapper name="5" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[5].id ? (<img src={this.state.picArr[5].hd} alt={this.state.picArr[5].title} />) : (<span>模特图</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[5].id}>
                                    {this.state.picArr[5].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,5)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="6" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[6].id ? (<img src={this.state.picArr[6].hd} alt={this.state.picArr[6].title} />) : (<span>模特图</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[6].id}>
                                    {this.state.picArr[6].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,6)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="7" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[7].id ? (<img src={this.state.picArr[7].hd} alt={this.state.picArr[7].title} />) : (<span>模特图</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[7].id}>
                                    {this.state.picArr[7].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,7)}/>
                                </Button>
                            </li>
                            <li>
                                <UploadWrapper name="8" change={this.change.bind(this)} changeTrue={this.changeTrue.bind(this)}>
                                {
                                    this.state.picArr[8].id ? (<img src={this.state.picArr[8].hd} alt={this.state.picArr[8].title} />) : (<span>模特图</span>)
                                }
                                </UploadWrapper>
                                <Button size="small" type="primary" disabled={!this.state.picArr[8].id}>
                                    {this.state.picArr[8].f_status ? "已添加附件" : "添加附件"}
                                    <input type="file" onChange={this.handleUploadFile.bind(this,8)}/>
                                </Button>
                            </li>
                        </ul> 
                    </div>
                </div>
                <div className="next-button">
                    <Button disabled={this.state.is_true} onClick={this.handleNextSteps.bind(this)}>下一步</Button>
                </div>
            </div>
        )
    }
}
export default DragPicture;

class UploadWrapper extends React.Component {
    fileChange(event) {
        event.preventDefault;
        
        var count = event.target.name;
        var formData = new FormData();
        formData.append('file', event.target.files[0]);
        formData.append('title', event.target.files[0].name.split('.')[0]);
        var url = "";
        if(count == 0 ) {
            url = '/api/admin/resource/uploads/bitmap';
        }else {
            url = '/api/admin/resource/uploads/drawing';
        }

        axios.post(url, formData).then((data)=> {
            
            if(data.data.status_code == 200) {
                if(count == 1) {
                    data.data.data.tag = "v_back";
                }else if(count == 2) {
                    data.data.data.tag = "v_contrast";
                }else if(count == 3) {
                    data.data.data.tag = "model_pic";
                }else if(count == 4) {
                    data.data.data.tag = "model_pic";
                }else if(count > 4 && count) {
                    data.data.data.tag = "model_pic";
                } 
                data.data.data.f_status = "";
                this.props.change(count,data.data.data);
                this.props.changeTrue();

            };
        }).catch((data)=> {
            // debugger;
        })

    }
    render() {
      
        // var ChildrenDom = this.props.children;
        return (
            <div className="upload-wrapper">
                <span>
                    <input 
                        type="file" 
                        className="pic-upload" 
                        name={this.props.name}
                        onChange={this.fileChange.bind(this)}/>
                    {this.props.children}
                </span>
                {/* <ChildrenDom>
                    <input id="pic-upload" type="file" />
                </ChildrenDom> */}
            </div>
        )
    }
}