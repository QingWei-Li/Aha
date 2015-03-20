var Main = {};
mainApp.controller("mainController", function ($scope) {
	var moneyTemplate = '<div class="ngCellText colt{{$index}}">'+
							'<span class="icon-gold">{{row.getProperty(col.field).substr(0,row.getProperty(col.field).length-4) || 0}}</span>'+
							'<span class="icon-silver">{{row.getProperty(col.field).substr(row.getProperty(col.field).length-4,2) || 0}}</span>'+
							'<span class="icon-copper">{{row.getProperty(col.field).substr(row.getProperty(col.field).length-2,2) || 0}}</span>'+
						'</div>';
	var cellTemplate = function (str) {
		return  "<div class='ngCellText text-center' ng-class='col.colIndex()'><span ng-cell-text>"+str+"</span></div>";
	}
	var editableCellTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" />';

	$scope.grid = {
		data: 'gridData',
        enableColumnResize:true,
        showSelectionCheckbox:true,
        i18n: 'zh-cn',
		showFilter: true,
		selectedItems: Model.selectedItems,
		columnDefs: [
			{field: "name", displayName: "名称", width: "**", cellTemplate: "<div class='ngCellText' ng-class='col.colIndex()'><span ng-cell-text><a class='item-q item-q{{row.getProperty(col.field).q}}' data-id='{{row.getProperty(col.field).id}}'>{{row.getProperty(col.field).title}}</a></span></div>"},
			{field: "quality", displayName: "数量", width:'auto'},
			{field: "similar", displayName: "市场最低价(个)", width: "**", cellTemplate: moneyTemplate},
			{field: "buyout", displayName: "设置一口价(个)", width: "**", enableCellEdit: true, cellTemplate: moneyTemplate, editableCellTemplate: editableCellTemplate},
			{field: "name.id", displayName: "方式", cellTemplate: cellTemplate('<label><input name="type-{{row.getProperty(col.field)}}" type="radio" value="group"/>组</label>&nbsp;<label><input name="type-{{row.getProperty(col.field)}}" type="radio" value="single" checked="checked"/>个</label>')},
			{field: "quantity", displayName: "堆叠数量", enableCellEdit: true, cellTemplate: cellTemplate('{{row.getProperty(col.field) || 1}}'), editableCellTemplate: editableCellTemplate},
			{field: "stacks", displayName: "堆叠组数", enableCellEdit: true, cellTemplate: cellTemplate('{{row.getProperty(col.field) || 1}}'), editableCellTemplate: editableCellTemplate}
		]
		
	};
	Main = {
		init: function () {
			Main.load();
			if(Model.config.homePage === "package"){
				Package.init();
				$scope.title = "背包列表";
			}else if(Model.config.homePage === "onsell"){
				OnSell.init();
				$scope.title = "在售商品";
			}
		},
		url: function (url) {
			return Core.baseUrl+"vault/character/auction/"+url;
		},
		load: function () {
			$.ajax({
				url: Main.url("money"),
				success: function(data) {
					Model.money = Main.formatMoney(data.money);
					Model.character = data.character;
					Main.bind();
				},
				beforeSend: function () {
					Main.status("用户信息更新中...");
				}
			});
		},
		formatMoney: function(amount) {
			var gold = Math.floor(amount / 10000);
			var silver = Math.floor((amount - (gold * 10000)) / 100);
			var copper = Math.floor((amount - (gold * 10000)) - (silver * 100));

			if (!silver) silver = 0;
			if (!copper) copper = 0;
			if (!gold) 	 gold = 0;

			return {
				gold: gold,
				silver: silver,
				copper: copper,
				amount: amount
			};
		},
		similar: function (id, index, cache) {
			var similar = "";
			if(index >= Model.gridData.length) {
				$("#refresh").removeAttr("disabled");
				return Main.status();
			};
			id = id || Model.gridData[index].name.id;

			$.ajax({
				url: Main.url('similar'),
				dataType: 'html',
				cache: cache,
				data: {
					sort: 'unitBuyout',
					itemId: id
				},
				success: function (res) {
					var re = /gold\D+([\d,]+)\D+(\d+)\D+(\d+)/g;
					var html = re.exec(res) || ["00","00","00","00"];
					
					if(html[1].indexOf(',')>-1) html[1] = html[1].replace(",","");
					for (var i = 1; i < html.length; i++) {
						if(html[i].length<2){
							html[i] = "0" + html[i];
						}
						similar += html[i];
					};
					Model.gridData[index].similar = similar;
					Model.gridData[index].buyout = Main.initPrice(similar);
					Main.bind();
					setTimeout(function () {
						Main.similar(null, index+1, false);
					}, 500);
				},
				beforeSend: function () {
					Main.status("价格查询中("+(index+1)+"/"+Model.gridData.length+")...");
				}
			});
		},
		initPrice: function (similar) {
			//from config
			var spread = Model.config.spread || 0;
			var price = parseInt(similar) - spread;
			price = price<0?0:price;
			return price.toString();
		},
		bind: function () {
			$scope.$apply(function () {
				$scope.money = Model.money;
				$scope.character = Model.character;
				$scope.gridData = Model.gridData;
			})
		},
		status: function (msg) {
			msg = msg || "";
			$scope.$apply(function () {
				$scope.status = msg;
			})
		},
		sell: function (index) {
			if(index >= Model.selectedItems.length) return;
			//todo
			Main.deposit(Model.selectedItems[index]);

			setTimeout(function () {
				Main.sell(index+1);
			}, 500);
		},
		deposit: function (item) {
			$.ajax({
				url: Main.url('deposit'),
				data: {
					item: item.name.id,
					duration: Model.config.duration,
					quan: item.quantity,
					stacks: item.stacks,
					sk: Cookie.read('xstoken')
				},
				dataType: 'json',
				type: 'POST',
				success: function(data, status) {
					if (data.error) {
						//todo 数据获取失败
						return;
					}
					//保证金，以后可能会用到
					//var deposit = Main.formatMoney(data.deposit.deposit); 

					if (Model.money.amount < data.deposit.deposit) {
						//todo 钱不够了
					} else {
						item.ticket = data.ticket;
					}
				}
			});
		}
	}

})