<template>
	<div class="homePage">
		<!--<div class="public_container">
       <p>homePage 首页</p>
     </div> -->
		<div class="homecontent">
			<!--<h2>vue中插入Echarts示例</h2>
	    <div id="chart_example">-->

			<ul class="nav">
				<li style="background:#428fc5;">
					<div class="home_manager">
						<img src="../../assets/image/plan_manager.png" />
						<span>计划管理</span>
					</div>
				</li>
				<li style="background:#5da4da;">
					<div class="home_manager">
						<img src="../../assets/image/board2.png" />
						<span>看板管理</span>
					</div>
				</li>
				<li style="background:#7cbaeb;">
					<div class="home_manager">
						<img src="../../assets/image/flow2.png" />
						<span>决策管理</span>
					</div>
				</li>
				<li style="background:#99cbee;">
					<div class="home_manager">
						<img src="../../assets/image/rectangle13.png" />
						<span>添加应用</span>
					</div>
				</li>
			</ul>

			<!--<div class="echarts">
				<div class="echarts_left">
					<strong>部门(项目组)采购额</strong>
					<div id="chart_example"></div>
				</div>
				<div class="echarts_right">
					<strong>商品分类采购比例图</strong>
					<div id="chart_example_shop"></div>
				</div>

			</div>-->

		<!--</div>-->
	</div>

	</div>
</template>

<script>
	//import echarts from 'echarts'
	export default {
		name: "homePage",
		data() {
			return {

			};
		},
		components: {},
		created() {

		},
		mounted() {
//			this.echartsleft();
//			this.echartsright();
		},
		watch: {

		},
		methods: {
			/*
			echartsleft() {
				let this_ = this;
				let myChart = echarts.init(document.getElementById('chart_example'));
				let option = {
					color: ['#51ace3'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: [{
						type: 'category',
						data: ['行政部', '信息中心', '采购部', 'BOM组', 'QC组', ],
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value',
						name:'单位:万元'
					}],
					series: [{
						name: '每月花费',
						type: 'bar',
						barWidth: '60%',
						data: [5, 6.2, 3.5, 18, 12]
					}]
				};
				myChart.setOption(option);
				//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限
				window.addEventListener('resize', function() {
					myChart.resize()
				});
			},
			echartsright() {
				let this_ = this;
				let myChart = echarts.init(document.getElementById('chart_example_shop'));
				console.log(myChart)
				let option = {
//					color: ['#51ace3'],
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: ['软件开发', '研发设备', '固定资产', '办公用品']
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: [{
								value: 335,
								name: '软件开发'
							},
							{
								value: 310,
								name: '研发设备'
							},
							{
								value: 234,
								name: '固定资产'
							},
							{
								value: 135,
								name: '办公用品'
							}
						]
					}]
				};
				myChart.setOption(option);
				//建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限
				window.addEventListener('resize', function() {
					myChart.resize()
				});
			}
			*/
		}
	};
</script>

<style lang="scss" scoped>
	/*@import "../assets/css/index.scss";*/
	
	.homePage {
		background: #eaebf0;
	}
	
	h2 {
		text-align: center;
		padding: 30px;
		font-size: 18px;
	}
	
	#chart_example {
		/*width: 50%;*/
		height: 400px;
		/*border: 1px solid red;*/
		margin: 0 auto;
		margin-top: 10px;
	}
	#chart_example_shop{
		height: 400px;
		margin: 0 auto;
		margin-top: 10px;
	}
	.homecontent {
		ul.nav {
			width: 100%;
			display: flex;
			/*background: #ebeff2;*/
			li {
				width: 260px;
				height: 100px;
				margin-right: 20px;
				.home_manager {
					margin: 20px 50px;
					display: flex;
					img {
						margin-top: 5px;
					}
					span {
						font-size: 18px;
						color: #FFFFFF;
						margin-left: 15px;
						margin-top: 15px;
					}
				}
			}
			li:last-child {
				margin-right: 0;
			}
			li:hover {
				cursor: pointer;
			}
		}
	}
	
	.echarts {
		margin-top: 20px;
		width: 100%;
		display: flex;
		.echarts_left {
			background: #FFFFFF;
			border-radius: 4px;
			padding: 10px 10px;
			margin-right: 20px;
			width: 49%;
		}
		.echarts_right {
			background: #FFFFFF;
			border-radius: 4px;
			padding: 10px 10px;
			width: 49%;
		}
	}
</style>