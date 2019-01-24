import React, { Component, Fragment } from "react";
import { Modal, Button, Pagination } from "antd";
import qs from 'qs';
import defaultMobx from 'mobx';
import * as mobx from "mobx-react";
// import {observer} from 'mobx-react'
// import MaterialLib from '../materialLibrary/matarial_lib';
import axios from 'axios';
// import ImagesList from '../addComponent/imagesList';

import ImagesList from '../materialLibrary/imagesList';

export default class HomePageEditor extends Component {
    render() {
        return <Uploader {...this.props} />;
    }
}

@mobx.observer
class Uploader extends Component {
    constructor(props) {
        super(props); 
    }
    
    state = {
        imageList: [],   
        visible: false,
        titleName:''
    }

 
    //   handleOk = (e) => {
    //     console.log(e);
    //     this.setState({
    //       visible: false,
    //     });
    //   }
    
    //   handleCancel = (e) => {
    //     console.log(e);
    //     this.setState({
    //       visible: false,
    //     });
    //   }

    
    handleReturnHomePage() {  
        this.props.history.push("/setting/homepage");
    }

    singleImageHandler(image, event) { 
        this.setState({
            modal2Visible: true,
            _src: image
        });
    }

   

    showDeleteConfirm(id,event) {
        //debugger;
         //console.log(this);
        let _this = this;
        var { homePageEditorList } = defaultMobx.toJS(this.props.store.homePageEditor);

        let _event = event; 
        _event.stopPropagation();
        const confirm = Modal.confirm;
        confirm({
            title: '你确定要删除吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.delete(`/api/admin/toboom/recomend/homes/list/${id}`).then(()=> {
                    var qsFile = qs.parse(_this.props.location.search.slice(1));
                    _this.props.store.homePageEditor.getHomePageEditorData(qsFile);
                })
            },
            onCancel() {
               //console.log('Cancel');
            },
        }); 
    }
 
    //页码改变的回调，参数是改变后的页码及每页条数
    onChange(pageNumber) {
        // this.props.location.search + `?page=${pageNumber}`; 
        // console.log(pageNumber);
        // console.log(this.props.location);
        // console.log(this.props.location.pathname);    
        // console.log(this.props.util.setQsInfo({page: pageNumber}));
        this.props.history.push(this.props.location.pathname + "?" + this.props.util.setQsInfo({page: pageNumber})); 
        //debugger;
    }

    // pageSize 变化的回调, 改变每页显示条目数。
    onShowSizeChange(current,pageSize) {

    }


    showModalPictures = () => {
        // debugger;
        this.setState({
          visible: true,
        });
      }

    setImageListVisiable=()=> {
        this.setState({
            visible: false,
        });
    }




    clickActionForImageListComponent(imageInfo) {
       
      console.log(imageInfo);


    //   debugger;
    // let { id, title, preview } = imageInfo[0],
    // params = {};

    // console.log(preview);


    // params.id = id;
    // params.title = title;
    // params.path = preview.path;

       let {  imageList  } = this.state;
             imageList.push(imageInfo);
             this.setState({ imageList });
            //console.log( this.state.imageList);
            //debugger




        // this.setState({
        //     // imageList: this.state.imageList.concat([imageInfo])
        //     imageList: [...this.state.imageList, imageInfo]
        //     // imageList: [...this.state.imageList, params]
        // })


    }



    showDeleteAddPictureConfirm (id, index, event) {
        let _event = event;
        let _this = this; 
        _event.stopPropagation();
        const confirm = Modal.confirm;
        confirm({
            title: '你确定要删除吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                //console.log('OK');
                //console.log(id); 
                // _this.state.imageList.splice(index, 1);
                var copyimageList =  _this.state.imageList;
                copyimageList.splice(index, 1);
                _this.setState({
                    imageList: copyimageList
                    // imageList: _this.state.imageList
                });
            },
            onCancel() {
               //console.log('Cancel');
            },
        }); 
    }




    //保存图片
    handleSavePicture() {

        var qsFile = qs.parse(this.props.location.search.slice(1));
        var id = qsFile.id;

        // let params = {  pictures : [] };
        // let pictures= [];
        let params={id,pictures:[]}
        // let {ids:[],is_release:id}

        let { imageList } = this.state;

        imageList.forEach((item,index) => {
            
            // params.pictures.push(item.id)
            params.pictures.push(item.preview.id)

        });            
    //    console.log(params);
    //    debugger;
     
        axios.post(`/api/admin/toboom/recomend/homes/insert-pictures`,
            params
            //pictures:params 
            // pictures:pictures
            // pictures: this.state.imageList
        ).then(()=> {
            this.props.history.push('/setting/homepage');
        },(err)=>{
            console.log(err);
        })
    }



    //取消保存图片
    handleCancelSave() {
        this.props.history.push('/setting/homepage');
    }

    componentDidMount() {
        console.log(qs.parse(this.props.location.search));
        //debugger;
        var qsFile = qs.parse(this.props.location.search.slice(1));
        console.log(qsFile);
        this.setState({
            titleName:qsFile.title
        })
        //debugger;
        this.props.store.homePageEditor.getHomePageEditorData(qsFile);
    }

    componentWillReceiveProps(nextProps) {
        var qsFile = qs.parse(nextProps.location.search.slice(1));
        this.props.store.homePageEditor.getHomePageEditorData(qsFile);
    }

    render() {
            var { homePageEditorList } = defaultMobx.toJS(this.props.store.homePageEditor);
            // debugger;
            // console.log(homePageEditorList);
            //console.log(homePageEditorList.data);
            //debugger;
            // homePageEditorList.data = homePageEditorList.data || [];
            // console.log(homePageEditorList.data.length);
        return (
            
            <Fragment>
                <div style={{height:40}}>
                    <i
                        className={"anticon anticon-close close-icon"}
                        onClick={this.handleReturnHomePage.bind(this)}
                    />
                </div>

                <section className='fatherContent'>

                    <p className={"title-content1"}>添加{this.state.titleName}</p>

                    <article className='artilceAddPic'>
                        <InputFile onClick={this.showModalPictures} /> 

                    {/* 图片列表悬浮框  start  */}
                        <ImagesList  
                            visiable={ this.state.visible }  
                            onClose={ this.setImageListVisiable }  
                            clickAction={ this.clickActionForImageListComponent.bind(this) }  
                        /> 
                   {/* 图片列表悬浮框  end  */}


                                    
                    {/*
                        <Modal
                            title="Basic Modal"
                            visible={ false }
                            width={1200}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            okButtonProps={{ disabled: true }}
                            cancelButtonProps={{ disabled: true }}
                            >
                            <MaterialLib store={this.props.store} fromHomePageEditor={true} chosingAction={homePageEditorList.chosingAction}/>
                        </Modal>
                    */}
                    
                        { this.state.imageList.map((image, index) => {
                            return (
                                <div
                                    style={{ position: 'relative',display: "inline-block",margin:'0 20px 20px 0' }}
                                    key={index}
                                    
                                >
                                    <div className="img_div">
                                        <img className="imageStyle" src={image.preview.path} alt={image.id} />
                                        <a href="javascript:void(0)">
                                            <div className='mask'>
                                                <div> 
                                                    <i
                                                        className={"anticon anticon-search preview-icon"}  
                                                        onClick={this.singleImageHandler.bind(this, image.preview.path)}
                                                        title='预览图片'
                                                    />          
                                                </div>
                                                <div> 
                                                    <i
                                                        className={"anticon anticon-close delete-icon"}  
                                                        onClick={this.showDeleteAddPictureConfirm.bind(this, image.id, index)}
                                                        title='删除图片'
                                                    />          
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    
                                </div>
                            )
                        })}                      
                        <Modal
                            centered
                            footer={null}
                            visible={this.state.modal2Visible}
                            onCancel={() => this.setState({ modal2Visible: false })}
                        >
                            <img className="bigImageStyle" src={this.state._src} alt="" />
                        </Modal>
                    </article>
                    <p className={"title-content2"}>已添加</p>
                    <article className='scrollContent'>
                    { homePageEditorList.data && homePageEditorList.data.map((image, index) => {
                            return (
                                <div key={index} className='recordContent'>
                                    <div className="img_div2">
                                        <img className="imageStyle2" src={image.path} alt="" />
                                        <a href="javascript:void(0)">
                                            <div className='mask2'>
                                                <div> 
                                                    <i
                                                        className={"anticon anticon-search preview-icon2"}  
                                                        onClick={this.singleImageHandler.bind(this, image.path)}
                                                        title='预览图片'
                                                    />          
                                                </div>
                                                <div> 
                                                    <i
                                                        className={"anticon anticon-close delete-icon2"}  
                                                        onClick={this.showDeleteConfirm.bind(this,image.id)}
                                                        title='删除图片'
                                                    />          
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className='descriptionContent'>
                                        <div className='pictureName'>{image.title}</div>
                                        <span className='pictureDate'>{image.updated_at}</span>
                                    </div>
                                </div>
                            )
                        })}   
                    </article>

                    <article>
                        <div style={{textAlign:'center'}}>                   
                            { homePageEditorList.data && <Pagination 
                                    showQuickJumper 
                                    hideOnSinglePage
                                    pageSize={homePageEditorList.per_page}
                                    total={homePageEditorList.total} 
                                    onChange={this.onChange.bind(this)} 
                                    current={homePageEditorList.current_page}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                            /> }
                        </div>
                    </article>

                    <article className={"editorBtnBox"}>
                        <Button 
                             type="primary" 
                             className={"editorSaveBtn"} 
                             onClick={this.handleSavePicture.bind(this)}
                             style={{padding:'0 25px',height:40,margin:'20px 15px 0 0'}}
                        >
                        保存
                        </Button>
                        <Button className={"editorCancelBtn"} onClick={this.handleCancelSave.bind(this)} style={{padding:'0 25px',height:40,margin:'20px 15px 0 0'}}>取消</Button>
                    </article>

                </section>

            </Fragment>
        )
    }
}

class InputFile extends Component {
    constructor(props) {
        super(props);
    }
    // this.props.onClick
    render() {
        return (
            <div className="addPicture" onClick={this.props.onClick.bind(this)}>
                <div className="addPictureDiv">
                    <label htmlFor="image">
                        <div className="labelStyle">+</div>
                        <input
                            style={{ position: "absolute", left: -999 }}
                            type="text"
                            name="iamge"
                            id="image"
                            onChange={this.props.fileChange}
                        />
                    </label>
                </div>
            </div>
        )
    }
}
