$(function () {
	var loginWin;
	var Win = {
		gui: require('nw.gui'),
		init: function () {
			Win.initMenu();
			Win.loginWin();
			Win.mainWin();
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
		loginWin: function () {
			var interval;
			loginWin = Win.gui.Window.open("https://www.battlenet.com.cn/login/zh/",{x:-1000,y:-1000});
			loginWin.hide();
			loginWin.on('document-end',function () {
				var self = this;
				if(self.window.location.href.indexOf('ref')>-1 && localStorage.email && localStorage.password){
					self.window.$('#password').val(localStorage.password);
					self.window.$('#accountName').val(localStorage.email);
					self.window.$('#submit').click();
				}else{
					localStorage.xstoken = null;
					self.setPosition('center');
					self.show();
					self.window.$('form').submit(function (e) {
						localStorage.password = self.window.$('#password').val();
						localStorage.email = self.window.$('#accountName').val();
						return true;
					})
				}

				interval = setInterval(function () {
					if(self.window.location.href.indexOf("https://www.battlenet.com.cn/account/management/") == 0){
						self.hide();
					}
					if(self.window.Cookie.read('xstoken')){
							self.close();
						}
				},500);
			})
			loginWin.on('closed', function() {
				loginWin = null;
				clearInterval(interval);
				Main.init();

			});
			loginWin.on('close', function() {
				localStorage.xstoken = loginWin.window.Cookie.read('xstoken');
				this.close(true);
			});
			
		},
		mainWin: function () {
			var mainWin = Win.gui.Window.get();
			
			//open the debug window
			var devTools = mainWin.showDevTools();
			devTools.moveBy(500,0);

			mainWin.on('close', function() {
			    this.hide();
			    if (loginWin != null)
			    	loginWin.close(true);
				Model.save();
			    this.close(true);
			});
			mainWin.on('loaded', function () {
				Model.init();
				Main.bind();
			})
		}
	}
	
	Win.init();
})