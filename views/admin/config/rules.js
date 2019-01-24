export default {
    "navIcon": {
        "home": "资料录入",
        "shangpin": "商品",
        "form": "订单",
        "bags": "采购",
        "jifen": "仓库",
        "set": "设置"
    },
    "devNav": [

        // {
        //     "title": "首页推荐管理",
        //     "link": "/setting/recommendation_manager"
        // },
        // {
        //     "title": "流行解读管理",
        //     "link": "/setting/popular_manager"
        // },


        // {
        //     "title": "图片管理",
        //     "link": "/setting/album_manager"
        // }, 

        // {
        //     "title": "用户管理",
        //     "link": "/setting/user"
        // },
        // {
        //     "title": "级联管理",
        //     "link": "/setting/jointor"
        // },


        // {
        //     "title": "推荐管理",
        //     "link": "/setting/recommend_list"
        // },


        // {
        //     "title": "通知模板管理",
        //     "link": "/notice/notice_template"
        // },
        // {
        //     "title": "平台设置",
        //     "link": "/setting-platform/more"
        // },




        // {
        //     "title": "标签组",
        //     "link": "/setting/label_group"
        // },
        // {
        //     "title": "标签字典",
        //     "link": "/setting/group_dics"
        // },



        // {
        //     "title": "标签",
        //     "link": "/setting/label"
        // },
        // {
        //     "title": "栏目管理",
        //     "link": "/setting-platform/column"
        // },
        // {
        //     "title": "测试",
        //     "link": "/test"
        // },
        {
            "title": "标签管理",
            "link": "/setting",
            "children": [{
                "title": "标签库",
                "link": "/setting/tag-stock"
            }, {
                "title": "标签组",
                "link": "/setting/tag-group"
            }, {
                "title": "公共字段",
                "link": "/setting/tag-public-field"
            }]
        },
        {
            "title": "首页推荐",
            "link": "/setting/homepage"
        },
        {
            "title": "素材库",
            "link": "/setting/materiallib"
        },
        {
            "title": "流行解读",
            "link": "/setting/fashion_analysis"
        },

        {
            "title": "权限管理",
            "link": "/power_manegement",
            "children": [{
                    "title": "节点设置",
                    "link": "/power_manegement/power",
                },
                {
                    "title": "角色设置",
                    "link": "/power_manegement/role"
                },
                {
                    "title": "部门设置",
                    "link": "/power_manegement/depart"
                },
                {
                    "title": "账号设置",
                    "link": "/power_manegement/account"
                }
            ]
        },
        {
            "title": "菜单管理",
            "link": "/menu_management",
            "children": [{
                "title": "菜单组管理",
                "link": "/menu_management/group",
            }]
        },


        // {
        //     "title": "拖拽",
        //     "link": "/drag"
        // }
    ]
}