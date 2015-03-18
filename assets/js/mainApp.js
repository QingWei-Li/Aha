var mainApp = angular.module("mainApp", []);

var Msg = Msg || {};
var Core = Core || {};
$(function () {
	Msg.ui = {
		loading: "正在加载"
	};
	Core.baseUrl = "https://www.battlenet.com.cn/wow/zh/";
})