import React from 'react';
import { Layout } from 'antd';

export default class Account extends React.Component {
    render() {
        var _this = this;
        var departmentListData = [
            {
                department:[],
                department_id: "1",
                department_name: "线上渠道",
                department_parent_id: "0",
                department_sort: "1",
                department_type: "1",
                wow_id: "0"
            }, {
                department_id: "2",
                department_name: "线下渠道",
                department_parent_id: "0",
                department_sort: "2",
                department_type: "1",
                wow_id: "0",
                department: [{
                    department_id: "3",
                    department_name: "南油市场",
                    department_parent_id: "2",
                    department_sort: "1",
                    department_type: "2",
                    wow_id: "0"
                }]
            }
        ]
        function departmentList(props) {
            if(!(props instanceof Array)) return
            // return props.map((data, index)=> {
            //     return (
            //         <li key={data.department_id}>
            //             {data.department_name}
            //             {
            //                 <ul>                                                                                                                                                                                                                                                                                                                                                                
            //                     {bar(data.department)}
            //                 </ul>    
            //             }
            //         </li>
            //     )
            // })
            return (
                <ul className="department-ul">
                    {
                        props.map((data, index)=> {
                            return (
                                <li key={data.department_id} className="clearfix" data-is-open="false">
                                    <section className="clearfix">
                                        <span style={{cursor: "pointer"}}>
                                            <i className="iconfont icon-triangle-left"></i>{data.department_name}
                                        </span>
                                        <div>
                                            <a href="javascript:void(0)" >删除</a>
                                            <a href="javascript:void(0)" >编辑</a>
                                            <a style={{visibility: !data.department ? 'hidden': 'visible' }} href="javascript:void(0)" >新增子部门</a>
                                        </div>
                                    </section>
                                   
                                    {departmentList(data.department)}
                                </li>
                            )
                        })
                    }
                </ul>
            )
        }
        return (
            <Layout.Content className="common-content department-content">
                部门

                {departmentList(departmentListData)}

            </Layout.Content>
        )
    }
}