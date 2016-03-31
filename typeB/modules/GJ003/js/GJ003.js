//本地 cache 读写 object
var localStorage = window.localStorage;
var initStock = 'sh000001,sz399001,sz399006';
var loadTime = 60;
var mainContent = mui('.stock-list')[0];
var codeInput = document.getElementById('stockCodeInput');
var searchButton = document.getElementById('iconButton');
var codeList = [];
var currentIndex = 0;

/**
 * GJ003 页面初始化
 */
function initializeGJ003() {
	initStyle(initStockCode);
	setTimeout('initStyle(initStockCode)', loadTime * 1000);
	mui('.search-block').on('tap', '#iconButton', function() {
		console.log('1');
		checkStockCode(codeInput.value);
	});
	mui('.stock-list').on('tap', '.mui-row', function() {
		getDetail(this.id);
	});
}

function initStyle(callback) {
	currentIndex = 0;
	codeList = [];
	mainContent.innerHTML = '';
	mainContent.innerHTML =
		'<div class="mui-row border-b font-w300-s16" style="color: #007AFF;">' +
		'	<div class="mui-col-xs-4 padding-20-l">证券代码</div>' +
		'	<div class="mui-col-xs-3 align-center">现价</div>' +
		'	<div class="mui-col-xs-3 align-center">涨跌</div>' +
		'	<div class="mui-col-xs-2 align-center">涨幅</div>' +
		'</div>';
	callback(initStockInfo);
}

function initStockCode(callback) {
	var initStockCode = initStock.split(',');
	var allCode = localStorage.getItem('stockCode');
	if (allCode != null && allCode != '[]') {
		codeList = JSON.parse(allCode);
	}
	for (var i = 0; i < initStockCode.length; i++) {
		codeList.unshift(initStockCode[i]);
	}
	callback();
}

function initStockInfo() {
	if (currentIndex >= codeList.length) {
		return;
	}
	getStockInfo(codeList[currentIndex]);
}

/**
 * 根据证券代码获取证券信息
 * 
 * @param String codeStr 证券代码
 */
function getStockInfo(codeStr) {
	mui.ajax(serverAddr + 'tools/stock', {
		data: {
			code: codeStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0) {
				mui.toast('证券代码不存在');
			} else {
				var resultData = requestData.result[0];
				var codeNum = resultData.data.gid;
				codeNum = codeNum.substring(2, codeNum.length);
				var sumData = parseFloat(resultData.dapandata.nowPic).toFixed(2);
				var contentStr = '';
				contentStr +=
					'<div class="mui-row border-b" id="' + resultData.data.gid + '">' +
					'	<div class="mui-col-xs-4 padding-20-l">' +
					'		<p class="font-w300-s18 remove-margin-b color-white">' +
					resultData.dapandata.name +
					'		</p>' +
					'		<p class="font-w300-s16 remove-margin-b color-white">' +
					codeNum +
					'		</p>' +
					'	</div>';
				if (sumData > 0) {
					contentStr +=
						'<div class="mui-col-xs-3 align-center info-style color-red">' +
						parseFloat(resultData.dapandata.dot).toFixed(2) +
						'</div>' +
						'<div class="mui-col-xs-3 align-center info-style color-red">' +
						sumData +
						'</div>' +
						'<div class="mui-col-xs-2 align-center info-style color-red">' +
						parseFloat(resultData.dapandata.rate).toFixed(2) + '%' +
						'</div>';
				} else if (sumData < 0) {
					contentStr +=
						'<div class="mui-col-xs-3 align-center info-style color-green">' +
						parseFloat(resultData.dapandata.dot).toFixed(2) +
						'</div>' +
						'<div class="mui-col-xs-3 align-center info-style color-green">' +
						sumData +
						'</div>' +
						'<div class="mui-col-xs-2 align-center info-style color-green">' +
						parseFloat(resultData.dapandata.rate).toFixed(2) + '%' +
						'</div>';
				} else {
					contentStr +=
						'<div class="mui-col-xs-3 align-center info-style">' +
						parseFloat(resultData.dapandata.dot).toFixed(2) +
						'</div>' +
						'<div class="mui-col-xs-3 align-center info-style">' +
						sumData +
						'</div>' +
						'<div class="mui-col-xs-2 align-center info-style">' +
						parseFloat(resultData.dapandata.rate).toFixed(2) + '%' +
						'</div>';
				}
				contentStr +=
					'</div>';
				mainContent.innerHTML += contentStr;
				currentIndex += 1;
				initStockInfo();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得证券信息', '重试', function() {
				getStockInfo(codeStr);
			});
		}
	});
}

function addDisabled() {
	codeInput.disabled = 'disabled';
	searchButton.style.color = '#AAAAAA';
	mui('.search-block').off('tap', '#iconButton');
}

function cancelDisabled() {
	codeInput.disabled = '';
	searchButton.style.color = '#555555';
	mui('.search-block').on('tap', '#iconButton', function() {
		checkStockCode(codeInput.value);
	});
}

function checkStockCode(checkStr) {
	var stockCodeStr = '';
	if (!/^\d{6}$/g.test(checkStr)) {
		mui.toast("请输入合法的证券代码");
		return;
	}
	if (/^000001$/g.test(checkStr)) {
		codeNumStr = "sh" + checkStr;
	} else if (/^399001$/g.test(checkStr)) {
		codeNumStr = "sz" + checkStr;
	} else if (/^399006$/g.test(checkStr)) {
		codeNumStr = "sz" + checkStr;
	} else if (/^60/g.test(checkStr)) {
		codeNumStr = "sh" + checkStr;
	} else if (/^00/g.test(checkStr)) {
		codeNumStr = "sz" + checkStr;
	} else if (/^300/g.test(checkStr)) {
		codeNumStr = "sz" + checkStr;
	} else {
		mui.toast("请输入沪深证券代码");
		return;
	}
	getDetail(codeNumStr);
}

function getDetail(codeStr) {
	addDisabled();
	mui.ajax(serverAddr + 'tools/stock', {
		data: {
			code: codeStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0) {
				mui.toast('证券代码不存在');
			} else {
				mui.toast('正在跳转...');
				var codeId = requestData.result[0].data.gid;
				codeId = codeId.substring(2, codeId.length);
				goDetail(requestData.result[0].data.name, codeId, requestData);
				cancelDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得证券信息', '重试', function() {
				goDetail(codeStr);
			});
		}
	});
}

function goDetail(nameStr, codeStr, dataStr) {
	console.log('Setting screen...');
	//有数据，画面迁移
	mui.openWindow({
		url: 'Detail.html',
		id: 'Detail',
		show: {
			aniShow: 'pop-in',
			duration: 200
		},
		extras: {
			stockName: nameStr,
			stockNum: codeStr,
			stockData: dataStr
		},
		waiting: {
			autoShow: false
		}
	});
}