var cityStr = '';
var radioFlg = '0';
var cityEle = document.getElementById('cityLoc');
var inputEle = document.getElementById('inputStr');
var buttonEle = document.getElementById('searchButton');
var resultContent = mui('.resultInfo')[0];

/**
 * CX005 页面初始化
 */
function initializeCX005() {
	//初始化所属城市
	var currProvince = localStorage.getItem('province');
	cityEle.innerHTML = '<span class="mui-icon iconfont icon-location"></span>' + currProvince;
	cityStr = currProvince;

	//传值事件绑定
	window.addEventListener('setLocation', function(event) {
		cityEle.innerHTML = '<span class="mui-icon iconfont icon-location"></span>' + event.detail.loc;
		cityStr = event.detail.loc;
	});

	//跳转城市列表
	mui('.search-block').on('tap', '#cityLoc', function() {
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});

	//跳转实时公交
	mui('.resultInfo').on('tap', '#actualTime', function() {
		//按钮动效现时完毕后再切换页面
		setTimeout(function() {
			mui.openWindow({
				url: 'ACTUALBUS.html',
				id: 'PAGE_ACTUALBUS',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					data: inputEle.value
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});

	//跳转公交线路详情
	mui('.resultInfo').on('tap', '.result-block', function() {
		var lindId = this.id;
		if (/^bus/.test(lindId)) {
			setTimeout(function() {
				mui.openWindow({
					url: 'BUS_DETAIL.html',
					id: 'PAGE_BUS_DETAIL',
					show: {
						aniShow: 'pop-in',
						duration: 200
					},
					extras: {
						//cityName: cityStr,
						//stationName: inputEle.value,
						cityName: '上海',
						stationName: '上海南站',
						data: lindId.replace('bus', '')
					},
					waiting: {
						autoShow: false
					}
				});
			}, 200);
		}
	});

	//按钮点击事件
	buttonEle.addEventListener('tap', function() {
		initInfo(radioFlg);
	});
}

/**、
 * 根据选中的单选按钮变换控件input的placeholder
 * 
 * @param {String} valueStr 单选按钮的value
 */
function checkValue(valueStr) {
	resultContent.innerHTML = '';
	resultContent.style.border = '';
	radioFlg = valueStr;
	if (valueStr == '0') {
		mui('.mui-placeholder')[0].innerHTML = '请输入公交线路';
	} else if (valueStr == '1') {
		mui('.mui-placeholder')[0].innerHTML = '请输入公交站点';
	}
}

/**
 * 查询初始化
 * 
 * @param {String} radioStr 单选按钮value值
 */
function initInfo(radioStr) {
	//	if (inputEle.value == '') {
	//		mui.toast('未输入相关信息');
	//		return;
	//	}
	addDisabled();
	resultContent.innerHTML = '';
	resultContent.style.border = '';
	if (radioStr == '0') {
		getBusLineInfo(cityStr, inputEle.value, showButton);
	} else {
		//getBusList(cityStr, inputEle.value);
		getBusList('上海', '上海南站');
	}
}

/**
 * 查询公交线路信息
 * 
 * @param {String} cityStr 所属城市
 * @param {String} inputStr 公交线路
 * @param {Function} callback 回调函数
 */
function getBusLineInfo(cityStr, inputStr, callback) {
	//console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busInfo', {
		data: {
			city: cityStr,
			bus: inputStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0 || requestData == null) {
				mui.toast('没有找到匹配的公交线路信息');
				cancelDisabled();
			} else {
				resultContent.innerHTML = dealResult(requestData);
				resultContent.style.border = '#DDDDDD solid 1px';
				cancelDisabled();
				callback();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得公交信息', '重试', function() {
				getBusLineInfo(cityStr, inputStr);
			});
		}
	});
}

/**
 * 查询经过站点的公交线路
 * 
 * @param {String} cityStr
 * @param {String} inputStr
 */
function getBusList(cityStr, inputStr) {
	//console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busList', {
		data: {
			city: cityStr,
			station: inputStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0 || requestData == null) {
				mui.toast('没有找到匹配的站点信息');
				cancelDisabled();
			} else {
				resultContent.innerHTML = dealBusList(requestData.result);
				resultContent.style.border = '#DDDDDD solid 1px';
				cancelDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得公交信息', '重试', function() {
				getBusList(cityStr, inputStr);
			});
		}
	});
}

/**
 * 处理显示公交线路信息
 * 
 * @param {JSON} resultData 结果集
 */
