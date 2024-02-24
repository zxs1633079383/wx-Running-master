<template>
	<view class="order">
		<van-tabs @click.once='checkTab' animated swipeable sticky>
			<van-tab title="发布订单" class="order-tab-page">
				<van-sidebar class="lock-position" :activeKey='publishActiveKey'>
					<van-sidebar-item @click='FBWM' title="外卖订单" dot />
					<van-sidebar-item @click='FBQT' title="其他订单" dot />
				</van-sidebar>
				<view class="order-content" v-show="publishSideNav">
					<view class="list-item" v-for="(i,index) in foodsPublishList" :key="index">
						<van-card
						  :price="i.sum_money"
						  :title="i.feeds.feed_name"
						  :thumb="i.feeds.url"
						  :tag="state[i.state]"
						  lazy-load
						>
						 <view slot='desc'>
						 	<text>下单时间:\n{{dateTime(i.createTime)}}</text><br>
						 	<text>预计送达时间:\n{{dateTime(i.deliveryTime)}}</text>
						 </view>
						</van-card>
					</view>
					<van-empty v-show='nullServerFood' description="暂无订单" />
				</view>
				<view class="order-content" v-show="!publishSideNav">
					<view class="list-item" v-for="(i,index) in otherPublishList" 
					 @click="goOtherDetail(i.content,i.order_state)"
					 :key="index">
						<van-card
						  :title='JSON.parse(i.content).className'
						  :price='JSON.parse(i.content).order_money'
						>
						  <view slot='desc' class="omit">
						  	<text>{{JSON.parse(i.content).explain.replace(/null/g, "")}}</text><br>
						  </view>
						  <view slot='price-top'>
						  	开始时间:{{dateTime(JSON.parse(i.content).expectTime)}}
						  </view>
						</van-card>
						<view class="tag">
							{{otherState[i.order_state]}}
						</view>
					</view>
					<van-empty v-show='nullServerFood' description="暂无订单" />
				</view>
			</van-tab>
			<van-tab title="服务订单" class="order-tab-page">
				<van-sidebar class="lock-position" :activeKey='serverActiveKey'>
					<van-sidebar-item @click='FWWM' title="外卖订单" dot />
					<van-sidebar-item @click='FWQT' title="其他订单" dot />
				</van-sidebar>
				<view class="order-content" v-show="serverSideNav">
					<view class="list-item"
					v-for="(i,index) in serverFoodList"
					:key="index"
					>
						<view @click='goPayDetail(i.cartId,i.state)'>
							<van-card
							  :title="i.storeName"
							  :thumb="i.schoolStoreFeeds.url"
							  :tag="state[i.state]"
							  lazy-load
							>
							<view slot='desc'>
								<text>下单时间:\n{{dateTime(i.createTime)}}</text><br>
								<text>预计送达时间:\n{{dateTime(i.deliveryTime)}}</text>
							</view>
							</van-card>
						</view>
						<view class="tag" v-if="i.state==3">
							<view class="iconfont icon-yiwancheng icon-style"></view>
						</view>
						<view class="tag" v-else>
							<van-button type="primary" @click='propValue1(i.cartId)' size="small">完成订单</van-button>
						</view>
					</view>
					<van-empty v-show='nullServerFood' description="暂无订单" />
				</view>
				<view class="order-content" v-show="!serverSideNav">
					<view class="list-item" v-for="(i,index) in serverOtherList" :key="index">
						<view @click="goOtherDetail(i.submitOrder.content,i.submitOrder.order_state)">
							<van-card
							  :title='JSON.parse(i.submitOrder.content).className'
							  :price='JSON.parse(i.submitOrder.content).order_money'
							>
							  <view class="omit" style="width: 400rpx;" slot='desc'>
							  	{{JSON.parse(i.submitOrder.content).explain.replace(/null/g, "")}}<br>
							  </view>
							  <view slot='price-top'>
							  	<text>开始时间:{{dateTime(JSON.parse(i.submitOrder.content).expectTime)}}</text>
							  </view>
							</van-card>
						</view>
						<view class="tag" v-if="i.submitOrder.order_state==2">
							<view class="iconfont icon-yiwancheng icon-style"></view>
						</view>
						<view class="tag" v-else>
							<van-button type="primary" size="small" @click='propValue2(i.id,i.submit_id)'>完成订单</van-button>
						</view>
					</view>
					<van-empty v-show='nullServerFood' description="暂无订单" />
				</view>
			</van-tab>
		</van-tabs>
		<van-overlay :show="finishOrder" @click="hideT">
		  <view class="wrapper">
			  <view class="contant">
			  	<text>是否确定已完成订单</text>
				<view style="height: 50rpx;"></view>
				<van-button type="primary" size="large" round color="linear-gradient(to right, #ff2950, #f64a06)"  @click='changeState'>确定</van-button>
			  </view>
		  </view>
		</van-overlay>
		<view class="loading" v-show="loadShow">
			<van-loading color="#1989fa" type="spinner" />
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
	import {Store} from '@/stores/counter.js'
	const store = Store()
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	// 状态
	let state = ['创建接单','暂无接单','派送中','已完成']
	let otherState = ['暂无接单','派送中','已完成']
	// 确定完成订单遮罩层
	const finishOrder = ref(false)
	// 遮罩层隐藏
	const hideT = ()=>{
		finishOrder.value=false
	}
	let cart_id = null
	let Id = null
	let submitId = null
	const propValue1 = (cartId)=>{
		finishOrder.value=true
		cart_id=cartId
	}
	const propValue2 = (id,submit_id)=>{
		finishOrder.value=true
		Id=id
		submitId=submit_id
	}
	const changeState = ()=>{
		if(cart_id){
			changeOrderState(cart_id)
			cart_id=null
		}else{
			updateOtherState(Id,submitId)
			Id = null
			submitId = null
		}
	}
	// 更新服务订单->外卖订单状态
	const changeOrderState = async(cartId)=>{
		finishOrder.value=false
		await request({
			url:'userCart/update/state/by/CartIdAndUserId',
			method:"POST",
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data:{
			  "cartId": cartId,
			  "state": 3
			}
		}).then(value=>{
			console.log(value);
			if(value.data.code===0){
				serverFoodList.value=[]
				FWWMCurrent = 1
				jieliu3=true
				FWWM()
			}
		})
	}
	// 更新服务订单->其他订单状态
	const updateOtherState = async(id,submit_id)=>{
		console.log(id,submit_id);
		finishOrder.value=false
		await request({
			url:'holdOrder/update/success',
			method:"POST",
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data:{
			  "id": id,
			  "submit_id": submit_id
			}
		}).then(value=>{
			if(value.data.code===0){
				serverOtherList.value=[]
				FWQTCurrent = 1
				jieliu4=true
				FWQT()
			}
		})
	}
	onLoad(()=>{
		//初始化
		FBWM()
	})
	// 导航栏切换
		let tab_index = 0
	const checkTab = (e)=>{
		tab_index=e.detail.index;
		if(tab_index==0){
			publishActiveKey.value=0
			foodsPublishList.value=[]
			otherPublishList.value=[]
			FBWMCurrent = 1
			FBQTCurrent = 1
			jieliu1=true
			jieliu2=true
			FBWM()
		}else if(tab_index==1){
			serverActiveKey.value=0
			serverFoodList.value=[]
			serverOtherList.value=[]
			FWWMCurrent = 1
			FWQTCurrent = 1
			jieliu3=true
			jieliu4=true
			FWWM()
		}
	}
	
	const loadShow = ref(false)
	// 下拉刷新
	onPullDownRefresh(()=>{
		jieliu1 = true
		jieliu2 = true
		jieliu3 = true
		jieliu4 = true
		foodsPublishList.value=[];
		FBWMCurrent = 1
		FBWM()
	})
	
	// 页数计数
	let FBWMCurrent = 1
	let FBQTCurrent = 1
	let FWWMCurrent = 1
	let FWQTCurrent = 1
	
	// 上拉刷新
	onReachBottom(async()=>{
		loadShow.value=true
		await setTimeout(()=>{
			loadShow.value=false
			if(tab_index==0&&publishActiveKey.value==0){
				console.log('发布外卖订单');
				FBWMCurrent++
				FBWM()
			}
			else if(tab_index==0&&publishActiveKey.value==1){
				console.log('发布其他订单');
				FBQTCurrent++
				FBQT()
			}
			else if(tab_index==1&&serverActiveKey.value==0){
				console.log('服务外卖订单');
				FWWMCurrent++
				FWWM()
			}
			else if(tab_index==1&&serverActiveKey.value==1){
				console.log('服务其他订单');
				FWQTCurrent++
				FWQT()
			}
		},800)
	})
	
	// 空数据显示
	const nullServerFood = ref(false)
	// 节流阀
	let jieliu1 = true
	
	// 侧边导航切换
	const publishSideNav = ref(true)
	const publishActiveKey = ref(0)
	// 发布外卖订单
	const foodsPublishList = ref([])
	const FBWM = async()=>{
		if(!publishSideNav.value&&publishActiveKey.value==1){
			foodsPublishList.value=[];
			jieliu1=true;
			FBWMCurrent = 1
		}
		publishSideNav.value=true
		publishActiveKey.value=0
		if(jieliu1){
			await request({
				url:'userCart/my/list/page/vo',
				method:"POST",
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				},
				data:{
				  "cartId": 0,
				  "current": FBWMCurrent,
				  "id": 0,
				  "isDelete": 0,
				  "num": 0,
				  "pageSize": 10,
				  "schoolId": 1,
				  "schoolStoreFeedId": 0,
				  "sortField": "createTime",
				  "sortOrder": "ascend",
				  "state": 4,
				  "sum_money": 0,
				  "user_id": store.userId
				}
			}).then(res=>{
				if(res.data.data.length==0) {
					jieliu1=false;
					console.log(res.data);
				}
				else{
					console.log('发布外卖订单:',res.data.data);
					foodsPublishList.value.push(...res.data.data)
					nullServerFood.value=false;
				}
				if(foodsPublishList.value.length==0)nullServerFood.value=true;
			})
		}
	}
	
	// 节流阀
	let jieliu2 = true
	// 发布其他订单
	const otherPublishList = ref([])
	const FBQT = async()=>{
		if(publishSideNav.value&&publishActiveKey.value==0){
			otherPublishList.value=[];
			jieliu2=true;
			FBQTCurrent=1;
		}
		publishSideNav.value=false
		publishActiveKey.value=1
		if(jieliu2){
			await request({
				url:'submitOrder/my/list/page/vo',
				method:"POST",
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				},
				data:{
				  "current":FBQTCurrent,
				  "id": "",
				  "isDelete": 0,
				  "order_state": 4,
				  "pageSize": 10,
				  "schoolId": 0,
				  "sortField": "",
				  "sortOrder": "",
				  "submit_index": 0,
				  "userId": store.userId
				}
			}).then(res=>{
				if(res.data.data.records.length==0) {
					jieliu2=false;
					console.log(res.data);
				}
				else{
					otherPublishList.value.push(...res.data.data.records)
					console.log('发布其他订单',res.data.data.records);
					nullServerFood.value=false;
				}
				if(otherPublishList.value.length==0) nullServerFood.value=true;
			})
		}
	}
	
	// 节流阀
	let jieliu3 = true
	// 侧边导航切换
	const serverSideNav = ref(true)
	const serverActiveKey = ref(0)
	// 服务外卖订单
	const serverFoodList = ref([])
	const FWWM = async()=>{
		if(!serverSideNav.value&&serverActiveKey.value==1){
			serverFoodList.value=[];
			jieliu3=true;
			FWWMCurrent=1;
		}
		serverSideNav.value=true
		serverActiveKey.value=0
		if(jieliu3){
			await request({
				url:'feedOrderCenter/my/holdOrder/list',
				method:"POST",
				data:{
				  "current": FWWMCurrent,
				  "pageSize": 10,
				  "id": 0,
				  "mpOpenId": "",
				  "sortField": "",
				  "sortOrder": "",
				  "unionId": "",
				  "userMoney": 0,
				  "userName": "",
				  "userProfile": "",
				  "userRole": ""
				},
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				}
			}).then(res=>{
				console.log(res);
				if(res.data.data==null) {
					jieliu3=false
					console.log(res.data);
				}
				else{
					serverFoodList.value.push(...res.data.data)
					nullServerFood.value=false;
				}
				if(serverFoodList.value.length==0){
					nullServerFood.value=true
				}
				console.log('服务外卖订单',serverFoodList.value);
			})
		}
	}
	
	// 节流阀
	let jieliu4 = true
	// 服务其他订单
	const serverOtherList = ref([])
	const FWQT = async()=>{
		if(serverSideNav.value&&serverActiveKey.value==0){
			serverOtherList.value=[];
			jieliu4=true;
			FWQTCurrent=1;
		}
		serverSideNav.value=false
		serverActiveKey.value=1
		if(jieliu4){
			await request({
				url:'holdOrder/my/hold/list',
				method:"POST",
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				},
				data:{
				  "current": FWQTCurrent,
				  "pageSize": 10
				}
			}).then(res=>{
				if(res.data.data==null) {
					jieliu4=false;
					console.log(res.data);
				}
				else{
					nullServerFood.value=false;
					serverOtherList.value.push(...res.data.data)
					console.log('服务其他订单',serverOtherList.value);
				}
				if(serverOtherList.value.length==0){
					nullServerFood.value=true;
				}
			})
		}
	}
	// 查看服务外卖订单详情
	const goPayDetail = (cartId,state)=>{
		console.log(state,cartId)
		let obj=null;
		if(state==2){
			obj = {
				cartId:cartId,
				state:state,
			}
		}
		uni.navigateTo({
			url:`/subpages/pay/pay?orderDetail=${encodeURIComponent(JSON.stringify(obj))}`
		})
	}
	// 查看其他订单详情
	const goOtherDetail= (content,state)=>{
		if(state<2){
			uni.navigateTo({
				url:`/subpages/publish/publish?content=${content}`
			})
		}
	}
	// 处理时间
	const dateTime = (i)=>{
		let date = new Date(i);
		let time = (parseInt(date.getMonth())+1).toString()+'月'+date.getDate()+'日'+date.getHours()+'时'+date.getMinutes()+'分'
		return time
	}
</script>

<style lang="scss">
.order{
	.order-tab-page{
		width: 100%;
		position: relative;
		.lock-position{
			width: 20%;
			position: absolute;
			left: 0;
		}
		.order-content{
			width: 80%;
			position: relative;
			left: 150rpx;
			.list-item{
				border:5rpx solid #dddddd;
				border-radius: 10rpx;
				position: relative;
				margin: 0 15rpx;
				margin-bottom: 10rpx;
				.tag{
					position: absolute;
					right: 12rpx;
					bottom: 20rpx;
					font-size: 20rpx;
					.icon-style{
						font-size: 80rpx;
						color: #d4237a;
					}
				}
			}
		}
	}
	.wrapper{
		width: 500rpx;
		height: 300rpx;
		background-color: #fff;
		border-radius: 30rpx;
		margin: 50%;
		transform: translateX(-50%);
		.contant{
			text-align: center;
			display: flex;
			flex-direction: column;
			padding: 50rpx;
			font-size: 40rpx;
		}
	}
}
</style>
