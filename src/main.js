import Vue from 'vue'
import App from "./App.vue"
import Multiselect from 'vue-multiselect'

import './plugins/bootstrap-vue'

import { BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import VueRouter from 'vue-router'

Vue.use(VueRouter)
// url router: http://localhost:8080/AppendixVisualiser/#/datafile?path=test.json

Vue.use(BootstrapVueIcons)


const router = new VueRouter([{ path: 'datafile', query: { path: 'private' } }])


new Vue({
	router,
	el: '#app',
	components: { App, Multiselect, BootstrapVueIcons},
	template: '<App/>'
})

