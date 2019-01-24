import React, { Fragment } from 'react';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { Modal } from '@/components/modal';
// import LeftPublicContent from '../../common/left-public-content';
import axios from 'axios';
import { MenuMoe } from '@/components/menu';

import { createPortal } from 'react-dom';

//下载 相关内容 开始
import { DownLoadmethods } from '../../waterfall/waterfall'; 
import DownloadForm from '../../styleGallery/downloadForm';
import { PrivateModal, DownLoadProgres } from '@/components/modal';
//import { ReleaseComponent } from '../management/releaseComponent';
import {  Cascader, message, Pagination, Tooltip } from 'antd';



// 下载方法
const DownLoadMethods = new DownLoadmethods();

//下载 相关内容 结束

//import { ReleaseComponent } from './releaseComponent';

//const CheckboxGroup = Checkbox.Group;


@mobx.observer
export default class DesignManager extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            ...props,
            showDelete: false,
            showAddFileErro: false,
            addFillErroMessage: '',
            showDeleteFileErroMessage: '',
            temperaryId: '',
            showModal: false,
            collectionInputValue: '',
            invalid : false,
            collectionStorePid: 0,
            show: false,
            collectionHistoryDir: [{
                pid: 0,
                title: '我的收藏'
            }],
            fileEditInfo: {
                isShow: false,
                item: {},
                pos: { x: 0, y: 0 }
            },
            fileModalInfo: {
                title: '文件夹命名',
                show: false
            },
            editInfo: {
                isShow: false,
                item: {},
                pos: { x: 0, y: 0 }
            },
            modalInfo: {
                title: '文件夹命名',
                show: false
            }, 
            inputValue: '',
            //下载 相关内容 开始
            percent : 0,
            modalShow : false,
            downloadProgressVisiable : false,
            front: false,
            //下载 相关内容 结束
            lastSelectFileId: '',
            showNoGoDesign: false,
            showNoGoDesignMessage: '',
            page : 1,
            limit : 18,
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
            isShowPowerModal: false,
            powerModalContent: '',
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
        }
    }


    timer = null ; // 定时器
    

    //下载 相关内容 开始
    @defaultMobx.computed get get_formState() { return this.props.store.styleGalleryStore.formState }

    checkedFieldValues = ( formState ) =>{
         let { frontChoose, reverseChoose }  = formState;
         if( frontChoose.length <= 0 && reverseChoose.length <= 0 ) return true;
         return false;
    }
    //下载 相关内容 结束

    menuClick() {
        this.setState({
            show: true
            //show: this.state.show
        })
    }
    componentDidMount() {
        this.props.store.collectionListInfo.getCollectionDir().then((data)=> {
            this.props.store.collectionListInfo.getCollectionListData({ limit : 18 });
        });
        //this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();
        this.props.store.worksTotalNumberInfo.getWorksTotalNumberData();
    }

    //点击 新建文件夹
    handleMyCollectionAddFile() {
        this.setState(()=>({
            showModal: true
        }))
    }

    // 拿到 input框的 值
    handleGetInputChange (e) {
        const value = e.target.value;
        this.setState(()=>({collectionInputValue: value, invalid : false }));
    }

    // 按确定按钮 发送请求 把后台需要的数据 传给后台
    async handleSureAddFile() {

        if( this.state.collectionInputValue ){
            let request = await axios.post('api/toboom/folders',
                {
                    title: this.state.collectionInputValue,
                    type:'favorite',
                    pid: this.state.collectionStorePid
                }
            ).then(({data})=>{
                //后台会返回数据给我们, 然后 我们把 刚才新建的文件夹 需要 的 东西 弄成一个对象 ,给 this.props.store.collectionListInfo.collectionDir这个数组里 放在 第一个位置 unshift,这样我们就做到了 我们点击新建文件>> 输入文件夹名称 >> 按确定 后 就会立即立马 渲染在页面上.
                if(data.status_code == 407) {
                    // debugger
                    //alert(data.message);
                    this.setState({
                        addFillErroMessage: data.message,
                        showModal: false,
                        collectionInputValue: '',
                        invalid : false,
                        showAddFileErro: true
                    })
                } else {
                    this.props.store.collectionListInfo.collectionDir.unshift({
                        title: this.state.collectionInputValue,
                        resource_count: 0,
                        id: data.data.id
                    })
                    this.setState(()=>({
                        showModal:false,
                        collectionInputValue: '',
                        invalid : false
                    }))
                }
            },(error)=>{
                // if(error.status_code == 407) {
                //     alert('文件夹名已存在!')
                // }
                // debugger;
                console.log(error);
            })

            }else{
                this.setState({ invalid : true }); 
            }

    }





    collectionClickHandler(object, index, event) {
        // this.setState({
        //     collectionStorePid: object.id
        // });     
        // debugger;
        if (event.target.dataset.type == "fileshow") {
            // event.target.nextElementSibling.style.display = 'block';
            let rectInfo = event.target.getClientRects()[0];
            // debugger;
            // document.body.style.overflow = 'hidden';

            // debugger;
            this.setState({
                fileEditInfo: {
                    ...this.state.fileEditInfo,
                    index: index,
                    item: object,
                    isShow: true,
                    pos: {
                        x: rectInfo.left,
                        y: rectInfo.top
                    }
                }
            })
            console.log(object);
            // debugger;
        } else {
            this.setState((prevState)=> ({
                collectionStorePid: object.id,
                collectionHistoryDir: [...prevState.collectionHistoryDir,object]
            }))

            //debugger
            this.props.store.collectionListInfo.getCollectionDir({
                type: 'favorite',
                get_child: 'layer',
                pid: object.id,
                page: 1
            }).then((data)=> {
                this.props.store.collectionListInfo.getCollectionListData({ folder_id : object.id, page: 1, limit : this.state.limit, });
            })


        } 
    }

    goMyCollectionDir(object, index) {
        //debugger
        // debugger;
        this.props.store.collectionListInfo.getCollectionDir({
            type: 'favorite',
            pid: object.id,
            get_child: 'layer',
            //page: 1
        }).then(()=> {
            //debugger;
            this.props.store.collectionListInfo.getCollectionListData({ folder_id : object.id, page: 1, limit: this.state.limit, });

            this.setState({
                page: 1,
                collectionStorePid: object.id,
                collectionHistoryDir: this.state.collectionHistoryDir.slice(0, index + 1)
            });
        })
    }   

    passDownCollectionId(id) {
        this.setState({
            temperaryId: id,
            showModal: true
        })
    }
    // //确定下载
    // handleDownCollection() {

    // }
    // //取消下载
    // handleCancelDownCollection() {

    // }
   
    passMoveCollectionId(id) {
        this.setState({
            temperaryId: id,
            showModal: true
        })
    }
    //确定移动
    // async handleMoveCollection() {
    //     let request = await axios.post(`api/toboom/collect/move`,
    //         {
    //             id:this.state.temperaryId
    //         }
    //     ).then(()=>{
    //         this.setState({
    //             showModal: false
    //         })
    //     },(error)=>{
    //         console.log(error);
    //     })
    // }
    // //取消移动
    // handleCancelMoveCollection() {
    //     this.setState({
    //         showModal: false
    //     })
    // }


    passCancelCollectionId(id) {
        this.setState({
            temperaryId: id,
            showModal: true
        })
    }
    // 取消收藏
    // async handleCancelCollection() {
    //     debugger
    //     let request = await axios.post(`api/toboom/collect/cancel`,
    //     {
    //         id: this.state.temperaryId
    //     }
    // ).then(()=>{
    //         // if(request.status_code == 200) {
    //         //     alert('取消收藏成功');
    //         // }else{
    //         //     alert('取消收藏失败')
    //         // }
    //         this.setState({
    //             showModal: false
    //         })
    //         this.props.store.collectionListInfo.getCollectionListData();
    //     },(err)=>{
    //         console.log(err);
    //     })
    // }

    //不取消收藏
    // handleNoCancelCollection() {
    //     this.setState({
    //         showModal: false
    //     })
    // }

    // 文件夹 按钮 开始
    fileBtnClickModal(event) {
        if(event.target.parentElement.nodeName == "BODY") {
            document.body.style.overflow = 'auto';

            this.setState({
                fileEditInfo: { ...this.state.fileEditInfo, isShow: false}
            })
        } else {
            let fileModalInfo = {};
            switch(event.target.dataset.type) {
                case "rename":
                    fileModalInfo.title = '重命名';
                break
                case "delete":
                    fileModalInfo.title = '删除';
                break
                default: 
                    return
            }
            
            this.setState({
                fileEditInfo: { ...this.state.fileEditInfo, isShow: false},
                fileModalInfo: { 
                    ...fileModalInfo,
                    show: true,
                    index: this.state.fileEditInfo.index,
                    item: this.state.fileEditInfo.item,
                    type: event.target.dataset.type
                }
            })
        }
    }
    async handleConfirmAddFileEvent() {
        let { fileModalInfo } = this.state;
        let request, postInfo = {};

        // this.fileSwitchBinder(fileModalInfo.type)
        //debugger;
        
        switch(fileModalInfo.type) {
            case "rename":
                postInfo.url = `/api/toboom/folders/rename`;
                postInfo.data = {
                    id: fileModalInfo.item.id,
                    title: fileModalInfo.item.title
                }
            break
            case "delete":
                postInfo.url = `/api/toboom/folders/${fileModalInfo.item.id}`;
                postInfo.method = 'DELETE';
                // debugger;
                // postInfo.data = {
                //     // ids: [fileModalInfo.item.id],
                //     id: fileModalInfo.item.id
                // }
            break
            default:
                postInfo.url = 'api/toboom/folders';
                postInfo.method = 'post';
                postInfo.data = {
                    title: this.state.inputValue,
                    type: 'favorite',
                    pid: this.state.collectionStorePid
                }
        }
        axios({
            url: postInfo.url,
            method: postInfo.method || 'post',
            data: postInfo.data && postInfo.data
        }).then(({data}) => {    
            
            let collectionDir = this.props.store.collectionListInfo.collectionDir;
            let request_name = this.fileSwitchBinder(fileModalInfo.type);
            //debugger;
            if (data.status_code !== 200) {
                //debugger
                //alert('操作失败');
                this.setState({
                    showDelete: true,
                    fileModalInfo: { ...this.state.fileModalInfo, show: false},
                    showDeleteFileErroMessage: data.message
                })
                return;
            } 
            // debugger;

            if (request_name == 'isRename') {
                //debugger;
                collectionDir[fileModalInfo.index].title = fileModalInfo.item.title;
            } else if (request_name == 'isDelete') {
                // debugger
                collectionDir.splice(fileModalInfo.index, 1);
                // debugger
            } else if (request_name == 'isFolder') {
                this.props.store.collectionListInfo.collectionDir.unshift({
                    title: this.state.inputValue,
                    resource_count: 0,
                    id: data.data.id
                });
            }
            this.setState({
                fileModalInfo: { show: false },
                fileEditInfo: {...this.state.fileEditInfo, isShow: false},
                inputValue: ''
            });
            
        }).catch((error)=> {
            //debugger;
            // alert("无法删除!!! 您需要删除所属文件，才能删除该文件夹.");
            // this.setState({
            //     showDelete: true,
            //     fileModalInfo: { ...this.state.fileModalInfo, show: false}
            // })
        })
    }
    fileInputBinder(event) {
        // debugger;
        this.setState({
            fileModalInfo: {
                ...this.state.fileModalInfo,
                item: {
                    ...this.state.fileModalInfo.item,
                    title: event.target.value
                }
            }
        });
    }
    fileSwitchBinder(type, callback) {
        switch(type) {
            case "rename":
            return "isRename";
                break
            case "delete":
            return "isDelete";
                break
            default:
            return "isFolder";       
        }
    }
    // 文件夹 按钮 结束

    // 图片 按钮 开始
    singleClick(object, index, worksTotalNumberInfo, event) {
        //console.log(worksTotalNumberInfo);
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        if (event.target.dataset.type == "show") {
            // event.target.nextElementSibling.style.display = 'block';
            let rectInfo = event.target.getClientRects()[0];
            // debugger;
            // document.body.style.overflow = 'hidden';

            // debugger;
            this.setState({
                editInfo: {
                    ...this.state.editInfo,
                    index: index,
                    item: object,
                    isShow: true,
                    pos: {
                        x: rectInfo.left,
                        y: rectInfo.top
                    }
                }
            })
            //console.log(object);
            // debugger;
        } else {
            if( worksTotalNumberInfo.all_count <= worksTotalNumberInfo.use_count ) {
                this.setState({
                    showNoGoDesign: true,
                    showNoGoDesignMessage: '作品数已达到上限'
                })
            } else{
               // location.hash = `/design-do?id=${object.id}&isCreate=true`
               let { origin, pathname } = location;
               window.open( origin + pathname + '#' + `/design-do?id=${object.id}&isCreate=true` );
            }
            
        } 
        
    }
    btnClickModal(event) {
        //debugger;
        if(event.target.parentElement.nodeName == "BODY") {
            document.body.style.overflow = 'auto';

            this.setState({
                editInfo: { ...this.state.editInfo, isShow: false}
            })
        } else if(event.target.dataset.type == 'download') {
            this.onDownLoad( {} );
            console.log(this.state.editInfo);
            console.log('请打开下载弹窗');
        } else {
            let modalInfo = {};
            switch(event.target.dataset.type) {
                case "download":
                    modalInfo.title = '下载';
                break

                case "move":
                    modalInfo.title = '移动我的作品';
                    this.props.store.collectionListInfo.getCollectionDir({ type: "favorite", get_child: 'all'}, true);
                    //debugger
                break

                case "cancel":
                    modalInfo.title = '取消收藏';
                break

                default: 
                    return
            }
            
            this.setState({
                editInfo: { ...this.state.editInfo, isShow: false},
                modalInfo: { 
                    ...modalInfo,
                    show: true,
                    index: this.state.editInfo.index,
                    item: this.state.editInfo.item,
                    type: event.target.dataset.type
                }
            })
        }
        
    }
    onRadioChange(event) {
        // console.log(value);
        this.setState({
            modalInfo: {
                ...this.state.modalInfo, 
                item: { 
                    is_release: event.target.value
                }
            }
        });
    }
    inputBinder(event) {
        // debugger;
        this.setState({
            modalInfo: {
                ...this.state.modalInfo,
                item: {
                    ...this.state.modalInfo.item,
                    title: event.target.value
                }
            }
        });
    }
    switchBinder(type, callback) {
        switch(type) {
            case "move":
            return "isMove";
                break

            case "download":
            return "isDownload";
                break

            case "cancel":
            return "isCancel";
                break

            default:
            return "isFolder";
        }

    }
    async handleConfirmAddFile() {
        let { modalInfo } = this.state;
        let request, postInfo = {};

        //debugger;
        // this.switchBinder(modalInfo.type)
        switch(modalInfo.type) {
            
            case "download":
                console.log('download');
            break

            case "move":
                // debugger
                postInfo.url = `/api/toboom/collect/move`;
                postInfo.method = 'post';
                postInfo.data = {
                    id: modalInfo.item.id,
                    folder_id: this.state.lastSelectFileId,
                }
            break

            case "cancel":
            //debugger;
                postInfo.url = `/api/toboom/collect/cancel`;
                postInfo.method = 'post';
                // debugger;
                postInfo.data = {
                    id: modalInfo.item.id,
                }
                //console.log(postInfo.data.id);
            break

            default:
                postInfo.url = 'api/toboom/folders';
                postInfo.method = 'post';
                postInfo.data = {
                    title: this.state.inputValue,
                    type: 'works',
                    pid: this.state.storePid
                }
        }
        

        axios({
            url: postInfo.url,
            method: postInfo.method || 'post',
            data: postInfo.data && postInfo.data
        }).then(({data}) => {
            
            let collectionList = this.props.store.collectionListInfo.collectionList;
            //debugger
            let request_name = this.switchBinder(modalInfo.type);

            if (data.status_code != 200) {
                alert('操作失败');
                return;
            }
            // debugger;


            if (request_name == 'isPublish') {
                collectionList[modalInfo.index].is_release = collectionList[modalInfo.index].is_release == 0 ? 1 : 0;
            } else if(request_name == 'isMove') {
                // debugger;
                collectionList.splice(modalInfo.index, 1);
                this.props.store.collectionListInfo.collectionDir.forEach((data)=> {
                    console.log(data.id);
                    if(data.id == this.state.lastSelectFileId) {
                        //debugger;
                        data.resource_count++ 
                    }
                })
                // debugger;
                this.props.store.collectionListInfo.getCollectionListData({ page: this.state.page, limit : this.state.limit,folder_id: this.state.collectionStorePid });
                //var count = this.props.store.collectionListInfo.get_myCollectionList_total;
                //this.props.store.collectionListInfo.collectionList;
                //this.props.store.collectionListInfo.getCollectionDir();

            }else if (request_name == 'isRename') {
                collectionList[modalInfo.index].title = modalInfo.item.title;
            } else if (request_name == 'isCancel') {
                collectionList.splice(modalInfo.index, 1);
                this.props.store.collectionListInfo.getCollectionListData({ page: this.state.page, limit : this.state.limit,folder_id: this.state.collectionStorePid });
            } else if (request_name == 'isFolder') {
                this.props.store.collectionListInfo.collectionList.unshift({
                    title: this.state.inputValue,
                    resource_count: 0,
                    id: data.data.id
                });
            }


            this.setState({
                modalInfo: { show: false },
                editInfo: {...this.state.editInfo, isShow: false},
                inputValue: ''
            });
        })
       
            

    }
    // 图片 按钮 结束

    //鼠标移入作品时 ,才显示 右上角的按钮图标.
    handleMouseEnterPic(object, index, event) {
        //console.log(event.currentTarget);
        event.currentTarget.querySelector('.collection-more-btn').style.display = 'block';
    }

    //鼠标移出作品时 , 就隐藏掉 右上角的按钮图标.
    handleMouseLeavePic(object, index, event) {
        event.currentTarget.querySelector('.collection-more-btn').style.display = 'none';
    }





   /* 下载方法 start  */


    // 下载按键
    onDownLoad = (  ) => { 
        // 在此先拿图片ID去请求是否存有附图
        this.props.store.styleGalleryStore.request_annex( this.state.editInfo.item.id ).then(( { data } )=>{
            if( data.status_code == 200 ){
                this.setState({   modalShow :  true, editInfo: { ...this.state.editInfo, isShow: false} });
                let { drawing_annex, master_annex } = data.data;
                let source_copy = Object.assign( this.state.editInfo.item, {}, true);
                    source_copy.master_annex = master_annex;
                    source_copy.drawing_annex = drawing_annex;

                var formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
                    formState = Object.assign( formState, {
                                checkboxSource :source_copy,
                                front : true, 
                                fpng : true, 
                                frontChoose : ['png'],
                                reverse : true, 
                                rpng : true, 
                                reverseChoose : ['png'],
                                fepsDisable : true,
                                repsDisable : true
                            });
        
                    if( master_annex == 1 ){
                        formState.feps = true;
                        formState.fepsDisable = false;
                        formState.frontChoose = ['png','eps'];
                    }
        
        
                    if( drawing_annex == 1 ){
                        formState.reps = true;
                        formState.repsDisable = false;
                        formState.reverseChoose = ['png','eps'];
                    }
        
                    this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : false } );


            }else{}
        })
    }




    // 下载进度条
    downloadProgress_confirm = () => {
        //  this.setState({ downloadProgressVisiable : false });
    }

    downloadProgress_cancel = () => {
        clearInterval( this.timer  );
        this.setState({ downloadProgressVisiable : false, percent : 0 });
        DownLoadMethods.break_off(); // 中断下载请求
          // 重置下载表单
          this.props.store.styleGalleryStore.resetFieldsValue();  

    }


   
    // 模拟加载进度
    downloadprogress_animation = () =>{
    var rnd = function(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
            return random;
        };

        this.timer = setInterval(() => {
                let percent = this.state.percent;
                if( percent < 80 ){
                    this.setState({ percent : percent + rnd(1,10) })
                }else{
                    clearInterval( this.timer )
                }

        }, 3000);
    
    }


    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
    confirmPowerGoClient() {
        this.setState({
            isShowPowerModal: false
        });
        location.href = "http://www.wow-trend.com/join/login/from/aHR0cDovL3d3dy53b3ctdHJlbmQuY29tLw==/gender/2.shtml";
    }
    // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}



    // 弹窗确定按键 【 下载 】
    confirmBinder = () =>{

        let formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState ),
           { checkboxSource, frontChoose, reverseChoose, front, reverse  } = formState,
           param = { category : this.state.category, resource_id : [], angle : [] };

               if( front && frontChoose.length > 0 ){ 
                        param.resource_id.push( checkboxSource.id )
                        param.angle.push({
                            angle : 'front',
                            format : frontChoose
                        })
                }

                if( reverse && reverseChoose.length > 0 ){  
                     //  param.resource_id.push( checkboxSource.drawing_id )  
                    // 不需要加上反面ID, 如果未选正面，则
                    param.resource_id.length <= 0 ?  param.resource_id.push( checkboxSource.id ) : '';
                    param.angle.push({
                        angle : 'back',
                        format : reverseChoose
                    })
                }
                        
            
        if( param.resource_id.length ){  // 下载

            this.downloadprogress_animation(); // 模拟加载进度

            this.setState({ modalShow :  false, downloadProgressVisiable : true });

            DownLoadMethods.fireRequestAction( param, ( data ) => {  // data 可能是请求成返回的数据，也有可能是 error 对象；
                if( data.status_code && data.status_code == 200 ){
                      window.location.href = data.data.downloadUrl;
                }else{
                      message.warning('下载失败！');
                }
                clearInterval( this.timer );
                this.setState({ downloadProgressVisiable : false, percent : 0 });
                // 重置下载表单
                this.props.store.styleGalleryStore.resetFieldsValue();  

               
                },


                // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
                ( _data ) => {
                    // 清空进度条定时器
                    clearInterval( this.timer );
                    // 重置下载表单
                    this.props.store.styleGalleryStore.resetFieldsValue(); 

                    this.setState({
                        downloadProgressVisiable : false, 
                        percent : 0,
                        isShowPowerModal: true,
                        powerModalContent : _data.message
                    });
                }
                // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}


            );



        }

    }


    cancelBinder = () =>{
        clearInterval( this.timer  );
        this.setState({ modalShow :  false });
        this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单
    }


   /* 下载方法 end  */


   onChangePicPath(value, selectedOptions){
        // console.log(value, selectedOptions);
        // console.log(value.pop());
        this.setState({
            lastSelectFileId: value[value.length - 1]
        })
    }
 

