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
			Package.chcekboxBind();
		},
		load: function () {
			//if u're using '$http' will be able to get the data, I don't know why
			$.ajax({
				url: Main.url("create"),
				success: function (res) {
					var datas = res.getElementById("inventories").innerHTML;
					var re = /(AuctionCreate.*?[^)]+);/g;
					eval(re.exec(datas)[1].replace("AuctionCreate","Model"));
					
					$scope.$apply(function () {
						$scope.items = Model.items;
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
		}
	}
})