<style>
</style>

<template>
    <el-form-item
        v-if="item.type === 'datetimerange' || item.type === 'daterange'"
        :rules="Rules"
        :label="item.label"
    >
        <el-date-picker
            v-model="value"
            :type="item.type"
            :is-range="item.isRange"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :value-format="item.format"
            :format="item.format"
            :placeholder="item.placeholder"
            v-bind="$attrs"
            v-on="$listeners"
            :default-value="defaultValue"
            :default-time="defaultTime"
        ></el-date-picker>
    </el-form-item>
    <el-form-item
        v-else-if="item.type === 'timeselect'"
        :rules="Rules"
        :label="item.label"
        :prop="item.name"
    >
        <el-time-select
            v-bind="$attrs"
            v-model="value"
            v-on="$listeners"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            :picker-options="item.pickerOptions"
        ></el-time-select>
    </el-form-item>
    <el-form-item
        v-else-if="item.type === 'timepicker'"
        :rules="Rules"
        :label="item.label"
        :prop="item.name"
    >
        <el-time-picker
            v-bind="$attrs"
            v-model="value"
            :is-range="item.isRange"
            v-on="$listeners"
            :readonly="item.readonly"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            :picker-options="item.pickerOptions"
            :range-separator="rangeSeparator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :value-format="item.format"
            :format="item.format"
        ></el-time-picker>
    </el-form-item>
    <el-form-item
        v-else-if="item.type === 'switch'"
        :rules="Rules"
        :label="item.label"
        :prop="item.name"
    >
        <el-switch
            :disabled="item.disabled"
            v-bind="$attrs"
            v-on="$listeners"
            :width="item.width"
            :active-text="item.activeText"
            :inactive-text="item.inactiveText"
            :active-value="item.activeValue"
            :inactive-value="item.inactiveValue"
            :active-color="item.activeColor"
            :inactive-color="item.inactiveColor"
        ></el-switch>
    </el-form-item>

    <el-form-item
        v-else-if="item.type === 'inputnumber'"
        :rules="Rules"
        :label="item.label"
        :prop="item.name"
    >
        <el-input-number
            :readonly="item.readonly"
            :disabled="item.disabled"
            v-bind="$attrs"
            v-model="value"
            v-on="$listeners"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :precision="item.precision"
            :size="item.size"
            :controls="item.controls"
        ></el-input-number>
    </el-form-item>

    <el-form-item v-else-if="item.type === 'aliossone'" :label="item.label" :prop="item.name">
        <OSSONEUpload
            :imagePath="item.imagePath"
            :httpPath="item.httpPath"
            v-model="value"
            v-bind:image-src="value"
            v-on:setImageUrl="setImageUrl"
        ></OSSONEUpload>
    </el-form-item>
    <el-form-item v-else-if="item.type === 'ossfileone'" :label="item.label">
        <el-upload
            ref="ossfileupload"
            :action="''"
            v-bind="$attrs"
            v-on="$listeners"
            :http-request="updateFile"
            :show-file-list="false"
            list-type="picture-card"
            :before-upload="fileBeforeUpload"
            :before-remove="fileUploadRemove"
            :on-success="fileUploadSuccess"
        >
            <img v-if="item.value" :src="item.value" class="avatar">
            <i v-else class="el-icon-plus"></i>
        </el-upload>
    </el-form-item>

    <el-form-item v-else :rules="Rules" :label="item.label" :prop="item.name">
        <el-input
            v-if="item.type==='input'"
            v-bind="$attrs"
            v-on="$listeners"
            :type="item.subtype"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :readonly="item.readonly"
            :autosize="item.autosize"
        ></el-input>
        <dynamic-input-number
            v-else-if="item.type==='number'"
            v-bind="$attrs"
            v-on="$listeners"
            :min="item.min"
            :max="item.max"
            :decimal1="item.decimal1"
            :append="item.append"
            :prepend="item.prepend"
            :disabled="item.disabled"
        ></dynamic-input-number>

        <el-rate
            v-else-if="item.type==='rate'"
            v-bind="$attrs"
            v-on="$listeners"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            text-color="#ff9900"
        ></el-rate>

        <el-color-picker
            v-else-if="item.type==='color'"
            v-bind="$attrs"
            v-on="$listeners"
            :show-alpha="item.showAlpha"
            :color-format="item.format"
        ></el-color-picker>

        <el-slider
            v-else-if="item.type==='slider'"
            v-bind="$attrs"
            v-on="$listeners"
            :range="item.isRange"
            :show-stops="item.showStops"
            :step="item.step"
            :min="item.min"
            :max="item.max"
        ></el-slider>

        <el-radio-group v-else-if="item.type==='radio'" v-bind="$attrs" v-on="$listeners">
            <component
                :is="item.button?'el-radio-button':'el-radio'"
                v-for="o in item.options||ajaxOptions"
                :key="o.value"
                :label="o.value"
                :disabled="o.disabled"
                :border="item.border"
            >{{o.label}}</component>
        </el-radio-group>

        <el-checkbox-group
            v-else-if="item.type==='checkbox'"
            :min="item.min"
            :max="item.max"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <component
                :is="item.button?'el-checkbox-button':'el-checkbox'"
                v-for="o in item.options||ajaxOptions"
                :key="o.value"
                :disabled="o.disabled"
                :label="o.value"
                :border="item.border"
            >{{o.label}}</component>
        </el-checkbox-group>

        <el-select
            v-else-if="item.type==='select'"
            v-bind="$attrs"
            v-on="$listeners"
            :multiple="item.multiple"
            :disabled="item.disabled"
            :multiple-limit="item.multipleLimit"
        >
            <el-option
                v-for="o in item.options||ajaxOptions"
                :key="o.value"
                :label="o.label"
                :value="o.value"
                :disabled="o.disabled"
            ></el-option>
        </el-select>

        <el-time-picker
            v-else-if="item.type==='time'"
            :is-range="item.isRange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :value-format="item.valueFormat"
            :format="item.valueFormat"
            :placeholder="item.placeholder"
            v-bind="$attrs"
            v-on="$listeners"
        ></el-time-picker>

        <el-date-picker
            v-else-if="item.type==='date'"
            :type="item.subtype"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :value-format="item.valueFormat"
            :format="item.viewFormat||item.valueFormat"
            :placeholder="item.placeholder"
            v-bind="$attrs"
            v-on="$listeners"
            :disabled="item.disabled"
        ></el-date-picker>

        <!-- <richtext v-else-if="item.type==='richtext'" v-bind="$attrs" v-on="$listeners"></richtext>-->
        <span v-else>未知控件类型</span>
    </el-form-item>
