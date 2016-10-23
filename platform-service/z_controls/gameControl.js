/**
 * Created by 1 on 2016/10/16.
 */
var gameControl = module.exports;
var dataAccess = require("dataAccess");
var netData = require("../z_models/netData");
var code = require("../z_util/code");
var request = require('request');
var domainConfig = require('../z_configs/domain.json');
var async = require("async");
var command = dataAccess.command;
var executor = dataAccess.executor;
/**
 * 获取首页游戏列表，带分页
 * @param page
 * @param callback
 */
gameControl.getGameList = function(page,callback)
{
    page = page?page:0;
    var offset = 10;
    var begin = page * offset;
    var c = new command('(SELECT id,name,description,kvImage,weight FROM game where isValid = 1 LIMIT ?,?) ORDER BY weight DESC',[begin,offset]);
    executor.query('platform_vr',c,function(e,r)
    {
        var gameListResult;
        if(e)
        {
            gameListResult = new netData(code.game.getGameListError,{},e.stack);
            callback(gameListResult);
        }
        else
        {
            if(r.length === 0)
            {
                var gameList =
                {
                    list : r,
                    hasNext : false
                }
                gameListResult = new netData(code.success,gameList,"获取游戏列表成功");
                callback(gameListResult);
            }
            else
            {
                var lastId = r[0].id;
                var hasNextCommand = new command('SELECT * FROM game WHERE id > ?',[lastId]);
                executor.query('platform_vr',hasNextCommand,function(e1,r1)
                {
                    if(e)
                    {
                        gameListResult = new netData(code.game.getGameListError,{},e1.stack);
                        callback(gameListResult);
                    }
                    else
                    {
                        var hasNext = false;
                        if(r1.length > 0)
                        {
                            hasNext = true;
                        }
                        var gameList =
                        {
                            list : r,
                            hasNext : hasNext
                        }
                        gameListResult = new netData(code.success,gameList,"获取游戏列表成功");
                        callback(gameListResult);
                    }
                })
            }
        }
    });
}


/**
 * 新游发布
 * @param page
 * @param callback
 */
gameControl.getNewGameList = function(callback)
{
    var newListCommand = new command('SELECT game.id,game.kvImage,game.name,game.description FROM game_newcoming right join game on(game_newcoming.gameId = game.id) ' +
        'where game_newcoming.isValid = 1 order by game_newcoming.weight desc limit 0,3',[]);
    executor.query('platform_vr',newListCommand,function(e,r)
    {
        var newGameListResult;
        if(e)
        {
            newGameListResult = new netData(code.game.getNewListError,{},e.stack);
        }
        else
        {
            newGameListResult = new netData(code.success,r,"获取新游戏列表成功！");
        }
        callback(newGameListResult);
    });
}

/**
 * 获取推荐列表
 * @param callback
 */
gameControl.getFeatureList = function(callback)
{
    var featureListCommand = new command("SELECT game.id,game.kvImage FROM game_feature " +
        "right join game on(game_feature.gameId = game.id) where game_feature.isValid = 1 order by game_feature.weight desc limit 0,5",[]);
    executor.query('platform_vr',featureListCommand,function(e,r)
    {
        var featureListResult;
        if(e)
        {
            featureListResult = new netData(code.game.getFeatureError,{},e.stack);
        }
        else
        {
            featureListResult = new netData(code.success,r,"获取推荐游戏列表成功！");
        }
        callback(featureListResult);
    });
}

/**
 * 获取游戏详情
 * @param gameId
 * @param callback
 */
gameControl.getGameDetail = function(gameId,callback)
{
    var getGameCommand = new command('SELECT * FROM game WHERE id = ?',[gameId]);
    executor.query('platform_vr',getGameCommand,function(e,r)
    {
        var detailResult;
        if(e)
        {
            detailResult = new netData(code.game.getGameDetaioError,{},e.stack);
        }
        else
        {
            if(r.length <= 0)
            {
                detailResult = new netData(code.game.getGameDetaioError,{},"没有查询的游戏详情");
            }
            else
            {
                var detail = r[0];
                var tags = detail['tag'];
                var language = detail['language'];
                var task1 = function(cb)
                {
                    var tagCommand = new command('SELECT * FROM tag WHERE id in (' + tags + ') AND isValid = 1',[]);
                    executor.query('platform_vr',tagCommand,cb);
                }

                var task2 = function(cb)
                {
                    var languageCommand = new command('SELECT * FROM language WHERE id in ('+ language +') AND isValid = 1',[language]);
                    executor.query('platform_vr',languageCommand,cb);
                }

                async.series([task1,task2],function(e1,r1)
                {
                    if(e1)
                    {
                        detailResult = new netData(code.game.getGameDetaioError,{},e1.stack);
                    }
                    else
                    {
                        var realTags = [];
                        var realLanguages = [];
                        for(var i = 0;i<r1[0].length;i++)
                        {
                            realTags.push(r1[0][i]['tag']);
                        }

                        for(var i = 0;i<r1[1].length;i++)
                        {
                            realLanguages.push(r1[1][i]['language']);
                        }
                        r[0].tag = realTags;
                        r[0].language = realLanguages;
                        detailResult = new netData(code.success,r,"获取游戏详情成功！");
                    }
                    callback(detailResult);
                })
            }
        }
    });
}


/**
 * 收藏游戏
 * @param gameId
 * @param callback
 */
gameControl.collection = function(gameId,token,callback)
{
    var api = "/collgame.html";
    var postParam =
    {
        url : domainConfig.userDomain + api,
        form :
        {
            gameId : gameId,
            token : token,
        },
    }

    request.post(postParam, function(err,httpResponse,body) {
        var collResult;
        if(err)
        {
            collResult = new netData(code.game.collGameError,{},err.stack);
        }
        else
        {
            var bodyObj = JSON.parse(body);
            if(bodyObj['res_code'] == 200)
            {
                collResult = new netData(code.success,{},"收藏游戏成功！");
            }
            else
            {
                collResult = new netData(code.game.collGameError,{},"收藏游戏失败!");
            }
        }
        callback(collResult);
    })
}


