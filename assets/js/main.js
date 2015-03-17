$(function () {
	var Win = {
		gui: require('nw.gui'),
		mainWin: function () {
			return Win.gui.Window.get();
		},
		init: function () {
			Win.initMenu();
			Win.signin();
		},
		initMenu: function () {
			var menu = new Win.gui.Menu({type:"menubar"});
			menu.append(new Win.gui.MenuItem({label:"账户"}));
			menu.append(new Win.gui.MenuItem({label:"背包"}));
			menu.append(new Win.gui.MenuItem({label:"在售"}));
			menu.items[1].click = function () {
				$("a[href='#create']").tab('show');
			};
			menu.items[2].click = function () {
				$("a[href='#auctions']").tab('show');
			}
			Win.gui.Window.get().menu = menu;
		},
		signin: function () {
			var interval;
			var win = Win.gui.Window.open("https://www.battlenet.com.cn/login/zh/");
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
			Win.gui.Window.get().on('close', function() {
			    this.hide();
			    if (win != null)
			    	win.close(true);
			    this.close(true);
			});
		}
	}
	
	Win.init();
})

var Msg = Msg || {};
Msg.ui = {
	loading: "正在加载"
}