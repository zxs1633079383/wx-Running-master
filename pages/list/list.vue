<template>
	<view class="list">
		<van-tabs @click='checkTab' animated swipeable sticky>
			<van-tab title="外卖订单">
				<view class="list-content">
					<view class="list-item" v-for="(i,index) in feedIndentList" :key="index">
						<van-card :price="i.money" :title="i.delivery_address" :thumb="i.user_head_img" lazy-load>
							<view @click="goDetail(i.cart_id,i.state+1)" slot='desc'>
								<text>下单时间:\n{{dateTime(i.createTime)}}</text><br>
								<text>送达时间:\n{{dateTime(i.delivery_time)}}</text>
							</view>
							<view slot="footer" class="comfrim-btn">
								<van-button type="primary" :disabled='i.user_id==store.userId'
									@click='receiveOrder(i.cart_id,i.user_id)'>接单</van-button>
							</view>
						</van-card>
					</view>
					<view class="loading" v-show="loadShow">
						<van-loading color="#1989fa" type="spinner" />
					</view>
				</view>
			</van-tab>
			<van-tab title="其他订单">
				<view class="list-content">
					<view class="list-item" v-for="(i,index) in otherIndentList" :key="index">
						<van-card :title='JSON.parse(i.content).className' :price='JSON.parse(i.content).order_money'
							lazy-load>
							<view slot='desc'>
								<text>{{JSON.parse(i.content).explain.replace(/null/g, "")}}</text><br>
								<text>开始时间:{{dateTime(JSON.parse(i.content).expectTime)}}</text>
							</view>
							<view slot="footer" class="comfrim-btn">
								<van-button type="primary" :disabled='i.userId==store.userId'
									@click.prevent='orderRequest(i.id,i.userId)'>接单</van-button>
							</view>
						</van-card>
					</view>
					<view class="loading" v-show="loadShow">
						<van-loading color="#1989fa" type="spinner" />
					</view>
				</view>
			</van-tab>
		</van-tabs>
	</view>
	<view class="msg" v-show="msg_reOr">
		接单成功
	</view>
</template>

