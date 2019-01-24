import React , { Component } from 'react';
import { Row, Col, Select, Input, Divider, Button, TreeSelect  } from 'antd';
const  Option = Select.Option;
const TextArea = Input.TextArea;

const TreeNode = TreeSelect.TreeNode;


const treeData = [
    
    {
    "key": 23,
    "value":"5",
    "label": "上衣",
    "children": [{
        "key": 24,
        "value":"55_969",
        "label": "POLO衫",
        "children": [{
            "key": 25,
            "value":"555",
            "label": "橄榄球衫",
            "children": []
        }, {
            "key": 26,
            "value":"5555",
            "label": "拉链Polo衫",
            "children": []
        }, {
            "key": 27,
            "value":"566",
            "label": "收腰Polo衫",
            "children": []
        }]
    }, {
        "key": 28,
        "value":"514",
        "label": "衬衫",
        "children": [{
            "key": 29,
            "value":"235",
            "label": "开领衬衫",
            "children": []
        }, {
            "key": 30,
            "value":"533",
            "label": "围裹式衬衫",
            "children": []
        }, {
            "key": 31,
            "value":"156",
            "label": "腰部系结衬衫",
            "children": []
        }, {
            "key": 32,
            "value":"851",
            "label": "西部衬衫",
            "children": []
        }, {
            "key": 33,
            "value":"25",
            "label": "肩章衬衫",
            "children": []
        }, {
            "key": 34,
            "value":"54",
            "label": "水手衫",
            "children": []
        }, {
            "key": 35,
            "value":"35-51",
            "label": "立领衬衫",
            "children": []
        }, {
            "key": 36,
            "value":"54",
            "label": "宽底摆衬衫",
            "children": []
        }, {
            "key": 37,
            "value":"55",
            "label": "束带式衬衫",
            "children": []
        }, {
            "key": 38,
            "value":"58",
            "label": "套头衬衫",
            "children": []
        }]
    }]
   }
];


export default class ItemComponent extends Component {
         constructor(props){ 
              super(props);
              this.state = {
                    name : '',
                    id : '',
                    type : false,
                    value_treeSelect : undefined
              }
          }

     onChange_treeSelectt = (value, label, extra) => {
          console.log(value);
          console.log(label);
          console.log(extra);
          this.setState({ value_treeSelect : value });
     }
  
      render(){
           const selectorStyle = {
                  width : '130px',
                  marginRight : '10px'
           };
           return (
              <div className="popular-item">
                 <Row>
                   <Col span={1}>{ (this.props.index + 1) }</Col>
                    <Col span={10}>

                         {
                            this.state.type ? (
                                <span className="popular-item-panel">
                                     <Input style={{display : 'inline-block', width : '200px'}} />
                                      <Button onClick={ this.props.openRadioList }  style={{ border : 'none', textDecoration : 'underline', margin : '0 10px' }}>展开选择</Button>
                                      <label><Input style={{display : 'inline-block', width : '80px'}} /> % </label>
                                 </span>
                            ) : (
                                <span className="popular-item-panel">

                               <TreeSelect
                                        style={{ width: 300, marginRight : '15px' }}
                                        value={this.state.value_treeSelect}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={treeData}
                                        placeholder="请选择等级"
                                        treeDefaultExpandAll={false}
                                        allowClear
                                        showSearch={true}
                                        searchPlaceholder="请输入文字！"
                                        onSearch={ (value) => {  } }
                                        onChange={this.onChange_treeSelectt}
                                    />

                               <label><Input style={{display : 'inline-block', width : '80px'}} /> % </label>
                             </span>
                            )
                         }
                         <TextArea rows={ 4 } style={{ width : '75%', resize : 'none' }}  />
                     </Col>
                    <Col span={4}> 
                      <figure>
                       <img onClick={ this.props.openselector } src="https://b-ssl.duitang.com/uploads/item/201508/20/20150820200416_z2h58.thumb.700_0.jpeg" alt=""/>
                      </figure>
                    </Col>
                    <Divider />
                 </Row>
               </div>
           )
      }


}



