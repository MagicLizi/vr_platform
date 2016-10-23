/**
 * Created by MagicLizi on 16/9/18.
 */
var userControl = require('../z_controls/userControl');
var utilNext = require('../z_util/utilNext');
var code = require('../z_util/code');
var netData = require("../z_models/netData");
//请求前置过滤器
var frontFilter = function(req,res,next)
{
    var requestUrl = req.originalUrl;
    var method = req.method;
    var reqParams = {};
    if(method === "GET")
    {
        reqParams = req.query;
    }
    else if(method === "POST")
    {
        reqParams = req.body;
    }
    console.log("--------------------");

    var curToken =  req.cookies['VRSESSION'];
    if (curToken)
    {
        console.log('cookie存在自动续期:'+ curToken);
        res.cookie('VRSESSION',curToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        reqParams.token = curToken;
    }

    //验证TOKEN
    console.log('验证Token：'+curToken);
    userControl.verifyToken(requestUrl,curToken,function(verifyResult)
    {
        if(verifyResult.code == code.success)
        {
            console.log("开始处理请求:" + requestUrl);
            console.log("请求方法:" + method);
            console.log("请求参数:" + JSON.stringify(reqParams));
            next();
        }
        else
        {
            console.log("TOKEN无效,请重新登录");
            var tokenErrorData = new netData(code.tokenError,{},"TOKEN无效,请重新登录");
            utilNext.utilSend(tokenErrorData,res,next);
        }
    })
}

module.exports = frontFilter;


