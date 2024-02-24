<template>
	<view class="user-center">
		<view class="user-top">
			<van-image
			  round
			  width="200rpx"
			  height="200rpx"
			  :src="userData.userAvatar"
			/>
			<view class="user-name">
				{{userData.userName}}
			</view>
		</view>
		<view class="user-service-list">
			<view class="service-style">
				<text>余额:{{userData.userMoney}}元</text>
			</view>
			<view class="service-style">
				<van-button @click="updateMe()">修改资料</van-button>
				<!-- <text>功能2</text> -->
			</view>
		</view>
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
	const store =Store()
	const userData = computed(()=> {return store.userInfo})
	console.log(userData.value);
	
	const updateMe = () =>{
		console.log("123")
		
		
		uni.navigateTo({
			url:`/subpages/updateme/updateme`
		})
	}
	
	
</script>

<style lang="scss">
.user-center{
	width: 100%;
	.user-top{
		height: 30vh;
		background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
		text-align: center;
		.van-image{
			padding: 30rpx 0;
		}
		.user-name{
			font-size: 30rpx;
		}
	}
	.user-service-list{
		height: 150rpx;
		margin-top: 10px;
		background-color: #e7e7e7;
		display: flex;
		justify-content:space-around;
		align-items: center;
		.service-style{
			width: 30%;
			text-align: center;
			padding: 40rpx;
			border-radius: 20rpx;
			background-color: #fff;
		}
	}
}
</style>