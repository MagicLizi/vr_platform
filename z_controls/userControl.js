/**
 * Created by 1 on 2016/10/12.
 */
var userControl = module.exports;
var request = require("request");
var netData = require("../z_models/netData");
var async = require('async');
var gameControl = require("../z_controls/gameControl");
var code = require("../z_util/code");
var domainConfig = require('../z_configs/domain.json');
var url = require('url');
userControl.domain =domainConfig.userDomain;

/**
 * 验证验证码
 * @param mobile
 * @param callback
 */
userControl.verifyCode = function(mobile,verifyCode,callback)
{
    var api = "/vaildCode.html";
    var postParam =
    {
        url : userControl.domain + api,
        form :
        {
            mobile : mobile,
            code : verifyCode,
        }
    }
    request.post(postParam, function(err,httpResponse,body)
    {
        var verifyResult;
        if(err)
        {
            verifyResult = new netData(code.user.verifyCodeError,err.stack);
        }
        else
        {
            var bodyObj = JSON.parse(body);
            if(bodyObj['res_code'] == 200)
            {
                verifyResult = new netData(code.success,{},"验证成功");
            }
            else
            {
                verifyResult = new netData(code.user.verifyCodeError,{},'验证码验证错误');
            }
        }
        callback(verifyResult);
    });
};

/**
 * 用户注册
 * @param mobile
 * @param password
 * @param jid
 */
userControl.register = function(mobile,password,jid,source,verifyCode,res,callback)
{
    userControl.verifyCode(mobile,verifyCode,function(verifyResult)
    {
        if(verifyResult.code === code.success)
        {
            //验证验证码 之后再注册
            var api = "/register.html";
            var postParam =
            {
                url : userControl.domain + api,
                form :
                {
                    mobile : mobile,
                    password : password,
                    jid : jid,
                    source:source
                }
            }
            request.post(postParam, function(err,httpResponse,body)
            {
                var registerResult;
                if(err)
                {
                    console.log(err);
                    registerResult = new netData(code.user.registerError,{},err.stack);
                }
                else
                {
                    var bodyObj = JSON.parse(body);
                    if(bodyObj['res_code'] == 200)
                    {
                        var token = bodyObj['token'];
                        res.cookie('VRSESSION',token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                        registerResult = new netData(code.success,{},"注册成功!");
                    }
                    else
                    {
                        registerResult = new netData(code.user.registerError,{},bodyObj['res_msg']);
                    }
                }
                callback(registerResult);
            });
        }
        else
        {
            callback(verifyResult);
        }
    });
}

/**
 * 登录
 * @param mobile
 * @param password
 * @param callback
 */
userControl.login = function(mobile,password,jid,res,callback)
{
    var api = "/doLogin.html";
    var postParam =
    {
        url : userControl.domain + api,
        form :
        {
            mobile : mobile,
            password : password,
            jid:jid
        }
    }
    request.post(postParam, function(err,httpResponse,body)
    {
        var loginResult;
        if(err)
        {
            loginResult = new netData(code.user.loginError,{},err.stack)
        }
        else
        {
            var bodyObj = JSON.parse(body);
            if(bodyObj['res_code'] == 200)
            {
                var token = bodyObj['token'];
                console.log("登陆成功：" + token);
                res.cookie('VRSESSION',token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });

                // var userBasicInfo =
                // {
                //     nickName : bodyObj.nickName,
                //     avatar : bodyObj['logo'],
                //     balance : ~~(bodyObj.balance)
                // }
                loginResult = new netData(code.success,{},"登录成功");
            }
            else
            {
                loginResult = new netData(code.user.loginError,{},bodyObj['res_msg']);
            }
        }
        callback(loginResult);
    });
}

/**
 * 登出
 */
userControl.logout = function(res,callback)
{
    var logOutResult = new netData(code.success,{},"登出成功");
    res.clearCookie('VRSESSION');
    callback(logOutResult);
},

/**
 * 获取用户信息 用户头像 用户昵称 收藏的游戏
 * @param token
 * @param callback
 */
