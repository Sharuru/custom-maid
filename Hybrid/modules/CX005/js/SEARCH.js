var searchFlg = 0;
var resultLat = '';
var resultLng = '';
var buttonObj = document.getElementById('searchButton');

function initAutoSearch() {
	document.getElementById('searchInput').focus();
	mui('.mui-placeholder')[0].style.display='none';
	var self = plus.webview.currentWebview();
	var autoObj = new BMap.Autocomplete({
		input: 'searchInput',
		location: self.cityInfo
	});

	autoObj.addEventListener('onconfirm', function(e) {
		var addValue = e.item.value;
		var addStr = addValue.province + addValue.city + addValue.district + addValue.street + addValue.business;
		var cityStr = addValue.city;
		setLocation(addStr, cityStr);
	})

	buttonObj.addEventListener('tap', function() {
		buttonObj.disabled = 'disabled';
		if (searchFlg == 0) {
			mui.toast('请输入检索信息');
			buttonObj.disabled = '';
		} else {
			buttonObj.disabled = '';
			//传值给CX005
			var backPage = plus.webview.getWebviewById('PAGE_CX005');
			mui.fire(backPage, 'getPoint', {
				addressStr:document.getElementById('searchInput').value,
				pointLat: resultLat,
				pointLng: resultLng
			});
			mui.back();
		}
	});
}

function setLocation(valueObj, cityObj) {
	//智能搜索
	var getGeo = new BMap.Geocoder();
	getGeo.getPoint(valueObj, function(pointResult) {
		if (pointResult) {
			resultLat = pointResult.lat;
			resultLng = pointResult.lng;
		}
	}, cityObj);
	searchFlg = 1;
}