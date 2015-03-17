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
					Auction.updateMoney(data.money, false);
				}

				if (data.character) {
					Auction.character = data.character;
				}

				if (data.AH)
					Auction.faction = data.AH.toLowerCase();
			}
		});
	},
	updateMoney: function(value, mode) {
		if (mode)
			value = (mode == '+') ? Math.round(Auction.money + value) : Math.round(Auction.money - value);

		if (value < 0)
			value = 0;

		var amount = Auction.formatMoney(value);
		$("#money").text(amount.gold+"金"+amount.silver+"银"+amount.copper+"铜");
		Auction.money = value;
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
	}
}