userControl.userInfo = function(token,callback)
{
    var api = "/myInfo.html";
    var postParam =
    {
        url : userControl.domain + api,
        form :
        {
            token : token,
        }
    }

    request.post(postParam, function(err,httpResponse,body)
    {
        var userInfoResult;
        if(err)
        {
            userInfoResult = new netData(code.user.getUserInfoError,{},err.stack);
            callback(userInfoResult);
        }
        else
        {
            var bodyObj = JSON.parse(body);
            if(bodyObj['res_code'] == 200)
            {
                var player = bodyObj['player'];
                var collgames = bodyObj['collgames'];
                var playedGames = bodyObj['games'];
                var allId = "";
                for(var i = 0;i<collgames.length;i++)
                {
                    allId += collgames[i]['gameId'] + ","
                }
                for(var i = 0;i<playedGames.length;i++)
                {
                    allId += playedGames[i]['sourceId'] + ","
                }

                gameControl.getGameByList(allId,function(e,r)
                {
                    if(e)
                    {
                        console.log("gameControl.getGameByList获取游戏信息失败");
                        userInfoResult = new netData(code.user.getUserInfoError,{},e.stack);
                        callback(userInfoResult);
                    }
                    else
                    {
                        var userCollgames = [];
                        var userPlayedgames = [];
                        //收集游戏
                        for(var i = 0;i<collgames.length;i++)
                        {
                            var game = gameControl.getGameInList(collgames[i].gameId,r);
                            game&& userCollgames.push(game);
                        }

                        //玩过的游戏
                        for(var i = 0;i<playedGames.length;i++)
                        {
                            var game = gameControl.getGameInList(playedGames[i]['sourceId'],r);
                            game&& userPlayedgames.push(game);
                        }

                        var userInfo =
                        {
                            nickName:player.nickName,
                            avatar :player.logo,
                            introduction:player.introduction,
                            collGames: userCollgames,
                            playedGames:userPlayedgames
                        }
                        userInfoResult = new netData(code.success,userInfo,'获取用户信息成功！');
                        callback(userInfoResult);
                    }
                })
            }
            else
            {
                userInfoResult = new netData(code.user.getUserInfoError,{},bodyObj['res_msg']);
                callback(userInfoResult);
            }
        }
    });
}

/**
 * 设置用户信息
 * @param token
 * @param identity
 * @param name
 * @param nickName
 * @param email
 * @param logo
 * @param introduction
 * @param callback
 */
userControl.editUserInfo = function(token,identity,name,nickName,email,logo,introduction,callback)
{
    var api = "/complete.html";
    var postParam =
    {
        url : userControl.domain + api,
        form :
        {
            identity : identity,
            name : name,
            nickName:nickName,
            email:email,
            logo:logo,
            introduction:introduction,
            token:token
        }
    }
    request.post(postParam, function(err,httpResponse,body) {
        var editResult;
        if (err)
        {
            editResult = new netData(code.user.editUserInfoError,{},err.stack)
        }
        else
        {
            var bodyObj = JSON.parse(body);
            if(bodyObj&&bodyObj['res_code'] == 200)
            {
                editResult = new netData(code.success,{},"修改用户信息成功！");
            }
            else
            {
                editResult = new netData(code.user.editUserInfoError,{},body);
            }
        }
        callback(editResult);
    });
}


/**
 * 修改密码
 * @param token
 * @param mobile
 * @param password
 * @param verifyCode
 * @param callback
 */
userControl.changePassword = function(token,password,sign,callback)
{
    var api = "/resetpwd.html";
    var postParam =
    {
        url : userControl.domain + api,
        form :
        {
            password:password,
            sign:sign
        }
    }
    request.post(postParam, function(err,httpResponse,body)
    {
        var changeResult;
        if(err)
        {
            changeResult = new netData(code.user.changePasswordError,{},err.stack);
        }
        else
        {

            var bodyObj = JSON.parse(body);
            console.log(body);
            if(bodyObj['res_code'] == 200)
            {
                changeResult = new netData(code.success,{},"修改密码成功！");
            }
            else
            {
                changeResult = new netData(code.user.changePasswordError,{},bodyObj['res_msg']);
            }
        }
        callback(changeResult);
    });
}

var notNeedVerifyUrl = [
    '/game/gameList',
    '/game/newGameList',
    '/game/gameList',
    '/game/featureGames',
    '/user/login',
    '/user/register',
    '/game/gameDetail'
]
/**
 * 验证用户Token
 * @param token
 * @param callback
 */
userControl.verifyToken = function(requestUrl,token,callback)
{
    var pathname =  url.parse(requestUrl).pathname;
    var needVerify = true;
    for(var i = 0;i<notNeedVerifyUrl.length ;i++)
    {
        if(pathname === notNeedVerifyUrl[i])
        {
            console.log("不需要验证！"+pathname);
            needVerify = false;break;
        }
    }

    if(needVerify)
    {
        var api = "/vaildToken.html";
        var postParam =
        {
            url : userControl.domain + api,
            form :
            {
                token : token
            }
        }
        request.post(postParam, function(err,httpResponse,body)
        {
            var valiedTokenResult;
            if(err)
            {
                valiedTokenResult = new netData(code.user.verifyTokenError,{},err.stack);
            }
            else
            {
                var bodyObj = JSON.parse(body);
                if(bodyObj['res_code'] == 200)
                {
                    valiedTokenResult = new netData(code.success,{},"验证TOKEN成功");
                }
                else
                {
                    valiedTokenResult = new netData(code.user.verifyTokenError,{},body['res_msg']);
                }
            }
            callback(valiedTokenResult);
        });
    }
    else
    {
        var valiedTokenResult = new netData(code.success,{},"验证TOKEN成功");
        callback(valiedTokenResult);
    }
}


