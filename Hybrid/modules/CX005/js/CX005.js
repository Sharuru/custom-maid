function initializeCX005() {
	mui.toast('正在载入中...');
	var heightPar = document.body.clientHeight - 49;
	mui('.mui-content')[0].innerHTML = '<div style="width: 100%;height: ' + heightPar + 'px;position: fixed" id="mapLBS"></div>';
	var mapObj = new BMap.Map('mapLBS');
	var geolocationObj = new BMap.Geolocation();
	geolocationObj.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			var markerObj = new BMap.Marker(r.point);
			mapObj.addOverlay(markerObj);
			mapObj.centerAndZoom(r.point, 16);
			mapObj.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_BOTTOM_LEFT
			}))
		} else {
			mui.toast('Failed:' + this.getStatus());
		}
	}, {
		enableHighAccuracy: true
	});
}