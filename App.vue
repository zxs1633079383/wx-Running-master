<script setup>
	import {Store} from '@/stores/counter.js'
	import { onLaunch } from '@dcloudio/uni-app'
	const store = Store()
	onLaunch(()=> {
		console.log('App Launch')
	})
</script>

<style>
	@import "/wxcomponents/vant/common/index.wxss";
	@import '@/static/icon/iconfont.css';
	/*每个页面公共css */
	.icon{
		font-size: 60rpx !important;
		color: $uni-text-color;
	}
	li{
		list-style: none;
	}
	image{
		width: 100%;
	}
	.msg{
		width: 400rpx;
		height: 150rpx;
		line-height: 150rpx;
		padding: 20rpx;
		font-size:45rpx;
		text-align: center;
		opacity: .8;
		background-color: #ccc;
		border-radius: 30rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
	}
	.loading{
		text-align: center;
	}
	.omit{
		/* display: -webkit-box;    
		-webkit-box-orient: vertical;    
		-webkit-line-clamp: 1;    
		overflow: hidden; */
		white-space: nowrap;
		/* 强制不换行 */
		text-overflow: ellipsis;
		/* 超过部分省略号代替 */
		overflow: hidden;
		/* 必须同时设置overflow:hidden才能生效 */
	}
</style>