var Package = {};
mainApp.controller("packageController", function ($scope) {
	Package = {
		init: function () {
			Package.load();
			Tooltip.factory('#create a[data-id]', {
				onShow: function (event) {
					var self = $(event.target),
						id = self.data('id');
					Tooltip.show(event.target, '/item/' + id + '/tooltip', true);
				}
			});
			//Package.chcekboxBind();
		},
		load: function () {
			//if u're using '$http' will be able to get the data, I don't know why
			$.ajax({
				url: Main.url("create"),
				success: function (res) {
					var datas = res.getElementById("inventories").innerHTML;
					var re = /(AuctionCreate.items*?[^)]+);/g;
					eval(re.exec(datas)[0]
						.replace("AuctionCreate","Model")
						.replace(/=.*{/g,"=[")
						.replace(/}(.*)$/g,"]$1")
						.replace(/('[^:]+:.*){/g,"{")
						);
					Package.toPinYin();
					Model.bind();
					$scope.$apply(function () {
						$scope.items = Model.gridData;
					})
				}
			})
		},
		chcekboxBind: function () {
			$("#cbAll").change(function () {
				if(this.checked)
					$("input[name='item']").each(function () {
						this.checked = true;
					});
				else
					$("input[name='item']").each(function () {
						this.checked = false;
					});
			});
		},
		toPinYin: function () {
			for (var i = 0; i < Model.items.length; i++) {
				Model.items[i].pinyin = PinYin.to(Model.items[i].name);
			};
		},
		updateDeposit: function () {
			update = update !== false;
			$.ajax({
				url: 'deposit',
				data: {
					item: AuctionCreate.item.id,
					duration: $('#form-duration').val(),
					quan: AuctionCreate.isNumeric($('#form-quantity').val()),
					stacks: AuctionCreate.isNumeric($('#form-stacks').val()),
					sk: Cookie.read('xstoken')
				},
				dataType: 'json',
				type: 'POST',
				success: function(data, status) {
					if (data.error) {
						AuctionCreate.showError(data.error.message);
						return;
					}

					var deposit = Auction.formatMoney(data.deposit.deposit); // Deposit

					$('#deposit .icon-copper').html(deposit.copper.toString());
					$('#deposit .icon-silver').html(deposit.silver.toString());
					$('#deposit .icon-gold').html(deposit.gold.toString());

					if (update) {
						AuctionCreate.resetPerType();

						if (AuctionCreate.created[AuctionCreate.item.id]) {
							// Do nothing, use cached values
						} else {
							var setStarting = false;

							if (data.deposit.suggestedPrice > AuctionCreate.getStarting())
								setStarting = true;
							else if ((AuctionCreate.lastItem && AuctionCreate.item.id != AuctionCreate.lastItem.id))
								setStarting = true;

							if (setStarting)
								AuctionCreate.setStarting(data.deposit.suggestedPrice);
						}
					}

					if (Auction.money < data.deposit.deposit) {
						AuctionCreate.disable('#button-create');
						AuctionCreate.showError(AuctionCreate.errors.deposit);
					} else {
						AuctionCreate.ticket = data.ticket;
					}
				}
			});
		}
	}
})