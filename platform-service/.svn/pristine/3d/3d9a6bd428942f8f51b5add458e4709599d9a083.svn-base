/*
    ajax at register page.
    create by haha. 2016.10.16
 */

var register_url = globalPath + "user/register",
	getcode_url = globalPathOne + "sendAuthCode.html";
var code = "";

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {
	$("#createAccountButton").click(function() {
		register();
	});

	$('.input_note').click(function() {
		var  today = new Date(),
			second = Math.round(today.setSeconds(today.getSeconds() + 60) / 1000);
		$('#countdowner').scojs_countdown({until: second});
		get_code();
	});
});

//获取手机验证码
function get_code() {
	if($("#accountphone").val() == "" || $("#accountphone").val().length != 11)
		return alert("输入正确的手机号");
	var data = {
		mobile: $("#accountphone").val(),
	}
	handleAjax(getcode_url, data, "POST").done(function(data) {

	}).fail(function(err) {
		// 当result为false的回调
	});
}

//注册
function register() {
	if($("#accountphone").val().trim() == "")
		return alert("输入手机号码");
	if($("#password").val() == "")
		return alert("输入密码");
	if($("#reenter_password").val().trim() == "")
		return alert("再次确认密码");
	if($("#password").val().trim() !== $("#reenter_password").val().trim())
		return alert("两次输入的密码不一致");
	if($("#i_agree_check").attr("checked") == false) {
		return alert("阅读并同意协议才能继续");
	}
	var data = {
		"mobile": $("#accountphone").val(),
		"password": $("#password").val(),
		"verifyCode":$("#accountcode").val()
	}
	handleAjax(register_url, data, "POST").done(function(data) {
		if(data.code == 200){
			location.href = "index.html";
		}else{
			$.scojs_message(data.message, $.scojs_message.TYPE_ERROR);
		}

	}).fail(function(err) {
		// 当result为false的回调
	});

}