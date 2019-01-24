import * as React from 'react';
import {createPortal} from 'react-dom';

import {Route, Link, withRouter, Switch} from 'react-router-dom';
import { Layout } from 'antd';

import {observer, match} from 'mobx-react';
import RouteComponents from '../ComponentCollection';
// import RouteComponent from '../config/routesDirective';
import RouteArray from '../routes/routes'; 

RouteArray.push({
    "module": "Error"
});

/**
 *
 *
 * @class ActiveComponent
 * @extends {React.Component}
 */

@observer class ActiveComponent extends React.Component {

    componentDidMount() {}
    componentWillReceiveProps() {}
    render() {
        return (
            // <RouteComponent {...this.props}/>
            // <Layout.Content className="common-content">
                <Switch>
                    {
                        RouteArray.map((route, index)=> (
                                // {route.path} 
                            route.path ? 
                                <Route 
                                    key={index} 
                                    path={route.path} 
                                    // context={this.props.productObject}
                                    exact={route.exact ? true : false}
                                    strict={route.strict ? true : false}
                                    sensitive={route.sensitive ? true : false}
                                    // component={RouteComponents[route.module]}
                                    render={(context)=> {
                                        var Save = RouteComponents[route.module];
                                        return (
                                            <Save {...this.props} {...context} />
                                        )
                                    }}/> : 
                                <Route 
                                    key={index} 
                                    // component={RouteComponents[route.module]} 
                                    // context={this.props.productObject} 
                                    render={(context)=> {
                                        var Save = RouteComponents[route.module];
                                        return (
                                            <Save {...this.props} {...context} />
                                        )
                                    }}/>
                                // : <Route key={index} exact path={route.path} component={RouteComponents[route.module]} />
                            )
                        )
                    }
                </Switch>
            // </Layout.Content >
        )
    }
}

export default ActiveComponent;