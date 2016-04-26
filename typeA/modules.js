var contentStr = '';
var SHContentStr = '';
var CXContentStr = '';
var GJContentStr = '';
var HJContentStr = '';
var SPContentStr = '';
var JSContentStr = '';

//设置功能列表
function setModuleBody() {
	console.log("Setting module list...");
	//获取可用模块列表
	var localStorage = window.localStorage;
	var avalModuleList = localStorage.getItem("modules").split(",");
	for (var i = 0; i < avalModuleList.length; i++) {
		if (avalModuleList[i].indexOf('SH') == 0) {
			SHContentStr += setModuleBlock(avalModuleList[i]);
		}
		if (avalModuleList[i].indexOf('CX') == 0) {
			CXContentStr += setModuleBlock(avalModuleList[i]);
		}
		if (avalModuleList[i].indexOf('GJ') == 0) {
			GJContentStr += setModuleBlock(avalModuleList[i]);
		}
		if (avalModuleList[i].indexOf('HJ') == 0) {
			HJContentStr += setModuleBlock(avalModuleList[i]);
		}
		if (avalModuleList[i].indexOf('JS') == 0) {
			JSContentStr += setModuleBlock(avalModuleList[i]);
		}
		if (avalModuleList[i].indexOf('SP') == 0) {
			SPContentStr += setModuleBlock(avalModuleList[i]);
		}
	}
	setModule(SHContentStr, CXContentStr, GJContentStr, HJContentStr, JSContentStr, SPContentStr);
	//绑定模块点击事件
	mui("body").on('tap', '.module-item', function() {
		var moduleId = this.getAttribute("id").substr(5);
		mui.openWindow({
			url: 'playground.html',
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
	var itemStr = '';
	itemStr += '<a class="module-item" href="#" id="Block' + moduleId + '">';
	itemStr += '<div class="module-icon">';
	itemStr += '<img src="res/images/icons/modules/' + moduleId + '.png" width=50%>';
	itemStr += '</img></div>';
	itemStr += '<div class="module-name">' + localStorage.getItem(moduleId);
	itemStr += '</div></a>';
	return itemStr;
}

//整合模块html语句
function setModule(SHModule, CXModule, GJModule, HJModule, JSModule, SPModule) {
	//	console.log(SHModule != '');
	if (SHModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">日常生活</div>';
		contentStr += '<div class="module-layer">' + SHModule;
		contentStr += '</div></div></div>';
	}
	if (CXModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">外出旅行</div>';
		contentStr += '<div class="module-layer">' + CXModule;
		contentStr += '</div></div></div>';
	}
	if (GJModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">随身工具</div>';
		contentStr += '<div class="module-layer">' + GJModule;
		contentStr += '</div></div></div>';
	}
	if (HJModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">周边环境</div>';
		contentStr += '<div class="module-layer">' + HJModule;
		contentStr += '</div></div></div>';
	}
	if (JSModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">驾驶助手</div>';
		contentStr += '<div class="module-layer">' + JSModule;
		contentStr += '</div></div></div>';
	}
	if (SPModule != '') {
		contentStr += '<div class="mui-row"><div class="mui-col-xs-12 bg-aliceblue">';
		contentStr += '<div class="module-title">其他</div>';
		contentStr += '<div class="module-layer">' + SPModule;
		contentStr += '</div></div></div>';
	}
	document.getElementById('moduleContent').innerHTML += contentStr;
}