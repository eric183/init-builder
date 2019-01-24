import React,{ Fragment } from 'react';
import * as mobx from 'mobx-react';
import * as defaultMobx from 'mobx';
import { MenuMoe } from '@/components/menu';
import { Table , Pagination , Row, Col, Checkbox, message, Cascader, Radio, Tooltip } from 'antd';
import { Modal }  from '@/components/modal';
import {createPortal} from 'react-dom';
import axios from 'axios';


import { DownLoadmethods } from '../../waterfall/waterfall'; 
import DownloadForm from '../../styleGallery/downloadForm';
import { PrivateModal, DownLoadProgres } from '@/components/modal';
import { ReleaseComponent } from '../management/releaseComponent';

const CheckboxGroup = Checkbox.Group;


 // 下载方法
 const DownLoadMethods = new DownLoadmethods();

//  const options = [{
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     children: [{
//       value: 'hangzhou',
//       label: 'Hanzhou',
//       children: [{
//         value: 'xihu',
//         label: 'West Lake',
//       }],
//     }],
//   }, {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     children: [{
//       value: 'nanjing',
//       label: 'Nanjing',
//       children: [{
//         value: 'zhonghuamen',
//         label: 'Zhong Hua Men',
//       }],
//     }],
//   },{
//     value: '哈哈',
//     label: '呵呵',
    
//   },];



@mobx.observer
export default class DesignRecentlyModify extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            ...props,
            show: false,
            showPublished: false,
            page : 1,
            limit : 18,
            selectedRowKeys : [],
            listStype : '1', // 是以图片列表或表格列表展现数据  1 == 图片列表 ， 2 == 表格列表
            checkedList: [],
            indeterminate: false,
            checkAll: false,
            editInfo: {
                isShow: false,
                item: {},
                pos: { x: 0, y: 0 }
            },
            modalInfo: {
                title: '文件夹命名',
                show: false
            },
            inputValue:'',
            releas_visiable : false,  // 发布弹窗状态

            front: false,
            modalShow : false,
            downloadProgressVisiable : false,
            percent : 0,

            allworksLastMoveId: '',
            allworksLastCopyId: '',

            showFooterBtn: false,
            showBatchDeleteErro: false,
            showBatchDeleteErroMessage: '',
            showDelete: false,
            showDeleteFileErroMessage: '',
            showBatchDeletePrompt: false,
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


    menuClick() {
        this.setState({
            show: true
        })
    }
    componentDidMount() {
        this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ limit : 18 });
        this.props.store.allWorksInfo.requestTags();
        this.props.store.allWorksInfo.getAllWorksDir();

         // 获取权限
         this.props.store.productManagementInfo.requestUserInfo((category) => {
              // category 有可能是空的
            category.length <= 0 ? category.push(' ') : '';
            this.setState({ category : category[0] });
            this.props.store.allWorksInfo.requestCategoryTags({ group : 'category', parent : JSON.stringify( category ) }); // 获取category标签

          });

    }


    // 点击单个作品
    // singleClick(object, index, event) {
    //     if( object.is_release == 0 )  location.hash = `/design-do?id=${object.id}`;  
    // }

    
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


    handleShowFooterBtn() {
        this.setState({
            showFooterBtn: !this.state.showFooterBtn
        })
    }



    // 批量 删除/取消删除作品
    deleteItemAction(ifDeleteRequest, event) {
        if(ifDeleteRequest.target) {
            let { selectedRowKeys, checkedList } = this.state;
            let  checkedIds = [];
            if( selectedRowKeys.length ) checkedIds = selectedRowKeys;
            if( checkedList.length )  checkedIds = checkedList;
            if( checkedIds.length ) {
                this.setState({
                    showBatchDeletePrompt: true,
                    checkedIds: checkedIds
                })
            }

        } else {
            this.props.store.designRecentlyModifyInfo.deleteItem({ ids : this.state.checkedIds }, (data) => { 
                // data.status_code
                if(data.status_code == 200) {
                    message.success('删除成功！');
                    this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ limit : 18 });
                    this.setState({
                        showBatchDeletePrompt: false,
                        selectedRowKeys : [],
                        checkedList: [],
                        indeterminate: false,
                        checkAll: false                
                    })
                } else {
                    //debugger
                    //alert('作品已发布，不能删除此作品');
                    this.setState({
                        showBatchDeletePrompt: false,
                        showBatchDeleteErro: true,
                        showBatchDeleteErroMessage: data.message,
                        // selectedRowKeys : [],
                        // checkedList: [],
                        // indeterminate: false,
                        // checkAll: false
                    })
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
 

    /* 图片列表、表格列表多选 start  */ 
    selectedPicItem = (checkedList) => {
        var { designRecentlyModifyList = [] } = defaultMobx.toJS(this.props.store.designRecentlyModifyInfo);
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < designRecentlyModifyList.length),
            checkAll: checkedList.length === designRecentlyModifyList.length,
          });
         
    }

    onCheckAllChange  = ( e ) => {
        var { designRecentlyModifyList = [] } = defaultMobx.toJS(this.props.store.designRecentlyModifyInfo),
             checkedList = designRecentlyModifyList.map(( item, index ) => item.id );

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

               console.log('download')


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
                //debugger;
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
        // debugger;

        if(modalInfo.type == 'download') return;
        request = await axios({
            url: postInfo.url,
            method: postInfo.method || 'post',
            data: postInfo.data && postInfo.data
        }).then(({data}) => {
            
            let designRecentlyModifyList = this.props.store.designRecentlyModifyInfo.designRecentlyModifyList;
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
           

            if (request_name == 'isPublish') {
                designRecentlyModifyList[modalInfo.index].is_release = designRecentlyModifyList[modalInfo.index].is_release == 0 ? 1 : 0;
            } else if (request_name == 'isCopy') {
                //debugger
                this.props.store.allWorksInfo.allWorksDir.forEach((item)=> {
                    if(item.id == this.state.allworksLastCopyId) {
                        item.resource_count++;
                    }
                })
            }else if (request_name == 'isMove') {

                this.props.store.allWorksInfo.allWorksDir.forEach((item)=> {
                    if(item.id == this.state.allworksLastMoveId) {
                        item.resource_count++;
                    }
                })   
            }else if (request_name == 'isRename') {
                designRecentlyModifyList[modalInfo.index].title = modalInfo.item.title;
            } else if (request_name == 'isDelete') {
                //debugger
                designRecentlyModifyList.splice(modalInfo.index, 1);
            } else if (request_name == 'isFolder') {
                this.props.store.designRecentlyModifyInfo.designRecentlyModifyList.unshift({
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
            this.props.store.allWorksInfo.setToolState( object.is_release )
            // debugger;
        } else {
            if(object.is_release == 0 ){
               // location.hash = `/design-do?id=${object.id}`
               let { origin, pathname } = location;
               window.open( origin + pathname + '#' + `/design-do?id=${object.id}` );
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


        } else if(event.target.dataset.type == 'publish'){  // 发布特殊处理

            this.onReleaseAction();
            this.props.store.allWorksInfo.setAttrsObject( this.state.editInfo.item );

        } else if( event.target.dataset.type == 'download' ) { //下载特殊处理

            this.onDownLoad( {} );

    
        }  else  {

            let modalInfo = {};
            switch(event.target.dataset.type) {
                case "copy":
                    modalInfo.title = '复制我的作品 ';
                    this.props.store.allWorksInfo.getAllWorksDir({ type: 'works',get_child: 'all'}, true);
                break

                case "move":
                    modalInfo.title = '移动我的作品';
                    this.props.store.allWorksInfo.getAllWorksDir({ type: 'works', get_child: 'all'}, true);
                break

                case "rename":
                    modalInfo.title = '重命名';
                break

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
    })
        console.log('发布动作！！！')  
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





    /* 发布弹窗事件 start  */

    release_conformBinder = ( values, callback ) => {

        let { singleItem } = values,
        keysArray = Object.keys( singleItem ),
        { page, limit, editInfo } = this.state,
        params = {
        ids : [ editInfo.item.id ],
        attrs : {},
        append : 0,
        is_release : 0 
    }

    keysArray.forEach(( key, index ) => {
        switch( key ){
            case 'release' : params.is_release = singleItem[key];
            break;
            case 'title' : params.title = singleItem[key];
            break;
            default:  singleItem[key] ?  params.attrs[key] = singleItem[key] : ''
        }
    });



    this.props.store.allWorksInfo.multi_edit_Mehtod( params, () => {
        callback();
        this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ limit : 18 });
    });


    }

    release_cancelBinder = () => {
        this.setState({ releas_visiable : false })
    }

    /* 发布弹窗事件 end  */




    //鼠标移入作品时 ,才显示 右上角的按钮图标.
    handleMouseEnterPic(object, index, event) {
        event.currentTarget.querySelector('.modify-more-btn').style.display = 'block';
    }
   

    //鼠标移出作品时 , 就隐藏掉 右上角的按钮图标.
    handleMouseLeavePic(object, index, event) {
        event.currentTarget.querySelector('.modify-more-btn').style.display = 'none';
    }






   /* 下载方法 start  */


    // 下载按键
    onDownLoad = (  ) => { 
  // 在此先拿图片ID去请求是否存有附图
  this.props.store.styleGalleryStore.request_annex( this.state.editInfo.item.id ).then(( { data } )=>{

        if( data.status_code == 200 ){
            
            this.setState({   modalShow :  true,   editInfo: { ...this.state.editInfo, isShow: false} });

            let { drawing_annex, master_annex } = data.data;
            let source_copy = Object.assign( this.state.editInfo.item, {}, true);
                source_copy.master_annex = master_annex;
                source_copy.drawing_annex = drawing_annex;

         var  formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
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
    

        }else{}
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
        this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单 
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
                this.setState({ downloadProgressVisiable : false, percent : 0 });
                clearInterval( this.timer );
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
        console.log(value,selectedOptions);
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




    render() {
        
        let {  
            front,
            fpng, 
            feps, 
            reverse,
            rpng, reps, 
            fpngDisable,
            fepsDisable,
            rpngDisable,
            repsDisable
            } = defaultMobx.toJS( this.get_formState );

        var { page, limit, listStype, selectedRowKeys, checkedList, indeterminate, checkAll } = this.state;
        var { designRecentlyModifyList } = defaultMobx.toJS(this.props.store.designRecentlyModifyInfo);
        var count = this.props.store.designRecentlyModifyInfo.get_modifiedCount;
        let { editInfo,modalInfo, releas_visiable, modalShow, downloadProgressVisiable, percent } = this.state;
        var selectedItems =  checkedList.length || selectedRowKeys.length;

        var toolState = this.props.store.allWorksInfo.get_toolState;
        //console.log(toolState)
        var { allworksList, allWorksDir, allWorksDirClone } = defaultMobx.toJS(this.props.store.allWorksInfo);
        var { userInfo } = defaultMobx.toJS(this.props.store.homePageInfo); 
        //console.log(allWorksDirClone);
        //console.log(allWorksDir);
        //console.log(count);

        return (
            <div className="recently-modify">

                <div className="recently-modify-pic">
                    <img src="/assets/toBoom/images/designManager/recentlyModifyPic.png" alt=""/>
                </div>  
        
                <div className="modify-menu design-menu">    
                    <div className="modify-menu-btn" onClick={this.menuClick.bind(this)}>
                        <img src="/assets/toBoom/images/designManager/menubtn.png" alt=""/>
                        <MenuMoe store={this.props.store} show={this.state.show} close={x=> {this.setState({show: false}) }}/>
                    </div>
                </div>

                <div className="modify-content">
                    <div className="modify-catalog">   

                        {/* <div className="modify-left"  style={{ visibility : ( listStype == '1' && designRecentlyModifyList.length > 0 )  ? 'visible' : 'hidden' }}>
                            <Checkbox
                                className="ant-checkbox-custom-style setBorderWidth"
                                indeterminate={  indeterminate }
                                onChange={this.onCheckAllChange}
                                checked={  checkAll  }
                            >
                                <em style={{ fontFamily : 'uzi', fontSize : 14, color : '#000', fontStyle : 'normal' }}>  全选 </em>
                            </Checkbox>
                        </div> */}
                           
                        <div className="modify-right" style={{ width : 128 }}>
                            {/* <div className="modify-search">
                                <input type="text" name="search" placeholder="search..."/>
                                <dir className="modify-search-pic"></dir>
                            </div> */}
                            <div className="modify-icon-btn">
                                <Tooltip placement="bottom" title={"批量管理"}>
                                    <i className="iconfont duoxuan" onClick={ this.handleShowFooterBtn.bind(this) }></i>
                                </Tooltip>

                                {/* 暂时隐藏，待下一版本  2018-11-26
                                <Tooltip placement="bottom" title={ listStype =='1' ? '列表显示' : '图片显示'}>
                                    {/* <i className="iconfont liebiaoxianshi" onClick={ this.switchListStyle }></i> 
                                    <i className={`iconfont ${listStype == '1' ? 'liebiaoxianshi' : 'Fill'}`} onClick={ this.switchListStyle }></i>
                                </Tooltip>
                                 */}

                                {/* <i className="iconfont align"></i>
                                <i className="iconfont align"></i> */}
                            </div>
                        </div>

                    </div> 


                 {/* 图片展示列表  start */}
                 <CheckboxGroup onChange={ this.selectedPicItem  } value={ checkedList } style={{ display : listStype == '1' ? 'block' : 'none' }} >
                    <div className="all-modify">
                      { designRecentlyModifyList && designRecentlyModifyList.map((item,index)=>(
                        <div  className="show-modify-dec cursor-style"  key={item.id} >

                            {/* <Checkbox value={ item.id } className="show-modify-checkbox ant-checkbox-custom-style"></Checkbox> */}
                            {
                                this.state.showFooterBtn &&  this.state.showFooterBtn ? (
                                    <Checkbox value={ item.id } className="show-modify-checkbox ant-checkbox-custom-style"></Checkbox>
                                ) : null
                            }
                            

                            <div 
                                className="single-modify" 
                                onClick={this.singleClick.bind(this, item, index)}
                                onMouseEnter={this.handleMouseEnterPic.bind(this,item,index)}
                                onMouseLeave={this.handleMouseLeavePic.bind(this,item,index)}
                            >
                                <div className="single-modify-pic" >
                                    <img src={item.preview_url} alt=""/>
                                </div>
                                <div 
                                    className="modify-more-btn" 
                                    style={{display:'none'}}
                                    data-type="show">
                                    <img src="/assets/toBoom/images/designManager/moreBtn.png" data-type="show" alt=""/>
                                </div>
                                {/* <div className="detailed-modify-btn" >
                                    <p className="modify-copy">复制</p>
                                    <p className="modify-move">移动</p>
                                    <p className="modify-rename">重命名</p>
                                    <p className="modify-download">下载</p>
                                    <p className="modify-publish">发布</p>
                                    <p className="modify-delete">删除</p>
                                </div> */}
                                { item.is_release ? <div className="modify-published">已发布</div> : null}
                            </div>
                            <p className="modify-title">{item.title}</p>
                             <div className="delete-time">
                                <i className="iconfont time"></i>
                                <span>{item.updated_at}</span>
                            </div>
                        </div>
                    ))
                    }
                    </div>
                    </CheckboxGroup>


                    <Row style={{ display : listStype == '1' ? 'block' : 'none', marginTop : 50, marginBottom : 160}}>
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
                                        this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ 
                                            page :pageNumber,  
                                            limit : this.state.limit 
                                        });
                                    }) 

                                }}
                                onShowSizeChange={(current, pageSize ) => {
                                    this.setState({ limit : pageSize, page: 1 }, () => {
                                        this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({
                                            limit : pageSize,
                                            page: 1 
                                        });
                                    })
                                }}
                                />
                            </Col>
                    </Row>     
                    {/* 图片展示列表  end */}


                    
                    {/* 表格列表  start */}
                    <Table className="ant-table-custom-style ant-checkbox-custom-style"
                        style={{ display : listStype == '2' ? 'block' : 'none', marginBottom: 150 }}
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
                        dataSource={ designRecentlyModifyList || [] } 
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
                                console.log(page);
                                this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ 
                                    page: pageNumber,  
                                    limit: this.state.limit 
                                });
                            }) 

                            },
                            onShowSizeChange: (current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                this.setState({ limit : pageSize, page: 1 }, () => {
                                    this.props.store.designRecentlyModifyInfo.getDesignRecentlyModifyData({ 
                                        limit : pageSize,
                                        page: 1
                                    });
                                })

                            }
                        }}
                              
                    />    
                    {/* 表格列表  end */}

                    {
                        this.state.showFooterBtn &&  this.state.showFooterBtn == true ? (
                            <div className="allworks-table-btn" >
                                <div className="chosen-dec" style={{display: 'flex'}}>
                                {/* <Checkbox
                                    className="ant-checkbox-custom-style"
                                    style={{ marginLeft : '110px', visibility : ( listStype == '1' && allworksList.length > 0 )  ? 'visible' : 'hidden' }}
                                    indeterminate={  this.state.indeterminate }
                                    // onChange={this.onCheckAllChange}
                                    // checked={  this.state.checkAll  }
                                >
                                    <em style={{ fontFamily : 'uzi', fontSize : 18, color : '#000' }}>  全选 </em>
                                </Checkbox> */}
                                    <div className="modify-left"  style={{ visibility : ( listStype == '1' && designRecentlyModifyList.length > 0 )  ? 'visible' : 'hidden',marginLeft: 100 }}>
                                    {/* <div className="modify-left"  style={{ marginLeft: 100 }}> */}
                                        <Checkbox
                                            className="ant-checkbox-custom-style setBorderWidth"
                                            indeterminate={  indeterminate }
                                            onChange={this.onCheckAllChange}
                                            checked={  checkAll  }
                                        >
                                            <em style={{ fontFamily : 'uzi', fontSize : 18, color : '#000', fontStyle : 'normal' }}>  全选 </em>
                                        </Checkbox>
                                    </div>
                                        <span className="already-chosen">已选择 <i className="already-chosen-num"> {selectedItems} </i> 项</span>
                                </div>

                                <div className="chosen-handle">
                                    <button 
                                        type="button" 
                                        className="cancel-chosen" 
                                        onClick={ this.onCancelAction.bind(this) } 
                                    >
                                    </button>
                                    <button 
                                        type="button" 
                                        className="del-chosen" 
                                        onClick={ this.deleteItemAction.bind(this)} 
                                    >
                                    </button>
                                </div>  
                            </div>
                        ) : null
                    }


                </div>  




                {/* 成品发布MODAL start */}
                <ReleaseComponent
                    store={ this.props.store }
                    conformBinder={ this.release_conformBinder }
                    cancelBinder={ this.release_cancelBinder }
                    visiable={ releas_visiable }
                />
                {/* 成品发布MODAL MODAL end */}


                {/* 点击已发布的作品 弹出的弹出提示  start */}
                <Modal
                    show={this.state.showPublished}
                    text="图片状态为未发布时，即可进行修改。"
                    title="该作品已发布，无法修改"
                    onConfirm={()=>{this.setState({showPublished: false})}}
                    onCancel={()=>{this.setState({showPublished: false})}}
                    onCross={()=>{this.setState({showPublished: false})}}
                    handleCross = {true}
                    hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
                {/* 点击已发布的作品 弹出的弹出提示  end */}

                 {/* 复制作品时  数量 已达到限制了 出错的MODAL Start */}
                 <Modal
                    show={this.state.showDelete}
                    text={this.state.showDeleteFileErroMessage}
                    title="作品复制"
                    onConfirm={()=>{this.setState({showDelete: false})}}
                    onCancel={()=>{this.setState({showDelete: false})}}
                    onCross={()=>{this.setState({showDelete: false})}}
                    handleCross = {true}
                    hideCancel
                    //hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
                {/*复制作品时  数量 已达到限制了 出错的MODAL End */}

                {/* 批量删除 错误信息的弹框提示 start */}
                <Modal
                    show={this.state.showBatchDeleteErro}
                    text={this.state.showBatchDeleteErroMessage}
                    title="删除"
                    onConfirm={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    onCancel={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    onCross={()=>{this.setState({showBatchDeleteErro: false, selectedRowKeys:[], checkedList:[],indeterminate:false, checkAll:false})}}
                    handleCross = {true}
                    hideCancel
                    //hideCancel={true}
                    //confirm={true}
                    isAlert
                >
                </Modal>
                {/* 批量删除 错误信息的弹框提示 end */}
                    
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
                        {/* {
                            modalInfo.type == 'copy' && (
                                <div className="publish-modal common-edit-modal">
                                    <label htmlFor="insertArea">复制我的作品：</label>
                                    <Cascader 
                                        options={ allWorksDirClone } 
                                        // fieldNames={{children: 'child', label: 'title', value: 'id'}}
                                        onChange={this.onCopyPicPath.bind(this)} 
                                        changeOnSelect 
                                        style={{ width: '65%' }} 
                                        placeholder='请选择'
                                        expandTrigger='hover' //次级菜单的展开方式，可选 'click' 和 'hover'
                                        allowClear="true"
                                    />
                                </div>
                            )
                        } */}
                         {
                            modalInfo.type == 'copy' && (
                                <div className="publish-modal common-edit-modal" style={{ flexDirection: 'column',padding: '0 30px'}}>

                                    <div style={{margin: '0px 0px 30px'}}>
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

                                    <div>
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
                                <div className="publish-modal common-edit-modal">
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
                                        style={{border: 'none',width: 250, borderBottom: '2px solid #000', marginLeft: -245}}
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
                                <Fragment>
                                    {/* <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>                   
                                        <div style={{width:64,height:56}}>
                                            <img src="/assets/toBoom/images/warn.png" alt="" style={{width:'100%',height:'100%'}}/>
                                        </div>
                                        <span style={{marginLeft:30,fontSize:18}}>
                                            删除后, 您可以在回收站恢复!
                                        </span>
                                    </div> */}
                                    <div style={{display:'flex',justifyContent:'center',flexDirection:'column',padding:'0 110px',boxSizing:'border-box'}}>
                                        <p style={{marginLeft:30,fontSize:18,}}>
                                            确定删除？
                                        </p>
                                        <p style={{marginLeft:30,fontSize:16,color:'#8e91a8'}}>
                                            删除后, 您可以在回收站恢复
                                        </p>
                                    </div>
                                </Fragment>
                               
                            )
                        }
                    </div>   
                </Modal>
                {/* 图片MODAL 结束 */}




                {/* 图片:BEGIN */}
                {
                    editInfo.isShow && createPortal(
                        <div className="detailed-btn-modal" onClick={this.btnClickModal.bind(this)}>
                            <div className="detailed-btn" style={{left: editInfo.pos.x, top: editInfo.pos.y}}>
                                <p className="copy-btn" data-type="copy">复制</p>
                                <p className="move-btn" data-type="move">移动</p>
                                <p className="rename-btn" data-type="rename">重命名</p>
                                <p className="download-btn" data-type="download">下载</p>
                                {/* <p className="publish-btn" data-type="publish">发布</p>
                                <p className="delete-btn" data-type="delete">删除</p> */}
                                {/* <p className="publish-btn" data-type="publish" style={{display: toolState === 1 ? 'none' : 'block'}}>发布</p> */}
                                {
                                    userInfo && userInfo.is_private && (
                                        <p className="publish-btn" data-type="publish" style={{display: toolState === 1 ? 'none' : 'block'}}>发布</p>
                                    )
                                }
                                <p className="delete-btn"  data-type="delete"  style={{display: toolState === 1 ? 'none' : 'block'}}>删除</p>
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
