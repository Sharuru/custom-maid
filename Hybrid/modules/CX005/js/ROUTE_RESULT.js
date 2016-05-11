var drivingData = null;
var transitData = null;
var ridingData = null;
var walkingData = null;
var startData = '';
var endData = '';

function initResult() {
	mui('.search-block')[0].getElementsByTagName('span')[0].style.color = '#007AFF';
	var self = plus.webview.currentWebview();
	drivingData = self.drivingObj;
	transitData = self.transitObj;
	ridingData = self.ridingObj;
	walkingData = self.walkingObj;
	startData = self.startObj;
	endData = self.endObj;
	initLocation();
	initDrivingRoute(drivingData);
	initDataShow(drivingData);
}

function initLocation() {
	var locationStr = '';
	locationStr +=
		'<div class="location-result">' +
		'	<div class="mui-row font-s18 padding-10-l padding-5">起点：' +
		'		<label class="padding-10-l">' +
		startData +
		'		</label>' +
		'	</div>' +
		'	<div class="mui-row font-s18 padding-10-l">终点：' +
		'		<label class="padding-10-l">' +
		endData +
		'		</label>' +
		'	</div>' +
		'</div>';
	document.getElementById('locationInfo').innerHTML = locationStr;
}

function changeRouteType(index) {
	clearActive();
	mui('.search-block')[0].getElementsByTagName('span')[index].style.color = '#007AFF';
	if (index == 0) {
		initDrivingRoute(drivingData);
		initDataShow(drivingData);
	} else if (index == 1) {
		initTransitRoute(transitData);
		initTransitDataShow(transitData);
	} else if (index == 2) {
		initWalkingRoute(ridingData);
		initDataShow(ridingData);
	} else {
		initWalkingRoute(walkingData);
		initDataShow(walkingData);
	}
}

function initDrivingRoute(dataObj) {
	var mapObj = new BMap.Map("mapInfo");
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		offset: new BMap.Size(5, 5)
	};
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	var startP = new BMap.Point(dataObj.origin.originPt.lng, dataObj.origin.originPt.lat);
	var endP = new BMap.Point(dataObj.destination.destinationPt.lng, dataObj.destination.destinationPt.lat);
	mapObj.centerAndZoom(startP, 12);
	var driving = new BMap.DrivingRoute(mapObj, {
		renderOptions: {
			map: mapObj,
			autoViewport: true
		}
	});
	driving.search(startP, endP);
}

function initTransitRoute(dataObj) {
	var mapObj = new BMap.Map("mapInfo");
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		offset: new BMap.Size(5, 5)
	};
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	var startP = new BMap.Point(dataObj.origin.originPt.lng, dataObj.origin.originPt.lat);
	var endP = new BMap.Point(dataObj.destination.destinationPt.lng, dataObj.destination.destinationPt.lat);
	mapObj.centerAndZoom(startP, 12);
	var transit = new BMap.TransitRoute(mapObj, {
		renderOptions: {
			map: mapObj,
			autoViewport: true
		}
	});
	transit.search(startP, endP);
}

function initWalkingRoute(dataObj) {
	var mapObj = new BMap.Map("mapInfo");
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		offset: new BMap.Size(5, 5)
	};
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	var startP = new BMap.Point(dataObj.origin.originPt.lng, dataObj.origin.originPt.lat);
	var endP = new BMap.Point(dataObj.destination.destinationPt.lng, dataObj.destination.destinationPt.lat);
	mapObj.centerAndZoom(startP, 12);
	var walking = new BMap.WalkingRoute(mapObj, {
		renderOptions: {
			map: mapObj,
			autoViewport: true
		}
	});
	walking.search(startP, endP);
}

function initDataShow(dataObj) {
	var contentStr = '';
	contentStr +=
		'<div class="mui-row border-b">' +
		'	<p class="disAndDurInfo remove-margin-b">' +
		getDisAndDur(dataObj.routes[0].distance, dataObj.routes[0].duration) +
		'	</p>' +
		'</div>' +
		'<div class="route-result">';
	var stepObj = dataObj.routes[0].steps;
	contentStr +=
		'<div class="mui-row font-s16" style="padding: 5px 15px 2px;">' +
		'	<div class="mui-col-xs-2 align-center">' +
		'		<span class="mui-icon iconfont icon-nextStation color-success"></span>' +
		'	</div>' +
		'	<div class="mui-col-xs-10 padding-10-l">' +
		'		<p class="remove-margin-b">' +
		stepObj[0].instructions +
		'		</p>' +
		'	</div>' +
		'</div>';
	for (var i = 1; i < stepObj.length - 1; i++) {
		contentStr +=
			'<div class="mui-row font-s16" style="padding: 5px 15px 2px;">' +
			'	<div class="mui-col-xs-2 align-center">' +
			'		<span class="mui-icon iconfont icon-nextStation" style="color: #777777;"></span>' +
			'	</div>' +
			'	<div class="mui-col-xs-10 padding-10-l">' +
			'		<p class="remove-margin-b">' +
			stepObj[i].instructions +
			'		</p>' +
			'	</div>' +
			'</div>';
	}
	contentStr +=
		'<div class="mui-row font-s16" style="padding: 5px 15px 2px;">' +
		'	<div class="mui-col-xs-2 align-center">' +
		'		<span class="mui-icon iconfont icon-express color-warning"></span>' +
		'	</div>' +
		'	<div class="mui-col-xs-10 padding-10-l">' +
		'		<p class="remove-margin-b">' +
		stepObj[stepObj.length - 1].instructions +
		'		</p>' +
		'	</div>' +
		'</div>';
	contentStr += '</div>';
	document.getElementById('resultInfo').innerHTML = contentStr;
}

