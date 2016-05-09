var curPointObj;
var mapObj;
var cityStr = '';

function initializeCX005() {
	mui.toast('正在载入中...');
	var heightPar = document.body.clientHeight - 49;
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
		setTimeout(function() {
			mui.openWindow({
				url: 'SEARCH_ROUTE.html',
				id: 'PAGE_SEARCH_ROUTE',
				show: {
					aniShow: 'pop-in',
					duration: 200
				},
				extras: {
					startPoint: curPointObj,
					cityInfo: cityStr
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
	});

	//传值事件绑定
	window.addEventListener('getPoint', function(event) {
		var nameInfo = event.detail.nameStr;
		var contentStr = '';
		contentStr +=
			'<div class="address-block">' +
			'	<label class="font-s16">' + nameInfo + '</label>' +
			'	<a id="toSearchRoute">' +
			'		<span class="mui-icon iconfont icon-goSign" style="float: right;font-size: 16px;padding-top: 2px;">' +
			'			<label style="font-size: 14px;">到这去</label>' +
			'		</span>' +
			'	</a>' +
			'</div>';
		document.getElementById('addressInfo').innerHTML = contentStr;
		//重设地图高度
		var heightPar = document.body.clientHeight - 49 - document.getElementById('addressInfo').offsetHeight;
		document.getElementById('mapLBS').style.height = heightPar + 'px';
		var resultPoint = new BMap.Point(event.detail.pointLng, event.detail.pointLat);
		mapObj.addOverlay(new BMap.Marker(resultPoint));
		mapObj.centerAndZoom(resultPoint, 15);

		mui('.address-block').on('tap', '#toSearchRoute', function() {
			setTimeout(function() {
				mui.openWindow({
					url: 'SEARCH_ROUTE.html',
					id: 'PAGE_SEARCH_ROUTE',
					show: {
						aniShow: 'pop-in',
						duration: 200
					},
					extras: {
						startPoint: curPointObj,
						endPoint: resultPoint,
						cityInfo: cityStr,
						nameStr: nameInfo
					},
					waiting: {
						autoShow: false
					}
				});
			}, 200);
		});
	});
}

function getLocation(callback) {
	var geolocationObj = new BMap.Geolocation();
	geolocationObj.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			var curPointLat = r.point.lat;
			var curPointLng = r.point.lng;
			curPointObj = new BMap.Point(curPointLng, curPointLat);
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