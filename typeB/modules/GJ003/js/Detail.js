function initDetail() {
	//	mui('.stock-list')[0].innerHTML = '';
	var self = plus.webview.currentWebview();
	document.getElementById('stockName').innerHTML = self.stockName +
		'<label class="font-w300-s18">(' + self.stockNum + ')</label>';
	//	dealList(self);
}

function dealList(objEle) {
	//	console.log(objEle.lotData);
	for (var i = 0; i < objEle.lotData.length; i++) {
		var resultNum = objEle.lotData[i].opencode;
		var redNum = '';
		var blueNum = '';
		if (resultNum.indexOf('+') == -1) {
			redNum = resultNum;
		} else {
			redNum = resultNum.substring(0, resultNum.indexOf('+'));
			blueNum = resultNum.substring(resultNum.indexOf('+') + 1, resultNum.length);
		}
		var dataTime = objEle.lotData[i].opentime;
		dataTime = dataTime.substring(0, dataTime.indexOf(' '));
		//		console.log(dataTime);
		var innerStr = dealDetail(objEle.lotData[i].expect, dataTime, redNum, blueNum);
		mui('.resultInfo')[0].innerHTML += innerStr;
	}
}

function dealDetail(expectStr, dataStr, redStr, blueStr) {
	var contentStr = '';
	contentStr +=
		'<div class="result-block">' +
		'	<div class="lottery-Info">' +
		'		<div class="lottery-name">' +
		'第 ' + expectStr + ' 期' +
		'		</div>' +
		'		<div class="font-w300-s16 padding-20-l float-left" style="padding-top: 2px;">' +
		'开奖时间： ' + dataStr +
		'		</div>' +
		'	</div>' +
		'	<div class="lottery-result">';
	for (var i = 0; i < redStr.split(',').length; i++) {
		contentStr +=
			'	<div class="lottery-circle-r">' +
			'		<span class="circle-text">' +
			redStr.split(',')[i] +
			'		</span>' +
			'	</div>';
	}
	if (blueStr != '') {
		for (var j = 0; j < blueStr.split(',').length; j++) {
			contentStr +=
				'<div class="lottery-circle-b">' +
				'	<span class="circle-text">' +
				blueStr.split(',')[j] +
				'	</span>' +
				'</div>';
		}
	}
	contentStr +=
		'	</div>' +
		'</div>';
	return contentStr;
}