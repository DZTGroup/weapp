// mod by aohajin
// utils
var Aohajin = Aohajin || {
    parseURI : function(url) {
        var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
        // authority = '//' + user + ':' + pass '@' + hostname + ':' port
        return (m ? {
            href     : m[0] || '',
            protocol : m[1] || '',
            authority: m[2] || '',
            host     : m[3] || '',
            hostname : m[4] || '',
            port     : m[5] || '',
            pathname : m[6] || '',
            search   : m[7] || '',
            hash     : m[8] || ''
        } : null);
    },

    absolutizeURI:function(base, href) {// RFC 3986

        var parseURI = Aohajin.parseURI
        function removeDotSegments(input) {
            var output = [];
            input.replace(/^(\.\.?(\/|$))+/, '')
                .replace(/\/(\.(\/|$))+/g, '/')
                .replace(/\/\.\.$/, '/../')
                .replace(/\/?[^\/]*/g, function (p) {
                    if (p === '/..') {
                        output.pop();
                    } else {
                        output.push(p);
                    }
                });
            return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
        }

        href = parseURI(href || '');
        base = parseURI(base || '');

        return !href || !base ? null : (href.protocol || base.protocol) +
            (href.protocol || href.authority ? href.authority : base.authority) +
            removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
            (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
            href.hash;
    }
}

// main

var FCAPP = FCAPP || {
    Common: {
        RUNTIME: {
            loadImg: {},
            records: 0
        },
        init: function () {
            FCAPP.Common.setInfo();
            FCAPP.Common.hotReport();
            FCAPP.Common.initElements();
        },
        initElements: function () {
            var R = FCAPP.Common.RUNTIME;
            R.popTips = $('#popTips');
            R.tipsTitle = $('#tipsTitle');
            R.tipsMsg = $('#tipsMsg');
            R.tipsOK = $('#tipsOK');
            R.tipsCancel = $('#tipsCancel');
            R.popMask = $('#popMask');
        },
        format: function (tpl, data) {
            for (var i in data) {
                var key = i,
                    val = data[i],
                    reg = new RegExp('\\\{' + key + '\\\}', 'g');
                val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                tpl = tpl.replace(reg, val);
                tpl = tpl.replace(/&lt;\/?br&gt;/gi, '<br>');
            }
            return tpl;
        },
        replaceAll: function (str, regexp, replacement) {
            var pattern = new RegExp(regexp, "gm");
            var tmp = str.replace(pattern, replacement);
            pattern = null;
            return tmp;
        },
        resizeLayout: function (floatTips) {
            var w = window.innerWidth,
                h = window.innerHeight;
            if (w > h) {
                floatTips.css('top', '20%');
            } else {
                floatTips.css('top', '30%');
            }
        },
        saveCookie: function (key, val, seconds) {
            var dt = new Date(),
                seconds = parseInt(seconds);
            seconds = isNaN(seconds) ? 180 : seconds;
            dt.setTime(dt.getTime() + seconds * 1000);
            document.cookie = [encodeURIComponent(key), '=', encodeURIComponent(val), '; expires=', dt.toGMTString(), '; domain=trade.qq.com; path=/fangchan/'].join('');
        },
        removeCookie: function (key) {
            document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 16:00:00 GMT; domain=trade.qq.com; path=/fangchan/';
        },
        getCookie: function (key) {
            var cookies = document.cookie.split('; ');
            try {
                key = decodeURIComponent(key);
            } catch (e) {}
            for (var i = 0, l = cookies.length; i < l; i++) {
                var parts = cookies[i].split('='),
                    val = '';
                if (parts.shift() === key) {
                    try {
                        val = decodeURIComponent(parts.shift());
                    } catch (e) {}
                    return val;
                }
            }
            return '';
        },
        showToolbar: function () {
            try {
                WeixinJSBridge.invoke('showToolbar');
            } catch (e) {
                setTimeout(FCAPP.Common.showToolbar, 30);
            }
        },
        hideToolbar: function () {
            try {
                WeixinJSBridge.invoke('hideToolbar');
            } catch (e) {
                setTimeout(FCAPP.Common.hideToolbar, 30);
            }
        },
        closeWindow: function () {
            try {
                WeixinJSBridge.invoke('closeWindow');
            } catch (e) {
                setTimeout(FCAPP.Common.closeWindow, 30);
            }
        },
        hideLoading: function () {
            var R = FCAPP.Common.RUNTIME;
            if (!R.loading) {
                R.loading = $('#popFail');
            }
            if (R.loading) {
                R.loading.hide();
            }
        },
        showLoading: function (boo) {
            var R = FCAPP.Common.RUNTIME;
            if (!R.loading) {
                R.loading = $('#popFail');
            }
            if (R.loading) {
                if (!boo) {
                    window.scrollTo(0, 0);
                }
                R.loading.show();
            }
        },
        loadImg: function (src, id, callback, force) {
            var R = FCAPP.Common.RUNTIME,
                loadImg = R.loadImg,
                chk = loadImg[id + src],
                img;
            if (!force && !! chk && (chk.loaded || chk.loading)) {
                return;
            }
            src = Aohajin.absolutizeURI("http://www.weixinfc.com/", src)
            loadImg[id + src] = {
                id: id,
                loading: true,
                loaded: false,
                dom: false
            };
            img = new Image();
            img.idx = id;
            if (callback && typeof (callback) == 'function') {
                img.cb = callback;
            }
            img.onload = img.onerror = img.onreadystatechange = function () {
                if ( !! this.readyState && this.readyState != 4) {
                    return;
                }
                var info = loadImg[this.idx + this.src],
                    oimg, bw = document.documentElement.clientWidth,
                    bh = document.documentElement.clientHeight;
                info.loaded = true;
                if ( !! info.dom) {
                    oimg = info.dom;
                } else {
                    oimg = document.getElementById(this.idx);
                    info.dom = oimg;
                }
                if (!oimg || !oimg.parentNode) {
                    return;
                }
                if ( !! this.cb) {
                    this.cb(this);
                    delete this.cb;
                } else {
                    this.width = bw;
                    this.height = bh;
                }
                oimg.parentNode.replaceChild(this, oimg);
                this.onload = null;
                delete this.onload;
            };
            img.src = src;
        },
        updateShareData: function (data) {
            var ph = location.pathname.split('/'),
                page = ph[ph.length - 1].split('.')[0];
            if (page == '') {
                page = 'index';
            }
            window.shareData = window.shareData || {};
            for (var i in data) {
                if (typeof (data[i]) == 'object') {
                    continue;
                }
                shareData[i] = data[i];
            }
            if (data[page]) {
                for (i in data[page]) {
                    shareData[i] = data[page][i];
                }
            }
            if (shareData.descKeep) {
                shareData.desc = shareData.descKeep;
            }
            if (shareData.linkKeep) {
                shareData.link = shareData.linkKeep;
            }
            if (window.gQuery && gQuery.qrcode && /^\w\d+$/i.test(gQuery.qrcode)) {
                shareData.qrcode = gQuery.qrcode;
            }
        },
        jumpTo: function (page, param, obj) {
            var arr = location.pathname.split('/'),
                hash = '',
                search = '';
            for (var i in param) {
                if (i.indexOf('#') == 0) {
                    hash = i + '=' + param[i];
                } else {
                    gQuery[i] = encodeURIComponent(param[i]);
                }
            }
            search = $.param(gQuery);
            if (obj && typeof (obj) != 'boolean') {
                obj.href = page + '?' + search + hash;
            } else {
                location.href = page + '?' + search + hash;
            }
        },
        jumpWithAuth: function (url, params) {
            var hash = '',
                search = '';
            if (params != null) {
                for (var i in params) {
                    if (i.indexOf('#') == 0) {
                        hash = i + '=' + params[i];
                    } else {
                        gQuery[i] = params[i];
                    }
                }
            }
            search = $.param(gQuery);
            location.href = "http://cgi.trade.qq.com/cgi-bin/common/wx_redirect.fcg?appid=" + gQuery.appid + "&url=" + encodeURIComponent(url + "?" + search + hash);
        },
        setInfo: function () {
            var search = location.search ? location.search.substr(1) : '',
                hash = location.hash ? location.hash.substr(1) : '';
            window.gQuery = window.gHash = {};
            if (search) {
                window.gQuery = this.split(search);
            }
            if (hash) {
                window.gHash = this.split(hash);
            }
        },
        split: function (str) {
            var arr = str.split('&'),
                obj = {};
            if (arr.length < 1) {
                return obj;
            }
            for (var i = 0, il = arr.length; i < il; i++) {
                var pair = arr[i].split('=');
                if (pair.length == 2 && pair[0].length) {
                    try {
                        obj[pair[0]] = decodeURIComponent(pair[1]);
                    } catch (e) {}
                }
            }
            return obj;
        },
        escapeHTML: function (str) {
            if (typeof (str) == 'string' || str instanceof String) {
                str = str.toString().replace(/<+/gi, '&lt;').replace(/>+/gi, '&gt;');
                str = str.replace(/&lt;strong&gt;/gi, '<strong>').replace(/&lt;\/strong&gt;/gi, '</strong>');
                str = str.replace(/&lt;br&gt;/gi, '<br/>').replace(/&lt;\/br&gt;/gi, '<br/>');
                if ((str.indexOf('电话') != -1 || str.indexOf('致电') != -1) && /[\d\-]{8,11}/.test(str)) {
                    str = str.replace(/(\d[\d\-]+\d)/g, '<a style="color:#74a3a5" href="tel:$1">$1</a>');
                }
                return str;
            } else {
                return str;
            }
        },
        timer: function (seconds, id) {
            var totalSeconds = seconds,
                oneday = 3600 * 24,
                day = 0,
                hour = 0,
                min = 0,
                sec = 0,
                str = '',
                $con = $('#' + id),
                interval = setInterval(function () {
                    totalSeconds--;
                    if (totalSeconds > 0) {
                        day = Math.floor(totalSeconds / oneday);
                        hour = Math.floor((totalSeconds % oneday) / 3600);
                        min = Math.floor((totalSeconds % 3600) / 60);
                        sec = totalSeconds % 60;
                        day = day < 10 ? '0' + day : day;
                        hour = hour < 10 ? '0' + hour : hour;
                        min = min < 10 ? '0' + min : min;
                        sec = sec < 10 ? '0' + sec : sec;
                        str = '<p><em>' + day + '</em>天<em>' + hour + '</em>小时<em>' + min + '</em>分<em>' + sec + '</em>秒</p>';
                        $con.html(str);
                    } else {
                        clearInterval(interval);
                    }
                }, 1000);
        },
        addData2URL: function (url, data) {
            var param = $.param(data);
            url += url.indexOf('?') != -1 ? '&' + param : '?' + param;
            return url;
        },
        hotReport: function () {
            var fcount = 0;
            setTimeout(function () {
                if (typeof (pgvMain) == 'function') {
                    var data = [];
                    if (window.gQuery && gQuery.id) {
                        data.push(gQuery.id);
                    } else {
                        data.push('BGY');
                    }
                    pgvMain({
                        virtualURL: '/' + data.join('/') + location.pathname
                    });
                } else {
                    fcount++;
                    if (fcount > 5) {
                        return;
                    }
                    setTimeout(FCAPP.Common.hotReport, 1000);
                }
            }, 1000);
        },
        escTpl: function (str) {
            str = str.replace(/<%\s*=\s*([\w+\[\.\]]+)%>/gmi, "<%=FCAPP.Common.escapeHTML($1)%>");
            return str;
        },
        loadShareData: function (id) {
            var dt = new Date();
            id = (id + '').replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
            $.ajax({
                //url: 'http://trade.qq.com/fangchan/static/' + (id.length ? id + '.' : '') + '../js/sharedata.js?' + dt.getMonth() + dt.getDate(),           /* todo 数据文件 更改URL */
				url: '../js/sharedata.js?',
                dataType: 'jsonp'
            });
        },
        msg: function (boo, obj) {
            var R = FCAPP.Common.RUNTIME,
                title = '温馨提示',
                msg = '';
            if (!boo) {
                R.popTips.hide();
                if (R.popMask.length) {
                    R.popMask.hide();
                }
                return;
            }
            if (!R.popTips.length || !obj.msg) {
                return;
            }
            if (obj.title) {
                title = FCAPP.Common.escapeHTML(obj.title);
            }
            R.tipsTitle.html(title);
            msg = FCAPP.Common.escapeHTML(obj.msg);
            R.tipsMsg.html(msg);
            var that = arguments.callee;
            that.okFunc = null, that.noFunc = null;
            if (obj.ok && typeof (obj.ok) == 'function') {
                that.okFunc = obj.ok;
                R.tipsOK.one('click', function () {
                    if (that.okFunc) {
                        that.okFunc.apply(null, obj.okParams || []);
                    }
                    R.popTips.hide();
                    if (R.popMask.length) {
                        R.popMask.hide();
                    }
                });
            } else {
                R.tipsOK.one('click', function () {
                    R.popTips.hide();
                    if (R.popMask.length) {
                        R.popMask.hide();
                    }
                });
            }
            if (obj.no && typeof (obj.no) == 'function') {
                R.tipsCancel.show();
                that.noFunc = obj.no;
                R.tipsCancel.one('click', function () {
                    if (that.noFunc) {
                        that.noFunc.apply(null, obj.noParams || []);
                    }
                    R.popTips.hide();
                    if (R.popMask.length) {
                        R.popMask.hide();
                    }
                });
            } else {
                R.tipsCancel.hide();
                R.tipsCancel.one('click', function () {
                    R.popTips.hide();
                    if (R.popMask.length) {
                        R.popMask.hide();
                    }
                });
            }
            var div = $('#randDivForMask');
            if (div.length) {
                div.html(div.html() == '' ? '<br>&nbsp;' : '');
            } else {
                div = document.createElement("div");
                div.id = "randDivForMask";
                div.innerHTML = "<br/>&nbsp;";
                document.body.appendChild(div);
            }
            FCAPP.Common.hideLoading();
            if (!obj.noscroll) {
                window.scrollTo(0, 0);
            }
            if (R.popMask.length) {
                R.popMask.show();
            }
            setTimeout(function () {
                R.popTips.show();
            }, 30);
        }
    }
};
window.updateShareData = FCAPP.Common.updateShareData;
$(document).ready(FCAPP.Common.init);