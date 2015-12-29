function initializeRESULT_LIST() {
	//设置标题
	var self = plus.webview.currentWebview();
	self.setStyle({scrollIndicator:"none"});
//	document.getElementById('titleText').innerText = self.from + ' - ' + self.to;
	//	for (currIndex in self.data.result.list) {
	//		console.log(self.data.result.list[currIndex].start);
	//		console.log(self.data.result.list[currIndex].arrive);
	//		console.log(self.data.result.list[currIndex].date);
	//		console.log(self.data.result.list[currIndex].price);
	//		console.log('******************');
	//	}
	for (currIndex in self.data.result.list) {
		document.getElementById('test').innerHTML += '<div>' +
			'<table border="1" width="100%">' +
			'<tr>' +
			'<td>' + self.data.result.list[currIndex].date + '</td>' +
			'<td rowspan="3">' + self.data.result.list[currIndex].price + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>' + self.data.result.list[currIndex].start + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>' + self.data.result.list[currIndex].arrive + '</td>' +
			'</tr>' +
			'</table>' +
			'</div>';
	}
}

function setScreen(data) {

}