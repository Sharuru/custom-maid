var cityStr = '';
var radioFlg = '0';
var cityEle = document.getElementById('cityLoc');
var inputEle = document.getElementById('inputStr');
var buttonEle = document.getElementById('searchButton');
var resultContent = mui('.resultInfo')[0];
var lineData = '';

/**
 * CX004 页面初始化
 */
function initializeCX004() {
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
				url: 'ACTUAL_BUS.html',
				id: 'PAGE_ACTUAL_BUS',
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
		var lineId = this.id;
		var lineName = this.getAttribute('name');
		if (/^bus/.test(lineId)) {
			getLineInfo(cityStr, lineName, lineId.replace('bus', ''), inputEle.value);
		} else {
			setTimeout(function() {
				mui.openWindow({
					url: 'BUS_DETAIL.html',
					id: 'PAGE_BUS_DETAIL',
					show: {
						aniShow: 'pop-in',
						duration: 200
					},
					extras: {
						cityName: cityStr,
						stationName: ' ',
						//cityName: '上海',
						//stationName: '桂林西街',
						busIdFlg: lineId.replace('line', ''),
						busName: lineName,
						busList: lineData
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
		inputEle.value = '';
		inputEle.focus();
	} else if (valueStr == '1') {
		mui('.mui-placeholder')[0].innerHTML = '请输入公交站点';
		inputEle.value = '';
		inputEle.focus();
	}
}

/**
 * 查询初始化
 * 
 * @param {String} radioStr 单选按钮value值
 */
function initInfo(radioStr) {
	if (inputEle.value == '') {
		mui.toast('未输入相关信息');
		return;
	}
	addDisabled();
	resultContent.innerHTML = '';
	resultContent.style.border = '';
	if (radioStr == '0') {
		getBusLineInfo(cityStr, inputEle.value, showButton);
	} else {
		getBusList(cityStr, inputEle.value);
		//getBusList('上海', '桂林西街');
	}
}

/**
 * 查询公交线路信息
 * 
 * @param {String} cityNameStr 所属城市
 * @param {String} inputStr 公交线路
 * @param {Function} callback 回调函数
 */
function getBusLineInfo(cityNameStr, inputStr, callback) {
	//console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busInfo', {
		data: {
			city: cityNameStr,
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
				lineData = JSON.stringify(requestData.result);
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
				getBusLineInfo(cityNameStr, inputStr, callback);
			});
		}
	});
}

/**
 * 查询经过站点的公交线路
 * 
 * @param {String} cityNameStr
 * @param {String} inputStr
 */
function getBusList(cityNameStr, inputStr) {
	//console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busList', {
		data: {
			city: cityNameStr,
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
		'</div>';
	for (var i = 0; i < resultData.result.length; i++) {
		var lineState = '';
		if (resultData.result[i].status == '1') {
			lineState = '(正常运行)';
		} else {
			lineState = '(已停运)';
		}
		contentStr +=
			'<div class="result-block" id="line' + resultData.result[i].line_id + '" name="' + resultData.result[i].key_name + '">' +
			'	<div class="mui-row">' +
			'		<div class="mui-col-xs-10">' +
			'			<div class="mui-row padding-10-l padding-5-t">' +
			'				<label style="font-size: 20px;">' +
			resultData.result[i].key_name +
			'				</label>' +
			'				<label class="font-s16 padding-10-l" style="color: #007AFF;">' +
			lineState +
			'				</label>' +
			'			</div>' +
			'			<div class="mui-row padding-10-l">' +
			'				<label class="font-s16">' +
			resultData.result[i].front_name + '-' + resultData.result[i].terminal_name +
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
			dealTimeStr(resultData.result[i].start_time) +
			'					</div>' +
			'				</div>' +
			'				<div class="mui-col-xs-5">' +
			'					<div class="icon-div">' +
			'						<div class="end-time">' +
			'							<span class="time-text">末</span>' +
			'						</div>' +
			'					</div>' +
			'					<div class="time-info">' +
			dealTimeStr(resultData.result[i].end_time) +
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
			'<div class="result-block" id="bus' + resultList[i].line_id + '" name="' + resultList[i].key_name + '">' +
			'	<div class="mui-row">' +
			'		<div class="mui-col-xs-10">' +
			'			<div class="mui-row padding-10-l padding-5-t">' +
			'				<label style="font-size: 20px;">' +
			resultList[i].key_name +
			'				</label>' +
			'			</div>' +
			'			<div class="mui-row padding-10-l">' +
			'				<label class="font-s16">' +
			resultList[i].front_name + ' - ' + resultList[i].terminal_name +
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

function getLineInfo(cityNameStr, busNameStr, idFlgStr, inputValue) {
	mui.toast('正在获取数据...');
	mui.ajax(serverAddr + 'travel/busInfo', {
		data: {
			city: cityNameStr,
			bus: busNameStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0 || requestData == null) {
				mui.toast('没有找到匹配的公交线路信息');
			} else {
				lineData = JSON.stringify(requestData.result);
				setTimeout(function() {
					mui.openWindow({
						url: 'BUS_DETAIL.html',
						id: 'PAGE_BUS_DETAIL',
						show: {
							aniShow: 'pop-in',
							duration: 200
						},
						extras: {
							cityName: cityNameStr,
							stationName: inputValue,
							//cityName: '上海',
							//stationName: '桂林西街',
							busIdFlg: idFlgStr,
							busName: busNameStr,
							busList: lineData
						},
						waiting: {
							autoShow: false
						}
					});
				}, 200);
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得公交信息', '重试', function() {
				getLineInfo(cityNameStr, busNameStr, idFlgStr, inputValue);
			});
		}
	});
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