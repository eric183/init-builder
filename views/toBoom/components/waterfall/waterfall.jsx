import React, { Component } from 'react';
import axios from 'axios';
import { Modal } from '@/components/modal';




/*
*@wId  滚动父元素 id 或 node 
*@sId  滚动元素 id 或 node 
*@loadingCallback 滚动回调函数
*/
 
 export var ScrollingLoad = {
      wrapperNode : null,
      scrollNode : null,
      scrollHanadler : undefined,
      throttle : function(func, wait) {
        let time, context
        return function(){
            context = this
            if(!time){
                time = setTimeout(function(){
                      func.apply(context, arguments)
                      time = null
                }, wait)
            }

        }

    },
     execute : function( wNode , sNode , loadingCallback = function(){  }){
             this.wrapperNode =  wNode instanceof Object ? wNode : document.getElementById( wNode );
             this.scrollNode =   sNode instanceof Object ? sNode : document.getElementById( sNode );  

             this.scrollHanadler = this.throttle(function(){
                                        let wHeight = this.wrapperNode.offsetHeight;
                                        let scrollHeight = this.getScrollTop();
                                        let sHeight = this.getClientHeight ();
                                        let sum = wHeight + scrollHeight;
                                   if( sum >= sHeight ){  // 加载数据
                                         loadingCallback(); 
                                   }

                            }.bind(this),300)


       this.wrapperNode.addEventListener('scroll',this.scrollHanadler);
 
                        
      },

      destroy : function(){
        this.wrapperNode.removeEventListener('scroll',this.scrollHanadler);
            this.wrapperNode = null;
            this.scrollNode = null;
            this.scrollHanadler = undefined;
      },


    getScrollTop : function () {  //获取滚动条当前的位置
          return  Math.floor( this.wrapperNode.scrollTop )
    },

   
    getClientHeight : function() {  //获取当前可视范围的高度  
              return this.scrollNode.offsetHeight;
            }
      

};





/*
* ******* WaterFallLayout 已经无用，作废 2018-11-20 ************
*@columnSize [number] 定义一列几行  【 写死 3 或 4 行 】
*@source  [ array ] 原数据
*@page  [ number ] 指定位于原数据的索引 index
*/

export class WaterFallLayout {
    constructor( size = 4 ){
       this.source = [];
       this.dataLen = 0;
       this.columnSize = size;
       this.sizes = size == 4 ?  [ 610,410,310,410 ] : [ 410, 310, 410 ] ;  /*  !!! 多加的 10 个像素是 元素之间的 margin !!!  */ 
       this.averageArray = [];
      
    }

    processData( source = [] ){
       if( source instanceof Array && ( source.length > this.columnSize ) ){

              this.dataLen = source.length;

               this.source = source.concat();

              return  this.calculateAverage().calculate();

       }else{

             return this.lessThan( source )

       }

 
   }

   lessThan( source ){ 

        let data = [];

        for(let i = 0; i < this.columnSize; i++){

             if( source[i] ){

               data[i] = [ source[i] ];

             }else{

               data[i] = [];  

             }
     }
     return data
   }


   
    calculateAverage(){
        var perAve = Math.floor( this.dataLen / this.columnSize );
         var len = this.sizes.length;

               for(var index = 0; index < len; index++){
                       if( (index + 1) != len ){
                           this.averageArray.push({
                               height : this.sizes[index],
                               sum : Math.floor( perAve  * this.sizes[index]   ),
                               index : index,
                               columnsize : perAve
                           })
                       }else{
                         
                       var perave = this.dataLen - ( index * perAve );

                            this.averageArray.push({
                               height : this.sizes[index],
                               sum : Math.floor( perave *  this.sizes[index]   ),
                               index : index,
                               columnsize : perave
                           })
                                                   
                       }
               }

        return this;
       
    }   




    calculate(){

       var index = 0;
       var time = this.dataLen < 100 ? 10 : Math.ceil( this.dataLen / 10 ); 

       while( index < time ){
   
             index++;
 
             var minItem = this.getMinItem();
             var maxItem = this.getMaxItem();
         
            this.calculteItem(minItem, maxItem);

         }


       var imageListSource = [];

        this.averageArray.forEach(( item, index ) => {
               imageListSource[index] = this.source.splice(0, item.columnsize );
        });

        this.averageArray = [];  // 必须清空

         return imageListSource
     
     }

