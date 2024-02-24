<template>
	<view class="talk">
		<view id='contant' class="talk-contant">
			<template v-for="(i,index) in chatList" :key="index">
				<view class="talk-contant-right talk-contant-style" v-if="i.user_id==store.userId">
					<view class="contant-value-r contant-value" v-if="i.content_type==0">
						<text>{{i.content}}</text>
					</view>
					<van-image
					  v-else
					  class="contant-value-image"
					  width="180rpx"
					  height="180rpx"
					  :src='i.content'
					  @click='LookImage(i.content)'
					/>
					<van-image
					  round
					  width="80rpx"
					  height="80rpx"
					  :src="i.user_img"
					/>
				</view>
				<view class="talk-contant-left talk-contant-style" v-else>
					<van-image
					  round
					  width="80rpx"
					  height="80rpx"
					  :src="i.user_img"
					/>
					<view class="contant-value contant-value-l" v-if="i.content_type==0">
						<text>{{i.content}}</text>
					</view>
					<van-image
					  v-else
					  class="contant-value-image"
					  width="180rpx"
					  height="180rpx"
					  :src='i.content'
					  @click='LookImage(i.content)'
					/>
				</view>
			</template>
		</view>
		<view id='bottom' style='height:120rpx'></view>
	</view>
	<view class="talk-bottom">
		   <input :focus='true' :maxlength='50' :confirm-hold='true' confirm-type='send' type="text" @blur="text_value" :value="msg_text">
		   <van-uploader :max-size='8388608' :value='fileList' multiple accept='image/*' @after-read='uploadImage' slot="right-icon">
			 <van-icon size='60rpx' name="photo-o" />
		   </van-uploader>
		   <van-button @click='send(0)' slot="button" size="small" type="primary">
		      发送
		   </van-button>
	</view>
	<van-overlay :show="show" @click="show=false">
		<view class="show-image">
			<image :src='showImage'></image>
		</view>
	</van-overlay>

</template>

