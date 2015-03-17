$(function () {
	var interval;
	var gui = require('nw.gui'); 
	var win = gui.Window.open("https://www.battlenet.com.cn/login/zh/");
	win.hide();
	win.on('document-end',function () {
		if(this.window.location.href.indexOf('ref')>-1){
			this.close();	
		}

		interval = setInterval(function () {
			win.show();
			if(win.window.location.href.indexOf("https://www.battlenet.com.cn/account/management/") == 0){
					win.close();
				}
		},500);
	})

	win.on('closed', function() {
		win = null;
		clearInterval(interval);
		$("#signin").attr('hidden','hidden');
		$("#main").removeAttr("hidden");
		Auction.init();
		AuctionCreate.init();
	});

	gui.Window.get().on('close', function() {
	    this.hide();
	    if (win != null)
	    	win.close(true);
	    this.close(true);
	});
})

var Msg = Msg || {};
Msg.ui = {
	loading: "正在加载"
}