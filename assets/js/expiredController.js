var Expired = {};
mainApp.controller("expiredController", function ($scope) {
	Expired = {
		init: function () {
			Expired.load();
			$("#sellExpired").click(function () {
				Main.sell(Model.selectedExpired,0,function () {
					Expired.load(false);
				});
			});
			$("#refreshExpired").click(function () {
				if($(this).attr('data-run') === "true") {
					return $(this).attr('data-stop',true);
				}else{
					Expired.load(true);
				}
			});
		},
		load: function (loadSimilar) {
			loadSimilar = loadSimilar || false;
			Main.clearSelected(Model.selectedExpired);

			$.ajax({
				url: Main.url('mail'),
				data: {
					xstoken: localStorage.xstoken
	            },
				dataType: 'json',
				type: 'POST',
				success: function(data) {
					if (data.error) {
						return Main.closeWin(err);
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
									pinyin: PinYin.to(mail[x].attachments[0].name),
									status: mail[x].mailType,
									sourceType: 3,
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
									pinyin: PinYin.to(mail[x].about.name),
									buyout: Main.formatMoney(mail[x].winPrice),
									status: mail[x].mailType,
									time: Math.floor(mail[x].timeToDelete/1000/3600/24)
								});
								break;
						}
					}

					if(Model.config.updateSimilar || loadSimilar){
						Main.similar(Model.expired, 0, false, function () {
							if($('#refreshExpired').attr('data-stop') === 'true'){
									$("#refreshExpired").text("刷新");
									$("#refreshExpired").attr('data-run',false);
									$("#refreshExpired").removeAttr('data-stop');
									return true;
								}
						});
					}else{
						$("#refreshExpired").text("刷新");
						$("#refreshExpired").attr('data-run',false);
						Main.status();
						Main.bind();
					}
				},
				beforeSend: function () {
					Main.status("邮箱更新中...");
				}
					
			});
		},
		bind: function () {
			
		}
	}
})