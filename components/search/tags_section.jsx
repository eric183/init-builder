
import React, { Component } from 'react';

export default  class TagsSection extends Component {
     render(){
        let { data, visiable, clientTop, clientLeft, parentRef, id, backgroundColor, prefix } = this.props;
             return (
                <div className="sub_tags_section" style={{ display : visiable ? 'block' : 'none', backgroundColor : backgroundColor,  top : clientTop, left : clientLeft }}>
                    <i className="sub_tags_triangle"></i>
                    {
                       data.map((item,index) => {
                              return (
                                <span 
                                    data-index={ index }
                                    data-id={ item.id }
                                    style={{ backgroundColor : item.backgroundColor || 'transparent', color : item.color ? item.color : '#4a4a4a' }}
                                    data-rank={ id }
                                    className={`${ prefix }-${ item.id }`}
                                    key={index} 
                                    data-active={ ( item.backgroundColor && item.backgroundColor != 'transparent' ) ? true : false } 
                                    >
                                  { item.name_zh }
                                </span> 
                              )
                         })
                    }
               </div>
             )
       }
}

TagsSection.defaultProps = {
      id : 'sLevel',
      prefix : 's',
      data : [],
      visiable : false, 
      clientTop : 30,
      clientLeft : 0,
      parentRef : {},
      backgroundColor : '#eeeeee'
}





