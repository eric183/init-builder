import React from 'react';
import * as defaultMobx  from 'mobx';
import { SearchTool } from '@/components/search';
import { observer } from 'mobx-react';
import { TransitionGroup, CSSTransition, Transition } from 'react-transition-group';
import { Tooltip } from 'antd';




@observer
export default class AlbumWrapper extends React.Component {
    // modalHandler={this.modalHandler.bind(this)}
    state = {
        showSearchModal: false,
        searchValue: '',
        tags: [],

        // ```````lsh 增加的 2018-12-12 start `````````````
        imgTranSlateY: '49px',
        mouseEnterImg: false,

        designHelp: false,
        existedStyleHelp: false,
        zeroStartHelp: false,
        shortcutKeyHelp: false,
        totalHelp: false,
        isChangeDesignArrow: false,
        isChangeExistedArrow: false,
        isChangeZeroArrow: false,
        isChangeShortcutArrow : false,
        isChangeTotalArrow: false,
        isShowHelpModel: false,
        closeHelpBg: false,

        wantStyleStatus: false,
        replacShapeStatus: false,
        addReplacePartStatus: false,
        switchPicStatus: false,
        picMoveStatus: false,
        drawroTationStatus: false,
        levelMove: false,
        recoveryStatus: false,
        lockPicState: false,
        namedWorksStatus: false,
        deleteWorksStatus: false,
        logWorksStatus: false,
        downWorksStatus: false,
        newlyBuildStatus: false,
        keepWorksStatus: false,
        recentModiWorksStatus: false,
        blankCanvasStatus: false,
        searchLabelStatus: false,
        selectPartStatus: false,
        referToExistStyleDate: [
            {   
                id: "001",
                title: "找到你想要参考的款式",
                englishname: "wantstyle"
            },
            {
                id: "002",
                title: "替换廓形",
                englishname: "replaceprofile"
            },
            {
                id: "003",
                title: "添加/更换部件",
                englishname: "addreplacepart"
            },
            {
                id: "004",
                title: "切换正反视图",
                englishname: "switchpic"
            },
            {
                id: "005",
                title: "图层移动",
                englishname: "picmove"
            },
            {
                id: "006",
                title:  "拉伸旋转",
                englishname: "drawrotation"
            },
            {
                id: "007",
                title: "水平翻转",
                englishname: "levelmove"
            },
            // {
            //     id: "008",
            //     title: "还原",
            //     englishname: "recovery"
            // },
            // {
            //     id: "009",
            //     title: "锁定",
            //     englishname: "lockpic"
            // },
            {
                id: "010",
                title: "命名作品",
                englishname: "namedworks"
            },
            {
                id: "011",
                title: "删除",
                englishname: "deleteworks"
            },
            {
                id: "012",
                title: "足迹",
                englishname: "logworks"
            },
            {
                id: "013",
                title: "下载",
                englishname: "downworks"
            },
            {
                id: "014",
                title: "新建",
                englishname: "newlybuild"
            },
            {
                id: "015",
                title: "保存",
                englishname: "keepworks"
            },
            {
                id: "016",
                title: "最近修改",
                englishname: "recentmodiworks"
            }         
        ],
        zeroBeginDesignDate: [
            {
                id: "1001",
                title: "创建一个空白画布",
                englishname: "blankcanvas"
            },
            {
                id: "1002",
                title: "分类搜索与个性化标签",
                englishname: "searchlabel",
            },
            {
                id: "1003",
                title: "选择你想要的部件 / 廓形",
                englishname: "selectpart",
            },
            {
                id: "1004",
                title: "切换正反视图",
                englishname: "switchpic"
            },
            {
                id: "1005",
                title: "图层移动",
                englishname: "picmove"
            },
            {
                id: "1006",
                title:  "拉伸旋转",
                englishname: "drawrotation"
            },
            {
                id: "1007",
                title: "水平翻转",
                englishname: "levelmove"
            },
            // {
            //     id: "1008",
            //     title: "还原",
            //     englishname: "recovery"
            // },
            // {
            //     id: "1009",
            //     title: "锁定",
            //     englishname: "lockpic"
            // },
            {
                id: "1010",
                title: "命名作品",
                englishname: "namedworks"
            },
            {
                id: "1011",
                title: "删除",
                englishname: "deleteworks"
            },
            {
                id: "1012",
                title: "足迹",
                englishname: "logworks"
            },
            {
                id: "1013",
                title: "下载",
                englishname: "downworks"
            },
            {
                id: "1014",
                title: "新建",
                englishname: "newlybuild"
            },
            {
                id: "1015",
                title: "保存",
                englishname: "keepworks"
            },
            {
                id: "1016",
                title: "最近修改",
                englishname: "recentmodiworks"
            }
        ],
        button1Flag1: false
        // ```````lsh 增加的 2018-12-12 end `````````````
    }



    // onCancel() {
    //     this.setState({
    //         showSearchModal: false
    //     })
    // }




    // 获取已选标签
    getParams = ( tags = this.state.tags ) =>{

        var object = {};

        var _param = {};


          tags.forEach((data) => {

            if( data.type && data.type == 'keywords' ){

                   _param.keywords = data.name;

            }else{

                var _array = Object.keys(object);

                if ( !_array.some(ar => ar == data['group_name']) ) {
    
                    object[data['group_name']] = [];

                }

                object[data['group_name']].push(data.name);
            }
        });

        _param.attrs = object 

      return _param

    }



     // 修改 wq_2018-11-24 start 
     get_requestStrings = ( params = { attrs : {} } ) =>{
          var _requestStrings  = this.props.requestStrings;
          var flag = _requestStrings.some((item, index) => item.text == '收藏' );
             _requestStrings.forEach((item,index) => {
                     if( index > 0 ){
                              if( flag ){
                                   params.type = 'collect';
                                }else{
                                    params.attrs[ item.group_name ] instanceof Array ?  params.attrs[ item.group_name ].push( item.text ) 
                                    :   params.attrs[ item.group_name ] = [ item.text  ];
                                }
                     }else{
                        params.type =  item.type;
                     }   
        
            });

     }




    cancelBinder( tags ) {
       var copy_tags = tags.concat();
       //如果有 keywords
       this.state.tags.forEach((item, index ) => { item.type == 'keywords' ? copy_tags.push( item ) : '' } )

       var params = this.getParams( copy_tags );

       this.get_requestStrings( params);

       this.props.editorStore.fetchEditData( params, true)
            .then(({data}) => {
                this.setState({  showSearchModal: false, tags: copy_tags });

        });

    
    }

   // 修改 wq_2018-11-21:15:12 end 




