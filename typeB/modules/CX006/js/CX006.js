var resultContent = mui('.resultInfo')[0];
var startCityEle = document.getElementById('startStationCity');
var arriveCityEle = document.getElementById('arriveStationCity');
var searchButton = document.getElementById('searchButton');
var toTopButton = mui('.topButton')[0];
var stationPopover = document.getElementById('stationPopoverView');
var startCity = '';
var arriveCity = '';
var selectFlg = '清空筛选';
var resultData;

/**
 * CX005 画面初始化
 */
function initializeCX006() {
	console.log(resultData == undefined);
	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		document.getElementById(event.detail.triggerId).innerHTML = event.detail.loc;
		document.getElementById(event.detail.triggerId).style.color = '#000000';
		clearResult();
	});
	//选择站点点击事件
	mui('.search-key').on('tap', '.search-tips', function() {
		var triggerId = this.id;
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					triggerId: triggerId
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});
	//交换按钮点击事件
	mui('.search-key').on('tap', '#exchangeCity', function() {
		var exchangeEle = '';
		exchangeEle = startCityEle.innerHTML;
		startCityEle.innerHTML = arriveCityEle.innerHTML;
		arriveCityEle.innerHTML = exchangeEle;
		clearResult();
	});
	//查询按钮点击事件
	searchButton.addEventListener('tap', function() {
		if (startCityEle.innerHTML == '请选择城市' || arriveCityEle.innerHTML == '请选择城市') {
			mui.toast('始末城市不能为空');
			return;
		}
		startCity = startCityEle.innerHTML;
		arriveCity = arriveCityEle.innerHTML;
		//清空查询结果
		clearResult();
		findResult(startCity, arriveCity);
		//		findResult('上海', '南京');
	});
	//点击按钮回到顶端
	toTopButton.addEventListener('tap', function() {
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 200)
	});
	//按时间排序事件绑定
	document.getElementById('sortByTime').addEventListener('tap', function() {
		if (this.innerText.substr(-1) == '▲') {
			this.innerText = '按发车时间排序 ▼';
			dealResult(resultData, 1, selectFlg);
			setSelector(resultData);
		} else {
			this.innerText = '按发车时间排序 ▲';
			dealResult(resultData, 0, selectFlg);
		}
	});
	//按站点筛选
	mui('#stationPopoverView').on('tap', '.mui-table-view-cell', function() {
		selectFlg = this.innerText;
		dealResult(resultData, 0, selectFlg);
		mui('.mui-popover').popover('toggle');
	})
}

/**
 * 滚动到500位置时显示返回顶端按钮
 */
window.onscroll = function() {
	if (document.body.scrollTop > 300) {
		toTopButton.style.display = 'block';
	} else {
		toTopButton.style.display = 'none';
	}
}

/**
 * 根据两地城市查询长途车信息
 * 
 * @param String startPos 始发城市
 * @param String arrivePos 终点城市
 */
function findResult(startPos, arrivePos) {
	addDisabled();
	mui.ajax(serverAddr + '/travel/longDBus', {
		data: {
			from: startPos,
			to: arrivePos
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//			console.log(JSON.stringify(requestData));
			if (requestData == null) {
				mui.toast('没有找到匹配的线路');
				cancelDisabled();
			} else {
				resultData = requestData;
				setTimeout(function() {
					dealResult(resultData, 0, selectFlg);
					setSelector(resultData);
				}, 200);
				cancelDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得长途车信息', '重试', function() {
				findResult(startPos, arrivePos);
			});
		}
	});
}

/**
 * 处理查询结果
 * 
 * @param JSON dataInfo 查询结果
 * @param String orderFlg 时间排序标志
 * @param String keyWord 筛选条件
 */
function dealResult(dataInfo, orderFlg, keyWord) {
	if (dataInfo == undefined) {
		mui.toast('出现未知错误，请重试');
		return;
	}
	var returnInner = '';
	var startInner = '';
	var endInner = '';
	for (curIndex in dataInfo.result.list) {
		if (orderFlg == 0) {
			startInner = returnInner;
		} else {
			endInner = returnInner;
		}
		if (keyWord == '清空筛选' || keyWord == dataInfo.result.list[curIndex].start) {
			returnInner = startInner +
				'<div class="result-block">' +
				'	<p class="timeInfo">' +
				dataInfo.result.list[curIndex].date +
				'	</p>' +
				'	<div class="mui-row padding-20-l padding-5-t">' +
				'		<div class="mui-col-xs-7">' +
				'			<div class="mui-row">' +
				'				<div class="start-circle float-left">' +
				'					<span class="circle-text">始</span>' +
				'				</div>' +
				'				<div class="font-w300-s18 float-left padding-10-l">' +
				dataInfo.result.list[curIndex].start +
				'				</div>' +
				'			</div>' +
				'			<div class="mui-row" style="padding-top: 3px;">' +
				'				<div class="arrive-circle float-left">' +
				'					<span class="circle-text">终</span>' +
				'				</div>' +
				'				<div class="font-w300-s18 float-left padding-10-l">' +
				dataInfo.result.list[curIndex].arrive +
				'				</div>' +
				'			</div>' +
				'		</div>' +
				'		<div class="mui-col-xs-5 align-right">' +
				'			<p class="priceInfo">￥' +
				dataInfo.result.list[curIndex].price.replace('元', '') +
				'			</p>' +
				'		</div>' +
				'	</div>' +
				'</div>' +
				endInner;
		}
	}
	resultContent.innerHTML = '<p class="font-w500-s16" style="margin-bottom: 3px;">查询结果</p>' + returnInner;
	resultContent.style.border = '#DDDDDD solid 1px';
	document.getElementById('fixedLayer').style.display = 'block';
}

/**
 * 设置筛选 popover
 * 
 * @param JSON dataInfo
 */
function setSelector(dataInfo) {
	var station = []
	for (curIndex in dataInfo.result.list) {
		if (stationPopover.innerHTML.indexOf(dataInfo.result.list[curIndex].start) == -1) {
			stationPopover.innerHTML +=
				'<li class="mui-table-view-cell">' + dataInfo.result.list[curIndex].start + '</li>';
		}
	}
}

/**
 * 清空查询结果
 */
function clearResult() {
	resultContent.innerHTML = '';
	resultContent.style.border = '';
	document.getElementById('fixedLayer').style.display = 'none';
}

/**
 * 禁止用户操作
 */
function addDisabled() {
	searchButton.disabled = true;
	mui('.search-key').off('tap', '.search-tips');
	mui('.search-key').off('tap', '#exchangeCity');
}

/**
 * 解除禁止用户操作
 */
function cancelDisabled() {
	searchButton.disabled = false;
	mui('.search-key').on('tap', '.search-tips', function() {
		var triggerId = this.id;
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					triggerId: triggerId
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});
	mui('.search-key').on('tap', '#exchangeCity', function() {
		var exchangeEle = '';
		exchangeEle = startCityEle.innerHTML;
		startCityEle.innerHTML = arriveCityEle.innerHTML;
		arriveCityEle.innerHTML = exchangeEle;
		clearResult();
	});
}