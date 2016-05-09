var startObj = document.getElementById('startLoc');
var endObj = document.getElementById('endLoc');
var buttonObj = document.getElementById('searchButton');
var drivingData = null;
var transitData = null;
var ridingData = null;
var walkingData = null;
var cityObj = '';

function initSearchKey() {
	var self = plus.webview.currentWebview();
	cityObj = self.cityInfo;
	startObj.value = '我的位置';
	startObj.name = self.startPoint.lat + ',' + self.startPoint.lng;
	mui('.mui-placeholder')[0].style.display = 'none';
	if (self.endPoint != undefined) {
		endObj.value = self.nameStr;
		endObj.name = self.endPoint.lat + ',' + self.endPoint.lng;
		mui('.mui-placeholder')[1].style.display = 'none';
	} else {
		var endAutoObj = new BMap.Autocomplete({
			input: 'endLoc',
			location: cityObj
		});

		endAutoObj.addEventListener('onconfirm', function(e) {
			var addValue = e.item.value;
			var addStr = addValue.province + addValue.city + addValue.district + addValue.street + addValue.business;
			var cityStr = addValue.city;
			setLocation(addStr, cityStr, endObj);
		});
	}

	buttonObj.addEventListener('tap', function() {
		buttonObj.innerHTML = '正在查询...';
		buttonObj.disabled = true;
		getDrivingData(startObj.name, endObj.name, cityObj);
	});
}

function setStartAuto() {
	var startAutoObj = new BMap.Autocomplete({
		input: 'startLoc',
		location: cityObj
	});

	startAutoObj.addEventListener('onconfirm', function(e) {
		var addValue = e.item.value;
		var addStr = addValue.province + addValue.city + addValue.district + addValue.street + addValue.business;
		var cityStr = addValue.city;
		setLocation(addStr, cityStr, startObj);
	});
}

function setLocation(valueObj, cityObj, posObj) {
	//智能搜索
	var getGeo = new BMap.Geocoder();
	getGeo.getPoint(valueObj, function(pointResult) {
		if (pointResult) {
			posObj.name = pointResult.lat + ',' + pointResult.lng;
		} else {
			mui.toast('该地址没有解析结果');
		}
	}, cityObj);
}

function getDrivingData(startPosition, endPosition, cityLocation) {
	mui.ajax(serverAddr + 'travel/outing/driving', {
		data: {
			origin: startPosition,
			destination: endPosition,
			origin_region: cityLocation,
			destination_region: cityLocation
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.status == 0 && requestData.result != null) {
				drivingData = requestData.result;
			}
			getTransitData(startPosition, endPosition, cityLocation);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得线路信息', '重试', function() {
				getDrivingData(startPosition, endPosition, cityLocation);
			});
		}
	});
}

function getTransitData(startPosition, endPosition, cityLocation) {
	mui.ajax(serverAddr + 'travel/outing/transit', {
		data: {
			origin: startPosition,
			destination: endPosition,
			region: cityLocation,
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.status == 0 && requestData.result != null) {
				transitData = requestData.result;
			}
			getWalkingData(startPosition, endPosition, cityLocation);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得线路信息', '重试', function() {
				getTransitData(startPosition, endPosition, cityLocation);
			});
		}
	});
}

function getWalkingData(startPosition, endPosition, cityLocation) {
	mui.ajax(serverAddr + 'travel/outing/walking', {
		data: {
			origin: startPosition,
			destination: endPosition,
			region: cityLocation,
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.status == 0 && requestData.result != null) {
				walkingData = requestData.result;
			}
			getRidingData(startPosition, endPosition, cityLocation);
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得线路信息', '重试', function() {
				getWalkingData(startPosition, endPosition, cityLocation);
			});
		}
	});
}

function getRidingData(startPosition, endPosition, cityLocation) {
	mui.ajax(serverAddr + 'travel/outing/riding', {
		data: {
			origin: startPosition,
			destination: endPosition,
			region: cityLocation,
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.status == 0 && requestData.result != null) {
				ridingData = requestData.result;
			}
			turnToResult();
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得线路信息', '重试', function() {
				getRidingData(startPosition, endPosition, cityLocation);
			});
		}
	});
}

function turnToResult() {
	buttonObj.innerHTML = '开始查询';
	buttonObj.disabled = false;
	if (drivingData == null || transitData == null || walkingData == null || ridingData == null) {
		mui.toast('线路信息获取失败');
		return;
	}
	setTimeout(function() {
		mui.openWindow({
			url: 'ROUTE_RESULT.html',
			id: 'PAGE_ROUTE_RESULT',
			show: {
				aniShow: 'pop-in',
				duration: 200
			},
			extras: {
				startObj:startObj.value,
				endObj:endObj.value,
				drivingObj: drivingData,
				transitObj: transitData,
				ridingObj: ridingData,
				walkingObj: walkingData
			},
			waiting: {
				autoShow: false
			}
		});
	}, 200);
}