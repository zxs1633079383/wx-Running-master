<template>
	<view class="detail">
		<image class="bgImg" :src="storeData.imageUrl"></image>
		<view class="detail-top">
			<van-nav-bar @click-left="onClickLeft" left-arrow :safe-area-inset-top='false'>
				<view class="detail-title" slot="title">
					<view>
						<text class="title-active">商品</text>
					</view>
					<view>
						<text>评价</text>
					</view>
				</view>
				<van-icon class="icon" name="search" slot="right" />
				<van-icon class="icon" name="phone-o" slot="right" />
				<van-icon class="icon" name="share-o" slot="right" />
			</van-nav-bar>
		</view>
		<view class="detail-card">
			<image :src="storeData.imageUrl" />
			<view class="card-top">
				<text>{{storeData.storeName}}&nbsp;</text>
				<van-button icon="plus" type="default" size='mini'>收藏</van-button>
			</view>
			<view class="collect">
				<view class="iconfont icon-wujiaoxing1"></view>&nbsp;{{storeData.score}}&nbsp;
				<text class="collect_font_style">配送约{{storeData.delivery_time}}分钟</text>
			</view>
			<view class="card-address">
				所在学校位置：{{storeData.address}}
			</view>
		</view>
		<view class="detail-contant">
			<van-sidebar>
				<van-sidebar-item v-for="(i,index) in goodsClassification" @click='class_good_id(i.category3id)' :key="index" :title="i.category3Name" />
			</van-sidebar>
			<view class="showGoods">
				<view class="goodsItem" v-for="i in storeDetail" :key="i.id">
					<van-card :tag="goodsSellState[i.feed_state]" :price="i.new_money" :origin-price="i.old_money"
						:desc="'已售出'+i.count+'份'" :title="i.feed_name" :thumb="i.url" v-if="i.state===0">
						<view slot="footer">
							<view class="add_cart_btn">
								<view class="add_text" @click="addCart(i)">
									<text>加入购物车</text>
								</view>
							</view>
						</view>
					</van-card>
				</view>
			</view>
		</view>
		<view class="detail_cart">
			<view class="cart-left" @click="showPopup">
				<view class="icon-gouwuche iconfont cart_icon" :class="{'icon-style':(cartList.length!=0)}"></view>
				<text class="cart-text" v-if="cartList==null||cartList.length===0">未选择商品</text>
				<text class="cart-text" v-else>已选择{{cartList.length}}件商品</text>
			</view>
			<view class="cart-right" :class="{'goPay-btn':cartList!=null}" @click="goPay(cartList!=null?cartList.length:0)">
				去结算
			</view>
		</view>
		<van-popup :show='show' position="bottom" custom-style="height: 60%;" round :overlay='show'>
			<view class="popup-top">
				<view class="popup-title">请选定数量</view>
				<van-icon size='50rpx' @click="onClose" name="cross" />
			</view>
			<view class="none-good" v-if="cartList==null||cartList.length==0">
				<van-empty
				  class="custom-image"
				  image="https://img.yzcdn.cn/vant/custom-empty-image.png"
				  description="请选择商品"
				/>
			</view>
			<van-card v-else
			v-for="(i,index) in cartList" 
			:key="index" 
			:price="i.sum_money" 
			:title="i.feeds.feed_name"
			:thumb="i.feeds.url">
				<view slot="footer">
					<van-button size="mini" @click='changeNum(-1,i)'>-</van-button>
					<text style="padding: 0 10rpx;background-color: #fff;">{{i.num}}</text>
					<van-button size="mini" @click='changeNum(1,i)'>+</van-button>
					<van-button size="mini" @click='delCartGood(i.schoolStoreFeedId)'>删除</van-button>
				</view>
			</van-card>
		</van-popup>
		<view class="addNotice" v-if="addNoticeBtn">
			<view class="icon-duigou iconfont" style="font-size: 80rpx;"></view>
			<view>
				已成功添加购物车
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onReady,
		onLoad,
		onShow,
		onReachBottom,
	} from '@dcloudio/uni-app';
	import {
		ref,
		computed
	} from 'vue';
	import {
		Store
	} from '@/stores/counter.js';
	import request from '@/request/index.js'
	import uuid from '@/utils/uuid.js';
	const store = Store()
	// 从本地获取存储的 Cookie
	const storedCookie = uni.getStorageSync('sessionCookie');
	//订单编号
	const cartId=ref(null)
	// 店铺数据
	const storeData = ref({})
	onLoad(async (options) => {
		if ('params' in options) {
		    storeData.value = JSON.parse(decodeURIComponent(options.params));
		}
		console.log(storeData.value);
		if(uni.getStorageSync(storeData.value.id)){
			// 初始化商品列表
			giveCartGoods()
		}else{
			// 生成订单编号
			cartId.value=uuid()
			uni.setStorageSync(storeData.value.id,cartId.value)
			// 初始化商品列表
			giveCartGoods()
		}
		// 初始化分类列表
		await store.getClassTitle({
			"category1Id": parseInt(storeData.value.category1Id),
			"category2Id": parseInt(storeData.value.id),
			"category3Name": "",
			"category3id": 0,
			"current": 0,
			"feed_name": "",
			"feed_state": 0,
			"id": 0,
			"isDelete": 0,
			"pageSize": 0,
			"sortField": "",
			"sortOrder": "",
			"state": 0
		})
		// 初始化商品数据
		await setTimeout(()=>{store.getStoreDetail({
			"category1Id": parseInt(storeData.value.category1Id),
			"category2Id": parseInt(storeData.value.id),
			"category3Name": "",
			"category3id": store.classData[0].category3id,
			"current": 1,
			"feed_name": "",
			"feed_state": 0,
			"id": 0,
			"isDelete": 0,
			"pageSize": 5,
			"sortField": "",
			"sortOrder": "",
			"state": 0
		})
		},1500)
	})
	// 返回首页
	const onClickLeft = async() => {
		let setArr = []
		for (let s of set) {
			setArr.push(s)
			console.log("缓存id为： " + s + "  商铺为： " + storeData.value.storeName);
		}
		uni.setStorageSync(storeData.value.storeName,setArr);
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
	// 店铺商品数据
	const storeDetail = computed(() => store.storeDetailData)
	console.log(storeDetail.value);
	// 店铺分类标题
	const goodsClassification = computed(() => store.classData)
	console.log(goodsClassification.value);
	// 获取购物车数据
	const cartList =ref([])
	// 请求购物车商品列表
	const giveCartGoods =async()=>{
		await request({
			url:'userCart/my/list/page/vo',
			method:'POST',
			header: {
				'content-type': 'application/json',
				'Cookie': storedCookie
			},
			data:{
			  "cartId": uni.getStorageSync(storeData.value.id),
			  "current": 1,
			  "id": 0,
			  "isDelete": 0,
			  "num": 0,
			  "pageSize": 10,
			  "schoolId": parseInt(storeData.value.category1Id),
			  "schoolStoreFeedId": 0,
			  "sortField": "",
			  "sortOrder": "",
			  "state": 0,
			  "sum_money": 0,
			  "userId": 0
			}
		}).then(value=>{
			cartList.value=value.data.data||null
			// console.log('购物车列表',cartList.value);
		})
	}
	//加入购物车
	const addNoticeBtn= ref(false);
	const set = new Set()
	const addCart = async(i) => {
		if(uni.getStorageSync(storeData.value.storeName)){
			console.log("缓存存在 当前商铺")
			uni.getStorageSync(storeData.value.storeName).forEach(i=>{
				set.add(i)
			})
		}
		console.log(i);
		// 加入购物车通知变化
		addNoticeBtn.value=true
		// console.log("即将判断set：",set)
		if(set.has(i.id)){
			changeNum(1,{schoolStoreFeedId:i.id,feeds:{new_money:i.new_money}})
		}else{
			set.add(i.id)
			await request({
				url:'userCart/add',
				method:'POST',
				data:{
					"cartId":uni.getStorageSync(storeData.value.id),
					"num":1,
					"schoolId":parseInt(i.category1Id),
					"schoolStoreFeedId": parseInt(i.id),
					"sum_money": i.new_money
				},
				header: {
					'content-type': 'application/json',
					'Cookie': storedCookie
				},
			}).then(value=>{
				console.log('添加到购物车消息',value);
				giveCartGoods()
				
			})
		}
		// console.log(set);
		await setTimeout(()=>addNoticeBtn.value=false,1000)
	}
	// 更新商品数量
	const changeNum = async(num1,i)=>{
		console.log(num1,i);
		await cartList.value.forEach(item=>{
			if(item.schoolStoreFeedId===i.schoolStoreFeedId&&(item.num+num1)>0){
				item.num+=num1;
				request({
					url:'userCart/update/by/Cart/Id',
					method:'POST',
					data:{
						"cartId":uni.getStorageSync(storeData.value.id),
						"num":item.num,
						"schoolId":parseInt(storeData.value.category1Id),
						"schoolStoreFeedId": parseInt(item.schoolStoreFeedId),
						"sum_money": (item.num*i.feeds.new_money),
						"userId": 0
					},
					header: {
						'content-type': 'application/json',
						'Cookie': storedCookie
					},
				}).then(value=>{
					console.log('修改购物车商品消息',value.data);
					giveCartGoods()
				})
			}
		})
	}
	//显示购物车弹出层
	const show = ref(false)
	const showPopup = () => {
		show.value = true
	}
	const onClose = () => {
		show.value = false
	}
	//取消商品
	const delCartGood=async(id)=>{
		await store.clearGood({
		  "cartId": uni.getStorageSync(storeData.value.id),
		  "feedId": id
		})
		giveCartGoods()
	}
	//前往支付
	const goPay = (length) => {
		if(length>0) {
			let obj={
				cartId:uni.getStorageSync(storeData.value.id),
				schoolId:parseInt(storeData.value.category1Id),
				storeName:storeData.value.storeName
			}
			uni.navigateTo({
				url:`/subpages/pay/pay?goodsStore=${encodeURIComponent(JSON.stringify(obj))}`
			})
		}
	}
	// 根据分类id更新商品列表
	const class_good_id = async(id)=>{
		await store.getStoreDetail({
			"category1Id": storeData.value.category1Id,
			"category2Id": parseInt(storeData.value.id),
			"category3Name": "",
			"category3id": id,
			"current": 1,
			"feed_name": "",
			"feed_state": 0,
			"id": 0,
			"isDelete": 0,
			"pageSize": 5,
			"sortField": "",
			"sortOrder": "",
			"state": 0
		})
	}
	// 商品火热情况
	const goodsSellState = ['热销中', '促销中', '已售空'];
</script>

<style lang="scss" scoped>

	.bgImg {
		width: 100%;
		height: 300rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.detail {
		width: 100%;
		position: relative;

		.detail-card {
			width: 88%;
			height: 240rpx;
			background-color: #fff;
			margin: 40rpx 50rpx;
			border-radius: 30rpx;
			box-shadow: -1px 3px 10px #ebebeb;
			position: relative;
			padding: 20rpx 20rpx 0 20rpx;

			image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 20rpx;
				position: absolute;
				right: 60rpx;
				top: -50rpx;
			}

			.card-top {
				font-size: 20px;
			}

			.collect {
				padding-top: 10rpx;
				font-weight: bold;
				color: #ffaa00;
				display: flex;
				justify-content: left;
				align-items: center;
				margin-bottom: 10rpx;

				.collect_font_style {
					font-weight: normal;
					color: #3d3d3d;
					font-size: 12px
				}
			}
			.card-address{
				font-size: 20rpx;
				color: #a6a6a6;
			}
		}

		.detail-top {
			height: 100rpx;

			::v-deep .van-nav-bar {
				background-color: transparent !important;
			}

			.detail-title {
				width: 50%;
				color: #ebebeb;
				display: flex;
				justify-content: space-around;

				view {
					box-sizing: border-box;

					text {
						padding-bottom: 15rpx;
					}
				}
			}

			.title-active {
				border-bottom: 2px solid #ebebeb;
			}
		}

		.detail-contant {
			position: relative;

			.showGoods {
				width: 80%;
				height: 100vh;
				background-color: #f0f0f0;
				position: absolute;
				top: 0;
				right: 0;
			}

			.add_cart_btn {
				position: absolute;
				bottom: 20rpx;
				right: 20rpx;
				color: #fff;
				border: 1px solid #ebebeb;
				border-radius: 10rpx;
				background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
				.add_text{
					padding: 10rpx;
				}
			}
		}

		.detail_cart {
			width: 100%;
			height: 100rpx;
			position: fixed;
			bottom: 0;
			background-color: #fff;
			border-top: 1px solid #f5f5f5;
			color: #c1c1c1;
			display: flex;
			justify-content: space-around;
			align-items: center;

			.cart-left {
				position: relative;

				.cart-text {
					padding-left: 150rpx;
					font-weight: bold;
				}

				.cart_icon {
					position: absolute;
					top: -80rpx;
					left: -20rpx;
					font-size: 150rpx;
				}
				.icon-style{
					color: #ff470f;
				}
			}

			.cart-right {
				border: 1px solid #c1c1c1;
				border-radius: 50rpx;
				padding: 20rpx 80rpx;
			}

			.goPay-btn {
				border: 1px solid #ff0000;
				color: #ff0000;
			}
		}
	}
	.popup-top{
		width: 100%;
		height: 100rpx;
		text-align: center;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1px solid #ccc;
		.popup-title{
			width: 80%;
			text-align: left;
			padding-left: 50rpx;
			font-size: 35rpx;
		}
	}
	.icon {
		font-size: 60rpx !important;
		color: #ebebeb;
	}
	.addNotice{
		width: 240rpx;
		height: 240rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 14px;
		border-radius: 20rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-70%);
		background-color: #4c4c4c;
		color:#fff;
		text-align: center;
		opacity: .9;
	}
</style>