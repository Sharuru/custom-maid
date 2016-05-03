var em = null,
	map = null;

function initMap() {
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
	// DOMContentloaded事件处理
	document.addEventListener("DOMContentLoaded", function() {
		em = document.getElementById("mapDiv");
		plusReady();
	}, false);
}

function plusReady() {
	mui.toast('正在载入中...');
	if (!em || !window.plus || map) {
		return
	};
	map = new plus.maps.Map("mapDiv");
	var self = plus.webview.currentWebview();
	document.getElementById('placeName').innerHTML = self.placeName;
	var locationStr = self.pointStr;
	var latStr = locationStr.substring(0, locationStr.indexOf(','));
	var lngStr = locationStr.substring(locationStr.indexOf(',') + 1, locationStr.length);

	var myLocationStr = self.myPointStr;
	var myLatStr = myLocationStr.substring(0, myLocationStr.indexOf(','));
	var myLngStr = myLocationStr.substring(myLocationStr.indexOf(',') + 1, myLocationStr.length);
	setTimeout(function() {
		map.setTraffic(true);
		var myPointObj = new plus.maps.Point(myLngStr, myLatStr);
		var myMarker = new plus.maps.Marker(myPointObj);
		myMarker.setIcon('../../res/images/icons/myPosition.png');
		map.addOverlay(myMarker);
		var pointObj = new plus.maps.Point(lngStr, latStr);
		map.centerAndZoom(pointObj, 17);
		map.showZoomControls(true);
		var marker = new plus.maps.Marker(pointObj);
		marker.setIcon('../../res/images/icons/position.png');
		map.addOverlay(marker);
		plus.maps.Map.calculateDistance(myPointObj, pointObj, function(event) {
			var distance = event.distance; // 转换后的距离值
			document.getElementById('distanceInfo').innerHTML = parseFloat(distance).toFixed(2) + '米';
		}, function(e) {
			mui.alert("Failed:" + JSON.stringify(e));
		});
	}, 1000);
}