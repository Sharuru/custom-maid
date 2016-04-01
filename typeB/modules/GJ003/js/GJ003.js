//本地 cache 读写 object
var localStorage = window.localStorage;
var blockCode = 'sh000001,sz399001,sz399006';
var loadTime = 60;
var listContent = mui('.stock-list')[0];
var codeInput = document.getElementById('stockCodeInput');
var searchButton = document.getElementById('iconButton');
var codeList = [];
var blockIndex = 0;
var currentIndex = 0;

/**
 * GJ003 页面初始化
 */
function initializeGJ003() {
	refreshFunc();
	//	mui('.search-block').on('tap', '#iconButton', function() {
	//		console.log('1');
	//		checkStockCode(codeInput.value);
	//	});
	//	mui('.stock-list').on('tap', '.mui-row', function() {
	//		getDetail(this.id);
	//	});
}

function refreshFunc() {
	initBlock(askStockBlock);
	initList(initStockCode);
//	setTimeout('refreshFunc()', loadTime * 1000);
}

function initBlock(callback) {
	blockIndex = 0;
	for (var i = 0; i < mui('.mui-slider-item').length; i++) {
		mui('.mui-slider-item')[i].innerHTML = '';
	}
	callback();
}

function askStockBlock() {
	var stockBlockCode = blockCode.split(',');
	if (blockIndex >= stockBlockCode.length) {
		return;
	}
	getStockInfo(stockBlockCode[blockIndex], 0);
}

function initList(callback) {
	codeList = [];
	currentIndex = 0;
	listContent.innerHTML = '';
	listContent.innerHTML =
		'<div class="mui-row border-b font-w300-s16" style="color: #007AFF;">' +
		'	<div class="mui-col-xs-4 padding-20-l">证券代码</div>' +
		'	<div class="mui-col-xs-3 align-center">现价</div>' +
		'	<div class="mui-col-xs-3 align-center">涨跌</div>' +
		'	<div class="mui-col-xs-2 align-center">涨幅</div>' +
		'</div>';
	callback(askStockInfo);
}

function initStockCode(callback) {
	var allCode = localStorage.getItem('stockCode');
	if (allCode == null && allCode == '[]') {
		return;
	}
	codeList = JSON.parse(allCode);
	callback();
}

function askStockInfo() {
	if (currentIndex >= codeList.length) {
		return;
	}
	getStockInfo(codeList[currentIndex], 1);
}

/**
 * 根据证券代码获取证券信息
 * 
 * @param String codeStr 证券代码
 * @param int funcFlg 操作标志
 */
