//本地 cache 读写 object
var localStorage = window.localStorage;
var initStock = 'sh000001,sz399001,sz399006';
var loadTime = 60;
var mainContent = mui('.stock-list')[0];
var codeList = [];
var currentIndex = 0;

/**
 * GJ003 页面初始化
 */
function initializeGJ003() {
	initStockCode(initStyle);
	setTimeout('initializeGJ003()', loadTime * 1000);
}

function initStyle() {
	mainContent.innerHTML = '';
	mainContent.innerHTML =
		'<div class="mui-row border-b font-w300-s16" style="color: #007AFF;">' +
		'	<div class="mui-col-xs-4 padding-20-l">证券代码</div>' +
		'	<div class="mui-col-xs-2 align-center">现价</div>' +
		'	<div class="mui-col-xs-3 align-center">涨跌</div>' +
		'	<div class="mui-col-xs-3 align-center">涨幅</div>' +
		'</div>';
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
	callback(initStockInfo);
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
			var codeNum = requestData.result.data.gid;
			codeNum = codeNum.subString(2, codeNum.length);
			console.log(codeNum);
			var contentStr =
				'<div class="mui-row border-b">' +
				'	<div class="mui-col-xs-4 padding-20-l">' +
				'		<p class="font-w300-s18 remove-margin-b color-white">' +
				requestData.result.data.name +
				'		</p>' +
				'		<p class="font-w300-s16 remove-margin-b color-white">' +
				codeNum +
				'		</p>' +
				'	</div>' +
				'<div class="mui-col-xs-2 align-center info-style" style="color: red">' +
				parseFloat(requestData.result.data.nowPri).toFixed(2) +
				'</div>' +
				'<div class="mui-col-xs-3 align-center" style="color: #008000;">3.5</div>';
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