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
	mui('.search-block').on('tap', '#iconButton', function() {
		checkStockCode(codeInput.value);
	});
	mui('.stock-list').on('tap', '.mui-row', function() {
		getStockInfo(this.id, 2);
	});
	mui('.topButton').on('tap', '.icon-refresh', function() {
		mui.toast('正在刷新...');
		refreshFunc();
	});
}

/**
 * 定时刷新
 */
function refreshFunc() {
	initBlock(askStockBlock);
	initList(initStockCode);
	setTimeout('refreshFunc()', loadTime * 1000);
}

/**
 * 大盘指数初始化
 * 
 * @param {Function} callback
 */
function initBlock(callback) {
	blockIndex = 0;
	for (var i = 0; i < mui('.mui-slider-item').length; i++) {
		mui('.mui-slider-item')[i].innerHTML = '';
	}
	callback();
}

/**
 * 发送请求查询大盘信息
 */
function askStockBlock() {
	var stockBlockCode = blockCode.split(',');
	if (blockIndex >= stockBlockCode.length) {
		return;
	}
	getStockInfo(stockBlockCode[blockIndex], 0);
}

/**
 * 自选股列表初始化
 * 
 * @param {Function} callback
 */
function initList(callback) {
	codeList = [];
	currentIndex = 0;
	listContent.innerHTML = '';
	callback(askStockInfo);
}

/**
 * 自选股代码集合初始化
 * 
 * @param {Function} callback
 */
function initStockCode(callback) {
	var allCode = localStorage.getItem('stockCode');
	if (allCode == null || allCode == '[]') {
		return;
	}
	codeList = JSON.parse(allCode);
	document.getElementById('stockListTitle').style.display = 'block';
	listContent.innerHTML =
		'<div class="mui-row border-b font-s16" style="color: #007AFF;">' +
		'	<div class="mui-col-xs-4 padding-20-l">证券代码</div>' +
		'	<div class="mui-col-xs-3 align-center">现价</div>' +
		'	<div class="mui-col-xs-3 align-center">涨跌</div>' +
		'	<div class="mui-col-xs-2 align-center">涨幅</div>' +
		'</div>';
	callback();
}

/**
 * 发送请求查询自选股信息
 */
function askStockInfo() {
	if (codeList.length == 0 || currentIndex >= codeList.length) {
		return;
	}
	getStockInfo(codeList[currentIndex], 1);
}

/**
 * 根据证券代码获取证券信息
 * 
 * @param {String} codeStr 证券代码
 * @param {int} funcFlg 操作标志
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
					var hasFlg = checkStockFlg(codeStr);
					goDetail(requestData.result[0].data.name, codeStr, hasFlg);
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

/**
 * 处理大盘数据显示
 * 
 * @param {JSON} resultStr 结果集
 */