    // 删除已选标签， 
    deleteTag(item, index) {

        this.searchTool.deleteSelectedTag( item );  // 移出已选标签

        this.state.tags.splice(index, 1);

        var _param = this.getParams();

        this.get_requestStrings( _param );

        this.props.editorStore.fetchEditData(_param, true).then((data) => {
            this.setState({
                showSearchModal: false,
                tags: [...this.state.tags]
            });
        })


    }
    


     // 搜索关键字
    valueBinder(value) {

          // this.setState({  searchValue: value.target.value });
        if( value == '' || value == undefined || value == null ) return false;

        var _param = this.getParams();

            _param.keywords =  value;

            this.get_requestStrings( _param );

           this.props.editorStore.fetchEditData(_param, true).then((data)=> {

               // if (this.props.editorStore.editData.length == 0) return;
               // 关键词不能有多个
               this.setState(( state ) =>{
                     let _index = -1; 
                     state.tags.forEach(( item, j ) => { if( item.type && item.type == 'keywords'  ) _index = j  });

                     if( _index > -1 ){

                        state.tags[_index].name = value;

                     }else{

                        state.tags.push( { name : value , type : 'keywords' } )

                     }

                     return state.tags

               })

        })



    }


    pageNext(event) {
        // debugger;
        if (event.target.scrollTop >= event.target.scrollHeight - event.target.clientHeight - 20) {
            var _param = this.getParams();
            this.get_requestStrings( _param );
            this.props.pageNext( _param );

        }

    }



    _clearAction = () =>{
        this.searchTool.cleanAllTags(); //  searchTool 清空已选标签      wq_2018-11-21:15:12
        this.searchTool.cleanSearchValue();  // searchTool 清除搜索框    wq_2018-11-21:15:12
        this.setState({ tags : [] });  // 清空已选标签
    }



    _fetchTag(event){
        this._clearAction(); // 清空已选标签
        this.props.fetchTag(event);

        // `````````````````lsh 增加的 分别点击廓形 款式 部件 足迹 按钮,后 关闭了新手指引的页面,但小怪兽出来了 2018-12-19 13:42  start````````````````````
        this.setState({
            isShowHelpModel: false,

            wantStyleStatus: false,
            replacShapeStatus: false,
            addReplacePartStatus: false,
            switchPicStatus: false,
            picMoveStatus: false,
            drawroTationStatus: false,
            levelMove: false,
            recoveryStatus: false,
            lockPicState: false,
            namedWorksStatus: false,
            deleteWorksStatus: false,
            logWorksStatus: false,
            downWorksStatus: false,
            newlyBuildStatus: false,
            keepWorksStatus: false,
            recentModiWorksStatus: false,
            blankCanvasStatus: false,
            searchLabelStatus: false,
            selectPartStatus: false,

            isChangeDesignArrow: false,
            isChangeExistedArrow: false,
            isChangeZeroArrow: false,
            isChangeShortcutArrow: false
        })
        // `````````````````lsh 增加的 分别点击廓形 款式 部件 足迹 按钮,后 关闭了新手指引的页面,但小怪兽出来了 2018-12-19 13:42  start````````````````````

    }

    componentDidMount() {
        
    }


    // `````````````````lsh 增加的 2018-12-12  start````````````````````
    handleLittleMonster() {
        this.setState({
            isShowHelpModel: true
        })
    }

    changeHelpThemePic(string) {
        let themePicData = {
            designHelp: false,
            existedStyleHelp: false,
            zeroStartHelp: false,
            shortcutKeyHelp: false,
            totalHelp: false,
            closeHelpBg: false
        };
        themePicData[string] = true ;
        this.setState(themePicData);
    }
    handleMouseEnterHelpTheme(event) {
        switch(event.currentTarget.dataset.help) {
            case 'designhelp':
                this.changeHelpThemePic('designHelp');
            break;
            case 'existedstylehelp':
                this.changeHelpThemePic('existedStyleHelp');
            break;
            case 'zerostarthelp':
                this.changeHelpThemePic('zeroStartHelp');
            break;
            case 'shortcutkeyhelp':
                this.changeHelpThemePic('shortcutKeyHelp');
            break;
            case 'totalhelp':
                this.changeHelpThemePic('totalHelp');
            break;
            case 'closehelp':
                this.changeHelpThemePic('closeHelpBg');
            break;
            default:
                console.log('no match');
            break;
        }

    }

    otherChangeHelpThemePic(string) {
        let otherthemePicData = {
            designHelp: false,
            existedStyleHelp: false,
            zeroStartHelp: false,
            shortcutKeyHelp: false,
            totalHelp: false,
            closeHelpBg: false
        };
        otherthemePicData[string] = false ;
        this.setState(otherthemePicData);
    }
    handleMouseLeaveHelpTheme(event) {
        switch(event.currentTarget.dataset.help) {
            case 'designhelp':
                this.otherChangeHelpThemePic('designHelp');
            break;
            case 'existedstylehelp':
                this.otherChangeHelpThemePic('existedStyleHelp');
            break;
            case 'zerostarthelp':
                this.otherChangeHelpThemePic('zeroStartHelp');
            break;
            case 'shortcutkeyhelp':
                this.otherChangeHelpThemePic('shortcutKeyHelp');
            break;
            case 'totalhelp':
                this.otherChangeHelpThemePic('totalHelp');
            break;
            case 'closehelp':
                this.otherChangeHelpThemePic('closeHelpBg');
            break;
            default:
                console.log('no match');
            break;
        }
    }

    ChangeArrowPic(string) {
        let allowPicData = {
            isChangeDesignArrow: false,
            isChangeExistedArrow: false,
            isChangeZeroArrow: false,
            isChangeShortcutArrow : false,
            isChangeTotalArrow: false
        };
        // allowPicData[string] = true ;
        allowPicData[string] = !this.state[string] ;
        this.setState(allowPicData);
    }

    