function getStockInfo(codeStr, funcFlg) {
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
				if (funcFlg == 0) {
					initStockBlock(requestData);
				} else if (funcFlg == 1) {
					initStockList(requestData);
				} else {

				}
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

function initStockBlock(resultStr) {
	var resultData = resultStr.result[0];
	//成交量除数
	var numDivi = 10000;
	//成交额除数
	var amountDivi = 10000;
	var codeNumStr = resultData.data.gid;
	if (codeNumStr.match('sz')) {
		numDivi = numDivi * 100;
	}
	var codeNum = codeNumStr.substring(2, codeNumStr.length);
	var basePrice = parseFloat(resultData.data.yestodEndPri).toFixed(2);
	var startPrice = parseFloat(resultData.data.todayStartPri).toFixed(2)
	var maxPrice = parseFloat(resultData.data.todayMax).toFixed(2);
	var minPrice = parseFloat(resultData.data.todayMin).toFixed(2);
	var sumData = parseFloat(resultData.dapandata.nowPic).toFixed(2);
	//计算成交量
	var traNum = parseFloat(resultData.data.traNumber);
	var traNumStr = '';
	if (traNum == 0) {
		traNumStr = traNum;
	} else if (traNum < numDivi) {
		traNumStr = traNum + '万';
	} else {
		traNumStr = parseFloat(traNum / numDivi).toFixed(2) + '亿';
	}
	//计算成交额
	var traAmount = parseFloat(resultData.data.traAmount);
	var traAmountStr = '';
	if (traAmount >= 0 && traAmount < amountDivi) {
		traAmountStr = traAmount;
	} else if (traAmount >= amountDivi && traAmount < amountDivi * amountDivi) {
		traAmountStr = parseFloat(traAmount / amountDivi).toFixed(2) + '万';
	} else {
		traAmountStr = parseFloat(traAmount / (amountDivi * amountDivi)).toFixed(2) + '亿';
	}
	var contentStr = '';
	contentStr +=
		'<div class="stock-slider">' +
		'	<div class="mui-row">' +
		'		<p class="slider-name">' +
		resultData.dapandata.name +
		'			<label class="font-s18 color-white padding-10-l">' +
		'(' + codeNum + ')' +
		'			</label>' +
		'		</p>' +
		'	</div>';
	if (sumData > 0) {
		contentStr +=
			'<div class="mui-row color-red" style="margin-bottom: 3px;">' +
			'	<span class="mui-icon iconfont icon-up" style="font-size: 20px;"></span>';
	} else if (sumData < 0) {
		contentStr +=
			'<div class="mui-row color-green" style="margin-bottom: 3px;">' +
			'	<span class="mui-icon iconfont icon-down" style="font-size: 20px;"></span>';
	} else {
		contentStr +=
			'<div class="mui-row" style="margin-bottom: 3px;">';
	}
	contentStr +=
		'		<label class="slider-now-price">' +
		parseFloat(resultData.dapandata.dot).toFixed(2) +
		'		</label>' +
		'		<label class="font-s18 padding-10-l">' +
		sumData +
		'		</label>' +
		'		<label class="font-s18 padding-10-l">' +
		'(' + parseFloat(resultData.dapandata.rate).toFixed(2) + '%)' +
		'		</label>' +
		'	</div>' +
		'	<div class="mui-row">' +
		'		<div class="mui-col-xs-6">' +
		'			<table class="slider-table">' +
		'				<tr>' +
		'					<td>今开:</td>';
	if (startPrice > basePrice) {
		contentStr +=
			'				<td class="align-right color-red">' +
			startPrice +
			'				</td>';
	} else if (startPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-green">' +
			startPrice +
			'				</td>';
	} else {
		contentStr +=
			'				<td class="align-right">' +
			startPrice +
			'				</td>';
	}
	contentStr +=
		'				</tr>' +
		'				<tr>' +
		'					<td>最高:</td>';
	if (maxPrice > basePrice) {
		contentStr +=
			'				<td class="align-right color-red">' +
			maxPrice +
			'				</td>';
	} else if (maxPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-green">' +
			maxPrice +
			'				</td>';
	} else {
		contentStr +=
			'				<td class="align-right">' +
			maxPrice +
			'				</td>';
	}
	contentStr +=
		'				</tr>' +
		'				<tr>' +
		'					<td>成交量:</td>' +
		'					<td style="text-align: right;">' +
		traNumStr +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'		<div class="mui-col-xs-6">' +
		'			<table class="slider-table float-right">' +
		'				<tr>' +
		'					<td>昨收:</td>' +
		'					<td style="text-align: right;">' +
		basePrice +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>最低:</td>';
	if (minPrice > basePrice) {
		contentStr +=
			'				<td class="align-right color-red">' +
			minPrice +
			'				</td>';
	} else if (minPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-green">' +
			minPrice +
			'				</td>';
	} else {
		contentStr +=
			'				<td class="align-right">' +
			minPrice +
			'				</td>';
	}
	contentStr +=
		'				</tr>' +
		'				<tr>' +
		'					<td>成交额:</td>' +
		'					<td style="text-align: right;">' +
		traAmountStr +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'	</div>' +
		'</div>';
	mui('.mui-slider-item')[blockIndex].innerHTML = contentStr;
	blockIndex += 1;
	askStockBlock();
}

function initStockList(resultStr) {
	var resultData = resultStr.result[0];
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
	listContent.innerHTML += contentStr;
	currentIndex += 1;
	askStockInfo();
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