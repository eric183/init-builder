import React from 'react';
import { observer } from 'mobx-react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import TagsSection from './tags_section'; 
import './index.scss';
import Tagstore from './store';
import  * as mobx from 'mobx';


@observer
class SearchTool extends React.Component {

    constructor() {
        super();
        this.left = 0;
        
        this.colors = [
            '#72a1d9',
            '#f4747e',
            '#ff954d',
            '#d6b1cd'
        ]
        this.storeArray = [];
        this.state = {
            searchValue: '',
            chosenValue: "",
            activeColor: '',
            visiable : false, 
            top :30,
            left : 0,
            sVisiable : false,
            sTop : 30,
            sLeft :0,
        }
    }

    elementWidth=450;
    elementHeight = 150; // 元素高度

   // 清除搜索框
   cleanSearchValue(){ this.setState({ searchValue : '' }) }




 closeModal(event) {
    // if(event.target == event.currentTarget) { // }
      this.setState({  showSearchModal: false  });
     // this.processStoreArray();

}


search_edit = ( obj, targetItem ) =>{
     if( obj.tags || obj.children ){
        var children = obj.tags || obj.children;
            children.forEach(( item, index ) => {
                 if( item.id == targetItem.id ){
                    item.color ? delete item.color : '';
                    item.backgroundColor = 'transparent';
                 }else{
                   if( item.children ) this.search_edit( item, targetItem );
                 }
            })
     }  
}


// 提供外部组件，移出已选标签
deleteSelectedTag( item ){

    if( !item.group_name ) return false;  // 如果是不相关的数据

    let data = mobx.toJS( Tagstore.data );
    var name = item.group_name;  // 获取大类
    var uIndex = undefined;
   
    this.storeArray.forEach(( obj, index ) => {   if( obj.id == item.id && obj.group_name ) uIndex = index  });
    this.storeArray.splice(uIndex, 1);

    var targetObj = data[name];

     this.search_edit(targetObj,item );

     data[name] = targetObj;

     Tagstore.setProperties('data', data )

}



// 提供外部组件 重置所有已选标签 
cleanAllTags(){
    let data = mobx.toJS( Tagstore.data );

     this.storeArray = []; // 清空所选标签值

     function  hunt_for( obj ){ 
           var children = obj.tags || obj.children;
           children.forEach((item, idnex) => { 
                   item.backgroundColor && ( item.backgroundColor = 'transparent' );
                   if( item.children ) hunt_for( item );
             })
      }
    Object.keys(data).forEach(( key, index ) => {
           hunt_for(  data[ key ] )
    });

  Tagstore.setProperties('data',data);

}






// 完成搜索动作后需要清空搜索框
click_search_pic = () => {
     var searchValue = this.state.searchValue;
     this.setState({ searchValue : '' }, () => {  this.props.onChange( searchValue) })
}

// 回车键
keyBinder(event) {
    if( event.keyCode == 13) this.click_search_pic()
}
     

changeBinder(event) {
    this.setState({
        searchValue: event.target.value
    })
}


  // 款式图库和设计搭配需要的数据不同
  filtratekeys( data ){ 
    var keys = Object.keys(data);
    if( keys.length ){
        if( this.props.filtrated ){
            var _data = { };
                _data.part =  data.part;
                _data.style =  data.style;
                _data.details =  data.details;
            return _data
        }else{
            return data
        }
    }else{
        return data
    }

}


hideModal(event) {
    // if(event.target.parentElement == document.body) {  this.props.onCancel(); }
      this.state.showSearchModal ? this.closeModal() : '';
 }


