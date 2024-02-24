<template>
	<view>
		<van-cell-group>
		  <van-field
		    placeholder="请输入真实姓名"
			label="姓名:"
			required
		    @blur='getUserName'
			:maxlength='6'
		  />
		  <van-field
		    label="手机:"
		    placeholder="请输入手机号"
			required
		    @blur='getPhone'
		    :maxlength='11'
			type='number'
		  />
		  <van-field
		    center
		    clearable
		    label="短信验证码"
			required
		    placeholder="请输入短信验证码"
			:maxlength='6'
			@blur='getCode'
		  >
		    <van-button slot="button" size="small" type="primary">
		      发送验证码
		    </van-button>
		  </van-field>
		</van-cell-group>
		<van-button type="primary" round size="large" @click='register'>注册</van-button>
		<van-overlay :show="showWarning">
		  <view class="wrapper">
			  <view class="contant">
			  	<text>{{msg}}</text>
			  </view>
		  </view>
		</van-overlay>
	</view>
</template>

<script setup>
import {
	onMounted,
	ref,
	computed
} from 'vue';

import {
	onReady,
	onLoad,
	onReachBottom
} from '@dcloudio/uni-app'
import { Store } from '../../stores/counter.js'
import request from '../../request/index.js';
const store =Store()
// 从本地获取存储的 Cookie
const storedCookie = uni.getStorageSync('sessionCookie');
let from = {
	name:null,
	phone:null,
	code:null
}

// 校验开关
let a =ref(true)

// 验证
const getUserName = (e)=>{
	if(e.detail.value.trim().length!=0){
		from.name=e.detail.value
		a.value=true
	}else{
		a.value=false
	}
}
var pattern =/^1[3456789]\d{9}$/;
const getPhone = (e)=>{
	if(pattern.test(e.detail.value)){
		from.phone=e.detail.value
		a.value=true
	}
	else{
		a.value=false
	}
}
const getCode = (e)=>{
	from.code = e.detail.value
}


//遮罩层开关
const showWarning=ref(false)
// 遮罩层消息
const msg = ref('')
// 发送注册请求
const register = async()=>{
	if(a.value){
		await request({
			url:'runningUser/add',
			method:"POST",
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data:{
				"name":from.name,
				"phone":from.phone,
				"userId":store.userId,
				"schoolId": 1,
			}
		}).then(res=>{
			if(res.data.code==0){
				msg.value='注册成功！'
				showWarning.value=true
				setTimeout(()=>{
					showWarning.value=false
					uni.switchTab({
						url:'/pages/index/index'
					})
				},1200)
			}else{
				msg.value='注册失败,请检查输入信息是否正确！'
				showWarning.value=true
				setTimeout(()=>{
					showWarning.value=false
				},800)
			}
		})
	}
}
</script>

<style lang="scss">
.wrapper{
	width: 500rpx;
	height: 300rpx;
	background-color: #fff;
	border-radius: 30rpx;
	margin: 50%;
	transform: translateX(-50%);
	display: flex;
	justify-content: center;
	align-items: center;
	.contant{
		text-align: center;
		padding: 50rpx;
		font-size: 40rpx;
	}
}
</style>
