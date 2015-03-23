var Expired = {};
mainApp.controller("expiredController", function ($scope) {
	Expired = {
		init: function () {
			Expired.load();
			$("#sellExpired").click(function () {
				Main.sell(Model.selectedExpired,0,function () {
					Expired.load(null,function () {
						Main.status();
						Main.load();
					});
				});
			});
			$("#refreshExpired").click(function () {
				Expired.load();
				Main.clearSelected(Model.selectedExpired);
				Main.bind();
			});
		},
		load: function (similar,callback) {
			$.ajax({
				url: Main.url('mail'),
				data: {
					xstoken: localStorage.xstoken
	            },
				dataType: 'json',
				type: 'POST',
				success: function(data) {
					if (data.error) {
						//todo 失败返回信息
						return;
					}

					var mail = data.mail.newMessages;
					Model.expired = [];
					Model.sold = [];
					for(x in mail){
						switch (mail[x].mailType.toLowerCase())	{
							// todo 好像不是deleted
							case 'expired': case 'deleted':
								Model.expired.push({
									name: {
										title: mail[x].attachments[0].name,
										id: mail[x].attachments[0].id
									},
									quantity: mail[x].attachments[0].tooltipParams.quantity || 1,
									buyout: Main.formatMoney(mail[x].winPrice),
									status: mail[x].mailType,
									time: Math.floor(mail[x].timeToDelete/1000/3600/24)
								});
								break;
							case 'sold':
								Model.sold.push({
									name: {
										title: mail[x].about.name,
										id: mail[x].about.id
									},
									quantity: mail[x].about.tooltipParams.quantity || 1,
									buyout: Main.formatMoney(mail[x].winPrice),
									status: mail[x].mailType,
									time: Math.floor(mail[x].timeToDelete/1000/3600/24)
								});
								break;
						}
					}
					if(callback) callback();
				}
					
			});
		},
		bind: function () {
			
		}
	}
})