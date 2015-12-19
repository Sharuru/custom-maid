var exchangeRate = new Object();

function initializeGJ001() {
	console.log("In GJ001");
	//获取数据
	getExchangeRate(setGJ001);
	//绑定点击动作
}

function setGJ001(){
	//默认汇率对为美元-人民币
	var str ='1美元=' + (exchangeRate.result[0].data1.bankConversionPri/100).toString().substring(0,6) +'元, ';
	str += ' 更新时间: ' + exchangeRate.result[0].data1.date  + ' ' + exchangeRate.result[0].data1.time;
	document.getElementById('exchangeRateText').innerText = str;
	
}

function getExchangeRate(callback) {
	var localStorage = window.localStorage;
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