<script setup>
	import {
		onReady,
		onLoad,
		onTabItemTap,
		onPullDownRefresh,
		onReachBottom,
		onHide
	} from '@dcloudio/uni-app';
	import {
		ref,
		computed
	} from 'vue';
	import {
		Store
	} from '@/stores/counter.js'
	import request from '@/request/index.js'
	import uuid from '../../utils/uuid';
	const store = Store()
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	// 节流开关
	let jieliu = true
	// 下拉刷新
	onPullDownRefresh(() => {
		jieliu = true
		if (index == 0) {
			geedCurrent = 1
			feedIndentList.value = []
			getfeedList(1)
		} else if (index == 1) {
			otherCurrent = 1
			otherIndentList.value = []
			getOtherList(1)
		}
	})
	// 当前tab被点击
	onTabItemTap((e) => {
		jieliu = true
		feedIndentList.value = []
		getfeedList(1)
	})
	// 上拉加载
	let geedCurrent = 1
	let otherCurrent = 1
	const loadShow = ref(false)
	onReachBottom(() => {
		console.log(1);
		if (index == 0) {
			geedCurrent++
			getfeedList(geedCurrent)
		} else if (index == 1) {
			otherCurrent++
			getOtherList(otherCurrent)
		}
	})
	// 切换订单列表
	// 记录两个订单选中
	let index = 0
	const checkTab = (e) => {
		console.log(e.detail.index);
		index = e.detail.index
		jieliu = true
		if (index == 0) {
			feedIndentList.value = []
			getfeedList(1)
		} else if (index == 1) {
			otherIndentList.value = []
			getOtherList(1)
		}
	}
	// 接单消息通知
	const msg_reOr = ref(false)
	// 外卖接单按钮请求
	const receiveOrder = async (cartId, orderId) => {
		await request({
			url: 'feedOrderCenter/update',
			method: 'POST',
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data: {
				"cart_id": cartId,
				"id": 0,
				"running_user_id": store.userId
			}
		}).then(res => {
			if (res.data.code == 0) {
				msg_reOr.value = true
				jieliu = true
				feedIndentList.value = []
				getfeedList(1)
				setTimeout(() => {
					msg_reOr.value = false
				}, 500)
				let id = null
				// 查询聊天是否创立
				request({
					url: 'chat/selectChatID_A_And_B',
					method: "POST",
					data: {
						"userA": store.userId,
						"userB": orderId
					},
					header: {
						'content-type': 'application/json',
						'Cookie': storedCookie
					}
				}).then(async res => {
					console.log(res.data);
					if (res.data.code == 0) {
						id = res.data.data
					} else {
						id = uuid()
					}


					//利始化socket
					await uni.connectSocket({
						url: `wss://runningcampujxls.com/api/websocket/${id}`,
						// url: `ws://39.99.231.129:8121/api/websocket/${id}`,
						complete: () => {}
					});
					uni.onSocketOpen((res) => {
						console.log("websocket连接已打开")
						let obj = {
							"chat_id": id, // 聊天室ID 用户A和用户B
							"user_id": store.userId, // 用户ID: 当前登录用户
							"user_img": store.userInfo.userAvatar, // 用户图片: 从pinna拿
							"user_name": store.userInfo.userName, //用户名称: 从pinna拿
							"content": '你好,我已接单。', //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
							"content_type": 0, //聊天类型，0是普通文本，1是图片
							"user_other": orderId
						}
						console.log(obj);
						let time1 = setTimeout(() => {
							uni.sendSocketMessage({
								data: JSON.stringify(obj)
							})
						}, 1000)
					})
					uni.onSocketClose((res) => {
						console.log("websocket 打开失败 请检查!")
					})
				
				})
			} else if (res.data.code = 40101) {
				uni.redirectTo({
					url: '/subpages/takeaway/takeaway'
				})
			}
		})
	}
	// 获取外卖订单列表
	const feedIndentList = ref([])
	const getfeedList = async (current) => {
		if (jieliu) {
			await request({
				url: 'feedOrderCenter/list/page',
				method: "POST",
				data: {
					"cart_id": 0,
					"current": current,
					"id": 0,
					"isDelete": 0,
					"pageSize": 10,
					"running_user_id": 0,
					"sortField": "",
					"sortOrder": "",
					"state": 0,
					"user_id": 0
				}
			}).then(res => {
				console.log('订单', res.data);
				if (res.data.data.records.length == 0) {
					jieliu = false
				} else {
					loadShow.value = true
					setTimeout(() => {
						loadShow.value = false
						feedIndentList.value.push(...res.data.data.records)
					}, 1000)
				}
			})
		}
	}
	// 其他业务接单请求  old
	const orderRequest = async (id, orderId) => {
		// 建立 WebSocket 连接

		// await uni.connectSocket({
		// 	url: `wss://runningcampujxls.com/api/websocket/${id}`,
		// 	// url: `ws://39.99.231.129:8121/api/websocket/${id}`,
		// 	complete: () => {console.log("socket 连接成功 complete connect")},
		// 	fail: () => {console.log("socket 连接失败 faile connect")},
		// });

		// console.log("成功");
		


		// uni.onSocketOpen((res) => {
		// 	console.log("websocket连接已打开")
		// 	let obj = {
		// 		"chat_id": id, // 聊天室ID 用户A和用户B
		// 		"user_id": store.userId, // 用户ID: 当前登录用户
		// 		"user_img": store.userInfo.userAvatar, // 用户图片: 从pinna拿
		// 		"user_name": store.userInfo.userName, //用户名称: 从pinna拿
		// 		"content": '你好,我已接单。', //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
		// 		"content_type": 0, //聊天类型，0是普通文本，1是图片
		// 		"user_other": orderId
		// 	}
		// 	console.log(obj);
		// 	uni.sendSocketMessage({
		// 		data: JSON.stringify(obj)
		// 	})
		// })
		// uni.onSocketClose((res) => {
		// 	console.log("websocket 打开失败 请检查!.", res)
		// })







		await request({
			url: 'submitOrder/update/togoQiang',
			method: 'POST',
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data: {
				"id": id,
				"isDelete": 0,
				"order_state": 1
			}
		}).then(async res => {
			if (res.data.code == 0) {
				msg_reOr.value = true
				jieliu = true
				otherIndentList.value = []
				getOtherList(1)
				setTimeout(() => {
					msg_reOr.value = false
				}, 500)
				let id = uuid()

				// 建立 WebSocket 连接
				await new Promise((resolve, reject) => {
					uni.connectSocket({
						url: `wss://runningcampujxls.com/api/websocket/${id}`,
						// url: `ws://39.99.231.129:8121/api/websocket/${id}`,
						complete: resolve,
						fail: reject
					});
				});

				uni.onSocketOpen((res) => {
					console.log("websocket连接已打开")
					let obj = {
						"chat_id": id, // 聊天室ID 用户A和用户B
						"user_id": store.userId, // 用户ID: 当前登录用户
						"user_img": store.userInfo.userAvatar, // 用户图片: 从pinna拿
						"user_name": store.userInfo.userName, //用户名称: 从pinna拿
						"content": '你好,我已接单。', //聊天内容: 即文本框中的内容 或者 图片(后期再考虑)
						"content_type": 0, //聊天类型，0是普通文本，1是图片
						"user_other": orderId
					}
					console.log(obj);
					uni.sendSocketMessage({
						data: JSON.stringify(obj)
					})
				})
				uni.onSocketClose((res) => {
					console.log("websocket 打开失败 请检查!.",res)
				})
			
			} else if (res.data.code = 40101) {
				uni.redirectTo({
					url: '/subpages/takeaway/takeaway'
				})
			}
		})
	}



	// 获取其他业务列表
	const otherIndentList = ref([])
	const getOtherList = async (current) => {
		if (jieliu) {
			request({
				url: 'submitOrder/my/list/page/vo',
				method: "POST",
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				},
				data: {
					"current": current,
					"id": "",
					"isDelete": 0,
					"order_state": 0,
					"pageSize": 10,
					"schoolId": 0,
					"sortField": "",
					"sortOrder": "",
					"submit_index": 0,
					"userId": 0
				}
			}).then(res => {
				console.log('其他订单', res.data);
				if (res.data.data.records.length == 0) {
					jieliu = false
				} else {
					loadShow.value = true
					setTimeout(() => {
						loadShow.value = false
						otherIndentList.value.push(...res.data.data.records)
					}, 1000)
				}
			})
		}
	}

	// 订单详情
	const goDetail = (cartId, state) => {
		let obj = {
			cartId: cartId,
			state: state,
		}
		uni.navigateTo({
			url: `/subpages/pay/pay?orderDetail=${encodeURIComponent(JSON.stringify(obj))}`
		})
	}

	//监听服务器关闭连接的事件
	uni.onSocketClose((res) => {
		console.log("当前连接已关闭")
	})
	onHide(() => {
		uni.closeSocket()
	})
	// 处理时间
	const dateTime = (i) => {
		let date = new Date(i);
		let time = (parseInt(date.getMonth()) + 1).toString() + '月' + date.getDate() + '日' + date.getHours() + '时' +
			date.getMinutes() + '分'
		return time
	}
</script>

<style lang="scss">
	.list {
		width: 100%;
		position: relative;

		.list-content {
			display: flex;
			justify-content: space-between;
			flex-direction: column;

			.list-item {
				background-color: #fafafa;
				margin: 8rpx;
				width: 90%;
				padding: 30rpx;
				border-bottom: 1px solid #ccc;
				border-radius: 45rpx;
				position: relative;

				.comfrim-btn {
					position: absolute;
					right: 10rpx;
					top: 50%;
				}
			}
		}
	}
</style>