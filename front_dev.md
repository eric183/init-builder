#前端规范
    
前端代码使用es6，webpack + babeljs处理，模块拆分、力求低耦合开发，兼容IE10，样式采用babel-postcss-loader编译sass, 其他待补充

#已有项目

* 矢量图前台 http://localhost:3790/toBoom

* 矢量图后台 http://localhost:3790/admin

* ts-loader测试工具 http://localhost:3790/ts

##路由载入

    ./route/routes.js

##页面组件载入

    ./PageCollection.js

##组件路径

    ./pages/**/*.jsx

##样式路径

    ./styles/**/*.scss

##Icon

    ./config/rules.json
    
##其他需注意事项

* 所有异步请求默认使用aiox库，其它库须自行添加

* 字体默认使用阿里矢量图iconfont.cn的anticon官方字体， 其他字体须自行添加

* 静态文件需载入php_app指定根路径下的静态文件，前端不做处理

##三方库类

* fabric: 操作canvas库

* masonry: 瀑布流布局库


##Any other tricks

* this.props.util.setQsInfo操作hash状态， 例：       
    
```javascript 
this.props.history.push('/setting-right/staff?' + this.props.util.setQsInfo({page:2})
```

<!-- 2. setting_platform -->

* 通用处理antd导致的声明周期钩子调用BUG Begin

```javascript 
var preLocation = this.props.location;
if(preLocation.pathname + preLocation.search == props.location.pathname + props.location.search) return;
``` 