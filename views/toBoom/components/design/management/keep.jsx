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
import { Table , Pagination , Row, Col, Checkbox, message } from 'antd';
const CheckboxGroup = Checkbox.Group;




@mobx.observer
export default class DesignManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            showModal: false,
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

            page : 1,
            limit : 50,
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
        }
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
            show: true
        })
    }
    componentDidMount() {
        // $(this.refs.clickContent).slick({
        //     infinite: true,
        //     slidesToShow: 5,
        //     slidesToScroll: 5
        // })
        this.props.store.swiperRecentlyModifyInfo.getSwiperRecentlyModifyData();
        this.props.store.allWorksInfo.getAllWorksData({
            limit: 50
        });
        this.props.store.allWorksInfo.getAllWorksDir();
        //debugger;
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
        this.setState(()=>({collectionInputValue: value}));
    }
    // 点击 确定按钮， 发送请求 把后台需要的数据 传给后台
    async handleSureAddFile() {
        //debugger;
        let request = await axios.post('api/toboom/folders',
            {
                title: this.state.collectionInputValue,
                type:'works',
                pid: this.state.storePid
            }
        ).then(({data})=>{
            //后台会返回数据给我们, 然后 我们把 刚才新建的文件夹 需要 的 东西 弄成一个对象 ,给 this.props.store.allWorksInfo.collectionDir这个数组里 放在 第一个位置 unshift,这样我们就做到了 我们点击新建文件>> 输入文件夹名称 >> 按确定 后 就会立即立马 渲染在页面上.
            this.props.store.allWorksInfo.allWorksDir.unshift({
                title: this.state.collectionInputValue,
                resource_count: 0,
                id: data.data.id
            })
            this.setState(()=>({
                showModal:false,
                collectionInputValue: ''
            }))
        },(error)=>{
            if(error.status == 410) {
                alert('文件夹名已存在!')
            }
        })
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

            //debugger;
            this.setState({
                historyDir: this.state.historyDir.slice(0, index + 1)
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
                    fileModalInfo.title = '确定删除?';
                break
                default: 
                    return
            }
            
            this.setState({
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
                alert('操作失败');
                
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
            alert("文件夹里还有文件夹 不能直接这样删");
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
                        x: rectInfo.x,
                        y: rectInfo.y
                    }
                }
            })
            console.log(object);
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

            break
            case "move":

            break
            case "download":

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
                debugger;
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
                alert('操作失败');
                return;
            }
            // debugger;

            if (request_name == 'isPublish') {
                allworksList[modalInfo.index].is_release = allworksList[modalInfo.index].is_release == 0 ? 1 : 0;
            } else if (request_name == 'isRename') {
                allworksList[modalInfo.index].title = modalInfo.item.title;
            } else if (request_name == 'isDelete') {
                debugger
                allworksList.splice(modalInfo.index, 1);
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
                alert('已发布的图片不能被删除');
        })
       
    }
    // .....单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//

   
    // .....点击单张图片的 若是点击右上角的按钮的话 会弹出详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作 ，否则 就是跳去 设计页。 开始 ..... //
    singleClick(object, index, event) {  
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
                        x: rectInfo.x,
                        y: rectInfo.y
                    }
                }
            })
            console.log(object);
            // debugger;
        } else {
            location.hash = `/design-do?id=${object.id}`;
        }    
    }
    // .....点击单张图片的 若是点击右上角的按钮的话 会弹出详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作 ，否则 就是跳去 设计页。 开始 ..... //
    
    // .....单张图片 右上角的 详细的操作按钮（复制、移动、重命名、下载、发布、删除） 操作。 开始 .....//
    btnClickModal(event) {
        if(event.target.parentElement.nodeName == "BODY") {
            document.body.style.overflow = 'auto';

            this.setState({
                editInfo: { ...this.state.editInfo, isShow: false}
            })
        } else {
            let modalInfo = {};
            switch(event.target.dataset.type) {
                case "copy":
                    modalInfo.title = '复制';
                break
                case "move":
                    modalInfo.title = '移动';
                break
                case "download":
                    modalInfo.title = '下载';
                break
                case "rename":
                    modalInfo.title = '重命名';
                break
                case "publish":
                    modalInfo.title = '发布';
                break
                case "delete":
                    modalInfo.title = '确定删除?';
                break
                default: 
                    return
            }      
            this.setState({
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

     this.props.store.allWorksInfo.getAllWorksData({ page : 1, limit: 50, folder_id : object.id });
}



    // 删除/取消删除作品
    deleteItemAction = () => { 

        let { selectedRowKeys, checkedList } = this.state;
        let  checkedIds = [];
        if( selectedRowKeys.length ) checkedIds = selectedRowKeys;
        if( checkedList.length )  checkedIds = checkedList;

         if( checkedIds.length ){
            this.props.store.allWorksInfo.deleteItem({ ids : checkedIds }, () => { 
                     message.success('删除成功！');
                     let param =  this.getParams();
                     this.props.store.allWorksInfo.getAllWorksData(param);
                 })
         }
 }
 onCancelAction = () => { 
       this.setState({
            selectedRowKeys : [],
            checkedList: [],
            indeterminate: false,
            checkAll: false
       })

 }



 // 关键词搜索
searchAction = () => {
     if( this.state.keywords ){
            this.setState({
                    page : 1,
                    limit : 50,
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
     }else{
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
                limit : 50,
                selectedRowKeys : [],
                listStype : '1',
                checkedList: [],
                indeterminate: false,
                checkAll: false,
                folder_id : '', 
                order : undefined, 
                order_type :  'asc', 
                order_icon : 'asc',
                timeOrder_icon : 'asc',
                keywords : undefined,
                is_overview : 0 
    };
   if(this.state.is_overview == 0 ){
            newState.is_overview = 1;
    }else{
            newState.is_overview = 0;
          
    }   

  this.setState(newState,() => {

      this.goDir({ pid: 0, title: '全部作品' }, 0);

      let param =  this.getParams();
      this.props.store.allWorksInfo.getAllWorksData(param);
  });

}



// 排序  时间排序 或 字母排序 【  首字母传：title  最后修改时间传：updated_at  】
orderBinder(type){

let { order_icon, timeOrder_icon  } = this.state,
      newState = { order :  type };
   if( type == 'title' ){
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
    }else{
        this.setState({
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            listStype : 1
         })
    }  

}








    render() {

        var { swiperRecentlyModifyList } = defaultMobx.toJS(this.props.store.swiperRecentlyModifyInfo);
        var { allworksList, allWorksDir } = defaultMobx.toJS(this.props.store.allWorksInfo);


        let { editInfo, modalInfo,fileModalInfo, selectedRowKeys, listStype, page,
            limit, checkedList, order_icon, timeOrder_icon, is_overview,
            keywords
            } = this.state;

       let count = this.props.store.allWorksInfo.get_allworksList_total;
       var selectedItems =  checkedList.length || selectedRowKeys.length;
       let fileEditInfo = this.state.fileEditInfo;


        console.log(allWorksDir);

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll: 5,

            variableWidth: true
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
                        <MenuMoe show={this.state.show} close={x=> {this.setState({show: false}) }}/>
                    </div>
                </div>

                <div className="recently-revised-content">

                    <div className="recently-revised-header">
                        <img src="/assets/toBoom/images/designManager/recentlyRevisedTitle.png" alt="" />
                    </div>

                    <div className="outermost-layer-swiper">

                        <div className="swiper-position-pic">

                            <img src="/assets/toBoom/images/designManager/swiperPositionPic.png" alt="" />
                        </div>

                        <div className="swiper-div">
                            <Slider {...settings}>
                                {
                                    swiperRecentlyModifyList && swiperRecentlyModifyList.map((item, index) => (
                                        <div className="single-recently-revised" key={index}>
                                            <div className="recently-revised-picture cursor-style">
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
                                        <div className="file-name cursor-style" key={index}>
                                            <span onClick={this.goDir.bind(this, dir, index)}>{dir.title}</span>
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
                                <input type="text" name="search" placeholder="search..." />
                                <div className="search-pic"></div>
                            </div>
                            <div className="icon-btn">
                                {/* <i className="iconfont duoxuan"></i> */}
                                <i className="iconfont wenjianjiaicon" onClick={ this.setOverview }></i>
                                <i className={['iconfont', timeOrder_icon  == 'asc' ?  'shijianpaixufanxiang' : 'shijianpaixu'].join(' ')}   onClick={ this.orderBinder.bind(this, 'updated_at') } ></i>
                                <i className={['iconfont', order_icon == 'asc' ?  'mingchengpaixufanxiang' : 'mingchengpaixu'].join(' ')} onClick={ this.orderBinder.bind(this, 'title') } ></i>
                                <i className="iconfont liebiaoxianshi" onClick={ this.switchListStyle }></i>
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
                                        <p title={dir.title}>{dir.title && dir.title.length >= 6 ? dir.title.slice(0,6)+'...' : dir.title}</p>
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
                                <Checkbox value={ item.id } className="show-pic-checkbox ant-checkbox-custom-style"></Checkbox>
                                <div className="single-show" onClick={this.singleClick.bind(this, item, index)}>
                                    <div className="single-pic">
                                        <img src={item.preview_url} alt="" />
                                    </div>
                                    <div 
                                        style={{backgroundImage: `url(/assets/toBoom/images/designManager/moreBtn.png)`}}
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
                            </div>
                          ))
                        }
                    </div>
                 </CheckboxGroup>


                    <Row style={{ display : listStype == '1' ? 'block' : 'none', marginTop : 50 }}>
                      <Col span={ 10 }> 
                          <Pagination 
                            showQuickJumper
                            showSizeChanger
                            hideOnSinglePage
                            total={count} 
                            current={ page }
                            pageSize={ limit }
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
                                this.setState({ limit : pageSize }, () => {
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
                           style={{ display : listStype == '2' ? 'block' : 'none' }}
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
                                        title: '创建时间',
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


        
                     <div className="allworks-table-btn">
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
                            <button type="button" className="cancel-chosen" onClick={ this.onCancelAction } ></button>
                            <button type="button" className="del-chosen" onClick={ this.deleteItemAction  } ></button>
                        </div>  
                    </div>

                </div>
                 {/* end of allWorks-content */}





                {/* 创建文件夹MODAL 开始 */}
                <Modal 
                    title="文件夹命名"
                    show={this.state.showModal}
                    onCancel={()=>{this.setState({showModal:false,collectionInputValue:''})}}
                    onConfirm={this.handleSureAddFile.bind(this)}
                    > 
                    <div className="collection-addFile-modal">
                        <div>
                            <label htmlFor="insertArea"> 文件夹名称：</label>
                            <input 
                                type="text" 
                                placeholder="请填写" 
                                value={this.state.collectionInputValue}
                                onChange={this.handleGetInputChange.bind(this)} 
                                id="insertArea"
                                className="collection-file-input"
                                />
                        </div>
                    </div>
                </Modal>
                {/* 创建文件夹MODAL 结束 */}


                {/* 文件夹MODAL 开始 */}
                <Modal 
                    title={fileModalInfo.title}
                    show={this.state.fileModalInfo.show}
                    onCancel={()=>{this.setState({ fileModalInfo: {...this.state.fileModalInfo, show: false }, inputValue:'' })}}
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
                                    <label htmlFor="insertArea">文件名称：</label>
                                    <input 
                                        type="text" 
                                        placeholder="请填写名称" 
                                        value={fileModalInfo.item.title}
                                        onChange={this.fileInputBinder.bind(this)} 
                                        id="insertArea"
                                        className="file-input" />   
                                </div>
                            )
                        }     
                        {
                            fileModalInfo.type == 'delete' && (
                                <p>
                                    无法恢复哟!
                                </p>
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
                        {
                            modalInfo.type == 'rename' && (
                                <div className="publish-modal common-edit-modal">
                                    <label htmlFor="insertArea">图片名称：</label>
                                    <input 
                                        type="text" 
                                        placeholder="请填写名称" 
                                        value={modalInfo.item.title}
                                        onChange={this.inputBinder.bind(this)} 
                                        id="insertArea"
                                        className="file-input" />
                                    
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
                                        <label htmlFor="insertArea"> 
                                        
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
                                <p>
                                    无法恢复哟!
                                </p>
                            )
                        }
                    </div>   
                </Modal>
                {/* 图片MODAL 结束 */}


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
                                <p className="publish-btn" data-type="publish">发布</p>
                                <p className="delete-btn" data-type="delete">删除</p>
                            </div>
                        </div>,
                        document.body
                    )
                }
                {/* 图片:BEGIN */}
                
            </div>
        )
    }
} 