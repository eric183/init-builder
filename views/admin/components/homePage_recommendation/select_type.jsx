import React , { Component }  from 'react';
import { Link } from 'react-router';
import { Form, Input, Select, Modal, Tabs, Button,Icon, Row, Col, DatePicker, Radio, Pagination} from 'antd';
import { autorun } from 'mobx';
import * as mobx from 'mobx';
import qs from 'qs';



const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const Option = Select.Option;

const RadioGroup = Radio.Group;



function setLength (arry){
    var cloneArray = [{},{},{},{},{},{},{},{}];
    if(arry instanceof Array){
        arry.forEach(function(item,index){
            cloneArray[index] = item;
        })
    }
   return cloneArray
}




export default class SelectType extends Component {
      constructor(props){
           super(props);
           const imageUrl = this.props.store.HomepageStore.imgBase64;
           this.state = {
               visible_modal : false,
               loading_modal : false,
               id : '',   // url里摘取的id
               partId : '',  // 记录被点击的 part 部件 ID
               whoIs : '',  // 记录被点击的 part 名称
               dataObje : mobx.toJS(this.props.store.HomepageStore.advslists),
               partsTag :  {
                        "closure" : { id : '' },
                        "pocket" : { id : '' },
                        "sleeve" : { id : '' },
                        "belt" : { id : '' },
                        "body_cloth" : { id : '' }
                        }
  
           }
      }
     

    handleClickImage = (id,type) => {  
             let param = {};
             type == 'bodytype' ?  param.group =  'toboom_sort' : param.toboom_sort = id;
             this.props.store.HomepageStore.getImagesResource(param, () => {});
             this.setState({ visible_modal : true, partId : id, whoIs : type });
            // 每次打开弹窗都会去请求数据
     }




    handleOk_modal = () => {   
            let { whoIs } = this.state;
            let param = {
                  tag :  whoIs == 'bodytype' ? '' : whoIs,   //  属性标签 门襟(closure)|口袋(pocket)|袖子(sleeve)|腰带(belt)
                  resource_id : this.child.state.selectedId,
                  group : whoIs == 'bodytype' ? 'bodytype' : 'part',  // 属性组 身型(bodytype)|部件(part)
            };



           this.props.store.HomepageStore.add_advs(this.state.id, param , () => {
                       this.setState({ visible_modal : false });
                       this.props.store.HomepageStore.getAdvslists(this.state.id);  // 重新获取列表数据
           })
     }



    handleCancel_modal = () => {  
          // 同时清空一些变量
          this.setState({ visible_modal : false, partId : '', whoIs : '' });
          this.child.cleanAfterClose(); // 调用子组件方法 
    }




    backAction = () => {
        this.props.history.push('/setting/recommendation_manager/');
        // 同时清空一些变量
    }


    // 解除关联图片
    untieImage =(id) => {
         this.props.store.HomepageStore.delete_advs(id, () => {
                this.props.store.HomepageStore.getAdvslists(this.state.id);  // 重新获取列表数据 
         });
    }
   

    // 引用子组件
    onRef = (ref)  => {  this.child = ref }


componentWillMount(){

        const params = qs.parse(this.props.location.search.slice(1));

        this.setState({ id : params.id });

        this.props.store.HomepageStore.getAdvslists(params.id);  // 获取列表数据

        this.props.store.HomepageStore.getPartsInformation();  // 获取服饰部件ID

        autorun(() => {
            const partsInformation = mobx.toJS(this.props.store.HomepageStore.partsInformation);

                if(partsInformation.part){
                    var partsTag = [];
                      partsInformation.part.tags.forEach((item) => { 
                                switch(item.title_en){
                                    case "closure" : partsTag['closure'] = item ;   // 门襟
                                    break;
                                    case "pocket" : partsTag['pocket'] = item ;  // 口袋
                                    break;
                                    case "sleeve" : partsTag['sleeve'] = item ;    // 袖口
                                    break;
                                    case "belt" :partsTag['belt'] = item  ;    // 腰带
                                    break;
                                    case "body_cloth" : partsTag['body_cloth'] = item ;    // 身型
                                    break;
                                }
                        });

                   this.setState({  partsTag : partsTag })
                }

            this.setState({ dataObje : mobx.toJS(this.props.store.HomepageStore.advslists)  });
  
        });


    }

    
     componentDidMount(){ }