     calculteItem ( minItem, maxItem ){

       var maxHeight = maxItem.sum,
           
           minHeight = minItem.sum,
           
           gap = maxHeight - minHeight,
           
           rato = minItem.height / maxItem.height;
       
        if( gap > 410 ){
    
              var num = Math.ceil(( gap / 2 / minItem.height ) * rato );
                     maxItem.columnsize -= num;
                     minItem.columnsize += num;
                     maxItem.sum = maxItem.height * maxItem.columnsize;
                     minItem.sum = minItem.height * minItem.columnsize;
                this.averageArray[ maxItem.index ] = maxItem
                this.averageArray[ minItem.index ] = minItem;
          
              
          }
  
     }

    
    getMinItem(){
       var  averageArray = this.averageArray;
       var min = averageArray[0];

       averageArray.forEach((item,index) => {
             if( item.sum < min.sum  ) min = item;

        });
 
     return min
  }
 
  
   
getMaxItem(){
      var  averageArray = this.averageArray;
     var max = averageArray[0];
  
     averageArray.forEach((item,index) => {
       
         if (item.sum > max.sum ){ 
                max = item
           }   
    });
    return max
    }
 
 

}






export function HintComponent(props){
        // 数据加载中..., 已到底部...  暂无数据
        var text = '暂无款式';
        var { source,isLoading, noMore, style = {} } = props,
               sourceLen = 0;
               source.forEach((item,index,arr)=> {  sourceLen += item.length  });
        if( sourceLen <= 0 && isLoading == false &&  noMore == false ) text = '暂无款式';
        if( sourceLen > 0 && isLoading == false &&  noMore == false  ) text = '';
        if( isLoading ) text = '数据加载中...'; 
        if( sourceLen <= 0 && noMore == true ) text = '暂无款式';
        if( sourceLen > 0 && noMore == true ) text = '已到底部...';

        return (
             <div  style={ style } className="hintComponent" > { text } </div>
        ) 
}



 



    // 下载请求
    // 202：参数异常
    // 200：获取成功
    // 410：未找到资料
    // 406：打包失败
    // 402：请稍等
    // 只有状态为402才需求继续请求，其它状态都是最终状态了
    export class DownLoadmethods {
        
        constructor() {

            this.sourceInstance = null;
            this.externalCallback = null ;// 外部回调

        }

        break_off() {
            this.sourceInstance.cancel('中断请求...')
            this.sourceInstance = null;
        }
        async requestForID(p = {}) { // 素材id组
            console.log('请求下载ID');
            this.sourceInstance = axios.CancelToken.source();
            let resp = await axios({
                method : 'post',
                url : '/api/toboom/finished/batch-downloads',
                cancelToken: this.sourceInstance.token,
                data: p 
            });

            // 限制下载 407 状态
            if( resp.data.status_code == 407) {  
                return Promise.resolve( resp )
            }else{
                return resp; 

            }

            
        }



        async requestForUrl(param) { // 用获取到的id 去请求 七牛
            this.sourceInstance = axios.CancelToken.source();
            let resp = await axios({
                  method : 'get',
                  url : '/api/toboom/qiniu-notify/get-zip-status',
                  cancelToken: this.sourceInstance.token,
                  params: param
            });
            return resp
        }

        pollingHandler(param) {

            let resp = this.requestForUrl(param);

            resp.then((respon) => {
                    var data = respon.data;
                    if ( data.status_code == 402 || data.status_code == 203 ) {
                        console.log('执行2');
                        setTimeout(() => {  this.pollingHandler(param)   }, 2000); 
                    } else { // 请求七牛成功
                        
                        this.externalCallback( data );

                    }
                })
                .catch((error) => { // 中断请求触发
                      this.externalCallback(error)
                })

        }
        
        async fireRequestAction(p , externalCallback = function(){}, limitFn = function(){} ) {  
            this.externalCallback = externalCallback;
            let result = await this.requestForID(p),
                data = result.data;

               if( data.status_code == 407  ){
                         limitFn(  data  );  
               }else if (data.status_code == 200) {
                  this.pollingHandler({ zipid : data.data });
            }

        }

    }