    handleClickEveryHelpHheme(event) {

        switch(event.currentTarget.dataset.help) {

            case 'designhelp':
                this.ChangeArrowPic('isChangeDesignArrow');
            break;

            case 'existedstylehelp':
                this.ChangeArrowPic('isChangeExistedArrow');

                var rectInfo =  document.getElementById("container").getClientRects()[0];
                var targetRectInfo = event.target.getClientRects()[0];
                //console.log( rectInfo );
                //console.log( targetRectInfo );
                //console.log( targetRectInfo.top - rectInfo.top );

                var parentNode = document.querySelector(".help-center-content");

                //parentNode.scrollTop = targetRectInfo.top - rectInfo.top;

                setTimeout(()=> {
                    parentNode.scrollTop = targetRectInfo.top - rectInfo.top;
                },100);
            break;

            case 'zerostarthelp':
                this.ChangeArrowPic('isChangeZeroArrow');

                var rectInfo =  document.getElementById("container").getClientRects()[0];
                var targetRectInfo = event.target.getClientRects()[0];
                //console.log( rectInfo );
                //console.log( targetRectInfo );

                var parentNode = document.querySelector(".help-center-content");

                //  parentNode.scrollTop = targetRectInfo.top - rectInfo.top;
    
                setTimeout(()=>{
                    parentNode.scrollTop = targetRectInfo.top - rectInfo.top;
                },100);        
            break;

            case 'shortcutkeyhelp':
                this.ChangeArrowPic('isChangeShortcutArrow');

                var rectInfo =  document.getElementById("container").getClientRects()[0];
                var targetRectInfo = event.target.getClientRects()[0];
                //console.log( rectInfo );
                //console.log( targetRectInfo );

                var parentNode = document.querySelector(".help-center-content");

                //parentNode.scrollTop = targetRectInfo.top - rectInfo.top;
                      
                setTimeout(()=> {
                    parentNode.scrollTop = targetRectInfo.top - rectInfo.top;
                },100);
            break;

            case 'totalhelp':
                this.ChangeArrowPic('isChangeTotalArrow');
            break;

            default:
                console.log('no match');
            break;
        }
    }




    //```````````` 点击新手指引的 右上角的 关闭按钮,后 关闭了新手指引的页面,但小怪兽出来了  开始````````
    clickHelpClose() {
        this.setState({
            isShowHelpModel: false,

            wantStyleStatus: false,
            replacShapeStatus: false,
            addReplacePartStatus: false,
            switchPicStatus: false,
            picMoveStatus: false,
            drawroTationStatus: false,
            levelMove: false,
            recoveryStatus: false,
            lockPicState: false,
            namedWorksStatus: false,
            deleteWorksStatus: false,
            logWorksStatus: false,
            downWorksStatus: false,
            newlyBuildStatus: false,
            keepWorksStatus: false,
            recentModiWorksStatus: false,
            blankCanvasStatus: false,
            searchLabelStatus: false,
            selectPartStatus: false,

            isChangeDesignArrow: false,
            isChangeExistedArrow: false,
            isChangeZeroArrow: false,
            isChangeShortcutArrow: false
        })
    }
    //```````````` 点击新手指引的 右上角的 关闭按钮,后 关闭了新手指引的页面,但小怪兽出来了  结束````````

    existedMouseEnter(event) {
        //console.log(event.target);
        event.target.style.color = '#F4747E';
    }

    existedMouseLeave(event) {
        event.target.style.color = '#72a1d9';
    }

    funtionDescExplain(string) {
        let descExplainData = {
            wantStyleStatus: false,
            replacShapeStatus: false,
            addReplacePartStatus: false,
            switchPicStatus: false,
            picMoveStatus: false,
            drawroTationStatus: false,
            levelMove: false,
            recoveryStatus: false,
            lockPicState: false,
            namedWorksStatus: false,
            deleteWorksStatus: false,
            logWorksStatus: false,
            downWorksStatus: false,
            newlyBuildStatus: false,
            keepWorksStatus: false,
            recentModiWorksStatus: false,
            blankCanvasStatus: false,
            searchLabelStatus: false,
            selectPartStatus: false,
        }
        descExplainData[string] = true;
        this.setState(descExplainData);
    }
    existedItemClick(wantobject,event) {
        //console.log(wantobject);
        //console.log(event.target.dataset.existedstyles);
        switch(event.target.dataset.existedstyles) {
            case 'wantstyle':
                this.funtionDescExplain('wantStyleStatus');
            break;
            case 'replaceprofile':
                this.funtionDescExplain('replacShapeStatus');
            break;
            case 'addreplacepart':
                this.funtionDescExplain('addReplacePartStatus');
            break;
            case 'switchpic':
                this.funtionDescExplain('switchPicStatus');
            break;
            case 'picmove':
                this.funtionDescExplain('picMoveStatus');
            break;
            case 'drawrotation':
                this.funtionDescExplain('drawroTationStatus');
            break;
            case 'levelmove':
                this.funtionDescExplain('levelMove');
            break;
            case 'recovery':
                this.funtionDescExplain('recoveryStatus');
            break;
            case 'lockpic':
                this.funtionDescExplain('lockPicState');
            break;
            case 'namedworks':
                this.funtionDescExplain('namedWorksStatus');
            break;
            case 'deleteworks':
                this.funtionDescExplain('deleteWorksStatus');
            break;
            case 'logworks':
                this.funtionDescExplain('logWorksStatus');
            break;
            case 'downworks':
                this.funtionDescExplain('downWorksStatus');
            break;
            case 'newlybuild':
                this.funtionDescExplain('newlyBuildStatus');
            break;
            case 'keepworks':
                this.funtionDescExplain('keepWorksStatus');
            break;
            case 'recentmodiworks':
                this.funtionDescExplain('recentModiWorksStatus');
            break;
            case 'blankcanvas':
                this.funtionDescExplain('blankCanvasStatus');
            break;
            case 'searchlabel':
                this.funtionDescExplain('searchLabelStatus');
            break;
            case 'selectpart':
                this.funtionDescExplain('selectPartStatus');
            break;
            default:
                console.log('no match');
            break;
        }
    }

    fromHelpToDesign() {
        location.hash = '/design/management';
    }

    fromHelpToStylegallery() {
        location.hash = '/stylegallery';
    }

    fromHelpToPopular() {
        location.hash = '/popular';
    }

    helpGoBack() {
        this.setState({
            wantStyleStatus: false,
            replacShapeStatus: false,
            addReplacePartStatus: false,
            switchPicStatus: false,
            picMoveStatus: false,
            drawroTationStatus: false,
            levelMove: false,
            recoveryStatus: false,
            lockPicState: false,
            namedWorksStatus: false,
            deleteWorksStatus: false,
            logWorksStatus: false,
            downWorksStatus: false,
            newlyBuildStatus: false,
            keepWorksStatus: false,
            recentModiWorksStatus: false,
            blankCanvasStatus: false,
            searchLabelStatus: false,
            selectPartStatus: false
        })
    }

    // `````````````````lsh 增加的 2018-12-12 结束````````````````````

