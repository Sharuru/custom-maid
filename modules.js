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
	mui("#moduleBody").on('tap', '.module-block', function() {
		var moduleId = this.getAttribute("id").substr(5);
		mui.openWindow({
			url: 'modules/' + moduleId + '/' + moduleId + '.html',
			id: 'Page-' + moduleId,
//			url: 'modules/SH001/SH001.html',
//			id: 'Page-SH001',
//			styles: {
//				top: '49px'
//			}
			waiting:{
				//取消加载动画，模拟原生感
				autoShow:false
			}
		});
	});
	console.log("Setting modules finished.");
}

//添加功能模块
function setModuleBlock(moduleId) {
	var localStorage = window.localStorage;
	var moduleSize = document.body.clientWidth / 4;
	var contentStr = "";
	contentStr += '<div class="module-block" id="Block' + moduleId + '" style="width:' + moduleSize + 'px;height:' + moduleSize + 'px;">';
	contentStr += '		<div style="text-align: center;height:60%;padding-top: 20%;">';
	contentStr += '			<img src="res/images/icons/modules/' + moduleId + '.png" width=40%></img>';
	contentStr += '		</div>';
	contentStr += '		<div style="text-align: center;height:40%;font-size: 12px;color:black;">' + localStorage.getItem(moduleId) + '</div>';
	contentStr += '</div>'
	document.getElementById('moduleBody').innerHTML += contentStr;
}