</template>

<script>
/* import request from '@/utils/request' */
/* import Richtext from '@/components/tinymce' */

import OSSONEUpload from "@/views/modules/UIModules/OSSONEUpload";
var co = require("co");
var OSS = require("ali-oss");
export default {
    components: {
        OSSONEUpload
        //  Richtext
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            value: null,
            imageSrc: null,
            ajaxOptions: []
        };
    },
    watch: {},
    computed: {
        defaultTime() {
            if (this.item.defaultTime === undefined) {
                let d = new Date();
                let hours = d.getHours();
                let minutes = d.getMinutes();
                let seconds = d.getSeconds();
                let time =
                    (hours >= 10 ? hours : "0" + hours) +
                    ":" +
                    (minutes >= 10 ? minutes : "0" + minutes) +
                    ":" +
                    (seconds >= 10 ? seconds : "0" + seconds);
                return [time, time];
            } else {
                return this.item.defaultTime;
            }
        },
        startPlaceholder() {
            if (this.item.startPlaceholder === undefined) {
                return "开始时间";
            }
            return this.item.startPlaceholder;
        },
        endPlaceholder() {
            if (this.item.endPlaceholder === undefined) {
                return "结束时间";
            }
            return this.item.endPlaceholder;
        },
        rangeSeparator() {
            if (this.item.rangeSeparator === undefined) {
                return "至";
            }
            return this.item.rangeSeparator;
        },
        defaultValue() {
            if (this.item.defaultValue !== undefined) {
                this.value = this.item.defaultValue;
                return this.item.defaultValue;
            }
        },
        Rules() {
            const rules = this.item.rules;
            if (rules === undefined) return undefined;

            const R = [];

            rules.forEach(rule => {
                if (rule.sql) {
                    const validator = (rule2, value, callback) => {
                        this.$http("/api/validate", "POST", {
                            key: rule2.field,
                            value,
                            sql: rule.sql.replace(/{key}/gi, rule2.field)
                        })
                            .then(res => {
                                // eslint-disable-next-line
                                callback(!res || undefined);
                            })
                            .catch(err => {
                                this.$message.error(err.message);
                                // eslint-disable-next-line
                                callback(false);
                            });
                    };

                    R.push({
                        validator,
                        message: rule.message,
                        trigger: "blur"
                    });
                } else {
                    R.push(rule);
                }
            });

            return R;
        }
    },
    methods: {
        setImageUrl(imageUrl) {
            this.value = imageUrl;
            this.$emit("handleInput", { val: imageUrl, item: this.item });
        },
        updateFile(content) {
            content.onSuccess("配时文件上传成功");
        },
        fileBeforeUpload(file) {
            const that = this;
            const isJPG = file.type === "image/jpeg";
            const isJPG2 = file.type === "image/png";
            const isLt200k = file.size / 1024 <= 200;
            var isComTrue = true; // 是否压缩  true为需要压缩
            if (!isLt200k) {
                isComTrue = true;
            } else {
                isComTrue = false;
            }
            if (!isJPG && !isJPG2) {
                this.$message.error("上传图片暂时只支持JPG,png格式");
                this.$refs.upload.clearFiles();
            } else {
                this.$http.get(that.item.httpPath).then(function(res) {
                    if (res.data.code === 200) {
                        // console.log(res.data.data.accessKeyId)
                        var client = new OSS({
                            accessKeyId: res.data.data.accessKeyId,
                            endpoint: res.data.data.endPoint,
                            accessKeySecret: res.data.data.accessKeySecret,
                            bucket: res.data.data.bucket,
                            region: res.data.data.region,
                            stsToken: res.data.data.securityToken
                        });
                        console.info(that.item.imagePath);
                        if (isComTrue) {
                            lrz(file, {
                                width: 750,
                                quality: 0.7
                            }).then(function(rst) {
                                co(function*() {
                                    var timeStamp = new Date().getTime();
                                    var result = yield client.put(
                                        that.item.imagePath + timeStamp,
                                        rst.file
                                    ); // 新增商品-上传的图片
                                    // console.log(result);
                                    that.imageSrc = result.url;
                                    if (that.imageSrc) {
                                        that.item.value = that.imageSrc;
                                        that.$emit("callbackValue", {
                                            val: that.imageSrc,
                                            item: that.item
                                        });
                                        // that.$emit('setImageUrl', that.item.value)
                                        // that.$emit('input', that.imageSrc)
                                        // that.isShowImg = false
                                    } else {
                                        // that.isShowImg = true
                                    }
                                });
                            });
                        } else {
                            co(function*() {
                                var timeStamp = new Date().getTime();
                                var result = yield client.put(
                                    that.item.imagePath + timeStamp,
                                    file
                                ); // 新增商品-上传的图片
                                that.imageSrc = result.url;
                                if (that.imageSrc) {
                                    that.item.value = that.imageSrc;
                                    that.$emit("callbackValue", {
                                        val: that.imageSrc,
                                        item: that.item
                                    });
                                } else {
                                    // that.isShowImg = true
                                }
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        fileUploadRemove() {
            console.info("++++++++++fileUploadRemove+++++++++");
            this.imageSrc = null;
            this.item.value = null;
            this.$emit("callbackValue", { val: null, item: this.item });
        },
        fileUploadSuccess() {}
    },
    created() {
        if (this.item.type === "datetimerange" && !this.item.names) {
            throw new Error(" type=datetimerange must has names field");
        } else if (this.item.type === "timepicker") {
            if (
                this.item.isRange !== undefined &&
                this.item.isRange === true &&
                this.item.names === undefined
            ) {
                throw new Error(
                    " timepicker is isRange = true must has names field"
                );
            } else {
                if (
                    this.item.name === undefined &&
                    (this.item.isRange === undefined ||
                        this.item.isRange === false)
                ) {
                    throw new Error(" timepicker  must has name field");
                }
            }
        } else if (this.item.type === "inputnumber") {
            this.value = this.item.value;
        } else if (this.item.type === "ossfileone") {
            this.imageSrc = this.item.value;
            console.info(this.imageSrc);
        }
        const { optionsUrl, name, type } = this.item;
        if (optionsUrl) {
            const url =
                type === "cascader"
                    ? "/api/cascader/options"
                    : "/api/some/options";
            console.log(
                `本页面为模拟预览，已自动重定向到URL:${url}，查看Network以获取格式`
            );
            this.$http(`${url}?key=${name}`, "GET")
                .then(res => {
                    // this.item.options = res
                    // this.$set(this.item, 'options', res)
                    this.ajaxOptions = res;
                })
                .catch(err => {
                    this.$message.error(err.message);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.avatar {
    height: 148px;
    width: 148px;
    cursor: pointer;
}
.box {
    text-align: center;
    float: left;
    cursor: pointer;
}
.list {
    display: inline-block;
    width: 148px;
    height: 148px;
    margin: 0px;
    position: relative;
}
.list::before {
    /*无需再嵌套div来做遮罩层*/
    width: 148px;
    height: 148px;
    display: inline-block;
    background: #000000;
    opacity: 0;
    content: "X";
    color: red;
    position: absolute;
    text-align: center;
    line-height: 148px;
    top: 0px;
    left: 0px;
    z-index: 9;
}
#list1:hover::before {
    height: 148px;
    opacity: 0.6;
}
.list img {
    width: 148px;
    height: 148px;
    margin: 0px;
    z-index: 1;
}
</style>
