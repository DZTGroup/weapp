var $ = require("jquery"),
    AhjTools = require("ahj-tools")
$.getJSON("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx05940045fd60e0f1&secret=fff287f1c1a4e9bb2cf20cdb2e0a5b85",
function(json){
    token = json.access_token
    console.log(token)
    $.getJSON("https://api.weixin.qq.com/cgi-bin/menu/get?access_token="+token, function(menu){
        console.log(AhjTools.DumpObjectIndented(menu));
    })
})
