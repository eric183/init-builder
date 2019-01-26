<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible">
        <div class="tabSwitch">
            <span :class="{active: isActive == 1}" @click="tabSwitch(1)">详情</span> <span :class="{active: isActive == 2}" @click="tabSwitch(2)">互动</span>
            <span :class="{active: isActive == 3}" @click="tabSwitch(3)" v-if="type == 2">报名列表</span>
        </div>
        <div class="activty_info" v-if="isActive == 1">
            <ul>
                <li class="textcenter title">{{ actDetailsObj.title }}</li>
                <li class="textcenter black">{{ createdAt(actDetailsObj) }}</li>
                <li class="textcenter">
                    <el-popover v-if="actDetailsObj.coverImg" placement="right" trigger="click">
                        <img :src="actDetailsObj.coverImg" style="max-width:700px;max-height:600px;" /> <img slot="reference" :src="actDetailsObj.coverImg" style="max-width:500px;max-height:200px;" />
                    </el-popover>
                </li>
                <li class="black">活动时间: {{ timeChange(actDetailsObj.startTime) + '---' + timeChange(actDetailsObj.endTime) }}</li>
                <li class="black" v-if="type == 2">
                    <label>报名截至时间：</label> <span>{{ timeChange(actDetailsObj.attendDeadline) }}</span> <label v-if="actDetailsObj.isLimitNum == 1" class="ml20">报名上限人数：</label>
                    <span v-if="actDetailsObj.isLimitNum == 1">{{ actDetailsObj.limitNum }}</span> <label v-if="actDetailsObj.isLimitNum == 1" class="ml20">剩余展示名额：</label>
                    <span v-if="actDetailsObj.isLimitNum == 1">{{ actDetailsObj.remainNum }}</span>
                </li>
                <li class="black">
                    <label>活动地点：</label> <span>{{ actDetailsObj.address }}</span>
                </li>
                <li v-html="actDetailsObj.content" class="activity-detail-content">{{ actDetailsObj.content }}</li>
            </ul>
            <div style="text-align:right"><el-button type="primary" size="mini" @click="visible = false">关闭</el-button></div>
        </div>
        <div class="interact" v-if="isActive == 2">
            <ul>
                <li class="point">
                    <span>总点赞数：{{ totalLikeNum }}</span> <span class="ml20">浏览量：{{ viewNum }}次</span>
                    <div class="time_sort" @click="timeClick">
                        <div class="i_icon"><i class="el-icon-caret-top" :class="{timeActive: timeSort == 2}"></i><i class="el-icon-caret-bottom" :class="{timeActive: timeSort == 1}"></i></div>
                        <span :class="{timeActive: timeSort == 2 || timeSort == 1}">按时间排序</span>
                    </div>
                    <div class="time_sort" @click="activeClick">
                        <div class="i_icon"><i class="el-icon-caret-top" :class="{active: activeSort == 4}"></i><i class="el-icon-caret-bottom" :class="{active: activeSort == 3}"></i></div>
                        <span :class="{active: activeSort == 4 || activeSort == 3}">按点赞排序</span>
                    </div>
                </li>
                <li v-for="(item, i) in commentList" :key="i" class="comment">
                    <img class="avatar" :src="item.avatar" onerror="src='http://lzmdata.oss-cn-shenzhen.aliyuncs.com/advert/product1531799741997.jpg'" alt="" />
                    <div style="width:80%">
                        <p class="phone">
                            <el-row>
                                <span>{{ item.phone }}</span
                                ><span class="ml20">点赞数：{{ item.likeNum }}</span>
                            </el-row>
                            <el-row>
                                <el-button type="danger" size="mini" plain @click="deleteComment(item.interactiveId)">删除</el-button>
                                <el-button v-if="!item.replies.length" size="mini" plain @click="replayBtn(item.interactiveId)">回复</el-button>
                            </el-row>
                        </p>
                        <p>{{ commentTime(item.createdAt) }}</p>
                        <p style="word-wrap:break-word">{{ item.content }}</p>
                        <p class="imglist">
                            <span v-for="(imgSrc, index) in item.imgArr" :key="index">
                                <el-popover placement="right" trigger="click">
                                    <img :src="imgSrc" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="imgSrc" alt="" style="max-height: 50px;max-width: 130px" />
                                </el-popover>
                            </span>
                        </p>
                        <p class="phone" v-if="item.replies.length">
                            <el-row>
                                <span class="replay">{{ item.replies[0].replyNickname }}</span>
                            </el-row>
                            <el-row> <el-button type="danger" size="mini" plain @click="deleteReply(item.replies[0].replyId)">删除</el-button> </el-row>
                        </p>
                        <p v-if="item.replies.length">{{ item.replies[0].content }}</p>
                    </div>
                </li>
            </ul>
            <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageNum"
                :page-size="pageSize"
                :page-sizes="[6, 10, 15, 20]"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
            <replay-diaolg v-if="replayDiaolgAble" ref="replayDiaolgRef" @refreshDataList="getComments"></replay-diaolg>
        </div>
        <div class="interact" v-if="isActive == 3 && type == 2">
            <el-form :inline="true" :model="activeDataForm" size="small" class="mt10">
                <el-form-item label="手机号:" class="ml10"> <el-input v-model="activeDataForm.phone" placeholder="手机号" clearable></el-input> </el-form-item>
                <el-form-item label="性别:" class="ml10">
                    <el-select v-model="activeDataForm.gender"> <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <el-form-item label="状态:" class="ml10">
                    <el-select v-model="activeDataForm.status"> <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option> </el-select>
                </el-form-item>
                <el-form-item> <el-button type="primary" @click="getDataListFun()">查询</el-button> </el-form-item>
            </el-form>
            <el-table :data="signUpDataList" border style="width: 100%;">
                <el-table-column type="index" header-align="center" align="center" width="50" label="序号"> </el-table-column>
                <el-table-column prop="nickname" header-align="center" align="center" label="姓名"> </el-table-column>
                <el-table-column prop="phone" header-align="center" align="center" label="手机号"> </el-table-column>
                <el-table-column :formatter="gender" header-align="center" align="center" label="性别"> </el-table-column>
                <el-table-column :formatter="createAt" header-align="center" align="center" min-width="150" label="报名时间"> </el-table-column>
                <el-table-column :formatter="status" header-align="center" align="center" width="150" label="状态"> </el-table-column>
                <el-table-column header-align="center" align="center" width="80" label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" plain size="mini" @click="entries(scope.row.entryId)" :disabled="scope.row.status == 2">签到</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="sizeChangeHandle2"
                @current-change="currentChangeHandle2"
                :current-page="pageNum2"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize2"
                :total="totalPage2"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
