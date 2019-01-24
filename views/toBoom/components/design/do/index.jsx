import React from 'react';
import ReactDOM from 'react-dom';

import { observer } from 'mobx-react';
import * as defaultMobx  from 'mobx';

import Draw from './draw';
import Album from './album';
import TopBar from './topbar';


import { MaterialModal, Modal, DownLoadProgres, PrivateModal } from '@/components/modal';
import { SearchTool } from '@/components/search';
import { DownLoadmethods } from '../../waterfall/waterfall'; 

import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';

import DownloadForm from '../../styleGallery/downloadForm';

import { message, Form, Input, TreeSelect, Cascader } from 'antd';

const FormItem = Form.Item;

import axios from 'axios';
import qs from 'qs';


const DownLoadMethods = new DownLoadmethods();

// export default class Test extends React.Component {
//     render() {
//         return (
//             <div className="john">
//                 fasdlfjasldkfjalkdjklaf
//             </div>
//         )
//     }
// }


@observer
export default class DesignDo extends React.Component {
    constructor(props) {
        super();
        let EXT = /\d+/.exec(props.location.search);
        this.timer = "";
        this.seconds = 10000;
        this.page = 2;
        this.counter = 1;
        this.state = {
            hasInit: 0,
            createEvent: false,
            savePrompt: false,
            // resourceId: EXT ? EXT[0] : '',
            saveOrNot: false,
            isCreate: false,
            resourceId: EXT ? EXT[0] : '',
            drawings: "",
            frontCanvas: {},
            backCanvas: {},
            chosenJson: '',
            selectInfo: {
                objects: [],
                index: []
            },
            undo: [],
            redo: [],
            fileInfo: {
                title: '未命名作品'
            },
            
            requestStrings: [],
            showNoGoDesign: false,
            downloadShow: false,
            canvasJSON: {
                front: JSON.stringify({
                    "version": "2.3.3",
                    "objects": []
                }),
                back: JSON.stringify({
                    "version": "2.3.3",
                    "objects": []
                })
            },
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 start */}
            isShowPowerModal: false,
            powerModalContent: '',
            // {/* 试用权限 下载次数达到了10次 就弹出弹窗提示 end */}
        }
        this.setCanvasJSON = this.setCanvasJSON.bind(this);
        this.alertBinder = this.alertBinder.bind(this);
    }
   
    intervalPost() {
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(()=> {
            this.saveCanvas().then(()=> {
                      console.log('保存成功');
            });
        }, this.seconds)
    }

     // 向画布添加新的作品【替换画布当前作品】
    addObject(object) {
           this.refs.refContent.addObject(object);
    }

    topBarBinder(event) {

        // console.log(event.target.dataset.fire);
        this.refs.refContent.refs.drawContent[event.target.dataset.fire]();
    }

    saveBinder(object) {
        let drawContent = this.refs.refContent.refs.drawContent;

        this.setState({
            selectInfo: {
                objects: drawContent.state.chosenJson == 'front' ? this.state.frontCanvas.getActiveObjects() : this.state.backCanvas.getActiveObjects()
            },
            chosenJson: drawContent.state.chosenJson,
            undo: drawContent.undo[drawContent.state.chosenJson],
            redo: drawContent.redo[drawContent.state.chosenJson]
        })
        // debugger;
    }

    fabricInit(object, callback) {
        this.setState({
            frontCanvas: object[0],
            backCanvas: object[1]
        })
    }

    // 保存画布
    onSave() {
    

        let base64Image = this.state.frontCanvas.toDataURL({format: 'png'});
        let backImage = this.state.backCanvas.toDataURL({format: 'png'});


        // return axios.post('/api/toboom/uploads', {
        //     // id: this.,
        //     resource_id: this.state.resourceId,
        //     file: base64Image
        // }).then(({data})=> {

        //     if (data.status_code == 200) {
        //         this.props.history.push(`/design-do?id=${data.data.resource_id}`);
        //         this.setState({ resourceId: data.data.resource_id});     
        //         // return Promise.resolve(data.data.resource_id);
        //     } else {
        //         alert(data.message);
        //     }
        // })
        // debugger;

        return Promise.all([
            axios.post('/api/toboom/uploads', {
            // id: this.,
                resource_id: this.state.resourceId,
                file: base64Image
            }), 
            axios.post('/api/toboom/uploads', {
        // id: this.,
                resource_id: this.state.drawings,
                file: backImage
            })]).then((data)=> {
                // debugger;

                if(data[0].data.status_code == 200) {
                    this.props.history.push(`/design-do?id=${data[0].data.data.resource_id}`);
                    this.setState({ resourceId: data[0].data.data.resource_id });
                    // return Promise.resolve(data.data.resource_id);
                } else {
                    alert(data.message);
                }

                if(data[0].data.status_code == 200) {
                    this.setState({ drawings: data[1].data.data.resource_id });
                    // return Promise.resolve(data.data.resource_id);
                } else {
                    alert(data.message);
                }

                return Promise.resolve()
            })
    }



    saveCanvas(resourceId) {
        let drawContent = this.refs.refContent.refs.drawContent;
        // console.log(JSON.stringify(drawContent[drawContent.state.stateJSON]));
        
        // let defineObject = { ...drawContent.stateJSON,
        //     fabricInfo: {
        //         width: drawContent.contentObject.width,
        //         height: drawContent.contentObject.height,
        //     }
        // };
        // debugger;
        // debugger;
        let defineObject = { ...this.state.canvasJSON, fabricInfo: {
            width: this.state.frontCanvas.width,
            height: this.state.frontCanvas.height,
        }};

        // if (this.state.fileInfo.title == '未命名作品') {
        //     return Promise.reject('标题不能为空!');
        // }
        // debugger;
        return axios.put(`/api/toboom/works/${this.state.resourceId}`, {
            
            data: JSON.stringify({
                drawings: this.state.drawings,
                title: this.state.fileInfo.title,
                canvasInfo: encodeURI(JSON.stringify(defineObject)),
                materials: this.state.frontCanvas.getObjects().map(x => x.definedObject.id),
                folder_id: this.state.allworksLastCopyId
            })
            
        }).then(({data})=> {
            // debugger;

            if(data.status_code != 200) {
                return Promise.reject(data);
            }
        })
    }




    saveAll(isClose) {
        // Promise.all([this.onSave()]).then((data)=> {
        //     debugger;

        //     //保存成功，清除计时器
        // })

       
        return new Promise((resolve)=> {

        
            this.onSave().then((data)=> {
                this.saveCanvas(data).then((data, john)=> {

                    if(isClose) {
                        resolve();
                        return Promise.resolve();
                    }
                    alert('保存成功');

                }).catch((reject)=> {
                    // debugger;
                    
                    // alert(reject.message);
                    this.setState({
                        showNoGoDesign: true
                    });
                    return Promise.reject();
                })
            });

        })
        // this.intervalPost();
    }


    setCanvasJSON(object, callback) {
        this.setState({
            canvasJSON: object
        },() => {
            callback && callback();
        });
    }


    // ```````````2018-12-18 11:31 lsh 注释掉的````start`````````````
    // checkPower(){
    //     let userInfo = this.props.store.homePageInfo.userInfo
    //     if(typeof userInfo.is_binding  === 'undefined'){
    //         store.globalInfo.modalShow("请登录", 401);
    //         return false
    //     }else if(! userInfo.is_binding){
    //         store.globalInfo.modalShow("电脑未绑定!", 406)
    //         return false
    //     }else if( userInfo.category.length == 0){
    //         store.globalInfo.setCategary('');
    //         store.globalInfo.modalShow("没有权限!", 403)
    //         return false
    //     }
    //     return true
    // }
    // ```````````2018-12-18 11:31 lsh 注释掉的````end`````````````
    // ```````````2018-12-18 11:31 lsh 增加了 userInfo.is_try 的判断````start`````````````
    checkPower(){
        let userInfo = this.props.store.homePageInfo.userInfo
        console.log(userInfo);

        if(typeof userInfo.is_binding  === 'undefined'){
            store.globalInfo.modalShow("请登录", 401);
            return false
        }else if( !userInfo.is_try && !userInfo.is_binding){
            store.globalInfo.modalShow("电脑未绑定!", 406)
            return false
        }else if( userInfo.category.length == 0){
            store.globalInfo.setCategary('');
            store.globalInfo.modalShow("没有权限!", 403)
            return false
        }
        return true
    }
    // ```````````2018-12-18 11:31 lsh 增加了 userInfo.is_try 的判断````end`````````````

    download() {
        if(!this.checkPower()) return ;
        this.saveAll(true).then(()=> {
             this.setState({
            downloadShow: true,
            // editInfo: { ...this.state.editInfo }

        })

        let _object = {
            drawing_annex: 1, 
            master_annex: 1,
            id: this.state.resourceId,
        }

        let { drawing_annex, master_annex } = _object,
            formState = defaultMobx.toJS( this.props.store.styleGalleryStore.formState );
            formState = Object.assign( formState, {
                checkboxSource: _object,
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

        })

       




        // let a = document.createElement('a');
        // a.download = 'name';
        // a.href = this.state.frontCanvas.toDataURL({format: 'png'});
        // a.click()
        // this.refs.iframeDOM.src = this.state.frontCanvas.toDataURL({format: 'png'});
    }
    keyFirer(event) {
        // debugger;
        if(event.keyCode == 13) {
            this.saveAll();
        }
    }
    resetCanvases() {
        // debugger;

                    // this.setState({
                    //     hasInit: resourceId,
                    // })
        this.setState({
            savePrompt: true,
            // savePrompt: true,
            // createEvent: true
        })
        
        // this.refs.refContent.refs.drawContent.resetCanvases();

        // this.setState({
        //     resourceId: '',
        //     drawings: '',
        //     fileInfo: {
        //         title: '未命名作品'
        //     }
        // })
    }
    newCanvas() {
        this.refs.refContent.refs.drawContent.resetCanvases();

        this.setState({
            resourceId: '',
            // saveOrNot: true,
            drawings: '',
            fileInfo: {
                title: '未命名作品'
            }
        })
        // debugger;

    }

    getJSON(resourceId) {

        return axios.get(`/api/toboom/works/${resourceId}`).then(({
            data
        }) => {
            // debugger;
            if (data.status_code == 200) {
                let qsInfo = qs.parse(this.props.location.search.slice(1));
                if (qsInfo.isCreate) {
                    // debugger;
                    this.props.history.replace('/design-do');
                    let compileObject = data.data;
                    compileObject.title = '未命名作品'
                    this.setState({
                        fileInfo: data.data,
                        resourceId: "",
                        isCreate: true
                        // drawings: data.data.drawings
                        // drawings: data.data.back_image[0] && data.data.back_image[0].id || ''
                    });
                } else {
                    // debugger;
                    this.setState({
                        fileInfo: data.data,
                        // resourceId: ""
                        // drawings: data.data.drawings
                        drawings: data.data.back_image[0] && data.data.back_image[0].id || ''
                    });
                }

                return Promise.resolve(data.data);
            }
        })
    }

    confirmStore() {
        // if(!this.state.createEvent) {
            // }
        this.saveAll(true).then(()=> {

            this.fetchProductData(this.state.hasInit);
        })
        this.setState({
            saveOrNot: false,
        })
    }

    cancelStore() {
        // debugger;
        // if(!this.state.createEvent) {
        // debugger;
        // this.fetchProductData(this.state.hasInit, true)

        //   this.fetchProductData(this.state.hasInit);  仅仅关闭弹窗就行，不用替换

        this.setState({
            saveOrNot: false,
        })
        // }
        // this.setState({
        //     saveOrNot: false,
        // })


    }



    crossStore() {
        // debugger;
        this.setState({
            saveOrNot: false,
        })
    }
    getProduct(resourceId) {

        // debugger;

        // if(this.state.hasInit) {
        //     // debugger;
        //     this.setState({
        //         saveOrNot: showRightModal,
        //         hasInit: resourceId,
        //         createEvent: false
        //     });
        //     if(!skipVal) return;
        // }
        // debugger;
        this.setState({
            saveOrNot: true,

            // savePrompt: true,
            hasInit: resourceId,
        })


    }

    fetchProductData(resourceId) {
        let drawContent = this.refs.refContent && this.refs.refContent.refs.drawContent;

        return new Promise((resolve) => {
            this.getJSON(resourceId || this.state.resourceId).then((data) => {
                let canvasJSON = !!data.canvasInfo ? JSON.parse(decodeURI(data.canvasInfo)) : this.state.canvasJSON
                if (drawContent) {
                    // debugger;
                    this.newCanvas();
                    this.setCanvasJSON(canvasJSON)
                    // debugger;
                    drawContent.loadHandler(canvasJSON, () => {
                        // debugger;
                        

                        this.props.history.replace(`/design-do?id=${resourceId}`);
                        this.setState({
                            resourceId: resourceId,
                            saveOrNot: false,

                            fileInfo: {
                                title: data.title
                            },
                        })


                        // console.log('替换ok')
                    });
                    resolve();
                } else {
                    resolve(canvasJSON);
                }

            })
        });
    }

    fileNameBinder(event) {
        this.setState({
            fileInfo: { ...this.state.fileInfo, title: event.target.value.trim() }
        })
    }
    focusBinder(event) {
        if(event.target.value != '未命名作品') return;
        
        this.setState({
            fileInfo: { ...this.state.fileInfo, title: '' }
        })
    }
    blurBinder(event) {
        if(!event.target.value.trim()) {
            this.setState({
                fileInfo: { ...this.state.fileInfo, title: '未命名作品' }
            })
        }

        this.saveAll();
       // this.saveCanvas(this.state.resourceId);
        
    }
    

 /*   下载 start   */

    // 下载进度条
    downloadProgress_confirm = () => {
        //  this.setState({ downloadProgressVisiable : false });
    }


    downloadProgress_cancel = () => {

            clearInterval( this.timer );

            this.setState({ downloadProgressVisiable : false, percent : 0, downloadShow :  false, modalShow: false });

            DownLoadMethods.break_off(); // 中断下载请求

            this.props.store.styleGalleryStore.resetFieldsValue();  // 重置下载表单 

    }


    // 模拟加载进度
    downloadprogress_animation = () =>{
        var rnd = function(n, m) {
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



    confirmBinder = () => {

        let formState = defaultMobx.toJS(this.props.store.styleGalleryStore.formState),
            {
                checkboxSource,
                frontChoose,
                reverseChoose,
                front,
                reverse
            } = formState,
            param = {
                category: this.state.category,
                resource_id: [],
                angle: []
            };

        if (front && frontChoose.length > 0) {
            param.resource_id.push(checkboxSource.id)
            param.angle.push({
                angle: 'front',
                format: frontChoose
            })
        }

        if (reverse && reverseChoose.length > 0) {
            // 不需要加上反面ID, 如果未选正面，则
            param.resource_id.length <= 0 ?  param.resource_id.push( checkboxSource.id ) : '';
            param.angle.push({
                angle: 'back',
                format: reverseChoose
            })
        }

        if (param.resource_id.length) { // 下载

            this.downloadprogress_animation(); // 模拟加载进度  


            this.setState({ downloadShow : false, modalShow: false,  downloadProgressVisiable: true}); 
    

            DownLoadMethods.fireRequestAction(param, (data) => { // data 可能是请求成返回的数据，也有可能是 error 对象；
              
                if (data.status_code && data.status_code == 200) {

                       window.location.href = data.data.downloadUrl;

                } else {

                    message.warning('下载失败！');

                }

                  // 清空进度条定时器
                   clearInterval( this.timer );

                     // 关闭进度条
                   this.setState({  downloadProgressVisiable : false,  percent: 0});


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


    cancelBinder = () => {
        clearInterval(this.timer);
        this.setState({
            downloadShow: false
        });
        this.props.store.styleGalleryStore.resetFieldsValue(); // 重置下载表单
    }



     /*   下载 end   */



    alertBinder(e) {
            // alert('safdsa');
            fileInfo: {
            title: '未命名作品'
        }
        
        var message = 'some word';

        if(this.state.fileInfo.title != '未命名作品') {
            this.saveAll(true);
        }
        e = e || window.event;

        if (e) {
            e.returnValue = message;
        }
        return message;
        
    }
    noRightPopout() {
        
        return new Promise((resolve)=> {
            alert('无权限!');
            resolve();
        })
    }

    handleConfirmAddFile() {
        // console.log('dsafa');

        this.saveAll();
        this.setState({
            showCascader: false
        })
    }
    onCopyPicPath(value, selectedOptions) {
        // console.log(value, selectedOptions);
        // console.log(value);
        
        
        this.setState({
            allworksLastCopyId: value[value.length - 1],
            checkout: value
        })

        //console.log(this.state.allworksLastCopyId);
    }
    
    doSave() {
        this.setState({
            showCascader: true,
            checkout: [],
        });
    }

    sp_confirmBinder = ( event ) => {
            // 通过ID获取完整数据
        this.saveAll(true).then(()=> {
            this.props.history.replace('/design-do');
            this.setState({
                savePrompt: false
            });
            this.newCanvas();
        })

        

        // this.setState({
        //     savePrompt: false
        // })
    }

    sp_cancelBinder = () => {
        this.props.history.replace('/design-do');

        this.setState({
            savePrompt: false
        });
        this.newCanvas();
    }

    sp_crossBinder = () => {
        this.setState({
            savePrompt: false
        });
    }





 _setElements_height(){
         // 兼容 safari 浏览器
          let drawWrapper =  document.querySelector('.draw-wrapper'),
              contentWrapper =  document.querySelector('.content-wrapper'),
              albumWrapper =  document.querySelector('.album-wrapper'),
              albumTop =  document.querySelector('.album-top'),
              album_list_wrapper =  document.querySelector('.album-list-warpper');

              drawWrapper.style.height = contentWrapper.clientHeight + 'px';
              albumWrapper.style.height = contentWrapper.clientHeight + 'px';
              album_list_wrapper.style.height = (contentWrapper.clientHeight - albumTop.clientHeight) + 'px'  
   }





    componentDidMount() {

        this._setElements_height();  // 兼容 safari 浏览器

        // !this.state.resourceId && this.onSave();
        // this.props.store.allWorksInfo.getAllWorksDir();
        this.props.store.allWorksInfo.getAllWorksDir({ type: 'works', get_child: 'all'}, true);


        this.props.store.collectionListInfo.getCollectionListData();
       
        // 获取所有标签  【初始化默认是廓形】
        this.props.store.editorStore.fetchEditAllTags({ type : 'contour', associate : true });

        // 获取历史修改
        this.props.store.editorStore.fetchHistoy();

        window.addEventListener('beforeunload', this.alertBinder, false);

        // this.intervalPost();
        
    }


    componentWillUnmount() {
        
        this.props.store.editorStore.clearData();
        window.removeEventListener('beforeunload', this.alertBinder, false);
    }


    render() {
        // let { objects } = this.state;

        var { collectionList } = defaultMobx.toJS(this.props.store.collectionListInfo);
        var { allWorksDirClone, allWorksDir } = defaultMobx.toJS(this.props.store.allWorksInfo);  


        return (
            <div className="design-wrapper" ref="mainRoot">

                 <TopBar 
                    {...this.state}
                    canvas={this.state.chosenJson == 'front' ? this.state.frontCanvas : this.state.backCanvas}
                    history={this.props.history}
                    resetCanvases={this.resetCanvases.bind(this)}

                    // newCanvas={this.newCanvas.bind(this)}
                    topBarBinder={this.topBarBinder.bind(this)}
                    onSave={this.doSave.bind(this)}
                    onDownload={this.download.bind(this)}
                    // frontCanvas={this.state.frontCanvas}
                >
                    <input 
                        type="input" 
                        value={this.state.fileInfo.title} 
                        onChange={this.fileNameBinder.bind(this)}
                        onKeyUp={this.keyFirer.bind(this)}
                        onFocus={this.focusBinder.bind(this)}
                        onBlur={this.blurBinder.bind(this)}
                        />
                </TopBar>

                <ContentWrapper 
                    { ...this.props}
                    ref="refContent"
                    canvasJSON={this.state.canvasJSON}
                    getProduct={this.getProduct.bind(this)}
                    fetchProductData={this.fetchProductData.bind(this)}
                    setCanvasJSON={this.setCanvasJSON}
                    getJSON={this.getJSON.bind(this)}
                    noRightPopout={this.noRightPopout.bind(this)}
                    isCreate={this.state.isCreate}
                    resourceId={this.state.resourceId}
                    onSave={this.onSave.bind(this)}
                    fabricInit={this.fabricInit.bind(this)}
                    saveBinder={this.saveBinder.bind(this)}
                />

                <iframe ref="iframeDOM" style={{display: 'none'}}></iframe>

            
                 <Modal
                    show={this.state.showNoGoDesign}
                    text="已达到作品数量限制"
                    title="温馨提醒您"
                    onConfirm={()=>{this.setState({showNoGoDesign: false})}}
                    onCancel={()=>{this.setState({showNoGoDesign: false})}}
                    hideCancel
                    isAlert
                >
                </Modal>



                 <Modal
                    show={ this.state.savePrompt }
                    title="新建设计"
                    onConfirm={ this.sp_confirmBinder }
                    onCancel={  this.sp_cancelBinder }
                    onCross={  this.sp_crossBinder }
                    confirmText = "是"
                    cancelText = "否"
                    handleCross
                >
                    <dl className="savePrompt">
                        <dt>是否保存当前作品？</dt>
                        <dd>请保存当前作品,以免丢失修改内容</dd>
                    </dl>
                
                </Modal>


                <Modal
                    show={ this.state.saveOrNot }
                    title="使用新作品"
                    onConfirm={ this.confirmStore.bind(this) }
                    onCancel={  this.cancelStore.bind(this) }
                    onCross={ this.crossStore.bind(this)}
                    handleCross
                   >
                    <dl className="savePrompt">
                        <dt>是否使用新作品？</dt>
                        {/* <dd>请先手动保存当前作品，以免丢失</dd>  */}
                    </dl>
                
                </Modal>


               
                <Modal 
                    title="保存作品"
                    show={this.state.showCascader}
                    onCancel={()=>{this.setState({ showCascader: false, inputValue:'' })}}
                    onConfirm={this.handleConfirmAddFile.bind(this)}
                    onCross={()=>{this.setState({ showCascader: false, inputValue:'' })}}
                    handleCross
                > 
                 <div className="input-modal common-edit-modal" >
                        <label htmlFor="text_input" style={{fontSize: 18}}>作品名：</label>

                        <input 
                            type="input" 
                            id="text_input"
                            value={this.state.fileInfo.title} 
                            onChange={this.fileNameBinder.bind(this)}
                            onKeyUp={this.keyFirer.bind(this)}
                            onFocus={this.focusBinder.bind(this)}
                            // onBlur={this.blurBinder.bind(this)}
                            />
                    </div>
                    <div className="publish-modal common-edit-modal" >
                        <label htmlFor="insertArea" style={{fontSize: 18}}>保存至文件夹：</label>
                        <Cascader 
                            options={ allWorksDirClone } 
                            value={this.state.checkout}
                            fieldNames={{children: 'child', label: 'title', value: 'id'}}
                            onChange={this.onCopyPicPath.bind(this)}
                            changeOnSelect = {true}
                            style={{ width: '60%' }}
                            placeholder='请选择'
                            // 2018-12-21 16:18 
                            expandTrigger='click' //次级菜单的展开方式，可选 'click' 和 'hover'
                            //expandTrigger='hover'
                            allowClear="true"
                        />
                    </div>

                </Modal>
                

                <PrivateModal 
                    title="选择下载文件"
                    show={ this.state.downloadShow }
                    style={{ width : 616 }}
                    classname="donwloadModal"
                    onConfirm={ this.confirmBinder }
                    onCancel={ this.cancelBinder }
                    confirmDisabled={ this.get_confirmDisable } 
                >
                    <DownloadForm store={ this.props.store } />
                </PrivateModal>

                <DownLoadProgres
                    title="下载进度"
                    show={ this.state.downloadProgressVisiable  }
                    style={{ width : 616 }}
                    onConfirm={ this.downloadProgress_confirm }
                    onCancel={  this.downloadProgress_cancel  }
                    percent={ this.state.percent }
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






@observer
class ContentWrapper extends React.Component {
    constructor() {
        super();
        this.page = 1;
    }
    state = {
        validateStatus : 0,
        inputvalue : '',
        selectedvalues : undefined,  // string/string[]
        saveInputs : false,
        savePrompt : false,
        modalShow: false,
        goTransition: false,
        // showHistory: false, //2018-12-06 lsh 增加的
        showHistory: true, //2018-12-06 lsh 注释掉的
        requestStrings: [],

        hideSearch: true,
        selectContourPic: true,
        selectWorksPic: false,
        selectPartPic: false,
        selectLogPic: false,
      
    }

    defaultState = null; // 默认state

    loadingPage = false;  // 左边列表滚动加载下一页数据



     // 向画布添加新的作品【替换画布当前作品】
    addObject(object, event) {
        this.refs.drawContent.addObject(object);
    }


    selectedChangePic(string) {
        let objectData = {
            selectContourPic: false,
            selectWorksPic: false,
            selectPartPic: false,
            selectLogPic: false,
        };
        objectData[string] = true;
        this.setState(objectData);
    }



    /* 点击“最近修改”，弹窗提示是否保存当天作品 start  */ 
    save_prompt_show = ( object ) =>{  
        this.setState({ savePrompt :  true, modifedObject :  object })
     }

    // sp_confirmBinder = ( event ) => {

    //     // 通过ID获取完整数据 
    //        axios.get(`/api/toboom/works/${ this.state.modifedObject.id}`).then((data) => {
    //              if( data.data.status_code == 200 ){
    //                   this.props.onSave().then(() => { 

    //                      // 修改 URL 作品 ID
    //                     let { location } =  this.props.history;
    //                         location.search = `?id=${ this.state.modifedObject.id }`
    //                         this.props.history.push( location );

    //                         this.addObject( data.data.data , event);
    //                         this.sp_cancelBinder();
    //                   })
    //             }else{
    //                   message.error('请求数据失败！')   
    //             }  
    //         })





    // }

    // sp_cancelBinder = () => {
    //     this.setState({  modifedObject : null,  savePrompt : false }) 
    // }

 /* 点击“最近修改”，弹窗提示是否保存当天作品 end  */ 



    fetchTagCommonMathod( attr, innerText ){

        var requestStrings = [];

         // 回滚顶部
         document.querySelector('.album-list-warpper').scrollTo(0,0);

        if ( attr == 'log') {

            this.page = 1;

            this.props.store.editorStore.fetchLogs({}, true );

            requestStrings = [ { type : attr, text : innerText } ];

            this.setState({ 
                    requestStrings: requestStrings,
                    tagName:attr,
                    hideSearch: false
                 });

            // 获取所有的标签
            this.props.store.editorStore.fetchEditAllTags();



        } else {
            // debugger;
            switch ( attr ) {
                case 'contour':
                    requestStrings.push({ text : '廓形' ,type : 'contour' });
                    break;
                case 'works':
                    // requestStrings.push({ text : '成品' ,type : 'works' });
                    requestStrings.push({ text : '款式' ,type : 'works' });
                    break;
                case 'part':
                    requestStrings.push({ text : '部件' ,type : 'part' });
                    break;
                case 'log':
                    requestStrings.push({ text : '足迹' ,type : 'log' });
                    break;
                default:
                    console.log('no match');
                    break;
            }


            this.props.store.editorStore.fetchEditData( { type : attr }, true ).then(() => {

                this.props.store.editorStore.fetchEditTags({
                            type: attr
                    }).then((data) => {

                        if( requestStrings[0].text != innerText ){
                              requestStrings = [ { type : attr, text : innerText } ];

                        }else{ 
                               requestStrings[0] = { type : attr, text : innerText } ;
                        }

                       this.setState({
                            modalShow: true,
                            goTransition: true,
                            tagName: attr,
                            requestStrings: requestStrings,
                            hideSearch: true
                        })
                            
                    });

                        
                // 获取对应的标签
                this.props.store.editorStore.fetchEditAllTags({ type : attr, associate : true });


            })    

         

        }
         
           
    }



    // 获取数据  【 增删面包屑 】
    fetchTag(event) {
        event.preventDefault();
        let eventTarget = event.target.nodeName == "LI" ? event.target : event.target.parentElement;

        switch(eventTarget.dataset.attr) {
            case 'contour' :
               this.selectedChangePic('selectContourPic');
            break;
            case 'works' :
                this.selectedChangePic('selectWorksPic');
            break;
            case 'part' :
                this.selectedChangePic('selectPartPic');
            break;
            case 'log' :
                this.selectedChangePic('selectLogPic');
            break;
            default:
                console.log('no match');
            break;
        }

        this.fetchTagCommonMathod( eventTarget.dataset.attr, eventTarget.firstChild.innerText);

    }


    


    pageNext( _param ) {

       if( this.loadingPage ) return false;

         this.loadingPage = true; // 加载中

        this.page++;
        _param.page = this.page;

        if(this.state.tagName == 'log') {
    
            this.props.store.editorStore.fetchLogs( _param ).then(() => {

                this.loadingPage = false; // 加载完成

                this.setState({
                    // modalShow: true,
                    goTransition: true,
                    // tagName: eventTarget.dataset.attr
                });
            })

        } else {
            this.props.store.editorStore.fetchEditData( _param ).then(() => {

              this.loadingPage = false; // 加载完成

                // debugger;
                this.setState({
                    // modalShow: true,
                    goTransition: true,
                    // tagName: eventTarget.dataset.attr
                });
            })
        }

    }



    fetchEditData(tag, isReset) {

    
        this.page = 1;

        tag.children && this.props.store.editorStore.changeEditTags(tag.children);

        if( tag.name != '收藏'  ){

            this.storeAttr = {
                    type: this.state.tagName,
                    attrs: {
                        [tag.group_name]: tag.name
                    } 
                } 

            this.state.hideSearch == false ? this.setState({ hideSearch : true }) : ''

        } else {

             this.storeAttr =  { type: 'collect' };
             this.setState({ hideSearch : false });

        }


      this.props.store.editorStore.fetchEditData(this.storeAttr, isReset).then(() => {
                  let { requestStrings } = this.state;
                  let flag = requestStrings.some(( item, j ) => item.text == tag.name );
                 if( !flag ){
                       let obj =  Object.assign( tag, {}, true );  
                           obj.text = tag.name;
                      this.state.requestStrings.push(obj);
                 }
                this.setState({
                    // goTransition: false,
                    goTransition: !tag.children ? false : true,
                    requestStrings: this.state.requestStrings
                });
            })


    }




      // 面包屑 
      crumbsBinder = ( item ) => {  

         // 回滚顶部
         document.querySelector('.album-list-warpper').scrollTo(0,0);

         this.refs.albumDom._clearAction(); // 清空已选标签

          if( item.type ){ // 一级

            var _requestStrings = [ this.state.requestStrings[0] ];
            this.setState({ requestStrings : _requestStrings }); // 回到一级
            this.fetchTagCommonMathod( _requestStrings[0].type, _requestStrings[0].text);

          }else{  // 子级

            var  _requestStrings = this.state.requestStrings;

              if( item.children ){ //如果不是最后一个面包屑
                 let uIndex = -1;
                 _requestStrings.forEach((obj, index) => {  obj.name == item.name ? uIndex = index + 1 : '' });
                 this.setState({ requestStrings : _requestStrings.slice(0, uIndex )  })

                  this.fetchEditData.call(this, item, true)

              }

          }


       }





    historyToggle() {
        this.setState({
            showHistory: !this.state.showHistory
        })
    }

    cancelBinder() {
        // console.log('sa')
        this.setState({
            goTransition: false
        })
    }




  /*  作品保存输入框事件 start  【 暂时不用，保留着 】  */


    si_confirmBinder = () =>{
        var {  inputvalue, selectedvalues  } = this.state;
        var _state = { validateStatus : 0 };

        if( inputvalue == '' || inputvalue == undefined )  _state.validateStatus = 1;
            if( selectedvalues instanceof Array ){
                if(  selectedvalues.length == 0 )  
                    _state.validateStatus == 1 ? 
                            _state.validateStatus = 3 
                            :  _state.validateStatus = 2;
            }else{ 
            if( selectedvalues == '' || selectedvalues == undefined ){
                    _state.validateStatus == 1 ?  _state.validateStatus = 3 :  _state.validateStatus = 2
                }
            }


        if(  _state.validateStatus == 0  ){ // 验证通过
                _state.saveInputs =  false;  

                console.log( '验证通过' )
                // 发送请求动作 。。。。。。
            
        }

        this.setState( _state )

    }


 
    si_cancelBinder = () =>{
        this.setState({ saveInputs : false, validateStatus : 0 })
    }

    inputBinder = (event) =>{
        event.target.value != undefined ?  this.setState({ inputvalue : event.target.value, validateStatus : 0 }) : ''
    }

    treeSelectBinder = (value, node, extra) =>{
        this.setState({ selectedvalues : value,  validateStatus : 0 })
    }


    /*  作品保存输入框事件 end  */


    componentWillUnmount(){  this.setState( this.defaultState )  }


    componentDidMount() {

        // let _this = this;
        // let saveJson = localStorage.getItem('save')
        // this.saveObjectLength = !!saveJson ? JSON.parse(saveJson).objects.length : [];
        // this.fabricInit(saveJson).then(() => {
        //     this.keyBinder();
        // })

       this.defaultState = Object.assign(this.state, {} ,true);

        this.storeAttr = {
            type: 'contour'
        };

        this.props.store.editorStore.fetchEditData(this.storeAttr).then(() => {

            this.state.requestStrings[0] = { text : '廓形' , type : 'contour' }

            this.setState({
                goTransition: false,
                requestStrings: this.state.requestStrings,
                // .............2018-12-24 10:47 增加的 改1000851的bug  start.............
                //showHistory: false
                // .............2018-12-24 10:47 增加的 改1000851的bug  end.............
            });

        })


        // 获取文件夹数据
        this.props.store.editorStore.fetchFolders({ get_child : 'all' });


    }


    render() {
        // let { editTags, editData } = this.props.store.editorStore;

        // console.log(editTags);
        return (
            <div className="content-wrapper" ref="infoContent">
                <i style={{backgroundImage: "url(/assets/toBoom/images/top_line.png)"}}></i>
                <Album 
                    {...this.props.store}
                    crumbsBinder={ this.crumbsBinder }
                    requestStrings={ this.state.requestStrings }
                    pageNext={this.pageNext.bind(this)}
                    fetchTag={this.fetchTag.bind(this)}
                    addObject={this.addObject.bind(this)} 
                    ref='albumDom'
                    hideSearch={ this.state.hideSearch }
                    selectContourPic={this.state.selectContourPic}
                    selectWorksPic={this.state.selectWorksPic}
                    selectPartPic={this.state.selectPartPic}
                    selectLogPic={this.state.selectLogPic}
                />
                    
                <Draw  
                    ref="drawContent"
                    {...this.props}>
                      <div className="right-dragger" onClick={this.historyToggle.bind(this)}>
                        <img src="/assets/toBoom/images/toggle.png" />
                        <i className={`iconfont lishigenggai_zhankai ${this.state.showHistory ? 'drag-rotate-on': ''}`}></i>
                     </div>
                    {/* <button className="right-dragger" >侧拉按钮</button> */}
                </Draw>

                <HistoryWrapper 
                     savePromptShow={ this.save_prompt_show }
                     showHistory={this.state.showHistory} 

                     historyToggle={this.historyToggle.bind(this)} 
                     store={this.props.store} 
                     getProduct={this.props.getProduct}
                />
                

                {/* <Modal 
                    title="重命名"
                    show={this.state.modalShow}
                    onConfirm={this.confirmBinder.bind(this)}
                    onCancel={this.cancelBinder.bind(this)}>

                    <div className="content">
                        你好
                    </div>
                   
                </Modal> */}

                {/* <Modal
                    show={ this.state.savePrompt }
                    title="温馨提醒您"
                    onConfirm={ this.sp_confirmBinder }
                    onCancel={  this.sp_cancelBinder }
                >
                    <dl className="savePrompt">
                        <dt>是否使用新作品？</dt>
                        <dd>请先手动保存当前作品，以免丢失</dd> 
                    </dl>
                </Modal> */}


              {/* 保存弹窗  【暂时不用，保留着】  */}
                <Modal
                    show={ this.state.saveInputs  }
                    title="保存作品"
                    onConfirm={ this.si_confirmBinder }
                    onCancel={ this.si_cancelBinder }
                >            
                 <InputsComponent parentRef={ this }  source={ defaultMobx.toJS(this.props.store.editorStore.get_foldersArray)   } />
                </Modal>
            
             {/* 保存弹窗 end  */}


                <MaterialModal 
                    show={ this.state.modalShow }
                    onCancel={this.cancelBinder.bind(this)}>
                    <CSSTransition
                        in={this.state.goTransition}
                        classNames="message"
                        timeout={300}
                        unmountOnExit
                        onExited={()=> {
                            this.setState({
                                modalShow: false,
                                goTransition: false
                            })
                        }}>
                        <div className="material-class">
                        {
                            this.props.store.editorStore.editTags.map((tag, index) => (
                                <div 
                                    key={index} 
                                    className={`material-block ${(index + 2) % 3 == 0 ? 'second-margin': '' }`} 
                                    onClick={this.fetchEditData.bind(this, tag, true)}>
                                    <img src={tag.logo}/>

                                    <span>{tag.label}</span>
                                </div>
                                
                            ))
                        }
                        </div>
                    </CSSTransition>
                </MaterialModal>

               
               
            </div>
        )
    }
}


@observer
class HistoryWrapper extends React.Component {
    // onScroll={this.pageNext.bind(this)}
    save_prompt_show( data ){
        // debugger;
         this.props.getProduct(data.id)
    }
    itemBinder(item) {  // 该方法也是替换画布内容。与  save_prompt_show方法相同。我先注释掉。
             //  this.props.getProduct(item.id)     wq - 2018-11-23 修改
    }
    goLookAtMore() {
        location.hash = "design/recently-modify";
    }

    render() {
        let { historyData } = this.props.store.editorStore;
        return (
            <div className={`history-wrapper ${this.props.showHistory ? 'show-history' : 'hide-history'}`} style={{ position: 'relative', display : 'block', overflowY : 'scroll' } }>
                <TransitionGroup className="album-list album-history-list" ref="albumList" >
                    {
                        historyData.length && historyData.map((data, index) => (
                            <CSSTransition
                                key={index}
                                classNames="message"
                                timeout={500}
                                >
                                <div className="history-album"  key={index} onClick={this.itemBinder.bind(this, data)}>
                                    <div className="album-block albummove">
                                        <i style={{backgroundImage: `url(/assets/toBoom/images/designManager/singleShowBG.png)`}}></i>
                                        <img  onClick={ this.save_prompt_show.bind(this, data) }
                                           // onClick={this.props.addObject.bind(this, {name: "murata range", src: "/assets/1.jpg"})}
                                            // style={{display: 'none'}}
                                            ref="image" 
                                            src={data.preview_url} />
                                    </div>
                                    <span>{data.title}</span>
                                </div>
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup>
                <div className="look-at-more" onClick={this.goLookAtMore.bind(this)}>
                    查看更多
                </div>
            </div>
        )
    }
}



// ReactDOM.render(<Main />, root);





// 保存弹窗 input 组件 【暂时不用，保留着】
function InputsComponent( props ){
    var inputsStatus = 'validating';
    var treeslectStatus = 'validating';

    switch( props.parentRef.state.validateStatus ){
          case 0 :  inputsStatus = treeslectStatus = 'validating';
          break;
          case 1 :  inputsStatus = 'error' , treeslectStatus = 'validating';
          break;
          case 2 :  inputsStatus = 'validating' , treeslectStatus = 'error';
          break;
          case 3 :  inputsStatus = 'error' , treeslectStatus = 'error';
          break;
    }

    const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      };


    return (
         <Form >
             <FormItem 
                className="si_inputs_style"
                 validateStatus={ inputsStatus }
              {...formItemLayout } required label="作品名称">
                <Input style={{ width: 300 }} 
                  value={ props.parentRef.state.inputvalue  } 
                   placeholder="请输入作品名称" 
                   onChange={ props.parentRef.inputBinder } />
                </FormItem>
              <FormItem 
                className="si_inputs_style"
                validateStatus={ treeslectStatus }
                 {...formItemLayout }  required label="保存至文件夹">
                <TreeSelect
                    allowClear
                    style={{ width: 300 }}
                    value={ props.parentRef.state.selectedvalues  }
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={ props.source }
                    placeholder="请选择文件夹"
                    onChange={  props.parentRef.treeSelectBinder  }
                />

             </FormItem>
         </Form>
    )

}

