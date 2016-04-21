function getCityId() {
	mui('.city-background').on('tap', '.city-module', function() {
		console.log(this.innerHTML);
		var backPage = plus.webview.getWebviewById('PAGE_HJ002');
		mui.fire(backPage, 'setCityName', {
			loc: this.innerHTML
		});
		mui.back();
	});
}