     componentWillReceiveProps(nextProps) {
        const location = nextProps.location;
        const preLocation = this.props.location;
        /*通用处理antd导致的声明周期钩子调用BUG Begin*/
        if(preLocation.pathname + preLocation.search == nextProps.location.pathname + nextProps.location.search) return;
        /* End*/
        if(!!qs.parse(location.search.slice(1)).page){}
     }


      render(){
            const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 22 } };
            const cursorStyle  = { cursor : 'pointer' };
            const { visible_modal,loading_modal,dataObje, partsTag } = this.state;
            return (
                <div className="select_type_layout" >
                    <Form>
                      <div style={{ textAlign : 'right' }}> <Icon type="close" className="back-btn" onClick={ this.backAction } /></div>
                       <FormItem   {...formItemLayout}  label="选择身型">
                        <ul className="select_type_img_list">
                              {
                                  dataObje.toboom_sort.image ? (
                                    <li>
                                        <span className="select_type_close"><Icon onClick={ () => { this.untieImage(dataObje.toboom_sort.id )  }} type="close" /></span>
                                        <img src={dataObje.toboom_sort.image } alt=""/>
                                    </li>
                                   ) : (
                                    <li  style={cursorStyle} onClick={ () => { this.handleClickImage(partsTag.body_cloth.id, 'bodytype' ) }} >
                                          <Icon className="select_type_empty" type="picture" />
                                     </li>   
                                   )
                              }
                        </ul>
                       </FormItem>

                       <FormItem   {...formItemLayout}  label="选择门襟">
                         <ul className="select_type_img_list">
                            {
                               setLength(dataObje.parts.closure).map((item, index) => {
                                     if(item.image) return (<li key={index}>
                                           <span className="select_type_close"><Icon onClick={ () => { this.untieImage(item.id)  } } type="close" /></span>
                                           <img src={item.image} alt=""/></li>);
                                      return (<li key={index} style={cursorStyle} onClick={ () => { this.handleClickImage(partsTag.closure.id, partsTag.closure.title_en) }  }>
                                              <Icon className="select_type_empty" type="picture" /></li>)
                               })
                            }
                        </ul >
                       </FormItem>

                         <FormItem   {...formItemLayout}  label="选择袖子">
                          <ul className="select_type_img_list">
                            {
                               setLength(dataObje.parts.sleeve).map((item, index) => {
                                     if(item.image) return (<li key={index} >
                                             <span className="select_type_close"><Icon  onClick={ () => { this.untieImage(item.id)  } } type="close" /></span>
                                             <img src={item.image} alt=""/></li>);
                                      return (<li key={index} style={cursorStyle} onClick={ () => { this.handleClickImage(partsTag.sleeve.id,partsTag.sleeve.title_en)}}>
                                             <Icon className="select_type_empty" type="picture" /></li>)
                               })
                            }
                        </ul>
                       </FormItem>

                        <FormItem   {...formItemLayout}  label="选择口袋">
                            <ul className="select_type_img_list">
                                {
                                 setLength(dataObje.parts.pocket).map((item, index) => {
                                        if(item.image) return (<li key={index} >
                                         <span className="select_type_close"><Icon  onClick={ () => { this.untieImage(item.id)  } } type="close" /></span>
                                         <img src={item.image} alt=""/></li>);
                                        return (<li key={index}  style={cursorStyle} onClick={ () => { this.handleClickImage(partsTag.pocket.id,partsTag.pocket.title_en) }  }>
                                           <Icon className="select_type_empty" type="picture" /></li>)
                                   })
                                }
                            </ul>
                       </FormItem>

                         <FormItem   {...formItemLayout}  label="选择腰带">
                            <ul className="select_type_img_list">
                               {
                                setLength(dataObje.parts.belt).map((item, index) => {
                                        if(item.image) return (<li key={index}>
                                          <span className="select_type_close"><Icon onClick={ () => { this.untieImage(item.id)  } } type="close" /></span>
                                         <img src={item.image} alt=""/></li>);
                                        return (<li key={index}  style={cursorStyle} onClick={ () => { this.handleClickImage(partsTag.belt.id,partsTag.belt.title_en) }  }>
                                        <Icon className="select_type_empty" type="picture" /></li>)
                                })
                                }
                            </ul>
                       </FormItem>

                       <FormItem wrapperCol={{ span: 22 }}  style={{ textAlign : 'center' }}>
                            {/* <Button  type="primary" htmlType="submit" style={{ width : '120px', marginRight : '5px' }}>提交</Button> */}
                            <Button   style={{ width : '120px'}} onClick={ this.backAction } >返回</Button>
                          </FormItem>
                      </Form>   


                     <Modal
                           width={1200}
                            visible={visible_modal}
                            title=""
                            onOk={this.handleOk_modal}
                            onCancel={this.handleCancel_modal}
                            footer={[
                                <Button key="submit" type="primary" loading={loading_modal} onClick={this.handleOk_modal}> 确定 </Button>,
                                <Button key="back" onClick={this.handleCancel_modal}>关闭</Button>
                            ]}
                            >
                                <SelectList onRef={ this.onRef }  {...this.props}  parentState={ this.state } />
                            </Modal>


                 </div>   
           )
      }
}










 // 弹窗
