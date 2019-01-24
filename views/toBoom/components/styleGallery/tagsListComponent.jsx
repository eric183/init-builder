import React, { Component, PureComponent } from 'react';
import { observer } from 'mobx-react';
import  * as mobx from 'mobx';
import { observable, computed, autorun } from 'mobx';



@observer
export default class TagsListComponent extends React.Component {

     @computed get get_tagsList(){ return this.props.store.styleGalleryStore.tagsList }

     deleteTag( item ){ this.props.deleteTagsBinder( item )  }

       render(){
           let tagsList = mobx.toJS( this.get_tagsList );

     
            return (
            <div className="tags-list">
                {
                  tagsList.map((item,index) => {
                    return (
                        <a key={ index } className={ item.classname } href="javascript:void(0)"> { item.title } <i className="iconfont shanchu"  onClick={ this.deleteTag.bind(this, item) } ></i> </a>
                    )

                  })
                }
             </div>       
            )
       }
}

