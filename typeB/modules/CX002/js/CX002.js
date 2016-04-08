var initFromLine = '';
var initFromStation = '';
var initToLine = '';
var initToStation = '';
var fLine = document.getElementById('fromLine');
var fStation = document.getElementById('fromStation');
var fStationSelect = document.getElementById('fromStationSelect');
var tLine = document.getElementById('toLine');
var tStation = document.getElementById('toStation');
var tStationSelect = document.getElementById('toStationSelect');
var resultContent = mui('.resultInfo')[0];
var selectIcon = '<span class="mui-icon iconfont icon-moreSelect" style="font-size: 14px;"></span>';

/**
 * CX002 画面初始化
 */
function initializeCX002() {
	initFromLine = '01';
	initFromStation = '0111';
	initToLine = '02';
	initToStation = '0234';
	//起点线路变换
	document.getElementById('fromLineSelect').addEventListener('change', function() {
		//起点地铁线变更
		initFromLine = this.value;
		fLine.innerHTML = this.options[this.selectedIndex].text + selectIcon;
		fStationSelect.innerHTML = getStationOption(initFromLine);
		//起点地铁站点初始化,延迟200
		setTimeout(function() {
			fStation.innerHTML = fStationSelect.options[fStationSelect.selectedIndex].text + selectIcon;
			initFromStation = fStationSelect.value;
		}, 200);
	});
	//起点站点变换
	document.getElementById('fromStationSelect').addEventListener('change', function() {
		initFromStation = this.value;
		fStation.innerHTML = this.options[this.selectedIndex].text + selectIcon;
	});
	//终点线路变换
	document.getElementById('toLineSelect').addEventListener('change', function() {
		//终点地铁线变更
		initToLine = this.value;
		tLine.innerHTML = this.options[this.selectedIndex].text + selectIcon;
		tStationSelect.innerHTML = getStationOption(initToLine);
		//终点地铁站点初始化,延迟200
		setTimeout(function() {
			tStation.innerHTML = tStationSelect.options[tStationSelect.selectedIndex].text + selectIcon;
			initToStation = tStationSelect.value;
		}, 200);
	});
	//终点站点变换
	document.getElementById('toStationSelect').addEventListener('change', function() {
		initToStation = this.value;
		tStation.innerHTML = this.options[this.selectedIndex].text + selectIcon;
	});
	//查询按钮点击事件
	document.getElementById('searchButton').addEventListener('tap', function() {
		resultContent.innerHTML = '';
		resultContent.style.border = '';
		getResultList();
	});
}

