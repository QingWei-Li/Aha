$(function () {
	var win = window.open("https://www.battlenet.com.cn/login/zh/");

	var interval = setInterval(function () {
		if(win.location.href.indexOf("https://www.battlenet.com.cn/account/management/") == 0){
			console.log(win.document.cookie);
			clearInterval(interval);
			win.close();
		}
	},500);
})