import React from 'react';
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import * as mobx from 'mobx';
// import CATEGORY from '../../store/category'
import Category from './cate'
import Item from './item'
import Extra from './extra'
import PopularDetail from '../populardetai';



function throttleMe(cb){
    var start = +new Date();
    return function(){
        var now = new Date();
        if(now - start > 1200){
            start  = now;
            cb();
        }
    }
}


@observer
export default class Main extends React.Component {
    async componentWillMount() {
        await this.props.store.categoryInfo.getList()
    }

    @computed get list() {
        return this.props.store.categoryInfo.list
    }

    @computed get aggs() {
        return this.props.store.categoryInfo.aggs
    }

    @computed get seasonId() {
        return this.props.store.categoryInfo.aggs.season_id
    }


    @computed get orderBy() {
        return this.props.store.categoryInfo.orderBy
    }
    @computed get end() {
        return this.props.store.categoryInfo.end
    }

   
    @computed get _detailData() {
        return this.props.store.categoryInfo.detailData
    }

    refreshList = async option => {
        await this.props.store.categoryInfo.init(option)
        await this.props.store.categoryInfo.getList()
    }

  
    handleNextInfo = (item) => {
           Util.setCookie("imageId",item.id,1);
          this.props.store.categoryInfo.getDetailData(item.id);
          this.refs.popular_deatil.refs.popular_deatil.style.transform = `translateX(0%)`;
    }
     

 
     componentWillUnmount(){
        this.props.store.categoryInfo.clearPageValue();
     }


    componentDidMount() {

        let isrcoll = this.refs.isrcoll,
            refreshHeight = 700,
            isLoading = false,
            isrcollBox = this.refs.box;

          
         window.addEventListener('scroll',  throttleMe((e) => {

            if(this.end) return;
            if (isLoading || isrcollBox.offsetHeight < 1) return;

            let scrollHeight = isrcoll.offsetHeight;

            let boxHeight = isrcollBox.offsetHeight;

            if (boxHeight - scrollHeight - isrcoll.scrollTop < refreshHeight) {
                isLoading = true
                this.props.store.categoryInfo.getList(false).then(() => {
                    isLoading = false;
                  
                })

            }

        } ))



    }
    
    toTop() {
        this.refs.scrollEle.scrollTop = document.documentElement.scrollTop = 0
    }

    state = { list: []  }

    render() {

        let {sort_id } = mobx.toJS(this.aggs);

        return (
            <div className='category_type_list_box' ref="scrollEle">
                <div className="baoyicenghuisima">

                    <Category refreshList={item =>{ this.refreshList({sort_id:item.tag_id})  }} category={sort_id}/>

                    <div ref='isrcoll' className='list'>
                        <div style={{overflow: 'hidden'}} ref='box'>
                              {this.list.map((item, index) => <Item handleNextInfo={this.handleNextInfo}  key={index} item={item}/>)}
                        </div>
                        {/* <Loading end={this.end}/> */}
                    </div>
                </div>
                {/* <div title="top" className="to_top" onClick={this.toTop.bind(this)}> */}
                    <i className="iconfont dingbu" onClick={this.toTop.bind(this)}></i>
                {/* </div> */}
                <Extra refreshList={item=>{  this.refreshList(item)  }} season={ mobx.toJS(this.seasonId) } orderBy={this.orderBy}/>


              <PopularDetail ref="popular_deatil" { ...this.props } { ...this.state }/>
          
            </div>
        )
    }
}

function Loading(props) { 
    return (
        <div className='loading'>
            <p>{props.end ? '加载完成！' : '正在加载...'}</p>
        </div>
    )
}

