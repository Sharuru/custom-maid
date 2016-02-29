//本地 cache 读写 object
var localStorage = window.localStorage;
var codeInput = document.getElementById('trackingNumInput');
var baseInfo = document.getElementById('baseInformation');
var expressList = document.getElementById('expressInfoList');
var clickButton = document.getElementById('searchButton');
var companyCode = '';
var companyName = '';

/**
 * SH001 画面初始化
 */
function initializeSH001() {
	//快递公司选择选择
	mui("body").on('change', '.hidden-select', function() {
		//快递公司名称变更
		document.getElementById('selectedExpressName').innerText = this.options[this.selectedIndex].text;
		companyCode = this.options[this.selectedIndex].value;
		companyName = this.options[this.selectedIndex].text;
		//清除输入
		codeInput.value = '';
		//切换后设置焦点
		codeInput.focus();
	});
	//查询按钮点击
	mui("body").on('click', '.search-icon', function() {
		if (companyCode == '') {
			console.log('请选择快递公司');
			return;
		}
		if (codeInput.value == '') {
			console.log('请输入快递单号');
			return;
		}
		baseInfo.innerHTML = '';
		expressList.innerHTML = '';
		var baseInfoStr = '';
		baseInfoStr += '<p class="font-w300">' + companyName + ' : ' + codeInput.value + '<\p>';
		baseInfo.innerHTML = baseInfoStr;
		getExpressInfo(companyCode, codeInput.value, companyName);
	});
}

function getExpressInfo(expressCode, trackingNum, expressName) {
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
			if (requestData.status == '201') {
				var errorMsg = '';
				errorMsg += '<p class="font-w300">' + requestData.message + '</p>';
				baseInfo.innerHTML = errorMsg;
				cancleDisabled();
			} else {
				var liStr = '';
				for (var i = requestData.data.length - 1; i > 0; i--) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon"></i>';
					liStr += '<div class="list-timeline-content">';
					liStr += '<p class="font-w300">' + requestData.data[i].time + '</p>';
					liStr += '<p class="font-w500">' + requestData.data[i].context + '</p>';
					liStr += '</div></li>';
				}
				if (requestData.state == 2) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon"></i>';
				} else if (requestData.state == 3) {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon color-success"></i>';
				} else {
					liStr += '<li><i class="mui-icon iconfont icon-expressInfo list-timeline-icon color-warning"></i>';
				}
				liStr += '<div class="list-timeline-content">';
				liStr += '<p class="font-w300">' + requestData.data[0].time + '</p>';
				liStr += '<p class="font-w500">' + requestData.data[0].context + '</p>';
				liStr += '</div></li>';
				liStr = '<ul class="list list-timeline">' + liStr + '</ul>';
				expressList.innerHTML = liStr;
				cancleDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得快递信息', '重试', function() {
				getExpressInfo(expressCode, trackingNum);
			});
		}
	});
}

function addDisabled() {
	codeInput.disabled = 'disabled';
	clickButton.disabled = true;
}

function cancleDisabled() {
	codeInput.disabled = '';
	clickButton.disabled = false;
}