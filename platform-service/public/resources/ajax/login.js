/*
    ajax at login page.
    create by haha. 2016.10.16
 */
var login_url = globalPath + "user/login";

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {

	$('#login_btn').click(function() {
		login();
	});
});

//登录
function login() {
	if($("#input_username").val() == "")
		return alert("输入手机号");
	if($("#input_password").val() == "")
		return alert("输入密码");
	var data = {
		"mobile": $("#input_username").val(),
		"password": $("#input_password").val(),
	}
	handleAjax(login_url, data, "POST").done(function(data) {
		if(data.code == 200){
			location.href = "index.html";
		}else{
			$.scojs_message(data.message, $.scojs_message.TYPE_ERROR);
		}
	}).fail(function(err) {
		// 当result为false的回调
	});
}