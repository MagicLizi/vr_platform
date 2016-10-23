/*
    ajax at user_edit page.
    create by haha. 2016.10.16
 */
var useredit_url = globalPath + "user",
	upload_url = globalPathOne + "uploadSign.html";

/*----initial--------------------------------------*/
jQuery(document).ready(function($) {

	userinfo(function (data) {
		$("#user_nickname").val(data.nickName);
		$("#user_introduction").val(data.introduction);
	});


	$("#user_icon").fileinput({

		language: 'zh', //设置语言

		allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
		showUpload: false, //是否显示上传按钮
		showCaption: false,//是否显示标题
		allowedFileExtensions: ['jpg', 'png', 'gif'],
		//allowedFileTypes: ['image', 'video', 'flash'],
		// slugCallback: function(filename) {
		// 	return filename.replace('(', '_').replace(']', '_');
		// }

	});


	$('#user_edit_submit').click(function(event) {
		user_edit();
	});


});


//个人资料修改
function user_edit(userid) {
	var fileUri = $("#user_icon").val();
	console.log(fileUri);
	getSign(fileUri,function(data){
		uploadToCDN(data,function(result){
			editUser(result);
		});
	});

}

function getSign(fileUri,callback) {
	$.ajax({
		url : upload_url,
		type : 'POST',
		data : {fileUri:encodeURI(fileUri)},
		dataType:'json',
		success : function(result)
		{
			callback(result.data);
		},
		error : function()
		{
			alert('上传失败！');
		}});
}

function uploadToCDN(data, callback) {

	//2.回调/
	//签名接口获取的数据
	var signature = data.signature;
	var policy = data.policy;
	var upLoadUrl = data.upLoadUrl;
	var fileDomainUrl = data.fileLoadDomain;

	//formData 参数
	var formData = new FormData();
	formData.append('policy', policy);
	formData.append('signature', signature);
	formData.append("file", $("#user_icon")[0].files[0]); //input 标签种的文件信息

	//上传
	$.ajax({
		url : upLoadUrl,
		type : 'POST',
		data : formData,
		dataType:'json',
		processData : false,
		contentType : false,
		success : function(responseStr)
		{
			var fileUrl = fileDomainUrl + responseStr.url;
			callback(fileUrl);
			console.log('上传成功，文件地址:' + fileDomainUrl + responseStr.url);
		},
		error : function(responseStr)
		{
			alert('上传失败！');
		}});
}

function editUser(fileUrl) {
	var data = {
		"nickName": $("#user_nickname").val(),
		"introduction": $("#user_introduction").val(),
		"logo":fileUrl
	}
	handleAjax(useredit_url, data, "POST").done(function(data) {
		location.href = "user.html";
	}).fail(function(err) {
		// 当result为false的回调
	});
}