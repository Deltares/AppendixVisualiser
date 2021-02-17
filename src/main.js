import Vue from 'vue'
import App from "./App.vue"
import Multiselect from 'vue-multiselect'

import './plugins/bootstrap-vue'

import { BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

Vue.use(BootstrapVueIcons)


new Vue({
	el: '#app',
	components: { App, Multiselect, BootstrapVueIcons},
	template: '<App/>'
})

