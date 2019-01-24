// 拷贝对象
function copyObject(obj) { return JSON.parse(JSON.stringify(obj)) }

function createSignature() {
    // var timeStamp = (new Date()).getTime(),
    //     Range = timeStamp - 70,
    //     Rand = Math.random();
    // return (70 + Math.round(Rand * Range));
    var num = Math.floor(Math.random() * (500 - 1) + 1);
    return num
}




function _checkNormalType(value) {
    let _boolean = false;
    if (typeof value == 'number' || typeof value == 'string') {
        if (value != '' && value != -1 && value != undefined && value != null) _boolean = true;
    }
    return _boolean;
}


function _checkObject(obj) {
    let _boolean = false;
    for (let key in obj) {
        let value = obj[key];
        if (key != 'id') {
            if (value != '' && value != -1 && value != undefined && value != null) _boolean = true;
        }
    }
    return _boolean
}


function _checkArray(arr) {
    let _boolean = false;
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            let value = arr[i];
            if (typeof value == 'object') {
                _checkObject(value) ? _boolean = true : '';
            } else {
                _checkNormalType(value) ? _boolean = true : '';

            }

        }
    }

    return _boolean;
}



function _checkFolders(folders) {

    let _folders = [];
    if (folders instanceof Array) {
        for (let i = 0; i < folders.length; i++) {
            let item = folders[i]; // 数组的单个对象类型,如果item其中已被赋 
            let flag = false;
            for (let key in item) {
                let value = item[key];
                if (value instanceof Array && key != 'id') { // for Array
                    if (_checkArray(value) && flag == false) flag = true;
                } else if (value instanceof Object && key != 'id') { // for object
                    if (_checkObject(value) && flag == false) flag = true;
                } else if ((typeof value == 'string' || typeof value == 'number') && key != 'id') { // for string or number
                    if (_checkNormalType(value) && flag == false) flag = true;
                }

            }

            flag ? _folders.push(item) : '';
        }
    }

    return _folders

}


function isEmptyFields(folders) { return _checkFolders(folders) }



function filterFn(fieldsValue) {
    let newFieldsValue = {};
    for (let _key in fieldsValue) { newFieldsValue[_key] = fieldsValue[_key] }
    newFieldsValue.folders = _checkFolders(fieldsValue.folders)
    return newFieldsValue;

}




// 检查数据是否被赋值
function dataBeModified(fieldsValue) {
    let _fieldsValue = filterFn(fieldsValue),
        newFieldValue = {},
        flag = 0;
    for (let key in _fieldsValue) {
        if (_fieldsValue[key] instanceof Array) {
            _fieldsValue[key].length > 0 ? (newFieldValue[key] = _fieldsValue[key], flag++) : '';
        } else if (_fieldsValue[key] instanceof Object) {
            let _values = _fieldsValue[key],
                f = false;
            for (let k in _values) { Boolean(_values[k]) ? f = true : ''; }
            f ? (newFieldValue[key] = _fieldsValue[key], flag++) : '';
        } else {
            Boolean(_fieldsValue[key]) ? (newFieldValue[key] = _fieldsValue[key], flag++) : '';
        }
    }
    return flag > 0 ? newFieldValue : false;
}




const tools = { dataBeModified, copyObject, createSignature, isEmptyFields };

export default tools;