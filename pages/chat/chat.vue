<template>
	<view class="chat">
		<view class="chat-contant">
			<view class="chat-item" v-for="(i,index) in ChatList" :key="index" 
			@click="goConversation(i.user_id)">
				<van-image
				  width="100rpx"
				  height="100rpx"
				  fit="cover"
				  :src="i.user_img"
				/>
				<view class="item-value">
					<view class="userName">
						<text>{{i.user_name}}</text>
					</view>
					<view class="chat-value1 omit">
						xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
					</view>
				</view>
				<view class="final_time">
					星期四-12:03
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onReady,
		onLoad,
		onTabItemTap,
		onPullDownRefresh,
		onReachBottom
	} from '@dcloudio/uni-app';
	import {
		ref,
		computed
	} from 'vue';
	import request from '../../request';
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	onLoad(()=>{
		getChatData()
	})
	
	// 聊天记录列表
	const ChatList= ref([])
	// 获取聊天记录列表数据
	const getChatData = async()=>{
		await request({
			url:'chat/my/chat/list',
			method:'POST',
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			}
		}).then(res=>{
			console.log(res.data.data);
			ChatList.value=res.data.data
		})
	}
	const goConversation=(otherId)=>{
		uni.navigateTo({
			url:`/subpages/conversation/conversation?otherId=${otherId}`
		})
	}
</script>

<style lang="scss">
.chat{
	width: 100%;
	height: 100vh;
	overflow: scroll;
	display: flex;
	flex-direction: column;
	.chat-item{
		height: 60%;
		padding: 10rpx;
		border-bottom:1px solid #e8e8e8;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.item-value{
			width: 65%;
			margin-left: 20rpx;
			.userName{
				width: 50%;
				font-size: 40rpx;
				font-weight: bold;
			}
			.chat-value1{
				width: 400rpx;
				font-size: 30rpx;
				color: #b3b3b3;
			}
		}
		.final_time{
			font-size: 20rpx;
			color: #b3b3b3;
		}
	}
	.van-image{
		display: block;
	}
}
</style>
