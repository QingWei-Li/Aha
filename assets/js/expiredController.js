var Expired = {};
mainApp.controller("expiredController", function ($scope) {
	Expired = {
		init: function () {
			Expired.load();
		},
		load: function () {
			$.ajax({
				url: Main.url('mail'),
				data: {
					xstoken: localStorage.xstoken
	            },
				dataType: 'json',
				type: 'POST',
				success: function(data) {
					if (data.error) {
						//todo 失败
						return;
					}

					var mail = data.mail.newMessages;
					for(x in mail){
						switch (mail[x].mailType.toLowerCase())	{
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
									// todo
								});
								break;
						}
					}
				}
					
			});
		},
		bind: function () {
			
		}
	}
})