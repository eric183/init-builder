<template>
    <!-- 资讯详情 -->
    <div class="wrapper">
        <div class="content">
            <h3>{{ dataObj.title }}</h3>
            <p>
                <span>{{ dataObj.publishTime }}</span>
            </p>
            <div class="infodetail" v-html="dataObj.content">{{ dataObj.content }}</div>
        </div>
        <ul class="coment_num">
            <li><span>评论</span> <span></span></li>
            <li class="ml30">
                <span>点赞</span> <span>{{ dataObj.likeNum }}</span>
            </li>
            <li class="ml30">
                <span>浏览量</span> <span>{{ dataObj.viewNum }}次</span>
            </li>
        </ul>
        <ul class="comment">
            <li v-for="(item, i) in commentList" :key="i">
                <img :src="item.headerImg" onerror="src='http://lzmdata.oss-cn-shenzhen.aliyuncs.com/advert/product1531799741997.jpg'" alt="" />
                <div>
                    <p class="phone">
                        <span>{{ item.phone }}</span>
                        <el-button type="danger" size="mini" plain @click="detealInfo(item.commentId)">删除</el-button>
                        <el-button v-if="!item.replyId" size="mini" plain @click="replayBtn(item.commentId)">回复</el-button>
                    </p>
                    <p>{{ commentTime(item) }}</p>
                    <p>{{ item.content }}</p>
                    <p class="phone" v-if="item.replyId">
                        <span class="replay">作者回复</span>
                        <el-button type="danger" size="mini" plain @click="detealReplay(item.replyId)">删除</el-button>
                    </p>
                    <p v-if="item.replyId">{{ item.reply }}</p>
                </div>
            </li>
        </ul>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageNum"
            :page-sizes="[3, 6, 9, 12]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>
        <span class="footer_action"> <el-button size="small" type="primary" @click="$router.push({name: 'adv-infomation'})">返回</el-button> </span>
        <el-dialog title="回复" :close-on-click-modal="false" @close="closeDialog" :visible.sync="visible">
            <el-form :model="replayForm" :rules="replayRule" ref="replayRef" @keyup.enter.native="dataFormSubmit()" label-width="50px" size="small">
                <el-form-item label="回复" prop="content"> <el-input type="textarea" v-model="replayForm.content"></el-input> </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button size="small" type="primary" @click="replayConfir()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
export default {
    data() {
        return {
            // 表格数据展示
            dataObj: {},
            id: null, //资讯的id
            commentList: [],
            visible: false, //回复的弹框
            replayForm: {
                content: '',
            },
            commentId: '', //评论id
            replayRule: {},
            pageNum: 1,
            pageSize: 3,
            total: 0,
        };
    },
    activated() {
        this.id = this.$route.query.id; //路由跳转拿到参数
        this.getContent();
        this.getComment();
    },
    methods: {
        // 获取发现详情
        getContent() {
            this.$http({
                url: this.$http.adornUrl('/v2/info/discoveries/' + this.id + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.dataObj = data.data;
                    this.dataObj.publishTime = commonFunc.commonFunc(data.data.publishTime);
                }
            });
        },
        // 获取评论列表
        getComment() {
            this.$http({
                url: this.$http.adornUrl('/v1/info/discoveries/' + this.id + '/comments'),
                method: 'get',
                params: this.$http.adornParams({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }),
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.commentList = data.data.list;
                    this.total = data.data.total;
                }
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.getComment();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageNum = val;
            this.getComment();
        },
        // 删除评论
        detealInfo(commentId) {
            this.$confirm(`确定删除评论?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/v1/info/discoveries/comments/' + commentId),
                    method: 'delete',
                })
                    .then(({data}) => {
                        this.getComment();
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            });
        },
        // 删除回复
        detealReplay(replyId) {
            this.$confirm(`确定删除回复?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http({
                    url: this.$http.adornUrl('/v1/info/discoveries/comments/replies/' + replyId),
                    method: 'delete',
                })
                    .then(({data}) => {
                        this.getComment();
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            });
        },
        // 回复
        replayBtn(commentId) {
            this.commentId = commentId;
            this.visible = true;
        },
        replayConfir() {
            this.$http({
                url: this.$http.adornUrl('/v1/info/discoveries/comments/' + this.commentId + '/replies'),
                method: 'post',
                data: this.$http.adornData({
                    content: this.replayForm.content,
                }),
            }).then(({data}) => {
                if (data && data.code === 201) {
                    this.isclick = true;
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.visible = false;
                            this.getComment();
                        },
                    });
                }
            });
        },
        // 回复的弹框关闭
        closeDialog() {
            this.$refs['replayRef'].resetFields();
        },
        commentTime(item) {
            return commonFunc.commonFunc(item.commentTime);
        },
    },
};
</script>
<style lang="scss" scoped>
.wrapper {
    position: relative;
    .footer_action {
        position: absolute;
        left: 116px;
        bottom: 0;
    }
}
.content {
    h3,
    p {
        text-align: center;
    }
    h3 {
        margin-top: 0;
    }
    p {
        span {
            margin-left: 30px;
        }
    }
}
.coment_num {
    display: flex;
    li {
        font-weight: 700;
        font-size: 14px;
    }
}
.comment {
    li {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
        img {
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
                span {
                    display: inline-block;
                    width: 100px;
                    margin-right: 200px;
                }
                .replay {
                    font-weight: 800;
                }
            }
            h4 {
                margin: 8px 0;
            }
        }
    }
}
</style>
