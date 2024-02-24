import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '@/request/index.js'

export const Store = defineStore('counter',()=>{
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	// 存储用户头像和昵称
	const userInfo = ref({})
	const userId = null
	// 轮播图数据
	const LBList = ref([])
	const getLBData =(obj)=>{
		request({
			...obj
		}).then((value)=>LBList.value=value.data.data.records)
	}
	// 店铺列表数据
	const schoolStoreList = ref([])
	const getSchoolStoreData = async(obj)=>{
		await request({
			url:'schoolStore/list/page',
			method:'POST',
			data:obj
		}).then(value=>{
			if(value.data.data.records.length!=0) {
				schoolStoreList.value.push(...value.data.data.records)
			}
		})
	}
	// 店铺详情页数据
	const storeDetailData = ref([]);
	const getStoreDetail = async(obj)=>{
		await request({
			url: 'schoolStoreFeeds/list/page',
			method: 'POST',
			data:obj
		}).then(value=>{
			storeDetailData.value=value.data.data.records
		})
	}
	// 获取商品分类标题
	const classData=ref([])
	const getClassTitle = (obj)=>{
		request({
			url:'schoolStoreFeeds/toList/ByLeftTarbar',
			method:'POST',
			data:obj
		}).then(value=>{
			classData.value=value.data.data||null
			console.log(value);
		})
	}
	// 删除购物车某一项商品
	const clearGood = async(obj)=>{
		await request({
			url:'userCart/delete/ByCartIdAndFeedId',
			method:"POST",
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data:obj
		}).then(value=>{
			console.log('删除成功',value);
		})
	}
	return {
		LBList,
		userInfo,
		userId,
		getLBData,
		schoolStoreList,
		getSchoolStoreData,
		storeDetailData,
		getStoreDetail,
		classData,
		getClassTitle,
		clearGood
	}
})