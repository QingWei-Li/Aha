var Main = {};
mainApp.controller("mainController", function ($scope) {
	$scope.grid = {
		data: 'gridData',
        enableColumnResize:true,
        showSelectionCheckbox:true,
		showFilter: true,
		columnDefs: [
			{field: "name", displayName: "名称", width: "**", cellTemplate: "<div>{{row.entity[col.field]}}</div>"},
			{field: "q0", displayName: "数量", width:'auto'},
			{displayName: "最低价(个)"},
			{displayName: "一口价(个)"},
			{displayName: "方式"},
			{displayName: "堆叠数量"},
			{displayName: "堆叠组数"}
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
		bind: function () {
			$scope.$apply(function () {
				$scope.money = Model.money;
				$scope.character = Model.character;
				$scope.gridData = Model.gridData;
			})
		}
	}

})