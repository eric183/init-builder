import React from 'react';
import mobx from 'mobx';

export default class Main extends React.Component {
    state = {
        tagId: null,
        viviable : 0
    }
    componentWillReceiveProps(nextProps) {
        //debugger;
        if(!this.state.tagId) {
            // var cart = mobx.toJS(this.props.category);
            this.setState({
                tagId: nextProps.category ? nextProps.category[0].key : 0
            })
        }
    }
    componentDidUpdate() {}

    tagHandler(item,index, event) {
        this.setState({ viviable : index })
        this.props.refreshList(item);

    }
    render() {

        let {tagId, categoryId, category = []  } = this.props
        let type = {}

        category.length > 0 && category.forEach( (item,index) =>{
            type[item.ref] = item.children
        });

        let {  viviable  } = this.state;
     
        return (

        
            <div className='category-choose'>
                <div className="head">
                    { category.length > 0 && category.map( (item,index) => {
                        return (
                            <div key={item.tag_id} className={ viviable == index ? "active" : ''} onClick={this.tagHandler.bind(this, item,index)}>
                                  <p>{item.title} <span>{item.title_en}</span></p>
                            </div>
                        )
                    })}
                </div>

                 {
                     category.length > 0 && category.map((item, index) => (
                        <div className="list" key={index} style={{ display : viviable == index ? 'block' : 'none' }}>
                              {
                                item.children.map((item2, i) => (                  
                                    <a key={i} onClick={() => {  this.props.refreshList(item2) }} href="javascript:">
                                        <p>{item2.title} <span>{item2.doc_count}</span></p>
                                    </a>
                                ))
                              }
                          </div>
                     ))
                 }

            
            </div>
        )
    }

}