 getClientRects() {
    let ClientRects = this.refs.searchHanlers.getClientRects()[0];
    // this.left = ClientRects.width;
    this.left = this.refs.searchHanlers.clientWidth;
    // this.top = this.refs.searchHanlers.clientHeight;
}


randomColor() {
    return this.colors[Math.floor(Math.random() * (this.colors.length - 1) + 1)]
}




// 添加已选数据 【 数据去重赋值 】 
add_data( selectedValue ){

    if( this.storeArray.length <= 0  ){

        this.storeArray.push( selectedValue )

   }else{ // 去重 【 暂时无 】

       this.storeArray.push( selectedValue )
   }

     this.storeArray.length &&  this.props.onCancel( this.storeArray );   // wq_2018-11-21:15:12
  
}



//移除已选数据
remove_data( selectedValue ){

    var uIndex = undefined;
    this.storeArray.forEach((item,index )=>{   
        if(  item.id ==  selectedValue.id  && item.group_name == selectedValue.group_name ) uIndex = index;
     });

     if( uIndex != undefined  ){
        this.storeArray.splice(uIndex, 1);
     }

     this.props.onCancel( this.storeArray ); // 加载数据  wq_2018-11-21:15:12

}



clickBinder(event){
    var event = event || window.event;
    // 禁止事件冒泡
    event.preventDefault(); 
    event.stopPropagation();


      // 显示 “ 更多详情 ”
      if(  event.target.nodeName == 'EM' && event.target.dataset.length ){
              this.moreDetialButton( event )
      }


    if(event.currentTarget.dataset.isIcon == 'true') {
        this.setState({
            showSearchModal: true,
        });
        return;
    }

   if(event.target.nodeName != 'SPAN') return;  

    let _targetElement = event.target;
    let color = this.randomColor();
    let level = _targetElement.dataset.rank;


      // 点击一级标签
     if( level == 'fLevel' ){

        let { name,id } = _targetElement.dataset;
        let data = mobx.toJS( Tagstore.data );
        let targetData = data[name];

        // console.log( data );
        // console.log( targetData );

        targetData.tags.forEach((item, key) => {
               if( item.id == id ){
                    if( item.backgroundColor && item.backgroundColor != 'transparent'){
                           item.color = '#4a4a4a'; 
                           item.backgroundColor = 'transparent';
                           this.remove_data( Object.assign( item, {}, true ) );

                    }else{
                          item.color = '#fff'; 
                          item.backgroundColor =  color;

                           // 将已选数据加入 storeArray
                           this.add_data( Object.assign( item, {}, true )  )
                       
                    }
                   
               }
        });

        data[name] = targetData;
        Tagstore.setProperties('data', data);

    
    }


       // 点击二级标签
    if( level == 'sLevel' ){

        let { index,id } = _targetElement.dataset;
        let data = mobx.toJS( Tagstore.data );
        let sdata = mobx.toJS( Tagstore.sdata );
        let targetData = sdata[index];

        if( targetData.backgroundColor && targetData.backgroundColor != 'transparent'){
                targetData.backgroundColor = 'transparent';
                targetData.color = '#4a4a4a'; 
                this.remove_data( Object.assign( targetData, {}, true ) );
        }else{
                targetData.color = '#fff'; 
                targetData.backgroundColor =  color;
                // 将已选数据加入 storeArray
                this.add_data( Object.assign( targetData, {}, true ) )
        }

         sdata[index] = targetData;
         data[targetData.group_name].tags.forEach(( itm, k ) =>{   
              itm.id == targetData.parentid ? itm.children = sdata : '';
         });

        Tagstore.setProperties({ 'data': data, 'sdata' : sdata });


    }


     // 点击三级标签
    if( level == 'tLevel' ){

        let { index,id } = _targetElement.dataset;
        let data = mobx.toJS( Tagstore.data );
        let sdata = mobx.toJS( Tagstore.sdata );
        let tdata = mobx.toJS( Tagstore.tdata );
        let targetData = tdata[index];

       if( targetData.backgroundColor && targetData.backgroundColor != 'transparent'){
             targetData.color = '#4a4a4a';
             targetData.backgroundColor = 'transparent';
             this.remove_data( Object.assign( targetData, {}, true ) );
        }else{
                targetData.color = '#fff';
                targetData.backgroundColor =  color;
                // 将已选数据加入 storeArray
                this.add_data( Object.assign( targetData, {}, true ) )
        }


        tdata[ index ] = targetData;
        sdata.forEach((item, k) =>{ 
            item.id == targetData.parentid ?   item.children[index] = targetData : ''
        });

         data[ sdata[0].group_name ].tags.forEach(( obj, k ) => {
                if( obj.children.length == sdata.length &&  obj.children[0].id == sdata[0].id ){
                      obj.children = sdata
                }
         });

      Tagstore.setProperties({ 'data': data, 'sdata' : sdata, 'tdata'  : tdata });

    }

    

}






