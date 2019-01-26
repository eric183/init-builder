import Vue from "vue";
import Form from "./dynamic-form";
import Item from "./dynamic-form-item";
import InputNumber from "./input-number";

Vue.component("dynamic-input-number", InputNumber);
Vue.component("dynamic-form", Form);
Vue.component("dynamic-form-item", Item);
