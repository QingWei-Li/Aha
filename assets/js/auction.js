var Auction = {
	/**
	 * The current money total.
	 */
	money: 0,

	/**
	 * Character information.
	 */
	character: null,
	/**
	 * Current chosen auction house.
	 */
	faction: null,
	url: function (url) {
		return "https://www.battlenet.com.cn/wow/zh/vault/character/auction/"+url;
	},
	init: function () {
		Auction.loadData();
	},
	loadData: function() {
		$.ajax({
			url: Auction.url("money"),
			success: function(data) {
				if (typeof data.money === "number") {
					Auction.money = data.money;
				}

				if (data.character) {
					Auction.character = data.character;
				}

				if (data.AH)
					Auction.faction = data.AH.toLowerCase();

				Auction.update();
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
	update: function () {
		var amount = Auction.formatMoney(Auction.money);
		$("#money .icon-gold").text(amount.gold);
		$("#money .icon-silver").text(amount.silver);
		$("#money .icon-copper").text(amount.copper);
		$("#character .name").text(Auction.character.name);
		$("#character .realmName").text(Auction.character.realmName);
	}
}