import Vue from 'vue'
// 按需导入组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 挂载element的消息提醒
Vue.prototype.$message = Message
