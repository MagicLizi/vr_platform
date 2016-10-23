/*
    ajax at common page.
    create by haha. 2016.10.17
 */
var globalPath = "/";
var globalPathOne = "http://139.224.53.144:8083/wx/";

var logout_url = globalPath + "user/logout",
	user_url = globalPath + "user";

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {

	if ($("#load_user_detail").attr("value") == "false"){

	}else{
		userinfo(function (data) {
		});
	}

	$('#login_out').click(function() {
		logout();
	});
});

//检查用户是否登录
function checklogin() {
	//var cookieValue  = $.cookie("login");
	//if(cookieValue == 1){
	//}
}

//退出登录
function logout() {

	var data = {
	}
	handleAjax(logout_url, data, "POST").done(function(data) {
		location.href = "index.html";
		$("#login_statu").text("登录");
		$("#login_statu").attr("href","login.html");
	}).fail(function(err) {
		// 当result为false的回调
	});
}

//获取用户信息
function userinfo(callback) {
	return ajax(user_url, {}, "GET").then(function(resp){
		if (resp.code == 9999){
			return;
		}else{
			var data = resp.data;
			if(data.nickName == ""){
				$("#login_statu").text("设置昵称");
				$("#login_statu").attr("href","user_edit.html");
			}else{
				$("#login_statu").text(data.nickName);
				$("#login_statu").attr("href","user.html");
			}
		}
		callback(data);
	}, function(err){
	});
}

function handleAjax(url, param, type) {
	return ajax(url, param, type).then(function(resp){
		// 成功回调
		if(resp.code == 200){
			return resp.data; // 直接返回要处理的数据，作为默认参数传入之后done()方法的回调
		}
		else if(resp.rec_code == 200){
			return resp;
		}
		else{
			if(resp.code == 99999){
				location.href = "/login.html";
			}else{
				$.scojs_message(resp.message, $.scojs_message.TYPE_OK);
			}
			return resp;
		}
	}, function(err){
		// 失败回调
			$.scojs_message("请求失败", $.scojs_message.TYPE_ERROR);
	});
}

function ajax(url, param, type) {
	// 利用了jquery延迟对象回调的方式对ajax封装，使用done()，fail()，always()等方法进行链式回调操作
	// 如果需要的参数更多，比如有跨域dataType需要设置为'jsonp'等等，也可以不做这一层封装，还是根据工程实际情况判断吧，重要的还是链式回调
	return $.ajax({
		url: url,
		data: param || {},
		type: type || 'GET'
	});
}