<template>
    <div>
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
            <el-cascader :options="options" filterable change-on-select v-model="selectedOptions" @change="departmentChange" :show-all-levels="false" :props="props"></el-cascader>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级部门" class="menu-list__input" clearable></el-input>
    </div>
</template>
<script>
import {treeDataTranslate} from '@/utils';
export default {
    props: ['dataForm'],
    data() {
        return {
            options: [],
            selectedOptions: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
        };
    },
    methods: {
        init() {
            this.options = [];
            this.selectedOptions = [];
            this.getDepartment();
        },
        departmentChange(val) {
            this.dataForm.departmentId = val[val.length - 1];
            let vals = this.getCascaderObj(this.selectedOptions, this.options);
            this.dataForm.parentName = vals[vals.length - 1].departmentName;
        },
        // el-cascader  选择器change事件
        getCascaderObj(val, opt) {
            return val.map(function(value, index, array) {
                for (var itm of opt) {
                    if (itm.departmentId == value) {
                        opt = itm.children;
                        return itm;
                    }
                }
                return null;
            });
        },
        getDepartment() {
            this.$http({
                url: this.$http.adornUrl('/v1/user/departments'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.options = treeDataTranslate(data.data.departments, 'departmentId');
                }
            });
        },
    },
};
</script>
