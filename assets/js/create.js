var AuctionCreate = {
	/**
    * Cache of all the items in the inventory.
    */
    items: {},
	init: function () {
		AuctionCreate.loadData();
		Tooltip.factory('#create a[data-id]', {
			onShow: function (event) {
				var self = $(event.target),
					id = self.data('id');
				Core.baseUrl = 'https://www.battlenet.com.cn/wow/zh';
				Tooltip.show(event.target, '/item/' + id + '/tooltip', true);
			}
		});
	},
	url: function (url) {
		return "https://www.battlenet.com.cn/wow/zh/vault/character/auction/"+url;
	},
	loadData: function () {
		$.ajax({
			url: AuctionCreate.url("create"),
			success: function (res) {
				var datas = res.getElementById("inventories").innerHTML;
				var re = /(AuctionCreate.*?[^)]+);/g;
				eval(re.exec(datas)[1]);
				$("a[href='#auctions'] span").text(res.getElementById('total-auctions').innerText);
				AuctionCreate.update();
			}
		})
	},
	update: function () {
		var html = '';
		var items = AuctionCreate.items;
		for(item in items){
			html += "<tr>";
			html += "<td><input type='checkbox' name='item' data-id="+items[item].id+"/></td>";
			html += "<td><a data-id="+items[item].id+">"+items[item].name+"</a></td>";
			html += "<td>"+AuctionCreate.items[item].q0+"</td>";
			html += "</tr>";
		}
		$("#create tbody").html(html);
	}
}