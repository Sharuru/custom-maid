var myPoint = '';
var pageNumber = 0;
var resultContent = mui('.mui-content')[0];

function initializeSH005() {
	plus.geolocation.getCurrentPosition(function(p) {
		setTimeout(function() {
			myPoint = p.coords.latitude + ',' + p.coords.longitude;
			getList(myPoint, pageNumber);
		}, 1000);
	}, function(e) {
		mui.alert("Geolocation error: " + e.message);
	}, {
		provider: 'baidu'
	});
}

function getList(pointStr, pageNum) {
	mui.ajax(serverAddr + 'life/place', {
		data: {
			query: '影院',
			location: pointStr,
			radius: 2000,
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
					mui.toast('查询不到周边影院信息');
				} else {
					initList(requestData.results, requestData.total);
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得影院信息', '重试', function() {
				getList(pointStr, pageNum);
			});
		}
	});
}

function initList(resultData, totalNum) {
	showList(resultData, totalNum);

	mui('.list-layer').on('tap', '#turnReview', function() {
		resultContent.innerHTML = '';
		pageNumber = pageNumber - 1;
		getList(myPoint, pageNumber);
	});

	mui('.list-layer').on('tap', '#turnNext', function() {
		resultContent.innerHTML = '';
		pageNumber = pageNumber + 1;
		getList(myPoint, pageNumber);
	});

	mui('.list-layer').on('tap', '.row-module', function() {
		var infoStr = this.getAttribute('name');
		var indexNum = this.getAttribute('id').replace('list', '');
		var nameStr = mui('.place-name')[indexNum].innerHTML;
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
					placeName: nameStr
				},
				waiting: {
					autoShow: false
				}
			});
		}, 200);
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
			'		<p class="font-s14 remove-margin-b">' + resultData[i].address + '</p>' +
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