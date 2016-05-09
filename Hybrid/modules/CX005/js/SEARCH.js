var searchFlg = 0;
var resultLat = '';
var resultLng = '';
var addValue = null;
var buttonObj = document.getElementById('searchButton');
var hisList = [];
var localStorage = window.localStorage;

function initAutoSearch() {
	document.getElementById('searchInput').focus();
	mui('.mui-placeholder')[0].style.display = 'none';
	initHis();
	var self = plus.webview.currentWebview();
	var autoObj = new BMap.Autocomplete({
		input: 'searchInput',
		location: self.cityInfo
	});

	autoObj.addEventListener('onconfirm', function(e) {
		addValue = e.item.value;
		var addStr = addValue.province + addValue.city + addValue.district + addValue.street + addValue.business;
		var cityStr = addValue.city;
		setLocation(addStr, cityStr);
	})

	buttonObj.addEventListener('tap', function() {
		var locationName = '';
		buttonObj.disabled = 'disabled';
		if (document.getElementById('searchInput').value == '') {
			mui.toast('请输入检索信息');
			buttonObj.disabled = '';
			return;
		}
		if (searchFlg == 0) {
			locationName = document.getElementById('searchInput').value;
			setLocation(locationName, localStorage.getItem('province'));
		} else {
			locationName = addValue.business;
		}
		hisList.unshift(locationName);
		localStorage.setItem('routeHisSearch', JSON.stringify(hisList));
		buttonObj.disabled = '';
		//传值给CX005
		var backPage = plus.webview.getWebviewById('PAGE_CX005');
		mui.fire(backPage, 'getPoint', {
			nameStr: locationName,
			pointLat: resultLat,
			pointLng: resultLng
		});
		mui.back();
	});
}

function setLocation(valueObj, cityObj) {
	//智能搜索
	var getGeo = new BMap.Geocoder();
	getGeo.getPoint(valueObj, function(pointResult) {
		if (pointResult) {
			resultLat = pointResult.lat;
			resultLng = pointResult.lng;
		} else {
			mui.toast('该地址没有解析结果');
		}
	}, cityObj);
	searchFlg = 1;
}

function initHis() {
	hisList = JSON.parse(localStorage.getItem('routeHisSearch'));
	if (hisList == null) {
		hisList = [];
	}
	var contentStr = '';
	if (hisList.length != 0) {
		for (var i = 0; i < hisList.length; i++) {
			contentStr +=
				'<div class="mui-row his-row" id="hisList' + i + '" name="">' +
				'	<p class="font-s16 remove-margin-b">' +
				'		<span class="mui-icon iconfont icon-search searchIcon"></span>' +
				'		<label class="padding-10-l">' + hisList[i] + '</label>' +
				'	</p>' +
				'</div>';
		}
		contentStr +=
			'<div class="mui-row his-row">' +
			'	<p class="font-s14 remove-margin-b align-center">清除所有历史记录</p>' +
			'</div>';
	}
	mui('.hisInfo')[0].innerHTML = contentStr;

	mui('.hisInfo').on('tap', '.mui-row', function() {
		var actFlg = this.getAttribute('id');
		if (actFlg == null) {
			localStorage.removeItem('routeHisSearch');
			initHis();
		} else {
			var listIndex = actFlg.replace('hisList', '');
			document.getElementById('searchInput').value = hisList[listIndex];
			hisList.splice(listIndex,1);
			initHis();
		}
	});
}