function getResultList() {
	addDisabled();
	mui.ajax(serverAddr + 'travel/metro/shanghai', {
		data: {
			o: initFromStation,
			d: initToStation,
			t: 0
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(requestData) {
			if (requestData.data.length == 0) {
				mui.toast('参数错误');
				cancelDisabled();
			} else {
				var contentStr = '';
				var lineName = '';
				var baseInfo = '';
				contentStr +=
					'<p class="font-s16" style="margin-bottom: 3px;">查询结果</p>' +
					'<div class="result-block">' +
					'	<ul class="mui-table-view">';
				for (var i = 0; i < requestData.data.length; i++) {
					lineName = dealLineStr(requestData.data[i].interchangeLine);
					baseInfo = dealBaseInfo(requestData.data[i].passedStationAmount, requestData.data[i].passedDuration, requestData.data[i].price);
					contentStr +=
						'	<li class="mui-table-view-cell mui-collapse">' +
						'		<a class="mui-navigate-right" href="#">' +
						'			<label class="font-s16">' +
						'线路 ' + requestData.data[i].no + '：' +
						'			</label>' +
						'			<label class="font-s18 padding-10-l">' +
						lineName +
						'			</label>' +
						'			<p class="font-s16">' +
						baseInfo +
						'			</p>' +
						'		</a>' +
						'		<div class="mui-collapse-content">' +
						'			<ul class="list list-timeline">' +
						'				<li>' +
						'					<i class="mui-icon iconfont icon-nextStation list-timeline-icon"></i>' +
						'					<div class="list-timeline-content">' +
						'						<p class="font-s18">' +
						requestData.data[i].originStationName +
						'						</p>' +
						'						<p class="font-s14 color-success">' +
						'乘坐 ' + lineName.split(' - ')[0] +
						'						</p>' +
						'					</div>' +
						'				</li>' +
						dealPassedStation(requestData.data[i].passedStationName, requestData.data[i].interchangeStationName, requestData.data[i].passedDuration, lineName) +
						'				<li>' +
						'					<i class="mui-icon iconfont icon-nextStation list-timeline-icon"></i>' +
						'					<div class="list-timeline-content">' +
						'						<p class="font-s18">' +
						requestData.data[i].destinationStationName +
						'						</p>' +
						'					</div>' +
						'				</li>' +
						'			</ul>' +
						'		</div>' +
						'	</li>';
				}
				contentStr +=
					'	</ul>' +
					'</div>';
				resultContent.innerHTML = contentStr;
				resultContent.style.border = '#DDDDDD solid 1px';
				cancelDisabled();
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理
			console.log(type);
			mui.alert('远程服务器连接失败', '无法获得地铁换乘信息', '重试', function() {
				getResultList();
			});
		}
	});
}

/**
 * 处理换乘线路的显示
 * 
 * @param String lineNumStr 换乘线路
 */
function dealLineStr(lineNumStr) {
	var lineNum = lineNumStr.split('-');
	var lineStr = '';
	for (var i = 0; i < lineNum.length; i++) {
		lineStr += ' ' + lineNum[i] + '号线 -';
	}
	lineStr = lineStr.substring(0, lineStr.length - 1);
	return lineStr;
}

/**
 * 处理地铁换乘基本信息
 * 
 * @param String amountStr 途经站点总数
 * @param String timeStr 途经站点时间
 * @param String priceStr 票价
 */
function dealBaseInfo(amountStr, timeStr, priceStr) {
	timeStr = timeStr.substring(timeStr.lastIndexOf('-') + 1, timeStr.length);
	var timeContent = dealSecondTime(timeStr);
	var baseStr = '途经 ' + amountStr + ' 站 | 约 ' + timeContent + ' | 票价 ' + priceStr + ' 元';
	return baseStr;
}

/**
 * 处理途经站点显示
 * 
 * @param String passStationStr 线路站点
 * @param String changeStationStr 换乘站点
 * @param String passDurationStr 站点时间
 * @param String lineNameStr 线路名称
 */
function dealPassedStation(passStationStr, changeStationStr, passDurationStr, lineNameStr) {
	var innerHtmlStr = '';
	var currentIndex = 0;
	var passStataionArr = passStationStr.split('-');
	var passDurationArr = passDurationStr.split('-');
	var changeStationArr = changeStationStr.split('-');
	for (var i = 1; i < passStataionArr.length - 1; i++) {
		var changeStationStart = '';
		if (currentIndex < changeStationArr.length) {
			changeStationStart = changeStationArr[currentIndex].substring(0, changeStationArr[currentIndex].indexOf('('));
		} else {
			changeStationStart = '';
		}
		if (passStataionArr[i] == changeStationStart) {
			var workTime = dealSecondTime(parseFloat(passDurationArr[i + 1]) - parseFloat(passDurationArr[i]));
			innerHtmlStr +=
				'<li>' +
				'	<i class = "mui-icon iconfont icon-nextStation list-timeline-icon color-warning"></i>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s18">' +
				changeStationArr[currentIndex] +
				'		</p>' +
				'		<p class="font-s14">' +
				'步行 ' + workTime +
				'			<label class="font-s14 padding-10-l color-success">换乘 ' +
				lineNameStr.split(' - ')[currentIndex + 1] +
				'			</label>' +
				'		</p>' +
				'	</div>' +
				'</li>';
			i += 1;
			currentIndex += 1;
		} else {
			innerHtmlStr +=
				'<li>' +
				'	<div class="list-timeline-content">' +
				'		<p class="font-s16">' +
				passStataionArr[i] +
				'		</p>' +
				'	</div>' +
				'</li>';
		}
	}
	return innerHtmlStr;
}

/**
 * 秒数变换小时分钟
 * 
 * @param String secondStr 秒数
 */
function dealSecondTime(secondStr) {
	var returnStr = '';
	var minTime;
	if (parseFloat(secondStr) % 60 == 0) {
		minTime = parseInt(parseFloat(secondStr) / 60);
	} else {
		minTime = parseInt(parseFloat(secondStr) / 60) + 1;
	}
	if (minTime >= 60) {
		var hourTime = parseInt(minTime / 60);
		if (minTime % 60 == 0) {
			returnStr = hourTime + '小时';
		} else {
			returnStr = hourTime + '小时' + parseInt(minTime - hourTime * 60) + '分钟';
		}
	} else {
		returnStr = minTime + '分钟';
	}
	return returnStr;
}

/**
 * 禁用用户可操作控件
 */
function addDisabled() {
	document.getElementById('searchButton').disabled = true;
	fLine.style.color = '#8f8f94';
	fStation.style.color = '#8f8f94';
	tLine.style.color = '#8f8f94';
	tStation.style.color = '#8f8f94';
	var hiddenElement = mui('.hidden-select');
	for (var i = 0; i < hiddenElement.length; i++) {
		hiddenElement[i].disabled = true;
	}
}

/**
 * 解除禁用用户可操作控件
 */
function cancelDisabled() {
	document.getElementById('searchButton').disabled = false;
	fLine.style.color = 'black';
	fStation.style.color = 'black';
	tLine.style.color = 'black';
	tStation.style.color = 'black';
	var hiddenElement = mui('.hidden-select');
	for (var i = 0; i < hiddenElement.length; i++) {
		hiddenElement[i].disabled = false;
	}
}

/**
 * 获取站点选项
 * 
 * @param String lineCode 线路编号
 */
function getStationOption(lineCode) {
	var selectOption = '';
	if (lineCode == '01') {
		selectOption += '<option value="0111" selected="selected">莘庄</option>';
		selectOption += '<option value="0112">外环路</option>';
		selectOption += '<option value="0113">莲花路</option>';
		selectOption += '<option value="0114">锦江乐园</option>';
		selectOption += '<option value="0115">上海南站</option>';
		selectOption += '<option value="0116">漕宝路</option>';
		selectOption += '<option value="0117">上海体育馆</option>';
		selectOption += '<option value="0118">徐家汇</option>';
		selectOption += '<option value="0119">衡山路</option>';
		selectOption += '<option value="0120">常熟路</option>';
		selectOption += '<option value="0121">陕西南路</option>';
		selectOption += '<option value="0122">黄陂南路</option>';
		selectOption += '<option value="0123">人民广场</option>';
		selectOption += '<option value="0124">新闸路</option>';
		selectOption += '<option value="0125">汉中路</option>';
		selectOption += '<option value="0126">上海火车站</option>';
		selectOption += '<option value="0127">中山北路</option>';
		selectOption += '<option value="0128">延长路</option>';
		selectOption += '<option value="0129">上海马戏城</option>';
		selectOption += '<option value="0130">汶水路</option>';
		selectOption += '<option value="0131">彭浦新村</option>';
		selectOption += '<option value="0132">共康路</option>';
		selectOption += '<option value="0133">通河新村</option>';
		selectOption += '<option value="0134">呼兰路</option>';
		selectOption += '<option value="0135">共富新村</option>';
		selectOption += '<option value="0136">宝安公路</option>';
		selectOption += '<option value="0137">友谊西路</option>';
		selectOption += '<option value="0138">富锦路</option>';
	} else if (lineCode == '02') {
		selectOption += '<option value="0234" selected="selected">徐泾东</option>';
		selectOption += '<option value="0235">虹桥火车站</option>';
		selectOption += '<option value="0236">虹桥2号航站楼</option>';
		selectOption += '<option value="0237">淞虹路</option>';
		selectOption += '<option value="0238">北新泾</option>';
		selectOption += '<option value="0239">威宁路</option>';
		selectOption += '<option value="0240">娄山关路</option>';
		selectOption += '<option value="0241">中山公园</option>';
		selectOption += '<option value="0242">江苏路</option>';
		selectOption += '<option value="0243">静安寺</option>';
		selectOption += '<option value="0244">南京西路</option>';
		selectOption += '<option value="0245">人民广场</option>';
		selectOption += '<option value="0246">南京东路</option>';
		selectOption += '<option value="0247">陆家嘴</option>';
		selectOption += '<option value="0248">东昌路</option>';
		selectOption += '<option value="0249">世纪大道</option>';
		selectOption += '<option value="0250">上海科技馆</option>';
		selectOption += '<option value="0251">世纪公园</option>';
		selectOption += '<option value="0252">龙阳路</option>';
		selectOption += '<option value="0253">张江高科</option>';
		selectOption += '<option value="0254">金科路</option>';
		selectOption += '<option value="0255">广兰路</option>';
		selectOption += '<option value="0256">唐镇</option>';
		selectOption += '<option value="0257">创新中路</option>';
		selectOption += '<option value="0258">华夏东路</option>';
		selectOption += '<option value="0259">川沙</option>';
		selectOption += '<option value="0260">凌空路</option>';
		selectOption += '<option value="0261">远东大道</option>';
		selectOption += '<option value="0262">海天三路</option>';
		selectOption += '<option value="0263">浦东国际机场</option>';
	} else if (lineCode == '03') {
		selectOption += '<option value="0311" selected="selected">上海南站</option>';
		selectOption += '<option value="0312">石龙路</option>';
		selectOption += '<option value="0313">龙漕路</option>';
		selectOption += '<option value="0314">漕溪路</option>';
		selectOption += '<option value="0315">宜山路</option>';
		selectOption += '<option value="0316">虹桥路</option>';
		selectOption += '<option value="0317">延安西路</option>';
		selectOption += '<option value="0318">中山公园</option>';
		selectOption += '<option value="0319">金沙江路</option>';
		selectOption += '<option value="0320">曹杨路</option>';
		selectOption += '<option value="0321">镇坪路</option>';
		selectOption += '<option value="0322">中潭路</option>';
		selectOption += '<option value="0323">上海火车站</option>';
		selectOption += '<option value="0324">宝山路</option>';
		selectOption += '<option value="0325">东宝兴路</option>';
		selectOption += '<option value="0326">虹口足球场</option>';
		selectOption += '<option value="0327">赤峰路</option>';
		selectOption += '<option value="0328">大柏树</option>';
		selectOption += '<option value="0329">江湾镇</option>';
		selectOption += '<option value="0330">殷高西路</option>';
		selectOption += '<option value="0331">长江南路</option>';
		selectOption += '<option value="0332">淞发路</option>';
		selectOption += '<option value="0333">张华浜</option>';
		selectOption += '<option value="0334">淞滨路</option>';
		selectOption += '<option value="0335">水产路</option>';
		selectOption += '<option value="0336">宝杨路</option>';
		selectOption += '<option value="0337">友谊路</option>';
		selectOption += '<option value="0338">铁力路</option>';
		selectOption += '<option value="0339">江杨北路</option>';
	} else if (lineCode == '04') {
		selectOption += '<option value="0401" selected="selected">上海体育馆</option>';
		selectOption += '<option value="0402">宜山路</option>';
		selectOption += '<option value="0403">虹桥路</option>';
		selectOption += '<option value="0404">延安西路</option>';
		selectOption += '<option value="0405">中山公园</option>';
		selectOption += '<option value="0406">金沙江路</option>';
		selectOption += '<option value="0407">曹杨路</option>';
		selectOption += '<option value="0408">镇坪路</option>';
		selectOption += '<option value="0409">中潭路</option>';
		selectOption += '<option value="0410">上海火车站</option>';
		selectOption += '<option value="0411">宝山路</option>';
		selectOption += '<option value="0412">海伦路</option>';
		selectOption += '<option value="0413">临平路</option>';
		selectOption += '<option value="0414">大连路</option>';
		selectOption += '<option value="0415">杨树浦路</option>';
		selectOption += '<option value="0416">浦东大道</option>';
		selectOption += '<option value="0417">世纪大道</option>';
		selectOption += '<option value="0418">浦电路</option>';
		selectOption += '<option value="0419">蓝村路</option>';
		selectOption += '<option value="0420">塘桥</option>';
		selectOption += '<option value="0421">南浦大桥</option>';
		selectOption += '<option value="0422">西藏南路</option>';
		selectOption += '<option value="0423">鲁班路</option>';
		selectOption += '<option value="0424">大木桥路</option>';
		selectOption += '<option value="0425">东安路</option>';
		selectOption += '<option value="0426">上海体育场</option>';
	} else if (lineCode == '05') {
		selectOption += '<option value="0501" selected="selected">莘庄</option>';
		selectOption += '<option value="0502">春申路</option>';
		selectOption += '<option value="0503">银都路</option>';
		selectOption += '<option value="0505">颛桥</option>';
		selectOption += '<option value="0507">北桥</option>';
		selectOption += '<option value="0508">剑川路</option>';
		selectOption += '<option value="0509">东川路</option>';
		selectOption += '<option value="0510">金平路</option>';
		selectOption += '<option value="0511">华宁路</option>';
		selectOption += '<option value="0512">文井路</option>';
		selectOption += '<option value="0513">闵行开发区</option>';
	} else if (lineCode == '06') {
		selectOption += '<option value="0621" selected="selected">东方体育中心</option>';
		selectOption += '<option value="0622">灵岩南路</option>';
		selectOption += '<option value="0623">上南路</option>';
		selectOption += '<option value="0624">华夏西路</option>';
		selectOption += '<option value="0625">高青路</option>';
		selectOption += '<option value="0626">东明路</option>';
		selectOption += '<option value="0627">高科西路</option>';
		selectOption += '<option value="0628">临沂新村</option>';
		selectOption += '<option value="0629">上海儿童医学中心</option>';
		selectOption += '<option value="0630">蓝村路</option>';
		selectOption += '<option value="0631">浦电路</option>';
		selectOption += '<option value="0632">世纪大道</option>';
		selectOption += '<option value="0633">源深体育中心</option>';
		selectOption += '<option value="0634">民生路</option>';
		selectOption += '<option value="0635">北洋泾路</option>';
		selectOption += '<option value="0636">德平路</option>';
		selectOption += '<option value="0637">云山路</option>';
		selectOption += '<option value="0638">金桥路</option>';
		selectOption += '<option value="0639">博兴路</option>';
		selectOption += '<option value="0640">五莲路</option>';
		selectOption += '<option value="0641">巨峰路</option>';
		selectOption += '<option value="0642">东靖路</option>';
		selectOption += '<option value="0643">五洲大道</option>';
		selectOption += '<option value="0644">洲海路</option>';
		selectOption += '<option value="0645">外高桥保税区南</option>';
		selectOption += '<option value="0646">航津路</option>';
		selectOption += '<option value="0647">外高桥保税区北</option>';
		selectOption += '<option value="0648">港城路</option>';
	} else if (lineCode == '07') {
		selectOption += '<option value="0753" selected="selected">花木路</option>';
		selectOption += '<option value="0752">龙阳路</option>';
		selectOption += '<option value="0751">芳华路</option>';
		selectOption += '<option value="0750">锦绣路</option>';
		selectOption += '<option value="0749">杨高南路</option>';
		selectOption += '<option value="0748">高科西路</option>';
		selectOption += '<option value="0747">云台路</option>';
		selectOption += '<option value="0746">耀华路</option>';
		selectOption += '<option value="0745">长清路</option>';
		selectOption += '<option value="0744">后滩</option>';
		selectOption += '<option value="0743">龙华中路</option>';
		selectOption += '<option value="0742">东安路</option>';
		selectOption += '<option value="0741">肇嘉浜路</option>';
		selectOption += '<option value="0740">常熟路</option>';
		selectOption += '<option value="0739">静安寺</option>';
		selectOption += '<option value="0738">昌平路</option>';
		selectOption += '<option value="0737">长寿路</option>';
		selectOption += '<option value="0736">镇坪路</option>';
		selectOption += '<option value="0735">岚皋路</option>';
		selectOption += '<option value="0734">新村路</option>';
		selectOption += '<option value="0733">大华三路</option>';
		selectOption += '<option value="0732">行知路</option>';
		selectOption += '<option value="0731">大场镇</option>';
		selectOption += '<option value="0730">场中路</option>';
		selectOption += '<option value="0729">上大路</option>';
		selectOption += '<option value="0728">南陈路</option>';
		selectOption += '<option value="0727">上海大学</option>';
		selectOption += '<option value="0726">祁华路</option>';
		selectOption += '<option value="0725">顾村公园</option>';
		selectOption += '<option value="0724">刘行</option>';
		selectOption += '<option value="0723">潘广路</option>';
		selectOption += '<option value="0722">罗南新村</option>';
		selectOption += '<option value="0721">美兰湖</option>';
	} else if (lineCode == '08') {
		selectOption += '<option value="0820" selected="selected">沈杜公路</option>';
		selectOption += '<option value="0821">联航路</option>';
		selectOption += '<option value="0822">江月路</option>';
		selectOption += '<option value="0823">浦江镇</option>';
		selectOption += '<option value="0824">芦恒路</option>';
		selectOption += '<option value="0825">凌兆新村</option>';
		selectOption += '<option value="0826">东方体育中心</option>';
		selectOption += '<option value="0827">杨思</option>';
		selectOption += '<option value="0828">成山路</option>';
		selectOption += '<option value="0829">耀华路</option>';
		selectOption += '<option value="0830">中华艺术宫</option>';
		selectOption += '<option value="0831">西藏南路</option>';
		selectOption += '<option value="0832">陆家浜路</option>';
		selectOption += '<option value="0833">老西门</option>';
		selectOption += '<option value="0834">大世界</option>';
		selectOption += '<option value="0835">人民广场</option>';
		selectOption += '<option value="0836">曲阜路</option>';
		selectOption += '<option value="0837">中兴路</option>';
		selectOption += '<option value="0838">西藏北路</option>';
		selectOption += '<option value="0839">虹口足球场</option>';
		selectOption += '<option value="0840">曲阳路</option>';
		selectOption += '<option value="0841">四平路</option>';
		selectOption += '<option value="0842">鞍山新村</option>';
		selectOption += '<option value="0843">江浦路</option>';
		selectOption += '<option value="0844">黄兴路</option>';
		selectOption += '<option value="0845">延吉中路</option>';
		selectOption += '<option value="0846">黄兴公园</option>';
		selectOption += '<option value="0847">翔殷路</option>';
		selectOption += '<option value="0848">嫩江路</option>';
		selectOption += '<option value="0849">市光路</option>';
	} else if (lineCode == '09') {
		selectOption += '<option value="0943" selected="selected">杨高中路</option>';
		selectOption += '<option value="0942">世纪大道</option>';
		selectOption += '<option value="0941">商城路</option>';
		selectOption += '<option value="0940">小南门</option>';
		selectOption += '<option value="0939">陆家浜路</option>';
		selectOption += '<option value="0938">马当路</option>';
		selectOption += '<option value="0937">打浦桥</option>';
		selectOption += '<option value="0936">嘉善路</option>';
		selectOption += '<option value="0935">肇嘉浜路</option>';
		selectOption += '<option value="0934">徐家汇</option>';
		selectOption += '<option value="0933">宜山路</option>';
		selectOption += '<option value="0932">桂林路</option>';
		selectOption += '<option value="0931">漕河泾开发区</option>';
		selectOption += '<option value="0930">合川路</option>';
		selectOption += '<option value="0929">星中路</option>';
		selectOption += '<option value="0928">七宝</option>';
		selectOption += '<option value="0927">中春路</option>';
		selectOption += '<option value="0926">九亭</option>';
		selectOption += '<option value="0925">泗泾</option>';
		selectOption += '<option value="0924">佘山</option>';
		selectOption += '<option value="0923">洞泾</option>';
		selectOption += '<option value="0922">松江大学城</option>';
		selectOption += '<option value="0921">松江新城</option>';
		selectOption += '<option value="0920">松江体育中心</option>';
		selectOption += '<option value="0919">醉白池</option>';
		selectOption += '<option value="0918">松江南站</option>';
	} else if (lineCode == '10') {
		selectOption += '<option value="1068" selected="selected">新江湾城站</option>';
		selectOption += '<option value="1067">殷高东路站</option>';
		selectOption += '<option value="1066">三门路站</option>';
		selectOption += '<option value="1065">江湾体育场站</option>';
		selectOption += '<option value="1064">五角场站</option>';
		selectOption += '<option value="1063">国权路站</option>';
		selectOption += '<option value="1062">同济大学站</option>';
		selectOption += '<option value="1061">四平路站</option>';
		selectOption += '<option value="1060">邮电新村站</option>';
		selectOption += '<option value="1059">海伦路站</option>';
		selectOption += '<option value="1058">四川北路站</option>';
		selectOption += '<option value="1057">天潼路站</option>';
		selectOption += '<option value="1056">南京东路站</option>';
		selectOption += '<option value="1055">豫园站</option>';
		selectOption += '<option value="1054">老西门站</option>';
		selectOption += '<option value="1053">新天地站</option>';
		selectOption += '<option value="1052">陕西南路站</option>';
		selectOption += '<option value="1051">上海图书馆站</option>';
		selectOption += '<option value="1050">交通大学站</option>';
		selectOption += '<option value="1049">虹桥路站</option>';
		selectOption += '<option value="1048">宋园路站</option>';
		selectOption += '<option value="1047">伊犁路站</option>';
		selectOption += '<option value="1046">水城路站</option>';
		selectOption += '<option value="1045">龙溪路</option>';
		selectOption += '<option value="1044">上海动物园站</option>';
		selectOption += '<option value="1043">虹桥1号航站楼站</option>';
		selectOption += '<option value="1042">虹桥2号航站楼站</option>';
		selectOption += '<option value="1041">虹桥火车站</option>';
		selectOption += '<option value="1020">龙柏新村站</option>';
		selectOption += '<option value="1019">紫藤路站</option>';
		selectOption += '<option value="1018">航中路站</option>';
	} else if (lineCode == '11') {
		selectOption += '<option value="1162" selected="selected">康新公路</option>';
		selectOption += '<option value="1161">秀沿路</option>';
		selectOption += '<option value="1160">罗山路</option>';
		selectOption += '<option value="1159">御桥</option>';
		selectOption += '<option value="1158">浦三路</option>';
		selectOption += '<option value="1157">三林东</option>';
		selectOption += '<option value="1156">三林</option>';
		selectOption += '<option value="1155">东方体育中心</option>';
		selectOption += '<option value="1154">龙耀路</option>';
		selectOption += '<option value="1153">云锦路</option>';
		selectOption += '<option value="1152">龙华</option>';
		selectOption += '<option value="1151">上海游泳馆</option>';
		selectOption += '<option value="1150">徐家汇</option>';
		selectOption += '<option value="1149">交通大学</option>';
		selectOption += '<option value="1148">江苏路</option>';
		selectOption += '<option value="1147">隆德路</option>';
		selectOption += '<option value="1146">曹杨路</option>';
		selectOption += '<option value="1145">枫桥路</option>';
		selectOption += '<option value="1144">真如</option>';
		selectOption += '<option value="1143">上海西站</option>';
		selectOption += '<option value="1142">李子园</option>';
		selectOption += '<option value="1141">祁连山路</option>';
		selectOption += '<option value="1140">武威路</option>';
		selectOption += '<option value="1139">桃浦新村</option>';
		selectOption += '<option value="1138">南翔</option>';
		selectOption += '<option value="1137">马陆</option>';
		selectOption += '<option value="1135">嘉定新城</option>';
		selectOption += '<option value="1134">白银路</option>';
		selectOption += '<option value="1133">嘉定西</option>';
		selectOption += '<option value="1132">嘉定北</option>';
		selectOption += '<option value="1120">上海赛车场</option>';
		selectOption += '<option value="1119">昌吉东路</option>';
		selectOption += '<option value="1118">上海汽车城</option>';
		selectOption += '<option value="1117">安亭</option>';
		selectOption += '<option value="1116">兆丰路</option>';
		selectOption += '<option value="1115">光明路</option>';
		selectOption += '<option value="1114">花桥</option>';
	} else if (lineCode == '12') {
		selectOption += '<option value="1251" selected="selected">金海路</option>';
		selectOption += '<option value="1250">申江路</option>';
		selectOption += '<option value="1249">金京路</option>';
		selectOption += '<option value="1248">杨高北路</option>';
		selectOption += '<option value="1247">巨峰路</option>';
		selectOption += '<option value="1246">东陆路</option>';
		selectOption += '<option value="1245">复兴岛</option>';
		selectOption += '<option value="1244">爱国路</option>';
		selectOption += '<option value="1243">隆昌路</option>';
		selectOption += '<option value="1242">宁国路</option>';
		selectOption += '<option value="1241">江浦公园</option>';
		selectOption += '<option value="1240">大连路</option>';
		selectOption += '<option value="1239">提篮桥</option>';
		selectOption += '<option value="1238">国际客运中心</option>';
		selectOption += '<option value="1237">天潼路</option>';
		selectOption += '<option value="1236">曲阜路</option>';
		selectOption += '<option value="1235">汉中路</option>';
		selectOption += '<option value="1234">南京西路</option>';
		selectOption += '<option value="1233">陕西南路</option>';
		selectOption += '<option value="1232">嘉善路</option>';
		selectOption += '<option value="1231">大木桥路</option>';
		selectOption += '<option value="1230">龙华中路</option>';
		selectOption += '<option value="1229">龙华</option>';
		selectOption += '<option value="1228">龙漕路</option>';
		selectOption += '<option value="1227">漕宝路</option>';
		selectOption += '<option value="1226">桂林公园</option>';
		selectOption += '<option value="1225">虹漕路</option>';
		selectOption += '<option value="1224">虹梅路</option>';
		selectOption += '<option value="1223">东兰路</option>';
		selectOption += '<option value="1222">顾戴路</option>';
		selectOption += '<option value="1221">虹莘路</option>';
		selectOption += '<option value="1220">七莘路</option>';
	} else if (lineCode == '13') {
		selectOption += '<option value="1321" selected="selected">金运路</option>';
		selectOption += '<option value="1322">金沙江西路</option>';
		selectOption += '<option value="1323">丰庄</option>';
		selectOption += '<option value="1324">祁连山南路</option>';
		selectOption += '<option value="1325">真北路</option>';
		selectOption += '<option value="1326">大渡河路</option>';
		selectOption += '<option value="1327">金沙江路</option>';
		selectOption += '<option value="1328">隆德路</option>';
		selectOption += '<option value="1329">武宁路</option>';
		selectOption += '<option value="1330">长寿路</option>';
		selectOption += '<option value="1331">江宁路</option>';
		selectOption += '<option value="1332">汉中路</option>';
		selectOption += '<option value="1333">自然博物馆</option>';
		selectOption += '<option value="1334">南京西路</option>';
		selectOption += '<option value="1335">淮海中路</option>';
		selectOption += '<option value="1336">新天地</option>';
		selectOption += '<option value="1337">马当路</option>';
		selectOption += '<option value="1338">世博会博物馆</option>';
		selectOption += '<option value="1339">世博大道</option>';
	} else if (lineCode == '16') {
		selectOption += '<option value="1633" selected="selected">滴水湖</option>';
		selectOption += '<option value="1632">临港大道</option>';
		selectOption += '<option value="1631">书院</option>';
		selectOption += '<option value="1630">惠南东</option>';
		selectOption += '<option value="1629">惠南</option>';
		selectOption += '<option value="1628">野生动物园</option>';
		selectOption += '<option value="1627">新场</option>';
		selectOption += '<option value="1626">航头东</option>';
		selectOption += '<option value="1625">鹤沙航城</option>';
		selectOption += '<option value="1624">周浦东</option>';
		selectOption += '<option value="1623">罗山路</option>';
		selectOption += '<option value="1622">华夏中路站</option>';
		selectOption += '<option value="1621">龙阳路站</option>';
	}
	return selectOption;
}