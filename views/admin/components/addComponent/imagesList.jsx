import * as React from 'react';
import * as mobx from 'mobx';
import { observable, action, runInAction, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { TweenMax,TimelineMax, Power2, TimelineLite } from "gsap/TweenMax";
import { Draggable } from "gsap/Draggable"
import { Row, Col,Input,DatePicker, Select, Pagination,Modal,Cascader } from 'antd';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const Search = Input.Search;

   
function throttleMe(cb){
  var start = +new Date();
  return function(){
      var now = new Date();
      if(now - start > 50){
          start  = now;
          cb();
      }
  }
}



@observer
   export default class ImagesList extends  Component{
     
          state = {
            visiable : false
          }

         clickOnImage(item){   // 来自外部的方法 
               this.props.clickAction &&  this.props.clickAction(item);
               this.onCancel();
           }


        filterAction_selector = () => {

          console.log('sdfsdfsdf')

        }


        filterAction_RangePicker = () => {}


        filterAction_Search = () => {}


        filterAction_Cascader = () => {}


        componentDidMount(){
              this.props.store.FashionStore.request_materialList();
        }


        componentWillReceiveProps(nextProps) {
               // 每次点的时候，都请求数据 
               if(nextProps.visiable != this.state.visiable)  this.setState({  visiable : nextProps.visiable })
        }


        onCancel = () => {
             this.props.onClose &&  this.props.onClose();
        }

         render(){
           let { visiable } = this.state;
           const itemWidth = { width : 150, margin: '5px 10px 5px 0' };
           let _imageListData = mobx.toJS(this.props.store.FashionStore.getImageListData);

              return (
                <Modal
                className="imageLIst-modal"
                title="图片素材列表"
                style={{ top: 30 }}
                width={1200}
                visible={ visiable }
                onCancel={ this.onCancel }
                footer={null}
                >
            
                  <div className="imageList-wrapper" style={{ width : 1200 }}>
                    <div className="imageList-bar">
                      
                          <Select placeholder="图片用途" allowClear defaultValue={ undefined }  style={itemWidth} onChange={ this.filterAction_selector.bind(this,'1') } >

                                      <Option value="male">item1</Option>
                                      <Option value="female">femal</Option>

                                    </Select>

                              <Select placeholder="季度" allowClear defaultValue={ undefined }  style={itemWidth} onChange={ this.filterAction_selector.bind(this,'2') }  >

                                      <Option value="male">male</Option>
                                      <Option value="female">female</Option>

                                    </Select>

                            <Select placeholder="年份" allowClear defaultValue={ undefined }    style={itemWidth} onChange={ this.filterAction_selector.bind(this,'1') }  >

                                      <Option value="male">male</Option>
                                      <Option value="female">female</Option>

                                    </Select>

                            <Select placeholder="修改人" allowClear defaultValue={ undefined }  style={itemWidth} onChange={ this.filterAction_selector.bind(this,'1') }  >

                                      <Option value="male">male</Option>
                                      <Option value="female">female</Option>

                                    </Select>

                            <RangePicker style={{ width: 300,marginRight : 10 }} defaultValue={ [] }  onChange={ this.filterAction_RangePicker } />

                             <Cascader options={[]}  placeholder="廓形" defaultValue={ undefined }  onChange={ this.filterAction_Cascader.bind(this) } />

                             <Cascader options={[]} style={{ marginRight : 10 }}  placeholder="部件" defaultValue={ [] }  onChange={ this.filterAction_Cascader.bind(this) } />

                             <Search  placeholder="请输入图片名或标签名" defaultValue={ '' }  style={{ width : 200, marginRight : 10 }} onChange={ this.filterAction_Search}  />

                            <Select placeholder="发布状态" allowClear  defaultValue={ undefined }  style={itemWidth} onChange={ this.filterAction_selector.bind(this,'1') }  >

                                      <Option value="male">male</Option>
                                      <Option value="female">female</Option>

                                    </Select>
                      
                      </div>

                     {/* imageList-main start  */}
                       <div className="imageList-main"   ref="isrcoll">
                         <ul ref="scrollBox">
                          {
                            _imageListData.map((item, index) => {
                                    return (
                                      <li key={index} onClick={ this.clickOnImage.bind(this,item) }>
                                       <figure>
                                           <img src={ item.preview && item.preview.path } alt=""/>
                                        </figure>
                                        <p>图片标题</p>
                                     </li>
                                    )
                               })
                           }
                           </ul>
                          </div>
                      {/* imageList-main end  */}


                     <Row>
                       <Col span={9} offset={7} >
                       <Pagination style={{ margin: '15px 0' }}
                         size="small" 
                         total={50} 
                         current={1}
                         pageSize={10}
                        showSizeChanger 
                        showQuickJumper 
                        onChange={(page, pageSize) => {

                           }}
                         onShowSizeChange={(current, size) => {

                           }}
                        />
                           
                        </Col>
                     </Row>
                  </div>
              </Modal>
              )
         }
   }



