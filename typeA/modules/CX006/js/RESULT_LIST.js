//缓存 obj select
var resultContent = document.getElementById('resultContent');
var stationPopover = document.getElementById('stationPopoverView');
var selectedStation = '清空筛选';

/**
 * 初始化结果列表 
 */
function initializeRESULT_LIST() {
	//设置标题
	var self = plus.webview.currentWebview();
	document.getElementById('titleText').innerText = self.from + ' - ' + self.to;
	//取消滚动条
	self.setStyle({
		scrollIndicator: "none"
	});
	//设置内容
	setContent(0, self, '清空筛选');
	//设置筛选
	setSelector(self);
	//事件绑定
	document.getElementById('sortByTime').addEventListener('tap', function() {
		if (this.innerText.substr(-1) == '▲') {
			this.innerText = '按发车时间排序 ▼';
			this.value = '1';
			setContent(this.value, self, selectedStation);
			setSelector(self);
		} else {
			this.innerText = '按发车时间排序 ▲';
			this.value = '0';
			setContent(this.value, self, selectedStation);
		}
	});
	mui('#stationPopoverView').on('tap', '.mui-table-view-cell', function() {
		console.log(this.innerText)
		selectedStation = this.innerText;
		setContent(document.getElementById('sortByTime').value, self, selectedStation);
		mui('.mui-popover').popover('toggle');
	})
}

/**
 * 根据排序种类生成内容
 * 
 * @param String sortType 排序类型，0为按发车时间升序，1为降序
 * @param Webview self webview obj
 * @param String keyWord 出发城市关键字
 */
function setContent(sortType, self, keyWord) {
	//清除旧内容
	resultContent.innerHTML = '';
	var headContent = '';
	var tailContent = '';
	for (currIndex in self.data.result.list) {
		if (sortType == 0) {
			headContent = resultContent.innerHTML;
		}
		if (sortType == 1) {
			tailContent = resultContent.innerHTML;
		}
		if (keyWord == '清空筛选' || keyWord == self.data.result.list[currIndex].start) {
			resultContent.innerHTML = headContent +
				'<div class="result">' +
				'	<table border="0" width="100%">' +
				'		<tr>' +
				'			<td class="time-td" colspan="2">' +
				self.data.result.list[currIndex].date +
				'			</td>' +
				'			<td rowspan="3" width="25%" class="price-td">' +
				'				<span class="money-mark">￥</span>' + self.data.result.list[currIndex].price.replace('元', '') +
				'			</td>' +
				'		</tr>' +
				'		<tr>' +
				'			<td class="circle-td">' +
				' 				<div class="start-circle"><span class="circle-text">始</span></div>' +
				'			</td>' +
				'			<td>' +
				self.data.result.list[currIndex].start +
				'			</td>' +
				'		</tr>' +
				'		<tr>' +
				'			<td class="circle-td">' +
				' 				<div class="arrive-circle"><span class="circle-text">终</span></div>' +
				'			</td>' +
				'			<td class="arrive-text">' +
				self.data.result.list[currIndex].arrive +
				'			</td>' +
				'		</tr>' +
				'	</table>' +
				'</div>' +
				tailContent;
		}
	}
}

//TODO 已知BUG：popover 值过多时无法滚动
/**
 * 设置筛选 popover
 * 
 * @param Webview self webview obj
 */
function setSelector(self) {
	var station = []
	for (currIndex in self.data.result.list) {
		if (stationPopover.innerHTML.indexOf(self.data.result.list[currIndex].start) == -1) {
			stationPopover.innerHTML +=
				'<li class="mui-table-view-cell">' + self.data.result.list[currIndex].start + '</li>';
		}
	}
}