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
    gridData:[],
    config: {
        spread: 1,
        homePage: "package",
        updateSimilar: true
    },
    store: function () {
        Model.gridData = [];
        for(x in Model.items){
            Model.gridData.push({
                name: {
                    title: Model.items[x].name,
                    id: Model.items[x].id,
                    q: Model.items[x].quality
                },
                quality: Model.items[x].q0,
                pinyin: PinYin.to(Model.items[x].name)
            });
        }
    },
    init:function () {
    	if(localStorage.gridData)
    		Model.gridData = JSON.parse(localStorage.gridData);
    	if(localStorage.character)
    		Model.character = JSON.parse(localStorage.character);
    	if(localStorage.money)
    		Model.money = JSON.parse(localStorage.money);
    },
    save:function () {
    	localStorage.gridData = JSON.stringify(Model.gridData);
    	localStorage.character = JSON.stringify(Model.character);
    	localStorage.money = JSON.stringify(Model.money);
    }
}