function dealResult(resultData) {
	var contentStr = '';
	contentStr +=
		'<div class="mui-row">' +
		'	<div class="mui-col-xs-7">' +
		'		<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>' +
		'	</div>' +
		'	<div class="mui-col-xs-5 align-right padding-10-r">' +
		'		<a href="#" id="actualTime" style="display: none;">' +
		'			<span class="mui-icon iconfont icon-thisTime" style="font-size: 18px;"></span>' +
		'			<label class="font-s16">实时公交</label>' +
		'		</a>' +
		'	</div>' +
		'</div>' +
		'<div class="result-block">' +
		'	<ul class="mui-table-view">';
	for (var i = 0; i < resultData.result.length; i++) {
		var lineName = resultData.result[i].name;
		var lineState = '';
		if (resultData.result[i].status == '1') {
			lineState = '(正常运行)';
		} else {
			lineState = '(已停运)';
		}
		contentStr +=
			'	<li class="mui-table-view-cell mui-collapse">' +
			'		<a class="mui-navigate-right" href="#">' +
			'			<label class="font-s16">线路:</label>' +
			'			<label class="font-s18 padding-10-l">' +
			lineName.substring(0, lineName.lastIndexOf('（')) +
			'			</label>' +
			'			<label class="font-s16 padding-10-l" style="color: #007AFF;">' +
			lineState +
			'			</label>' +
			'			<p class="color-black">' +
			'				<label class="font-s16">方向:</label>' +
			'				<label class="font-s16 padding-10-l">' +
			lineName.substring(lineName.lastIndexOf('（') + 1, lineName.lastIndexOf('）')) +
			'				</label>' +
			'			</p>' +
			'		</a>' +
			'		<div class="mui-collapse-content">' +
			'			<ul class="list list-timeline">' +
			dealStationdes(resultData.result[i].stationdes) +
			'			</ul>' +
			'		</div>' +
			'	</li>';
	}
	contentStr +=
		'	</ul>' +
		'</div>';
	return contentStr;
}

/**
 * 显示公交线路的公交站点
 * 
 * @param {List} stationdes 站点集
 */
function dealStationdes(stationdes) {
	var returnStr = '';
	returnStr +=
		'<li>' +
		'	<i class="mui-icon iconfont icon-nextStation list-timeline-icon color-success"></i>' +
		'	<div class="list-timeline-content">' +
		'		<p class="font-s18 remove-margin-b">' +
		stationdes[0].name +
		'		</p>' +
		'	</div>' +
		'</li>';
	for (var j = 1; j < stationdes.length - 1; j++) {
		returnStr +=
			'<li>' +
			'	<i class="mui-icon iconfont icon-nextStation list-timeline-icon"></i>' +
			'	<div class="list-timeline-content">' +
			'		<p class="font-s16 remove-margin-b">' +
			stationdes[j].name +
			'		</p>' +
			'	</div>' +
			'</li>';
	}
	returnStr +=
		'<li>' +
		'	<i class="mui-icon iconfont icon-express list-timeline-icon color-warning"></i>' +
		'	<div class="list-timeline-content">' +
		'		<p class="font-s18 remove-margin-b">' +
		stationdes[stationdes.length - 1].name +
		'		</p>' +
		'	</div>' +
		'</li>';
	return returnStr;
}

/**
 * 显示跳转实时公交按钮
 */
function showButton() {
	if (cityStr == '上海' && radioFlg == '0') {
		document.getElementById('actualTime').style.display = 'block';
	}
}

/**
 * 处理显示经过查询站点的线路
 * 
 * @param {list} resultList 结果集
 */
function dealBusList(resultList) {
	var contentStr = '';
	contentStr += '<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>';
	for (var i = 0; i < resultList.length; i++) {
		contentStr +=
			'<div class="result-block" id="bus' + resultList[i].key_name + '">' +
			'	<div class="mui-row">' +
			'		<div class="mui-col-xs-10">' +
			'			<div class="mui-row padding-10-l padding-5-t">' +
			'				<label style="font-size: 20px;">' +
			resultList[i].key_name +
			'				</label>' +
			'			</div>' +
			'			<div class="mui-row padding-10-l">' +
			'				<label class="font-s16">' +
			resultList[i].front_name + '-' + resultList[i].terminal_name +
			'				</label>' +
			'			</div>' +
			'			<div class="mui-row padding-5 padding-10-l">' +
			'				<div class="mui-col-xs-5">' +
			'					<div class="icon-div">' +
			'						<div class="start-time">' +
			'							<span class="time-text">首</span>' +
			'						</div>' +
			'					</div>' +
			'					<div class="time-info">' +
			dealTimeStr(resultList[i].start_time) +
			'					</div>' +
			'				</div>' +
			'				<div class="mui-col-xs-5">' +
			'					<div class="icon-div">' +
			'						<div class="end-time">' +
			'							<span class="time-text">末</span>' +
			'						</div>' +
			'					</div>' +
			'					<div class="time-info">' +
			dealTimeStr(resultList[i].end_time) +
			'					</div>' +
			'				</div>' +
			'			</div>' +
			'		</div>' +
			'		<div class="mui-col-xs-2 align-right">' +
			'			<span class="mui-icon iconfont icon-toDetail toDetail"></span>' +
			'		</div>' +
			'	</div>' +
			'</div>';
	}
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
 * 禁用用户操作
 */
function addDisabled() {
	var radios = document.getElementsByName('busRadio');
	for (var i = 0; i < radios.length; i++) {
		radios[i].disabled = true;
	}
	inputEle.disabled = 'disabled';
	mui('.search-block').off('tap', '#cityLoc');
	cityEle.style.color = '#999999';
	buttonEle.disabled = true;
	buttonEle.innerHTML = '正在查询...';
}

/**
 * 解除禁用操作
 */
function cancelDisabled() {
	var radios = document.getElementsByName('busRadio');
	for (var i = 0; i < radios.length; i++) {
		radios[i].disabled = false;
	}
	inputEle.disabled = '';
	mui('.search-block').on('tap', '#cityLoc', function() {
		setTimeout(function() {
			mui.openWindow({
				url: 'CITY_LIST.html',
				id: 'PAGE_CITY_LIST',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});
	cityEle.style.color = '#000000';
	buttonEle.disabled = false;
	buttonEle.innerHTML = '开始查询';
}