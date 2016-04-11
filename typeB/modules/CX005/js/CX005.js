var cityStr = '';
var radioFlg = '0';
var cityEle = document.getElementById('cityLoc');
var inputEle = mui('input[type="search"]')[0];
var buttonEle = document.getElementById('searchButton');
var resultContent = mui('.resultInfo')[0];

/**
 * CX005 页面初始化
 */
function initializeCX005() {
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

	//按钮点击事件
	buttonEle.addEventListener('tap', function() {
		initInfo(radioFlg);
	});
}

/**、
 * 根据选中的单选按钮变换控件input的placeholder
 * 
 * @param String valueStr 单选按钮的value
 */
function checkValue(valueStr) {
	resultContent.innerHTML = '';
	radioFlg = valueStr;
	var inputText = document.getElementById('inputArea');
	if (valueStr == '0') {
		inputText.innerHTML = '<input type="search" class="mui-input-clear" placeholder="请输入公交线路" />';
	} else if (valueStr == '1') {
		inputText.innerHTML = '<input type="search" class="mui-input-clear" placeholder="请输入公交站点" />';
	}
}

function initInfo(radioStr) {
	if (inputEle.value == '') {
		mui.toast('请输入相关信息');
		return;
	}
	addDisabled();
	if (radioStr == '0') {
		getBusLineInfo(cityStr, inputEle.value);
	} else {
		getBusList(cityStr, inputEle.value);
	}
}

function getBusLineInfo(cityStr, inputStr) {
	console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busInfo', {
		data: {
			city: cityStr,
			bus: inputStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			cancelDisabled();
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

function getBusList(cityStr, inputStr) {
	console.log(cityStr + ' : ' + inputStr);
	mui.ajax(serverAddr + 'travel/busList', {
		data: {
			city: cityStr,
			station: inputStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			cancelDisabled();
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