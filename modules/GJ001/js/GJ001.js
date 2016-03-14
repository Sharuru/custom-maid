//数据 obj
var exchangeRate = new Object();
//本地 cache 读写 object
var localStorage = window.localStorage;
//计算时使用汇率
var currRate;
var exchangeOneInput = document.getElementById('exchangeOneInput');
var exchangeTwoInput = document.getElementById('exchangeTwoInput');

/**
 * GJ001 画面初始化
 */
function initializeGJ001() {
	//console.log(exchangeOneInput);
	//获取汇率数据
	getExchangeRate('美元', '人民币');
	//	//设置默认焦点
	//	exchangeOneInput.focus();
	//绑定动作
	//输入框清除按钮点击
	mui('.mui-main').on('click', '.mui-icon-close-filled', function() {
		exchangeOneInput.value = '';
		exchangeTwoInput.value = '';
	});
	//货币对选择
	mui('.mui-main').on('change', '.money-type-select', function() {
		//选择后设置代表国旗与货币名称
		document.getElementById(this.id.substring(0, 11) + 'Pic').src = '../../res/images/modules/GJ001/' + localStorage.getItem(this.value) + '.png';
		document.getElementById(this.id.substring(0, 11) + 'Text').innerText = this.value;
		//等待提示
		document.getElementById('exchangeRateText').innerText = '正在获取汇率信息...';
		//计算汇率
		setCurrRate(document.getElementById('exchangeOneSelect').value, document.getElementById('exchangeTwoSelect').value);
		//根据触发事件的控件id来更改对应计算值
		if (this.id == 'exchangeOneSelect') {
			exchangeOneInput.value = (exchangeTwoInput.value * (1 / currRate)).toFixed(2);
		} else {
			exchangeTwoInput.value = (exchangeOneInput.value * currRate).toFixed(2);
		}

	});
	//TODO: 输入格式化与检测
	//输入值时实时计算对应货币对的值
	exchangeOneInput.addEventListener('input', function() {
		exchangeTwoInput.value = (this.value * currRate).toFixed(2);
	});
	exchangeTwoInput.addEventListener('input', function() {
		exchangeOneInput.value = (this.value * (1 / currRate)).toFixed(2);
	});
	//银行选择
	mui('.mui-main').on('change', '.hidden-select', function() {
		//银行名变更
		document.getElementById('selectedBankName').innerText = this.options[this.selectedIndex].text;
		//清除输入
		exchangeOneInput.value = '';
		exchangeTwoInput.value = '';
		//选择后更新汇率
		getExchangeRate(document.getElementById('exchangeOneSelect').value, document.getElementById('exchangeTwoSelect').value);
		//切换后设置焦点
		exchangeOneInput.focus();
	});
}

/*
 * 设置计算时使用汇率
 * 
 * @param String m1 货币种类名1
 * @param String m2 货币种类名2
 */
function setCurrRate(m1, m2) {
	//货币汇率
	var m1Rate, m2Rate;
	//遍历数据获得对应汇率
	for (currObj in exchangeRate.result[0]) {
		if (exchangeRate.result[0][currObj].name == m1) {
			m1Rate = exchangeRate.result[0][currObj].bankConversionPri;
		}
		if (exchangeRate.result[0][currObj].name == m2) {
			m2Rate = exchangeRate.result[0][currObj].bankConversionPri;
		}
	}
	//中间货币处理
	if (m1 == '人民币') {
		m1Rate = 100;
	}
	if (m2 == '人民币') {
		m2Rate = 100;
	}
	//设置计算使用汇率并样式截取
	currRate = (m1Rate / m2Rate).toString().substring(0, 6);
	console.log('currRate is setted: ' + currRate);
	if (currRate == 'NaN') {
		mui.alert('所选银行暂无该货币对报价', '无法计算');
	}
	setRateText(m1, m2);
}

/*
 * 设置汇率文字
 * 
 * @param String m1 货币种类名1
 * @param String m2 货币种类名2
 */
function setRateText(m1, m2) {
	if (currRate == 'NaN') {
		document.getElementById('exchangeRateText').innerText = '所选银行暂无该货币对报价';
	} else {
		var str = '1' + m1 + '=' + (currRate + m2 + ', ');
		str += ' 更新时间: ' + exchangeRate.result[0].data1.date + ' ' + exchangeRate.result[0].data1.time;
		document.getElementById('exchangeRateText').innerText = str;
	}

}

/*
 * 获得汇率数据
 * 
 * @param String m1 货币种类名1
 * @param String m2 货币种类名2
 */
function getExchangeRate(m1, m2) {
	//锁定界面
	exchangeOneInput.disabled = 'disabled';
	exchangeTwoInput.disabled = 'disabled';
	exchangeOneInput.placeholder = '请等待...';
	exchangeTwoInput.placeholder = '请等待...';
	mui.ajax(serverAddr + 'tools/exchange', {
		data: {
			bank: document.getElementById('bankSelect').value
		},
		//服务器返回json格式数据
		dataType: 'json',
		//http请求类型
		type: 'get',
		//超时时间设置为10 秒；
		timeout: 10000,
		success: function(data) {
			//赋值
			exchangeRate = data;
			setCurrRate(m1, m2);
			exchangeOneInput.disabled = '';
			exchangeTwoInput.disabled = '';
			exchangeOneInput.placeholder = '请输入金额';
			exchangeTwoInput.placeholder = '请输入金额';
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得汇率信息', '重试', function() {
				getExchangeRate(m1, m2);
			});
		}
	});
}