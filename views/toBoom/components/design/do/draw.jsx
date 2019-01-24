import React from 'react';

import 'fabric';
import axios from 'axios';
import { Modal } from '@/components/modal';
import { Tooltip } from 'antd';


let _background = '/assets/toBoom/images/design/de_background.png'
let blank = '/assets/toBoom/images/design/de_blank.png';


export default class DrawWrapper extends React.Component {
    constructor(props) {
        super();
        // let EXT = /\d+/.exec(props.location.search);
        this.resizeEvent = this.resizeEvent.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.frontCanvas = {}; 
        this.backCanvas = {};
        this.showCanvas = {};
        this.objectsCopier = [];
        this.unActiveCanvas = {};
        this.stateJSON = {
            front: JSON.stringify({"version":"2.3.3","objects":[]}), 
            back: JSON.stringify({"version":"2.3.3","objects":[]})
        }
        this.undo = {
            front: [],
            back: []
        },
        this.redo = {
            front: [],
            back: []
        },
        this.defaultWidthMutiple = 0.4,
        this.contentObject = {
            width: 0,
            height: 0
        };
        this.contentObjectSecond = {
            width: 0,
            height: 0
        };
        // debugger;
        this.state = {
            changeAlert: false,
            changeWorksAlert: false, // 2018.11.27----lsh
            showRight: false,
            showText : '',
            showHeight: '',
            objects: {
                front: [],
                back: []
            },
            chosenJson: 'front',
            unChosenJson: 'back',
            selectInfo: {
                objects: [],
                index: []
            },
            wrapperShowInfo: {
                display: true,
                drag: true
            },
 
           tooltiptext1 : '隐藏反面视图', 
           tooltiptext2 : '隐藏图层管理', 

        }
    }


     
    tooltip_text( role ){
        let { wrapperShowInfo,  chosenJson } = this.state;
        let text = '';
         if( role == 'display' ){
            wrapperShowInfo.display ?  text += '隐藏'  :  text += '显示';
            chosenJson == 'front' ? text += '反面' : text += '正面';
            text += '视图';
         }else if( role == 'drag' ){
             wrapperShowInfo.drag ?  text = '隐藏图层管理'  :  text = '显示图层管理';
         }
         return text;
    }





    moveArray(from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    }
    resizeAsA4(width) {
        //    let width = height / math.sqrt(2) 

        return {
            width: width,
            height: Math.sqrt(2) * width
        }
    }

    fabricInit(saveJson) {

        fabric.Object.NUM_FRACTION_DIGITS = 10;

        return new Promise((resolve, reject) => {
            let _this = this;
            let devicePixelRatio = window.devicePixelRatio;
            let drawWrapper = this.refs.drawWrapper;

            let drawWrapperWidth = drawWrapper.clientWidth * this.defaultWidthMutiple;
            // console.log(this.resizeAsA4(drawWrapperWidth).width / this.refs.drawWrapper.clientWidth * this.defaultWidthMutiple); 
            // console.log(devicePixelRatio);

            this.contentObject = {
                width: drawWrapper.clientWidth,
                height: drawWrapper.clientHeight
            }
      

            this.contentObjectSecond = {...this.contentObject};

            this.canvas = this.refs.canvas;

            this.frontCanvas = new fabric.Canvas(this.canvas, {
                width: this.resizeAsA4(drawWrapperWidth).width,
                height: this.resizeAsA4(drawWrapperWidth).height,
            });


            this.backCanvas = new fabric.Canvas(this.refs.backCanvas, {
                width: this.resizeAsA4(drawWrapperWidth).width,
                height: this.resizeAsA4(drawWrapperWidth).height,
            });

            this.showCanvas = new fabric.Canvas(this.refs.showCanvas, {
                width: this.frontCanvas.width / (776 / 280),
                height: this.frontCanvas.height / (776 / 280)
            });

            this.initAligningGuidelines(this.frontCanvas);
            this.initCenteringGuidelines(this.frontCanvas);
            this.initAligningGuidelines(this.backCanvas);
            this.initCenteringGuidelines(this.backCanvas);
            this.changeCanvasImage();
 
          
            this.props.fabricInit([this.frontCanvas, this.backCanvas]);
            window.frontCanvas = this.frontCanvas;
            window.backCanvas = this.backCanvas;
            window.showCanvas = this.showCanvas;


            fabric.Object.prototype.set({
                transparentCorners: false,
                // backgroundImage: background,
                // borderColor: '#ff00ff',
                // cornerColor: '#ff0000',
                cornerStyle: "circle"

            });

            this.loadHandler(saveJson, this.drawListener.bind(this));

            this.resizeHandler();

            resolve();

        })

    }


    resizeHandler() {
        let _this = this;
        let foreWidth, foreHeight;

        window.addEventListener('resize', this.resizeEvent, false)
    }
    resizeEvent() {
        // let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / this.contentObject.width;;

        // this.frontCanvas.setWidth(this.frontCanvas.getWidth() * MUTICOUNTER);
        // this.frontCanvas.setHeight(this.frontCanvas.getHeight() * MUTICOUNTER);

        // this.frontCanvas.forEachObject((object) => {


        //     object.scaleX = object.scaleX * MUTICOUNTER;
        //     object.scaleY = object.scaleY * MUTICOUNTER;
        //     object.left = object.left * MUTICOUNTER;
        //     object.top = object.top * MUTICOUNTER;

        //     object.setCoords();
        // })
        // this.frontCanvas.renderAll();
        // // this.frontCanvas.calcOffset();

        // this.contentObject.width = this.refs.drawWrapper.clientWidth;
        // this.contentObject.height = this.refs.drawWrapper.clientHeight;

        this.mutiCounterHandler(this.frontCanvas, this.contentObject, this.refs.drawWrapper);
        this.mutiCounterHandler(this.backCanvas, this.contentObject, this.refs.drawWrapper);
        this.mutiCounterHandler(this.showCanvas, this.contentObjectSecond, this.refs.drawWrapper);
        this.setState({ showHeight: this.frontCanvas.height });
        
        this.changeCanvasImage();

        this.save();

    
    }
    mutiCounterHandler(canvas, contentObject, wrapper) {
        let _this = this;
        // debugger;
        // console.log(wrapper.clientWidth);
        // console.log(contentObject.width);
        let MUTICOUNTER = wrapper.clientWidth / contentObject.width;
        // console.log(wrapper);

        canvas.setWidth(canvas.getWidth() * MUTICOUNTER);
        canvas.setHeight(canvas.getHeight() * MUTICOUNTER);

        canvas.forEachObject((object) => {


            object.scaleX = object.scaleX * MUTICOUNTER;
            object.scaleY = object.scaleY * MUTICOUNTER;
            object.left = object.left * MUTICOUNTER;
            object.top = object.top * MUTICOUNTER;

            object.setCoords();
        })
        canvas.renderAll();
        // this.frontCanvas.calcOffset();

        contentObject.width = this.refs.drawWrapper.clientWidth;
        contentObject.height = this.refs.drawWrapper.clientHeight;
    }
    objectFilter(canvas, item) {
        let allObjects = canvas.getObjects()
        let object = allObjects.filter(x => x.definedObject.type == "contour")[0];
        let index = allObjects.indexOf(object);
        canvas.remove(object);
        return index;

    }


