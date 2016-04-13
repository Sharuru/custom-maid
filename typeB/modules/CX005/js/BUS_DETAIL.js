var checkFlg = true;
var lineId = '';
var targetStation = '';
var lineName = '';
var cityName = '';
var listData = [];
var resultContent = mui('.resultInfo')[0];

function initBusDetail() {
	mui.toast('正在载入中...');
	var self = plus.webview.currentWebview();
	lineId = self.busIdFlg;
	targetStation = self.stationName;
	cityName = self.cityName;
	lineName = self.busName;
	listData = JSON.parse(self.busList);
	initData(listData);

	mui('.resultInfo').on('tap', '#exchangeButton', function() {
		checkFlg = !checkFlg;
		initData(listData);
	});
}

function initData(requestData) {
	for (var i = 0; i < requestData.length; i++) {
		if (checkFlg && requestData[i].key_name == lineName && requestData[i].line_id == lineId) {
			resultContent.innerHTML = dealResult(requestData[i]);
		} else if (!checkFlg && requestData[i].key_name == lineName && requestData[i].line_id != lineId) {
			resultContent.innerHTML = dealResult(requestData[i]);
		}
	}
	resultContent.style.border = '#DDDDDD solid 1px';
}

function dealResult(resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="result-block">' +
		'	<div class="mui-row padding-5-t align-center">' +
		'		<label style="font-size: 20px;">' + resultData.key_name + '</label>' +
		'	</div>' +
		'	<div class="mui-row padding-5 align-center">' +
		'		<div class="mui-col-xs-5 font-s16">' + resultData.front_name + '</div>' +
		'		<div class="mui-col-xs-2">' +
		'			<span class="mui-icon iconfont icon-toStation" style="font-size: 12px;"></span>' +
		'		</div>' +
		'		<div class="mui-col-xs-5 font-s16">' + resultData.terminal_name + '</div>' +
		'	</div>' +
		'	<div class="mui-row padding-5 border-b">' +
		'		<div class="mui-col-xs-5 padding-20-l">' +
		'			<div class="icon-div">' +
		'				<div class="start-time">' +
		'					<span class="time-text">首</span>' +
		'				</div>' +
		'			</div>' +
		'			<div class="time-info">' + dealTimeStr(resultData.start_time) + '</div>' +
		'		</div>' +
		'		<div class="mui-col-xs-4 padding-10-l">' +
		'			<div class="icon-div">' +
		'				<div class="end-time">' +
		'					<span class="time-text">末</span>' +
		'				</div>' +
		'			</div>' +
		'			<div class="time-info">' + dealTimeStr(resultData.end_time) + '</div>' +
		'		</div>' +
		'		<div class="mui-col-xs-3 align-right padding-10-r">' +
		'			<a id="exchangeButton">' +
		'				<span class="mui-icon iconfont icon-exchange"></span>' +
		'				<label class="font-s16">反方向</label>' +
		'			</a>' +
		'		</div>' +
		'	</div>' +
		'	<ul class="list list-timeline">' +
		dealStationdes(resultData.stationdes) +
		'	</ul>' +
		'</div>';
	return contentStr;
}

/**
 * 处理时间显示
 * 
 * @param {String} timeValue 时间字符串
 */
function dealTimeStr(timeValue) {
	var timeStr = '';
	timeStr = timeValue.substring(0, 2) + ':' + timeValue.substring(2, timeValue.length);
	return timeStr;
}

/**
 * 显示公交线路的公交站点
 * 
 * @param {List} stationdes 站点集
 */
function dealStationdes(stationdes) {
	var returnStr = '';
	for (var j = 0; j < stationdes.length; j++) {
		if (stationdes[j].name.indexOf(targetStation) != -1) {
			returnStr +=
				'<li>' +
				'	<i class="mui-icon iconfont icon-nextStation list-timeline-icon color-danger"></i>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s18 remove-margin-b">' +
				stationdes[j].name + '<label class="font-s16 color-danger">(目标站点)</label>' +
				'		</p>' +
				'	</div>' +
				'</li>';
		} else if (j == 0 && stationdes[j].name.indexOf(targetStation) == -1) {
			returnStr +=
				'<li>' +
				'	<i class="mui-icon iconfont icon-nextStation list-timeline-icon color-success"></i>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s18 remove-margin-b">' + stationdes[j].name + '</p>' +
				'	</div>' +
				'</li>';
		} else if (j == stationdes.length - 1 && stationdes[j].name.indexOf(targetStation) == -1) {
			returnStr +=
				'<li>' +
				'	<i class="mui-icon iconfont icon-express list-timeline-icon color-warning"></i>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s18 remove-margin-b">' + stationdes[j].name + '</p>' +
				'	</div>' +
				'</li>';
		} else {
			returnStr +=
				'<li>' +
				'	<i class="mui-icon iconfont icon-nextStation list-timeline-icon"></i>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s16 remove-margin-b">' + stationdes[j].name + '</p>' +
				'	</div>' +
				'</li>';
		}
	}
	return returnStr;
}