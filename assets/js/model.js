Model = {
	/**
	 * The current money total.
	 */
	money: {},

	/**
	 * Character information.
	 */
	character: {},
	/**
    * Cache of all the items in the inventory.
    */
    items: [],
    /**
    * display in the grid
    */
    package:[],
    expired:[],
    sold:[],
    selectedExpired:[],
    selectedPackage:[],
    config: {
        spread: 1,
        homePage: "package",
        updateSimilar: false,
        duration: 2 //0:12h,1:24h,2:48h
    },
    store: function () {
        Model.package = [];
        for(x in Model.items){
            Model.package.push({
                name: {
                    title: Model.items[x].name,
                    id: Model.items[x].id,
                    q: Model.items[x].quality
                },
                quality: Model.items[x].q0,
                pinyin: PinYin.to(Model.items[x].name),
                type: 0
            });
        }
    },
    init:function () {
    	if(localStorage.package)
    		Model.package = JSON.parse(localStorage.package);
    	if(localStorage.character)
    		Model.character = JSON.parse(localStorage.character);
    	if(localStorage.money)
    		Model.money = JSON.parse(localStorage.money);
    },
    save:function () {
    	localStorage.package = JSON.stringify(Model.package);
    	localStorage.character = JSON.stringify(Model.character);
    	localStorage.money = JSON.stringify(Model.money);
    }
}