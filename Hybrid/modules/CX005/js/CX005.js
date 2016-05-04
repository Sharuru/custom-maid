var curPointLat = '';
var curPointLng = '';

function initializeCX005() {
	mui.toast('正在载入中...');
	var heightPar = document.body.clientHeight - 49 - mui('.search-block')[0].offsetHeight;
	document.getElementById('mapLBS').style.height = heightPar + 'px';
	getLocation(initMapObj);
}

function getLocation(callback) {
	var geolocationObj = new BMap.Geolocation();
	geolocationObj.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			curPointLat = r.point.lat;
			curPointLng = r.point.lng;
			callback();
		} else {
			mui.toast('Failed:' + this.getStatus());
		}
	}, {
		enableHighAccuracy: true
	});
}

function initMapObj() {
	var mapObj = new BMap.Map('mapLBS');
	var curPointObj = new BMap.Point(curPointLng, curPointLat);
	var markerObj = new BMap.Marker(curPointObj);
	mapObj.addOverlay(markerObj);
	mapObj.centerAndZoom(curPointObj, 15);
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		offset: new BMap.Size(5, 5)
	};
	var navigationOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_LEFT,
		type: BMAP_NAVIGATION_CONTROL_ZOOM,
		offset: new BMap.Size(5, 30)
	}
	var geolocationOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_LEFT,
		offset: new BMap.Size(5, 105)
	}
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	mapObj.addControl(new BMap.NavigationControl(navigationOpts));
	mapObj.addControl(new BMap.GeolocationControl(geolocationOpts));
}