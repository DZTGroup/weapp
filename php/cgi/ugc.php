<?php

//@Begin-获取参数
$Cmd = $_GET["cmd"];					//update/add/query
$CallBack = $_GET["callback"];
//@End-获取参数

/*
 * {"msg":"ok","ret":0,"user":{"content":"媲美三亚","count":"12641","id":-1}}
 *
 * {"sum":49713,"top":
[{"content":"度假冠军","count":"14410","id":1},
{"content":"媲美三亚","count":"12641","id":2},
{"content":"港深都会","count":"8560","id":3},
{"content":"城熟配套","count":"6033","id":4},
{"content":"铂金物管","count":"5025","id":5},
{"content":"常住首选","count":"3044","id":6}
]}
 */

?>

reviewResult(
{"msg":"ok","ret":0,"sum":49713,"top":
[{"content":"度假冠军","count":"14410","id":1},
{"content":"媲美三亚","count":"12641","id":2},
{"content":"港深都会","count":"8560","id":3},
{"content":"城熟配套","count":"6033","id":4},
{"content":"铂金物管","count":"5025","id":5},
{"content":"常住首选","count":"3044","id":6}
],
"user":{"content":"媲美三亚","count":"12641","id":-1}}