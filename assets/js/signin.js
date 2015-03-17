$(function () {
	var loginUrl = "https://www.battlenet.com.cn/login/zh/";
	var cookie;

	//demo data
	$("#email").val("493628086@qq.com");
	$("#password").val("Epeerror404");
	var winLogin = win
	$.ajax({
		url: loginUrl,
		success: function (res, status, xhr) {
			var csrftoken = res.getElementById("csrftoken");
			$("#step1").append(csrftoken);
		},
		error: function (err) {
			console.log(err);
		}
	});

	$("#step1").submit(function () {
		$.ajax({
			url: loginUrl,
			method: "POST",
			data: $("form").serialize(),
			success: function (res, status, xhr) {
				if(1){
					console.log(res);
					console.log(status);
					console.log(xhr);
				}else{
					console.log("not found cookie");
				}
			},
			error: function (err) {
				console.log(err);
			}
		});
		return false;
	})
});

