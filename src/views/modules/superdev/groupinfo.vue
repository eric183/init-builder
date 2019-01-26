<template>
    <div class="super_groupdetail">
        <div class="head">
            <p>
                <span>设备状态:</span> <span class="ml10 success" v-if="groupInfo.status == 1">正常</span> <span class="ml10 warning" v-if="groupInfo.status == 2">故障</span>
                <span class="ml10 info" v-if="groupInfo.status == 3">停用</span> <span class="ml10 danger" v-if="groupInfo.status == 4">预警</span>
            </p>
            <span class="footer_action">
                <el-button type="success" @click="$router.go(-1)" size="mini">返回</el-button>
                <!-- <el-button type="primary" size="mini">删除</el-button> -->
            </span>
        </div>
        <p class="title">设备常规信息:</p>
        <ul class="group_box">
            <li class="group_title group_common">
                <span>名称</span> <span>设备编号</span> <span>固定资产编号</span> <span>设备图片</span> <span>设备类型</span> <span>规格型号</span> <span>所属公司</span>
            </li>
            <li class="group_info group_common group_css">
                <span>{{ groupInfo.name }}</span> <span>{{ groupInfo.deviceSn }}</span> <span>{{ groupInfo.assetSn }}</span>
                <span class="device_img"> <img v-if="groupInfo.image" class="big_img" :src="groupInfo.image" /> <img v-if="groupInfo.image" class="small_img" :src="groupInfo.image" /> </span>
                <span>{{ groupInfo.typeDesc }}</span> <span>{{ groupInfo.model }}</span> <span>{{ groupInfo.possession }}</span>
            </li>
            <li class="group_title group_common">
                <span>生产厂商</span> <span>对接系统厂商</span> <span>安装楼层</span>
                <span><i v-if="groupInfo.doorplateName" style="display:inline-block;font-style:normal">门牌</i><i v-if="groupInfo.doorplateName" style="margin:0 10px;">/</i> 具体位置</span>
                <span>安装日期</span> <span>创建日期</span> <span>维保截至时间</span>
            </li>
            <li class="group_info group_common">
                <span>{{ groupInfo.producer }}</span> <span>{{ groupInfo.dockingProducer }}</span> <span>{{ groupInfo.floorName }}</span>
                <span
                    ><i v-if="groupInfo.doorplateName" style="display:inline-block;font-style:normal">{{ groupInfo.doorplateName }}</i
                    ><i v-if="groupInfo.doorplateName" style="margin:0 10px;">/</i>{{ groupInfo.position }}</span
                >
                <span>{{ installationTime(groupInfo.installationTime) }}</span> <span>{{ installationTime(groupInfo.createdAt) }}</span> <span>{{ installationTime(groupInfo.expirationTime) }}</span>
            </li>
            <li class="remark">
                <span class="ml10">备注：</span><span>{{ groupInfo.remark }}</span>
            </li>
        </ul>
        <p class="title mt10">设备技术参数:</p>
        <el-row class="deviceArge">
            <el-row v-for="(item, index) in technical" :key="index" class="ml20">
                <span v-if="item.key" class="ml10">名称：</span><el-input v-if="item.key" v-model="item.key" size="mini" :readonly="true" placeholder="参数名称"></el-input>
                <span v-if="item.value" class="ml10">内容：</span><el-input v-if="item.value" v-model="item.value" size="mini" :readonly="true" placeholder="参数值"></el-input>
            </el-row>
        </el-row>
        <p class="title">设备二维码:</p>
        <div class="qrcod">
            <vue-qr :text="config.value" :size="200" :margin="0" id="qrcode"></vue-qr>
            <span class="download" @click="downloadImg">点击下载</span>
        </div>
        <p class="title">设备历史记录：</p>
        <el-table :data="historyDataList" border style="width: 100%;">
            <el-table-column prop="createdAt" :formatter="createdAt" header-align="center" align="center" label="维护时间"> </el-table-column>
            <el-table-column prop="content" header-align="center" align="center" label="维护内容"> </el-table-column>
            <el-table-column prop="realname" header-align="center" align="center" label="处理人"> </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="处理结果"> </el-table-column>
            <el-table-column prop="feedback" header-align="center" align="center" label="描述反馈"> </el-table-column>
            <el-table-column header-align="center" align="center" label="图片反馈">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.images" :key="index" class="mr10">
                        <el-popover placement="right" trigger="click">
                            <img :src="item" style="max-width:720px;max-height:600px;" /> <img slot="reference" :src="item" style="width:50px;height:50px;" />
                        </el-popover>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import commonFunc from '@/assets/common.js';
