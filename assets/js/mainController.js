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
        enableCellEditOnFocus: true,
		showFilter: true,
		columnDefs: [
			{field: "name", displayName: "名称", width: "**", cellTemplate: "<a class='item-q item-q{{row.getProperty(col.field).q}}' data-id='{{row.getProperty(col.field).id}}'>{{row.getProperty(col.field).title}}</a>"},
			{field: "quality", displayName: "数量", width:'auto'},
			{field: "similar", displayName: "市场最低价(个)", width: "**", cellTemplate: moneyTemplate},
			{field: "buyout", displayName: "一口价(个)", width: "**", enableCellEdit: true, cellTemplate: moneyTemplate},
			{field: "type", displayName: "方式"},
			{field: "quantity", displayName: "堆叠数量"},
			{field: "stacks", displayName: "堆叠组数"}
		]
	};
	Main = {
		init: function () {
			Main.load();
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
		similar: function (id) {
			$.ajax({
				url: Main.url('similar'),
				dataType: 'html',
				cache: false,
				data: {
					sort: 'unitBuyout',
					itemId: id
				},
				success: function (res) {
					var html = res.getElementsByClassName('price')[0];
					html = html.getElementsByTagName('span');
					/*return {
						gold: html[0] || 0,
						silver: html[1] || 0,
						copper: html[2] || 0
					};*/
					return html.join('');
				}
			});
		},
		toPinYin: function () {
			for (var i = 0; i < Model.items.length; i++) {
				Model.items[i].pinyin = PinYin.to(Model.items[i].name);
			};
		},
		bind: function () {
			$scope.$apply(function () {
				$scope.money = Model.money;
				$scope.character = Model.character;
				$scope.gridData = Model.gridData;
			})
		}
	}

})