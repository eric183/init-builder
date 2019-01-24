import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
// import 'slick/'
// import slick from 'slick-carousel';
// import $ from 'jquery';
// import React from "react";
import Slider from "react-slick";
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { Modal }  from '@/components/modal';
import { Radio } from 'antd';
import axios from 'axios';
import { MenuMoe } from '@/components/menu';
import { Table , Pagination , Row, Col, Checkbox, message, Cascader, Tooltip } from 'antd';

import { DownLoadmethods } from '../../waterfall/waterfall'; 
import DownloadForm from '../../styleGallery/downloadForm';
import { PrivateModal, DownLoadProgres } from '@/components/modal';
import { ReleaseComponent } from '../management/releaseComponent';
import Column from 'antd/lib/table/Column';

// 下载方法
const DownLoadMethods = new DownLoadmethods();
const CheckboxGroup = Checkbox.Group;


@mobx.observer
export default class DesignManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            showDelete: false,
            showPublished: false,
            showModal: false,
            showAddFileErro: false,
            addFillErroMessage: '',
            showDeleteFileErroMessage: '',
            collectionInputValue: '',
            fileModalInfo: {
                title: '文件夹命名',
                show: false
            },
            fileEditInfo: {
                isShow: false,
                item: {},
                pos: { x: 0, y: 0 }
            },
            showMenu: false,
            modalInfo: {
                title: '文件夹命名',
                show: false
            },
            inputValue:'',
            //collectionStorePid: 0,
            storePid: 0,
            historyDir: [{
                pid: 0,
                title: '全部作品'
            }],
            editInfo: {
                isShow: false,
                item: {},
                pos: { x: 0, y: 0 }
            },
            releas_visiable : false,  // 发布弹窗状态
            page : 1,
            limit : 18,
            selectedRowKeys : [],
            listStype : '1', // 是以图片列表或表格列表展现数据  1 == 图片列表 ， 2 == 表格列表
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            folder_id : '', // 文件夹id
            order : undefined,  // 时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】 
            order_type :  'asc',   //   desc   asc 
            order_icon : 'asc',
            timeOrder_icon : 'asc',
            keywords : '',
            is_overview : 0 , // 是否总览（0为否；1为是） 
            category : '',

            percent : 0,
            modalShow : false,
            downloadProgressVisiable : false,
            front: false,
            allworksLastMoveId: '',
            allworksLastCopyId: '',
            showBatchDeletePrompt: false,
            showBatchDeleteErro: false,
            showBatchDeleteErroMessage: '',
            showFooterBtn: false,
            invalid:false,
            //is_tableIsPic: true
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
            isShowPowerModal: false,
            powerModalContent: '',
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
        }
    }

    timer = null ; // 定时器


    @defaultMobx.computed get get_formState() { return this.props.store.styleGalleryStore.formState }

    checkedFieldValues = ( formState ) =>{
         let { frontChoose, reverseChoose }  = formState;
         if( frontChoose.length <= 0 && reverseChoose.length <= 0 ) return true;
         return false;
    }



    getParams(){
        let { order, order_type, page, limit, folder_id, keywords, is_overview } = this.state,
            param = { page, limit };
        if( order != undefined ){  param.order = order;  param.order_type = order_type;}
        if( folder_id != '' ) param.folder_id = folder_id;
        if( keywords ) param.keywords = keywords;
        if( is_overview != 0 ) param.is_overview = is_overview;
        return param
    }


    menuClick() {
        this.setState({
            //show: true
            show: !this.state.show
        })
    }

    componentDidMount() {

    // ``````2018-12-06 15:20 lsh 解决：初始尽量前端展示的并不是接口返回的前5条数据，而是后5条数据。 start`````````
    //  setTimeout(() => {
    //       this.slider && this.slider.slickGoTo(0,true);
    //  },300);
    // ``````2018-12-06 15:20 lsh 解决：初始尽量前端展示的并不是接口返回的前5条数据，而是后5条数据。 end`````````


        // $(this.refs.clickContent).slick({
        //     infinite: true,
        //     slidesToShow: 5,
        //     slidesToScroll: 5
        // })

          // 获取权限
          this.props.store.productManagementInfo.requestUserInfo((category) => {
            // category 有可能是空的
            category.length <= 0 ? category.push(' ') : '';
            this.setState({ category : category[0] });
            this.props.store.allWorksInfo.requestCategoryTags({ group : 'category', parent : JSON.stringify( category ) }); // 获取category标签

          });

        this.props.store.swiperRecentlyModifyInfo.getSwiperRecentlyModifyData({ limit: 10});
        this.props.store.allWorksInfo.getAllWorksData({ limit: 18});
        this.props.store.allWorksInfo.getAllWorksDir();
        this.props.store.allWorksInfo.requestTags();

       
    }
    



    // ..... 创建新文件夹 开始 ..... //

    //点击 新建文件夹
    handleAddFile() {
        this.setState({
            showModal: true
        })
    }


    // 拿到 input框的 值
    handleGetInputChange (e) {
        const value = e.target.value;
        this.setState(()=>({ collectionInputValue: value , invalid : false }));
    }

    // 点击 确定按钮， 发送请求 把后台需要的数据 传给后台
    async handleSureAddFile() {
     if( this.state.collectionInputValue ){
        let request = await axios.post('api/toboom/folders',
            {
                title: this.state.collectionInputValue,
                type:'works',
                pid: this.state.storePid
            }
        ).then(({data})=>{
            //后台会返回数据给我们, 然后 我们把 刚才新建的文件夹 需要 的 东西 弄成一个对象 ,给 this.props.store.allWorksInfo.collectionDir这个数组里 放在 第一个位置 unshift,这样我们就做到了 我们点击新建文件>> 输入文件夹名称 >> 按确定 后 就会立即立马 渲染在页面上.
            //debugger
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
            }else {

                this.props.store.allWorksInfo.allWorksDir.unshift({
                    title: this.state.collectionInputValue,
                    resource_count: 0,
                    id: data.data.id
                })
                this.setState(()=>({
                    showModal:false,
                    collectionInputValue: '',
                    invalid : false,
                }))
            }
        },(error)=>{
            //debugger
            // if(error.status_code == 410) {
            //     alert('文件夹名已存在!')
            // }
            console.log(error);
        })

    }else{
        this.setState({ invalid : true });
     }

    }
    // ..... 创建新文件夹 结束 ..... //


    // .....点击导航上的 某个的文件夹名 后 会展示这个文件夹里的子文件夹  开始  .....//
    goDir(object, index) {

        this.reload_allworksList( object );

        this.props.store.allWorksInfo.getAllWorksDir({
            type: 'works',
            pid: object.id,
            get_child: 'layer'
        }).then(()=> {

            this.props.store.allWorksInfo.getAllWorksData({ 
                folder_id: object.id, 
                page: 1, 
                limit: this.state.limit, 
                // ·············2018-12-24 15:42 我增加的 是为了改 编号为1000849的bug， 开始	·············
                is_overview: this.state.is_overview
                // ·············2018-12-24 15:42 我增加的 是为了改 编号为1000849的bug， 开始	·············
            });

            this.setState({
                page: 1,
                historyDir: this.state.historyDir.slice(0, index + 1),
                storePid: object.id
            });
        })
    }   
    // .....点击导航上的 某个的文件夹名 后 会展示这个文件夹里的子文件夹  结束  .....//


    // .....文件夹 按钮(重命名、删除) 开始 .....//
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
                fileEditInfo: {...this.state.fileEditInfo, isShow: false},
                // fileEditInfo: {},
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
                    type: 'works',
                    pid: this.state.storePid
                }
        }
        axios({
            url: postInfo.url,
            method: postInfo.method || 'post',
            data: postInfo.data && postInfo.data
        }).then(({data}) => {    
            
            let allWorksDir = this.props.store.allWorksInfo.allWorksDir;
            let request_name = this.fileSwitchBinder(fileModalInfo.type);
            //debugger;
            if (data.status_code !== 200) {
                //debugger
                //alert('操作失败');
                this.setState({
                    showDelete: true,
                    //fileModalInfo: {},
                    fileModalInfo: { ...this.state.fileModalInfo, show:false},
                    showDeleteFileErroMessage: data.message
                    //fileEditInfo: {}
                })
                return;
            } 
            // debugger;
            if (request_name == 'isRename') {
                //debugger;
                allWorksDir[fileModalInfo.index].title = fileModalInfo.item.title;
            } else if (request_name == 'isDelete') {
                // debugger
                allWorksDir.splice(fileModalInfo.index, 1);
                // debugger
            } else if (request_name == 'isFolder') {
                this.props.store.allWorksInfo.allWorksDir.unshift({
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
            // this.setState({
            //     showDelete: true,
            //     //fileModalInfo: {},
            //     fileModalInfo: { ...this.state.fileModalInfo, show:false},
            //     //fileEditInfo: {}
            // })
            // alert("无法删除!!! 您需要删除所属文件，才能删除该文件夹.");
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
    // .....文件夹 按钮(重命名、删除) 结束 .....//

    

    // .....每个文件夹的 点击 事件点完后 展示其对应的所有子文件 在 以及 判断若点中了每个文件夹的右上角的按钮的话 就弹出弹窗  开始.....//
    // clickHandler(object) {
    //     this.setState((prevState)=>({
    //         storePid:object.id,
    //         historyDir:[...prevState.historyDir, object]
    //     }));
    //     this.props.store.allWorksInfo.getAllWorksDir({
    //         type: 'works',
    //         pid: object.id,
    //         get_child: 'layer'
    //     });
    // }
    clickHandler(object, index, event) {
        // this.setState({
        //     storePid: object.id
        // });      
       
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
    
            // debugger;
        } else {

            this.setState((prevState)=> ({
                storePid: object.id,
                historyDir: [...prevState.historyDir,object]
            }))
            //debugger
            this.props.store.allWorksInfo.getAllWorksDir({
                type: 'works',
                get_child: 'layer',
                pid: object.id
            });
            
           
        this.reload_allworksList( object );

        } 
    }
    // .....每个文件夹的 点击 事件点完后 展示其对应的所有子文件 在 以及 判断若点中了每个文件夹的右上角的按钮的话 就弹出弹窗  开始.....//


    // handleAddFileInputChange(e) {
    //     const value = e.target.value;
    //     this.setState({
    //         inputValue:value
    //     });
    // }



    // .....单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//
    switchBinder(type, callback) {
        switch(type) {
            case "copy":
            return "isCopy";
                break
            case "move":
            return "isMove";
                break
            case "download":
            return "isDownload";
                break
            case "rename":
            return "isRename";
                break
            case "publish":
            return "isPublish";
                break
            case "delete":
            return "isDelete";
                break
            default:
            return "isFolder";
               
        }

    }
    async handleConfirmAddFile() {
        let { modalInfo } = this.state;
        let request, postInfo = {};

        // this.switchBinder(modalInfo.type)
        switch(modalInfo.type) {
           
            case "copy":
                postInfo.url = `/api/toboom/works/copy`;
                postInfo.data = {
                    id:  modalInfo.item.id,
                    folder_id: this.state.allworksLastCopyId,
                    title: modalInfo.item.title
                }
            break

            case "move":
                postInfo.url = `/api/toboom/works/move`;
                postInfo.data = {
                    id: modalInfo.item.id,
                    folder_id: this.state.allworksLastMoveId
                }
            break

            case "download":
                console.log('download');
            break

            case "rename":
                postInfo.url = `/api/toboom/works/rename`;
                postInfo.data = {
                    id: modalInfo.item.id,
                    title: modalInfo.item.title
                }
            break
            case "publish":
                postInfo.url = `/api/toboom/finished/set-release`;
                postInfo.method = `post`;
              
                postInfo.data = {
                    ids: [modalInfo.item.id],
                    is_release: modalInfo.item.is_release
                }
            break
            case "delete":
                postInfo.url = `/api/toboom/works/multi-delete`;
                postInfo.method = 'post';
                // debugger;
                postInfo.data = {
                    ids: [modalInfo.item.id],
                }
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
        
        request = await axios({
            url: postInfo.url,
            method: postInfo.method || 'post',
            data: postInfo.data && postInfo.data
        }).then(({data}) => {
            
            let allworksList = this.props.store.allWorksInfo.allworksList;
            let request_name = this.switchBinder(modalInfo.type);

            if (data.status_code != 200) {
                //alert('操作失败');
                this.setState({
                    showDelete: true,
                    showDeleteFileErroMessage: data.message,
                    modalInfo: { ...this.state.modalInfo, show: false} //把上一个弹出隐藏掉
                })
                return;
            }
            // debugger;

            if (request_name == 'isPublish') {
                allworksList[modalInfo.index].is_release = allworksList[modalInfo.index].is_release == 0 ? 1 : 0;
            } else if (request_name == 'isRename') {
                allworksList[modalInfo.index].title = modalInfo.item.title;
            } else if (request_name == 'isMove') {

                allworksList.splice(modalInfo.index,1);
                this.props.store.allWorksInfo.allWorksDir.forEach((item)=> {
                    //console.log(item.id);
                    //console.log(this.state.allworksLastMoveId);
                    if (item.id == this.state.allworksLastMoveId) {
                        //debugger;
                        item.resource_count++;
                    }
                })
                this.props.store.allWorksInfo.getAllWorksData({ page: this.state.page, limit: this.state.limit, folder_id: this.state.storePid })

            } else if (request_name == 'isCopy') {

                this.props.store.allWorksInfo.allWorksDir.forEach((item)=> {
                    if(item.id == this.state.allworksLastCopyId) {
                        item.resource_count++;
                    }
                })
                
            }else if (request_name == 'isDelete') {
                allworksList.splice(modalInfo.index, 1);
                this.props.store.allWorksInfo.getAllWorksData({ folder_id: this.state.storePid, page: 1, limit: this.state.limit});
            } else if (request_name == 'isFolder') {
                this.props.store.allWorksInfo.allWorksDir.unshift({
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
        }).catch((error)=>{         
                alert('操作失败');
        })
       
    }
    // .....单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//



   
    // .....点击单张图片的 若是点击右上角的按钮的话 会弹出详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作 ，否则 就是跳去 设计页。 开始 ..... //
    singleClick(object, index, event) {  

        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        this.props.store.allWorksInfo.resetData();

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

            this.props.store.allWorksInfo.setToolState( object.is_release )

            // debugger;
        } else {
            if(object.is_release == 0 ){
               // location.hash = `/design-do?id=${object.id}`
                let { origin, pathname } = location;
                window.open( origin + pathname + '#' + `/design-do?id=${object.id}`);
            }else{
                //alert('该作品已发布，无法修改。图片状态为未发布时，即可进行修改。')
                this.setState({
                    showPublished: true
                })
            }
   
        }  
        
        

    }
    // .....点击单张图片的 若是点击右上角的按钮的话 会弹出详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作 ，否则 就是跳去 设计页。 开始 ..... //
    



    // .....单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//
    btnClickModal(event) {

        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();

        if(event.target.parentElement.nodeName == "BODY") {

            document.body.style.overflow = 'auto';

            this.setState({
                editInfo: { ...this.state.editInfo, isShow: false}
            })


        } else if(event.target.dataset.type == 'publish') {  // 发布特殊处理



                this.onReleaseAction();
                this.props.store.allWorksInfo.setAttrsObject( this.state.editInfo.item );




        } else if(event.target.dataset.type == 'download') { //下载特殊处理

            this.onDownLoad( {} );

            //console.log('打开下载弹框');

        } else {

      
            let modalInfo = {};
            switch( event.target.dataset.type ) {
                case "copy":
                    modalInfo.title = '复制我的作品';
                    this.props.store.allWorksInfo.getAllWorksDir({ type: 'works', get_child: 'all'}, true);
                break
                case "move":
                    modalInfo.title = '移动我的作品';
                    this.props.store.allWorksInfo.getAllWorksDir({ type: 'works', get_child: 'all'}, true);
                break
                case "download":
                    modalInfo.title = '下载';
                break
                case "rename":
                    modalInfo.title = '重命名';
                break
                // case "publish":
                //     modalInfo.title = '发布';
                // break
                case "delete":
                    modalInfo.title = '删除';
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


   // 发布事件
   onReleaseAction(){
        this.setState({ 
            releas_visiable : true,
            editInfo: { ...this.state.editInfo, isShow: false}
        });

    }




    onRadioChange(event) {
        // console.log(value);
        //debugger;
        this.state.modalInfo.item.is_release = event.target.value; 
        this.setState({ modalInfo: this.state.modalInfo });


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
    // ..... 单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//






    

    //盒子 接受外来的东西
    handleAllowDrop(ev) {
        //console.log("1111");
        ev.preventDefault();
    }
    //
    handleDrag(ev) {
        //debugger;
        console.log(ev.currentTarget);
        console.log(ev.currentTarget.dataset.id);
        ev.dataTransfer.setData("Text", ev.currentTarget.dataset.id);
    }
    handleDrop(ev) {
        //console.log("3333");
        ev.preventDefault();
        var data = ev.dataTransfer.getData("Text");
        ev.target.appendChild(document.getElementById(data));
    }




    // 记录文件夹id，列表分筛选或分页使用。
    // 重置列表排序状态、展示状态...
    reload_allworksList( object ){
        if( object.id == this.state.folder_id ) return false;
        this.setState({
            selectedRowKeys : [],
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            folder_id : object.id,
            listStype : 1,
            page : 1
        }); 

        this.props.store.allWorksInfo.getAllWorksData({ page : 1, limit: this.state.limit, folder_id : object.id });
    }



    // 删除/取消删除作品
    deleteItemAction(ifDeleteRequest, event) { 
        if(ifDeleteRequest.target) {
        
            let { selectedRowKeys, checkedList } = this.state;
            let  checkedIds = [];
            if( selectedRowKeys.length ) checkedIds = selectedRowKeys;
            if( checkedList.length )  checkedIds = checkedList;

            if( checkedIds.length ){
                //alert("确定删除？");
                this.setState({
                    showBatchDeletePrompt: true,
                    checkedIds: checkedIds
                }) 
            }

        } else {
            // this.setState({})


            this.props.store.allWorksInfo.deleteItem({ ids : this.state.checkedIds }, (data) => { 
                if(data.status_code == 200) {
                    message.success('删除成功！');
                    let param =  this.getParams();
                    this.props.store.allWorksInfo.getAllWorksData(param);
                    this.setState({
                        showBatchDeletePrompt: false,
                        selectedRowKeys:[], 
                        checkedList:[], 
                        indeterminate:false, 
                        checkAll:false
                    })
                } else {
                    this.setState({
                        showBatchDeletePrompt: false,
                        showBatchDeleteErro: true,
                        showBatchDeleteErroMessage: data.message,
                        // selectedRowKeys:[], 
                        // checkedList:[], 
                        // indeterminate:false, 
                        // checkAll:false
                    })
                    //alert('作品已发布，不能删除此作品')
                }
            })
        }
    }
    onCancelAction() { 
        this.setState({
                selectedRowKeys : [],
                checkedList: [],
                indeterminate: false,
                checkAll: false,
                showFooterBtn: false
        })

    }



    // 关键词搜索
    searchAction = () => {
        if( this.state.keywords ){
            this.setState({
                    page : 1,
                    limit : 18,
                    selectedRowKeys : [],
                    listStype : '1',
                    checkedList: [],
                    indeterminate: false,
                    checkAll: false,
                    order : undefined, 
                    order_type :  'asc', 
                    order_icon : 'asc',
                    timeOrder_icon : 'asc',
                    is_overview : 0 
            },
                () => {
                    let param =  this.getParams();
                    this.props.store.allWorksInfo.getAllWorksData(param);
                });
        } else {
            let param =  this.getParams();
            this.props.store.allWorksInfo.getAllWorksData(param);
        }
    }


    /*
    *总览图片列表切换
    * 1、隐藏文件夹列表
    * 2、重置文件夹列表面包屑
    * 3、重置列表排序状态等...
    * 4、从新加载文件夹列表数据
    */
    setOverview = () =>{
        var newState = {
                page : 1,
                limit : 18,
                selectedRowKeys : [],
                listStype : '1',
                checkedList: [],
                indeterminate: false,
                checkAll: false,
                //·············2018-12-24 15：41 我把他的folder_id:'',改成了 folder_id: this.state.folder_id,为了改 编号为1000849的bug  开始 ·············
                // folder_id : '',
                folder_id: this.state.folder_id,
                //·············2018-12-24 15：41 我把他的folder_id:'',改成了 folder_id: this.state.folder_id,为了改 编号为1000849的bug  end ·············  
                order : undefined, 
                order_type :  'asc', 
                order_icon : 'asc',
                timeOrder_icon : 'asc',
                keywords : '',
                is_overview : 0 
        };
        if(this.state.is_overview == 0 ) {
                    newState.is_overview = 1;
            } else {
                    newState.is_overview = 0;        
            }   

        this.setState(newState,() => {
            //````````````````````2018.11.24 我自己加的 后来又注释掉的 开始````````````````````
            //let param =  this.getParams({ page : 1, limit: this.state.limit, folder_id : this.state.folder_id});
            //````````````````````2018.11.24 我自己加的 后来又注释掉的 开始````````````````````

            //````````````````````2018.11.24 我注释掉的 开始````````````````````
            //this.goDir({ pid: 0, title: '全部作品' }, 0);
            //let param =  this.getParams();
            //this.props.store.allWorksInfo.getAllWorksData(param);
            //````````````````````2018.11.24 我注释掉的 结束````````````````````

            // ·············2018-12-24 15:42 我增加的 是为了改 编号为1000849的bug， 开始	·············
            this.props.store.allWorksInfo.getAllWorksData({ 
                page: 1,
                limit: 18,
                folder_id : this.state.folder_id,
                is_overview: this.state.is_overview
            });
            // ·············2018-12-24 15:42 我增加的 是为了改 编号为1000849的bug， 结束	·············



        });

    }



    // 排序  时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】
    orderBinder(type){

        let { order_icon, timeOrder_icon  } = this.state,
            newState = { order :  type };
        if( type == 'title' ) {
            order_icon == 'asc' ?  newState.order_type = 'desc' : newState.order_type = 'asc';
            newState.order_icon =  newState.order_type
        }
        if( type == 'updated_at'){
            timeOrder_icon == 'asc' ?  newState.order_type = 'desc' : newState.order_type = 'asc';
            newState.timeOrder_icon =  newState.order_type
        }

        this.setState( newState, () => {
            let param = this.getParams();
            this.props.store.allWorksInfo.getAllWorksData(param);
        });

    }


    /* 图片列表、表格列表多选 start  */ 
    selectedPicItem = (checkedList) => {
        var { allworksList = [] } = defaultMobx.toJS( this.props.store.allWorksInfo );
            this.setState({
                checkedList,
                indeterminate: !!checkedList.length && (checkedList.length < allworksList.length),
                checkAll: checkedList.length === allworksList.length,
            });           
    }

    onCheckAllChange  = ( e ) => {
        var { allworksList = [] } = defaultMobx.toJS( this.props.store.allWorksInfo ),
            checkedList = allworksList.map(( item, index ) => item.id );

        this.setState({
            checkedList: e.target.checked ? checkedList : [],
            indeterminate: false,
            checkAll: e.target.checked,
        })
    }


    onSelectChange = (selectedRowKeys ) => {
        this.setState({ selectedRowKeys })  
    }

    /* 图片列表、表格列表多选 end  */ 



    // 图片列表、表格列表多选切换  1 == 图片列表 ， 2 == 表格列表
    switchListStyle = () => {
        let { listStype } = this.state;
        if( listStype == '1' ){
            this.setState({
                selectedRowKeys : [],
                listStype : 2
            })
        } else {
            this.setState({
                checkedList: [],
                indeterminate: false,
                checkAll: false,
                listStype : 1
            })
        }  
    }

    /* 跳转‘最近修改’ */ 
    goRecentlyMoPage = () => {
        // location.replace('#design/recently-modify');
        location.hash = "design/recently-modify"
    }



    /* 发布弹窗事件 start  */

    release_conformBinder = ( values, callback ) => {

        let { singleItem } = values,
        keysArray = Object.keys( singleItem ),
        { page, limit, editInfo } = this.state,
        params = {
        ids : [ editInfo.item.id ],
        attrs : {},
        append : 0,
        is_release : 1 
    }

    keysArray.forEach(( key, index ) => {
        switch( key ){
            case 'title' : params.title = singleItem[key];
            break;
            default:  singleItem[key] ?  params.attrs[key] = singleItem[key] : ''
        }
    });

        this.props.store.allWorksInfo.multi_edit_Mehtod( params, () => {
            callback();
            let param =  this.getParams();
            this.props.store.allWorksInfo.getAllWorksData(param);
        });


    }


    release_cancelBinder = () => {
        this.setState({ releas_visiable : false })
    }

    /* 发布弹窗事件 end  */


    //最近修改 里 点击单张作品 判断是否要跳去设计页(已发布1不跳去设计页，未发布才跳去设计页)
    handleRecenGoDesign(object) {
        if(object.is_release == 0 ){
           // location.hash = `/design-do?id=${object.id}`
            let { origin, pathname } = location;
            window.open( origin + pathname + '#' + `/design-do?id=${object.id}`);
        }else{
            //alert('该作品已发布，无法修改。图片状态为未发布时，即可进行修改。')
            this.setState({
                showPublished: true
            })
        }
    }

    //鼠标移入作品时 ,才显示 右上角的按钮图标.
    handleMouseEnterPic(event) {
        //console.log(event.currentTarget);
        event.currentTarget.querySelector('.more-btn').style.display = 'block';
    }
    //鼠标移出作品时 , 就隐藏掉 右上角的按钮图标.
    handleMouseLeavePic(event) {
        event.currentTarget.querySelector('.more-btn').style.display = 'none';
    }



    frontBinder=(event)=> {
        let target = event.target,
            checked = target.checked,
            formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
         if( checked ){
             formState = Object.assign(formState, { fpngDisable : false, fepsDisable : formState.checkboxSource.master_annex > 0 ? false : true,  front : true })
         }else{
             formState = Object.assign(formState, { front : false,fepsDisable: true, fpngDisable : true, fpng : false, feps : false, frontChoose : [] })
         }
       this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })

    }
    fItemBinder=(event)=> {
        let target = event.target,
            value = target.value,
            checked = target.checked,
            formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
        if( checked ){
                formState[ 'f' + value ] = true;
                formState.frontChoose.push( value );
          }else{
            formState[ 'f' + value ] = false;
            let index = formState.frontChoose.indexOf( value );
            index > -1 ? formState.frontChoose.splice(index, 1) : '';
        }
        this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })
  
    }
    reverseBinder=(event)=> {
        let target = event.target,
            checked = target.checked,
            formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
                if( checked ){
                    formState = Object.assign(formState, { rpngDisable : false, repsDisable : formState.checkboxSource.drawing_annex > 0 ? false : true, reverse : true } );
                }else{
                    formState = Object.assign(formState, { reverse : false, repsDisable : true, rpngDisable : true, rpng : false, reps : false, reverseChoose : [] });
                }  
            this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })  
    }
    rItemBinder=(event)=> {
        let target = event.target,
            value = target.value,
            checked = target.checked,
            formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
         if( checked ){
             formState['r' + value] = true;
             formState.reverseChoose.push( value );
         }else{
             formState['r' + value] = false;
            let index = formState.reverseChoose.indexOf( value );
            index > -1 ? formState.reverseChoose.splice(index, 1) : '';
         }
         this.props.store.styleGalleryStore.setProperties({ formState : formState, confirmDisable : this.checkedFieldValues( formState ) })
    }




   /* 下载方法 start  */


    // 下载按键
    onDownLoad = (  ) => { 

  // 在此先拿图片ID去请求是否存有附图
  this.props.store.styleGalleryStore.request_annex( this.state.editInfo.item.id ).then(( { data } )=>{
       if( data.status_code == 200 ){

               this.setState({   modalShow :  true,  editInfo: { ...this.state.editInfo, isShow:false}  });

                let { drawing_annex, master_annex } = data.data;

                let source_copy = Object.assign( this.state.editInfo.item, {}, true);
                    source_copy.master_annex = master_annex;
                    source_copy.drawing_annex = drawing_annex;

            var   formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
                  formState = Object.assign( formState, {
                              checkboxSource : source_copy,
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


       }else{

       }
      }) 

    
    }






    // 下载进度条
    downloadProgress_confirm = () => {
        //  this.setState({ downloadProgressVisiable : false });
    }

    downloadProgress_cancel = () => {
        clearInterval(  this.timer );
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
                    clearInterval(  this.timer )
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
        clearInterval(  this.timer );
        this.setState({ modalShow :  false });
        this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单
    }



    /* 下载方法 end  */


    onChangePicPath(value,selectedOptions) {
        //console.log(value,selectedOptions);
        this.setState({
            allworksLastMoveId: value[value.length-1]
        })
    }


    onCopyPicPath(value,selectedOptions) {
        console.log(value,selectedOptions);
        this.setState({
            allworksLastCopyId: value[value.length-1]
        })
    }


    
    handleShowFooterBtn = () => {
        this.setState({
            showFooterBtn: !this.state.showFooterBtn
        })
    }

    



    render() {
       
        var { swiperRecentlyModifyList } = defaultMobx.toJS(this.props.store.swiperRecentlyModifyInfo);
        var { allworksList, allWorksDir, allWorksDirClone } = defaultMobx.toJS(this.props.store.allWorksInfo);  
        var { userInfo } = defaultMobx.toJS(this.props.store.homePageInfo); 
        //console.log(userInfo);    
        //console.log(allworksList);
        //console.log(allWorksDirClone);
        //console.log(allWorksDir);

        //console.log(swiperRecentlyModifyList);

        var toolState = this.props.store.allWorksInfo.get_toolState;

        //console.log(toolState)


      

        let { editInfo, modalInfo,fileModalInfo, selectedRowKeys, listStype, page,
            limit, checkedList, order_icon, timeOrder_icon, is_overview,
            keywords, releas_visiable,  modalShow, downloadProgressVisiable, percent,
            showFooterBtn
            } = this.state;

       let count = this.props.store.allWorksInfo.get_allworksList_total;
       var selectedItems =  checkedList.length || selectedRowKeys.length;
       let fileEditInfo = this.state.fileEditInfo;


        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,
            //variableWidth: true,
            //ref : slider => (this.slider = slider), // ``````2018-12-06 15:20 lsh 解决：初始尽量前端展示的并不是接口返回的前5条数据，而是后5条数据。`````````
            

            //rtl: true  //反转幻灯片顺序
            

            //centerPadding: 0,
            //lazyLoad: true,

            // autoplay: true,
            // speed: 2000,
            // autoplaySpeed: 4000,
            // cssEase: "linear"
        };
        
        
        return (
            <div className="design-content">

                <div className="big-left-top">
                    <img src="/assets/toBoom/images/designManager/bigLeftTop.png" alt="" />
                </div>

                <div className="menu">
                    <div className="menu-btn" onClick={this.menuClick.bind(this)}>
                        <img src="/assets/toBoom/images/designManager/menubtn.png" alt="" />
                        <MenuMoe store={this.props.store} show={this.state.show} close={x=> {this.setState({show: false}) }}/>
                    </div>
                </div>

                <div className="recently-revised-content">

                    <div className="recently-revised-header" onClick={this.goRecentlyMoPage.bind(this)}>
                        <img src="/assets/toBoom/images/designManager/recentlyRevisedTitle.png" alt="" />
                    </div>

                    <div className="outermost-layer-swiper">

                        {/* <div className="swiper-position-pic">
                            <img src="/assets/toBoom/images/designManager/swiperPositionPic.png" alt="" />
                        </div> */}

                        <div className="swiper-div">
                            <Slider  {...settings}>
                                {
                                    swiperRecentlyModifyList && swiperRecentlyModifyList.map((item, index) => (
                                        <div className="single-recently-revised" key={index}>
                                            <div className="recently-revised-picture cursor-style" onClick={this.handleRecenGoDesign.bind(this,item)}>
                                                <div className="single-pictureDiv">
                                                    <img src={item.preview_url} alt="" />
                                                </div>
                                                {item.is_release ? <div className="management-published">已发布</div> : null}
                                            </div>
                                            <div className="recently-revised-name">
                                                {
                                                    item.title && item.title.length >= 20 ? item.title.slice(0, 20) + '...' : item.title
                                                }
                                            </div>
                                            <div className="recently-revised-time" >
                                                <i className="iconfont time" ></i>
                                                <span>{item.updated_at}</span>
                                            </div>
                                        </div>
                                    ))
                                }                             
                            </Slider>
                        </div>

                    </div>

                </div>

                <div className="allWorks-content">

                    <div className="allWorks-header">
                        <img src="/assets/toBoom/images/designManager/allworksTitle.png" alt="" />
                    </div>

                    <div className="catalog">
                        <div className="catalog-left">
                            <div className="catalog-name">
                                {
                                    this.state.historyDir.map((dir, index)=> (
                                        // 全部作品
                                        <div className="file-name cursor-style file-name-management" key={index}>
                                            <Tooltip palcement="top" title={dir.title} >
                                                <span onClick={this.goDir.bind(this, dir, index)} >{dir.title}</span>
                                            </Tooltip>
                                            <div className="division-pic"></div>
                                        </div>
                                    ))
                                }

                                {/* <div className="file-name">全部作品
                                    <div className="division-pic"></div>
                                </div>
                                <div className="file-name">全部作品
                                    <div className="division-pic"></div>
                                </div> */}

                                
                            </div>
                        </div>

                        <div className="catalog-right">

                            <div className="search-bar">
                                {/* ···············2018.11.24 我把input标签里的 name="search" 去掉了 开始············· */}
                                {/* <input type="text" name="search" style={{fontSize: 14}} placeholder="搜索你需要的作品"  value={ keywords } onChange={ ( e ) => { this.setState({ keywords : e.target.value }) } }  /> */}
                                {/* ···············2018.11.24 我把 name="search" 去掉了 结束············· */}
                                <input type="text"  style={{fontSize: 14}} placeholder="搜索你需要的作品"  value={ keywords } onChange={ ( e ) => { this.setState({ keywords : e.target.value }) } }  />
                                <div className="search-pic" onClick={ this.searchAction }></div>
                            </div>

                            <div className="icon-btn">
                                <Tooltip placement="bottom" title={"批量管理"}>
                                    <i className="iconfont duoxuan" onClick={ this.handleShowFooterBtn  }></i>
                                </Tooltip>
                                <Tooltip placement="bottom" title={ is_overview ? "显示文件夹" : "显示所有作品"}>
                                    <i className={['iconfont',  is_overview ? 'wenjianjiaicon' : 'tupianxianshi'].join(' ')}  onClick={ this.setOverview }></i>
                                </Tooltip>
                                <Tooltip placement="bottom" title={"按最后修改时间排序"}>
                                    <i className={['iconfont', timeOrder_icon  == 'asc' ?  'shijianpaixufanxiang' : 'shijianpaixu'].join(' ')}   onClick={ this.orderBinder.bind(this, 'updated_at') } ></i>
                                </Tooltip>
                                <Tooltip placement="bottom" title={"按名称排序"}>
                                    <i className={['iconfont', order_icon == 'asc' ?  'mingchengpaixufanxiang' : 'mingchengpaixu'].join(' ')} onClick={ this.orderBinder.bind(this, 'title') } ></i>
                                </Tooltip>

                                {/* <Tooltip placement="bottom" title={"列表显示"}>
                                    <i className={['iconfont','liebiaoxianshi'].join(' ')}   onClick={ this.switchListStyle }></i>
                                </Tooltip> */}
                                 {/* 暂时隐藏，待下一版本  2018-11-26
                                <Tooltip placement="bottom" title={ listStype =='1'  ? "列表显示" : "图片显示"}>
                                    <i className={`iconfont ${ listStype =='1'  ? 'liebiaoxianshi' : 'Fill'}`}   onClick={ this.switchListStyle }></i>
                                </Tooltip>
                                */}
                            </div>


                            {/* <div className="icon-btn">
                                <div className="icon-div">
                                    <div className="batch">
                                        <img src="/assets/toBoom/images/designManager/batchPic.png" alt=""/>
                                    </div>
                                    <div className="file-switch">
                                        <img src="/assets/toBoom/images/designManager/fileSwitchPic.png" alt=""/>
                                    </div>
                                    <div className="time-sorting">
                                        <img src="/assets/toBoom/images/designManager/timeSortingPic.png" alt=""/>
                                    </div>
                                    <div className="name-sorting">
                                        <img src="/assets/toBoom/images/designManager/nameSortingPic.png" alt=""/>
                                    </div>
                                    <div className="pic-switch">
                                        <img src="/assets/toBoom/images/designManager/picSwitchPic.png" alt=""/>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>


                    {/* 文件夹列表 start  */}
                    <div className="file" style={{ display : is_overview  == 0 ? 'flex' : 'none' }}>
                        <div className="addFile cursor-style" onClick={this.handleAddFile.bind(this)}>
                            <div className="addFile-btn">NEW</div>
                        </div>
                        {
                            allWorksDir.map((dir, index)=> (
                                <div
                                    onClick={this.clickHandler.bind(this, dir,index)}
                                    key={index}
                                    className="newFile cursor-style"
                                    id="drop"
                                    onDragOver={this.handleAllowDrop.bind(this)}
                                    
                                    onDrop={this.handleDrop.bind(this)}>

                                    <div className="newFile-icon">
                                        <img src="/assets/toBoom/images/designManager/addFileBtnBG.png" alt="" />
                                    </div>
                                    <div className="newFile-dec">
                                        {/* <p title={dir.title}>{dir.title && dir.title.length >= 6 ? dir.title.slice(0,6)+'...' : dir.title}</p> */}
                                        <p title={dir.title}>{dir.title}</p>
                                        <span>共有{dir.resource_count}个作品</span>
                                    </div>
                                    <div className="function-btn" data-type="fileshow">
                                        <img src="/assets/toBoom/images/designManager/moreBtn.png" data-type="fileshow" alt="" />
                                    </div>

                                    <div className="top-left-corner">
                                        <img src="/assets/toBoom/images/designManager/oneleftTopBG.png" alt="" />
                                    </div>

                                    <div className="file-detailed-btn" >
                                        <p className="copy-btn">重命名</p>
                                        <p className="move-btn">删除</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div> 
                    {/* 文件夹列表 end  */}



                    {/* 图片展示列表  start */}
                    <CheckboxGroup onChange={ this.selectedPicItem  } value={ checkedList } style={{ display : listStype == '1' ? 'block' : 'none' }} >
                      <div className="all-show">  

                        { allworksList && allworksList.map((item, index) => (
                            <div
                                className="show-pic cursor-style"
                                key={index}
                                data-id="drag"
                                draggable="true"
                                onDragStart={this.handleDrag.bind(this)}
                                 >
                                 {
                                      showFooterBtn ? 
                                      ( <Checkbox style={{ visibility :  showFooterBtn ? 'visiable' : 'hidden'  }} 
                                                     value={ item.id } 
                                                     className="show-pic-checkbox ant-checkbox-custom-style"></Checkbox> ) : null
                                 }
                                
                                <div 
                                    className="single-show" 
                                    onClick={this.singleClick.bind(this, item, index)}
                                    onMouseEnter={this.handleMouseEnterPic.bind(this)}
                                    onMouseLeave={this.handleMouseLeavePic.bind(this)}
                                >
                                    <div className="single-pic">
                                        <img src={item.preview_url} alt="" />
                                    </div>
                                    <div 
                                        style={{display:'none', backgroundImage: `url(/assets/toBoom/images/designManager/moreBtn.png)`}}
                                        className="more-btn"  
                                        data-type="show">
                                    </div>
                                    
                                    { item.is_release ? <div className="management-published">已发布</div> : null}
                                </div>

                                <p className="single-title">
                                    {
                                        item.title && item.title.length >= 20 ? item.title.slice(0, 20) + '...' : item.title
                                    }
                                </p>
                                <div className="delete-time"><i className="iconfont time"></i><span style={{marginLeft: 10}}>{item.updated_at}</span></div>
                            </div>
                          ))
                        }
                    </div>
                 </CheckboxGroup>
               
                <Row style={{ display : listStype == '1' ? 'block' : 'none', marginTop : 50, marginBottom : 160 }}>
                    <Col span={ 10 }> 
                        <Pagination 
                        showQuickJumper
                        showSizeChanger
                        hideOnSinglePage
                        total={count} 
                        current={ page }
                        pageSize={ limit }
                        //pageSizeOptions={['18','10', '20', '30', '40']}
                        showTotal={function(total,pageSize){
                            return `共${Number(count)}条`
                        }} 
                        onChange={ ( pageNumber ) => {
                            this.setState({ page : pageNumber }, () => {
                                let param =  this.getParams();
                                this.props.store.allWorksInfo.getAllWorksData(param);
                            }) 
                        }}
                        onShowSizeChange={(current, pageSize ) => {
                            this.setState({ limit: pageSize,page: 1 }, () => {
                                let param =  this.getParams();
                                this.props.store.allWorksInfo.getAllWorksData(param);
                            })
                                
                        }}
                        />
                    </Col>
                </Row>     
                {/* 图片展示列表  end */}


                
                   {/* 表格列表  start */}
                   <Table className="ant-table-custom-style ant-checkbox-custom-style"
                           style={{ display : listStype == '2' ? 'block' : 'none',  marginBottom:150}}
                           rowSelection={ {
                                selectedRowKeys,
                                onChange: this.onSelectChange,
                              }} 
                             columns={[ 
                                    {
                                        title: '文件名称',
                                        dataIndex: 'title',
                                        width : '50%'
                                        },
                                         {
                                        title: '最后修改日期',
                                        dataIndex: 'updated_at',
                                        width : '50%'
                                        }
                                  ]
                                } 
                                rowKey={'id'}
                                dataSource={ allworksList || [] } 
                                scroll={{  y : 550  }}
                                pagination={{
                                         current: Number(page), 
                                         pageSize: Number(limit),
                                         showQuickJumper: true,
                                         showSizeChanger: true,
                                         total :  Number(count),
                                     showTotal: function(total,pageSize){
                                         return `共${Number(count)}条`
                                     },
                                     onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                                        this.setState({ page : pageNumber }, () => {
                                            let param =  this.getParams();
                                            this.props.store.allWorksInfo.getAllWorksData(param);
                                        }) 
                                     },
                                     onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                            this.setState({ limit : pageSize }, () => {
                                                let param =  this.getParams();
                                              this.props.store.allWorksInfo.getAllWorksData(param);
                                            })
                                        }
                                     }}
                              
                                />    
                 {/* 表格列表  end */}

                    <div className="allworks-table-btn" style={{ display : showFooterBtn ? 'flex' : 'none' }}>
                        <div className="chosen-dec">
                         <Checkbox
                            className="ant-checkbox-custom-style"
                            style={{ marginLeft : '110px', visibility : ( listStype == '1' && allworksList.length > 0 )  ? 'visible' : 'hidden' }}
                            indeterminate={  this.state.indeterminate }
                            onChange={this.onCheckAllChange}
                            checked={  this.state.checkAll  }
                           >
                           <em style={{ fontFamily : 'uzi', fontSize : 18, color : '#000' }}>  全选 </em>
                           </Checkbox>
                            <span className="already-chosen">已选择<i className="already-chosen-num">{ selectedItems  }</i> 项</span>
                        </div>
                        <div className="chosen-handle">
                            <button type="button" className="cancel-chosen" onClick={ this.onCancelAction.bind(this) } ></button>
                            <button type="button" className="del-chosen" onClick={ this.deleteItemAction.bind(this) } ></button>
                        </div>  
                    </div>



                </div>
                 {/* end of allWorks-content */}



                {/* 成品发布MODAL start */}
                <ReleaseComponent
                    store={ this.props.store }
                    conformBinder={ this.release_conformBinder }
                    cancelBinder={ this.release_cancelBinder }
                    visiable={ releas_visiable }
                />
                {/* 成品发布MODAL MODAL end */}

                {/* 删除文件夹时 出错的MODAL Start */}
                <Modal
                    show={this.state.showDelete}
                    text={this.state.showDeleteFileErroMessage}
                    title="无法删除"
                    onConfirm={()=>{this.setState({showDelete: false})}}
                    onCancel={()=>{this.setState({showDelete: false})}}
                    onCross={()=>{this.setState({showDelete: false})}}
                    handleCross = {true}
                    hideCancel
                    //confirm
                    isAlert
                >
                </Modal>
                {/* 删除文件夹时 出错的MODAL End */}


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
                    //confirm
                    isAlert
                >
                </Modal>
                {/* 创建文件夹时 超过5层 和 同名的文件夹 的 报错弹窗 end*/}

                {/* 点击批量删除按钮 后 的 提示框  start */}
                <Modal
                    show={this.state.showBatchDeletePrompt}
                    title="删除"
                    onConfirm={this.deleteItemAction.bind(this, true)}
                    onCancel={()=>{this.setState({showBatchDeletePrompt: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    onCross={()=>{this.setState({showBatchDeletePrompt: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    handleCross = {true}
                    // hideCancel
                    //confirm
                >
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {/* <i className="iconfont jinggaotubiao" style={{fontSize:45}}></i> */}
                        <div style={{width:64,height:56}}>
                            <img src="/assets/toBoom/images/warn.png" alt="" style={{width:'100%',height:'100%'}}/>
                        </div>
                        <span style={{marginLeft:30,fontSize:18}}>
                            <p>
                                确定删除？
                            </p>
                            <p style={{fontSize:16,color:'#8e91a8'}}>
                                删除后, 您可以在回收站恢复
                            </p>
                        </span>
                    </div>
                </Modal>
                {/* 点击批量删除按钮 后 的 提示框  end */}

                {/* 批量删除 错误信息的弹框提示 start */}
                <Modal
                    show={this.state.showBatchDeleteErro}
                    text={this.state.showBatchDeleteErroMessage}
                    title="无法删除"
                    onConfirm={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    onCancel={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    onCross={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    handleCross = {true}
                    hideCancel
                    //confirm
                    isAlert
                >
                </Modal>
                {/* 批量删除 错误信息的弹框提示 end */}


                {/* 创建文件夹MODAL 开始 */}
                <Modal 
                    title="文件夹命名"
                    show={this.state.showModal}
                    onCancel={()=>{this.setState({showModal:false,collectionInputValue:''})}}
                    onCross={()=>{this.setState({showModal:false,collectionInputValue:''})}}
                    handleCross = {true}
                    onConfirm={this.handleSureAddFile.bind(this)}
                > 
                    <div className="collection-addFile-modal" style={{ marginLeft: 150 }}>
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
                {/* 创建文件夹MODAL 结束 */}



                {/* 文件夹MODAL 开始 */}
                <Modal 
                    title={fileModalInfo.title}
                    show={this.state.fileModalInfo.show}
                    onCancel={()=>{this.setState({ fileModalInfo: {...this.state.fileModalInfo, show: false }, inputValue:'' })}}
                    onCross={()=>{this.setState({ fileModalInfo: {...this.state.fileModalInfo, show: false }, inputValue:'' })}}
                    handleCross = {true}
                    onConfirm={this.handleConfirmAddFileEvent.bind(this)}
                >  
                    <div className="info-wrapper">
                        {/* {
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
                        } */}
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
                                        style={{border:'none', width:250, borderBottom:'2px solid #000', marginLeft:-245,}}
                                    />   
                                </div>
                            )
                        }     
                        {
                            fileModalInfo.type == 'delete' && (
                                <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    {/* <i className="iconfont jinggaotubiao" style={{fontSize:45}}></i> */}
                                    <div style={{width:64,height:56}}>
                                        <img src="/assets/toBoom/images/warn.png" alt="" style={{width:'100%',height:'100%'}}/>
                                    </div>
                                    <span style={{marginLeft:30,fontSize:18}}>
                                        删除后, 无法恢复此文件夹!
                                    </span>
                                </div>
                            )
                        }
                    </div>                      
                </Modal> 
                {/* 文件夹MODAL 结束*/}



                {/* 图片MODAL 开始 */}
                <Modal 
                    title={modalInfo.title}
                    show={this.state.modalInfo.show}
                    onCancel={()=>{this.setState({ modalInfo: {...this.state.modalInfo, show: false }, inputValue:'' })}}
                    onCross={()=>{this.setState({ modalInfo: {...this.state.modalInfo, show: false }, inputValue:'' })}}
                    onConfirm={this.handleConfirmAddFile.bind(this)}
                    handleCross = {true}
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
                        {
                            modalInfo.type == 'copy' && (
                                <div className="publish-modal common-edit-modal" style={{flexDirection: 'column',padding: '0 30px'}}>
                                    <div style={{ margin: '0px 0px 30px' }}>
                                        <label htmlFor="insertAreaName" style={{fontSize: 18}}>作 品 名 称 ：</label>
                                        <input 
                                            type="text" 
                                            placeholder="请填写名称" 
                                            value={modalInfo.item.title}
                                            onChange={this.inputBinder.bind(this)} 
                                            id="insertAreaName"
                                            className="file-input" 
                                            style={{border:'none',width: 250, borderBottom:'2px solid #000',}}
                                        />
                                    </div>
                                    <div >
                                        <label htmlFor="insertArea" style={{fontSize: 18}}>复制至文件夹：</label>
                                        <Cascader 
                                            options={ allWorksDirClone } 
                                            fieldNames={{children: 'child', label: 'title', value: 'id'}}
                                            onChange={this.onCopyPicPath.bind(this)} 
                                            changeOnSelect 
                                            style={{ width: '60%' }} 
                                            placeholder='请选择'
                                            expandTrigger='hover' //次级菜单的展开方式，可选 'click' 和 'hover'
                                            allowClear="true"
                                        />
                                    </div>
                                </div>
                            )
                        }
                        {
                            modalInfo.type == 'move' && (
                                <div className="publish-modal common-edit-modal" >
                                    <label htmlFor="insertArea" style={{fontSize: 18}}>移动至文件夹：</label>
                                    <Cascader 
                                        options={ allWorksDirClone } 
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
                            modalInfo.type == 'rename' && (
                                <div className="publish-modal common-edit-modal">
                                    <label htmlFor="insertArea" style={{fontSize: 18}}>作品名称：</label>
                                     <input 
                                        type="text" 
                                        placeholder="请填写名称" 
                                        value={modalInfo.item.title}
                                        onChange={this.inputBinder.bind(this)} 
                                        id="insertArea"
                                        className="file-input" 
                                        style={{border:'none',width: 250, borderBottom:'2px solid #000', marginLeft: -245}}
                                    />
                                    
                                </div>
                            )
                        }
                        
                        {
                            modalInfo.type == 'publish' && (
                                <div className="publish-modal common-edit-modal">
                                    {/* <div className="image-info">
                                        <img src={modalInfo.item.preview_url} />
                                        <p>{modalInfo.item.title}</p>
                                    </div> */}
                                    
                                    <div className="input-group">
                                        <label htmlFor="insertArea" style={{fontSize: 18}}> 
                                            发布状态：
                                            <Radio.Group onChange={this.onRadioChange.bind(this)} value={modalInfo.item.is_release}>
                                                <Radio value={0}>未发布</Radio>
                                                <Radio value={1}>已发布</Radio>
                                            </Radio.Group> 
                                        </label>        
                                   </div>                            
                                </div>
                            )
                        }
                        {
                            modalInfo.type == 'delete' && (                       
                                <div style={{display:'flex',justifyContent:'center',flexDirection:'column',padding:'0 110px',boxSizing:'border-box'}}>
                                    <p style={{marginLeft:30,fontSize:18,}}>
                                        确定删除？
                                    </p>
                                    <p style={{marginLeft:30,fontSize:16,color:'#8e91a8'}}>
                                        删除后, 您可以在回收站恢复
                                    </p>
                                </div>
                            )
                        }
                    </div>   
                </Modal>
                {/* 图片MODAL 结束 */}

                {/* 点击已发布的作品 弹出的弹出提示  start */}
                <Modal
                    show={this.state.showPublished}
                    text="图片状态为未发布时，即可进行修改。"
                    title="该作品已发布，无法修改"
                    onConfirm={()=>{this.setState({showPublished: false})}}
                    onCancel={()=>{this.setState({showPublished: false})}}
                    onCross={()=>{this.setState({showPublished: false})}}
                    handleCross = {true}
                    hideCancel
                    //confirm
                    isAlert
                >
                </Modal>
                {/* 点击已发布的作品 弹出的弹出提示  end */}


                {/* 文件夹:BEGIN */}       
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
                {/* 文件夹:END */}
               

                {/* 图片:BEGIN */}
                {
                    editInfo.isShow && createPortal(
                        <div className="detailed-btn-modal" onClick={this.btnClickModal.bind(this)}>
                            <div className="detailed-btn" style={{left: editInfo.pos.x, top: editInfo.pos.y}}>
                                <p className="copy-btn" data-type="copy">复制</p>
                                <p className="move-btn" data-type="move">移动</p>
                                <p className="rename-btn" data-type="rename">重命名</p>
                                <p className="download-btn" data-type="download">下载</p>
                                {/* <p className="publish-btn" data-type="publish"  >发布</p>
                                <p className="delete-btn" data-type="delete">删除</p> */}
                                {/* <p className="publish-btn" data-type="publish"  style={{display: toolState === 1 ? 'none' : 'block'}} >发布</p> */}
                                {
                                    userInfo && userInfo.is_private && (
                                        <p className="publish-btn" data-type="publish"  style={{display: toolState === 1 ? 'none' : 'block'}} >发布</p>
                                    )
                                }
                                <p className="delete-btn"  data-type="delete"  style={{ display : toolState === 1 ? 'none' : 'block' }}>删除</p>
                            </div>
                        </div>,
                        document.body
                    )
                }
                {/* 图片:BEGIN */}

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