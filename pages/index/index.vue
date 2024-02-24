<template>
	<view class="page-container">
		<!-- 学校 -->
		<view class="schoolSelect">
			<view class="iconfont icon-24gl-school icon"></view>
			<text class="schoolText">请选择所在学校</text>
		</view>
		<!-- 轮播图 -->
		<view class="uni-margin-wrap">
			<swiper style="height: 100%;" class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item v-for="(item,index) in imageList" :key="item.id">
					<view class="swiper-item-img">
						<image mode="widthFix" :src="item.imageUrl" ></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 站点公告 -->
		<view class="view-index-zdgg">
			<van-notice-bar
			  left-icon="volume-o"
			  text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
			/>
		</view>
		
		<!-- grid 布局 -->
		<view class="view-index-grid">
			<!-- grid 布局 默认每行4个元素 -->
			<van-grid square icon-size="20px">
				<van-grid-item use-slot text="校园外卖"
				@click='scrollStore'
				>
					<view class="iconfont icon-meituan style_icon" />
					<view class="service_text">
						校园外卖
					</view>
				</van-grid-item>
				<van-grid-item use-slot 
				v-for="(i,index) in businessList"
				@click='goPublish(index)'
				:text="i.business"
				:key="index">
					<view class="iconfont style_icon" :class="`${i.type}`" />
					<view class="service_text">
						{{i.business}}
					</view>
				</van-grid-item>
				<van-grid-item use-slot text="代扫卫生" >
					<view class="iconfont icon-LiquidationOfAssets style_icon" />
					<view class="service_text">
						代扫卫生
					</view>
				</van-grid-item>
			</van-grid>
		</view>
		
		<!-- 首页中间的两个按钮 -->
		<view class="index-buttton-index">
			<view class="button-container-fb">
				<van-button round class="center-button" size="normal" type="primary">平台客服</van-button>
				<van-button round @click='goRecruit' class="center-button" type="primary">兼职应聘</van-button>
			</view>
		</view>
		
		<!-- 全部店铺 tabbar -->
		<view class="store-tabbar" >
			<view class="all-store-font" id="anchor">
				<text>全部店铺</text>
			</view>

			<!-- 下方紫色, 我这边采用进度条组件 ：  问题： 还不如设置一个button 高度低一些， 然后背景颜色+ 圆角矩形 -->
			<view class="view-jdt"></view>

			<!-- 按钮排序条件  -->
			<view class="flex-common">
				<view class="view-all-store-button"><text>营业状态</text></view>
				<view class="view-all-store-button"><text>单量排序</text></view>
				<view class="view-all-store-button"><text>优惠活动</text></view>
				<van-dropdown-menu>
				  <van-dropdown-item :value="value" :options="options" />
				</van-dropdown-menu>
			</view>
		</view>

		<!-- 店铺列表 -->
		<view class="card-common"
		v-for="(i,index) in StoreList" :key="index"
		@click="goDetail(i)"
		>
			<view class="store-state">
				<view class="triangle">
				</view>
				{{ stateList[i.state] }}
			</view>
			<van-card :desc="i.address" :title="i.storeName"
				:thumb="i.imageUrl">
				<view slot="price-top">
					<view class="collect">
						<view class="iconfont icon-wujiaoxing1"></view>&nbsp;{{i.score}}	
					</view>
				</view>
				<view class="card-price" slot="price">
					<view class="price_style">
						起价：<text style="color: #ff0000;font-size: 14px;">￥{{i.start_price}}</text>
						配送：<text style="color: #ff0000;font-size: 14px;">￥{{i.delivery_price}}</text>
					</view>
					<view class="good-time">
						{{i.delivery_time}}分钟
					</view>
				</view>
				<view slot="bottom">
					优惠
				</view>
			</van-card>
		</view>
		<view class="loading" v-show="loadShow">
			<van-loading color="#1989fa" type="spinner" />
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
	
	// 业务列表
	const businessList = ref([
		{
			business:'代取快递',
			type:'icon-rentou'
		},
		{
			business:'代拿外卖',
			type:'icon-tubiaozhizuomoban2-01'
		},
		{
			business:'代写笔记',
			type:'icon-biji'
		},
		{
			business:'超市代购',
			type:'icon-fuwuchaoshi'
		},
		{
			business:'校园跑腿',
			type:'icon-pao'
		},
		{
			business:'校园代跑',
			type:'icon-tiyu-qipao'
		},
		{
			business:'帮搬东西',
			type:'icon-iconfont_loadingbay'
		},
		{
			business:'代替上课',
			type:'icon-tongxueshangke-'
		},
		{
			business:'代替查寝',
			type:'icon-Dorm'
		},
		{
			business:'替试/补考',
			type:'icon-a-kaoshi1'
		},
	])
	
	//轮播图
	//圆点
	const indicatorDots = ref(true)
	//自动切换
	const autoplay = ref(true)
	// 自动切换时间
	const interval = 3000
	// 滑动动画时长
	const duration = 500
	// 轮播图数据
	const imageList =computed(()=>store.LBList)
	
	// 排列多选框
	const value = ref(0)
	const options=[
		{ text: '默认排序', value: 0 },
		{ text: '好评排序', value: 1 },
		{ text: '销量排序', value: 2 },
	]
	
	
	const storeCard = ref(null)
	// 滚动至店铺
	const scrollStore = ()=>{
		wx.createSelectorQuery().select(`#anchor`).boundingClientRect(rect => {
			console.log(rect);
			wx.pageScrollTo({ scrollTop: rect.top, duration: 300, });
		}).exec();
	}
	
	
	// 店铺数据
	const StoreList = computed(()=>store.schoolStoreList)
	// 状态列表
	const stateList = ['营业中','打样','暂停']
 	onMounted(async ()=> {
		// 初始化轮播图数据
		await store.getLBData({
			url:'bannerImage/list/page',
			method:'POST',
			data:{
				"createTime": "",
				"current": 0,
				"id": 0,
				"imageName": "",
				"imageUrl": "",
				"isDelete": 0,
				"pageSize": 5,
				"schoolId": 1,
				"sortField": "",
				"sortOrder": "",
				"state": 0,
				"user_id": 0
			}
		})
		// 初始化店铺数据
		await store.getSchoolStoreData({
			"address": "",
			"category1Id": 0,
			"current": current,
			"delivery_price": 0,
			"delivery_time": 0,
			"id": 0,
			"isDelete": 0,
			"pageSize": 5,
			"score": 0,
			"sortField": "",
			"sortOrder": "",
			"start_price": 0,
			"state": 0,
			"storeName": ""
		})
		console.log(store.schoolStoreList);
	}),

	// 加载完毕
	onLoad(async() => {
		uni.getProvider({
		    service: 'oauth', //oauth授权登录
		    success: function (res) {  //成功的回调
		        if (res.provider.includes('weixin')) {
		            uni.login({
		                provider: 'weixin', //provider	Array	得到的服务供应商
		                success: (res)=>{
							if(res.code){
								uni.request({
									// url:'http://39.99.231.129:8121/api/user/login/wx_open',
									url:'https://www.runningcampujxls.com/api/user/login/wx_open',
									data:{
										code:res.code
									},
									method:'GET',
									success: (res) => {
										// 获取登录成功后的 Set-Cookie 头信息
										const setCookieHeader = res .header['Set-Cookie'];
										//将 Set-cookie 头信息存储在本地
										uni.setStorageSync('sessionCookie',setCookieHeader);
										store.userInfo=res.data.data
										store.userId=res.data.data.id
									},
									fail(){
										console.log('登录请求发送失败');
									}
								})
							}
							else{
								console.log('登录失败',res.errMsg);
							}
						},
						fail(){
							console.log('授权失败');
						}
		            });
		        }
		    }
		});
	})
	//下拉底部
	let loadShow = ref(false)
	let current = 1
	onReachBottom(async()=>{
		loadShow.value=true;
		await setTimeout(()=>{
			loadShow.value=false;
			current++;
			store.getSchoolStoreData({
				"address": "",
				"category1Id": 0,
				"current": current,
				"delivery_price": 0,
				"delivery_time": 0,
				"id": 0,
				"isDelete": 0,
				"pageSize": 5,
				"score": 0,
				"sortField": "",
				"sortOrder": "",
				"start_price": 0,
				"state": 0,
				"storeName": ""
			});
		},1000)
	})
	//跳转详情
	const goDetail=(i)=>{
		let obj ={
			category1Id:i.category1Id,
			imageUrl:i.imageUrl,
			score:i.score,
			storeName:i.storeName,
			delivery_time:i.delivery_time,
			id:i.id,
			address:i.address
		}
		let params = encodeURIComponent(JSON.stringify(obj));
		uni.navigateTo({
			url:`/subpages/detail/detail?params=${params}`,
			animationType: 'pop-in',
			animationDuration: 200
		})
	}
	// 跳转跑腿注册页
	const goRecruit =()=>{
		uni.redirectTo({
			url:'/subpages/takeaway/takeaway'
		})
	}
	// 跳转业务表单
	const goPublish=(index)=>{
		index++
		uni.navigateTo({
			url:`/subpages/publish/publish?index=${index}`
		})
	}
