var exchangeRate = new Object();
var localStorage = window.localStorage;
var currRate;

function initializeGJ001() {
	console.log("In GJ001");
	//获取数据并显示默认
	getExchangeRate(setDefaultPair);
	//初始化其他元素
	document.getElementById('exchangeTwoInput').value = 0;
	//绑定动作
	//货币选择动作
	mui("body").on('change', '.money-type-select', function() {
		document.getElementById(this.id.substring(0, 11) + 'Pic').src = '../../res/images/modules/GJ001/' + localStorage.getItem(this.value) + '.png';
		document.getElementById(this.id.substring(0, 11) + 'Text').innerText = this.value;
		calculateRate(document.getElementById('exchangeOneSelect').value, document.getElementById('exchangeTwoSelect').value, 100);
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

function calculateRate(m1, m2, balance) {
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
	console.log(m1Rate + " - " + m2Rate);
	currRate = (m1Rate / m2Rate).toString().substring(0, 6);
	console.log('currRate set: ' + currRate);
	var str = '1' + m1 + '=' + (currRate + m2 + ', ');
	str += ' 更新时间: ' + exchangeRate.result[0].data1.date + ' ' + exchangeRate.result[0].data1.time;
	document.getElementById('exchangeRateText').innerText = str;
}

function setDefaultPair() {
	//默认汇率对为美元-人民币
	currRate = (exchangeRate.result[0].data1.bankConversionPri / 100).toString().substring(0, 6);
	console.log('currRate set: ' + currRate);
	var str = '1美元=' + (currRate + '元, ');
	str += ' 更新时间: ' + exchangeRate.result[0].data1.date + ' ' + exchangeRate.result[0].data1.time;
	document.getElementById('exchangeRateText').innerText = str;
}

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
			callback();
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert("在连接服务器时发生异常");
		}
	});
}