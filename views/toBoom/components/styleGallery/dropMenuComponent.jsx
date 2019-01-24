import React, { PureComponent } from 'react';
import {observer} from 'mobx-react';
import { computed, observable, autorun } from 'mobx';
import * as mobx from 'mobx';



export default class DropMenuComponent extends React.PureComponent {
    state = {
      visiable : false
    }

    mouseEnterBinder = () => {
          this.setState({ visiable : true })

    }
    mouseLeaveBinder = () => {
         this.setState({ visiable : false })
    }

    subnavEventBinde( item, index, level ){
          this.props.chooseNavItem( item, index, level )
    }

    render(){

      let { visiable } = this.state;
      let { subnavItem, subNavIndex, itemIndex, threeLevelNav } = this.props;
      let { children = [] } = subnavItem;

      return (
          <div className="dropMenu" onMouseEnter={  this.mouseEnterBinder   } onMouseLeave={ this.mouseLeaveBinder  } >
              <h4 onClick={this.subnavEventBinde.bind(this, subnavItem, itemIndex, 2 ) } className={ subNavIndex == itemIndex ? 'active' : '' }  >{ subnavItem.label }</h4>
              <ul className="dropMenu-third"  style={{ display : ( visiable && children.length ) ?  'block' : 'none' }} >
                 {
                    children.map((item,index) => (
                       <li key={ index } 
                           onClick={ this.subnavEventBinde.bind(this, item, itemIndex, 3 ) } 
                           className={ (subNavIndex == itemIndex && threeLevelNav == item.label) ? 'active' : '' }  > { item.label } </li>
                   ))
                 }
              </ul>
           </div>
         ) 
    }
}

