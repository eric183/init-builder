import React from 'react';

class Comp extends React.Component {
    constructor() {
        super();
        this.state={
            contentHeight:'auto'
        }
    }
    componentDidMount(){
        this.setState({
            contentHeight:this.refs.tabs_content.offsetHeight
        })
    }
    componentDidUpdate(){
        if(this.refs.tabs_content.offsetHeight !=this.state.contentHeight){
            this.setState({
                contentHeight:this.refs.tabs_content.offsetHeight
            })
        }
    }
    render(){
        let props = this.props
        return <div style={{height:props.show?this.state.contentHeight:0}} className='xl-switch-tabs'>
            <div ref='tabs_content' className="xl-switch-tabs_content">{props.children}</div>
        </div>
    }
}
export default Comp
