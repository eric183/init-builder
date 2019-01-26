<template>
    <div class="plain">
        <!-- 计划新增页面 -->
        <p class="title">新增计划:</p>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" size="small">
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
                    <el-form-item label="开始时间" size="mini" prop="startTime">
                        <el-date-picker v-model="dataForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择日期"> </el-date-picker>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="结束时间" size="mini" prop="endTime">
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
                    <el-form-item label="责任人" prop="manager">
                        <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions" :show-all-levels="false" @change="managerChange" :props="props"></el-cascader>
                        <el-select class="mt10" v-model="dataForm.manager" placeholder="请选择人员">
                            <el-option v-for="item in userList" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="box">
                    <el-form-item label="执行人" prop="executor">
                        <el-cascader :options="options" filterable change-on-select v-model="dataForm.selectedOptions2" :show-all-levels="false" @change="executorChange" :props="props"></el-cascader>
                        <el-select class="mt10" v-model="dataForm.executor" placeholder="请选择人员">
                            <el-option v-for="item in userList2" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="box"></div>
            </div>
            <el-form-item label="备注" size="mini" prop="remark"> <el-input v-model="dataForm.remark" type="textarea"></el-input> </el-form-item>
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
                    <el-button type="success" plain size="mini" @click="test(scope.row.deviceId)">检测项</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="btn_box">
            <el-button size="small" @click="$router.go(-1)">取消</el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit()">确定</el-button>
        </div>
        <!-- 弹窗-选择设备 -->
        <add-or-update v-if="addOrUpdateVisible" v-on:id="id" ref="addOrUpdate"></add-or-update>
        <!-- 弹窗-检测项 -->
        <textList v-if="textVisible" ref="text" v-on:detections="detections"></textList>
    </div>
</template>

<script>
import AddOrUpdate from './device-select';
import textList from './text-list';
export default {
    data() {
        return {
            dataList: [], //设备列表的数据
            deviceIdList: [], //设备id的数组
            deviceId: null, //当前点击检查项的设备id
            devices: [], //设备与检查项关联的数组--传给后端的
            groupInfo: {}, //设备详情
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
                selectedOptions: [],
                selectedOptions2: [],
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
            userList: [],
            userList2: [],
            dataRule: {
                name: [{required: true, message: '必填', trigger: 'blur'}],
                type: [{required: true, message: '必填', trigger: 'blur'}],
                startTime: [{required: true, message: '必填', trigger: 'blur'}],
                endTime: [{required: true, message: '必填', trigger: 'blur'}],
                firstExecuteTime: [{required: true, message: '必填', trigger: 'blur'}],
                responseTimeout: [{required: true, message: '必填', trigger: 'blur'}],
                handleTimeout: [{required: true, message: '必填', trigger: 'blur'}],
                rule: [{required: true, message: '必填', trigger: 'blur'}],
                cycle: [{required: true, message: '必填', trigger: 'blur'}],
                manager: [{required: true, message: '必填', trigger: 'blur'}],
                executor: [{required: true, message: '必填', trigger: 'blur'}],
            },
        };
    },
    components: {
        AddOrUpdate,
        textList,
    },
    activated() {
        this.deviceIdList = [];
        this.dataList = [];
        this.devices = [];
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields();
        });
        this.dataForm.manager = '';
        this.dataForm.executor = '';
        this.getDepartment();
    },
    methods: {
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
            }).then(() => {
                var index = this.deviceIdList.indexOf(deviceId);
                this.deviceIdList.splice(index, 1);
                this.devices.splice(index, 1);
                this.dataList.splice(index, 1);
            });
        },
        // 检测项
        test(deviceId) {
            this.deviceId = deviceId;
            this.textVisible = true;
            this.$nextTick(() => {
                this.$refs.text.init({deviceId: deviceId, isTrue: 'true'});
            });
        },
        // 部门级联选择器change事件--责任人
        managerChange(val) {
            var id = val[val.length - 1];
            this.getPersonList(id);
        },
        // 部门级联选择器change事件--执行人
        executorChange(val) {
            var id = val[val.length - 1];
            this.getPersonList2(id);
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
        // 设备弹框传回来的id数据
        id: function(data) {
            this.deviceIdList.push(data);
            this.devices.push({
                id: data,
                detections: [],
            });
            this.$http({
                url: this.$http.adornUrl('/v1/pm/devices/' + data + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.groupInfo = data.data;
                    this.dataList.push(this.groupInfo);
                }
            });
        },
        //检测项弹框传回来的数据
        detections: function(data) {
            for (var i = 0; i < this.devices.length; i++) {
                if (this.devices[i].id == this.deviceId) {
                    this.devices[i].detections = data;
                }
            }
        },
        // 选择设备触发的设备列表页面
        deviceSelect() {
            this.addOrUpdateVisible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(this.deviceIdList);
            });
        },
        // 表单提交
        dataFormSubmit() {
            if (this.dataForm.cycle != 1) {
                this.dataForm.cycleUnit = 0;
            }
            if (this.dataList.length == 0) {
                this.$message.error('请选择设备');
                return false;
            }

            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl(`/v1/pm/check/plans`),
                        method: 'post',
                        data: this.$http.adornData({
                            plan: {
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
                            },
                            devices: this.devices,
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
