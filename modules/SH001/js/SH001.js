//本地 cache 读写 object
var localStorage = window.localStorage;
var codeInput = document.getElementById('trackingNumInput');
var expressInfo = document.getElementById('expressInformation');
var clickButton = document.getElementById('searchButton');
var hisLayer = document.getElementById('historyExpressInfo');
var companyCode = '';
var companyName = '';
var hisList = [];

/**
 * SH001 画面初始化
 */
function initializeSH001() {
	//	localStorage.removeItem('historySearch');
	companyCode = 'jd';
	companyName = '京东';
	getHistory();
	//快递公司选择选择
	mui("body").on('change', '.hidden-select', function() {
		//快递公司名称变更
		document.getElementById('selectedExpressName').innerText = this.options[this.selectedIndex].text + ' ◢';
		//获取快递公司名称和代码
		companyCode = this.value;
		companyName = this.options[this.selectedIndex].text;
		//清除输入
		//		codeInput.value = '';
		//切换后设置焦点
		codeInput.focus();
	});
	//查询按钮点击
	mui("body").on('tap', '#searchButton', function() {
		//未选择快递公司
		if (companyCode == '') {
			mui.alert('请选择快递公司');
			return;
		}
		//未输入快递单号
		if (codeInput.value == '') {
			mui.alert('请输入快递单号');
			return;
		}
		//清空原始记录
		expressInfo.innerHTML = '';
		getExpressInfo(companyCode, codeInput.value, companyName);
	});
	//历史记录再查询
	mui("body").on('click', '.history-record', function() {
		var indexNum = 2 * this.parentNode.rowIndex + this.cellIndex;
		hisList.splice(indexNum, 1);
		var searchInfo = this.innerHTML;
		if (searchInfo == ' ') {
			return;
		}
		var searchCode = searchInfo.substring(searchInfo.lastIndexOf('="') + 2, searchInfo.indexOf('">'));
		var searchContext = searchInfo.substring(0, searchInfo.indexOf('<'));
		var searchNum = searchContext.split(' : ')[1];
		var searchName = searchContext.split(' : ')[0];
		//清空原始记录
		expressInfo.innerHTML = '';
		getExpressInfo(searchCode, searchNum, searchName);
	});
}

/**
 * 获取快递信息
 * 
 * @param String expressCode 物流公司代码
 * @param String trackingNum 快递单号
 * @param String expressName 物流公司名称
 */
function getExpressInfo(expressCode, trackingNum, expressName) {
	mui.toast('正在获取快递信息...');
	addDisabled();
	mui.ajax(serverAddr + 'tools/express', {
		data: {
			company: expressCode,
			postid: trackingNum
		},
		//服务器返回json格式数据
		dataType: 'json',
		//http请求类型
		type: 'get',
		//超时时间设置为10 秒；
		timeout: 10000,
		success: function(requestData) {
			if (requestData.status != '200') {
				mui.toast(requestData.message);
				cancelDisabled();
			} else {
				var hisInfo = {
					name: expressName,
					code: expressCode,
					num: trackingNum
				};
				setHistory(hisInfo);
				//基础信息：快递公司和快递单号
				var baseInfoStr = '';
				baseInfoStr += '<div class="base-information"><p class="font-w300-s14">' + expressName + ' : ' + trackingNum + '<\p></div>';
				//快递详细信息
				var liStr = '';
				//判断最新一条快递信息
				if (requestData.state == 2) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon"></i>';
				} else if (requestData.state == 3) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon color-success"></i>';
				} else {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon color-warning"></i>';
				}
				liStr += '<div class="list-timeline-content">';
				liStr += '<p class="font-w300-s14">' + requestData.data[0].time + '</p>';
				liStr += '<p class="font-w500-s14">' + requestData.data[0].context + '</p>';
				liStr += '</div></li>';
				for (var i = 1; i < requestData.data.length; i++) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon"></i>';
					liStr += '<div class="list-timeline-content">';
					liStr += '<p class="font-w300-s14">' + requestData.data[i].time + '</p>';
					liStr += '<p class="font-w500-s14">' + requestData.data[i].context + '</p>';
					liStr += '</div></li>';
				}
				liStr = '<ul class="list list-timeline">' + liStr + '</ul>';
				expressInfo.innerHTML = baseInfoStr + liStr;
				cancelDisabled();
				getHistory();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得快递信息', '重试', function() {
				getExpressInfo(expressCode, trackingNum, expressName);
			});
		}
	});
}

/**
 * 添加历史查询记录
 */
function setHistory(infoStr) {
	hisList.unshift(infoStr);
	if (hisList.length > 10) {
		hisList.pop();
	}
	localStorage.setItem('historySearch', JSON.stringify(hisList));
}

/**
 * 获取历史查询记录
 */
function getHistory() {
	var hisSearch = localStorage.getItem('historySearch');
	if (hisSearch == null) {
		hisLayer.innerHTML = '<p class="font-w300-s14">暂无历史查询记录...</p>';
	} else {
		hisLayer.innerHTML = '<p class="font-w300-s14">历史查询记录</p>';
		hisList = JSON.parse(hisSearch);
		var hisContext = '';
		//判断历史记录数的奇偶
		if (hisList.length % 2 == 0) {
			//偶数条记录处理
			for (var i = 0; i < hisList.length / 2; i++) {
				hisContext += '<tr><td class="history-record font-w300-s12">' + hisList[2 * i].name + ' : ' + hisList[2 * i].num;
				hisContext += '<input type="hidden" value="' + hisList[2 * i].code + '" /></td>';
				hisContext += '<td class="history-record font-w300-s12">' + hisList[2 * i + 1].name + ' : ' + hisList[2 * i + 1].num;
				hisContext += '<input type="hidden" value="' + hisList[2 * i].code + '" /></td>';
				hisContext += '</tr>';
			}
		} else {
			//奇数条记录处理
			for (var i = 0; i < parseInt(hisList.length / 2 + 1); i++) {
				if (i == parseInt(hisList.length / 2)) {
					hisContext += '<tr><td class="history-record font-w300-s12">' + hisList[2 * i].name + ' : ' + hisList[2 * i].num;
					hisContext += '<input type="hidden" value="' + hisList[2 * i].code + '" /></td>';
					hisContext += '<td class="history-record font-w300-s12"> </td></tr>';
				} else {
					hisContext += '<tr><td class="history-record font-w300-s12">' + hisList[2 * i].name + ' : ' + hisList[2 * i].num;
					hisContext += '<input type="hidden" value="' + hisList[2 * i].code + '" /></td>';
					hisContext += '<td class="history-record font-w300-s12">' + hisList[2 * i + 1].name + ' : ' + hisList[2 * i + 1].num;
					hisContext += '<input type="hidden" value="' + hisList[2 * i].code + '" /></td></tr>';
				}
			}
		}
		hisContext = '<table>' + hisContext + '</table>';
		hisLayer.innerHTML += hisContext;
	}
}

/**
 * 禁用输入框和查询按钮
 */
function addDisabled() {
	codeInput.disabled = 'disabled';
	clickButton.disabled = true;
	clickButton.style.color = '#D3D3D3';
}

/**
 * 解除禁用输入框和查询按钮
 */
function cancelDisabled() {
	codeInput.disabled = '';
	clickButton.disabled = false;
	clickButton.style.color = 'dimgray';
}