import VueQr from 'vue-qr';
import {isJSON} from '@/assets/statue.js';
export default {
    name: 'superGroup',
    data() {
        return {
            groupInfo: {}, //详情信息
            technical: [], //技术参数
            config: {
                value: '',
            },
            historyDataList: [],
        };
    },
    components: {
        VueQr,
    },
    activated() {
        this.getGroupInfo();
    },
    methods: {
        getGroupInfo() {
            const that = this;
            let deviceId = this.$route.query.id; //路由跳转拿到参数
            this.$http({
                url: this.$http.adornUrl('/v2/pm/devices/' + deviceId + '/details'),
                method: 'get',
            }).then(({data}) => {
                if (data && data.code === 200) {
                    this.groupInfo = data.data;
                    if (isJSON(data.data.deviceArgs)) {
                        this.technical = JSON.parse(data.data.deviceArgs);
                    } else {
                        this.technical = [];
                    }
                    this.config.value = '' + data.data.deviceId;
                    data.data.records.map(obj => {
                        if (obj.images) {
                            if (obj.images.substr(obj.images.length - 1, 1) == ',') {
                                obj.images = obj.images.substr(0, obj.images.length - 1);
                            }
                            obj.images = obj.images.split(',');
                        }
                    });
                    this.historyDataList = data.data.records;
                }
            });
        },
        // 下载二维码
        downloadImg() {
            var oQrcode = document.querySelector('#qrcode img');
            var url = oQrcode.src;
            var a = document.createElement('a');
            var event = new MouseEvent('click');
            // 下载图名字
            a.download = '设备二维码';
            // url
            a.href = url;
            // 合成函数，执行下载
            a.dispatchEvent(event);
        },
        installationTime(item) {
            return commonFunc.commonFunc(item);
        },
        createdAt(item) {
            return commonFunc.commonFunc(item.createdAt);
        },
    },
};
</script>
<style lang="scss" scoped>
.super_groupdetail {
    .head {
        display: flex;
        justify-content: space-between;
        font-size: 18px;
    }
    .title {
        font-size: 14px;
    }
    span.footer_action {
        display: inline-block;
        margin-top: 7px;
    }
    .group_box {
        padding: 0;
        .group_common {
            display: flex;
            span {
                width: 14.2%;
                text-align: center;
                padding: 20px 5px;
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
            }
            span:nth-child(7) {
                flex: 1;
                border-right: 1px solid #ccc;
            }
            .device_img {
                position: relative;
                .small_img {
                    width: 50px;
                    height: 50px;
                }
                .big_img {
                    position: absolute;
                    display: none;
                }
            }
            .device_img:hover {
                .big_img {
                    display: block;
                    max-width: 800px;
                    max-height: 600px;
                }
            }
        }
        .group_css {
            span {
                line-height: 50px;
                padding: 0 5px;
            }
        }
        .group_title {
            color: #000;
        }
        .group_info {
            color: #606266;
        }
        .remark {
            padding: 20px 0;
            border: 1px solid #ccc;
        }
    }
    .device_rgs {
        ul {
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            border: 1px solid #ccc;
            li {
                padding: 20px 0;
                width: 25%;
                text-align: center;
            }
        }
    }
    .qrcod {
        border: 1px solid #ccc;
        text-align: center;
        padding-top: 10px;
        .download {
            display: inline-block;
            cursor: pointer;
            color: #3e8ef7;
            padding: 10px 0;
            font-size: 18px;
        }
    }
}
.deviceArge {
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
}
.deviceArge .el-input {
    width: 200px;
}
</style>
