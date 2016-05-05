var curPointLat = '';
var curPointLng = '';
var curPointObj;
var mapObj;
var cityStr = '';

function initializeCX005() {
	mui.toast('正在载入中...');
	var heightPar = document.body.clientHeight - 49 - document.getElementById('addressInfo').offsetHeight;
	document.getElementById('mapLBS').style.height = heightPar + 'px';
	getLocation(initMapObj);

	mui('.mui-content').on('tap', '.poi-search', function() {
		setTimeout(function() {
			mui.openWindow({
				url: 'SEARCH.html',
				id: 'PAGE_SEARCH',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					cityInfo: cityStr
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});

	mui('.mui-content').on('tap', '.floatIcon', function() {
		alert('2');
	});

	//传值事件绑定
	window.addEventListener('getPoint', function(event) {
		var contentStr = '';
		contentStr +=
			'<div class="address-block">' +
			'	<label class="font-s16"></label>' +
			'	<p class="font-s16 remove-margin-b"></p>' +
			'</div>';
		document.getElementById('addressInfo').innerHTML = contentStr;
		var resultPoint = new BMap.Point(event.detail.pointLng, event.detail.pointLat);
		mapObj.addOverlay(new BMap.Marker(resultPoint));
		mapObj.centerAndZoom(resultPoint, 15);

	});
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
	mapObj = new BMap.Map('mapLBS');
	curPointObj = new BMap.Point(curPointLng, curPointLat);
	var markerObj = new BMap.Marker(curPointObj);
	mapObj.addOverlay(markerObj);
	mapObj.centerAndZoom(curPointObj, 15);
	var scaleOpts = {
		anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
		offset: new BMap.Size(5, 5)
	};
	var navigationOpts = {
		anchor: BMAP_ANCHOR_TOP_LEFT,
		type: BMAP_NAVIGATION_CONTROL_ZOOM,
		offset: new BMap.Size(5, 150)
	}
	mapObj.addControl(new BMap.ScaleControl(scaleOpts));
	mapObj.addControl(new BMap.NavigationControl(navigationOpts));
	//逆地址解析
	var geoObj = new BMap.Geocoder();
	geoObj.getLocation(curPointObj, function(rs) {
		cityStr = rs.addressComponents.city;
	});
}