//   loadData(selectedOptions) {

//     //debugger;
//     const targetOption = selectedOptions[selectedOptions.length - 1];
//     targetOption.loading = true;

//     // load options lazily
//     setTimeout(() => {
//         targetOption.loading = false;
//         targetOption.children = [{
//             label: `${targetOption.label} Dynamic 1`,
//             value: 'dynamic1',
//         }, {
//             label: `${targetOption.label} Dynamic 2`,
//             value: 'dynamic2',
//         }];
//         this.setState({
//             // options: [...this.state.options],
//             collectionDir: [...this.state.collectionDir],
            
//         });
//         }, 1000);
//   }
    // loadData(selectedOptions) {
    //     const targetOption = selectedOptions[selectedOptions.length - 1];
    //     targetOption.loading = true;
    //     this.props.store.collectionListInfo.getCollectionDir({ type: "favorite", get_child: 'layer', pid: targetOption.id }, true).then((data)=> {
    //         // debugger;
    //         targetOption.loading = false;

    //         targetOption.children = data.map(x => {
    //             x.value = x.title;
    //             x.label = x.title;
    //             x.isLeaf = false

    //             return data;
    //         });
    //         // this.props.store.collectionListInfo.resetClone(this.props.store.collectionListInfo.collectionClone);
    //     });

    //     // setTimeout(() => {
    //     //     targetOption.loading = false;
    //     //     targetOption.children = [{
    //     //         label: `${targetOption.label} Dynamic 1`,
    //     //         value: 'dynamic1',
    //     //     }, {
    //     //         label: `${targetOption.label} Dynamic 2`,
    //     //         value: 'dynamic2',
    //     //     }];
    //     //     this.setState({
    //     //         options: [...this.state.options],
    //     //     });
    //     // }, 1000);
    // }


    
    render() {
        var { collectionList , collectionDir, collectionClone } = defaultMobx.toJS(this.props.store.collectionListInfo);
        var { worksTotalNumberInfo, worksAllMessageInfo } = defaultMobx.toJS(this.props.store.worksTotalNumberInfo);
        let fileEditInfo = this.state.fileEditInfo;
        let editInfo = this.state.editInfo;
        let { fileModalInfo, modalInfo, modalShow, downloadProgressVisiable, percent, page, limit,  } = this.state;
        //var { worksTotalNumberInfo } = defaultMobx.toJS(this.props.store.worksTotalNumberInfo);
        //console.log(collectionDir);
        var count = this.props.store.collectionListInfo.get_myCollectionList_total;
        //console.log(count);
        
        return ( 
        


                <div className="my-collection">

                    <div className="collection-pic">
                            <img src="/assets/toBoom/images/designManager/myCollectionPic.png" alt=""/>
                    </div> 
                    <div className="collection-menu">      
                            <div className="collection-menu-btn" onClick={this.menuClick.bind(this)}>
                                <img src="/assets/toBoom/images/designManager/menubtn.png" alt=""/>
                                <MenuMoe store={this.props.store} show={this.state.show} close={x=> {this.setState({show: false}) }}/>
                            </div>
                    </div>
                        
                    <div className="collection-content">
                        <div className="collection-catalog">
                            <div className="collection-catalog-left">
                                <div className="collection-catalog-name">
                                    {
                                        this.state.collectionHistoryDir.map((dir,index)=>(
                                            <div className="collection-file-name cursor-style" key={index}>
                                                <Tooltip palcement="top" title={dir.title} >
                                                    <span onClick={this.goMyCollectionDir.bind(this,dir,index)} >{dir.title}</span>
                                                </Tooltip>
                                                <div className="collection-division-pic"></div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            {/* <div className="collection-catalog-right">

                                <div className="collection-search-bar">
                                    <input type="text" name="search" placeholder="search..."/>
                                    <dir className="collection-search-pic"></dir>
                                </div>

                                <div className="collection-icon-btn">
                                    <i className="iconfont Fill"></i>
                                    <i className="iconfont Fill"></i>
                                    <i className="iconfont shijianpaixufanxiang"></i>
                                    <i className="iconfont mingchengpaixufanxiang"></i>
                                    <i className="iconfont liebiaoxianshi"></i>
                                </div>  

                            </div> */}

                        </div> 

                        <div className="collection-file">

                            <div className="collection-addFile" onClick={this.handleMyCollectionAddFile.bind(this)}>
                                <div className="collection-addFile-btn">NEW</div>
                            </div>

                            {
                                collectionDir.length > 0 && collectionDir.map((dir,index)=>(
                                    <div 
                                        onClick={this.collectionClickHandler.bind(this, dir, index)}
                                        key={index}
                                        className="collection-newFile"
                                    >
                                        <div className="collection-newFile-icon">
                                            <img src="/assets/toBoom/images/designManager/addFileBtnBG.png" alt=""/>
                                        </div>
                                        <div className="collection-newFile-dec">
                                            {/* <p title={dir.title}>{dir.title && dir.title.length >=6 ? dir.title.slice(0,6)+'...' : dir.title}</p> */}
                                            <p title={dir.title}>{dir.title}</p>
                                            <span>共有{dir.resource_count}个作品</span>
                                        </div>
                                        <div className="collection-function-btn" data-type="fileshow">
                                            <img src="/assets/toBoom/images/designManager/moreBtn.png" data-type="fileshow" alt=""/>
                                        </div>

                                        {/* <div className={`collectionFile-detailed-btn ${this.state.showCollectFileBtn ? 'collectFileBtn-show' : 'collectFileBtn-hide'}`}   >
                                            <p className="collectionFile-copy">重命名</p>
                                            <p className="collectionFile-move">删除</p>
                                        </div> */}

                                        <div className="collection-topLeft-corner">
                                            <img src="/assets/toBoom/images/designManager/oneleftTopBG.png" alt=""/>
                                        </div>

                                    </div>      
                                ))
                            }                    
                        </div>


                        <div className="all-collection">
                            { collectionList.length > 0 && collectionList.map((item,index)=> (
                                <div 
                                    className="collection-show-pic cursor-style" 
                                    key={item.id}>
                                    <div 
                                        className="collection-single-show" 
                                        onClick={this.singleClick.bind(this, item, index,worksTotalNumberInfo)} 
                                        onMouseEnter={this.handleMouseEnterPic.bind(this,item,index)}
                                        onMouseLeave={this.handleMouseLeavePic.bind(this,item,index)}
                                    >
                                        <div className="collection-single-pic">
                                            <img src={item.preview_url} alt=""/>
                                        </div> 

                                        <div style={{display: 'none'}} className="collection-more-btn" data-type="show">
                                            <img src="/assets/toBoom/images/designManager/moreBtn.png"  data-type="show"  alt=""/>
                                        </div>
                                                                                   
                                        {/* { item.is_release ? <div className="collection-published">已发布</div> : null} */}
                                    </div>
                                    <p className="collection-title">{item.title}</p>
                                </div>)
                                )
                            }
                        </div>
                        <Pagination 
                            style={{ marginTop : 50, marginBottom : 50 }}
                            total={count} 
                            showSizeChanger 
                            showQuickJumper 
                            current={ page }
                            pageSize={ limit }
                            pageSizeOptions={['18','10', '20', '30', '40']}
                            showTotal={function(total,pageSize) {
                                return `共${Number(count)}条`
                            }} 
                            onChange={ ( pageNumber ) => {
                                this.setState({ page : pageNumber }, () => {
                                    this.props.store.collectionListInfo.getCollectionListData({ 
                                        page :pageNumber,  
                                        limit : this.state.limit,
                                        folder_id: this.state.collectionStorePid
                                    });
                                }) 

                            }}
                            onShowSizeChange={(current, pageSize ) => {
                                this.setState({ limit : pageSize, page : 1 }, () => {
                                    this.props.store.collectionListInfo.getCollectionListData({ 
                                        limit : pageSize, 
                                        page : 1,
                                        folder_id: this.state.collectionStorePid 
                                    });
                                })
                            }}
                        />
                    </div>

                    

                    {/* 创建文件夹MODAL */}
                    <Modal 
                        title="文件夹命名"
                        show={this.state.showModal}
                        onCancel={()=>{this.setState({showModal:false,collectionInputValue:''})}}
                        onCross={()=>{this.setState({showModal:false,collectionInputValue:''})}}
                        onConfirm={this.handleSureAddFile.bind(this)}
                        handleCross = {true}
                        > 
                        <div className="collection-addFile-modal" style={{marginLeft: 150}}>
                            <div>
                                <label htmlFor="insertArea" style={{fontSize: 18}}> 文件夹名称：</label>
                                <input 
                                    ref="new_file_input"
                                    type="text" 
                                    placeholder="请填写" 
                                    value={this.state.collectionInputValue}
                                    onChange={this.handleGetInputChange.bind(this)} 
                                    id="insertArea"
                                    className="collection-file-input"
                                    />
                                  <p className="file-input-error" style={{ visibility : this.state.invalid ? 'visible' : 'hidden' }}>文件夹名称不能为空！</p>
                            </div>
                        </div>
                    </Modal>
                    {/* 创建文件夹MODAL */}


                    {/* 文件夹MODAL 开始 */}
                    <Modal 
                        title={fileModalInfo.title}
                        show={this.state.fileModalInfo.show}
                        onCancel={()=>{this.setState({ fileModalInfo: {...this.state.fileModalInfo, show: false }, inputValue:'' })}}
                        onCross={()=>{this.setState({ fileModalInfo: {...this.state.fileModalInfo, show: false }, inputValue:'' })}}
                        onConfirm={this.handleConfirmAddFileEvent.bind(this)}
                        handleCross = {true}
                    >  
                        <div className="info-wrapper">
                            {
                                fileModalInfo.type == 'default' && <div className = "addFile-modal">
                                
                                    <label htmlFor="insertArea"> <i className="iconfont jinggaotubiao"></i>文件夹名称：</label>
                                    <input 
                                        type="text" 
                                        placeholder="请填写" 
                                        value={this.state.inputValue}
                                        onChange={this.handleAddFileInputChange.bind(this)} 
                                        id="insertArea"
                                        className="file-input"/>
                                    
                                </div>
                            }
                            {
                                fileModalInfo.type == 'rename' && (
                                    <div className="publish-modal common-edit-modal">
                                        <label htmlFor="insertArea" style={{fontSize: 18}}>文件名称：</label>
                                        <input 
                                            type="text" 
                                            placeholder="请填写名称" 
                                            value={fileModalInfo.item.title}
                                            onChange={this.fileInputBinder.bind(this)} 
                                            id="insertArea"
                                            className="file-input" 
                                            style={{border: 'none', width: 250, borderBottom: '2px solid #000', marginLeft: -245}}
                                        />
                                        
                                    </div>
                                )
                            }
                        
                        {
                            fileModalInfo.type == 'delete' && (
                                <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                                    {/* <i className="iconfont jinggaotubiao" style={{fontSize:45}}></i> */}
                                    <div style={{width: 64,height: 56}}>
                                        <img src="/assets/toBoom/images/warn.png" alt="" style={{width: '100%',height: '100%'}}/>
                                    </div>
                                    <span style={{marginLeft: 30,fontSize: 18}}>
                                        删除后，无法恢复此文件夹！
                                    </span>
                                </div>
                            )
                        }
                    </div>                      
                </Modal> 
                {/* 文件夹MODAL 结束*/}
                
                {/* 删除文件夹时 出错的MODAL Start */}
                <Modal
                    show={this.state.showDelete}
                    text={this.state.showDeleteFileErroMessage}
                    title="删除"
                    onConfirm={()=>{this.setState({showDelete: false})}}
                    onCancel={()=>{this.setState({showDelete: false})}}
                    onCross={()=>{this.setState({showDelete: false})}}
                    handleCross = {true}
                    hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
                {/* 删除文件夹时 出错的MODAL end */}

                <Modal
                    show={this.state.showNoGoDesign}
                    text={this.state.showNoGoDesignMessage}
                    title="温馨提醒您"
                    onConfirm={()=>{this.setState({showNoGoDesign: false})}}
                    onCancel={()=>{this.setState({showNoGoDesign: false})}}
                    onCross={()=>{this.setState({showNoGoDesign: false})}}
                    handleCross = {true}
                    hideCancel
                    //hideCancel={true}
                    //confirm={true}
                    isAlert
                ></Modal>


                {/* 创建文件夹时 超过5层 和 同名的文件夹 的 报错弹窗 start */}
                <Modal
                    show={this.state.showAddFileErro}
                    text={this.state.addFillErroMessage}
                    title="文件夹名称"
                    onConfirm={()=>{this.setState({showAddFileErro: false})}}
                    onCancel={()=>{this.setState({showAddFileErro: false})}}
                    onCross={()=>{this.setState({showAddFileErro: false})}}
                    handleCross = {true}
                    hideCancel
                    //hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
                {/* 创建文件夹时 超过5层 和 同名的文件夹 的 报错弹窗 start */}
              

                {/* 图片MODAL 开始*/}
                <Modal 
                    title={modalInfo.title}
                    show={this.state.modalInfo.show}
                    onCancel={()=>{this.setState({ modalInfo: {...this.state.modalInfo, show: false }, inputValue:'' })}}
                    onCross={()=>{this.setState({ modalInfo: {...this.state.modalInfo, show: false }, inputValue:'' })}}
                    handleCross = {true}
                    onConfirm={this.handleConfirmAddFile.bind(this)}
                > 
                    <div className="info-wrapper">
                        {/* {
                            modalInfo.type == 'default' && <div className = "addFile-modal">
                            
                                <label htmlFor="insertArea"> <i className="iconfont jinggaotubiao"></i>文件夹名称：</label>
                                <input 
                                    type="text" 
                                    placeholder="请填写" 
                                    value={this.state.inputValue}
                                    onChange={this.handleAddFileInputChange.bind(this)} 
                                    id="insertArea"
                                    className="file-input"/>
                                
                            </div>
                        } */}
                        {/* {
                            modalInfo.type == 'rename' && (
                                <div className="publish-modal common-edit-modal">
                                    <label htmlFor="insertArea">作品名称：</label>
                                    <input 
                                        type="text" 
                                        placeholder="请填写名称" 
                                        value={modalInfo.item.title}
                                        onChange={this.inputBinder.bind(this)} 
                                        id="insertArea"
                                        className="file-input" />
                                    
                                </div>
                            )
                        } */}
                        {
                            modalInfo.type == 'move' && (
                                <div className="publish-modal common-edit-modal">
                                    <label htmlFor="insertArea" style={{fontSize: 18}}>移动至文件夹：</label>
                                    <Cascader 
                                        options={ collectionClone } 
                                        fieldNames={{children: 'child', label: 'title', value: 'id'}}
                                        onChange={this.onChangePicPath.bind(this)} 
                                        changeOnSelect 
                                        style={{ width: '60%' }} 
                                        placeholder='请选择'
                                        expandTrigger='hover' //次级菜单的展开方式，可选 'click' 和 'hover'
                                        allowClear="true"
                                    />
                                </div>
                            )
                        }
                        {
                            modalInfo.type == 'cancel' && (
                             
                                <div style={{textAlign : 'center', fontSize: 18}}>您确定取消此作品收藏吗？</div>
                            )
                        }
                        {/* {
                            modalInfo.type == 'delete' && (
                                <p style={{textAlign : 'center', height : 50, lineHeight : '50px'}}>
                                    无法恢复哟!
                                </p>
                            )
                        } */}
                    </div>
                    
                </Modal>
                {/* 图片MODAL 结束*/}
                

                {/* 文件夹:BEGIN 开始*/}       
                {
                    fileEditInfo.isShow && createPortal(
                        <div className="detailed-btn-modal" onClick={this.fileBtnClickModal.bind(this)}>
                            <div className="detailed-btn" style={{left: fileEditInfo.pos.x, top: fileEditInfo.pos.y}}>
                                <p className="copy-btn" data-type="rename">重命名</p>
                                <p className="move-btn" data-type="delete">删除</p>
                            </div>
                        </div>,
                        document.body
                    )
                }
                {/* 文件夹:END 结束*/}

                {/* save */}
                {/* 图片:BEGIN 开始*/}
                {
                        editInfo.isShow && createPortal(
                            <div className="detailed-btn-modal" onClick={this.btnClickModal.bind(this)} >
                                <div className="detailed-btn" style={{left: editInfo.pos.x, top: editInfo.pos.y}}>
                                    <p className="download-btn" data-type="download">下载</p>
                                    <p className="move-btn" data-type="move">移动</p>
                                    <p className="cancel-btn" data-type="cancel">取消收藏</p>
                                </div>
                            </div>,
                            document.body
                        )      
                }
                {/* 图片:END 结束*/}


                <PrivateModal 
                    title="选择下载文件"
                    show={ modalShow  }
                    style={{ width : 616 }}
                    classname="donwloadModal"
                    onConfirm={ this.confirmBinder }
                    onCancel={  this.cancelBinder  }
                    confirmDisabled={ this.get_confirmDisable } 
                >
                    <DownloadForm store={ this.props.store } />
                </PrivateModal>


                <DownLoadProgres
                    title="下载进度"
                    show={ downloadProgressVisiable  }
                    style={{ width : 616 }}
                    onConfirm={ this.downloadProgress_confirm }
                    onCancel={  this.downloadProgress_cancel  }
                    percent={ percent }
                />


                {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
                <Modal
                    title="未购买权限"
                    show={this.state.isShowPowerModal}
                    onCancel={()=>{this.setState({isShowPowerModal:false})}}
                    // onConfirm={()=>{this.setState({isShowPowerModal:false})}}
                    onConfirm={this.confirmPowerGoClient.bind(this)}
                    onCross={()=>{this.setState({isShowPowerModal:false})}}
                    handlerCross
                    confirmText="下载客户端"
                    hideCancel
                    // isAlert
                >
                    <div className="info-wrapper">
                        <div style={{display: 'flex',flexDirection:'column',}}>
                            <p style={{marginLeft: 60, fontSize: 18}}>{this.state.powerModalContent}</p>
                            <p style={{marginLeft: 60,fontSize:14}}>请联系您的<span style={{color:"#ffb07a"}}>资讯顾问</span>购买后进行电脑授权，或拨打<span style={{color:"#ffb07a"}}>400-061-0662</span>咨询</p>,
                        </div>
                    </div>
                </Modal>
                {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
                
            </div>

     

        )
    }
} 