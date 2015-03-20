var Main = {};
mainApp.controller("mainController", function ($scope) {
	var moneyTemplate = '<div class="ngCellText colt{{$index}}">'+
							'<span class="icon-gold">{{row.getProperty(col.field).substr(0,row.getProperty(col.field).length-4) || 0}}</span>'+
							'<span class="icon-silver">{{row.getProperty(col.field).substr(row.getProperty(col.field).length-4,2) || 0}}</span>'+
							'<span class="icon-copper">{{row.getProperty(col.field).substr(row.getProperty(col.field).length-2,2) || 0}}</span>'+
						'</div>';
	$scope.grid = {
		data: 'gridData',
        enableColumnResize:true,
        showSelectionCheckbox:true,
		showFilter: true,
		columnDefs: [
			{field: "name", displayName: "名称", width: "**", cellTemplate: "<a class='item-q item-q{{row.getProperty(col.field).q}}' data-id='{{row.getProperty(col.field).id}}'>{{row.getProperty(col.field).title}}</a>"},
			{field: "quality", displayName: "数量", width:'auto'},
			{field: "similar", displayName: "市场最低价(个)", width: "**", cellTemplate: moneyTemplate},
			{field: "buyout", displayName: "设置一口价(个)", width: "**", enableCellEdit: true, cellTemplate: moneyTemplate},
			{field: "type", displayName: "方式"},
			{field: "quantity", displayName: "堆叠数量"},
			{field: "stacks", displayName: "堆叠组数"}
		]
	};
	Main = {
		init: function () {
			Main.load();
			if(Model.config.homePage === "package"){
				Package.init();
			}else if(Model.config.homePage === "onsell"){
				OnSell.init();
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
				copper: copper
			};
		},
		similar: function (id, index, cache) {
			var similar = "";
			if(index >= Model.gridData.length) {
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
		}
	}

})