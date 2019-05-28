import Vue from 'vue'
import { Button, Radio, Input, message } from 'ant-design-vue'
import { LocaleProvider } from 'ant-design-vue'

Vue.use(LocaleProvider)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Input)

Vue.prototype.$message = message