 /* 鼠标移入标签  */
mouEnterBinder(event){
    var event = event || window.event;

    if( event.target.nodeType == 1 && event.target.nodeName == 'SPAN' ){
            var  _targetElement = event.target,
            currentTargetElement = event.currentTarget,
            clientRect = _targetElement.getClientRects()[0],
            pClientRect =  this.refs.tagsBox.getClientRects()[0],
            left = 0,
            top = 30,
            x2 =  pClientRect.x + pClientRect.width,
            y2 =  pClientRect.y + pClientRect.height,
            sX2 = clientRect.x + this.elementWidth, // 暂时写死宽度
            sY2 = clientRect.y + this.elementHeight, // 暂时写死高度
            scrolltop = this.refs.tag_s_container.scrollTop;

            // x坐标超出  
            if( sX2 > x2 ){ 
                left = sX2 - x2;
            }else{
                left = clientRect.x  - pClientRect.x
            }


            // y坐标超出
            if( ( y2 - clientRect.y - 30 ) < this.elementHeight ){ 
                top =  ( clientRect.y - pClientRect.y) - this.elementHeight - 35;
            }else{
                top =  clientRect.y - pClientRect.y + scrolltop;
            }


           // 改变标签字体颜色  【 鼠标悬浮效果直接修改DOM，不必修改状态 】
          //  临时判断
         if( _targetElement.style.backgroundColor  == 'transparent'  )  _targetElement.style.color = '#f4747e';
         

           var level = _targetElement.dataset.rank;

           if( level == 'sLevel' ){ //如果悬浮于 二级标签上，显示三级标签选项

                  /*
                    修改/更新 data 和 sdata 数据
                  */
                 var sdata = mobx.toJS( Tagstore.sdata );
                 var tdata = mobx.toJS( Tagstore.tdata ); 
                 let { index , id } = _targetElement.dataset;

                 this.state.sVisiable ? this.setState({ sVisiable : false }) : '';

            
                 sdata.forEach(( item, key ) =>{
                      if( item.id == id && key ==  index ){
                            if( item.children && item.children.length ){  // 如果有 children
                                item.children.forEach(( _obj, k ) => { _obj.parentid = id }); 
                                Tagstore.setProperties('tdata', item.children);
                                this.setState({ sTop : top, sLeft : left , sVisiable: true });
                             
                            }else{
                                Tagstore.setProperties('tdata', []);
                                this.state.sVisiable ? this.setState({ sTop : 30, sLeft : 0, sVisiable : false }) : '';
                                 
                            }
                      }
                 });

             

           }else if( level == 'tLevel'  ){  // 悬浮于三级标签


              // do something

           }else if( level == 'fLevel' ){ 

                   /*
                    *显示二标签选项
                    *修改/更新 data 和 sdata 数据
                  */
                 this.state.sVisiable ? this.setState({ sVisiable : false }) : '';

                 let data = mobx.toJS( Tagstore.data ); 
                 let { index , id, name } = _targetElement.dataset;
                 let { tags = [] } =  data[name];
                       tags.forEach(( item, k  ) => {
                             if( item.id == id  ){
                                if( item.children && item.children.length ){ // 如果有 children
                                    item.children.forEach(( _obj, k ) => { _obj.parentid = id }); 
                                    Tagstore.setProperties('sdata', item.children);
                                    this.setState({ top, left, visiable : true });

                                }else{

                                    Tagstore.setProperties('sdata', []);
                                    this.state.visiable ? this.setState({ top : 30, left : 0, visiable : false }) : '';
                                      
                                }

                             }
                       });

            
           }  
 

    }

}



