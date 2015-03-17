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
				AuctionCreate.bind();
			}
		})
	},
	bind: function () {
		var html = '';
		var items = AuctionCreate.items;
		for(item in items){
			html += "<tr>";
			html += "<td><input type='checkbox' name='item' data-id="+items[item].id+"></td>";
			html += "<td><a data-id="+items[item].id+">"+items[item].name+"</a></td>";
			html += "<td>"+AuctionCreate.items[item].q0+"</td>";
			html += "<td>loading...</td>";
			html += "<td><input type='text' /></td>";
			html += "<td><button class='btn btn-sm btn-primary'>整组</button>&nbsp;<button class='btn btn-sm btn-success'>散装</button></td>";
			html += "</tr>";
		}
		$("#create tbody").html(html);
		AuctionCreate.chcekboxBind();
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