<template>
    <div class="plain">
        <!-- 计划编辑页面 -->
        <p class="title">编辑计划:</p>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="160px" size="small">
            <div class="popr">
                <div class="box">
                    <el-form-item label="计划名称" prop="name"> <el-input v-model="dataForm.name" placeholder="计划名称"></el-input> </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="工作类别" size="mini" prop="type">
                        <el-select v-model="dataForm.type" placeholder="请选择"> <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                    </el-form-item>
                </div>
                <div class="box"></div>
            </div>
            <div class="popr">
                <div class="box">
                    <el-form-item label="计划开始时间" size="mini" prop="startTime">
                        <el-date-picker v-model="dataForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="计划结束时间" size="mini" prop="endTime">
                        <el-date-picker v-model="dataForm.endTime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="box"></div>
            </div>
            <div class="popr">
                <div class="box">
                    <el-form-item label="首次任务执行开始时间" size="mini" prop="firstExecuteTime">
                        <el-date-picker v-model="dataForm.firstExecuteTime" value-format="yyyy-MM-dd HH:mm:00" format="yyyy-MM-dd HH:mm" type="datetime" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="任务响应超时时间" size="mini" prop="responseTimeout">
                        <el-input v-model="dataForm.responseTimeout" placeholder="任务响应超时时间">
                            <template slot="append"
                                >分钟</template
                            >
                        </el-input>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="任务处理超时时间" size="mini" prop="handleTimeout">
                        <el-input v-model="dataForm.handleTimeout" placeholder="任务处理超时时间">
                            <template slot="append"
                                >分钟</template
                            >
                        </el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="box">
                    <el-form-item label="计划规则" size="mini" prop="rule">
                        <el-select v-model="dataForm.rule" placeholder="请选择"> <el-option v-for="item in ruleList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                    </el-form-item>
                </div>
                <div class="box rule_box">
                    <el-form-item label="计划周期" size="mini" prop="cycle" v-if="dataForm.rule == 2">
                        <el-radio-group v-model="dataForm.cycle">
                            <el-radio :label="item.value" v-for="(item, index) in cycleList" :key="index">{{ item.label }}</el-radio>
                        </el-radio-group>
                        <el-input v-show="dataForm.cycle == 1" v-model="dataForm.cycleUnit" placeholder="1-24之间">
                            <template slot="append"
                                >小时</template
                            >
                        </el-input>
                    </el-form-item>
                </div>
            </div>
            <div class="popr">
                <div class="box">
                    <el-form-item label="责任人">
                        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click">
                            <el-cascader :options="options" filterable change-on-select v-model="selectedOptions" :show-all-levels="false" @change="managerChange" :props="props"></el-cascader>
                        </el-popover>
                        <el-input v-model="dataForm.managerDept" v-popover:menuListPopover :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input>
                        <el-popover ref="personPopover" placement="bottom-start" trigger="click">
                            <el-select class="mt10" v-model="dataForm.manager" placeholder="请选择人员" @change="personChange">
                                <el-option v-for="item in userList" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                            </el-select>
                        </el-popover>
                        <el-input v-model="dataForm.managerName" v-popover:personPopover :readonly="true" placeholder="点击选择人员" class="menu-list__input"></el-input>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="执行人">
                        <el-popover ref="menuListPopover2" placement="bottom-start" trigger="click">
                            <el-cascader :options="options" filterable change-on-select v-model="selectedOptions2" :show-all-levels="false" @change="executorChange" :props="props"></el-cascader>
                        </el-popover>
                        <el-input v-model="dataForm.executorDept" v-popover:menuListPopover2 :readonly="true" placeholder="点击选择部门" class="menu-list__input"></el-input>
                        <el-popover ref="popover" placement="bottom-start" trigger="click">
                            <el-select class="mt10" v-model="dataForm.executor" placeholder="请选择人员" @change="personChange2">
                                <el-option v-for="item in userList2" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                            </el-select>
                        </el-popover>
                        <el-input v-model="dataForm.executorName" v-popover:popover :readonly="true" placeholder="点击选择人员" class="menu-list__input"></el-input>
                    </el-form-item>
                </div>
                <div class="box"></div>
            </div>
            <el-form-item label="备注" size="mini" prop="gender"> <el-input v-model="dataForm.remark" type="textarea"></el-input> </el-form-item>
        </el-form>
        <p class="device_title">
            <span>设备信息:</span>
            <el-button size="mini" type="primary" @click="deviceSelect">选择设备</el-button>
        </p>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="设备编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column prop="model" header-align="center" align="center" label="规格型号"> </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="安装楼层"> </el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="具体位置"> </el-table-column>
            <el-table-column header-align="center" align="center" width="240" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="info(scope.row.deviceId)">详情</el-button>
                    <el-button type="success" plain size="mini" @click="dele(scope.row.deviceId)">删除</el-button>
                    <el-button type="success" plain size="mini" @click="test(scope.row.refId)">检测项</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btn_box">
            <el-button size="small" @click="$router.go(-1)">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>
        <!-- 弹窗-选择设备 device-select-update -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataInfo"></add-or-update>
        <!-- 弹窗-检测项 -->
        <textList v-if="textVisible" ref="text"></textList>
    </div>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import AddOrUpdate from './device-select-update';
