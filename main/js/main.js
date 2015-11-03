function initScreen() {
	document.getElementById('moreBtn').addEventListener('tap', function() {
		app.alert("more");
		//打开关于页面
		mui.openWindow({
			url: '../more/more.html',
			id: 'info'
		});
	});
}