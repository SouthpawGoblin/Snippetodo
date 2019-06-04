import Vue from 'vue'
import { Button, Radio, Checkbox, Input, Alert, message } from 'ant-design-vue'
import { LocaleProvider } from 'ant-design-vue'

Vue.use(LocaleProvider)
Vue.use(Button)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Alert)

Vue.prototype.$message = message
