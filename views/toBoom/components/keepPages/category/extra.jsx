import React from 'react';
import SwitchTabs from './SwitchTabs'
import classnames from 'classnames'

export default class Main extends React.Component {

    render() {
        let season = this.props.season ? this.props.season:[]
        return (
            <div className='categroy-extra'>
                <div className="control">

                        {/* onClick={()=>{ this.props.refreshList({angle:'v_contrast'}) }}  对比 */}
                    <p onClick={()=>{ this.props.refreshList({orderBy:'hot'}) }}  className="top">HOT</p>

                    <div className="center">
                        <p onClick={()=>{  this.props.refreshList({angle:'v_front'}) }}  className="left">正</p>
                        <p className="op">···</p>
                        <p onClick={()=>{ this.props.refreshList({angle:'v_back'}) }}  className='right'>反</p>
                    </div>

                    <p  onClick={()=>{ this.props.refreshList({orderBy:'new'})  }}   className="bottom">NEW</p>

                </div>

                <div className="extra-choose">

                    {/* className={classnames('extra-item',{active:this.props.orderBy=="new"})} */}
                    <p style={{ padding: '10px 0' }} onClick={()=>{ this.props.refreshList({angle:'',orderBy:'',season_id:'',sort_id:'',init:true}) }} ><a style={{color: "#" + 171717,  padding: '10px 0' }} href="javascript:">全部</a></p>
                
                    {/* <div className="extra-item">
                        <ChooseItem choose={item=>{  this.props.refreshList({season_id:item.key}) }} item={{ title: '季度', list: season }}/>
                    </div> */}
                </div>
                
            </div>
        )
    }
}

class ChooseItem extends React.Component {
    state = {
        close: false
    }
    show = () => {
        this.setState({
            close: !this.state.close
        })
    }

    render() {

        let {title, list} = this.props.item

        return (
            <div className='choose-item'>
                <p onClick={this.show} className={classnames("title", {active: this.state.close})}>{title} <i></i></p>

                <SwitchTabs show={this.state.close}>
                    <ul>
                        { list.length  && list.map((item, index) => {
                            return <li onClick={()=>{
                            this.props.choose(item)}
                            } key={index}><a href="javascript:">{item.title}</a></li>
                        })}
                    </ul>
                </SwitchTabs>

            </div>
        )
    }
}

















