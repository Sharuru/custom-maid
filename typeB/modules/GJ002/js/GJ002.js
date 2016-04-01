var lotteryKind = 'dlt,fc3d,pl3,pl5,qlc,qxc,ssq';
var lotteryList = [];
var resultContent = mui('.resultInfo')[0];
var currentIndex = 0;

/**
 * GJ002 页面初始化
 */
function initializeGJ002() {
	resultContent.innerHTML = '';
	getAjax();
	mui('.resultInfo').on('tap', '.toDetail', function() {
		//console.log(this.id.replace('lottery', ''));
		var lotId = this.id.replace('lottery', '');
		//没有数据
		if (lotteryList.length == 0) {
			mui.toast('出现未知错误');
		} else {
			//有数据，画面迁移
			mui.openWindow({
				url: 'Detail.html',
				id: 'Detail',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					lotName: lotteryList[lotId].name,
					lotData: lotteryList[lotId].data
				},
				waiting: {
					autoShow: false
				}
			});
		}
	});
}

/**
 * 获取彩种开奖结果并添加到数组中
 */
function getAjax() {
	var kindCode = lotteryKind.split(',');
	if (currentIndex >= kindCode.length) {
		getList();
		return;
	}
	mui.ajax(serverAddr + 'tools/lottery', {
		data: {
			code: kindCode[currentIndex]
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.data == null) {
				mui.toast('获取数据失败');
			} else {
				var infoStr = {
					code: requestData.code,
					name: getLotteryName(requestData.code),
					data: requestData.data
				}
				lotteryList.unshift(infoStr);
				currentIndex++;
				getAjax();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得车次信息', '重试', function() {
				getAjax(codeStr);
			});
		}
	});
}

/**
 * 循环获取彩票
 */
function getList() {
	for (var j = 0; j < lotteryList.length; j++) {
		//console.log(JSON.stringify(lotteryList[j]));
		var resultNum = lotteryList[j].data[0].opencode;
		var redNum = '';
		var blueNum = '';
		if (resultNum.indexOf('+') == -1) {
			redNum = resultNum;
		} else {
			redNum = resultNum.substring(0, resultNum.indexOf('+'));
			blueNum = resultNum.substring(resultNum.indexOf('+') + 1, resultNum.length);
		}
		var innerStr = getDetailStr(lotteryList[j].code, lotteryList[j].name, lotteryList[j].data[0].expect, redNum, blueNum, j);
		resultContent.innerHTML += innerStr;
	}
}

/**
 * 显示彩票信息
 * 
 * @param String codeStr 彩种编码
 * @param String nameStr 彩种名称
 * @param String expectStr 开奖期数
 * @param String redNumStr 红球
 * @param String blueNumStr 蓝球
 * @param String idFlg 编号
 */
function getDetailStr(codeStr, nameStr, expectStr, redNumStr, blueNumStr, idFlg) {
	var contentStr = '';
	contentStr +=
		'<div class="result-block">' +
		'	<div class="mui-row">' +
		'		<div class="mui-col-xs-10">' +
		'			<div class="lottery-Info">' +
		'				<div class="lottery-name">' +
		nameStr +
		'				</div>' +
		'				<div class="font-s16 padding-20-l float-left" style="padding-top: 2px;">' +
		'第 ' + expectStr + ' 期' +
		'				</div>' +
		'			</div>' +
		'			<div class="lottery-result">';
	for (var i = 0; i < redNumStr.split(',').length; i++) {
		contentStr +=
			'			<div class="lottery-circle-r">' +
			'				<span class="circle-text">' +
			redNumStr.split(',')[i] +
			'				</span>' +
			'			</div>';
	}
	if (blueNumStr != '') {
		for (var j = 0; j < blueNumStr.split(',').length; j++) {
			contentStr +=
				'		<div class="lottery-circle-b">' +
				'			<span class="circle-text">' +
				blueNumStr.split(',')[j] +
				'			</span>' +
				'		</div>';
		}
	}
	contentStr +=
		'			</div>' +
		'		</div>' +
		'		<div class="mui-col-xs-2 align-right">' +
		'			<span class="mui-icon iconfont icon-toDetail toDetail" id="lottery' + idFlg + '"></span>' +
		'		</div>' +
		'	</div>' +
		'</div>';
	return contentStr;
}

/**
 * 根据彩种编码获取彩种名称
 * 
 * @param String lotteryCode 彩种编码
 */
function getLotteryName(lotteryCode) {
	var nameStr;
	if (lotteryCode == 'dlt') {
		nameStr = '大乐透';
	} else if (lotteryCode == 'fc3d') {
		nameStr = '福彩 3D';
	} else if (lotteryCode == 'pl3') {
		nameStr = '排列 3';
	} else if (lotteryCode == 'pl5') {
		nameStr = '排列 5';
	} else if (lotteryCode == 'qlc') {
		nameStr = '七乐彩';
	} else if (lotteryCode == 'qxc') {
		nameStr = '七星彩';
	} else if (lotteryCode == 'ssq') {
		nameStr = '双色球';
	}
	return nameStr;
}