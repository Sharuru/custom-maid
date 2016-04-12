function initBusDetail() {
	var self = plus.webview.currentWebview();
	console.log(self.cityName + ' : ' + self.stationName + ' : ' + self.data);
}

function getAjax(cityStr,dataStr) {
	mui.ajax(serverAddr + 'travel/busInfo', {
		data: {
			city: cityStr,
			bus: dataStr
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			//console.log(JSON.stringify(requestData));
			if (requestData.error_code != 0 || requestData == null) {
				mui.toast('没有找到匹配的公交线路信息');
			} else {
				resultContent.innerHTML = dealResult(requestData);
				resultContent.style.border = '#DDDDDD solid 1px';
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得公交信息', '重试', function() {
				getAjax(cityStr,dataStr);
			});
		}
	});
}

function dealResult(resultData){
	
}
