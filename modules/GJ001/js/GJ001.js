var exchangeRate = new Object();
var localStorage = window.localStorage;
var currRate;

function initializeGJ001() {
	//获取汇率数据
	getExchangeRate();
	//绑定动作
	//清除按钮点击
	mui("body").on('click', '.mui-icon-close-filled', function() {
		document.getElementById('exchangeOneInput').value = '';
		document.getElementById('exchangeTwoInput').value = '';
	});
	//货币选择动作
	mui("body").on('change', '.money-type-select', function() {
		document.getElementById(this.id.substring(0, 11) + 'Pic').src = '../../res/images/modules/GJ001/' + localStorage.getItem(this.value) + '.png';
		document.getElementById(this.id.substring(0, 11) + 'Text').innerText = this.value;
		calculateRate(document.getElementById('exchangeOneSelect').value, document.getElementById('exchangeTwoSelect').value);
		if (this.id == 'exchangeOneSelect') {
			document.getElementById('exchangeOneInput').value = (document.getElementById('exchangeTwoInput').value * (1 / currRate)).toFixed(2);
		} else {
			document.getElementById('exchangeTwoInput').value = (document.getElementById('exchangeOneInput').value * currRate).toFixed(2);
		}
	});
	//TODO: 输入格式化与检测
	document.getElementById('exchangeOneInput').addEventListener('input', function() {
		document.getElementById('exchangeTwoInput').value = (this.value * currRate).toFixed(2);
	});
	document.getElementById('exchangeTwoInput').addEventListener('input', function() {
		console.log('currRate:' + currRate);
		document.getElementById('exchangeOneInput').value = (this.value * (1 / currRate)).toFixed(2);
	});
}

//汇率计算
function calculateRate(m1, m2) {
	var m1Rate, m2Rate;
	//循环获得对应汇率
	for (currObj in exchangeRate.result[0]) {
		if (exchangeRate.result[0][currObj].name == m1) {
			m1Rate = exchangeRate.result[0][currObj].bankConversionPri;
		}
		if (exchangeRate.result[0][currObj].name == m2) {
			m2Rate = exchangeRate.result[0][currObj].bankConversionPri;
		}
	}
	if (m1 == '人民币') {
		m1Rate = 100;
	}
	if (m2 == '人民币') {
		m2Rate = 100;
	}
	currRate = (m1Rate / m2Rate).toString().substring(0, 6);
	var str = '1' + m1 + '=' + (currRate + m2 + ', ');
	str += ' 更新时间: ' + exchangeRate.result[0].data1.date + ' ' + exchangeRate.result[0].data1.time;
	document.getElementById('exchangeRateText').innerText = str;
}

//获得汇率 JSON
function getExchangeRate(callback) {
	mui.ajax(serverAddr + 'tools/exchange', {
		data: {
			//默认获得中国银行的报价
			bank: "3"
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'get', //HTTP请求类型
		timeout: 10000, //超时时间设置为 10 秒；
		success: function(data) {
			//赋值
			exchangeRate = data;
			calculateRate("美元", "人民币");
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert("在连接服务器时发生异常");
		}
	});
}