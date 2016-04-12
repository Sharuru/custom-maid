//本地 cache 读写 object
var localStorage = window.localStorage;
var codeInput = document.getElementById('trackingNumInput');
var resultContent = mui('.resultInfo')[0];
var clickButton = document.getElementById('searchButton');
var companyCode = '';
var companyName = '';
var hisList = [];

/**
 * SH001 画面初始化
 */
function initializeSH001() {
	//700075841153
	//				localStorage.removeItem('historySearch');
	companyCode = 'jd';
	companyName = '京东';
	getHistory();
	//快递公司选择选择
	mui('.search-key').on('change', '.hidden-select', function() {
		//快递公司名称变更
		document.getElementById('selectedExpressName').innerHTML = this.options[this.selectedIndex].text + '<span class="mui-icon iconfont icon-moreSelect" style="font-size: 14px;"></span>';
		//获取快递公司名称和代码
		companyCode = this.value;
		companyName = this.options[this.selectedIndex].text;
		//切换后设置焦点
		codeInput.focus();
	});
	//查询按钮点击
	clickButton.addEventListener('tap', function() {
		//console.log(companyName + '::' + companyCode);
		//未输入快递单号
		if (codeInput.value == '') {
			mui.toast('快递单号不能为空');
			return;
		}
		//清空原始记录
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		getExpressInfo(companyCode, codeInput.value, companyName);
	});
	//历史记录再查询
	mui('#historyExpressInfo').on('click', 'p', function() {
		var indexNum = this.getAttribute('id').substr('6');
		hisList.splice(indexNum, 1);
		var searchInfo = this.innerHTML;
		companyCode = searchInfo.substring(searchInfo.lastIndexOf('="') + 2, searchInfo.lastIndexOf('"'));
		var searchContext = searchInfo.substring(searchInfo.indexOf('">') + 2, searchInfo.lastIndexOf('</'));
		var searchCode = searchContext.split(' : ')[1];
		companyName = searchContext.split(' : ')[0];
		//清空原始记录
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		document.getElementById('selectedExpressName').innerHTML = companyName + '<span class="mui-icon iconfont icon-moreSelect" style="font-size: 14px;"></span>';
		codeInput.value = searchCode;
		var selOption = mui('.hidden-select')[0].options;
		for (var i = 0; i < selOption.length; i++) {
			if (selOption[i].value = companyCode) {
				selOption[i].selected = true;
			}
		}
		getExpressInfo(companyCode, searchCode, companyName);
	});
}

/**
 * 获取快递信息
 * 
 * @param {String} expressCode 物流公司代码
 * @param {String} trackingNum 快递单号
 * @param {String} expressName 物流公司名称
 */
function getExpressInfo(expressCode, trackingNum, expressName) {
	//	mui.toast('正在获取快递信息...');
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
				var searchData = new Date();
				var dataStr = searchData.getFullYear() + '.';
				dataStr += searchData.getMonth() + 1 + '.' + searchData.getDate();
				var hisInfo = {
					dateTime: dataStr,
					name: expressName,
					code: expressCode,
					num: trackingNum
				};
				setHistory(hisInfo);
				var contentStr = '';
				contentStr += '<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>';
				//基础信息：快递公司和快递单号
				contentStr += '<div class="result-block"><p class="font-s18 remove-margin-b padding-5 padding-10-l">';
				contentStr += expressName + ' : ' + trackingNum + '</p>';
				//快递详细信息
				var liStr = '';
				//判断最新一条快递信息
				if (requestData.state == 2) {
					liStr += '<li><i class="mui-icon iconfont icon-express list-timeline-icon"></i>';
				} else if (requestData.state == 3) {
					liStr += '<li><i class="mui-icon iconfont icon-express list-timeline-icon color-success"></i>';
				} else {
					liStr += '<li><i class="mui-icon iconfont icon-express list-timeline-icon color-warning"></i>';
				}
				liStr += '<div class="list-timeline-content">';
				liStr += '<p class="font-s18 remove-margin-b">' + requestData.data[0].time + '</p>';
				liStr += '<p class="font-s18 remove-margin-b">' + requestData.data[0].context + '</p>';
				liStr += '</div></li>';
				for (var i = 1; i < requestData.data.length; i++) {
					liStr += '<li><i class="mui-icon iconfont icon-express list-timeline-icon"></i>';
					liStr += '<div class="list-timeline-content">';
					liStr += '<p class="font-s18 remove-margin-b">' + requestData.data[i].time + '</p>';
					liStr += '<p class="font-s18 remove-margin-b">' + requestData.data[i].context + '</p>';
					liStr += '</div></li>';
				}
				liStr = '<ul class="list list-timeline">' + liStr + '</ul>';
				contentStr += liStr + '</div>';
				resultContent.style.display = 'block';
				resultContent.innerHTML = contentStr;
				resultContent.style.border = '#DDDDDD solid 1px';
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
	var hisContentStr = '';
	if (hisSearch == null) {
		hisContentStr += '<p class="font-s16" style="margin-bottom: 3px;">暂无历史查询记录...</p>';
	} else {
		hisContentStr += '<p class="font-s16" style="margin-bottom: 3px;">历史查询记录</p>';
		hisContentStr += '<div class="result-block">';
		hisList = JSON.parse(hisSearch);
		for (var i = 0; i < hisList.length; i++) {
			hisContentStr += '<p class="font-s16 remove-margin-b" id="record' + i + '">';
			hisContentStr += hisList[i].dateTime + '<label class="font-s16 padding-10-l style-underline">';
			hisContentStr += hisList[i].name + ' : ' + hisList[i].num + '</label>';
			hisContentStr += '<input type="hidden" value="' + hisList[i].code + '" /></p>';
		}
		hisContentStr += '</div>';
		document.getElementById('historyExpressInfo').style.border = '#DDDDDD solid 1px';
	}
	document.getElementById('historyExpressInfo').innerHTML = hisContentStr;
}

/**
 * 禁用下拉选项、输入框和查询按钮
 */
function addDisabled() {
	codeInput.disabled = 'disabled';
	clickButton.disabled = true;
	clickButton.innerHTML = '正在查询...';
	document.getElementById('selectedExpressName').style.color = '#66AFFF';
	var hiddenElement = mui('.hidden-select');
	for (var i = 0; i < hiddenElement.length; i++) {
		hiddenElement[i].disabled = true;
	}
}

/**
 * 解除禁用下拉选项、输入框和查询按钮
 */
function cancelDisabled() {
	codeInput.disabled = '';
	clickButton.disabled = false;
	clickButton.innerHTML = '开始查询';
	document.getElementById('selectedExpressName').style.color = '#007aff';
	var hiddenElement = mui('.hidden-select');
	for (var i = 0; i < hiddenElement.length; i++) {
		hiddenElement[i].disabled = false;
	}
}