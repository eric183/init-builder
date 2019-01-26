<template>
    <div class="task-info">
        <!-- 任务详情 -->
        <div class="header">
            <span>巡检状态:</span> <span class="state">{{ taskstatus(taskInfo.status) }}</span>
            <el-button v-show="taskInfo.status == 2 && taskInfo.currentUserRole == 2" type="primary" size="mini" @click="ope(2)">接受</el-button>
            <el-button v-show="taskInfo.status == 2 && taskInfo.currentUserRole == 2" type="primary" size="mini" @click="assign(4)">转派</el-button>
            <el-button v-show="(taskInfo.status == 1 || taskInfo.status == 6) && taskInfo.currentUserRole == 1" type="primary" size="mini" @click="assign(3)">指派</el-button>
            <el-button v-show="taskInfo.status == 3 && taskInfo.currentUserRole == 2" type="primary" size="mini" @click="feedback(taskInfo.taskId)">处理反馈</el-button>
            <el-button v-show="taskInfo.status == 3 && taskInfo.currentUserRole == 2" type="primary" size="mini" @click="addHelp(taskInfo.taskId)">添加协作者</el-button>
            <el-button v-show="taskInfo.status == 3 && taskInfo.currentUserRole == 2" type="primary" size="mini" @click="lookHelp(taskInfo.taskId)">查看协作人</el-button>
            <el-button
                v-show="(taskInfo.status == 1 || taskInfo.status == 3 || taskInfo.status == 4 || taskInfo.status == 6) && taskInfo.currentUserRole == 1"
                type="primary"
                size="mini"
                @click="close(taskInfo.status)"
                >关闭</el-button
            >
            <!-- <span class="state">{{taskstatus(taskInfo.status)}}</span>
      <el-button  type="primary" size="mini" @click="ope(2)">接受</el-button>
      <el-button  type="primary" size="mini" @click="assign(4)">转派</el-button>
      <el-button  type="primary" size="mini" @click="assign(3)">指派</el-button>
      <el-button  type="primary" size="mini" @click="feedback(taskInfo.taskId)">处理反馈</el-button>
      <el-button  type="primary" size="mini" @click="addHelp(taskInfo.taskId)">添加协作者</el-button>
      <el-button  type="primary" size="mini" @click="lookHelp(taskInfo.taskId)">查看协作人</el-button>
      <el-button  type="primary" size="mini" @click="close(taskInfo.status)">关闭</el-button> -->
        </div>
        <div class="task_box">
            <div class="title">任务详情:</div>
            <ul>
                <li>
                    <div>
                        <label>计划名称:</label><span>{{ taskInfo.name }}</span>
                    </div>
                    <div>
                        <label>工作类别:</label><span>{{ type(taskInfo.type) }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>任务执行开始时间:</label><span>{{ createdAt(taskInfo.createdAt) }}</span>
                    </div>
                    <div>
                        <label>任务响应超时时间:</label><span>{{ taskInfo.responseTimeout }}</span
                        ><span class="ml10" v-if="taskInfo.responseTimeout">分钟</span>
                    </div>
                    <div>
                        <label>任务处理超时时间:</label><span>{{ taskInfo.handleTimeout }}</span
                        ><span class="ml10" v-if="taskInfo.handleTimeout">分钟</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>责任人:</label><span>{{ taskInfo.managerDept }}</span
                        ><span class="ml10">{{ taskInfo.managerName }}</span>
                    </div>
                    <div>
                        <label>执行人:</label><span>{{ taskInfo.executorDept }}</span
                        ><span class="ml10">{{ taskInfo.executorName }}</span>
                    </div>
                </li>
                <li>
                    <div>
                        <label>备注:</label><span>{{ taskInfo.remark }}</span>
                    </div>
                </li>
            </ul>
            <div class="btn_box"><el-button size="mini" type="primary" @click="goBack">返回</el-button></div>
        </div>
        <div class="title">设备信息:</div>
        <el-table :data="dataList" border style="width: 100%;">
            <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceSn" header-align="center" align="center" label="设备编号"> </el-table-column>
            <el-table-column prop="typeDesc" header-align="center" align="center" label="设备类型"> </el-table-column>
            <el-table-column prop="model" header-align="center" align="center" label="规格型号"> </el-table-column>
            <el-table-column prop="floorName" header-align="center" align="center" label="安装楼层"> </el-table-column>
            <el-table-column prop="position" header-align="center" align="center" label="具体位置"> </el-table-column>
            <el-table-column header-align="center" align="center" width="240" label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" plain size="mini" @click="defoinfo(scope.row.deviceId)">详情</el-button>
                    <el-button type="success" plain size="mini" @click="test(scope.row.deviceId)">检测项</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="title mt10">处理追踪:</div>
        <ul class="action_box">
            <li><span>时间</span> <span>处理追踪</span> <span>操作人</span> <span>处理详情</span> <span>反馈图片</span></li>
            <li v-for="(item, index) in actions" :key="index">
                <span>{{ createdAt(item.createdAt) }}</span> <span>{{ item.actionDesc }}</span> <span>{{ item.operatorName }}</span> <span>{{ item.feedbackInfo }}</span>
                <span>
                    <el-popover v-if="item.feedbackImage" placement="left" trigger="click">
                        <img :src="item.feedbackImage" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item.feedbackImage" style="width:50px;height:50px;" />
                    </el-popover>
                </span>
            </li>
        </ul>
        <el-dialog title="检测项" :close-on-click-modal="false" :visible.sync="visible">
            <el-table :data="textdataList" border style="width: 100%;">
                <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
                <el-table-column prop="content" header-align="center" align="center" label="检查内容"> </el-table-column>
                <el-table-column prop="standard" header-align="center" align="center" label="任务完成标准"> </el-table-column>
                <el-table-column prop="detectionValue" header-align="center" align="center" label="检查值"> </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="人员" :close-on-click-modal="false" :visible.sync="personVisible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
                <el-form-item label="执行人" prop="userId">
                    <el-cascader :options="options" filterable change-on-select v-model="selectedOptions" :show-all-levels="false" @change="executorChange" :props="props"></el-cascader>
                    <el-select v-model="dataForm.userId" placeholder="请选择人员">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="personVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="personSubmit()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="评价" :close-on-click-modal="false" :visible.sync="evaluateVisible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm2" @keyup.enter.native="dataFormSubmit()" label-width="80px" size="small">
                <el-form-item label="处理评价" prop="comment"> <el-input type="textarea" v-model="dataForm.comment"></el-input> </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="evaluateVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="evaluateSubmit()">确定</el-button>
            </span>
        </el-dialog>
        <!-- 添加协作者 -->
        <helpActor v-if="helpVisible" ref="helpVisible"></helpActor>
        <!-- 查看协作者 -->
        <lookActor v-if="lookVisible" ref="lookVisible"></lookActor>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import helpActor from './task-actor';
import lookActor from './task-actor-look';
import {taskstatus, devicetype} from '@/assets/statue.js';
export default {
    data() {
        return {
            dataList: [], //设备列表
            taskInfo: {}, //任务详情
            actions: [], //追踪记录列表
            taskId: null, //任务的id
            textdataList: [], //检测项的列表
            visible: false, //检测项列表的弹出框
            personVisible: false, //指派或者转派的人员的弹框
            evaluateVisible: false, //任务关闭评价的弹框
            helpVisible: false, //添加协作者的弹框
            lookVisible: false, //查看协作者的弹窗
            userList: [], //人员的下拉数据选项
            isAssign: true, //是否指派
            isAbnormal: true, //任务是否异常关闭
            options: [],
            props: {
                value: 'departmentId',
                label: 'departmentName',
                children: 'children',
            },
            selectedOptions: [],
            // 执行任务状态变更操作的参数
            dataForm: {
                comment: '', //正常/异常关闭填写评价
                userId: '', //指派/转派的执行人id
            },
            dataRule: {},
        };
    },
    components: {
        helpActor,
        lookActor,
    },
    activated() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.taskId = this.$route.query.taskId; //路由跳转拿到参数
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataList = data.data.devices;
                    this.taskInfo = data.data.details;
                    this.actions = data.data.actions;
                }
            });
        },
        goBack() {
            this.$router.push({name: 'superdev-task'});
        },
        // 详情
        defoinfo(deviceId) {
            this.$router.push({name: 'superdev-groupinfo', query: {id: deviceId}});
        },
        // 检测项
        test(deviceId) {
            this.visible = true;
            this.$http({
                url: this.$http.adornUrl(`/v1/pm/check/tasks/detections`),
                method: 'get',
                params: this.$http.adornParams({
                    taskId: this.taskId,
                    deviceId: deviceId,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.textdataList = data.data.detections;
                }
            });
        },
        // 执行任务状态变更操作
        // 反馈内容
        feedback(taskId) {
            this.$router.push({name: 'feedback', query: {taskId: taskId}});
        },
        ope(param) {
            this.$http({
                url: this.$http.adornUrl('/v1/pm/check/tasks/' + this.taskId + '/actions'),
                method: 'post',
                data: this.$http.adornData({
                    type: param,
                    userId: param == 3 || param == 4 ? this.dataForm.userId : undefined,
                    comment: param == 6 || param == 7 ? this.dataForm.comment : undefined,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList();
                        },
                    });
                }
            });
        },
        // 指派或者转派
        assign(param) {
            if (param == 3) {
                //指派
                this.isAssign = true;
            } else {
                //转派
                this.isAssign = false;
            }
            this.personVisible = true;
            this.getDepartment();
        },
        // 指派，转派的弹框的确认
        personSubmit() {
            let param = 3;
            if (this.isAssign == true) {
                param = 3;
            } else {
                param = 4;
            }
            this.ope(param);
            this.personVisible = false;
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
        // 部门级联选择器change事件--执行人
        executorChange(val) {
            var id = val[val.length - 1];
            this.getPersonList(id);
        },
        // 查询人员数据
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
        // 关闭的弹框
        close(status) {
            //status=6  为任务超时
            if (status == 6) {
                this.isAbnormal = true; //任务异常
            } else {
                this.isAbnormal = false; //任务正常
            }
            this.evaluateVisible = true; //任务完成的评价
            this.$nextTick(() => {
                this.$refs.dataForm2.resetFields();
            });
        },
        // 关闭的弹框的确认事件
        evaluateSubmit() {
            let param = 7;
            if (this.isAbnormal == true) {
                param = 7; //任务异常
            } else {
                param = 6;
            }
            this.ope(param);
            this.evaluateVisible = false;
        },
        // 添加协作者
        addHelp(id) {
            this.helpVisible = true;
            this.$nextTick(() => {
                this.$refs.helpVisible.init(id);
            });
        },
        // 查看协作者
        lookHelp(id) {
            this.lookVisible = true;
            this.$nextTick(() => {
                this.$refs.lookVisible.init(id);
            });
        },
        type(data) {
            return devicetype(data);
        },
        taskstatus(data) {
            return taskstatus(data);
        },
        createdAt(createdAt) {
            return commonFunc.commonFunc(createdAt);
        },
    },
};
</script>
<style lang="scss" scoped>
.task-info {
    .header {
        span {
            font-size: 14px;
        }
        span.state {
            margin-left: 20px;
            margin-right: 60px;
            font-size: 14px;
            color: #67c23a;
        }
    }
    .task_box {
        margin-top: 20px;
        position: relative;
        ul {
            li {
                display: flex;
                padding: 15px 0;
                div {
                    width: 30%;
                    label {
                        margin-right: 10px;
                    }
                    span {
                        text-decoration: underline;
                        color: #606266;
                    }
                }
            }
        }
        .btn_box {
            position: absolute;
            right: 10px;
            top: 0;
        }
    }
    .title {
        font-size: 14px;
        margin-bottom: 10px;
    }
    ul.action_box {
        padding-left: 0;
        li {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ebeef5;
            span {
                width: 15%;
                text-align: center;
                padding: 5px 0;
                line-height: 50px;
                position: relative;
                .bigImg {
                    display: none;
                    position: absolute;
                }
                .smallImg:hover .bigImg {
                    display: block;
                }
            }
            span:nth-child(4) {
                width: 20%;
            }
            span:nth-child(5) {
                width: 20%;
            }
        }
    }
}
</style>
