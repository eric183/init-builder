
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import  * as mobx from 'mobx';
import { observable, computed, autorun } from 'mobx';
import { Tooltip  } from 'antd';

/*
*@props.defaultTitle {string} 标题名称
*@props.classnames {array}   样式名称
*@props.style {object}  内联样式
*@props.data {array}  数据
*@props.fieldName {object}  字段名
*@props.init {boolean}  是否需初始化选中 【默认选择第一个】
*@props.defaultValue {string} 初始化选中值
*@props.checkedAction {function} 选中事件回调
*/

@observer
export default class SelectorComponent extends Component {
    state = {
          selectedTitle : '请选择',
          selectedValue : undefined,
          visiable : false
    }


   // 选择事件代理
   click_delegate( event ){
         if( event.id && event.title ){ // 非用户触发！
               this.onCheckedAction( event, true);
         }else{ // 用户触发！
            var event = window.event || event;
            if( event.target.nodeName == 'LI' ){

                  let index = event.target.dataset.index;

                    if( index != -1 ){

                        let item = this.props.data[index];

                        this.onCheckedAction( item );

                    }else{
                        this.onCheckedAction( );    
                    }

                    event.stopPropagation(); 

                    event.preventDefault();
              }    
         }
     }
 
    // 选择事件
    onCheckedAction( item ){ 

        let { value, name } = this.props.fieldName;
        let callback = () => {  this.props.checkedAction( this.state.selectedValue ) };

       if( item && ( item[ value ] || item[name] ) ){
             this.setState({  selectedTitle : item[ name ],  selectedValue : item[ value ] || 'all' , visiable : false }, callback );
       }else{
             this.setState({ visiable : false, selectedTitle : this.props.defaultTitle,  selectedValue : undefined }, callback );
       }

   }




   // 展开 options 事件
   openOptions = ( event ) =>{  
        var event = window.event || event;
            event.stopPropagation(); 
            event.preventDefault();
          this.setState({ visiable : !this.state.visiable });

    }



   resetField(){  
          this.setState({  selectedValue : undefined, selectedTitle : this.props.defaultTitle })  
      }

  

      // 修改 optiosn 展开状态
      click_on_document() {
              if( this.state.visiable ) this.setState({ visiable : false })
      }


   componentWillMount(){ }



   componentDidMount(){  

           this.props.init ? this.setState({ init : true }) : ''; 

           this.props.onRef( this );

           document.body.addEventListener('click', this.click_on_document.bind(this));

          // 采用原生事件绑定方式，禁止事件冒泡行为。
           this.refs.options.addEventListener('click',this.click_delegate.bind(this));
           this.refs.select_title.addEventListener('click',this.openOptions.bind(this));

    }


   componentWillUnmount(){
       // 注销事件
       document.body.removeEventListener('click', this.click_on_document);
       this.refs.options.removeEventListener('click', this.click_delegate);
       this.refs.select_title.removeEventListener('click',this.openOptions);

   }


   componentWillReceiveProps( nextProps ){

    let { init, data, defaultTitle, fieldName, defaultValue } = nextProps;

    if( data && data.length > 0 ){

          let preData =  this.props.data.length ? this.props.data[ this.props.data.length - 1 ] : {},
              nextData = nextProps.data[ nextProps.data.length - 1 ],
              { value } = fieldName;

            if(( preData[ value ] != nextData[ value ] ) && init){  // 自动赋值

                  var _index = undefined;

                    if( defaultValue ){

                        nextProps.data.forEach((item, index) => {  
                                item.id == defaultValue ? _index = index : ''
                          });  
                    }

                  this.click_delegate( nextProps.data[ _index | 0 ] ); // 非用户触发！

              }
          
      }else{

            let p = { selectedTitle : defaultTitle, selectedValue : undefined };

            this.setState( p );
          
      }
       
   }



      render(){
           let  { classnames, fieldName,  data  } = this.props;
           let {  selectedTitle, visiable, } = this.state;

               selectedTitle == '请选择' ? selectedTitle = this.props.defaultTitle : '';  // 临时解决方法

            return (
                 <div className={['selector', classnames[2], visiable ? classnames[0] : classnames[1] ].join(' ')}  style={ this.props.style || {} }>

                     <h4 ref="select_title" > { selectedTitle } </h4>  {/* <Tooltip title={ selectedTitle }> <span className="text">  { selectedTitle } </span> </Tooltip> */}

                     <ul style={{ display : visiable ? 'block' : 'none' }} ref="options" >
                        <li  style={{ display : this.props.defaultOption ? 'block' : 'none' }}  data-index={ -1 } > 无 </li>
                          {
                           data.map((item,index) => ( <li key={index}  data-index={ index }  >
                              { item[ fieldName.name ] }
                               {/* <Tooltip title={ item[ fieldName.name ] }>
                              <span className="text">{ item[ fieldName.name ] }</span>
                              </Tooltip> */}
                           </li> ))
                          }
                     </ul>
                  </div>
            )
      }
}


SelectorComponent.defaultProps = {
      init : false,
      classnames : [ 'up' , 'down', 'sheight33'],
      fieldName: { value : 'id', name : 'title' }, // 字段名称
      defaultTitle  : '请选择',
      data : [],
      checkedAction : function(){},
      onRef : function(){},
      defaultValue : undefined
    };