import {commonFunc} from '@/utils/resources/index.js';
import replayDiaolg from './replayDiaolg';
export default {
    name: 'activity-detail',
    data() {
        return {
            visible: false,
            replayDiaolgAble: false,
            isActive: 1,
            actDetailsObj: {},
            totalLikeNum: 0, //总点赞
            viewNum: 0, //浏览量
            commentList: [],
            actId: null,
            orderBy: 1,
            type: null,
            pageNum: 1,
            pageSize: 6,
            totalPage: 0,
            pageNum2: 1,
            pageSize2: 10,
            totalPage2: 0,
            dataList: [],
            signUpDataList: [],
            genderList: [{value: null, label: '全部'}, {value: 1, label: '男'}, {value: 2, label: '女'}, {value: 3, label: '未知'}],
            statusList: [{value: null, label: '全部'}, {value: 1, label: '未签到'}, {value: 2, label: '已签到'}],
            activeDataForm: {
                phone: '',
                gender: null,
                status: null,
            },
            timeSort: 3,
            activeSort: 5,
        };
    },
    components: {
        replayDiaolg,
    },
    methods: {
        init(id, type) {
            this.isActive = 1;
            this.actId = id;
            this.type = type;
            this.orderBy = 1;
            if (type == 2) {
                this.getSingUpList(); //报名活动
            }
            this.pageNum = 1;
            this.pageSize = 6;
            this.timeSort = 3;
            this.activeSort = 5;
            this.getActDetails();
            this.getComments();
            this.visible = true;
        },
        tabSwitch(val) {
            this.isActive = val;
        },
        //   获取活动详情
        getActDetails() {
            this.$http({
                url: this.$http.adornUrl('/v3/act/infos/' + this.actId + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.actDetailsObj = data.data;
                } else {
                    this.actDetailsObj = {};
                }
            });
        },
        //   获取话题列表--互动
        getComments() {
            this.$http({
                url: this.$http.adornUrl('/v2/act/interactives'),
                method: 'get',
                params: this.$http.adornParams({
                    actId: this.actId,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    orderBy: this.orderBy,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.commentList = data.data.list;
                    this.totalPage = data.data.total;
                    this.totalLikeNum = data.data.totalLikeNum;
                    this.viewNum = data.data.viewNum;
                    this.commentList.map(obj => {
                        obj.imgArr = obj.images.split(',');
                    });
                } else {
                    this.commentList = [];
                }
            });
        },
        timeClick() {
            this.activeSort = 5;
            if (this.timeSort < 2) {
                this.timeSort = 3;
            }
            this.timeSort--;
            this.sort(this.timeSort);
        },
        activeClick() {
            this.timeSort = 3;
            if (this.activeSort < 4) {
                this.activeSort = 5;
            }
            this.activeSort--;
            this.sort(this.activeSort);
        },
        //  排序
        sort(value) {
            this.orderBy = value;
            this.getComments();
        },
        getDataListFun() {
            (this.pageNum = 1), this.getSingUpList();
        },
        //   获取报名列表
        getSingUpList() {
            this.$http({
                url: this.$http.adornUrl('/v1/act/info/' + this.actId + '/entries'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum2,
                    pageSize: this.pageSize2,
                    phone: this.activeDataForm.phone,
                    gender: this.activeDataForm.gender,
                    status: this.activeDataForm.status,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.signUpDataList = data.data.list;
                    this.totalPage2 = data.data.total;
                } else {
                    this.dataList = [];
                    this.totalPage2 = 0;
                }
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.getComments();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getComments();
        },
        // 每页数
        sizeChangeHandle2(val) {
            this.pageSize2 = val;
            this.getSingUpList();
        },
        // 当前页
        currentChangeHandle2(val) {
            this.pageNum2 = val;
            this.getSingUpList();
        },
        //   回复
        replayBtn(id) {
            (this.replayDiaolgAble = true),
                this.$nextTick(() => {
                    this.$refs.replayDiaolgRef.init(id);
                });
        },
        //   签到
        entries(id) {
            this.$http({
                url: this.$http.adornUrl(`/v1/act/info/entries/` + id),
                method: 'put',
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.getSingUpList();
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                    });
                }
            });
        },
        // 删除评论
        deleteComment(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/act/interactives/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getComments();
                    });
                })
                .catch(() => {});
        },
        // 删除回复
        deleteReply(id) {
            this.$confirm(`确定进行删除?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/v1/act/interactives/replies/' + id),
                        method: 'delete',
                    }).then(({data}) => {
                        this.getComments();
                    });
                })
                .catch(() => {});
        },
        createdAt(item) {
            return commonFunc(Number(item.createdAt));
        },
        createAt(item) {
            return commonFunc(Number(item.createAt));
        },
        timeChange(time) {
            return commonFunc(Number(time));
        },
        commentTime(item) {
            return commonFunc(item);
        },
        gender(item) {
            switch (item.gender) {
                case 1:
                    return '男';
                    break;
                case 2:
                    return '女';
                    break;
                case 3:
                    return '未填';
                    break;
            }
        },
        status(item) {
            switch (item.status) {
                case 1:
                    return '未签到';
                    break;
                case 2:
                    return '已签到';
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.tabSwitch {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    span {
        display: inline-block;
        padding: 3px 30px;
        border: 1px solid #3e8ef7;
        border-radius: 5px;
        color: #3e8ef7;
        cursor: pointer;
    }
    span.active {
        background-color: #3e8ef7;
        color: #fff;
    }
}
.activty_info {
    .title {
        font-weight: 800;
        font-size: 16px;
        color: #303030;
    }
    li {
        margin: 14px 0;
    }
    .black {
        color: #606266;
        font-weight: 600;
    }
}
.interact {
    li.point {
        display: flex;
        margin-bottom: 10px;
        div.time_sort {
            margin-left: 30px;
            padding: 0 5px 0 0;
            display: flex;
            background: #ccc;
            border-radius: 5px;
            cursor: pointer;
            .i_icon {
                display: flex;
                flex-direction: column;
                i {
                    font-size: 10px;
                }
                i.timeActive {
                    color: #3e8ef7;
                }
                i.active {
                    color: #3e8ef7;
                }
            }
            span.timeActive {
                color: #3e8ef7;
            }
            span.active {
                color: #3e8ef7;
            }
        }
    }
}
.comment {
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    img.avatar {
        border-radius: 50%;
        width: 60px;
        height: 60px;
        vertical-align: middle;
        margin-right: 20px;
    }
    div {
        p {
            margin: 4px 0;
        }
        p.phone {
            display: flex;
            .el-row {
                width: 50%;
                span {
                    display: inline-block;
                    width: 120px;
                }
                .replay {
                    font-weight: 800;
                }
            }
        }
        h4 {
            margin: 8px 0;
        }
    }
}
</style>
