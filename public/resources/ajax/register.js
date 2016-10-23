/*
    ajax at register page.
    create by haha. 2016.10.16
 */

var register_url = globalPath + "user/register",
	getcode_url = globalPathOne + "sendAuthCode.html";
var login_url = globalPath + "user/login";
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
		console.log("发送验证码成:"+ data);
	}).fail(function(err) {
		// 当result为false的回调
	});
}

//注册
function register() {
	var condition = true;
	if(condition){
		if($("#accountphone").val() == ""){
			alert("输入手机号码");
			condition = false;
		}
		if($("#password").val() == ""){
			alert("输入密码");
			condition = false;
		}
		if($("#reenter_password").val() == ""){
			alert("再次确认密码");
			condition = false;
		}
		if($("#password").val() !== $("#reenter_password").val()){
			alert("两次输入的密码不一致");
			condition = false;
		}
		if($("input[type='checkbox']").is(':checked') == false) {
			alert("阅读并同意协议才能继续");
			condition = false;
		}
	}
	if(condition){
		var data = {
			"mobile": $("#accountphone").val(),
			"password": $("#password").val(),
			"verifyCode":$("#accountcode").val()
		}
		handleAjax(register_url, data, "POST").done(function() {
			//location.href = "index.html";
			handleAjax(login_url,data,"POST").done(function(){
				location.href = "index.html";
			});
		}).fail(function(err) {
			// 当result为false的回调
		});
	}
}