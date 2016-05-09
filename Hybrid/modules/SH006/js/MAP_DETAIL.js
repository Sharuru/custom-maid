var nameObj = '';
var addObj = '';
var myLocationObj = [];
var locationObj = [];
var startP = null;
var endP = null;
var driving = null;
var walking = null;

function initMap() {
	mui.toast('正在载入中...');
	var self = plus.webview.currentWebview();
	nameObj = self.placeName;
	addObj = self.placeAdd;
	myLocationObj = self.myPointStr.split(',');
	locationObj = self.pointStr.split(',');
	initInfo(setMapHeight)
}

function initInfo(callback) {
	document.getElementById('infoDiv').style.padding = '5px 0 3px';
	var contentStr = '';
	contentStr +=
		'<div class="mui-row border-b padding-10-l" style="padding-bottom: 3px;">' +
		'	<label class="font-s18">' + nameObj + '</label>' +
		'	<p class="font-s16 remove-margin-b">' + addObj + '</p>' +
		'</div>' +
		'<div class="mui-row padding-5-t padding-10-l">' +
		'	<p class="font-s16 remove-margin-b" id="drivingData">驾车:' +
		'		<label style="padding-left: 5px;">正在计算...</label>' +
		'	</p>' +
		'	<p class="font-s16 remove-margin-b" id="walkingData">步行:' +
		'		<label style="padding-left: 5px;">正在计算...</label>' +
		'	</p>' +
		'</div>';
	document.getElementById('infoDiv').innerHTML = contentStr;
	callback(initLocation);
}

function setMapHeight(callback) {
	var heightPar = document.body.clientHeight - 49 - document.getElementById('infoDiv').offsetHeight;
	document.getElementById('mapDiv').style.height = heightPar + 'px';
	callback();
}

function initLocation() {
	var mapObj = new BMap.Map('mapDiv');
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_LEFT,
		offset: new BMap.Size(3, 30)
	};
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	startP = new BMap.Point(myLocationObj[1], myLocationObj[0]);
	endP = new BMap.Point(locationObj[1], locationObj[0]);
	mapObj.centerAndZoom(startP, 12);
	walking = new BMap.WalkingRoute(mapObj, {
		renderOptions: {
			map: mapObj,
			autoViewport: true
		},
		onSearchComplete: searchWalkingComplete
	});
	driving = new BMap.DrivingRoute(mapObj, {
		renderOptions: {
			map: mapObj,
			autoViewport: true
		},
		onSearchComplete: searchDrivingComplete
	});
	driving.search(startP, endP);
	walking.search(startP, endP);
}

var searchDrivingComplete = function(results) {
	if (driving.getStatus() != BMAP_STATUS_SUCCESS) {
		mui.toast('Failed:' + driving.getStatus());
		document.getElementById('drivingData').innerHTML = '驾车:<label style="padding-left: 5px;">计算出错</label>';
		return;
	}
	var plan = results.getPlan(0);
	document.getElementById('drivingData').innerHTML = '驾车:' + getInner(plan);
}

var searchWalkingComplete = function(results) {
	if (walking.getStatus() != BMAP_STATUS_SUCCESS) {
		mui.toast('Failed:' + walking.getStatus());
		document.getElementById('walkingData').innerHTML = '步行:<label style="padding-left: 5px;">计算出错</label>';
		return;
	}
	var plan = results.getPlan(0);
	document.getElementById('walkingData').innerHTML = '步行:' + getInner(plan);
}

function getInner(dataObj) {
	var returnStr = '';
	returnStr +=
		'<label style="padding-left: 5px;">' + dataObj.getDuration(true) + '</label>' +
		'<label style="padding-left: 5px;">' + dataObj.getDistance(true) + '</label>';
	return returnStr;
}