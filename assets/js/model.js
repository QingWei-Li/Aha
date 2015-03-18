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
    items: {},
    init:function () {
    	if(localStorage.items)
    		Model.items = JSON.parse(localStorage.items);
    	if(localStorage.character)
    		Model.character = JSON.parse(localStorage.character);
    	if(localStorage.money)
    		Model.money = JSON.parse(localStorage.money);
    },
    save:function () {
    	localStorage.items = JSON.stringify(Model.items);
    	localStorage.character = JSON.stringify(Model.character);
    	localStorage.money = JSON.stringify(Model.money);
    }
}