</script>


<style scoped lang="scss">

	// 设置单页面背景色
	.page-container {
		width: 100%;
		background-color: #efeef1;
		//学校选择
		.schoolSelect{
			background-color: #fff;
			display: flex;
			justify-content: left;
			align-items: center;
			padding-left: 30rpx;
			.schoolText{
				font-size: 14px;
				color: $uni-text-color;
			}
		}
		// 轮播图
		.uni-margin-wrap{
			padding: 20rpx;
			height: 350rpx;
		}
		// 站点公告
		.view-index-zdgg {
			padding-bottom: 10rpx;
		}
		// grid服务模块样式
		.view-index-grid {
			
			.service_text{
				font-size: $uni-font-size-sm;
				color:$uni-text-color;
			}
		}
		.style_icon{
			font-size: 60rpx;
			color: $uni-color-primary;
			padding-bottom: 15rpx;
		}
		//两个按钮的属性设置
		.index-buttton-index {
			
			.button-container-fb{
			padding: 20rpx 0;
			// height: 100%;
			display: flex;
			justify-content:space-around;
			align-items: center;
			.center-button{	
			}
			}
		}
		// 全部店铺 
		.store-tabbar{
			background-color: #fff;
			text-align: center;
			//全部店铺样式
			.all-store-font{
				color: #826fe3;
			}
			// 进度条
			.view-jdt{
				margin-left: 10%;
				width: 80%;
				border: 2px solid #826fe3;
				background-color: #826fe3;
			}
			.flex-common{
				display: flex;
				justify-content: space-around;
				align-items: center;
				.view-all-store-button {
					width: 33%;
					padding: 14px 0;
					box-shadow: .5px .1px 1px #ccc;
					text{
						font-size: 14px;
						color: #323233;
					}
				}
			}
		}
		.view-common{}
	}
	//店铺列表
	// 顶部间隔
	.card-common {
		margin-top: 1vh;
		position: relative;
		.store-state{
			font-size: 12px;
			text-align: center;
			padding: 5rpx;
			border:5rpx solid seagreen;
			color: seagreen;
			position: absolute;
			top:15rpx;
			right: 15rpx;
			z-index: 9;
			.triangle {
			    width: 0;
			    height: 0;
			    border: 15rpx solid;
			    border-color: transparent transparent seagreen transparent;
				position: absolute;
				left: 20rpx;
				top: -30rpx;
			}
		}
		.collect{
			width: 25rpx;
			height: 25rpx;
			font-weight: bold;
			color: #ffaa00;
			display: flex;
			justify-content: left;
			align-items: center;
			margin-bottom: 10rpx;
		}
		.card-price{
			display: flex;
			justify-content: space-between;
			.price_style{
				font-size: 10px;
				color:$uni-text-color-disable;
			}
			.good-time{
				font-size: 14px;
				color: #323233;
			}
		}

	}
</style>