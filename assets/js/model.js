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
    bind: function () {
        Model.gridData = [];
        for(x in Model.items){
            Model.gridData.push(Model.items[x]);
        }
    },
    init:function () {
    	if(localStorage.items)
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