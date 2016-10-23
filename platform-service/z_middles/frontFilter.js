/**
 * Created by MagicLizi on 16/9/18.
 */

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

    if (req.cookies&& req.cookies['VRSESSION'])
    {
        var curToken =  req.cookies['VRSESSION'];
        console.log('cookie存在自动续期:'+ curToken);
        res.cookie('VRSESSION',curToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        reqParams.token = curToken;
    }

    console.log("开始处理请求:" + requestUrl);
    console.log("请求方法:" + method);
    console.log("请求参数:" + JSON.stringify(reqParams));

    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Credentials','Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
}

module.exports = frontFilter;