class Selectlist extends Component {
     constructor(props){
               super(props);
               this.state = {
                   myUploadedList : mobx.toJS(this.props.store.HomepageStore.myUploadedList),
                   page : 1,
                   limit : 15,
                   count : 15,
                   toboom_sort : '',
                   start : '',
                   end : '',
                   selectedId : '',
                   selectedVideo : ''
                 
               }
          }

      selected_upload = (value) => { this.setState({ selectedId : value })  }
      selected_video = (value) => { this.setState({  selectedVideo : value })   }


   // 关闭当初后置空变量
     cleanAfterClose = () => {
            this.setState({
                    page : 1,
                    limit : 15,
                    count : 15,
                    toboom_sort : '',
                    start : '',
                    end : '',
                    selectedId : '',
                    selectedVideo : ''
            })
     }


     // 筛选条件处理
     filteActionHandler = (value,ext) => {
           !ext ? this.props.form.resetFields() : '';
            var param = {
                          part : this.props.parentState.partId,
                          start : '',
                          end : ''
                       };

            if(ext){
                param.start = value[0];
                param.end = value[1];
                this.setState({ start : start, end :  end  });
            }else{
                param.toboom_sort = value;  
                this.setState({ toboom_sort : toboom_sort  });
            }

             this.props.store.HomepageStore.filteImageResouce(param, () => {
                    this.setState({ page : 1 });

             })    
      }


      componentWillMount(){
            autorun(() => {
                  let  myUploadedList =  mobx.toJS(this.props.store.HomepageStore.myUploadedList);
                  if(myUploadedList.length)  this.setState({ myUploadedList : myUploadedList , count : myUploadedList.length });
            })
      }

      componentDidMount = () => {
               // 把子组件的引用通过方法传递给父组件
               this.props.onRef(this)
         }
      componentWillReceiveProps = () => {}