    resetCanvases() {
        this.frontCanvas.clear();
        this.showCanvas.clear();
        this.backCanvas.clear();

        this.props.setCanvasJSON({
            front: JSON.stringify({
                "version": "2.3.3",
                "objects": []
            }),
            back: JSON.stringify({
                "version": "2.3.3",
                "objects": []
            })
        });

        this.undo = {
            front: [],
            back: []
        },
        this.redo = {
            front: [],
            back: []
        }
        this.setState({
            objects: {
                front: [],
                back: []
            },
            chosenJson: 'front',
            selectInfo: {
                objects: [],
                index: []
            }
        });
        this.props.saveBinder();
        // this.props.history.push('/design-do');
    }


     /* 往画布添加新的对象 start  */ 
    addObject(item, notContourAdd) {
        // debugger;
        // if(item.type == "works" && item.competence == 1) {

        //     this.props.noRightPopout()

        //     return;            
        // }

        if (item.competence == 1) {
            this.setState({
                showRight: true,
                showText : '未购买'+item.lack_category[0]+"品类会员"
            });
            return;
        }


        let SAMEFLAG = new Date().getTime();

        let _this = this;
        let frontIndex = '';
        let backIndex = '';
        let devicePixelRatio = window.devicePixelRatio;

        let drawWrapperWidth = this.refs.drawWrapper.clientWidth * this.defaultWidthMutiple;
        this.setState({
            storeItem: {
                ...this.state.storeItem,
                frontIndex: "",
                backIndex: "",
            }
        })

        if (item.type == "contour" && this.getMethodCanvas().getObjects().some((x) => (x.definedObject.type == "contour"))) {
            // debugger;

            this.setState({
                changeAlert: !notContourAdd,
                storeItem: {
                    item: item,
                    frontIndex: "",
                    backIndex: ""
                }
            })
            // debugger;
            if (!notContourAdd) return;
            // yield 2;

        } 
        else if (item.type == "collect" && this.getMethodCanvas().getObjects().some((x) => (x.definedObject.type == "contour"))) {
            this.setState({
                changeAlert: !notContourAdd,
                storeItem: {
                    item: item,
                    frontIndex: "",
                    backIndex: ""
                }
            })
            // debugger;
            if (!notContourAdd) return;
        } 
        else if(item.type == "works") {

             if(this.getMethodCanvas().getObjects().some((x) => (x.definedObject.type == "contour"))) {

            
                this.setState({
                    // 2018.11.27--- lsh 把 changeAlert: !notContourAdd 换成 changeWorksAlert: !notContourAdd ---- 开始-----
                    //changeAlert: !notContourAdd,
                    changeWorksAlert: !notContourAdd,
                    // 2018.11.27--- lsh 把 changeAlert: !notContourAdd 换成 changeWorksAlert: !notContourAdd ---- 结束----
                    storeItem: {
                        item: item,
                        frontIndex: "",
                        backIndex: ""
                    }
                })
                // debugger;
                if (!notContourAdd) return;
            }
            this.loadHandler(JSON.parse(decodeURI(item.canvasInfo)), () => {
                _this.props.saveBinder();
            });
            // _this.save().then(() => {
            //     // debugger;
            //     // _this.pushData('front', JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));
            //     // _this.pushData('back', JSON.stringify(_this.backCanvas.toObject(['definedObject'])));
            // });

            // _this.loadMirrorJSON(_this.state.chosenJson == 'front' ? _this.backCanvas.toObject(['definedObject']) : _this.frontCanvas.toObject(['definedObject']));
            return;
        }


        item.removeKey = SAMEFLAG;
        // item.fabricWidth = _this.frontCanvas.width;
        // item.fabricHeight = _this.frontCanvas.height;
        axios.post('/api/toboom/works/logs', {
            resource_id: item.id
        });

        this.choseCropAndPick(item.src[0].cut || item.src[0].value, true).then((value) => {

            fabric.Image.fromURL(value, function (img) {

                img.definedObject = item;

                img.item = item;

                img.scaleX = _this.frontCanvas.width / 2485;
                img.scaleY = _this.frontCanvas.height / 3508;

                // frontIndex > 0 && img.moveTo(frontIndex);
                pickFrontImage(_this.frontCanvas, img);
                _this.state.storeItem.frontIndex > 0 && _this.frontCanvas.moveTo(img, _this.state.storeItem.frontIndex)


                _this.save().then(() => {
                    _this.pushData('front', JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));
                });

                _this.loadMirrorJSON(_this.state.chosenJson == 'front' ? _this.backCanvas.toObject(['definedObject']) : _this.frontCanvas.toObject(['definedObject']));


            }, {
                crossOrigin: 'Anonymous'
            });
            // this.loadMirrorJSON((this.backCanvas.toObject(['definedObject'])));

        });


        fabric.Image.fromURL(item['back_image'][0].cut || item['back_image'][0].url, function (img) {
            img.definedObject = item;

            img.item = item;

            img.scaleX = _this.backCanvas.width / 2485;
            img.scaleY = _this.backCanvas.height / 3508;

            // pickFrontImage(_this.frontCanvas, img);
            pickFrontImage(_this.backCanvas, img);

            _this.state.storeItem.backIndex > 0 && _this.backCanvas.moveTo(img, _this.state.storeItem.backIndex)

            _this.save().then(() => {
                _this.pushData('back', JSON.stringify(_this.backCanvas.toObject(['definedObject'])));
            });

            // _this.loadMirrorJSON((_this.backCanvas.toObject(['definedObject'])));
            _this.loadMirrorJSON(_this.state.chosenJson == 'front' ? _this.backCanvas.toObject(['definedObject']) : _this.frontCanvas.toObject(['definedObject']));

        }, {
            crossOrigin: 'Anonymous'
        });



