$(function () {
	if(localStorage.cookie.length>0){
		window.document.cookie = localStorage.cookie;
		return;
	}

	var win = window.open("https://www.battlenet.com.cn/login/zh/");
	var interval = setInterval(function () {
		if(win.location.href.indexOf("https://www.battlenet.com.cn/account/management/") == 0){
			localStorage.cookie = win.document.cookie;
			window.document.cookie = win.document.cookie;
			clearInterval(interval);
			win.close();
		}
	},500);
	
})