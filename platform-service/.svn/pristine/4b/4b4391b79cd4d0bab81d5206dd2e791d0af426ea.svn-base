/**
 * Created by 1 on 2016/10/12.
 */
var express = require('express');
var router = express.Router();
var utilNext = require("../z_util/utilNext");
var userControl = require("../z_controls/userControl");

/**
 * 修改密码
 */
router.post('/changePassword',function(req,res,next)
{
    var mobile = req.body.mobile;
    var sign = req.body.sign;
    var token = req.body.token;
    userControl.changePassword(token,mobile,sign,function(changeResult)
    {
        utilNext.utilSend(changeResult,res,next);
    })
});

/**
 * 注册
 */
router.post('/register',function(req,res,next)
{
    var mobile = req.body.mobile;
    var password = req.body.password;
    var jid = req.body.jid;
    var verifyCode = req.body.verifyCode;
    var source = req.body.source?req.body.source:4;
    userControl.register(mobile,password,jid,source,verifyCode,res,function(registerResult)
    {
        //setcookie
        utilNext.utilSend(registerResult,res,next);
    });
});

/**
 * 登录
 */
router.post('/login',function(req,res,next)
{
    var mobile = req.body.mobile;
    var password = req.body.password;
    var jid = req.body.jid;
    userControl.login(mobile,password,jid,res,function(loginResult)
    {
        //setcookie
        utilNext.utilSend(loginResult,res,next);
    });
});

/**
 * 登出
 */
router.post('/logout',function(req,res,next)
{
    userControl.logout(res,function(logOutResult)
    {
        utilNext.utilSend(logOutResult,res,next);
    });
});

/**
 * 获取用户信息
 */
router.get('/',function(req,res,next)
{
    var token = req.query.token;
    userControl.userInfo(token,function(userInfoResult)
    {
        utilNext.utilSend(userInfoResult,res,next);
    });
});

/**
 * 完善用户信息
 */
router.post('/',function(req,res,next)
{

    //有待商榷
    // var identity = req.body['indentity'];
    // var name = req.body['name'];
    var nickName = req.body['nickName'];
    var email = req.body['email'];
    var logo = req.body['logo'];
    var introduction = req.body['introduction'];
    var token = req.body['token'];
    userControl.editUserInfo(token,"","",nickName,email,logo,introduction,function (editResult)
    {
        utilNext.utilSend(editResult,res,next);
    })
});

module.exports = router;