  /* 鼠标移出标签  */ 
mouLeaveBinder(event){

     event = event || window.event;
    var rank = event.target.dataset.rank || undefined;
    var s = event.fromElement || event.relatedTarget;

        if( rank ){  // SPAN

            var  _targetElement = event.target;

          //  临时判断
         if( _targetElement.style.backgroundColor  == 'transparent'  )  _targetElement.style.color = '#4a4a4a'; 

         if( rank == 'fLevel' ){

                     // do something
            
            }else if(  rank == 'sLevel'){

                      // do something
                 
            }else if( rank == 'tLevel' ){

                      // do something
             }


        }else{  // 鼠标移出
          if(  s.dataset.role &&  s.dataset.role == 'container'){
                        this.setState({
                            visiable : false, 
                            top :30,
                            left : 0,
                            sVisiable : false,
                            sTop : 30,
                            sLeft :0,
                    })
             }
        }

    
}







// 显示 / 隐藏 “ 更多细节 ” 等操作。
moreDetialButton( event ){
   let { visiable, sVisiable } = this.state;
    if( visiable || sVisiable ){
       this.setState({
           visiable : false, 
           top :30,
           left : 0,
           sVisiable : false,
           sTop : 30,
           sLeft :0,
        })
     }

   let { id, length, name, btnstate } = event.target.dataset;
   let data = mobx.toJS( Tagstore.data );

   if(  length > 15 ){ // 展开

        data[name].tagLength = 0;

   }else{  // 关闭

     data[name].tagLength = btnstate; 

   }
   Tagstore.setProperties('data', data)

}





// 处理 标签超过 15 个 显示 “ 更多细节 ” 功能
// 给每个属性加上 tags 的长度，通过长度判断是否显示 “ 更多细节 ” 等操作。
moreDetailHandler( data ){
   var _data = Object.assign(data, {}, true);   
    var keys = Object.keys( _data ); 
    keys.forEach(( key, index ) => {
         if( _data[key].tags ){
                _data[key].btnState = data[key].tags.length;
               _data[key].tagLength = data[key].tags.length;
         }
    })

    return _data
}







componentDidMount() {

    this.props.onRef && this.props.onRef( this );  // 外部父组件引用函数

    this.getClientRects();

    //注册原生事件，防止事件冒泡。
    this.refs.tagButton.addEventListener('click', this.clickBinder.bind( this ));

    this.refs.tag_s_container.addEventListener('click', this.clickBinder.bind( this ));

    document.body.addEventListener('click',this.hideModal.bind( this ));

 
    // 注册鼠标悬浮于标签的事件  mouseenter mouseleave
    this.refs.tag_s_container.addEventListener('mouseenter', this.mouEnterBinder.bind( this ), true);

    this.refs.tag_s_container.addEventListener('mouseleave', this.mouLeaveBinder.bind( this ),true);



}




componentWillUnmount(){
    document.body.removeEventListener('click', this.hideModal )  
    this.refs.tagButton.removeEventListener('click', this.clickBinder );

    this.refs.tag_s_container.removeEventListener('click', this.clickBinder );

    this.refs.tag_s_container.removeEventListener('mouseenter', this.mouEnterBinder.bind( this ) );
    this.refs.tag_s_container.removeEventListener('mouseleave', this.mouLeaveBinder.bind( this ) );


}



componentWillReceiveProps(nextProps, nextState){
          var _data = mobx.toJS( Tagstore.data );
          var _storeKeys = Object.keys( _data );
        if( _storeKeys.length <= 0  && Object.keys(nextProps.data).length ){
              var newData = this.moreDetailHandler( nextProps.data );
              Tagstore.setProperties('data', this.filtratekeys( newData ) );

            //  console.log('初始添加！')
        }else{

            if( Object.keys(nextProps.data).length ){
                var newData = this.moreDetailHandler( nextProps.data );
                var data = this.filtratekeys( newData );
                var _nextPropsKeys =  Object.keys( data );
                var flag = _nextPropsKeys.every(( item, index ) => {  return item == _storeKeys[ index ] });
                   if( !flag ){

                       // console.log('不相等时加')

                        Tagstore.setProperties('data', data);

                   }else{
                     //   console.log('相等时不加')
                   }
                
            }

             
        }
         
       
}




render() {

    // let { data } = this.props;
    //       data = this.filtratekeys( data );
     let data = mobx.toJS( Tagstore.get_data );

    let { visiable, top, left,source, sVisiable, sTop, sLeft, sSource } = this.state;


    return (
        <div className="search-handlers tags-left" ref="searchHanlers" >
            <div className="search-bar">
                <input type="text" onKeyUp={this.keyBinder.bind(this)}  placeholder="搜索你需要的款式..."  onChange={this.changeBinder.bind(this)} value={this.state.searchValue} />
                <div className="search-pic" onClick={ this.click_search_pic }></div>
            </div>

            <button 
                type="button" 
                data-is-icon="true" 
                style={{backgroundImage: `url(/assets/toBoom/images/biaoqiananniu.png)`}}
                ref="tagButton">
            </button>
    
            <div className="tags-box" ref="tagsBox" style={{left: this.left, visibility: this.state.showSearchModal ? "visible" : "hidden"}}> 
                <header className="space-between">
                    <h2>标签筛选</h2>
                    <i className="iconfont shanchu" onClick={this.closeModal.bind(this)}></i>
                </header>

              <div className="tag-section-container" ref="tag_s_container"  data-role="container" >

                <section className="tag-section" ref="tagSection"  >
                    {
                        Object.keys(data).map((titleInfo, titleIndex)=> {
                                     return  (
                                              <div className="tag-title" key={titleIndex}  data-key={ titleInfo } >

                                                   <h3>{  data[titleInfo]['name_zh'] }</h3>

                                                    <div className={['tag-title-section-box', data[titleInfo].tagLength > 15 ? 'hidden' : '' ].join(' ')} >
                                                     <section>
                                                       {
                                                          data[titleInfo].tags.map((tag, index)=> (
                                                            <span 
                                                             style={{ backgroundColor : tag.backgroundColor || 'transparent',  color : tag.color ? tag.color : '#4a4a4a'  }}
                                                             data-index={ index }
                                                             data-id={ tag.id }
                                                             data-name={ titleInfo }
                                                             key={ index } 
                                                              data-rank="fLevel"
                                                              className={`f-${ tag.id }`} 
                                                              data-active={ ( tag.backgroundColor && tag.backgroundColor != 'transparent' ) ? true : false } 
                                                            > {tag.name_zh} </span>
                                                        ))
                                                    } 
                                              </section>
                                           </div>

                                       <em   className="moreTags"  
                                               data-length={ data[titleInfo].tagLength }
                                               data-btnstate={ data[titleInfo].btnState }
                                               data-name={ titleInfo }
                                               data-id={ data[titleInfo].id }
                                               style={{ display : data[titleInfo].btnState > 15 ? 'block' : 'none' }}>  
                                                      {
                                                         data[titleInfo].tagLength > 15 ? '更多细节>>' : '<<收起更多'
                                                       }
                                                    </em>

                                 </div>
                              )
                                           
                        })
                    }   
                  </section>


                  <TagsSection  id="sLevel" 
                                visiable={ visiable }
                                clientTop={ top }
                                clientLeft={ left }
                                data={ mobx.toJS( Tagstore.get_sdata ) }
                                parentRef={ this }
                              />

                    <TagsSection  id="tLevel" 
                                  visiable={ sVisiable }
                                  clientTop={ sTop }
                                  clientLeft={ sLeft }
                                   data={ mobx.toJS( Tagstore.get_tdata ) }
                                   parentRef={ this }
                                   prefix={'t'}
                                   backgroundColor={ '#dfdfdf' }
                              />

                </div>

            </div>
            
        </div>
        
    )}

}



SearchTool.defaultProps = {
    onSelected : function(){},
    onChange : function(){},
    filtrated: false,
    data:{}
}


export { SearchTool };