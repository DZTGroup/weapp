var $ = require("jquery"),
    AhjTools = require("ahj-tools")
$.getJSON("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx05940045fd60e0f1&secret=fff287f1c1a4e9bb2cf20cdb2e0a5b85",
    function(json){
        token = json.access_token
        console.log(token)

        // menu getting
        
         /*$.getJSON("https://api.weixin.qq.com/cgi-bin/menu/get?access_token="+token, function(menu){
         console.log(AhjTools.DumpObjectIndented(menu));
         })*/

        // menu updating
        $.post("https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token,
            JSON.stringify({
                "button" : [
                    {
                        "name" : "楼盘详情",
                        "sub_button" : [
                            {
                                "name" : "楼盘简介",
                                "type" : "view",
                                "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=intro"
                            },
                            {
                                "name" : "十里画册",
                                "type" : "view",
                                "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=picture"
                            },
                            {
                                "name" : "360全景户型",
                                "type" : "view",
                                "url" : "http://112.124.55.78/weixinfc/test/houseview.html"
                            },
                            {
                                "name" : "楼盘印象",
                                "type" : "view",
                                "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=impression"
                            }
                        ]
                    },
                    {
                        "name" : "楼盘实景",
                        "type" : "view",
                        "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=userpicwall"
                    },
                    {
                        "name" : "会员服务",
                        "sub_button" : [
                            {
                                "name" : "论坛",
                                "type" : "view",
                                "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=bbs"
                            },
                            {
                                "name" : "狮子湖",
                                "type" : "view",
                                "url" : "http://112.124.55.78/loupan/yt-list.html?id=10007"
                            },
                            {
                                "name" : "看房团",
                                "type" : "view",
                                "url" : "http://www.weixinfc.com/weapp/php/cgi/jump.php?eid=32&appid=wx05940045fd60e0f1&t=group"
                            },
                            {
                                "name" : "我的认筹",
                                "type" : "view",
                                "url" : "http://112.124.55.78/loupan/my_renchou.html"
                            },
                            {
                                "name" : "一元享折上折",
                                "type" : "view",
                                "url" : "http://112.124.55.78/weixinfc/pay_index.php"
                            }
                        ]
                    }
                ]
            }), function(rt){
                console.log(rt)
            })
    })
