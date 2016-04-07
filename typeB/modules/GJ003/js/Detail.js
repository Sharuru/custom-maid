var localStorage = window.localStorage;
var resultContent = mui('.mui-content')[0];
var loadTime = 60;
var codeList = [];
var isFlg = false;

/**
 * Detail 页面初始化
 */
function initDetail() {
	var self = plus.webview.currentWebview();
	document.getElementById('stockName').innerHTML = self.stockName +
		'<label class="font-s18"> (' + self.stockNum.substring(2, self.stockNum.length) + ')</label>';
	if (self.stockFlg == 0) {
		document.getElementById('hasFlg').innerHTML = '<span class="mui-icon iconfont icon-add" style="font-size: 18px;padding-top: 13px;"> 自选</span>';
	} else {
		isFlg = true;
		document.getElementById('hasFlg').innerHTML = '<span class="mui-icon iconfont icon-delete" style="font-size: 18px;padding-top: 13px;"> 自选</span>';
	}
	getDetail(self.stockNum);
	//添加或取消自选操作
	mui('.header-text').on('tap', '#hasFlg', function() {
		if (isFlg) {
			deleteStock(self.stockNum);
		} else {
			addStock(self.stockNum);
		}
		isFlg = !isFlg;
	});
}

/**
 * 获取证券信息
 * 
 * @param String codeStr 证券代码
 */
function getDetail(codeStr) {
	resultContent.innerHTML = '';
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
				mui.toast('出现未知错误');
			} else {
				//处理结果显示
				dealInfo(requestData);
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得证券信息', '重试', function() {
				getDetail(codeStr);
			});
		}
	});
	//定时刷新
	setTimeout(function() {
		getDetail(codeStr);
	}, loadTime * 1000);
}

/**
 * 处理数据显示
 * 
 * @param JSON objEle 结果集
 */
function dealInfo(objEle) {
	//	console.log(objEle.stockData);
	var resultData = objEle.result[0];
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
		'<div class="stock-base">';
	if (sumData > 0) {
		contentStr +=
			'<div class="mui-row color-danger" style="margin-bottom: 5px;">' +
			'	<span class="mui-icon iconfont icon-up" style="font-size: 18px;"></span>';
	} else if (sumData < 0) {
		contentStr +=
			'<div class="mui-row color-success" style="margin-bottom: 5px;">' +
			'	<span class="mui-icon iconfont icon-down" style="font-size: 18px;"></span>';
	} else {
		contentStr +=
			'<div class="mui-row color-white" style="margin-bottom: 5px;">';
	}
	contentStr +=
		'		<label class="slider-now-price">' +
		parseFloat(resultData.dapandata.dot).toFixed(2) +
		'		</label>' +
		'		<label class="font-s18 padding-10-l">' +
		sumData +
		'		</label>' +
		'		<label class="font-s18 padding-10-l">' +
		parseFloat(resultData.dapandata.rate).toFixed(2) + '%' +
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
		'					<td class="align-right">' +
		traNumStr +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'		<div class="mui-col-xs-6">' +
		'			<table class="slider-table float-right">' +
		'				<tr>' +
		'					<td>昨收:</td>' +
		'					<td class="align-right">' +
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
		'					<td class="align-right">' +
		traAmountStr +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'	</div>' +
		'	<div class="mui-row" style="margin-top: 8px;border-top: #DDDDDD solid 2px;">' +
		'		<div class="mui-col-xs-6 padding-5-t">' +
		'			<table class="slider-table">' +
		'				<tr>' +
		'					<td>买一</td>';
	contentStr += checkColor(parseFloat(resultData.data.buyOnePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.buyOne +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>买二</td>';
	contentStr += checkColor(parseFloat(resultData.data.buyTwoPri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.buyTwo +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>买三</td>';
	contentStr += checkColor(parseFloat(resultData.data.buyThreePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.buyThree +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>买四</td>';
	contentStr += checkColor(parseFloat(resultData.data.buyFourPri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.buyFour +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>买五</td>';
	contentStr += checkColor(parseFloat(resultData.data.buyFivePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.buyFive +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'		<div class="mui-col-xs-6 padding-5-t">' +
		'			<table class="slider-table float-right">' +
		'				<tr>' +
		'					<td>卖一</td>';
	contentStr += checkColor(parseFloat(resultData.data.sellOnePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.sellOne +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>卖二</td>';
	contentStr += checkColor(parseFloat(resultData.data.sellTwoPri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.sellTwo +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>卖三</td>';
	contentStr += checkColor(parseFloat(resultData.data.sellThreePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.sellThree +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>卖四</td>';
	contentStr += checkColor(parseFloat(resultData.data.sellFourPri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.sellFour +
		'					</td>' +
		'				</tr>' +
		'				<tr>' +
		'					<td>卖五</td>';
	contentStr += checkColor(parseFloat(resultData.data.sellFivePri).toFixed(2), basePrice);
	contentStr +=
		'					<td class="align-right">' +
		resultData.data.sellFive +
		'					</td>' +
		'				</tr>' +
		'			</table>' +
		'		</div>' +
		'	</div>' +
		'</div>';
	resultContent.innerHTML = contentStr;
}

/**
 * 判断颜色
 * 
 * @param float priceNum
 * @param float baseNum
 */
function checkColor(priceNum, baseNum) {
	var returnStr = '';
	if (priceNum > baseNum) {
		returnStr = '<td class="align-right color-danger">' + priceNum + '</td>';
	} else if (priceNum < baseNum) {
		returnStr = '<td class="align-right color-success">' + priceNum + '</td>';
	} else {
		returnStr = '<td class="align-right">' + priceNum + '</td>';
	}
	return returnStr;
}

/**
 * 添加自选
 * 
 * @param String codeStr
 */
function addStock(codeStr) {
	var allCode = localStorage.getItem('stockCode');
	if (allCode != null && allCode != '[]') {
		codeList = JSON.parse(allCode);
	}
	codeList.unshift(codeStr);
	localStorage.setItem('stockCode', JSON.stringify(codeList));
	document.getElementById('hasFlg').innerHTML = '<span class="mui-icon iconfont icon-delete" style="font-size: 18px;padding-top: 13px;"> 自选</span>';
	mui.toast('添加自选');
}

/**
 * 删除自选
 * 
 * @param String codeStr
 */
function deleteStock(codeStr) {
	var allCode = localStorage.getItem('stockCode');
	if (allCode != null && allCode != '[]') {
		codeList = JSON.parse(allCode);
	}
	for (var j = 0; j < codeList.length; j++) {
		if (codeStr == codeList[j]) {
			codeList.splice(j, 1);
		}
	}
	localStorage.setItem('stockCode', JSON.stringify(codeList));
	document.getElementById('hasFlg').innerHTML = '<span class="mui-icon iconfont icon-add" style="font-size: 18px;padding-top: 13px;"> 自选</span>';
	mui.toast('删除自选');
}