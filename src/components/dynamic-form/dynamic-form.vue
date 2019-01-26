<template>
    <el-form
        class="dynamic-form"
        :inline="formConfig.inline"
        :model="value"
        :label-position="formConfig.labelPosition"
        :label-width="formConfig.labelWidth"
        :size="formConfig.size"
        :status-icon="formConfig.statusIcon"
    >   
        <template v-if="checkLayoutType === 1">
            <el-row
                v-for="(pitem, pindex ) in formConfig.formItemList"
                :key="pindex"
            >
                <el-col v-for="(item, index) in pitem" :key="index" :span="spanValue(pitem, index)">
                    <dynamic-form-item
                        :key="item.name"
                        v-if="value[item.name]!==undefined && item.type !== 'hidden'"
                        :item="item"
                        :value="value[item.name]"
                        @input="handleInput($event, item)"
                        v-on:callbackValue="callbackValue"
                        :style="{'min-width':columnMinWidth}"
                    ></dynamic-form-item>
                    <slot/>
                </el-col>
            </el-row>
        </template>
        <el-row v-if="checkLayoutType === 2 ">
            <el-col v-for="(item,index) in formConfig.formItemList" :key="index" :span="item.span">
                <dynamic-form-item
                    :key="item.name"
                    v-if="value[item.name]!==undefined && item.type !== 'hidden'"
                    :item="item"
                    :value="value[item.name]"
                    @input="handleInput($event, item)"
                    v-on:callbackValue="callbackValue"
                    :style="{'min-width':columnMinWidth}"
                ></dynamic-form-item>
                <slot/>
            </el-col>
        </el-row>
        
        <el-row v-if="checkLayoutType === 3">
            <template v-for="item in formConfig.formItemList">
                <dynamic-form-item
                    :key="item.name"
                    :item="item"
                    :value="value[item.name]"
                    @input="handleInput($event, item)"
                    :style="{'min-width':columnMinWidth}"
                    v-on:callbackValue="callbackValue"
                    v-if="value[item.name]!==undefined && item.type !== 'hidden'"
                ></dynamic-form-item>
            </template>
            
            <slot/>
        </el-row>


        <!-- modified by ericKuang at 2019/1/16 -->
        <!-- <el-row v-if="checkLayoutType === 3">
            <dynamic-form-item
                v-for="item in formConfig.formItemList"
                :key="item.name"
                v-if="value[item.name]!==undefined && item.type !== 'hidden'"
                :item="item"
                :value="value[item.name]"
                @input="handleInput($event, item)"
                :style="{'min-width':columnMinWidth}"
                v-on:callbackValue="callbackValue"
            ></dynamic-form-item>
            <slot/>
        </el-row> -->
    </el-form>
</template>

<script>
export default {
    props: {
        formConfig: {
            type: Object,
            required: true
        },
        value: {
            type: Object,
            required: true
        },
        columnMinWidth: {
            type: String
        }
    },
    computed: {
        checkLayoutType() {
            let type = 3;
            if (
                this.formConfig.layout === undefined ||
                this.formConfig.layout === false
            ) {
                type = 3;
            } else if (
                this.formConfig.layout !== undefined &&
                this.formConfig.layout === true &&
                this.formConfig.formItemList[0].constructor === Array
            ) {
                type = 1;
            } else if (
                this.formConfig.layout !== undefined &&
                this.formConfig.layout === true
            ) {
                type = 2;
            }
            return type;
        }
    },
    created() {},
    methods: {
        // 跨行值得计算
        spanValue(items, index) {
            if (items[index].span !== undefined) {
                return items[index].span;
            }
            let sapnNum = 0;
            let num = 0;
            for (let i = 0; i < items.length; i++) {
                if (items[i].span !== undefined) {
                    sapnNum += items[i].span;
                    num++;
                }
            }
            sapnNum = 24 - sapnNum;
            num = items.length - num;
            if (index === items.length - 1) {
                return sapnNum / num + (sapnNum % num);
            }
            return sapnNum / num;
        },
        callbackValue(backValue) {
            this.value[backValue.item.name] = backValue.val;
            this.$emit("input", { ...this.value });
        },
        handleInput(val, item) {
            if (item.type === "datetimerange" || item.type === "daterange") {
                if (item.names && val && val.length > 0) {
                    let startName = item.names[0];
                    let endName = item.names[1];
                    let startTime;
                    let endTime;
                    if (item.format === undefined) {
                        startTime = val[0].getTime();
                        endTime = val[1].getTime();
                    } else {
                        startTime = val[0];
                        endTime = val[1];
                    }
                    this.$emit("input", {
                        ...this.value,
                        [startName]: startTime,
                        [endName]: endTime
                    });
                } else {
                    if (item.names) {
                        let startName = item.names[0];
                        let endName = item.names[1];
                        this.$emit("input", {
                            ...this.value,
                            [startName]: null,
                            [endName]: null
                        });
                    } else {
                        throw new Error(" datetimerange must has names field");
                    }
                }
            } else if (item.type === "timepicker") {
                if (item.isRange !== undefined && item.isRange === true) {
                    if (item.names === undefined) {
                        throw new Error(
                            " timepicker is isRange = true must has names field"
                        );
                    } else {
                        let startName = item.names[0];
                        let endName = item.names[1];
                        let startTime;
                        let endTime;
                        if (item.format === undefined) {
                            startTime = val[0].getTime();
                            endTime = val[1].getTime();
                        } else {
                            startTime = val[0];
                            endTime = val[1];
                        }
                        this.$emit("input", {
                            ...this.value,
                            [startName]: startTime,
                            [endName]: endTime
                        });
                    }
                }
            } else {
                this.$emit("input", { ...this.value, [item.name]: val });
            }
            // 这里element-ui没有上报event，直接就是value了
        },
        setDefaultValue() {
            const formData = { ...this.value };
            // 设置默认值

            if (this.checkLayoutType === 1) {
                this.formConfig.formItemList.forEach(pitem => {
                    pitem.forEach(item => {
                        const { name, value } = item;
                        if (
                            formData[name] === undefined ||
                            formData[name] === null
                        ) {
                            if (value) {
                                formData[name] = value;
                            } else {
                                formData[name] = null;
                            }
                        }
                    });
                });
                this.$emit("input", { ...formData });
            } else if (
                this.checkLayoutType === 3 ||
                this.checkLayoutType === 2
            ) {
                this.formConfig.formItemList.forEach(item => {
                    const { name, value } = item;
                    if (
                        formData[name] === undefined ||
                        formData[name] === null
                    ) {
                        if (value) {
                            formData[name] = value;
                        } else {
                            formData[name] = null;
                        }
                    }
                });
                this.$emit("input", { ...formData });
            }
        }
    },
    mounted() {
        this.setDefaultValue();
    }
};
</script>

<style>
</style>