       render(){
        const { myUploadedList, page, limit, count } = this.state;
        const { toboom_sort, order, part, status, v_season } = mobx.toJS(this.props.store.HomepageStore.partsInformation);
        const { getFieldDecorator } = this.props.form;
      
          return (
               <div className="select_modal">
                 <Form  layout="inline">
                     <Row>
                        <Col span={24}>

                         <FormItem>
                            {getFieldDecorator('clothes_category')(
                                <Select placeholder="衣服分类" allowClear style={{ width : 100 }} onChange={(value) => { this.filteActionHandler(value) } } >
                                    {
                                        toboom_sort.tags.map((item,index) => {
                                            return (<Option key={index} value={item.id}>{ item.title }</Option>)  
                                        })
                                    }
                                   </Select>
                                )}
                          </FormItem>

                          <FormItem>
                            {getFieldDecorator('order')(
                                <Select placeholder="显示顺序" allowClear style={{ width : 100 }} onChange={(value) => { this.filteActionHandler(value) } }  >
                                    {
                                        order.tags.map((item,index) => {
                                           return (<Option key={index} value={item.id}>{ item.title }</Option>)  
                                        })
                                    }
                                   </Select>
                                )}
                          </FormItem>

                           <FormItem>
                            {getFieldDecorator('part')(
                                <Select placeholder="选择类型" allowClear style={{ width : 100 }} onChange={(value) => { this.filteActionHandler(value) } }  >
                                    {
                                        part.tags.map((item,index) => {
                                            return (<Option key={index} value={item.id}>{ item.title }</Option>)  
                                        })
                                    }
                                   </Select>
                                )}
                          </FormItem>

                           <FormItem>
                            {getFieldDecorator('status')(
                                <Select placeholder="图片状态" allowClear style={{ width : 100 }} onChange={(value) => { this.filteActionHandler(value) } }  >
                                    {
                                        status.tags.map((item,index) => {
                                            return (<Option key={index} value={item.id}>{ item.title }</Option>)  
                                        })
                                    }
                                   </Select>
                                )}
                          </FormItem>

                        <FormItem>
                            {getFieldDecorator('v_season')(
                                <Select placeholder="选择季度" allowClear style={{ width : 100 }} onChange={(value) => { this.filteActionHandler(value) } }  >
                                    {
                                        v_season.tags.map((item,index) => {
                                            return (<Option key={index} value={item.id}>{ item.title }</Option>)  
                                        })
                                    }
                                   </Select>
                                )}
                          </FormItem>

                        </Col>
                      </Row>

                      <Row style={{ marginBottom : '20px', marginTop : '10px'}}>
                      <Col span={24}>
                       <FormItem>
                         <RangePicker onChange={(time, timeString) => { this.filteActionHandler(timeString,'date') }} />
                           </FormItem>
                       </Col>
                     </Row>
                 </Form>

                
                     <Row>
                        <Col span={24}>
                            <Tabs onChange={() => {}} type="card" >
                                <TabPane tab="我的上传" key="1">
                                  <RadioGroup style={{ width: '100%',marginBottom : '15px'  }} onChange={ (e) => {  this.selected_upload(e.target.value)  } } >
                                      <ol className="select_img_list">
                                            {
                                                myUploadedList.map((item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <Radio  value={item.id}>
                                                            <img src={item.hd} />
                                                            <h6>{item.title}</h6>
                                                            </Radio > 
                                                      </li>
                                                    )
                                                  
                                                 })
                                            }
                                      </ol>
                                   </RadioGroup>
                                   <Col span={4} push={10}>
                                     <Pagination style={{ margin : '0 auto' }}
                                                 size="small"
                                                 total={count} 
                                                 current={page}
                                                 pageSize={limit}
                                                 simple 
                                                 hideOnSinglePage={true}
                                                 onChange={(pageNumber) => { // 页码改变的回调，参数是改变后的页码及每页条数
                                                       console.log(pageNumber);
                                                      let { clothes_category, start, end } = this.state;
                                                      this.props.store.HomepageStore.filteImageResouce({
                                                                    page : pageNumber,
                                                                    part : this.props.parentState.partId,
                                                                    toboom_sort : toboom_sort,
                                                                    start : start,
                                                                    end : end
                                                            }, () => {
                                                                        this.setState({ page : pageNumber });
                                                
                                                                   })                
                                                }}
                                           />
                                      </Col>          
                                 </TabPane>


                                 {/*  暂时隐藏
                                   <TabPane tab="视频搜索" key="2">
                                   <RadioGroup style={{ width: '100%',marginBottom : '15px' }} onChange={ (e) => { this.selected_video(e.target.value)}  } >
                                    <ol className="select_img_list">
                                            <li>
                                            <Radio value="A">
                                                <img src="https://b-ssl.duitang.com/uploads/item/201508/20/20150820200416_z2h58.thumb.700_0.jpeg" />
                                                <h6>123123</h6>
                                                </Radio> 
                                            </li>
                                        </ol>
                                     </RadioGroup>
                                     <Col span={4} push={10}>
                                     <Pagination style={{ margin : '0 auto' }}
                                                 size="small"
                                                 total={100} 
                                                 current={1}
                                                 pageSize={10}
                                                 simple 
                                                 onChange={(pageNumber) => { // 页码改变的回调，参数是改变后的页码及每页条数
                                                      console.log(pageNumber)
                            
                                                }}
                                                onShowSizeChange={(current,pageSize) => {   // pageSize 变化的回调 (改变每页显示条目数。)
                                                    console.log(pageSize)
                                                }} 
                                           />
                                         </Col>  
                                 </TabPane>
                                  */}
                            </Tabs>
                         </Col>
                      </Row>
                </div>
          )
       }

}



const SelectList = new Form.create()(Selectlist);