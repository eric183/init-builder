<template>
    <el-form label-width="100px">
        <el-form-item label="执行人" class="margin_top_20">
            <div style="position:relative">
                <el-cascader
                    expand-trigger="click"
                    :show-all-levels="false"
                    placeholder="请选择部门"
                    change-on-select
                    v-model="departmentName"
                    :options="departments"
                    @change="setDepartmentName"
                    :props="props"
                >
                </el-cascader>
                <el-select v-model="realName" placeholder="请选择执行人" @change="setRealName">
                    <el-option v-for="(leader, index) in leaders" :key="index" :label="leader.realName" :value="leader.userId"></el-option>
                </el-select>
                <span class="tip2">*</span>
            </div>
        </el-form-item>
        <el-form-item label="负责人" class="margin_top_20" v-if="formData.managerDepartmentName">
            <div style="position:relative">
                <el-input placeholder="负责人" v-model="managerName" disabled style="width:205px;"></el-input>
                <span class="tip2">*</span>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: ['formData'],
    data() {
        return {
            departments: [],
            departmentName: [],
            realName: '',
            managerName: '',
            managerDepartmentName: [],
            leaders: [],
            managerleaders: [],
            props: {
                value: 'departmentId',
                children: 'children',
                label: 'departmentName',
            },
        };
    },
    methods: {
        clearLabelText() {
            this.realName = '';
            this.departmentName = [];
            this.managerName = '';
            this.managerDepartmentName = [];
        },
        setRealName(val) {
            // console.log(this.leaders)
            this.leaders.map(obj => {
                if (obj.userId == this.realName) {
                    this.formData.realName = obj.realName;
                    this.formData.executorName = obj.realName;
                }
            });
            this.formData.executor = val;
        },
        setDepartmentName(val) {
            this.getPersonList(val);
            let getFunc = arr => {
                arr.map(obj => {
                    if (obj.departmentId == val[val.length - 1]) {
                        this.formData.departmentName = obj.departmentName;
                        this.formData.managerDepartmentName = obj.departmentName;
                    } else {
                        obj['children'] && getFunc(obj['children']);
                    }
                });
            };
            getFunc(this.departments);
        },
        getDepartment() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments'),
                method: 'get',
            }).then(({data}) => {
                this.departments = data && data.code === 200 ? data.data.departments : [];
                let clearFunc = arr => {
                    arr.map(obj => {
                        if (!obj.children.length) {
                            delete obj['children'];
                        } else {
                            clearFunc(obj['children']);
                        }
                    });
                };
                clearFunc(data.data.departments);
            });
        },
        // 得到执行人列表
        getPersonList(val) {
            this.realName = '';
            this.leaders = [];
            this.managerName = '';
            this.formData.manager='';
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments/' + val[val.length - 1] + '/users/options'),
                method: 'get',
            }).then(({data}) => {
                this.leaders = data && data.code === 200 ? data.data.options : [];
                this.formData.leaders = this.leaders;
                this.leaders.map(user => {
                    if (user.isDuty) {
                        this.managerName = user.realName;
                        this.formData.managerName = user.realName;
                        this.formData.manager = user.userId;
                    }
                });
            });
        }
    },
    mounted() {
        this.getDepartment();
    },
};
</script>

<style lang="scss" scoped>
.tip2 {
    position: absolute;
    left: -64px;
    top: 4px;
    color: #f56c6c;
}
</style>