function initStockBlock(resultStr) {
	var resultData = resultStr.result[0];
	//成交量除数
	var numDivi = 10000;
	//成交额除数
	var numFlg = 10000;
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
	} else if (traNum < numFlg) {
		traNumStr = traNum + '万';
	} else {
		traNumStr = parseFloat(traNum / numDivi).toFixed(2) + '亿';
	}
	//计算成交额
	var traAmount = parseFloat(resultData.data.traAmount);
	var traAmountStr = '';
	if (traAmount >= 0 && traAmount < numFlg) {
		traAmountStr = traAmount;
	} else if (traAmount >= numFlg && traAmount < numFlg * numFlg) {
		traAmountStr = parseFloat(traAmount / numFlg).toFixed(2) + '万';
	} else {
		traAmountStr = parseFloat(traAmount / (numFlg * numFlg)).toFixed(2) + '亿';
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
			'<div class="mui-row color-danger" style="margin-bottom: 3px;">' +
			'	<span class="mui-icon iconfont icon-up" style="font-size: 18px;"></span>';
	} else if (sumData < 0) {
		contentStr +=
			'<div class="mui-row color-success" style="margin-bottom: 3px;">' +
			'	<span class="mui-icon iconfont icon-down" style="font-size: 18px;"></span>';
	} else {
		contentStr +=
			'<div class="mui-row color-white" style="margin-bottom: 3px;">';
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
			'				<td class="align-right color-danger">' +
			startPrice +
			'				</td>';
	} else if (startPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-success">' +
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
			'				<td class="align-right color-danger">' +
			maxPrice +
			'				</td>';
	} else if (maxPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-success">' +
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
			'				<td class="align-right color-danger">' +
			minPrice +
			'				</td>';
	} else if (minPrice < basePrice) {
		contentStr +=
			'				<td class="align-right color-success">' +
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

/**
 * 处理自选股数据显示
 * 
 * @param {JSON} resultStr 结果集
 */
function initStockList(resultStr) {
	//console.log('stockList');
	var resultData = resultStr.result[0];
	var codeNum = resultData.data.gid;
	codeNum = codeNum.substring(2, codeNum.length);
	var sumData = parseFloat(resultData.dapandata.nowPic).toFixed(2);
	var contentStr = '';
	contentStr +=
		'<div class="mui-row border-b" id="' + resultData.data.gid + '">' +
		'	<div class="mui-col-xs-4 padding-20-l">' +
		'		<p class="font-s18 remove-margin-b color-white">' +
		resultData.dapandata.name +
		'		</p>' +
		'		<p class="font-s16 remove-margin-b color-white">' +
		codeNum +
		'		</p>' +
		'	</div>';
	if (sumData > 0) {
		contentStr +=
			'<div class="mui-col-xs-3 align-center info-style color-danger">' +
			parseFloat(resultData.dapandata.dot).toFixed(2) +
			'</div>' +
			'<div class="mui-col-xs-3 align-center info-style color-danger">' +
			sumData +
			'</div>' +
			'<div class="mui-col-xs-2 align-center info-style color-danger">' +
			parseFloat(resultData.dapandata.rate).toFixed(2) + '%' +
			'</div>';
	} else if (sumData < 0) {
		contentStr +=
			'<div class="mui-col-xs-3 align-center info-style color-success">' +
			parseFloat(resultData.dapandata.dot).toFixed(2) +
			'</div>' +
			'<div class="mui-col-xs-3 align-center info-style color-success">' +
			sumData +
			'</div>' +
			'<div class="mui-col-xs-2 align-center info-style color-success">' +
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

/**
 * 处理证券代码输入
 * 
 * @param {String} checkStr 输入值
 */
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
	getStockInfo(codeNumStr, 2);
}

/**
 * 跳转证券详情页面
 * 
 * @param {String} nameStr 证券名称
 * @param {String} codeStr 证券代码
 * @param {int} flgStr 自选标志符
 */
function goDetail(nameStr, codeStr, flgStr) {
	console.log('Setting screen...');
	//有数据，画面迁移
	mui.openWindow({
		url: 'DETAIL.html',
		id: 'PAGE_DETAIL',
		show: {
			aniShow: 'pop-in',
			duration: 200
		},
		extras: {
			stockName: nameStr,
			stockNum: codeStr,
			stockFlg: flgStr
		},
		waiting: {
			autoShow: false
		}
	});
}

/**
 * 判断证券是否自选
 * 
 * @param {String} codeStr 证券代码
 */
function checkStockFlg(codeStr) {
	var returnNum = 0;
	var allCode = localStorage.getItem('stockCode');
	if (allCode == null || allCode == '[]') {
		return returnNum;
	}
	codeList = JSON.parse(allCode);
	for (var i = 0; i < codeList.length; i++) {
		if (codeStr == codeList[i]) {
			returnNum = 1;
		}
	}
	return returnNum;
}

/**
 * 禁用用户操作
 */
function addDisabled() {
	codeInput.disabled = 'disabled';
	searchButton.style.color = '#AAAAAA';
	mui('.search-block').off('tap', '#iconButton');
}

/**
 * 解除禁用用户操作
 */
function cancelDisabled() {
	codeInput.disabled = '';
	searchButton.style.color = '#555555';
	mui('.search-block').on('tap', '#iconButton', function() {
		checkStockCode(codeInput.value);
	});
}