    render() {

        let { editData, editAllTags } = this.props.editorStore;


        return (
           <div className="album-wrapper" ref="albumWrapper">
                <div className="album-top" ref="albumTop">
                    <div className="catalog-left">
                        {/* 面包屑 */}
                         <div className="catalog-name">
                            {
                                this.props.requestStrings.map(( item, index)=> (
                                    <div className="file-name cursor-style" key={index} data-role="crumb" 
                                         onClick={ () => { this.props.crumbsBinder( item ) } } >
                                         <Tooltip placement="top" title={ item.text }>
                                          <span className="file-name-span" >{ item.text }</span>
                                          </Tooltip>
                                        <div className="division-pic"></div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <img className="design-dots" src="/assets/toBoom/images/design_dots.png" />

                     <div className="search-component"  style={{ minHeight: 36, visibility: `${ this.props.hideSearch ? 'visible' : 'hidden'}` }}>
                        <SearchTool 
                            onRef={ ( ref ) => { this.searchTool = ref } }
                            editorStore={this.props.editorStore}
                            value={this.state.searchValue}
                            data={editAllTags}
                            onChange={this.valueBinder.bind(this)}
                            onCancel={this.cancelBinder.bind(this)} />
                    </div>
                    
                    {/* <SearchTool /> */}
                    {/* ·············2018.11.27 14:10 lsh 开始 ···········*/}
                    {/* <div className="tag-component"> */}
                    <div className="tag-component" style={{display:`${this.props.hideSearch ? 'block' : 'none'}`}}>
                    {/* ·············2018.11.27 14:10 lsh 结束 ···········*/}
                        {
                            this.state.tags.map((tag, index) => (
                            // ·············2018.11.27 15:40 lsh 开始 ···········
                                // <div className="tag-content" key={index} >
                                <div className="tag-content" key={index} style={{display:'inline-block'}}>
                            {/* // ·············2018.11.27 15:40 lsh 结束 ··········· */}
                                    {tag.name}
                                    {/* <span>x</span> */}
                                    <i className="iconfont shanchu" onClick={this.deleteTag.bind(this, tag, index)}></i>
                                </div>
                            ))
                        }
                    </div>
                 </div>

            {/* <TransitionGroup className="album-list" ref="albumList" onScroll={this.pageNext.bind(this)}>
                    {
                        editData.length && editData.map((data, index) => (
                            <CSSTransition
                                key={index}
                                classNames="message"
                                timeout={500}
                                >
                                <div className="album-block albummove" key={index} onClick={this.props.addObject.bind(this, data)}>
                                    <i style={{backgroundImage: `url(/assets/toBoom/images/designManager/singleShowBG.png)`}}></i>
                                    <img 
                                    // onClick={this.props.addObject.bind(this, {name: "murata range", src: "/assets/1.jpg"})}
                                        // style={{display: 'none'}}
                                        ref="image" 
                                        src={data.src[0].cut} />
                                </div>
                            
                            </CSSTransition>
                        ))
                    }
                </TransitionGroup> */}
                 <div className="album-list-warpper" ref="album_list_wrapper" style={{ overflowY : 'scroll' }}  onScroll={this.pageNext.bind(this)} >
                     {
                        editData.length > 0 ? (
                            // ·············2018.11.27 14:10 lsh 开始 ···········
                            // <TransitionGroup className={`album-list ${this.props.hideSearch ? '': 'album-list-addon'} album-list-left`} ref="albumList" >
                            <TransitionGroup className={`album-list  album-list-left `} ref="albumList" >
                            {/* // ·············2018.11.27 14:10 lsh 结束 ··········· */}
                                 {
                                    editData.map((data, index) => (
                                        <CSSTransition
                                            key={index}
                                            classNames="message"
                                            timeout={500}
                                        >
                                            <div className="album-block albummove" key={index} onClick={this.props.addObject.bind(this, data)}>
                                                <i style={{backgroundImage: `url(/assets/toBoom/images/designManager/singleShowBG.png)`}}></i>
                                                <img 
                                                // onClick={this.props.addObject.bind(this, {name: "murata range", src: "/assets/1.jpg"})}
                                                    // style={{display: 'none'}}
                                                    ref="image" 
                                                    src={ data.src[0].cut  || data.src[0].value } />
                                            </div>
                                        </CSSTransition>
                                    ))
                                }
                            </TransitionGroup>
                        ) : (
                            <div className="album-list">
                                <div className="album-list-empty" style={{fontSize:15, fontFamily:'uzi', marginTop:'70%'}}>
                                    <img style={{ display:'block', margin : '0 auto' }} src="/assets/toBoom/images/album-list-empty.png" />
                                </div>
                            </div>
                        )
                }

              </div>
            



               
                {/* <img 
                    onClick={this.props.addObject.bind(this, {name: "murata range", src: "/assets/1.jpg"})}
                    // style={{display: 'none'}}
                    ref="image" 
                    src="/assets/1.jpg" />
            
                <img 
                    onClick={this.props.addObject.bind(this, {name: "村田 蓮爾", src: '/assets/2.jpg'})}
                    // style={{display: 'none'}}
                    ref="image" 
                    src="/assets/2.jpg" /> */}


                <div className="float-content">

                  <ul onClick={ this._fetchTag.bind(this) }>
                        <li data-attr="contour" id="ribbon">
                            <span>廓形</span> 
                            {/* <i style={{backgroundImage: 'url(/assets/toBoom/images/edit_contour.png)'}}></i> */}
                            <i style={{backgroundImage: `url(/assets/toBoom/images/${ this.props.selectContourPic ? 'edit_contour.png' : 'editor_gray.png'})`, backgroundRepeat:'no-repeat'}}></i>
                        </li>
                        <li data-attr="works" >
                            {/* <span>成品</span> */}
                            <span>款式</span>
        
                            {/* <i style={{backgroundImage: 'url(/assets/toBoom/images/editor_gray.png)'}}></i>  */}
                            <i style={{backgroundImage: `url(/assets/toBoom/images/${ this.props.selectWorksPic ? 'edit_product.png' : 'editor_gray.png'})`, backgroundRepeat:'no-repeat'}}></i> 
                        </li>
                        <li data-attr="part" >
                            <span>部件</span>

                            {/* <i style={{backgroundImage: 'url(/assets/toBoom/images/editor_gray.png)'}}></i> */}
                            <i style={{backgroundImage: `url(/assets/toBoom/images/${ this.props.selectPartPic ? 'edit_part.png' : 'editor_gray.png'})`, backgroundRepeat:'no-repeat'}}></i> 
                        </li>
                        <li data-attr="log" >
                            <span>足迹</span>
                            {/* <i style={{backgroundImage: 'url(/assets/toBoom/images/editor_gray.png)'}}></i>  */}
                            <i style={{backgroundImage: `url(/assets/toBoom/images/${ this.props.selectLogPic ? 'edit_log.png' : 'editor_gray.png'})`, backgroundRepeat:'no-repeat'}}></i> 
                        </li>
                    </ul>

                </div>


                {/* <i style={{backgroundImage: "url(/assets/toBoom/images/top_line.png)"}}></i> */}

               
                {/* // `````````````````lsh 增加的 2018-12-12 开始```````````````````` */}
                <div className="new-person-way"  style={{visibility:`${this.state.isShowHelpModel ? 'hidden' : 'visible'}`}}>
                    <img 
                        style={{ transform : `translateY(${ this.state.imgTranSlateY })` }}
                        src="/assets/toBoom/images/noviceGuide/newPersonImg.png"  
                        onMouseEnter={ (event) =>{  this.setState({ imgTranSlateY  : '12px', mouseEnterImg: true })  } }
                        onMouseLeave={ (event) =>{  this.setState({ imgTranSlateY  : '49px', mouseEnterImg: false })   }  }
                        onClick={this.handleLittleMonster.bind(this)}
                    />
                </div>        
              
                <TransitionGroup>
                    {
                        this.state.mouseEnterImg ? (
                            <CSSTransition                              
                                classNames="picslide"
                                timeout={300}
                                unmountOnExit                                   
                            >
                                <div className="bubble-box">                              
                                    <img src="/assets/toBoom/images/noviceGuide/how_help_bubble.png" alt=""/>
                                </div>
                                </CSSTransition>
                        ) : ''
                    }
                </TransitionGroup>
                   
               
                <CSSTransition
                    in={this.state.isShowHelpModel }
                    classNames="starslide"
                    timeout={300}
                    unmountOnExit
                >
                    <div className="help-center-wrap"  style={{visibility:`${this.state.isShowHelpModel ? 'visible' : 'hidden'}`}}>
                        <div className="help-close-content">
                            <img 
                                src={`/assets/toBoom/images/noviceGuide/${this.state.closeHelpBg ? 'help_close_high.png' : 'help_close.png'}`} 
                                alt=""
                                data-help="closehelp"
                                onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                onClick={this.clickHelpClose.bind(this)}
                            />
                        </div>
                        
                        
                        <div 
                            style={{ display:
                                `${
                                    this.state.wantStyleStatus || 
                                    this.state.replacShapeStatus || 
                                    this.state.addReplacePartStatus || 
                                    this.state.switchPicStatus ||
                                    this.state.picMoveStatus ||
                                    this.state.drawroTationStatus ||
                                    this.state.levelMove ||
                                    this.state.recoveryStatus ||
                                    this.state.lockPicState ||
                                    this.state.namedWorksStatus ||
                                    this.state.deleteWorksStatus ||
                                    this.state.logWorksStatus ||
                                    this.state.downWorksStatus ||
                                    this.state.newlyBuildStatus ||
                                    this.state.keepWorksStatus ||
                                    this.state.recentModiWorksStatus ||
                                    this.state.blankCanvasStatus ||
                                    this.state.searchLabelStatus ||
                                    this.state.selectPartStatus
                                    ? 
                                    'none' : 'block'
                                }`
                                ,height:'476px',position:'absolute',top:'119px',width:'100%',overflowY:'auto',
                            }}
                            id="container"
                            ref="lastwrapper"
                        >
                        
                            <div className="help-center-content  container">
                                <p className="help-center-title">设计搭配</p>
                                <div className="every-help-wrap">
                                    <div 
                                        className="help-theme"
                                        data-help="designhelp"
                                        style={{backgroundImage: `url(/assets/toBoom/images/noviceGuide/${ this.state.designHelp || this.state.isChangeDesignArrow ? 'othertitle_bg_high.png' : 'othertitle_bg_nor.png'})`}}
                                        onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                        onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                        onClick={this.handleClickEveryHelpHheme.bind(this)}
                                    >
                                        <p className="design-help" id="button1">操作界面</p>
                                        <img  
                                            className="help-down-arrow" 
                                            src={`/assets/toBoom/images/noviceGuide/${this.state.isChangeDesignArrow ? 'help_up_arrow.png': 'help_down_arrow.png'}`} 
                                            alt=""
                                        />
                                    </div>
                                    <CSSTransition
                                        in={this.state.isChangeDesignArrow}
                                        classNames="starslide"
                                        timeout={300}
                                        unmountOnExit
                                        onExited={()=> {
                                            this.setState({
                                                isChangeDesignArrow: false
                                            })
                                        }}
                                    >
                                        <div 
                                            className="design-help-description" 
                                            style={{display:`${this.state.isChangeDesignArrow ? 'block':'none'}`}}
                                            id="subcontainer1"
                                            ref="refsubcontainer1"
                                        >
                                            <div className="design-top-bar">
                                                <h3 >顶栏</h3>
                                                <p>主要是<i className="function-color">功能按钮</i> ，快速编辑<i className="function-color">作品名称</i> 、<i className="function-color">新建画布 </i>、<i className="function-color">下载</i>以及<i className="function-color">保存</i>当前作品。
                                                </p>
                                            </div>
                                            <div className="left-side-plate">
                                                <h3>左侧板</h3>
                                                <p>可以找到所有的<i className="function-color">廓形</i> 、<i className="function-color">部件</i>和我们已经搭配好的<i className="function-color">款式</i> ；<i className="function-color">足迹</i>是你的使用记录。</p>
                                            </div>
                                            <div className="right-side-plate">
                                                <h3>右侧板</h3>
                                                <p>可以让你快速将<i className="function-color">最近修改</i>的作品 ，放入画布中进行设计搭配。</p>
                                            </div>
                                            <div className="design-center">
                                                <h3>中间</h3>
                                                <p>搭配操作区域 ，可将部件/廓形放入<i className="function-color">画布中</i> ，切换<i className="function-color">正反视图</i>和对<i className="function-color">图层</i>进行管理。</p>
                                            </div>                               
                                        </div>
                                    </CSSTransition>
                                </div>

                            
                                <div className="every-help-wrap">
                                    <div 
                                        className="help-theme"
                                        data-help="existedstylehelp"
                                        style={{backgroundImage: `url(/assets/toBoom/images/noviceGuide/${this.state.existedStyleHelp || this.state.isChangeExistedArrow ? 'othertitle_bg_high.png' : 'othertitle_bg_nor.png'})`}}
                                        onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                        onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                        onClick={this.handleClickEveryHelpHheme.bind(this)}
                                    >                  
                                        <p className="design-help">参考已有款式</p>
                                        <img  
                                            className="help-down-arrow" 
                                            src={`/assets/toBoom/images/noviceGuide/${this.state.isChangeExistedArrow ? 'help_up_arrow.png': 'help_down_arrow.png'}`} 
                                            alt=""
                                        />                       
                                    </div>
                                    <CSSTransition
                                        in={this.state.isChangeExistedArrow}
                                        classNames="starslide"
                                        timeout={300}
                                        unmountOnExit
                                        onExited={()=> {
                                            this.setState({
                                                isChangeExistedArrow: false
                                            })
                                        }}
                                    >
                                        <ul 
                                            className="existed-style-description"
                                            style={{display:`${this.state.isChangeExistedArrow ? 'block' : 'none'}`}}
                                        >
                                            {
                                                this.state.referToExistStyleDate.map((item,index)=> {
                                                    return (
                                                        <li 
                                                            key={item.id} 
                                                            className="existed-item"
                                                            onMouseEnter={this.existedMouseEnter.bind(this)}
                                                            onMouseLeave={this.existedMouseLeave.bind(this)}
                                                            onClick={this.existedItemClick.bind(this,item)}
                                                            data-existedstyles={item.englishname}
                                                        >
                                                            {/* <span style={{color:'#a8bfdc', marginRight:'8px'}}>&bull;</span> */}
                                                            <span style={{marginRight:'8px'}}>&bull;</span>
                                                            {item.title}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </CSSTransition>
                                </div>


                                <div className="every-help-wrap">
                                    <div 
                                        className="help-theme"
                                        data-help="zerostarthelp"
                                        style={{backgroundImage: `url(/assets/toBoom/images/noviceGuide/${ this.state.zeroStartHelp || this.state.isChangeZeroArrow ? 'othertitle_bg_high.png' : 'othertitle_bg_nor.png'})`}}
                                        onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                        onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                        onClick={this.handleClickEveryHelpHheme.bind(this)}
                                    >                  
                                        <p className="design-help">从零开始设计</p>
                                        <img  
                                            className="help-down-arrow" 
                                            src={`/assets/toBoom/images/noviceGuide/${this.state.isChangeZeroArrow ? 'help_up_arrow.png': 'help_down_arrow.png'}`} 
                                            alt=""
                                        />                       
                                    </div>
                                    <CSSTransition
                                        in={this.state.isChangeZeroArrow}
                                        classNames="starslide"
                                        timeout={300}
                                        unmountOnExit
                                        onExited={()=> {
                                            this.setState({
                                                isChangeZeroArrow: false
                                            })
                                        }}
                                    >
                                        <ul 
                                            className="existed-style-description"
                                            style={{display:`${this.state.isChangeZeroArrow ? 'block' : 'none'}`}}
                                        >
                                            {
                                                this.state.zeroBeginDesignDate.map((item,index)=> {
                                                    return (
                                                        <li 
                                                            key={item.id}
                                                            className="existed-item"
                                                            onMouseEnter={this.existedMouseEnter.bind(this)}
                                                            onMouseLeave={this.existedMouseLeave.bind(this)}
                                                            data-existedstyles={item.englishname}
                                                            onClick={this.existedItemClick.bind(this,item)}

                                                        >
                                                            {/* <span style={{color:'#a8bfdc', marginRight:'8px'}}>&bull;</span> */}
                                                            <span style={{marginRight:'8px'}}>&bull;</span>
                                                            {item.title}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </CSSTransition>
                                </div>

                                <div className="every-help-wrap">
                                    <div 
                                        className="help-theme"
                                        data-help="shortcutkeyhelp"
                                        style={{backgroundImage: `url(/assets/toBoom/images/noviceGuide/${ this.state.shortcutKeyHelp || this.state.isChangeShortcutArrow  ? 'othertitle_bg_high.png' : 'othertitle_bg_nor.png'})`}}
                                        onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                        onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                        onClick={this.handleClickEveryHelpHheme.bind(this)}
                                    >                  
                                        <p className="design-help">快捷键</p>
                                        <img  
                                            className="help-down-arrow" 
                                            src={`/assets/toBoom/images/noviceGuide/${this.state.isChangeShortcutArrow ? 'help_up_arrow.png': 'help_down_arrow.png'}`} 
                                            alt=""
                                        />                         
                                    </div>
                                    <CSSTransition
                                        in={this.state.isChangeShortcutArrow}
                                        classNames="starslide"
                                        timeout={300}
                                        unmountOnExit
                                        onExited={()=> {
                                            this.setState({
                                                isChangeShortcutArrow: false
                                            })
                                        }}
                                    >
                                        <div 
                                            className="shortcut-key-description"
                                            style={{display:`${this.state.isChangeShortcutArrow ? 'block' : 'none'}`}}
                                        >
                                            <div className="withdraw-wrap">
                                                <div className="withdraw-title">撤回</div>
                                                <div className="withdraw-description">
                                                    <div className="withdraw-first-text">ctrl</div>
                                                    <div style={{margin:'0 5px'}}>+</div>
                                                    <div className="withdraw-first-text">z</div>
                                                </div>
                                            </div>
                                            <div className="withdraw-wrap">
                                                <div className="withdraw-title">方向键微调</div>
                                                <div className="withdraw-description">
                                                    <div className="withdraw-first-text">&#8592;</div>                                      
                                                    <div className="withdraw-first-text" style={{margin:'0 8px'}}>&#8593;</div>
                                                    <div className="withdraw-first-text">&#8594;</div>
                                                    <div className="withdraw-first-text" style={{marginLeft:'8px'}}>&#8595;</div>
                                                </div>
                                            </div>
                                            <hr style={{backgroundColor: '#ececf3',height:'1px',border:'none',margin:'25px 0'}}/>
                                            <h3 style={{color:'#cfcfcf',fontSize:"16px"}}>选中素材时</h3>
                                            <div className="withdraw-wrap">
                                                <div className="withdraw-title">中心放大缩小</div>
                                                <div className="withdraw-description">
                                                    <div className="withdraw-first-text">alt</div>                                      
                                                    <div style={{margin:'0 5px'}}>+</div>
                                                    <div className="withdraw-first-text">拖拽控点</div>
                                                </div>
                                            </div>
                                            <div className="withdraw-wrap">
                                                <div className="withdraw-title">删除所选图层</div>
                                                <div className="withdraw-description">
                                                    <div className="withdraw-first-text">backspace</div>                                      
                                                </div>
                                            </div>
                                            <div className="withdraw-wrap">
                                                <div className="withdraw-title">多选图层</div>
                                                <div className="withdraw-description">
                                                    <div className="withdraw-first-text">shift</div>                                      
                                                    <div style={{margin:'0 5px'}}>+</div>
                                                    <div className="withdraw-first-text">点选</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CSSTransition>
                                </div>

                                {/* 浏览完整使用手册 暂时隐藏 ········开始······ */}
                                {/* <div className="every-help-wrap">
                                    <div 
                                        className="help-theme"  
                                        data-help="totalhelp"
                                        style={{backgroundImage: `url(/assets/toBoom/images/noviceGuide/${ this.state.totalHelp || this.state.isChangeTotalArrow ? 'othertitle_bg_high.png' : 'othertitle_bg_nor.png'})`}}
                                        onMouseEnter={this.handleMouseEnterHelpTheme.bind(this)}
                                        onMouseLeave={this.handleMouseLeaveHelpTheme.bind(this)}
                                        onClick={this.handleClickEveryHelpHheme.bind(this)}
                                    >                  
                                        <p className="design-help">浏览完整使用手册</p>                       
                                    </div>
                                </div> */}
                                {/* 浏览完整使用手册 暂时隐藏 ········结束······ */}
                            </div>

                        </div>
                        

                        {/*``````````````````` 点击某项 跳转到如下其对应的页面  start````````````````````````*/}
                        {/* 找到你想参考的款式 start*/}   
                        <div className="want-style-wrap" style={{display:`${this.state.wantStyleStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">找到你想参考的款式</p>
                            </div>                           
                            <CSSTransition
                                in={this.state.wantStyleStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            通过浏览<span className="common-font-style"  onClick={this.fromHelpToPopular.bind(this)}>【流行解读】</span><img src="/assets/toBoom/images/noviceGuide/green_zoom.png" alt="" /> 中的分析图表 ，对应的 " 更多款式 " 中可以找到。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            在<span className="common-font-style" onClick={this.fromHelpToStylegallery.bind(this)}>【款式图库】</span><img src="/assets/toBoom/images/noviceGuide/purple_zoom.png" alt="" /> 通过使用个性化标签进行搜索<img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" />，找到你喜欢的款式 。点击图片 " 开始设计 " ，即可使用该款式。
                                        </div>
                                    </div>
                                    <div className="common-want-style">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            {/* 你还可以在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧板 ，在 " 款式 " 中进行搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 或者收藏 <img src="/assets/toBoom/images/noviceGuide/help_love.png" alt="" /> 中 ，直接找到相应款式 ，点击或拖拽进入画布。 */}
                                            你还可以在<span style={{color:'#72a1d9'}} >【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧板 ，在 " 款式 " 中进行搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 或者收藏 <img src="/assets/toBoom/images/noviceGuide/help_love.png" alt="" /> 中 ，直接找到相应款式 ，点击或拖拽进入画布。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 找到你想参考的款式 end*/}

                        {/* 替换廓形 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.replacShapeStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">替换廓形</p>
                            </div>
                            <CSSTransition
                                in={this.state.replacShapeStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            {/* 在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span> <img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧板，通过分类和个性化标签搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 到你想要的廓形。点击或者拖拽，可以将新廓形替换到画布中。 */}
                                            在<span style={{color:'#72a1d9'}}>【设计搭配】</span> <img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧板，通过分类和个性化标签搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 到你想要的廓形。点击或者拖拽，可以将新廓形替换到画布中。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            廓形在同一画布中是唯一的。当您使用新廓形时，旧廓形会被新廓形替换。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 替换廓形 end*/}

                        {/* 添加/更换部件 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.addReplacePartStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">添加/更换部件</p>
                            </div>
                            <CSSTransition
                                in={this.state.addReplacePartStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            {/* 在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧栏，通过分类和个性化标签搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 到你想要的部件。点击或者拖拽，可以将部件添加到画布中。 */}
                                            在<span style={{color:'#72a1d9'}}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" /> 左侧栏，通过分类和个性化标签搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" /> 到你想要的部件。点击或者拖拽，可以将部件添加到画布中。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            所有部件都是公共使用的，不受购买权限、使用数量限制。
                                        </div>
                                    </div>
                                    <div className="common-want-style">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            某些部件可以被单独添加在正面视图/反面视图，如 "口袋"。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 添加/更换部件 end*/}

                        {/* 切换正反视图 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.switchPicStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">切换正反视图</p>
                            </div>
                            <CSSTransition
                                in={this.state.switchPicStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击操作区域中，右上角的正反小视图，切换显示画布中素材的正面/反面操作视图。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击操作区域右上角第一个按钮 <img src="/assets/toBoom/images/noviceGuide/forward_backward_button.png" alt="" style={{verticalAlign:'top'}}/> ，可以显示 / 隐藏正反小视图。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 切换正反视图 end*/}

                        {/* 图层移动 start*/}
                        <div className="want-style-wrap" style={{display:`${this.state.picMoveStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">图层移动</p>
                            </div>
                            <CSSTransition
                                in={this.state.picMoveStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            操作区域中右侧的图层管理，可以调整画布中各个图层的层级。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击操作区域右上角第二个按钮 <img src="/assets/toBoom/images/noviceGuide/layer_button.png" alt="" style={{verticalAlign:'top'}}/> ，可以显示 / 隐藏图层管理。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 图层移动 end*/}

                        {/* 拉伸旋转 start*/}
                        <div className="want-style-wrap" style={{display:`${this.state.drawroTationStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">拉伸旋转</p>
                            </div>
                            <CSSTransition
                                in={this.state.drawroTationStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            选中画布中的部件/廓形，拖拽顶部控点可以进行旋转，拖拽周边控点对应方向进行拉伸。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            使用快捷键 " alt＋拖拽控点 " ，可以使部件/廓形拉伸时不会变形。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 拉伸旋转 end*/}

                        {/* 水平翻转 start*/}
                        <div className="want-style-wrap" style={{display:`${this.state.levelMove ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">水平翻转</p>
                            </div>
                            <CSSTransition
                                in={this.state.levelMove}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            选中画布中的部件/廓形，点击顶栏 "水平翻转" <img src="/assets/toBoom/images/noviceGuide/level_move_button.png" alt="" /> ，可以做出左/右对称效果。
                                        </div>
                                    </div>

                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            使用该功能可以做出一双袖子、一对口袋。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 水平翻转 end*/}

                        {/* 还原 start*/}
                        <div className="want-style-wrap" style={{display:`${this.state.recoveryStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">还原</p>
                            </div>
                            <CSSTransition
                                in={this.state.recoveryStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div className="common-want-style want-style-first">
                                    <div className="common-dot-style">&bull;</div>
                                    <div>
                                        选中画布中的部件/廓形，点击顶栏 "还原" 按钮 <img src="/assets/toBoom/images/noviceGuide/recovery_button.png" alt="" /> ，可将廓形/部件恢复到初始位置及大小。
                                    </div>
                                </div>  
                            </CSSTransition>
                        </div>
                        {/* 还原 end*/}

                        {/* 锁定 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.lockPicState ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">锁定</p>
                            </div>
                            <CSSTransition
                                in={this.state.lockPicState}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            选中画布中的部件/廓形，点击顶栏 "锁定" 按钮 <img src="/assets/toBoom/images/noviceGuide/lock_pic_button.png" alt="" /> ，则无法修改该部件/廓形的位置和尺寸大小。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            再次点击此按钮，可以取消锁定。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 锁定 end*/}

                        {/* 命名作品 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.namedWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">命名作品</p>
                            </div>
                            <CSSTransition
                                in={this.state.namedWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div className="common-want-style want-style-first">
                                    <div className="common-dot-style">&bull;</div>
                                    <div>
                                        点击顶栏显示 "未命名作品" 位置处，即作品名称，可以直接修改作品名称。
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 命名作品 end*/}


                        {/* 删除 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.deleteWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">删除</p>
                            </div>
                            <CSSTransition
                                in={this.state.deleteWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            选中画布中的部件/廓形，点击顶栏 "删除" 按钮 <img src="/assets/toBoom/images/noviceGuide/delete_works_button.png" alt="" /> 即可删除。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            正反视图中的对应的部件/廓形会同时被删除。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 删除 end*/}

                        {/* 足迹 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.logWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">足迹</p>
                            </div>
                            <CSSTransition
                                in={this.state.logWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div className="common-want-style want-style-first">
                                    <div className="common-dot-style">&bull;</div>
                                    <div>
                                        点击左侧板中的 "足迹" ，可以找到最近使用的部件/廓形。
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 足迹 end*/}

                        {/* 下载 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.downWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">下载</p>
                            </div>
                            <CSSTransition
                                in={this.state.downWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击顶栏的“下载”按钮，可以将画布中部件/廓形的EPS、PNG格式文件下载到本地。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            目前只提供PNG格式的完整款式图，暂不提供EPS格式。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 下载 end*/}

                        {/* 新建 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.newlyBuildStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">新建</p>
                            </div>
                            <CSSTransition
                                in={this.state.newlyBuildStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            在顶栏直接点击 "新建" 按钮， 可以直接新建空白画布。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            若账号剩余作品数不足，则无法新建。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 新建 end*/}

                        {/* 保存 start*/}                      
                        <div className="want-style-wrap" style={{display:`${this.state.keepWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">保存</p>
                            </div>
                            <CSSTransition
                                in={this.state.keepWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            在顶栏直接点击 "保存" ， 可将最新的修改覆盖到作品上，同时将作品保存到指定文件夹中。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 保存 end*/}

                        {/* 最新修改 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.recentModiWorksStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">最新修改</p>
                            </div>
                            <CSSTransition
                                in={this.state.recentModiWorksStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击右侧 "最近修改" 中的作品，可以直接将最近修改过的作品放到画布中进行修改。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            点击 "查看更多" ，可以找到更多最近修改的作品
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 最新修改 end/}

                        {/* 创建一个空白画布 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.blankCanvasStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">创建一个空白画布</p>
                            </div>
                            <CSSTransition
                                in={this.state.blankCanvasStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            {/* 在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 顶栏点击 "新建" ， 可以直接新建空白画布。 */}
                                            在<span style={{color:'#72a1d9'}}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 顶栏点击 "新建" ， 可以直接新建空白画布。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计管理】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 左侧板，点击“新建设计”， 可以新建空白画布。
                                        </div>
                                    </div>
                                    <div className="common-want-style">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            若账号剩余作品数不足，则无法新建。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 创建一个空白画布 end*/}

                        {/* 分类搜索与个性化标签 start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.searchLabelStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">分类搜索与个性化标签</p>
                            </div>
                            <CSSTransition
                                in={this.state.searchLabelStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div className="common-want-style want-style-first">
                                    <div className="common-dot-style">&bull;</div>
                                    <div>
                                        {/* 在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 左侧板中，选择廓形/部件/款式的具体分类后，点击 "标签筛选" <img src="/assets/toBoom/images/noviceGuide/filter_button.png" alt="" style={{verticalAlign:'top'}}/> 中的标签，加入更多个性化标签，让搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" style={{verticalAlign:'top'}}/> 结果更精准。 */}
                                        在<span style={{color:'#72a1d9'}}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 左侧板中，选择廓形/部件/款式的具体分类后，点击 "标签筛选" <img src="/assets/toBoom/images/noviceGuide/filter_button.png" alt="" style={{verticalAlign:'top'}}/> 中的标签，加入更多个性化标签，让搜索 <img src="/assets/toBoom/images/noviceGuide/want_help_search.png" alt="" style={{verticalAlign:'middle'}}/> 结果更精准。
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 分类搜索与个性化标签 end*/}

                        {/* 选择你想要的部件/廓形  start*/}                       
                        <div className="want-style-wrap" style={{display:`${this.state.selectPartStatus ? 'block' : 'none'}`}}>
                            <div className="want-style">
                                <img 
                                    src="/assets/toBoom/images/noviceGuide/back_item_arrow.png" 
                                    alt=""
                                    onClick={this.helpGoBack.bind(this)}
                                />
                                <p className="want-style-title">选择你想要的部件/廓形</p>
                            </div>
                            <CSSTransition
                                in={this.state.selectPartStatus}
                                classNames="starslide"
                                timeout={300}
                                unmountOnExit
                            >
                                <div>
                                    <div className="common-want-style want-style-first">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            {/* 在<span className="common-font-style" onClick={this.fromHelpToDesign.bind(this)}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 点击或者拖拽可以将新部件/廓形添加到画布中。 */}
                                            在<span style={{color:'#72a1d9'}}>【设计搭配】</span><img src="/assets/toBoom/images/noviceGuide/pink_zoom.png" alt="" style={{verticalAlign:'top'}}/> 点击或者拖拽可以将新部件/廓形添加到画布中。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second" >
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            所有部件都是公共使用的，不受购买权限、使用数量限制。
                                        </div>
                                    </div>
                                    <div className="common-want-style">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            某些部件可以被单独添加在正面视图/反面视图，如 "口袋"。
                                        </div>
                                    </div>
                                    <div className="common-want-style want-style-second">
                                        <div className="common-dot-style">&bull;</div>
                                        <div>
                                            廓形在同一画布中是唯一的。当您使用新廓形时，旧廓形会被新廓形替换。
                                        </div>
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                        {/* 选择你想要的部件/廓形  end*/}
                        {/*``````````````````` 点击某项 跳转到如下其对应的页面  end````````````````````````*/}
                                                
                    </div>
                    {/* // `````````````````lsh 增加的 2018-12-12 结束```````````````````` */}
            </CSSTransition>


            </div>

        )
    }
}