import textList from './text-list';
export default {
    data() {
        return {
            dataList: [], //设备列表的数据
            deviceId: null, //当前点击检查项的设备id
            devices: [], //设备与检查项关联的数组--传给后端的
            groupInfo: {}, //设备详情
            planId: '', //计划id
            dataForm: {
                name: '',
                startTime: '',
                endTime: '',
                handleTimeout: '',
                firstExecuteTime: '',
                responseTimeout: '',
                type: '',
                rule: '',
                cycle: '',
                cycleUnit: null,
                manager: '',
                executor: '',
                remark: '',
            },
            addOrUpdateVisible: false,
            textVisible: false,
            // 计划执行周期下拉循环
            cycleList: [
                {value: 1, label: '小时'},
                {value: 2, label: '日'},
                {value: 3, label: '周'},
                {value: 4, label: '半月度'},
                {value: 5, label: '月'},
                {value: 6, label: '季'},
                {value: 7, label: '半年度'},
                {value: 8, label: '年'},
            ],
            typelist: [{value: 1, label: '巡检'}, {value: 2, label: '保养'}],
            // 计划规则
            ruleList: [{value: 1, label: '单次'}, {value: 2, label: '循环'}],
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
            selectedOptions: [],
            selectedOptions2: [],
            userList: [],
            userList2: [],
            dataRule: {
                name: [{required: true, message: '请输入分组名称', trigger: 'blur'}],
                type: [{required: true, message: '请输入设备分组类型', trigger: 'blur'}],
                buildingId: [{required: true, message: '请选择楼栋', trigger: 'blur'}],
            },
        };
    },
    components: {
        AddOrUpdate,
        textList,
    },
    activated() {
        this.getDepartment();
        this.planId = this.$route.query.planId; //路由跳转拿到参数
        this.getDataInfo();
    },
    methods: {
        // 编辑进来查数据
        getDataInfo() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/plans/' + this.planId),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.devices;
                    this.dataForm.cycle = data.data.plan.cycle;
                    this.dataForm.name = data.data.plan.name;
                    this.dataForm.startTime = commonFunc(data.data.plan.startTime);
                    this.dataForm.endTime = commonFunc(data.data.plan.endTime);
                    this.dataForm.firstExecuteTime = commonFunc(data.data.plan.firstExecuteTime);
                    this.dataForm.responseTimeout = data.data.plan.responseTimeout;
                    this.dataForm.handleTimeout = data.data.plan.handleTimeout;
                    this.dataForm.rule = data.data.plan.rule;
                    this.dataForm.type = data.data.plan.type;
                    this.dataForm.cycleUnit = data.data.plan.cycleUnit;
                    this.dataForm.managerName = data.data.plan.managerName;
                    this.dataForm.executorName = data.data.plan.executorName;
                    this.dataForm.remark = data.data.plan.remark;
                    this.planId = data.data.plan.planId;
                    this.dataForm.managerDept = data.data.plan.managerDept;
                    this.dataForm.executorDept = data.data.plan.executorDept;
                    this.dataForm.status = data.data.plan.status;
                }
            });
        },
        // 设备信息列表的额操作
        // 详情
        info(deviceId) {
            this.$router.push({name: 'superdev-groupinfo', query: {id: deviceId}});
        },
        // 删除
        dele(deviceId) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/pm/check/plans/' + this.planId + '/devices/' + deviceId),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getDataInfo();
                    });
                })
                .catch(() => {});
        },
        // 检测项
        test(refId) {
            this.textVisible = true;
            this.$nextTick(() => {
                this.$refs.text.init({id: refId, isTrue: 'true'});
            });
        },
        // 级联选择器转换--得到value和label的对象
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
        //el-select  责任人得到value和label值
        personChange(vId) {
            //这个vId也就是value值
            let obj = {};
            obj = this.userList.find(item => {
                //这里的userList就是上面遍历的数据源
                return item.userId === vId; //筛选出匹配数据
            });
            this.dataForm.managerName = obj.realName; //我这边的name就是对应label的
        },
        //el-select  执行人得到value和label值
        personChange2(vId) {
            //这个vId也就是value值
            let obj = {};
            obj = this.userList2.find(item => {
                //这里的userList就是上面遍历的数据源
                return item.userId === vId; //筛选出匹配数据
            });
            this.dataForm.executorName = obj.realName; //我这边的name就是对应label的
        },
        // 责任人部门-级联得到value和label值
        getValue() {
            var data = this.getCascaderObj(this.selectedOptions, this.options);
            this.dataForm.managerDept = data[data.length - 1].departmentName;
        },
        // 执行人部门得到value和label值
        getValue2() {
            var data = this.getCascaderObj(this.selectedOptions2, this.options);
            this.dataForm.executorDept = data[data.length - 1].departmentName;
        },
        // 部门级联选择器change事件--责任人
        managerChange(val) {
            var id = val[val.length - 1];
            this.getPersonList(id);
            this.getValue();
        },
        // 部门级联选择器change事件--执行人
        executorChange(val) {
            var id = val[val.length - 1];
            this.getPersonList2(id);
            this.getValue2();
        },
        // 查询部门
        getDepartment() {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments'),
                method: 'get',
            }).then(({data}) => {
                this.options = data && data.code === 200 ? data.data.departments : [];
            });
        },
        // 查询人员数据--责任人
        getPersonList(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments/' + id + '/users/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userList = data.data.options;
                } else {
                    this.userList = [];
                }
            });
        },
        // 查询人员数据--执行人
        getPersonList2(id) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/departments/' + id + '/users/options'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.userList2 = data.data.options;
                } else {
                    this.userList2 = [];
                }
            });
        },
        // 选择设备触发的设备列表页面
        deviceSelect() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(this.planId);
            });
        },
        // 表单提交
        dataFormSubmit() {
            if (this.dataForm.cycle != 1) {
                this.dataForm.cycleUnit = 0;
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/pm/check/plans/` + this.planId),
                        method: 'put',
                        data: this.$http.adornData({
                            name: this.dataForm.name,
                            type: this.dataForm.type,
                            startTime: this.dataForm.startTime,
                            endTime: this.dataForm.endTime,
                            firstExecuteTime: this.dataForm.firstExecuteTime,
                            responseTimeout: this.dataForm.responseTimeout,
                            handleTimeout: this.dataForm.handleTimeout,
                            rule: this.dataForm.rule,
                            cycle: this.dataForm.rule == 2 ? this.dataForm.cycle : undefined,
                            cycleUnit: this.dataForm.rule == 2 ? Number(this.dataForm.cycleUnit) : undefined,
                            manager: this.dataForm.manager,
                            executor: this.dataForm.executor,
                            remark: this.dataForm.remark,
                        }),
                    }).then(({data}) => {
                        if (data && data.code === 201) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.$router.push({name: 'superdev-plain'});
                                },
                            });
                        }
                    });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.plain {
    .title {
        font-size: 14px;
        font-weight: 700;
        margin-top: 0;
    }
    .popr {
        display: flex;
        justify-content: space-between;
        .box {
            width: 25%;
        }
        .el-select {
            width: 100%;
        }
        .el-date-editor {
            width: 100%;
        }
        .el-cascader {
            width: 100%;
        }
    }
    .device_title {
        display: flex;
        justify-content: space-between;
        span {
            line-height: 28px;
            font-size: 14px;
            font-weight: 700;
        }
    }
    .btn_box {
        margin-top: 20px;
        text-align: center;
    }
    .rule_box {
        flex: 1;
        margin-left: 12%;
        .el-input {
            width: 150px;
            margin-left: 10px;
        }
    }
}
</style>
