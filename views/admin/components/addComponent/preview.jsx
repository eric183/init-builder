import * as React from 'react';
import { Component } from 'react';
import { Row, Col} from 'antd';
import * as echarts from 'echarts'; 
import tools from './tools';
import { observable } from 'mobx';
 const {  isEmptyFields } = tools;




 const echartsFn = (function(){
       let echartsList = null;
      
       function renderEchart(folders, clickHandler){ 
             let _data = [];

             folders.forEach((item, index) => {  _data.push({ value : item.expands, name : item.title, index : index })  });

             echartsList = echarts.init(document.getElementById('mychart')); 

             echartsList.setOption({
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                       {
                        name:'',
                        type:'pie',
                        radius : '60%',
                        center: ['50%', '50%'],
                        data: _data,
                        roseType: 'radius'
                    }
                ]
            });

         echartsList.on('click', function (params) {   clickHandler(params.data.index)  });

     }


    function destroyCharts(){ 
            echartsList.dispose();
            echartsList = null;
     }

    return { renderEchart, destroyCharts }

 })();



export default class PreviewComponent extends Component {
         state = {
              itemInfo : { materials : [] },
              folders : []
         }

  componentDidMount(){   this.props.onRefPreview(this)  }

     // 点击图表回调函数
     chartOnClick = (index) => {
            let item = this.state.folders[index];
            this.setState({ itemInfo : item })
     }

     _onOPenAction = () => { // 通过父组件提供其他组件调用
           let fieldsvalue =  this.props.getFieldsvalue(),
               folders = isEmptyFields(fieldsvalue.folders);
         if(folders.length){
                 this.setState({ folders : folders, itemInfo : folders[0] });
                 echartsFn.renderEchart(folders,this.chartOnClick); 
         }
     }


     _onCloseAction = () => {  // 通过父组件提供其他组件调用
          this.setState({   itemInfo : { materials : [] }, folders : [] });
          echartsFn.destroyCharts();
     }



      render(){

          let { folders, itemInfo } = this.state;

           return (
              <Row>
                <Col span={24} style={{ maxHeight : 600, overflowY : 'scroll' }}>
                    <ul className="preview-component">
                          {
                            folders.length > 0 ? (
                                <li>
                                 <Row>
                                  <Col span={12}>
                                    <div id="mychart" className="myEchart-box" style={{ width : '100%', height : 300 }}  >echarts</div>
                                     </Col>
                                       <Col span={11} offset={1}>
                                         <div className="item-image-box">
                                             <img className="item-img-main" src={  itemInfo.materials.length && itemInfo.materials[0].image } alt=""/>  
                                             <figure>
                                                 {
                                                   itemInfo.materials.map((source, i) =>(  // 第一个默认是主图
                                                        i > 0 ? <img key={i} src={ source.image } alt=""/> : ''
                                                       ))
                                                 }
                                             </figure>
                                         </div>
                                         <dl className="item-info">
                                         <dt>{ itemInfo.title }</dt>   
                                         <dd>{ itemInfo.desc }</dd>
                                         </dl>
                                     </Col>
                             </Row>
                             </li> 
                            ) :
                           ( <li style={{ textAlign : 'center', paddingBottom : 15, color: '#00000073' }}>暂无数据</li> )
                        }
                     </ul>
                 </Col>
              </Row>
           )
      }
}


