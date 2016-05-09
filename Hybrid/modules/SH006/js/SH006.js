var myPoint = '';
var searchKeyObj = '';
var rangeObj = '';
var pageNumber = 0;
var resultContent = mui('.mui-content')[0];

function initializeSH006() {
	mui.toast('正在获取数据...');
	var self = plus.webview.currentWebview();
	searchKeyObj = self.searchKey;
	rangeObj = self.dataObj;
	var geolocationObj = new BMap.Geolocation();
	geolocationObj.getCurrentPosition(function(r) {
		if (this.getStatus() == BMAP_STATUS_SUCCESS) {
			setTimeout(function() {
				myPoint = r.point.lat + ',' + r.point.lng;
				getList(myPoint, pageNumber, searchKeyObj, rangeObj);
			}, 1000);
		} else {
			mui.toast('获取当前位置失败');
		}
	}, {
		enableHighAccuracy: true
	});
}

function getList(pointStr, pageNum, keyObj, rangeData) {
	mui.ajax(serverAddr + 'life/place', {
		data: {
			query: keyObj,
			location: pointStr,
			radius: rangeData,
			pageNum: pageNum
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			console.log(JSON.stringify(requestData));
			if (requestData.status != 0) {
				mui.toast('发生未知错误');
			} else {
				if (requestData.results.length == 0) {
					mui.toast('查询不到周边兴趣点信息');
				} else {
					initList(requestData.results, requestData.total);
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得影院信息', '重试', function() {
				getList(pointStr, keyObj, pageNum, rangeData);
			});
		}
	});
}

function initList(resultData, totalNum) {
	showList(resultData, totalNum);

	mui('.list-layer').on('tap', '#turnReview', function() {
		resultContent.innerHTML = '';
		pageNumber = pageNumber - 1;
		getList(myPoint, pageNumber, searchKeyObj, rangeObj);
	});

	mui('.list-layer').on('tap', '#turnNext', function() {
		resultContent.innerHTML = '';
		pageNumber = pageNumber + 1;
		getList(myPoint, pageNumber, searchKeyObj, rangeObj);
	});

	mui('.list-layer').on('tap', '.row-module', function() {
		if (this.getAttribute('id') != null) {
			var infoStr = this.getAttribute('name');
			var indexNum = this.getAttribute('id').replace('list', '');
			var nameStr = mui('.place-name')[indexNum].innerHTML;
			var addStr = mui('.place-address')[indexNum].innerHTML;
			setTimeout(function() {
				mui.openWindow({
					url: 'MAP_DETAIL.html',
					id: 'PAGE_MAP_DETAIL',
					show: {
						aniShow: 'pop-in',
						duration: 200
					},
					extras: {
						pointStr: infoStr,
						myPointStr: myPoint,
						placeName: nameStr,
						placeAdd: addStr
					},
					waiting: {
						autoShow: false
					}
				});
			}, 200);
		}
	})
}

function showList(resultData, totalNum) {
	var pageTotal;
	if (totalNum % 10 != 0) {
		pageTotal = parseInt(totalNum / 10) + 1;
	} else {
		pageTotal = parseInt(totalNum / 10);
	}
	var contentStr = '';
	contentStr += '<div class="list-layer">';
	for (var i = 0; i < resultData.length; i++) {
		var nameStr = resultData[i].location.lat + ',' + resultData[i].location.lng;
		contentStr +=
			'<div class="row-module" name="' + nameStr + '" id="list' + i + '">' +
			'	<div class="mui-row">' +
			'		<p class="place-name remove-margin-b">' + resultData[i].name + '</p>' +
			'	</div>' +
			'	<div class="mui-row">' +
			'		<p class="place-address">' + resultData[i].address + '</p>' +
			'	</div>';
		if (resultData[i].telephone != null) {
			contentStr +=
				'<div class="mui-row">' +
				'	<p class="font-s14 remove-margin-b">' + resultData[i].telephone + '</p>' +
				'</div>';
		}
		contentStr += '</div>';
	}
	if (totalNum > 10) {
		if (pageNumber == 0) {
			contentStr +=
				'<div class="row-module">' +
				'	<div class="mui-row align-right padding-10-r turn-page" id="turnNext">' +
				'		下一页 <span class="mui-icon iconfont icon-toDetail" style="font-size: 12px;"></span>' +
				'	</div>' +
				'</div>';
		} else if (pageNumber == totalNum) {
			contentStr +=
				'<div class="row-module">' +
				'	<div class="mui-row turn-page" id="turnReview">' +
				'		<span class="mui-icon iconfont icon-turnReview" style="font-size: 12px;"></span> 上一页' +
				'	</div>' +
				'</div>';
		} else {
			contentStr +=
				'<div class="row-module">' +
				'	<div class="mui-row turn-page">' +
				'		<div class="mui-col-xs-6" id="turnReview">' +
				'			<span class="mui-icon iconfont icon-turnReview" style="font-size: 12px;"></span> 上一页' +
				'		</div>' +
				'		<div class="mui-col-xs-6 align-right padding-10-r" id="turnNext">' +
				'			下一页 <span class="mui-icon iconfont icon-toDetail" style="font-size: 12px;"></span>' +
				'		</div>' +
				'	</div>' +
				'</div>';
		}
	}
	contentStr += '</div>';
	resultContent.innerHTML += contentStr;
}