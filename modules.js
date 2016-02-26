//设置功能列表
function setModuleList() {
	console.log("Setting module list...");
	//获取可用模块列表
	var localStorage = window.localStorage;
	var avalModuleList = localStorage.getItem("modules").split(",");
	for (var i = 0; i < avalModuleList.length; i++) {
		setModuleBlock(avalModuleList[i]);
	}
	//绑定模块点击事件
	mui("body").on('tap', '.module-item', function() {
		var moduleId = this.getAttribute("id").substr(5);
		mui.openWindow({
			url: 'modules/' + moduleId + '/' + moduleId + '.html',
			id: 'PAGE_' + moduleId,
			show: {
				aniShow: "pop-in",
				duration: 200
			},
			waiting: {
				//取消加载动画，模拟原生感
				autoShow: false
			}
		});
	});
	console.log("Setting modules finished.");
}

//添加功能模块
function setModuleBlock(moduleId) {
	var localStorage = window.localStorage;
	var SHContentStr = "";
	var CXContentStr = "";
	var GJContentStr = "";
	var HJContentStr = "";
	var SPContentStr = "";
	var JSContentStr = "";
	if (moduleId.indexOf('SH') == 0) {
		SHContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		SHContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		SHContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('SHModule').innerHTML += SHContentStr;
	}
	if (moduleId.indexOf('CX') == 0) {
		CXContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		CXContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		CXContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('CXModule').innerHTML += CXContentStr;
	}
	if (moduleId.indexOf('GJ') == 0) {
		GJContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		GJContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		GJContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('GJModule').innerHTML += GJContentStr;
	}
	if (moduleId.indexOf('HJ') == 0) {
		HJContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		HJContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		HJContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('HJModule').innerHTML += HJContentStr;
	}
	if (moduleId.indexOf('SP') == 0) {
		SPContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		SPContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		SPContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('SPModule').innerHTML += SPContentStr;
	}
	if (moduleId.indexOf('JS') == 0) {
		JSContentStr += '<a class="module-item" href="#" id="Block' + moduleId + '"><div class="module-icon">';
		JSContentStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%></img></div>';
		JSContentStr += '<div class="module-name">' + localStorage.getItem(moduleId) + '</div></a>';
		document.getElementById('JSModule').innerHTML += JSContentStr;
	}
}