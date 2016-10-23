/*
    ajax at home page.
    create by haha. 2016.10.14
 */
var featuregamelist_url = globalPath + "game/featureGames",
	newgamelist_url = globalPath + "game/newGameList",
	allgamelist_url = globalPath + "game/gameList";

var current_page = 0;

// 推荐精选
function featureGamesList(page, userid) {
	if(userid == null || userid == "undefined") {
		userid = 0;
	}
	handleAjax(featuregamelist_url, {userid: userid}, "GET").done(function(data) {
		var da = data;
		var all = '<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">';
		all += '<ol class="carousel-indicators">';
		for(var i = 0; i < da.length; i++) {

			d = da[i];
			var html = '';
			if(i == 0) {
				html = '<li data-target="#carousel-example-generic" data-slide-to="' + i + '" class="active"></li>';
			} else {
				html = '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>';
			}

			all += html;
		}
		all += '</ol>';
		all += '<div class="carousel-inner" role="listbox" id="main_cluster_scroll">';

		for(var i = 0; i < da.length; i++) {

			d = da[i];
			var html = '';
			if(i == 0) {
				html = '<a class="item active" data-gameid="' + d.id + '" href="detail.html?gameid=' + d.id + '">';
			} else {
				html = '<a class="item" data-gameid="' + d.id + '" href="detail.html?gameid=' + d.id + '">';
			}
			html += '<img class="cluster_capsule_image" src="' + d.kvImage + '">';
			html += '</a>';

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
	}).fail(function(err) {
		// 当result为false的回调
	});
}

// 新品发布
function newGamesList(page, userid) {
	if(userid == null || userid == "undefined") {
		userid = 0;
	}
	handleAjax(newgamelist_url, {userid: userid}, "GET").done(function(data) {
		var da = data;

			var c = this;
			var all = "";

			for(var i = 0; i < da.length; i++) {
				d = da[i];

				var html = '<div class="col-sm-4 "><div class="inshadow thumbnail"><a href="detail.html?gameid=' + d.id + '">';
				html += '<img src="' + d.kvImage + '">';
				html += '<div class="caption"><h3>' + d.name + '</h3>';
				html += '<p>' + d.description + '</p>';
				html += '</div></a></div></div>';

				all += html;
			}

			$(".new_games_list").html(all);
	}).fail(function(err) {
		// 当result为false的回调
	});
}

//全部游戏
function allGamesList(page, userid) {
	if(userid == null || userid == "undefined") {
		userid = 0;
	}
	var data = {
		userid: userid, // userid 0-没有，>0 - 有id
		page: page
	};
	handleAjax(allgamelist_url, data, "GET").done(function(data) {
		var da = data.list;
		var c = this;
		var all = "";
		for(var i = 0; i < da.length; i++) {
			d = da[i];

			var html = '<div class="col-sm-3 "><div class="inshadow thumbnail"><a href="detail.html?gameid=' + d.id + '">';
			html += '<img src="' + d.kvImage + '">';
			html += '<div class="caption"><h3>' + d.name + '</h3>';
			html += '<p>' + d.description + '</p>';
			html += '</div></a></div></div>';

			all += html;
		}

		$(".all_games_list").html(all);
		if(data.hasNext == false){
			$(".all_games_list").data("page",-1);
		}else{
			$(".all_games_list").data("page",page);
		}
	}).fail(function(err) {
		// 当result为false的回调
	});
}

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {
	featureGamesList(); // 推荐精选
	newGamesList(); // 新品发布
	allGamesList(0); //全部游戏

	userinfo(function (data) {
	});
	
	$('#next_page').click(function(){
		if($(".all_games_list").data("page") == -1){
			$('#next_page').hide();
		}else{
			allGamesList($(".all_games_list").data("page")+1);
		}
	});

	$('#front_page').click(function(){
		$('#next_page').show();
		if($(".all_games_list").data("page") > 0 ){
			allGamesList($(".all_games_list").data("page")-1);
		}
	});
});