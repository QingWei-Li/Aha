var Main = {};
mainApp.controller("mainController", function ($scope) {
	var moneyTemplate = '<div class="ngCellText colt{{$index}}">'+
							'<span class="icon-gold">{{row.getProperty(col.field).gold || 0}}</span>'+
							'<span class="icon-silver">{{row.getProperty(col.field).silver || 0}}</span>'+
							'<span class="icon-copper">{{row.getProperty(col.field).copper || 0}}</span>'+
						'</div>';
	var cellTemplate = function (str) {
		return  "<div class='ngCellText text-center' ng-class='col.colIndex()'><span ng-cell-text>"+str+"</span></div>";
	}
	var nameTemplate = "<div class='ngCellText' ng-class='col.colIndex()'><span ng-cell-text><a class='item-q item-q{{row.getProperty(col.field).q}}' data-id='{{row.getProperty(col.field).id}}'>{{row.getProperty(col.field).title}}</a></span></div>";
	var editableCellTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" />';
	var similarEditableCellTemplate = '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD.amount" ng-model="COL_FIELD.amount" />';
	$scope.gridPackage = {
		data: 'package',
        i18n: 'zh-cn',
		showFilter: true,
        enableColumnResize:true,
        showSelectionCheckbox:true,
		selectedItems: Model.selectedItems,
		columnDefs: 
			[{
				field: "name", 
				displayName: "名称", 
				width: "**", 
				cellTemplate: nameTemplate
			},{
				field: "quality", 
				displayName: "数量", 
				width:'auto'
			},{
				field: "similar", 
				displayName: "市场最低价(个)", 
				width: "**", 
				cellTemplate: moneyTemplate
				},{field: "buyout", 
				displayName: "设置一口价(个)", 
				width: "**",
				enableCellEdit: true, 
				cellTemplate: moneyTemplate, 
				editableCellTemplate: similarEditableCellTemplate
			},{
				field: "type", 
				displayName: "方式(0:个,1:组)", 
				width: "110", 
				enableCellEdit: true, 
				cellTemplate: cellTemplate('{{row.getProperty(col.field) || 0}}'), editableCellTemplate: '<input type="number" ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" min="0" max="1"/>'
			},{
				field: "quantity", 
				displayName: "堆叠数量", 
				enableCellEdit: true, 
				cellTemplate: cellTemplate('{{row.getProperty(col.field) || 1}}'), 
				editableCellTemplate: editableCellTemplate
			},{
				field: "stacks", 
				displayName: "堆叠组数", 
				enableCellEdit: true, 
				cellTemplate: cellTemplate('{{row.getProperty(col.field) || 1}}'), 
				editableCellTemplate: editableCellTemplate
			}]
	};

	$scope.gridExpired = {
		data: 'expired',
        i18n: 'zh-cn',
        showFilter: true,
        enableColumnResize:true,
        showSelectionCheckbox:true,
		selectedItems: Model.selectedItems,
		columnDefs: [
				{field: "name", displayName: "名称", width: "**", cellTemplate: nameTemplate},
				{field: "quantity", displayName: "数量"},
				{field: "similar", displayName: "市场最低价", width: "**", cellTemplate: moneyTemplate},
				{field: "buyout", displayName: "设置一口价", width: "**", cellTemplate: moneyTemplate, editableCellTemplate: similarEditableCellTemplate, enableCellEdit: true},
				{field: "status", displayName: "状态"},
				{field: "time", displayName: "剩余时间(天)", width: "100"}
			]
	};

	$scope.$on('ngGridEventEndCellEdit', function (evt) {
	        var item = evt.targetScope.row.entity;
	        if(item.buyout && item.buyout.amount)
	       		item.buyout = Main.formatMoney(item.buyout.amount);
	    });

	Main = {
		title: function (title) {
			$scope.$apply(function () {
				$scope.title = title;
			})
		},
		init: function () {
			Main.load();
			setTimeout(function () {
				if(Model.config.homePage === "package"){
					$scope.title = "背包列表";
				}else if(Model.config.homePage === "expired"){
					$scope.title = "结束的拍卖";
				}else if(Model.config.homePage === "sold"){
					$scope.title = "售出的拍卖";
				}
				Package.init();
				Expired.init();
				Sold.init();

				Tooltip.factory('.tab-pane a[data-id]', {
					onShow: function (event) {
						var self = $(event.target),
							id = self.data('id');
						Tooltip.show(event.target, '/item/' + id + '/tooltip', true);
					}
				});
			}, 500);
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
			if(index >= Model.package.length || $('#refresh').attr('data-stop') === 'true') {
				$("#refresh").text("刷新");
				$("#refresh").attr('data-run',false);
				$("#refresh").removeAttr('data-stop');
				return Main.status();
			};
			id = id || Model.package[index].name.id;

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
					var html = re.exec(res) || [0,0,0,0];
					html.shift();
					if(html[0].indexOf && html[0].indexOf(',')>-0) html[0] = html[0].replace(",","");
					for (var i = 0; i < html.length; i++) {
						if(html[i].length<2){
							html[i] = "0" + html[i];
						}
					};
					var similar = {
						gold: parseInt(html[0]) || 0,
						silver: parseInt(html[1]) || 0,
						copper: parseInt(html[2]) || 0,
						amount: parseInt(html.join('')) || 0 
					};
					Model.package[index].similar = similar;
					Model.package[index].buyout = Main.initPrice(similar.amount);
					Main.bind();

					setTimeout(function () {
						Main.similar(null, index+1, false);
					}, 500);
				},
				beforeSend: function () {
					Main.status("价格查询中("+(index+1)+"/"+Model.package.length+")...");
				}
			});
		},
		initPrice: function (amount) {
			var spread = Model.config.spread || 0;
			amount = amount - spread;
			amount = amount>0?amount:0;
			return Main.formatMoney(amount);
		},
		bind: function () {
			$scope.$apply(function () {
				$scope.money = Model.money;
				$scope.character = Model.character;
				$scope.package = Model.package;
				$scope.expired = Model.expired;
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
			var item = Model.selectedItems[index];
			
			Main.deposit(item, function () {
				$.ajax({
					url: Main.url('createAuction'),
					data: {
						itemId: item.name.id,
						quantity: item.quantity || 1,
						sourceType: 0,
						duration: Model.config.duration,
						stacks: item.stacks || 1,
						buyout: item.buyout.amount,
						bid: item.buyout.amount,
						type: item.type>0?'perstack':'perItem',
						ticket: item.ticket,
						xstoken: localStorage.xstoken
					},
					dataType: 'json',
					type: 'POST',
					success: function (data) {
						Main.status("出售中("+(index+1)+"/"+Model.selectedItems.length+")...");
					}
				});
			});

			setTimeout(function () {
				Main.sell(index+1);
			}, 500);
		},
		deposit: function (item, callback) {
			$.ajax({
				url: Main.url('deposit'),
				data: {
					item: item.name.id,
					duration: Model.config.duration,
					quan: item.quantity,
					stacks: item.stacks,
					sk: localStorage.xstoken
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
						return;
					} 

					item.ticket = data.ticket;
					callback();
				}
			});
		}
	}

})