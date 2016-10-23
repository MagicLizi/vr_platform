/*
    ajax at detail page.
    create by haha. 2016.10.14
 */

var gamedetail_url = globalPath + "game/gameDetail",
	collect_game_url = globalPath + "game/collection";

// 推荐精选
function gamedetail(gameid, userid) {
	if(userid == null || userid == "undefined") {
		userid = 0;
	}
	if(gameid == null || gameid == "undefined") {
		gameid = 1;
	}
	handleAjax(gamedetail_url, {gameId: gameid}, "GET").done(function(data) {

			var da = data[0];
			$("#game_name").html(da.name);

			var all = '<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">';

			var pics = (da.screenshots).split("|");
			var videos = (da.gameVideos).split("|");

			all += '<ol class="carousel-indicators">';
			if(videos.length > 0 && videos[0] != "") {

				for(var i = 0; i < videos.length; i++) {
					var html = '';
					if(i == 0) {
						html += '<li data-target="#carousel-example-generic" data-slide-to="' + i + '" class="active"></li>';
					} else {
						html += '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>';
					}

					all += html;
				}
			}

			for(var i = (videos.length > 0 && videos[0] != "") ? videos.length : 0; i < (pics.length +((videos.length > 0 && videos[0] != "") ? videos.length : 0)); i++) {
				var html = '';
				if(i == 0) {
					html += '<li data-target="#carousel-example-generic" data-slide-to="' + i + '" class="active"></li>';
				} else {
					html += '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>';
				}

				all += html;
			}
			all += '</ol>';
			all += '<div class="carousel-inner" role="listbox" id="main_cluster_scroll">';

			if(videos.length > 0 && videos[0] != "") {

				for(var i = 0; i < videos.length; i++) {

					d = videos[i];
					var html = '';
					if(i == 0) {
						html = '<div class="item active">';
					} else {
						html = '<div class="item">';
					}
					html += '<video src="' + d + '" controls="controls"></video>';
					html += '</div>';

					all += html;
				}
			}

			for(var i = (videos.length > 0 && videos[0] != "") ? videos.length : 0; i < (pics.length +((videos.length > 0 && videos[0] != "") ? videos.length : 0)); i++) {

				d = pics[i];
				var html = '';
				if(i == 0) {
					html = '<div class="item active">';
				} else {
					html = '<div class="item">';
				}
				html += '<img class="cluster_capsule_image" src="' + d + '">';
				html += '</div>';

				all += html;
			}
			all += '</div>';
			all += '<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">';
			all += '<span class="glyphicon glyphicon-chevron-left"></span>';
			all += '</a>';
			all += '<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">';
			all += '<span class="glyphicon glyphicon-chevron-right"></span>';
			all += '</a></div>';

			$(".main_cluster_content").html(all);
			$('.carousel').carousel();

			var html = '';
			if(da.playerNumbers == 1) {

				html += '<div class="row"><div class="col-sm-4">';
				html += '<a><img class="category_icon" src="resources/images/ico_singlePlayer.png"></a></div>';
				html += '<div class="col-sm-8"><a class="name">单人</a></div></div>';
			}

			if(da.playerNumbers == 2) {
				html += '<div class="row"><div class="col-sm-4">';
				html += '<a><img class="category_icon" src="resources/images/ico_singlePlayer.png"></a></div>';
				html += '<div class="col-sm-8"><a class="name">单人</a></div></div>';
			}

			if(da.playerNumbers == 3) {

				html += '<div class="row"><div class="col-sm-4">';
				html += '<a><img class="category_icon" src="resources/images/ico_singlePlayer.png"></a></div>';
				html += '<div class="col-sm-8"><a class="name">单人</a></div></div>';
			}

			$(".game_player").html(html);

			var html = '<b>名称:</b>' + da.name + '<br>'
			html += '<b>类型:</b><a>';
			for(var i = 0; i < da.tag.length; i++) {
				html += da.tag[i];
				if(i != da.tag.length - 1) {
					html += ',';
				}
			}
			html += '</a><br>';
			html += '<b>开发商:</b><a>' + da.provider + '</a><br>';
			html += '<b>发行商:</b><a>' + da.publisher + '</a><br>';
			html += '<b>语言:</b><a>'
			for(var i = 0; i < (da.language).length; i++) {
				html += (da.language)[i];
				if(i != da.language.length - 1) {
					html += ',';
				}
			}
			html += '</a><br>';
			var createAt = new Date(da.createAt),
				refreshAt = new Date(da.refreshAt);
			html += '<b>发行日期:</b>' + createAt.getFullYear() + "-" + (createAt.getMonth() + 1 < 10 ? '0' + (createAt.getMonth() + 1) : createAt.getMonth() + 1) + "-" + createAt.getDate() + '<br>';

			html += '<b>最新版本:</b>' + refreshAt.getFullYear() + "-" + (refreshAt.getMonth() + 1 < 10 ? '0' + (refreshAt.getMonth() + 1) : refreshAt.getMonth() + 1) + "-" + refreshAt.getDate() + '<br>';

			$(".game_message").html(html);

			$("#game_detail_desc").html(da.description);

			if(da.stores > 0) {
				var all = "";
				$(".install_stores").show();
				for(var i = 0; i < da.stores.length; i++) {

					d = da.stores[i];
					var html = '<p class="small"><strong>' + d.name + '</strong>&nbsp;&nbsp;地址：' + d.address + '</p>';
					all += html;
				}
				$("#install_game_store").html(all);
			}else{
				$(".install_stores").hide();
			}
			if(da.smillars > 0) {
				$(".install_stores").show();
				var all = "";
				for(var i = 0; i < da.similars.length; i++) {

					d = da.similars[i];
					var html = '<div class="col-sm-4 "><div class="inshadow thumbnail"><a game_id="' + d.id + '" href="detail.html?gameid=' + d.id + '">';
					html += '<img src="' + d.kvImage + '>';
					html += '<h3>' + d.name + '</h3></a>';
					all += html;
				}
				$(".similar_games_list").html(all);
			}else{
				$(".similar_games").hide();
			}
	}).fail(function(err) {
		// 当result为false的回调
	});
}
//收藏
function collect_game() {

	var data = {
		"gameId": getUrlParam("gameid")
	}
	handleAjax(collect_game_url, data, "POST").done(function(data) {
		$("#collect_btn").html("已收藏");
	}).fail(function(err) {
		// 当result为false的回调
	});
}


/*----initial--------------------------------------*/
jQuery(document).ready(function($) {
	gamedetail(getUrlParam("gameid")); // 游戏详情

	$('#collect_btn').click(function(event) {
		collect_game();
	});

});