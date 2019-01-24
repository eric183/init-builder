import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { computed, autorun } from 'mobx';
import { Menu, Icon } from 'antd';
/**
 * 
 * 待优化
 * @class Nav
 * @extends {React.Component}
 */
@observer class Nav extends React.Component {
 
    constructor() {
        super();
        this.selectHandler = this.selectHandler.bind(this);
    }
    // state = {
    //     current: ['/setting-right/setting-platform/template']
    // }
    iconFontHandler(data, buildJS) {
        if(!buildJS) return;
        for(let i in buildJS.navIcon) {
            if (data == buildJS.navIcon[i]) {
                return i;
            }
        }
    }
    // @computed get navTem(){ 
        
    //     return this.props.store.globalInfo.menu.map((data, index)=> {
    //         var classList = new RegExp("^"+ data.url.replace(/(\/[a-z]+)\/.+/gmi, '$1')).test(this.props.store.indexInfo.location.pathname) ? 'mdl-navigation__link remove-link nav-active' : 'mdl-navigation__link remove-link';
    //         return (
    //             <li key={index} className="nav-li">
    //                 <Link className={classList} to={data.url || '/'}>
    //                     <i className={`iconfont ${this.iconFontHandler(data.label)}`}></i>{data.label}
    //                 </Link>   
    //                 <div className="second-level-nav" style={{display: new RegExp(data.url.replace(/(\/[a-z]+)\/.+/gmi, '$1')).test(this.props.store.indexInfo.location.pathname) ? 'block' : 'none'}}>
    //                     <header>{data.label}</header>
    //                     <ul>
    //                         {
    //                             data.items && data.items.map((secondData, secondIndex)=> {
    //                                 //  console.log(new RegExp(secondData.url))
    //                                 // console.log(data.url)
    //                                 // console.log(new RegExp(data.url).test(this.props.store.indexInfo.location.pathname))
    //                                 //  console.log(window.location.hash.replace('#','/'))
    //                                 // console.log(secondData.url.replace(/\?.+/gmi,''))
    //                                 // /shop/pic-management?page_index=3&page_size=12

    //                                 return (
    //                                     <li key={secondIndex}>
    //                                         <Link className={window.location.hash.replace('#','/').replace(/\?.+/gmi,'') == secondData.url ? 'mdl-navigation__link remove-link nav-child-active' : 'mdl-navigation__link remove-link'} to={secondData.url} key={index}>{secondData.label}</Link>            
    //                                     </li>     
    //                                 )
    //                             })
    //                         }
    //                     </ul>
    //                 </div>
    //             </li>
    //         )
    //     });
    // }
    flowMap(datas, icon) {
        return datas.map((data, index)=> {
            if(!data.children || data.children.length == 0) {
                return (
                    <Menu.Item key={data.link} data={data}>
                    {/* iconfont */}
                        <Icon type={`${this.iconFontHandler(data.title, icon)}`} />
                        <span>{data.title}</span>
                    </Menu.Item>
                )
            } else {
                // return this.flowMap(data.items)
                return (
                    <Menu.SubMenu 
                        key={data.link} 
                        // key={data.link ? data.link : data.title + index} 
                        title={
                            <span>
                                <Icon type={`${this.iconFontHandler(data.title, icon)}`} />
                                <span>{data.title}</span>
                            </span>}>
                            {
                                data.children ? this.flowMap(data.children, icon) : (
                                    <Menu.Item key={data.link} data={data}>
                                        <span>{data.title}</span>
                                    </Menu.Item>
                                ) 
                            }
                    </Menu.SubMenu>
                )
            }
        })
    }
    selectHandler({item, key, selectedKeys}) {
        // console.log(key);
        // debugger;
        location.hash = item.props.data.link
        // this.props.history.push(item.props.data.link);
    }
   
    componentDidMount() { }

    
    render() {
      
        var path = this.props.location.pathname.split('/');

        if(this.props.collapsed) {
            path = ["1", "2"]
        } else {

            if(path.length > 1) {
                // debugger;
                // path = path.slice(1).map(data=> `/${data}`);
                path = path.length == 4 ? [`/${path[1]}`, `/${path[1]}/${path[2]}`] : [`/${path[1]}`];
            } else {
                path = [``]
            }
        }
        console.log(path);
        // var path = /(\/[A-Za-z_]+)(\/[A-Za-z_]+)/.exec(this.props.location.pathname);
        
        
        return (
            <nav className="mdl-navigation">
                {/* <div className="welcome-ico" style={{backgroundImage: 'url("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWIxZGViNTUtYTQwZC0wMjQ1LThkNjktOTNmZGI1ZWI2NDA0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0RDI5NzMwQkFCQTExRTZCNTcyQjZCQTBFOTc5RjI1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0RDI5NzJGQkFCQTExRTZCNTcyQjZCQTBFOTc5RjI1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjViMWRlYjU1LWE0MGQtMDI0NS04ZDY5LTkzZmRiNWViNjQwNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1YjFkZWI1NS1hNDBkLTAyNDUtOGQ2OS05M2ZkYjVlYjY0MDQiLz4gPC9yZGY6RGVzY3JpcHRpb24+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")'}}></div> */}
                
                <Menu 
                    theme="dark" 
                    mode="inline" 
                    // onOpenChange={(data)=>{debugger}}
                    defaultOpenKeys={path}
                    defaultSelectedKeys={[this.props.location.pathname]}
                    // selectedKeys={[this.state.current]}
                    onSelect={this.selectHandler}>
                    {
                        this.flowMap(this.props.productObject.devNav, this.props.productObject)
                        // this.props.productObject.devNav.map((data, index)=> (
                        //     <Menu.Item key={data.url} data={data}>
                        //     {/* iconfont */}
                        //         <Icon type={`${this.iconFontHandler(data.label, this.props.productObject)}`} />
                        //         <span>{data.label}</span>
                        //     </Menu.Item>
                        // ))
                    }
                </Menu>
            </nav>
        )
    }
}

export default Nav;