        function pickFrontImage(canvas, img) {
            canvas.add(img);
            // img.center();

            let newArray = canvas.getObjects().map(x => {
                if (x.definedObject.id == item.id) {
                    return x;
                }
            })
            // .filter(x => x != undefined).sort((a, b) => (a.left - b.left))

            // newArray = newArray.sort((a, b) => (a.left + b.left));
            // canvas.add(img);

            // if(newArray.length > 0) {
            // debugger;
            // img.top = newArray[newArray.length - 1].top;
            // img.left = newArray[newArray.length - 1].left + 10
            // } else {
            img.center();
            // }
            // img.left = newArray[0].left + 10;

            // console.log(newArray);
            canvas.setActiveObject(img);
            canvas.renderAll();

            // // .filter(x => x != undefined).sort((a, b) => (a.left - b.left));
            // // debugger;
            // if (newArray.length > 1) {
            //     img.left = newArray[newArray.length - 1].left + 10;
            // }

            // canvas.renderAll();

        }


    }

  /* 往画布添加新的对象 end  */ 


   
    choseCropAndPick(src, booleanValue) {
        if(!!booleanValue) {
            return Promise.resolve(src);
        }
        return new Promise((resolve, reject) => {
            var clipCanvas = this.refs.clipCanvas;
            var ctx = clipCanvas.getContext('2d');

            ctx.clearRect(0, 0, clipCanvas.width, clipCanvas.height);

            let img = new Image();
            img.src = src;
            img.crossOrigin = "Anonymous";

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                resolve(this.trim(clipCanvas).toDataURL('image/png', 0.1))
                // resolve(this.removeImageBlanks(img).toDataURL('image/png', 0.1))

            }
        })
    }


    loadHandler(stateJson, callback, reverse) {
        let _this = this;
        // debugger;
        !stateJson && callback();

        // this.frontCanvas.clear()
        // this.backCanvas.clear()

        this.frontCanvas.loadFromJSON(stateJson.front, function (o, object) {
            // this.frontCanvas.renderAll.bind(this.frontCanvas), 
            // debugger;

            //  if (_this.props.canvasJSON.fabricInfo) {
            //      let MUTICOUNTER = _this.getMethodCanvas().width / _this.props.canvasJSON.fabricInfo.width;
            //      _this.getMethodCanvas().forEachObject((object) => {
            //          object.scaleX = object.scaleX * MUTICOUNTER;
            //          object.scaleY = object.scaleY * MUTICOUNTER;
            //          object.left = object.left * MUTICOUNTER;
            //          object.top = object.top * MUTICOUNTER;
            //          object.setCoords();
            //      });
            //      _this.getMethodCanvas().renderAll();
            //  } else {
            //      return;
            //  }

            
            if (stateJson.fabricInfo ) {
                // debugger;
                // let MUTICOUNTER = _this.frontCanvas.width / stateJson.fabricInfo.width;
                // let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / stateJson.fabricInfo.width * 0.4;
                // debugger;
                let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / stateJson.fabricInfo.width * .4;

                _this.frontCanvas.forEachObject((object) => {
                    // debugger;
                    object.scaleX = object.scaleX * MUTICOUNTER;
                    object.scaleY = object.scaleY * MUTICOUNTER;
                    object.left = object.left * MUTICOUNTER;
                    object.top = object.top * MUTICOUNTER;
                    object.setCoords();
                });
                _this.frontCanvas.renderAll();
                

                
            }


            _this.undo['front'].push(JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));



            // 存储objects
            _this.backCanvas.loadFromJSON(stateJson.back, function (o, object) {
                // this.frontCanvas.renderAll.bind(this.frontCanvas), 
                _this.undo['back'].push(JSON.stringify(_this.backCanvas.toObject(['definedObject'])));

                if (stateJson.fabricInfo ) {

                //     // let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / stateJson.fabricInfo.width ;
                //     // debugger;
                    let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / stateJson.fabricInfo.width * .4;

                    _this.backCanvas.forEachObject((object) => {
                        object.scaleX = object.scaleX * MUTICOUNTER;
                        object.scaleY = object.scaleY * MUTICOUNTER;
                        object.left = object.left * MUTICOUNTER;
                        object.top = object.top * MUTICOUNTER;
                        object.setCoords();
                    });
                    _this.backCanvas.renderAll();


                }
                _this.loadMirrorJSON(_this.backCanvas.toObject(['definedObject']));

                _this.props.setCanvasJSON({
                    ...stateJson,
                    front: JSON.stringify(_this.frontCanvas.toObject(['definedObject'])),
                    back: JSON.stringify(_this.backCanvas.toObject(['definedObject']))
                });

                // console.log(_this.undo);

                !!stateJson && callback();
            });

        });


        // debugger;
        _this.setState({
            showHeight: this.frontCanvas.height,
            objects: {
                front: JSON.parse(stateJson.front).objects,
                back: JSON.parse(stateJson.back).objects,
            }
        });

       
        // debugger;
    }
    loadMirrorJSON(stateJson) {
        let _this = this;
        // debugger;
        this.showCanvas.loadFromJSON(stateJson || this.props.canvasJSON[this.state.chosenJson], function (o, object) {


            let MUTICOUNTER = _this.showCanvas.width / _this.frontCanvas.width;

            _this.showCanvas.forEachObject((object) => {
                object.scaleX = object.scaleX * MUTICOUNTER;
                object.scaleY = object.scaleY * MUTICOUNTER;
                object.left = object.left * MUTICOUNTER;
                object.top = object.top * MUTICOUNTER;
                object.setCoords();
            });
            _this.showCanvas.renderAll();

        });
    }


    switchAction() {

        let _this = this;
        // canvas.forEachObject((object) => {


        //     object.scaleX = object.scaleX * MUTICOUNTER;
        //     object.scaleY = object.scaleY * MUTICOUNTER;
        //     object.left = object.left * MUTICOUNTER;
        //     object.top = object.top * MUTICOUNTER;

        //     object.setCoords();
        // })
        // canvas.renderAll();

        let chosenJson = this.state.chosenJson == 'front' ? 'back' : 'front';
        let unChosenJson = this.state.chosenJson != 'front' ? 'back' : 'front';
        // debugger;
        this.frontCanvas.discardActiveObject();
        this.backCanvas.discardActiveObject();
        this.frontCanvas.renderAll();
        this.backCanvas.renderAll();
        this.showCanvas.loadFromJSON(this.getMethodCanvas().toObject(['definedObject']), function (o, object) {


            let MUTICOUNTER = _this.showCanvas.width / _this.frontCanvas.width;

            _this.showCanvas.forEachObject((object) => {
                object.scaleX = object.scaleX * MUTICOUNTER;
                object.scaleY = object.scaleY * MUTICOUNTER;
                object.left = object.left * MUTICOUNTER;
                object.top = object.top * MUTICOUNTER;
                object.setCoords();
            });
            _this.showCanvas.renderAll();

        });
        
        this.setState({
            chosenJson: chosenJson,
            unChosenJson: unChosenJson
        },()=> {

            this.props.saveBinder();
            this.setState({ tooltiptext1 : this.tooltip_text( 'display' ) });  

        });
        
    }




    drawListener() {

        let _this = this;
        let info = {};
        let getIndex = () => {
            return _this.getMethodCanvas().getActiveObjects().map((object, index, array) => {
                return _this.getMethodCanvas().getObjects().indexOf(object);
            })
            // .filter(object=> object != -1);

        }
        this.showCanvas.on('object:added', () => {
            // let stateJson2 = JSON.stringify(this.showCanvas.toObject(['definedObject']))
            // this.props.saveBinder();
            this.showCanvas.forEachObject((object) => {
                object.lockMovementX = true;
                object.lockMovementY = true;
                object.lockRotation = true;
                object.lockScalingX = true;
                object.lockScalingY = true;
                object.hasBorders = false;
                object.hasControls = false;
            })
            this.showCanvas.renderAll();
        });

        // this.backCanvas.on('object:added', () => {
        //     // debugger;
        //     let left_string = this.state.chosenJson == 'front' ? 'back' : 'front';
        //     this.props.canvasJSON[left_string] = JSON.stringify(this.backCanvas.toObject(['definedObject']));
        //     // this.props.saveBinder();
        //     // this.showCanvas.renderAll();
        //     this.backCanvas.renderAll();
        //     this.loadMirrorJSON((this.backCanvas.toObject(['definedObject'])));
        // });

        // this.backCanvas.on('object:modified', () => {
        //     // debugger;
        //     let stateJson2 = JSON.stringify(this.backCanvas.toObject(['definedObject']))
        //     let left_string = this.state.chosenJson == 'front' ? 'back' : 'front';
        //     this.props.canvasJSON[left_string] = stateJson2;
        //     // this.props.saveBinder();
        //     // this.showCanvas.renderAll();
        //     this.backCanvas.renderAll();
        //     this.loadMirrorJSON(
        // });

        // this.frontCanvas.on('object:modified', () => {
        //     _this.save();
        //     this.props.saveBinder();
        // });




        // this.backCanvas.on('object:removed', () => {
        //     let stateJson2 = JSON.stringify(this.backCanvas.toObject(['definedObject']))
        //     let left_string = this.state.chosenJson == 'front' ? 'back' : 'front';
        //     this.props.canvasJSON[left_string] = stateJson2;
        //     // _this.props.saveBinder();

        // });

        // this.frontCanvas.on('object:added', () => {
        //     // debugger;
        //     _this.save().then(()=> {
        //         _this.pushData('front', JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));
        //     })
        //     this.props.saveBinder();
        // });
        
        // this.backCanvas.on('object:added', () => {
        //     // debugger;
        //     _this.save().then(()=> {
        //         _this.pushData('back', JSON.stringify(_this.backCanvas.toObject(['definedObject'])));
        //     })
        //     this.props.saveBinder();
        // });

        this.frontCanvas.on('object:modified', () => {
            
            _this.save().then(()=> {
                _this.pushData('front', JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));
            })
            this.props.saveBinder();
        });

        this.backCanvas.on('object:modified', ()=> {
            _this.save().then(()=> {
                _this.pushData('back', JSON.stringify(_this.backCanvas.toObject(['definedObject'])));
            })
            this.props.saveBinder();
        });

        //画板视图object移除
        this.frontCanvas.on('object:removed', () => {
            _this.save().then(()=> {
                _this.frontCanvas.discardActiveObject();
                _this.pushData('front', JSON.stringify(_this.frontCanvas.toObject(['definedObject'])));

            });
            _this.props.saveBinder();
        });


        this.backCanvas.on('object:removed', ()=> {
            _this.save().then(()=> {
                _this.backCanvas.discardActiveObject();
                _this.pushData('back', JSON.stringify(_this.backCanvas.toObject(['definedObject'])));
            });
            _this.props.saveBinder();
        });

        //  this.frontCanvas.on('mouse:wheel', function (opt) {
        //     var delta = opt.e.deltaY;
        //     var pointer = _this.frontCanvas.getPointer(opt.e);
        //     var zoom = _this.frontCanvas.getZoom();
        //     zoom = zoom + delta / 200;
        //     if (zoom > 20) zoom = 20;
        //     if (zoom < 0.01) zoom = 0.01;
        //     _this.frontCanvas.zoomToPoint({
        //         x: opt.e.offsetX,
        //         y: opt.e.offsetY
        //     }, zoom);
        //     opt.e.preventDefault();
        //     opt.e.stopPropagation();
        // });


        //画板视图object选择
        this.frontCanvas.on('selection:created', function (event) {
            // let info = {

            // }
            _this.setState({
                selectInfo: {
                    objects: _this.frontCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();
        });

        this.backCanvas.on('selection:created', function (event) {
            // let info = {

            // }
            _this.setState({
                selectInfo: {
                    objects: _this.backCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();
        });

        //画板视图object选择更新
        this.frontCanvas.on('selection:updated', function (event) {

            _this.setState({
                selectInfo: {
                    objects: _this.frontCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();
        });
        
        this.backCanvas.on('selection:updated', function (event) {

            _this.setState({
                selectInfo: {
                    objects: _this.backCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();
        });

        //画板视图object选择清理
        this.frontCanvas.on('selection:cleared', function () {

            _this.setState({
                selectInfo: {
                    objects: _this.frontCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();

        })
       
        this.backCanvas.on('selection:cleared', function () {

            _this.setState({
                selectInfo: {
                    objects: _this.backCanvas.getActiveObjects(),
                    index: getIndex()
                }
            });
            _this.props.saveBinder();
            // _this.save();

        })


       
    }

    keyUpHandler(event) {
        let _this = this;
        let activeObject = ''
        switch(event.keyCode) {
            case 37:
                this.arrowBinder((data) => {
                    data.left -= 1;
                });
                this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
                break;
            case 38:
                this.arrowBinder((data) => {
                    data.top -= 1;
                });
                this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
                break;
            case 39:
                this.arrowBinder((data) => {
                    data.left += 1;
                });
                this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
                break;
            case 40:
                this.arrowBinder((data) => {
                    data.top += 1;
                });
                this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
                break;
           
            default:
                '';
        }
    }
    keyDownHandler(event) {
        let _this = this;
        let activeObject = ''
        switch (event.keyCode) {
            case 8:
                this.deleteBinder();
                break;
            case 32:
                // this.center();
                break;
                // case 38:
                //     // console.log(this.undo);

                //     this.getMethodCanvas().getActiveObjects().forEach((data) => {
                //         data.top -= 1;
                //     });
                //     this.getMethodCanvas().renderAll();
                //     _this.arrowBinder((data)=> {
                //         data.top -= 1;
                //     })
                // break;
            case 37:
                this.arrowBinder((data) => {
                    data.left -= 1;
                })
                break;
            case 38:
                this.arrowBinder((data) => {
                    data.top -= 1;
                })
                break;
            case 39:
                this.arrowBinder((data) => {
                    data.left += 1;
                })
                break;
            case 40:
                this.arrowBinder((data) => {
                    data.top += 1;
                })
                console.log(this.undo);
                break;
            case 67:
                !!event.ctrlKey && _this.cloneObject();
                break;
            case 70:
                !!event.shiftKey && _this.fixLayout();
                break;
                
            case 86:
                !!event.ctrlKey && _this.pasteObject();
            case 89:
                // 回撤
                if (!!event.ctrlKey) {
                    _this.redoBinder();
                }
                break;
            case 90:
                if (!!event.ctrlKey) {
                    _this.undoBinder();
                }
                break;
            default:
                '';
        }
    }
    keyBinder() {
        window.addEventListener('keydown', this.keyDownHandler, false);
        window.addEventListener('keyup', this.keyUpHandler, false);        
    }
    fixLayout() {
        this.frontCanvas.forEachObject((object) => {
            object.scaleX = object.scaleX * 0.4;
            object.scaleY = object.scaleY * 0.4;
            object.left = object.left * 0.4;
            object.top = object.top * 0.4;
            object.setCoords();
        });
        this.frontCanvas.renderAll();

        this.backCanvas.forEachObject((object) => {
            object.scaleX = object.scaleX * 0.4;
            object.scaleY = object.scaleY * 0.4;
            object.left = object.left * 0.4;
            object.top = object.top * 0.4;
            object.setCoords();
        });
        this.backCanvas.renderAll();
          
        this.loadMirrorJSON(this.state.chosenJson == 'front' ? this.backCanvas.toObject(['definedObject']) : this.frontCanvas.toObject(['definedObject']));

    }
    arrowBinder(callback) {
        this.getMethodCanvas().getActiveObjects().forEach((data)=> {
            callback(data);
        });
        this.getMethodCanvas().renderAll();
        this.save();
    }
    undoBinder() {
        // console.log(this.redo[this.state.chosenJson]);
        // this.unActiveCanvas
        let storeCounter = this.getMethodCanvas().getObjects().length;
        // console.log(this.getMethodCanvas().getObjects().length);
        let _this = this;
        if (this.undo[this.state.chosenJson].length > 1) {
            this.redo[this.state.chosenJson].unshift(this.undo[this.state.chosenJson].pop());
            // console.log(JSON.parse(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]));
            // console.log(JSON.parse(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]).objects.length);

            if (storeCounter < JSON.parse(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]).objects.length) {

                this.redo[this.state.unChosenJson].unshift(this.undo[this.state.unChosenJson].pop());


                this.unActiveCanvas.loadFromJSON(this.undo[this.state.unChosenJson][this.undo[this.state.unChosenJson].length - 1], function (o, object) {
                    _this.loadMirrorJSON(_this.state.chosenJson == 'front' ? _this.backCanvas.toObject(['definedObject']) : _this.frontCanvas.toObject(['definedObject']));


                    if (_this.undo[_this.state.unChosenJson].length == 1) {
                        if (_this.props.canvasJSON.fabricInfo) {
                            // let MUTICOUNTER = _this.getMethodCanvas().width / _this.props.canvasJSON.fabricInfo.width;
                            let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / _this.props.canvasJSON.fabricInfo.width * 0.4;
                            _this.unActiveCanvas.forEachObject((object) => {
                                object.scaleX = object.scaleX * MUTICOUNTER;
                                object.scaleY = object.scaleY * MUTICOUNTER;
                                object.left = object.left * MUTICOUNTER;
                                object.top = object.top * MUTICOUNTER;
                                object.setCoords();
                            });
                            _this.unActiveCanvas.renderAll();


                        } else {
                            return;
                        }


                        // _this.loadMirrorJSON(_this.backCanvas.toDatalessObject(['definedObject']));
                        return;
                    }


                });
            };


            this.getMethodCanvas().loadFromJSON(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1], function (o, object) {
                if (_this.undo[_this.state.chosenJson].length == 1) {
                    if (_this.props.canvasJSON.fabricInfo) {
                        // let MUTICOUNTER = _this.getMethodCanvas().width / _this.props.canvasJSON.fabricInfo.width;
                        let MUTICOUNTER = _this.refs.drawWrapper.clientWidth / _this.props.canvasJSON.fabricInfo.width * 0.4;
                        _this.getMethodCanvas().forEachObject((object) => {
                            object.scaleX = object.scaleX * MUTICOUNTER;
                            object.scaleY = object.scaleY * MUTICOUNTER;
                            object.left = object.left * MUTICOUNTER;
                            object.top = object.top * MUTICOUNTER;
                            object.setCoords();
                        });
                        _this.getMethodCanvas().renderAll();


                    } else {
                        return;
                    }
                    // _this.loadMirrorJSON(_this.backCanvas.toDatalessObject(['definedObject']));
                    return;
                }
            });
            // console.log(this.redo[this.state.chosenJson]);
        }
        // this.loadMirrorJSON();
        this.saveNoCache();
    }
    redoBinder(event) {
        let _this = this;
        let storeCounter = this.getMethodCanvas().getObjects().length;



        if (this.redo[this.state.chosenJson].length > 0) {
            this.undo[this.state.chosenJson].push(this.redo[this.state.chosenJson].shift());

             if (storeCounter > JSON.parse(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]).objects.length) {

                this.undo[this.state.unChosenJson].push(this.redo[this.state.unChosenJson].shift());


                this.unActiveCanvas.loadFromJSON(this.undo[this.state.unChosenJson][this.undo[this.state.unChosenJson].length - 1], function() {
                    _this.loadMirrorJSON(_this.state.chosenJson == 'front' ? _this.backCanvas.toObject(['definedObject']) : _this.frontCanvas.toObject(['definedObject']));

                });
            };



            this.getMethodCanvas().loadFromJSON(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]);
            // console.log(this.redo[this.state.chosenJson]);
        }
        // this.loadMirrorJSON();
        this.saveNoCache();
    }
    enlargeBinder() {
        this.getMethodCanvas().zoomToPoint(new fabric.Point(this.getMethodCanvas().width / 2, this.getMethodCanvas().height / 2), this.getMethodCanvas().getZoom() * 1.1)

        // this.getMethodCanvas().getZoom();
    }
    scaleBinder() {
        this.getMethodCanvas().zoomToPoint(new fabric.Point(this.getMethodCanvas().width / 2, this.getMethodCanvas().height / 2), this.getMethodCanvas().getZoom() / 1.1)
    }
    upBinder() {
        let activeObject = this.getMethodCanvas().getActiveObject();

        this.getMethodCanvas().bringForward(activeObject, true);
        this.getMethodCanvas().discardActiveObject();
        this.getMethodCanvas().setActiveObject(activeObject);

        this.getMethodCanvas().renderAll();
        // this.save();
        this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
        
        //  this.getMethodCanvas().item(index).moveTo(toIndex);
        //  this.getMethodCanvas().setActiveObject(this.getMethodCanvas().item(toIndex));
         this.save();



    }
    downBinder() {
        let activeObject = this.getMethodCanvas().getActiveObject();

        this.getMethodCanvas().sendBackwards(this.getMethodCanvas().getActiveObject(), true)
        // this.getMethodCanvas().discardActiveObject()
        this.getMethodCanvas().discardActiveObject();
        this.getMethodCanvas().setActiveObject(activeObject);
        this.getMethodCanvas().renderAll();

        this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
        this.save();

    }
    deleteBinder() {
        let deleteObject = "";
        this.getMethodCanvas().getActiveObjects().forEach((activeObject) => {
            // deleteObject = object;
            
            this.getMethodCanvas().remove(activeObject);

            this.unActiveCanvas.forEachObject((object)=> {
                if (activeObject) {
                    if (object && object.definedObject.removeKey == activeObject.definedObject.removeKey) {

                        this.unActiveCanvas.remove(object);
                    }
                }
            })
    
        });

       
        this.loadMirrorJSON(this.state.chosenJson == 'front' ? this.backCanvas.toObject(['definedObject']) : this.frontCanvas.toObject(['definedObject']));

        this.save();
    }
    mirrorBinder(dir) {

        switch (dir) {
            case 'x':
                this.getMethodCanvas().getActiveObjects().forEach((object) => {
                    object.set({
                        'flipX': !object.flipX
                    });
                })
                break;
            case 'y':
                object.set({
                    'flipY': !object.flipY
                })
                break;
            default:
                this.getMethodCanvas().getActiveObjects().forEach((object)=> {
                     object.set({
                         'flipX': !object.flipX
                     });
                })
               
                // throw ('second argument is required');
        }
        this.getMethodCanvas().renderAll();
        this.save().then(()=> {
            this.pushData(this.state.chosenJson, JSON.stringify(this.getMethodCanvas().toObject(['definedObject'])));
        });
    }
    getMethodCanvas() {
        let canvas = this.state.chosenJson == 'front' ? this.frontCanvas : this.backCanvas; 
        this.unActiveCanvas = this.state.chosenJson != 'front' ? this.frontCanvas : this.backCanvas;
        return canvas;
    }
    pushData(object, json) {
        // debugger;
        
        if(!object) {
            let frontJson = JSON.stringify(this.frontCanvas.toObject(['definedObject']))
            let backJson = JSON.stringify(this.backCanvas.toObject(['definedObject']))
            this.undo['front'].push(frontJson);
            this.undo['back'].push(frontJson);
            return;
        } 
        this.undo[object].push(json);
        this.props.saveBinder();
        // console.log(this.undo);
    }
    save() {
        return new Promise((resolve, reject) => {
            let frontJson = JSON.stringify(this.frontCanvas.toObject(['definedObject']))
            let backJson = JSON.stringify(this.backCanvas.toObject(['definedObject']))
    
            // debugger;

            // this.undo[this.state.chosenJson].push(frontJson);
            // this.undo[this.state.chosenJson].push(frontJson);
            this.props.setCanvasJSON({
                front: frontJson,
                back: backJson
            });


            // this.props.canvasJSON['front'] = ;
            // this.props.canvasJSON['back'] = ;
            this.props.saveBinder();
            // debugger;
            this.setState({
                objects: {
                    front: JSON.parse(frontJson).objects,
                    back: JSON.parse(backJson).objects
                }
            });
            resolve();
        })
    }
    saveNoCache() {
        return new Promise((resolve, reject) => {
            let stateJson = JSON.stringify(this.getMethodCanvas().toObject(['definedObject']))
            this.props.saveBinder();
            // debugger;
            if(this.undo[this.state.chosenJson].length == 0) {
                this.getMethodCanvas().clear();
            }
            this.setState({
                objects: { 
                    ...this.state.objects,
                    [this.state.chosenJson]: this.undo[this.state.chosenJson].length > 0 ? JSON.parse(this.undo[this.state.chosenJson][this.undo[this.state.chosenJson].length - 1]).objects : []
                }
                    // front: this.undo['front'].length > 0 ? JSON.parse(this.undo['front'][this.undo['front'].length - 1]).objects : [],
                    // back: this.undo['back'].length > 0 ? JSON.parse(this.undo['back'][this.undo['back'].length - 1]).objects : []
                
            });
            resolve();
        })
    }
    selectTag(item, index, array) {

        // this.setState({ selectInfo: { object: item.definedObject, index: index}});
        let _arr = [...array].reverse();
        index = _arr.indexOf(item);

        this.getMethodCanvas().setActiveObject(this.getMethodCanvas().item(index));
        this.getMethodCanvas().renderAll();
        // this.getMethodCanvas().item(index).activeObject();
    }

    moveHandler(index, toIndex) {

        // debugger;
        this.getMethodCanvas().item(index).moveTo(toIndex);
        this.getMethodCanvas().setActiveObject(this.getMethodCanvas().item(toIndex));
        this.getMethodCanvas().renderAll();
        this.save();

    
    }
    pasteObject() {
        let canvas = this.getMethodCanvas();

        this.objectsCopier.forEach((data)=> {
            canvas.add(data);
        });
        this.save();
        canvas.renderAll();
    }
    cloneObject() {
        let object = [];
        this.getMethodCanvas().getActiveObjects().forEach((data)=> {
            object.push(data);
        });

        this.objectsCopier = object;

        alert('复制成功, "ctrl + v" 在指定画板粘贴');

    }
    removeActive() {
        this.getMethodCanvas().discardActiveObject();
        this.getMethodCanvas().renderAll();
    }
    changeCanvasImage(value) {

        this.refs.drawBackground.style.width = this.getMethodCanvas().getWidth() + 'px';
        this.refs.drawBackground.style.height = this.getMethodCanvas().getHeight() + 'px';
        this.refs.drawBackground.style.backgroundImage = `url(${value || '/assets/toBoom/images/draw_background.png'})`;
        
        
    }

    rightToggle(event) {

        let type = event.target.dataset.type;
        let { wrapperShowInfo } = this.state;

        // let value = event.target.dataset.type;
        wrapperShowInfo[event.target.dataset.type] = wrapperShowInfo[event.target.dataset.type] ? false : true;
        this.setState({
                wrapperShowInfo: { ...wrapperShowInfo },
             }, () =>{
                let text = this.tooltip_text( type );
                if( type == 'display'){
                    this.setState({ tooltiptext1 : text })
                }else{
                    this.setState({ tooltiptext2 : text })
                }
                    
             });


    }



    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     debugger;
    // }
    initAligningGuidelines(canvas) {

        var ctx = canvas.getSelectionContext(),
            aligningLineOffset = 5,
            aligningLineMargin = 4,
            aligningLineWidth = 2,
            aligningLineColor = 'rgb(255, 218, 0)',
            // aligningLineColor = 'rgb(74, 255, 255)',
            viewportTransform,
            zoom = 1;

        function drawVerticalLine(coords) {
            drawLine(
                coords.x + 0.5,
                coords.y1 > coords.y2 ? coords.y2 : coords.y1,
                coords.x + 0.5,
                coords.y2 > coords.y1 ? coords.y2 : coords.y1);
        }

        function drawHorizontalLine(coords) {
            drawLine(
                coords.x1 > coords.x2 ? coords.x2 : coords.x1,
                coords.y + 0.5,
                coords.x2 > coords.x1 ? coords.x2 : coords.x1,
                coords.y + 0.5);
        }

        function drawLine(x1, y1, x2, y2) {
            ctx.save();
            ctx.lineWidth = aligningLineWidth;
            ctx.strokeStyle = aligningLineColor;
            ctx.beginPath();
            ctx.moveTo(((x1 + viewportTransform[4]) * zoom), ((y1 + viewportTransform[5]) * zoom));
            ctx.lineTo(((x2 + viewportTransform[4]) * zoom), ((y2 + viewportTransform[5]) * zoom));
            ctx.stroke();
            ctx.restore();
        }

        function isInRange(value1, value2) {
            value1 = Math.round(value1);
            value2 = Math.round(value2);
            for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
                if (i === value2) {
                    return true;
                }
            }
            return false;
        }

        var verticalLines = [],
            horizontalLines = [];

        canvas.on('mouse:down', function () {
            viewportTransform = canvas.viewportTransform;
            zoom = canvas.getZoom();
        });

        canvas.on('object:moving', function (e) {

            var activeObject = e.target,
                canvasObjects = canvas.getObjects(),
                activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                activeObjectBoundingRect = activeObject.getBoundingRect(),
                activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
                activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
                horizontalInTheRange = false,
                verticalInTheRange = false,
                transform = canvas._currentTransform;

            if (!transform) return;

            // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
            // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

            for (var i = canvasObjects.length; i--;) {

                if (canvasObjects[i] === activeObject) continue;

                var objectCenter = canvasObjects[i].getCenterPoint(),
                    objectLeft = objectCenter.x,
                    objectTop = objectCenter.y,
                    objectBoundingRect = canvasObjects[i].getBoundingRect(),
                    objectHeight = objectBoundingRect.height / viewportTransform[3],
                    objectWidth = objectBoundingRect.width / viewportTransform[0];

                // snap by the horizontal center line
                if (isInRange(objectLeft, activeObjectLeft)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft,
                        y1: (objectTop < activeObjectTop) ?
                            (objectTop - objectHeight / 2 - aligningLineOffset) :
                            (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop) ?
                            (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                            (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
                }

                // snap by the left edge
                if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft - objectWidth / 2,
                        y1: (objectTop < activeObjectTop) ?
                            (objectTop - objectHeight / 2 - aligningLineOffset) :
                            (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop) ?
                            (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                            (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }

                // snap by the right edge
                if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft + objectWidth / 2,
                        y1: (objectTop < activeObjectTop) ?
                            (objectTop - objectHeight / 2 - aligningLineOffset) :
                            (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop) ?
                            (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset) :
                            (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }

                // snap by the vertical center line
                if (isInRange(objectTop, activeObjectTop)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop,
                        x1: (objectLeft < activeObjectLeft) ?
                            (objectLeft - objectWidth / 2 - aligningLineOffset) :
                            (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft) ?
                            (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                            (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
                }

                // snap by the top edge
                if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop - objectHeight / 2,
                        x1: (objectLeft < activeObjectLeft) ?
                            (objectLeft - objectWidth / 2 - aligningLineOffset) :
                            (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft) ?
                            (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                            (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
                }

                // snap by the bottom edge
                if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop + objectHeight / 2,
                        x1: (objectLeft < activeObjectLeft) ?
                            (objectLeft - objectWidth / 2 - aligningLineOffset) :
                            (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft) ?
                            (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset) :
                            (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
                }
            }

            if (!horizontalInTheRange) {
                horizontalLines.length = 0;
            }

            if (!verticalInTheRange) {
                verticalLines.length = 0;
            }
        });

        canvas.on('before:render', function () {
            canvas.clearContext(canvas.contextTop);
        });

        canvas.on('after:render', function () {
            for (var i = verticalLines.length; i--;) {
                drawVerticalLine(verticalLines[i]);
            }
            for (var i = horizontalLines.length; i--;) {
                drawHorizontalLine(horizontalLines[i]);
            }

            verticalLines.length = horizontalLines.length = 0;
        });

        canvas.on('mouse:up', function () {
            verticalLines.length = horizontalLines.length = 0;
            canvas.renderAll();
        });
    }
    initCenteringGuidelines(canvas) {

        var canvasWidth = canvas.getWidth(),
            canvasHeight = canvas.getHeight(),
            canvasWidthCenter = canvasWidth / 2,
            canvasHeightCenter = canvasHeight / 2,
            canvasWidthCenterMap = {},
            canvasHeightCenterMap = {},
            centerLineMargin = 4,
            centerLineColor = 'rgb(255, 218, 0)',
            // centerLineColor = 'rgb(74, 255, 255)',
            // centerLineColor = 'rgba(255,0,241,0.5)',
            centerLineWidth = 1,
            ctx = canvas.getSelectionContext(),
            viewportTransform;

        for (var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
            canvasWidthCenterMap[Math.round(i)] = true;
        }
        for (var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
            canvasHeightCenterMap[Math.round(i)] = true;
        }

        function showVerticalCenterLine() {
            showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
        }

        function showHorizontalCenterLine() {
            showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
        }

        function showCenterLine(x1, y1, x2, y2) {
            ctx.save();
            ctx.strokeStyle = centerLineColor;
            ctx.lineWidth = centerLineWidth;
            ctx.beginPath();
            ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
            ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
            ctx.stroke();
            ctx.restore();
        }

        var afterRenderActions = [],
            isInVerticalCenter,
            isInHorizontalCenter;

        canvas.on('mouse:down', function () {
            viewportTransform = canvas.viewportTransform;
        });

        canvas.on('object:moving', function (e) {
            var object = e.target,
                objectCenter = object.getCenterPoint(),
                transform = canvas._currentTransform;

            if (!transform) return;

            isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap,
                isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;

            if (isInHorizontalCenter || isInVerticalCenter) {
                object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
            }
        });

        canvas.on('before:render', function () {
            canvas.clearContext(canvas.contextTop);
        });

        canvas.on('after:render', function () {
            if (isInVerticalCenter) {
                showVerticalCenterLine();
            }
            if (isInHorizontalCenter) {
                showHorizontalCenterLine();
            }
        });

        canvas.on('mouse:up', function () {
            // clear these values, to stop drawing guidelines once mouse is up
            isInVerticalCenter = isInHorizontalCenter = null;
            canvas.renderAll();
        });
    }
    handlerCancel() {
        this.setState({
            changeAlert: false
        })
    }

    // 2018.11.27---------lsh 开始---------
    handlerWorksCancel() {
        this.setState({
            changeWorksAlert: false
        })
    }
    // 2018.11.27---------lsh 结束---------

    // 2018.11.27---------lsh 开始---------
    handleWorksConfirm() {
        // debugger;
        // next();
        // debugger;
        
        this.setState({
            changeWorksAlert: false,
            storeItem: {
                ...this.state.storeItem, 
                frontIndex: this.objectFilter(this.frontCanvas, this.state.storeItem.item),
                backIndex: this.objectFilter(this.backCanvas, this.state.storeItem.item)
            }
        });
        this.addObject(this.state.storeItem.item, true);
    }
    confirmRight() {
        this.setState({
            showRight: false
        })
    }
    cancelRight() {
        this.setState({
            showRight: false
        })
    }
    // 2018.11.27---------lsh 结束---------

    handleConfirm() {
        // debugger;
        // next();
        // debugger;
        
        this.setState({
            changeAlert: false,
            storeItem: {
                ...this.state.storeItem, 
                frontIndex: this.objectFilter(this.frontCanvas, this.state.storeItem.item),
                backIndex: this.objectFilter(this.backCanvas, this.state.storeItem.item)
            }
        });
        this.addObject(this.state.storeItem.item, true);
    }
    confirmRight() {
        this.setState({
            showRight: false
        })
    }
    cancelRight() {
        this.setState({
            showRight: false
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeEvent, false);
        window.removeEventListener('keydown', this.keyDownHandler, false);
        window.removeEventListener('keyup', this.keyUpHandler, false);

    }
    componentDidMount() {
        let _this = this;
        // debugger;
        if (this.props.resourceId) {
            this.props.fetchProductData().then((data) => {
                this.fabricInit(data).then(() => {
                    this.keyBinder();
                })
            })
            // this.props.getJSON().then((data) => {
            //     let saveJSON = !!data.canvasInfo ? JSON.parse(decodeURI(data.canvasInfo)) : this.props.canvasJSON;
            //     // debugger;

            //     this.props.canvasJSON = saveJSON;

            // });
        } else {
            let saveJSON = this.props.canvasJSON;
            this.fabricInit(saveJSON).then(() => {
                // this.props.onSave();
                this.keyBinder();
            })
        }


        //  
        // this.state.resourceId && 


        // console.log(/\d + /.exec(props.location.search)[0])

        // debugger;

        // this.saveObjectLength = !!stateJSON ? JSON.parse(saveJson).objects.length : [];
    }
    
    render() {
        // debugger;
        let objects = this.state.objects[this.state.chosenJson];
        // console.log(this.undo);
   
        // console.log(this.state.chosenJson, ': ', this.props.canvasJSON);
        // console.log(this.state.chosenJson, ': ', this.props.canvasJSON);
        // console.log(this.state.chosenJson, ': ', JSON.parse(this.props.canvasJSON[this.state.chosenJson]));
        // console.log(objects);
        return (
             <div className="draw-wrapper" style={{backgroundImage: `url(${blank})`}} ref="drawWrapper">

                <div className="draw-canvas" style={{display: this.state.chosenJson == 'front' ? 'block' : 'none' }}>
                    <canvas ref="canvas" width="200" height="500"></canvas>
                </div>

                <i className="draw-background draw-background-i" ref="drawBackground"></i>

                <div className="click-outsider" onClick={this.removeActive.bind(this)}></div>

                <div className="back-canvas"  style={{display: this.state.chosenJson == 'back' ? 'block' : 'none' }}>
                    <canvas ref="backCanvas" width="200" height="500"></canvas>
                </div>


                <div className="display-wrapper">
                    <div className="display-layout" style={{height: this.state.showHeight}}>

                     {/* style={{opacity: this.state.wrapperShowInfo.display ? '1' : '0'}} */}
                     <Tooltip placement="top" title={ this.state.chosenJson == 'front' ? '反面视图' : '正面视图' }>
                        <div className={"display-album " + (this.state.wrapperShowInfo.display ? 'show-dragger': 'hide-dragger')}  onClick={this.switchAction.bind(this)}>
                            {/* <img src={} /> */}
                            <canvas className="show-canvas" ref="showCanvas"></canvas>
                            <img className="draw-background" src="/assets/toBoom/images/designManager/toggleBg.png"/>
                        </div>
                        </Tooltip>

                        {
                            this.state.showHeight && ( 
                                <DragComponent 
                                    wrapperShowInfo={this.state.wrapperShowInfo}
                                    selectInfo={this.state.selectInfo}
                                    moveHandler={this.moveHandler.bind(this)}
                                    objects={objects} 
                                    selectTag={this.selectTag.bind(this)} />)
                        }

                    </div>
                </div>

                <div className="display-wrapper wrapper-icon">
                    <div className="display-layout" style={{height: this.state.showHeight}}>

                        <div className="method-icons" onClick={this.rightToggle.bind(this)}>
                                {/* this.state.chosenJson == 'front' ? '显示反面视图' : '显示正面视图'        图层管理 */}
                            <Tooltip placement="bottom" title={ this.state.tooltiptext1 }>
                                <img src="assets/toBoom/images/direction_toggle.png" alt="正反切换"  data-type="display" />
                            </Tooltip>

                            <Tooltip placement="bottom" title={ this.state.tooltiptext2 } >
                                <img src="assets/toBoom/images/layout_manage.png" alt="图层管理"   data-type="drag" />
                            </Tooltip>
                        </div>

                    </div>
                </div>


                {this.props.children}
                
                <div className="design-monster">

                </div>
                
                <Modal
                    title="替换廓形"
                    show={this.state.changeAlert}
                    text="是否替换廓形？"
                    onCancel={this.handlerCancel.bind(this)}
                    onConfirm={this.handleConfirm.bind(this)}
                    onCross={this.handlerCancel.bind(this)}
                    handlerCross
                    isNeedAlert={ false }
                    // confirmText={ Store.globalInfo.modalInfo.code == 401 ? "登录" : "下载客户端"}
                    // cancelText="注册"
                    isAlert
                    // hideCancel={ Store.globalInfo.modalInfo.code != 401 }
                    // isSubmit={ true }
                    >

                </Modal>


                {/* 2018.11.27 ------lsh-----开始 */}
                <Modal
                    title="覆盖"
                    show={this.state.changeWorksAlert}
                    text="是否覆盖当前作品？"
                    onCancel={this.handlerWorksCancel.bind(this)}
                    onConfirm={this.handleWorksConfirm.bind(this)}
                    onCross={this.handlerWorksCancel.bind(this)}
                    handlerCross
                    isAlert
                    isNeedAlert={ false }
                    >
                </Modal>
                {/* 2018.11.27 ------lsh-----结束 */}



                <Modal
                    title="未购买会员"
                    show={this.state.showRight}
                    onCancel={this.cancelRight.bind(this)}
                    onConfirm={this.confirmRight.bind(this)}
                    onCross={this.cancelRight.bind(this)}
                    handlerCross
                    // confirmText={ Store.globalInfo.modalInfo.code == 401 ? "登录" : "下载客户端"}
                    // cancelText="注册"
                    hideCancel
                    >
                    <div className="info-wrapper">
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{width: 64 + 'px', height: 56 + 'px' }}>
                                <img src="/assets/toBoom/images/warn.png" alt="" style={{width: 100 + '%', height: 100 + '%' }}/>
                            </div>
                            <span style={{marginLeft: 30 + 'px', fontSize: 18 + 'px'}}>您正在使用收费内容,由于您<span style={{color:"#ffb07a"}}>{this.state.showText}</span>,暂无权限查看</span>
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}


class DragComponent extends React.Component {
    dragStartBinder(event) {    
        event.currentTarget.dataset.dragIndex = event.target.dataset.index;
    }
    dragEnterBinder(event) {
        // debugger;
        Array.from(event.currentTarget.lastChild.children).forEach((child)=> {
            child.style.marginTop = 0;
        })
        event.target.style.marginTop = 10 + 'px';
    }
    dragLeaveBinder(event) {
        // Array.from(event.currentTarget.children).forEach((child) => {
        //     child.style.marginTop = 0;
        // })
        // deb
        // debugger;
        // event.target.style.marginTop = 0 + 'px';   
    }
    dragEndBinder(event) {   
        // Array.from(event.currentTarget.children).forEach((child)=> {
        //     child.style.marginTop = 0;
        // })
    }
    dropBinder(event) {

        Array.from(event.currentTarget.lastChild.children).forEach((child) => {
            child.style.marginTop = 0;
        })
        // console.log(event.target.dataset.index);

        // let objects = [...this.props.objects];


        // debugger;
        this.props.moveHandler(event.currentTarget.dataset.dragIndex, event.target.dataset.index);
    }
    tagFilter(object, activeIndex, array) {
        // debugger;
        let { objects, index } = this.props.selectInfo;
        let classname = "", 
        _arr = [...array],
        reverseIndex = this.arrayReveseIndex(object, array);

        // reverseIndex = array.reverse().indexOf(object);
        // array.reverse()
        // console.log(array.indexOf(object));
        // activeIndex = array.reverse().indexOf(object);
        if (index.some((i) => i == reverseIndex)) {
            classname = "select-tag";
        } else {
            classname = '';
        }
        
        return classname;
    }
    arrayReveseIndex(object, array) {
        let _arr = [...array];
        return _arr.reverse().indexOf(object)
    }
    render() {
        let { objects, selectTag, selectInfo } = this.props;
        // debugger;
        // console.log(objects);
        objects = Array.from(objects).reverse();
        // console.log(objects);
        
        return (
            <div 
                data-drag-index="0"
                onDrop={this.dropBinder.bind(this)}
                onDragStart={this.dragStartBinder.bind(this)}
                onDragOver={event=> {event.preventDefault()}}
                onDragEnter={this.dragEnterBinder.bind(this)}
                onDragLeave={this.dragLeaveBinder.bind(this)}
                onDragEnd={this.dragEndBinder.bind(this)}
                style={{backgroundImage: "url(/assets/toBoom/images/layer_manage.png)"}}
                className={"drag-wrapper " + (this.props.wrapperShowInfo.drag ? 'show-dragger': 'hide-dragger')}
            >
            {/* <img src="/assets/toBoom/images/layer_manage.png" /> */}
            {/* <img src="/assets/sss.png"/> */}
                <header></header>
                <ul>
                    {
                        objects.map((object, index, array) => (
                            <li 
                                key={index}
                                data-index={this.arrayReveseIndex(object, array)}
                                data-name={object.title}
                                className={`drag-content transition-bottom ${this.tagFilter(object, index, array)}`}
                                draggable="true"
                                onClick={selectTag.bind(this, object, index, array)}
                                onDragStart={(event)=> {event.dataTransfer.setData('text/plain',null)}}>
                                {/* {object.definedObject.lack_category[0]} */}
                                
                                {object.definedObject.title}
                            </li>
                        ))
                    }
                </ul>

            </div>
        )
    }
} 
