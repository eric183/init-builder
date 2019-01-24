import React, { Component, PureComponent } from 'react';
import { observer } from 'mobx-react';
import  * as mobx from 'mobx';
import { observable, computed, autorun } from 'mobx';


function CheckboxItem(props){
    return (
        <div className="checkbox-item">
         <h4>{ props.title }</h4>
            <span className="checkbox-scroll">
            {
             props.itemSource.map((item, index) => {
                    return   ( <label key={ index }>
                              <input 
                                    checked={  props.chooesList.indexOf( item.id.toString() ) > -1 ? true : false } 
                                    name={ props.name } 
                                    type="checkbox" 
                                    value={ item.id }
                                    onChange={ ( event ) => {  props.onChangeAction( event, item )  }  } />
                            <em> { item.name } </em> 
                        </label>)
                        
                 })   
             }
            </span>
        
        </div>
    )
}



@observer
export default class CheckboxComponent extends React.Component {
        state = {
             btnVisiable : true,
             boxVisiable : false
        }
     
        @computed get get_chooesList(){  return this.props.store.styleGalleryStore.chooesList  }


        // 圆球形多选组件事件
        clockOnBtn = (e) => {
                    this.setState({
                        btnVisiable : false,
                        boxVisiable : true
                    })
        }

        // 关闭圆球形多选组件
        closeCheckbox = () =>{ 

            let _chooesList = {    
                    profile: [],
                    clen: [],
                    season: []
            };

            let checkboxValues = mobx.toJS( this.props.store.styleGalleryStore.checkboxValues );

            let tagsList = mobx.toJS( this.props.store.styleGalleryStore.tagsList );


            if( checkboxValues.length ){
                  if( tagsList.length > 0 ){
                            tagsList.forEach(( item, index ) => {
                                if( item.type == 'checkbox' ){
                                    _chooesList[ item.subType ].push( item.tag_id.toString() )
                                }  
                          })
                  }

               this.props.store.styleGalleryStore.setProperties('chooesList', _chooesList );
                 
            }


         this.props.store.styleGalleryStore.cleanCheckboxValues(); // 清除缓存的已选checkbox 值

         this.setState({  btnVisiable : true,  boxVisiable : false })



        }





        // 圆球形多选组件请求   【 点击后才会向页面添加标签 】
        submitAction = () => {
               let chooesList = mobx.toJS( this.props.store.styleGalleryStore.chooesList );
               let { profile, clen, season }  = chooesList;
               let validated =  [ profile, clen, season ].some((item,index,arr) => {  return item.length > 0 ? true : false  });

                // 添加已选checkbox到页面,然后才执行 submitAction 方法
                this.props.store.styleGalleryStore.updateTagsList_checkbox().then(() => { 
                        this.props.submitAction( validated , chooesList , () => { 
                            this.setState({  btnVisiable : true,  boxVisiable : false })
                         });
                        this.props.store.styleGalleryStore.cleanCheckboxValues(); // 清除缓存的已选checkbox 值
                 });
    
        }


        // 多选框勾选
        selectedAction = (event,item) =>{
                let target = event.target,
                    name = target.getAttribute('name'),
                    value = target.value,
                    checked = target.checked,
                    chooesList = mobx.toJS( this.props.store.styleGalleryStore.chooesList );

                if( checked ){
                    chooesList[ name ].push( value );
                    this.props.store.styleGalleryStore.setProperties('chooesList', chooesList );

                     // 缓存已选择选框
                    this.props.store.styleGalleryStore.storeCheckboxValues( {
                                    type : 'checkbox',   // 区分来自哪里组件的数据
                                    subType : name,
                                    group_id : item.group_id,
                                    tag_id : item.id,
                                    classname : 'bg2',
                                    title :  item.name
                           });  

                }else{

                    let index = chooesList[ name ].indexOf( value );
                    index > -1 ? chooesList[ name ].splice(index, 1) : '';
                    this.props.store.styleGalleryStore.setProperties('chooesList', chooesList );
                     // 如果页面上存在对应的标签，则取消，若没则不处理
                     this.props.deleteTagsBinder({ tag_id : item.id, type: 'checkbox', subType : name }, false);
                    // 移除已缓存的值
                    this.props.store.styleGalleryStore.removCheckboxValues( item ); 


                }



        }




        render(){

             let chooesList = mobx.toJS( this.get_chooesList );
             let { boxVisiable, btnVisiable } = this.state;
             let { source } = this.props;

             return(
                  <div className="checkboxComponent">
                       <button type="button" className="checkbox-btn"
                            style={{ visibility : btnVisiable ?  'visible' : 'hidden' }}
                              onClick={ this.clockOnBtn }
                            >
                          <img src="/assets/toBoom/images/shaixuanA.png" />
                         </button>

                        <div className="checkbox-form"  style={{ display : boxVisiable ?  'block' : 'none' }} >

                          <button type="button" className="checkbox-close" onClick={ this.closeCheckbox } ><i className="iconfont shanchu"></i></button>

                          <button type="button" className="checkbox-submit" onClick={ this.submitAction  } ></button>

                          <div className="checkbox-pos">
                            <form >
                              <CheckboxItem title="廓形"  name="profile" chooesList={ chooesList.profile }  onChangeAction={ this.selectedAction  }  itemSource={ source.profile } />
                              <CheckboxItem title="季度"  name="season" chooesList={ chooesList.season }  onChangeAction={ this.selectedAction  }  itemSource={ source.season } />
                              <CheckboxItem title="衣长"  name="clen" chooesList={ chooesList.clen }  onChangeAction={ this.selectedAction  }  itemSource={ source.clen } />
                            </form>
                           </div>
                         </div>
                   </div>
             )
        }
}



CheckboxComponent.defaultProps = {
        source : {
             profile : [],
             clen : [],
             season : []
        },
       submitAction : function(){}
}