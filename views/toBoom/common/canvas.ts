
import { TweenMax, Power2, TimelineLite } from "gsap/TweenMax";

// interface Option {
//     tooltip?: any;
//     data: object[];
//     // positions: object[];
//     clickAfter(value: object);
//     arrayCounter?: number;
//     floatLeftDraw?: any;
// }


// interface loopOption {
//     id: number; 
//     width: number;
//     height: number;
//     posX: number; 
//     posY: number;
//     images?: any;
//     storeImages: string[];
// }



export default class CanvasCloud {
    canvas: HTMLCanvasElement;
    context: any;
    postions: any;
    collectionData: object[];
    radius: any;
    devicePixelRatio: number;
    startTime: number;
    redraw: any;
    image?: string;
    isImageLoaded: boolean;
    positionArray: any[];
    option: any;
    photoW: any;
    photoH: any;
    // floatLeftDrawHandler: any;

    constructor(dom: HTMLCanvasElement) {
        this.canvas = dom;
        let w = this.canvas.width;
        let h = this.canvas.height;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.canvas.width = this.devicePixelRatio * w;
        this.canvas.height = this.devicePixelRatio * h;        
        this.context = this.canvas.getContext('2d');
        this.startTime = null;
        this.isImageLoaded = false;
        this.positionArray = [];
        this.option = {};
        // this.storeImages = [];
    }



    init(option) {   // : Option
        
        var objectLength = option.data.length;
        this.option = option;
        option.arrayCounter = 0;
        option.data = option.data.slice(0, 50);
        option.floatLeftDraw.active && this.floatLeftDrawHandler(option);
        option.data.map((data: { storeImages: string[]; arrayCounter: number}, index, array)=> {

            data.storeImages = [];
            for(let i in data) {
                // debugger;
                if(i != 'storeImages') {
                    data.storeImages = data.storeImages.concat(data[i][0]);
                    option.arrayCounter += 1;
                }
            
            }
            return data
        })
        this.imageLoader(option).then((data)=> {

            // debugger;
            console.log(this.isImageLoaded);
            this.collectionData = option.data.map((data, index)=> {
                while(objectLength > 0) {
                    objectLength--;
                    return { ...data, ...this.positionArray[index]};
                }  
            })
            // debugger;
            this.draw();
            !!option.clickAfter && this.clickListener(option);
            TweenMax.ticker.addEventListener("tick", this.animateRedraw, this);

        })
       
        // TweenMax.ticker.fps(5);

    }
   
    floatLeftDrawHandler(option) {
        
        var counterInColumn = option.floatLeftDraw.counterInColumn; 
            
        this.photoH = this.canvas.height / (option.floatLeftDraw.counterInColumn);
        
        //4:3的照片比例
        
        this.photoW = this.photoH * 3 / 4;

        this.positionArray = this.positionHandler(this.option.data, this.photoW);

        // console.log(this.positionArray);
    }
    positionHandler(data, from) {
        return data.map((current, index, array)=> {
            let _object = {} as any;
            _object.width = this.photoW; 
            _object.height = this.photoH;
            

            
            _object.posX = Math.ceil((index + 1) / this.option.floatLeftDraw.counterInColumn) * (this.photoW) - (this.photoW - from);

            _object.posY = index != 0 ? this.positionArray[index - 1].posY + this.positionArray[index - 1].height : 0;
            
            //超过一列的位置
            if(index != 0 && (index) % this.option.floatLeftDraw.counterInColumn == 0) {
              
                _object.posY = 0;
            }

            this.positionArray.push(_object)
           
            return _object;
        });
    }
    imageLoader(option) {
        /* 
         * 检查图片加载情况  
         */
        let _this = this;
        // let arrayLength = JSON.stringify(option.data).match(/png/gmi).length;
        // debugger;
        let arrayLength = option.arrayCounter;
        return new Promise((resolve)=> {
            option.data.forEach((current: any)=> {
                current.storeImages.forEach((image)=> {
                    var img = new Image();
                    img.src = image;
                    img.onload = function() {
                        arrayLength -= 1;
                        if(arrayLength <= 0) { 
                            _this.isImageLoaded = true 
                            resolve(_this.isImageLoaded);
                        };   
                    }  
                })
            });
        })
    }

    clickListener(option) {
        this.canvas.addEventListener("click", (e: any)=> {
            let BoundingClientRect = e.target.getBoundingClientRect();
            let clickX = (e.clientX - BoundingClientRect.left) * this.devicePixelRatio; 
            let clickY = (e.clientY - BoundingClientRect.top) * this.devicePixelRatio;
            // debugger;
            this.collectionData.forEach((data : any)=> { // : loopOption
                if(clickX >= data.posX && clickX < data.posX + data.width && clickY >= data.posY && clickY < data.height + data.posY) {
                    // alert(data.id);
                    // debugger;
                    option.clickAfter(data);   
                }
            })

        })
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();

        this.collectionData.forEach((data:any )=> {  // loopOption
           
            data.storeImages.forEach(element => {
                var image = new Image();
                image.src = element;
                this.context.drawImage(image, data.posX, data.posY, data.width, data.height);
    
            });

        })
    }

    animateRedraw(value) {
        var _this = this;
        this.startTime = value;
        // debugger;

        this.collectionData.forEach((data:any, index,  _array: any)=> {
            // data.posX -= 1;

            if(_array[_array.length - 1].posX + data.width <= this.canvas.width) {
                // debugger;
                // alert('最后一图向左移动')
                this.positionHandler(this.collectionData, 0);
            } else {
                data.posX -= 1;
            }
            
            // if(data.posX <= 0 - data.width) {
            //     // debugger;
            //     data.posX = index <= this.option.floatLeftDraw.counterInColumn ? _array[_array.length - 1].posX + data.width : this.canvas.width;
            //     // data.posX =  this.canvas.width;
            // }  else {
            //     data.posX -= 1;
            // }
        })
        _this.draw()
        // var tween = TweenMax.staggerFrom(this.collectionData, 1, {
        //         posX: 
        //         onUpdateParams: function(value) {
        //             debugger;
        //             // _this.draw()
        //     }
        // });

        // this.draw();

    }
}