function initTransitDataShow(dataObj) {
	var contentStr = '';
	contentStr += '<div class="route-result">';
	var stepObj = dataObj.routes;
	for (var i = 0; i < stepObj.length; i++) {
		contentStr +=
			'<div class="mui-row padding-10-l border-b padding-5 padding-5-t">' +
			'	<p class="font-s18 remove-margin-b">方案' + parseFloat(i + 1) + ': ' +
			'		<label class="font-s16 remove-margin-b">' +
			getBaseInfo(stepObj[i].scheme[0].distance, stepObj[i].scheme[0].duration, stepObj[i].scheme[0].line_price[0].line_price) +
			'		</label>' +
			'	</p>' +
			'</div>' +
			getStepsInfo(stepObj[i].scheme[0].steps);
	}
	contentStr += '</div>';
	document.getElementById('resultInfo').innerHTML = contentStr;
}

function getBaseInfo(distanceObj, durationObj, priceObj) {
	var baseStr = '';
	var distanceStr = '';
	if (parseFloat(distanceObj) > 999) {
		distanceStr = parseFloat(distanceObj / 1000).toFixed(1);
	}
	baseStr += dealSecondTime(durationObj) + ' | ' + distanceStr + '公里 | ' + priceObj.substring(0, priceObj.length - 2) + '元';
	return baseStr;
}

function getDisAndDur(distanceObj, durationObj) {
	var baseStr = '';
	var distanceStr = '';
	if (parseFloat(distanceObj) > 999) {
		distanceStr = parseFloat(distanceObj / 1000).toFixed(1);
	}
	baseStr += '全程' + distanceStr + '公里, 耗时' + dealSecondTime(durationObj);
	return baseStr;
}

function getStepsInfo(stepsObj) {
	var returnStr = '';
	for (var i = 0; i < stepsObj.length; i++) {
		var infoObj = stepsObj[i];
		if (i == 0) {
			returnStr +=
				'<div class="mui-row" style="padding: 5px 15px 3px">' +
				'	<div class="mui-col-xs-2 align-center">' +
				'		<span class="mui-icon iconfont icon-nextStation color-success"></span>' +
				'	</div>' +
				'	<div class="mui-col-xs-10 padding-10-l">' +
				infoObj[0].stepInstruction +
				'	</div>' +
				'</div>';
		} else if (i == stepsObj.length - 1) {
			returnStr +=
				'<div class="mui-row border-b" style="padding: 5px 15px 3px">' +
				'	<div class="mui-col-xs-2 align-center">' +
				'		<span class="mui-icon iconfont icon-express color-warning"></span>' +
				'	</div>' +
				'	<div class="mui-col-xs-10 padding-10-l">' +
				infoObj[0].stepInstruction +
				'	</div>' +
				'</div>';
		} else {
			returnStr +=
				'<div class="mui-row" style="padding: 5px 15px 3px">' +
				'	<div class="mui-col-xs-2 align-center">' +
				'		<span class="mui-icon iconfont icon-nextStation" style="color: #777777;"></span>' +
				'	</div>' +
				'	<div class="mui-col-xs-10 padding-10-l">' +
				infoObj[0].stepInstruction +
				'	</div>' +
				'</div>';
		}
	}
	return returnStr;
}

/**
 * 秒数变换小时分钟
 * 
 * @param {String} secondStr 秒数
 */
function dealSecondTime(secondStr) {
	var returnStr = '';
	var minTime;
	if (parseFloat(secondStr) % 60 == 0) {
		minTime = parseInt(parseFloat(secondStr) / 60);
	} else {
		minTime = parseInt(parseFloat(secondStr) / 60) + 1;
	}
	if (minTime >= 60) {
		var hourTime = parseInt(minTime / 60);
		if (minTime % 60 == 0) {
			returnStr = hourTime + '小时';
		} else {
			returnStr = hourTime + '小时' + parseInt(minTime - hourTime * 60) + '分钟';
		}
	} else {
		returnStr = minTime + '分钟';
	}
	return returnStr;
}

function clearActive() {
	var activeObj = mui('.search-block')[0].getElementsByTagName('span');
	for (var i = 0; i < activeObj.length; i++) {
		activeObj[i].style.color = '#777777';
	}
}