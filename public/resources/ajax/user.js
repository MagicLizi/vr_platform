/*
    ajax at user page.
    create by haha. 2016.10.10
 */
var userlist_url = globalPath + "user",
	submitvalue_url = globalPath + "submitvalue";

// 推荐精选
function userList() {
	handleAjax(userlist_url, {}, "GET").done(function(data) {
		var da = data;
		$("#actual_persona_name").text(da.nickName);
		$("#profile_summary").html(da.introduction);
		$("#user_icon").find("img").attr("src", da.avatar);

		var c = this;
		var all = '';

		for(var i = 0; i < da.collGames.length; i++) {
			var d = da.collGames[i];

			var html = '<div class="col-sm-4 "><div class="inshadow thumbnail"><a href="detail.html?gameid=' + d.id+ '">';
			html += '<img src="' + d.kvImage + '">';
			html += '<div class="caption"><h3>' + d.name + '</h3>';
			html += '<p>' + d.description + '</p>';
			html += '</div></a></div></div>';

			all += html;
		}

		$("#collect_games").html(all);

		if(da.collGames.length == 0){
			$(".col_game_block").hide();
		}

		var all = '';

		for(var j = 0; j < da.playedGames.length; j++) {
			var d = da.playedGames[j];

			var html = '<div class="col-sm-4 "><div class="inshadow thumbnail"><a href="detail.html?gameid=' + d.id + '">';
			html += '<img src="' + d.kvImage + '">';
			html += '<div class="caption"><h3>' + d.name + '</h3>';
			html += '<p>' + d.description + '</p>';
			html += '</div></a></div></div>';

			all += html;
		}

		$("#played_games").html(all);

		if(da.playedGames.length == 0){
			$(".played_game_block").hide();
		}

	}).fail(function(err) {
		// 当result为false的回调
	});
}

//充值金额
function submitValue(value, userid) {
	if(userid == null || userid == "undefined") {
		userid = 0;
	}
	var data =  {
			value: value,
			userid: userid // userid 0-没有，>0 - 有id
		};
	handleAjax(submitvalue_url, data, "POST").done(function(data) {

	}).fail(function(err) {
		// 当result为false的回调
	});
}

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {

	userList(); // 个人中心显示

	$("#sent_value").click(function() {
		if($("#voucher_center_value").val == "") {
			return alert("输入充值金额");
		}

		//进入支付页面

	});
});