<script setup>
	import {
		onReady,
		onLoad,
		onBackPress
	} from '@dcloudio/uni-app';
	import {
		ref,
		computed,
		onMounted
	} from 'vue';
	import {Store} from '@/stores/counter.js'
	import request from '../../request';
	const store = Store()
	import uuid from "../../utils/uuid";
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	let otherId = null
	let id = null
	//socket初始化
	const socket = null;
	const fileList = ref([])
	//日志
	const logManager = uni.getRealtimeLogManager()
	const log = logManager.tag('plugin-onUserTapSth')
	
	const uploadImage = (e)=>{
		console.log(e);
		readFileAsBase64(e.detail.file,(res)=>{
			fileList.value.push({
				url:res,
				name:e.name
			})
		})
	}
	const readFileAsBase64=(file,callback)=>{
		console.log(file);
		uni.getFileSystemManager().readFile({
			filePath:file[0].url,
			encoding:'base64',
			success(res){
				msg_text.value = res.data;
				console.log(res.data);
				send(1)
			},
			fail(err){
				console.log('读取失败');
			}
		})
	}
	onBackPress(()=>{
		console.log(1)
	})
	onLoad(async(option)=>{
		if('otherId' in option){
			otherId=option.otherId
		}
		console.log(store.userInfo);
		// 查询聊天是否创立
		await request({
			url:'chat/selectChatID_A_And_B',
			method:"POST",
			data:{
				"userA":store.userId,
				"userB":otherId
			},
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			}
		}).then(res=>{
			console.log(res.data);
			if(res.data.code==0){
				id=res.data.data
				getHistoryChat()
			}else{
				id=uuid()
			}
			
			//利始化socket
			socket = uni.connectSocket({
				url: `wss://runningcampujxls.com/api/websocket/${id}`,				
				// url:`ws://39.99.231.129:8121/api/websocket/${id}`,
				complete: () => {}		
			});
			uni.onSocketOpen((res)=>{
				log.info("open","socket连接打开")
				
				console.log("websocket连接已打开")
			})
			uni.onSocketClose((res)=>{
				log.error("error",`websocket 打开失败 请检查!: ${res}`)
				console.log("websocket 打开失败 请检查!")
			})
		})
	})
	onReady(()=>{
		scrollBottom()
	})
	// 获取用户输入文本
	const msg_text = ref('')
	const text_value = (e)=>{
		msg_text.value=e.detail.value.trim()
	}
	// 聊天内容渲染列表
	const chatList = ref([])
	// 渲染聊天记录
	const getHistoryChat = async()=>{
		request({
			url:'chat/toChatInnerByUserA_AndUserB',
			method:'POST',
			data:{
				"userA":store.userId,
				"userB":otherId
			},
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			}
		}).then(res=>{
			console.log(res.data.data);
			chatList.value=res.data.data
		})
	}
	// 图片点击展示开关
	const show = ref(false)
	// 所展示的图片
	const showImage = ref('')
	// 图片点击
	const LookImage = (url)=>{
		show.value=true
		showImage.value=url
	}
	//发送数据的标准
	const send = (type) => {
		let obj = {
			"chat_id": id,// 聊天室ID 用户A和用户B
			"user_id": store.userId,// 用户ID: 当前登录用户
			"user_img":store.userInfo.userAvatar,// 用户图片: 从pinna拿
			"user_name":store.userInfo.userName,//用户名称: 从pinna拿
			"content":msg_text.value,//聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
			"content_type": type,//聊天类型，0是普通文本，1是图片
			// sendSocketMessage为具体调用数据的方法
			//场景一 例如你发布了订单，你想去找到订单承接人去聊天，点击去聊天，应该获得 当前订单的承接人的用户ID。 然后填写到这里1
			//场景二 例你承接了某个订单 你想去和订单主人聊天，点击去聊天，应该获得当前订单的发布者的用户，填写到这里， ( 数中 已包合订单的发布者的用户ID 已实现)
			// 其他用户的ID
			"user_other": otherId
		}
		if(msg_text.value.length!=0) {
			sendSocketMessage(JSON.stringify(obj))
		}
		msg_text.value=''
	}

	//发送数据专属方法
	const sendSocketMessage=(message)=>{
		console.log(message)
		log.error("send", "socket主动发送数据: " + message)
		
		uni.sendSocketMessage({data: message})
	}

	//监听服务器推送的消息
	uni.onSocketMessage((res)=>{
		console.log('后台返回',JSON.parse(res.data));
		chatList.value.push(JSON.parse(res.data))
		scrollBottom()
	})
	//监听服务器关闭连接的事件
	uni.onSocketClose((res)=> {
		console.log("当前连接已关闭")
		log.error("close","当前连接已关闭: " + message)
	})
	//退出页面 移除session离开页面时调用该方法
	const deleteChat = ()=>{
		uni.closeSocket()
	}
	// 滚动至底部
	const scrollBottom = ()=>{
		uni.createSelectorQuery().select('#bottom').boundingClientRect(res=> {
			console.log(res);
			uni.pageScrollTo({
				scrollTop:res.bottom,
				duration:300
			})
		}).exec();
	}
</script>

<style lang="scss">
	.talk{
		width: 100%;
		background-color: #f1f1f1;
		.talk-contant{
			overflow: scroll;
			background-color: #f1f1f1;
			font-size: 35rpx;
			.talk-contant-style{
				padding-top: 20rpx;
				.contant-value{
					text-align: left;
					padding: 20rpx;
					color: #555555;
				}
			}
			.talk-contant-left{
				display: flex;
				justify-content: flex-start;
				padding-left: 20rpx;
				.contant-value-l{
					background-color: skyblue;
					border-radius: 0 30rpx 30rpx 30rpx;
					margin-left: 10rpx;
				}
			}
			.talk-contant-right{
				display: flex;
				justify-content: flex-end;
				padding-right: 20rpx;
				.contant-value-r{
					background-color: lightgreen;
					border-radius: 30rpx 0 30rpx 30rpx;
					margin-right: 10rpx;
				}
			}
			.contant-value-image{
				margin:0 10rpx;
			}
		}
	}
	.talk-bottom{
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: #fff;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		input{
			width: 60%;
			border-bottom: 1px solid #ccc;
		}
	}
	.show-image{
		margin-top: 50%;
	}

</style>
