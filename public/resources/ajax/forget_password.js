/*
    ajax at register page.
    create by haha. 2016.10.16
 */
var getcode_url = globalPathOne + "sendAuthCode.html",
	resetpassword_url = globalPathOne + "resetpwd.html";

var sign;

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {

	$('#check_captcha').click(function() {

		var  today = new Date(),
			second = Math.round(today.setSeconds(today.getSeconds() + 60) / 1000);
			$('#countdowner').scojs_countdown({until: second});

		get_code();
	});

	$('#next_action').click(function() {
		reset_password();
	});

	// $('#reset_login').click(function() {
	// 	reset_password();
	// });

});

//获取手机验证码
function get_code() {
	if($("#get_captcha").val().trim() == "" || $("#get_captcha").val().trim().length != 11)
		return alert("输入正确的手机号");
	var data = {
		"mobile": $("#get_captcha").val(),
	}

	handleAjax(getcode_url, data, "POST").done(function(data) {

	}).fail(function(err) {
		// 当result为false的回调
	});

}

//校验验证码
function check_code() {

	var data = {
		"mobile": $("#get_captcha").val(),
		"code": $("#check_code").val()
	}

	handleAjax(checkcode_url, data, "POST").done(function(data) {
		if(data['res_code'] == 200)
		{
			sign = data.sign;
			$("#checkout_account").hide();
			$("#reset_password").show();

		} else {
		}
	}).fail(function(err) {
		// 当result为false的回调
	});
}

//重置密码
function reset_password() {
	if($("#accountphone").val() == "")
		return alert("输入手机号码");
	if($("#password").val() == "")
		return alert("输入密码");
	if($("#reenter_password").val() == "")
		return alert("再次确认密码");
	if($("#password").val() !== $("#reenter_password").val())
		return alert("两次输入的密码不一致");
	if($("#i_agree_check").attr("checked") == false) {
		return alert("阅读并同意协议才能继续");
	}
	var data = {
		"mobile": $("#get_captcha").val(),
		"code": $("#check_code").val(),
		"password": $("#new_password").val()
	}

	handleAjax(resetpassword_url, data, "POST").done(function(data) {
		if(data['res_code'] == 200) {
			location.href = "login.html";
		} else {
		}
	}).fail(function(err) {
		// 当result为false的回调
	});
}