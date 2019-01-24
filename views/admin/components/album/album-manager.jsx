import React from 'react';
import { Modal, Button, Icon, Tabs, Input, Layout, List, Select, DatePicker } from 'antd';
import axios from 'axios';
import * as mobx from 'mobx';
import { computed } from 'mobx';
import { observer } from 'mobx-react'; 
import qs from 'qs';

import DragPicture from "./drag-picture";

import ModifyPicture from "./modify-picture";

const Option = Select.Option;


@observer
class AlbumManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                page : 1,
                limit : 16,
                me: "0"
            },
        }
    }
    @computed get albumList() {
        return mobx.toJS(this.props.store.AlbumStore.albumList);
    }
    @computed get count() {
        return this.props.store.AlbumStore.count;
    }
    @computed get constructorData() {
        return mobx.toJS(this.props.store.AlbumStore.constructorData);
    }
    @computed get albumInfo() {
        return mobx.toJS(this.props.store.AlbumStore.albumInfo);
    }
    @computed get photoList() {
        return mobx.toJS(this.props.store.AlbumStore.photoList);
    }
    @computed get searchNavList() {
        return mobx.toJS(this.props.store.AlbumStore.searchNavList);
    }
    handleClose(){
        this.refs.drag_picture.refs.drag_picture.style.transform = `translateX(0%)`;
        this.refs.drag_picture.refs.drag_picture.style.opacity = 1;
    }
    handleClick(id){
        this.props.store.AlbumStore.getAlbumInfo(id);
        this.props.store.AlbumStore.getPhotoList(id);
        this.refs.modify_picture.refs.modify_picture.style.transform = `translateX(0%)`;
        this.refs.modify_picture.refs.modify_picture.style.opacity = 1;
    }
    callback(value) {
        // this.state.params.me = value;
        // this.props.store.AlbumStore.getAlbumList(this.state.params);
        
        let { pathname } = this.props.history.location;
        this.props.history.push(pathname + "?" + qs.stringify({me: value,page:1,limit: 16}));
        this.setState({params: {
            page : 1,
            limit : 16,
            me: value
        }});
    }
    componentDidMount() {
        const location = this.props.location;
        this.props.store.AlbumStore.getAlbumList(qs.parse(location.search.slice(1)));
        if(location.search) {
            this.setState({params: qs.parse(location.search.slice(1))});
        }

        this.props.store.AlbumStore.getAlbumConstructor();
        this.props.store.AlbumStore.getSearchNav();
        
    }
    componentWillReceiveProps(nextProps) {

        const location = nextProps.location;
        const preLocation = this.props.location;
        
        /*通用处理antd导致的声明周期钩子调用BUG Begin*/
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
  
        if(!!qs.parse(location.search.slice(1)).page){

            const params = qs.parse(location.search.slice(1));
            this.setState({params});
            this.props.store.AlbumStore.getAlbumList(params)
        }
    }
    handleSearch(value,string) {
        this.state.params[string] = value;
        this.state.params.page = 1;
        var qsInfo = this.props.util.setQsInfo(this.state.params);
        this.props.history.push(`${this.props.location.pathname}?${qsInfo}`);
        this.setState({params: this.state.params});
    }
    handleSearchTime(string,fromat,value) {
        this.handleSearch(value,string);
    }
    render() {
        const TabPane = Tabs.TabPane;
        const pagination = {
            current: Number(this.state.params.page),
            pageSize: Number(this.state.params.limit),
            showQuickJumper: true,
            showSizeChanger: false,
            total : Number(this.count),
            showTotal: function(total,pageSize){
                return `共${Number(total)}条`
            },
            onChange:(pageNumber) => {  // 页码改变的回调，参数是改变后的页码及每页条数
                this.state.params.page = pageNumber;
                let { pathname } = this.props.history.location;
                this.props.history.push(pathname + "?" + qs.stringify(this.state.params));
                this.setState({params: this.state.params});
            }
        };
        return (
            <Layout.Content>
                <Tabs className="tabList" activeKey={this.state.params.me} onChange={this.callback.bind(this)} type="card">
                    <TabPane tab="全部图片" key="0">
                    
                    </TabPane>
                    <TabPane tab="我的图片" key="1">

                    </TabPane>
                </Tabs>
                <Button type="primary" className="upload_imgs" onClick={this.handleClose.bind(this)}> 上传图片 </Button>
                <div className="nav_search">
                    <div className="nav_item">
                        <Select value={this.state.params.part} placeholder={"选择类型"} allowClear onChange={value => this.handleSearch(value,"part")}>
                            {
                                this.searchNavList.part.tags.map((item,index) => {
                                    return (<Option value={`${item.id}`} key={index}>{item.title}</Option>)
                                }) 
                            }
                        </Select>
                        <Select value={this.state.params.toboom_sort} placeholder="选择款式" allowClear onChange={value => this.handleSearch(value,"toboom_sort")}>
                            {
                                this.searchNavList.toboom_sort.tags.map((item,index) => {
                                    return (<Option value={`${item.id}`} key={index}>{item.title}</Option>)
                                }) 
                            }
                        </Select>
                        <Select value={this.state.params.v_season} placeholder="选择季度" allowClear onChange={value => this.handleSearch(value,"v_season")}>
                            {
                                this.searchNavList.v_season.tags.map((item,index) => {
                                    return (<Option value={`${item.id}`} key={index}>{item.title}</Option>)
                                }) 
                            }
                        </Select>
                        <DatePicker placeholder="开始时间" onChange={this.handleSearchTime.bind(this,"start")}/>

                        <DatePicker placeholder="结束时间" onChange={this.handleSearchTime.bind(this,"end")}/>
                        <Select value={this.state.params.status} placeholder="图片状态" allowClear onChange={value => this.handleSearch(value,"status")}>
                            {
                                this.searchNavList.status.tags.map((item,index) => {
                                    return (<Option value={`${item.id}`} key={index}>{item.title}</Option>)
                                }) 
                            }
                        </Select>
                        <Select value={this.state.params.order} placeholder="显示顺序" allowClear onChange={value => this.handleSearch(value,"order")}>
                            {
                                this.searchNavList.order.tags.map((item,index) => {
                                    return (<Option value={`${item.id}`} key={index}>{item.title}</Option>)
                                }) 
                            }
                        </Select>
                    </div>
                    <div>
                        <Input.Search onSearch={value => this.handleSearch(value,"keywords")}/>
                    </div>
                </div>
                <List
                    style={{ marginTop : '20px' }}
                    className="pic_list"
                    grid={{ gutter: 10, xs: 1, sm: 3, md: 5, lg: 5, xl: 7, xxl: 7 }}
                    dataSource={ this.albumList }
                    pagination={pagination}
                    renderItem={item => (
                        <List.Item>
                            <div className="image-box">
                                <div className="image-state">
                                    <span>
                                        {
                                            item.drawings_count ? (<Icon className="file-image-fill" type="file-image-fill"  style={{ margin : '5px',fontSize : '18px' }} />) : ("")
                                        }
                                    </span>
                                    <span>
                                        <Icon className="file-ppt-fill" type="file-ppt-fill"  style={{ margin : '5px',fontSize : '18px',color: "#2B9FF6" }} />
                                    </span>
                                </div>
                                <figure>
                                    <img src={item.hd} onClick={ this.edit_image } onClick={this.handleClick.bind(this,item.id)} />
                                </figure>
                                <div className="image-info-box">
                                    <p>{item.title}</p>
                                    <p>{item.created_date}</p>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
                
    
                <DragPicture { ...this.props } { ...this.state } handleClick={this.handleClick.bind(this)} ref="drag_picture"/>
                <ModifyPicture  { ...this.props } { ...this.state }  ref="modify_picture" constructorData={this.constructorData} albumInfo={this.albumInfo} photoList={this.photoList}/>
            </Layout.Content>
        )
    }
} 

export default AlbumManager;








