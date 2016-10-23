/**
 * Created by 1 on 2016/10/12.
 */
var express = require('express');
var router = express.Router();
var utilNext = require("../z_util/utilNext");
var gameControl = require("../z_controls/gameControl");

/**
 * 首页游戏列表
 */
router.get('/gameList',function(req,res,next)
{
    var page = req.query.page;
    gameControl.getGameList(page,function(gameResult)
    {
        utilNext.utilSend(gameResult,res,next);
    });
});

/**
 * 新游戏
 */
router.get('/newGameList',function(req,res,next)
{
    gameControl.getNewGameList(function(gameResult)
    {
        utilNext.utilSend(gameResult,res,next);
    });
});

/**
 * 推荐游戏
 */
router.get('/featureGames',function(req,res,next)
{
    gameControl.getFeatureList(function(featureResult)
    {
        utilNext.utilSend(featureResult,res,next);
    });
});

router.get('/gameDetail',function(req,res,next)
{
    var gameId = req.query['gameId'];
    gameControl.getGameDetail(gameId,function(featureResult)
    {
        utilNext.utilSend(featureResult,res,next);
    });
});

router.post('/collection',function(req,res,next)
{
    var token = req.body['token'];
    var gameId = req.body['gameId'];
    gameControl.collection(gameId,token,function(collectionResult)
    {
        utilNext.utilSend(collectionResult,res,next);
    });
});
module.exports = router;