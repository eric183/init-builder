import React,{ Fragment, Component } from 'react';
import { Icon, Menu, Dropdown  } from 'antd';
import { DatePicker } from 'antd';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

const SubMenu = Menu.SubMenu;



function SubMenuComponent (props){

   
        return  (
               <Menu  style={{ maxHeight : 363, overflowY : 'scroll' }} className="single-screen-menu" >
                {
                   props.source.children.map(( child, index ) =>{
                         if( child.children && child.children.length > 0 ){
                             return (
                                 <SubMenu title={ child.title } onTitleClick={ () => {  props.chooseSubMenuBinder( child )  } } key={ child.id }  style={{ maxHeight : 263, overflowY : 'scroll' }}  >
                                     {
                                         child.children.map(( grandson, i ) => {
                                               return (
                                                <Menu.Item  key={ grandson.id }> 
                                                 <a target="javascript:void(0)" className="screen-button-link"  onClick={ () => { props.chooseNavBinder( grandson ) } } style={{ textAlign: 'center' }} >{ grandson.name }</a>
                                                 { grandson.title }
                                                 </Menu.Item>
                                               )
                                         })
                                     }
                                  </SubMenu>
                             )
                            
                         }else{
                            return (
                                <Menu.Item key={ child.id }>
                                   <a target="javascript:void(0)" className="screen-button-link" onClick={ () => {  props.chooseNavBinder( child ) } } >{ child.title }</a>
                                </Menu.Item>
                            )
                         } 
                   })
                }
               </Menu>
        );
    }
    
        
    
    
 export default  class MenuComponent extends React.Component {

          // 选择导航
         chooseNavBinder = ( item ) =>{ this.props.chooseSubNavHandler( item ) }
          // 选择子级导航
          chooseSubMenuBinder = ( item) => {  this.props.chooseSubNavHandler( item ) }


         render(){

            let tagsArray = mobx.toJS( this.props.store.productManagementInfo.get_tagsArray ),
                tagsArrayKeys = Object.keys( tagsArray );

            return (
             <div className="screen-button">
                <div style={{height:78}}>
                 {

                     tagsArrayKeys.map((key,index)=>(
                             <Dropdown 
                                 trigger={['click']}
                                 overlay={ <SubMenuComponent  source={ tagsArray[key] } chooseNavBinder={ this.chooseNavBinder } chooseSubMenuBinder={  this.chooseSubMenuBinder }  /> } 
                                 key={ index }
                             >
                              <a className="ant-dropdown-link" href="javascript:void(0)" style={{color:'#000'}}> {  tagsArray[key].title } <Icon type="down" style={{color:'#000'}} /></a>
                             </Dropdown>
                     ))
                 }
                </div>
             </div>  
            )
         }
    }
    
    