var resultContent = mui('.resultInfo')[0];
var startCityEle = document.getElementById('startStationCity');
var arriveCityEle = document.getElementById('arriveStationCity');
var searchButton = document.getElementById('searchButton');
var startCity = '';
var arriveCity = '';

/**
 * CX005 画面初始化
 */
function initializeCX006() {
	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		document.getElementById(event.detail.triggerId).innerHTML = event.detail.loc;
		document.getElementById(event.detail.triggerId).style.color = '#000000';
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
	document.getElementById('exchangeCity').addEventListener('tap', function() {
		var exchangeEle = '';
		exchangeEle = startCityEle.innerHTML;
		startCityEle.innerHTML = arriveCityEle.innerHTML;
		arriveCityEle.innerHTML = exchangeEle;
		resultContent.innerHTML = '';
		resultContent.style.border = '';
	});
	//查询按钮点击事件
	searchButton.addEventListener('tap', function() {
		//		if (startCityEle.innerHTML == '请选择城市' || arriveCityEle.innerHTML == '请选择城市') {
		//			mui.toast('始末城市不能为空');
		//			return;
		//		}
		startCity = startCityEle.innerHTML;
		arriveCity = arriveCityEle.innerHTML;
		//清空查询结果
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		//		findResult(startCity, arriveCity);
		findResult('上海', '南京');
	});
}

function findResult(startPos, arrivePos) {
	//addDisabled();
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
				//cancelDisabled();}
			} else {
				var contentStr = '';
				contentStr += '<p class="font-w500-s16" style="margin-bottom: 3px;">查询结果</p>';
				for (var i = 0; i < requestData.result.list.length; i++) {
					contentStr += '<div class="result-block"><p class="timeInfo">';
					contentStr += requestData.result.list[i].date + '</p>';
					contentStr += '<div class="mui-row padding-20-l padding-5-t">';
					contentStr += '<div class="mui-col-xs-7"><div class="mui-row">';
					contentStr += '<div class="start-circle float-left">';
					contentStr += '<span class="circle-text">始</span></div>';
					contentStr += '<div class="font-w300-s18 float-left padding-10-l">';
					contentStr += requestData.result.list[i].start + '</div></div>';
					contentStr += '<div class="mui-row" style="padding-top: 3px;">';
					contentStr += '<div class="arrive-circle float-left">';
					contentStr += '<span class="circle-text">终</span></div>';
					contentStr += '<div class="font-w300-s18 float-left padding-10-l">';
					contentStr += requestData.result.list[i].arrive + '</div></div></div>';
					contentStr += '<div class="mui-col-xs-5 align-right"><p class="priceInfo">';
					contentStr += '￥' + requestData.result.list[i].price.replace('元', '');
					contentStr += '</p></div></div></div>';
				}
				resultContent.innerHTML = contentStr;
				resultContent.style.border = '#DDDDDD solid 1px';
			}
		}
	});
}

//function dealResult(resultData, orderFlg) {
//
//}