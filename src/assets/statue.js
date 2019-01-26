//此文件存组件中的公共方法

// 工单列表的
// 工单状态
function status(status) {
    switch (status) {
        case 1:
            return "待确认"
            break;
        case 2:
            return "待指派"
            break;
        case 3:
            return "待接收"
            break;
        case 4:
            return "待处理"
            break;
        case 5:
            return "处理中"
            break;
        case 6:
            return "待验收"
            break;
        case 7:
            return "已完成"
            break;
        case 10:
            return "无效工单"
            break;
        case 11:
            return "无法解决"
            break;
    }
}
// 工单类型
function type(type) {
    switch (type) {
        case 1:
            return "咨询求助"
            break;
        case 2:
            return "报修"
            break;
        case 3:
            return "投诉建议"
            break;
    }
}
// 工单优先级
function priority(priority) {
    switch (priority) {
        case 1:
            return "无关紧要"
            break;
        case 3:
            return "低"
            break;
        case 5:
            return "中"
            break;
        case 7:
            return "高"
            break;
        case 9:
            return "紧急"
            break;
    }
}



// 工单严重程度
function importance(importance) {
    switch (importance) {
        case 2:
            return "建议"
            break;
        case 4:
            return "提示"
            break;
        case 6:
            return "一般"
            break;
        case 8:
            return "严重"
            break;
        case 10:
            return "致命"
            break;
    }
}

/**
 * tree 数据转换
 * @param  {Array} tree 待转换的 tree
 * @param  {Object} map  键值对映射
 * @return {Array}      转换后的 tree
 */
function convertTree(tree, map) {
    const result = []

    // 遍历 tree
    tree.forEach((item) => {
        // 读取 map 的键值映射
        const value = item[map.value]
        const label = item[map.label]
        let children = item[map.children]

        // 如果有子节点，递归
        if (children) {
            children = convertTree(children, map)
        }

        result.push({
            value,
            label,
            children
        })
    })

    return result
}
// 设备巡检保养
// 设备计划规则
function rule(rule) {
    switch (rule) {
        case 1:
            return "单次"
            break;
        case 2:
            return "循环"
            break;
    }
}
// 设备计划状态
function devicestatus(status) {
    switch (status) {
        case 1:
            return "新建"
            break;
        case 2:
            return "执行中"
            break;
        case 3:
            return "暂停中"
            break;
        case 4:
            return "终止"
            break;
    }
}
// 设备计划工作类型
function devicetype(type) {
    switch (type) {
        case 1:
            return "巡检"
            break;
        case 2:
            return "保养"
            break;
    }
}
// 设备任务状态
function taskstatus(status) {
    switch (status) {
        case 1:
            return "响应超时"
            break;
        case 2:
            return "待接收"
            break;
        case 3:
            return "处理中"
            break;
        case 4:
            return "任务完成"
            break;
        case 5:
            return "正常结束"
            break;
        case 6:
            return "任务超时"
            break;
        case 7:
            return "异常结束"
            break;
    }
}
// 识别json格式字符串
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (str.indexOf('{') > -1) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}
export { type, priority, importance, convertTree, rule, devicestatus, devicetype, taskstatus ,isJSON}
