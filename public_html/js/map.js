var FCAPP = FCAPP || {};
FCAPP.MAP = {
    CONFIG: {
        opts: {
            gpsCount: 0,
            maxGPSCount: 5
        },
        geoOptions: {
            maximumAge: 60000,
            timeout: 10000,
            enableHighAccuracy: false
        }
    },
    RUNTIME: {},
    init: function () {
        var R = MAP.RUNTIME;
        MAP.initElements();
        MAP.initEvent();
        var id = '';
        if (window.gQuery) {
            if (gQuery.id) {
                id = gQuery.id;
            }
            if (gQuery.noClose) {
                R.btnClose.hide();
            }
            if (gQuery.noLoc) {
                R.myplaceBtn.hide();
            }
        }
        if (window.gQuery && gQuery.lng && gQuery.lat && gQuery.addr) {
            try {
                gQuery.addr = decodeURIComponent(gQuery.addr);
            } catch (e) {}
            gQuery.addr = gQuery.addr.replace(/[<>\'\"]+/gi, '');
            if (gQuery.title) {
                gQuery.title = gQuery.title.replace(/[<>\'\"]+/gi, '');
            }
            R.content = {
                title: gQuery.title || '',
                addr: gQuery.addr
            };
            MAP.initMap({
                latlng: {
                    lng: gQuery.lng,
                    lat: gQuery.lat
                }
            })
        } else {
            MAP.loadMapData();
            //FCAPP.Common.loadShareData(id);
        }
        FCAPP.Common.hideToolbar();
    },
    initElements: function () {
        var R = MAP.RUNTIME;
        if (!R.myplaceBtn) {
            R.myplaceBtn = $('#myplaceBtn');
            R.btnClose = $('#btnClose');
            R.mapDiv = $('#mapdiv');
            R.confirmPlay = $('#confirmPlay');
            R.popTips = $('#popTips');
            R.isIOS = /i(Phone|Pad|Pod)/i.test(navigator.userAgent);
        }
    },
    initEvent: function () {
        var R = MAP.RUNTIME;
        R.myplaceBtn.bind('click', MAP.getGeoLocation);
        R.btnClose.bind('click', function () {
            FCAPP.Common.jumpTo('intro.html', {
                '#wechat_webview_type': 1
            }, true);
            if (!/Mac OS/i.test(navigator.userAgent)) {
                WeixinJSBridge.invoke('closeWindow');
            }
        });
        $(window).resize(MAP.resizeLayout);
    },
    resizeLayout: function () {
        var R = MAP.RUNTIME,
            w = document.documentElement.clientWidth,
            h = document.documentElement.clientHeight;
        R.mapDiv.css({
            width: w + 'px',
            height: h + 'px'
        });
        FCAPP.Common.resizeLayout(R.popTips);
    },
    getGeoLocation: function (res) {
        var R = MAP.RUNTIME,
            C = MAP.CONFIG,
            btn = R.myplaceBtn,
            cls = btn.attr("state");
        if (cls.indexOf('btn_on') != -1) {
            if (R.supportGPS) {
                navigator.geolocation.getCurrentPosition(MAP.getGeoLocation, MAP.getGeoLocation, C.geoOptions);
                btn.attr('state', '');
            } else {
                if (C.opts.gpsCount < C.opts.maxGPSCount) {
                    C.opts.gpsCount++;
                    setTimeout(arguments.callee, C.geoOptions.timeout);
                    return;
                }
                R.confirmPlay.one('click', function () {
                    R.popTips.hide();
                });
                R.popTips.show();
            }
            return;
        }
        if (res.coords) {
            R.lastGPS = res.coords;
            var latlng = new soso.maps.LatLng(res.coords.latitude, res.coords.longitude);
            R.map.setCenter(latlng);
            R.start_marker && R.start_marker.setMap(null);
            if (R.myloc_marker) {
                R.myloc_marker.setPosition(latlng);
            } else {
                R.myloc_marker = new soso.maps.Marker({
                    map: R.map,
                    icon: new soso.maps.MarkerImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKUUExURczn/5uw2Tar/yx+5Xq191p6vkC1/TZoyU2//Taw/+np6unp6TRoyay93+rs8Gec7F+7/Onr8HuIpEmo+5vU/Viz+6GsxES7/kC9/ix330G//tHa7C1fzWeIyUGi+kh71EOk+2HB/X2Wy0G4/UC7/qHQ/a7Z/Dy1/bHn/z+y/SuF+zKY+4eRqt7e3jah/Pv7+0Cp/DiB6m3N/WHE/Vd6wyVg3GSf7svs/8/u/2PD/k+8/TaX+4XR/jOT+sfl/1G7/bfG46vW/p/f/1fF/rPC4j1nu0vE/zVkyEu1/bO4wWab6k2j+Ee2/Tq4/lmv+zFsyqXl/023/Dek/E+Z9KLX/S2I+1t1tNHp/y+q/1Gg6nXN/nTI/FrC/YmTpqq20ZejvJyirfDz+uf1/0VyxUq9/Ze96km7/kS+/kl4zc/Q0U+K21CU5YObzq250UVovkRovUW5/XPI/G2Cq3PI/Vl5vn2Joy953y+o/6u83tHa7aa43Tm6/kmq/GG4/Cxz6FqO4zis/aLT/XTF/D9swmfO/zKX+zxpwj6g+zmh/HPW/12Y6ZzT/DSi+0qx+5vY/22Bqi598Va//cbHy0rA/u72/8/Z7afi/6Hh/07F/p/Y/tTv/4jN/4zJ/PHx8UbE/nHI/ZPf/2Ch7/r+/09wtqartmeHyjax/vD9/y9w4Uy//d/f3zmu/VzD/XTB/JLY/2O6/q/b/lF8xilx7dLu/zab+0uP6mWAuzyt/XjU/jZuz1dyrWe7+1Buqz572/j4+EFzyEa//yp08VW0/Fmb5vn5+bDY+za1/iVr7niGoiNl53e/+6W33USo/LG+1orC8y1+5UC2/Wm9/IbW/tDa7Zbc/k64/pmfq0txwo3O/FmR6TRq0P///zljUloAAADcdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCsvl83AAABPElEQVR42mK4DQJTTzMyVlWCmQABxADEl2X3Zx3O3suzVBrIAQggoADvxtSjfetsLnobulfcvg0QQAy3HZLPLV9k4XQpyrJmgszZ2wABxJBoEjktacrmK0YxHgbWB6/zAQQQg4u/zwLzWRo7nNM0g7S1TMUAAoghR5KzZXpAp9sB5dU9raEntwEEEAMrc4Tv5BnzpFTUG/S22B7PAwgghpLz5cuOVUuki7Nt72iX25QPEEAMSmVMFwpSVnJYBfYqCB+qCwMIIIa4nWeu2k9cY6woIOq3u3aFDkAAMQgu3rp+fnF0YdPaU3NuBLtOAggghtu5zQtnzwwR6W5U28ByK3YuQAABnR7f1qVqxxDO4GjGXrpKHyCAQJ7z3JVR78V/U37PNd19twECCCRwm2uJUFH/iYRM7iO3bwMEGABes3syPHtuNQAAAABJRU5ErkJggg==', new soso.maps.Size(16, 16)),
                    zIndex: 399,
                    position: latlng
                });
            }
            btn.attr('state', 'btn_on');
        }
    },
    getInfoOverlay: function (opts) {
        var R = MAP.RUNTIME,
            Label = function () {
                soso.maps.Overlay.call(this, opts);
            }, content = ['<div class="info" style="{wid}"><h4>', FCAPP.Common.escapeHTML(R.content.title), '</h4><p title="', FCAPP.Common.escapeHTML(R.content.addr), '">', FCAPP.Common.escapeHTML(R.content.addr), '</p></div>'].join('');
        if (R.isIOS) {
            content = content.replace(/\{wid\}/g, "");
            if (!gQuery || !gQuery.noLoc) {
                R.myplaceBtn.show();
            }
        } else {
            content = content.replace(/\{wid\}/g, "width:250px");
        }
        Label.prototype = new soso.maps.Overlay();
        Label.prototype.construct = function () {
            this.dom = document.createElement('div');
            this.dom.className = 'map_info';
            this.dom.innerHTML = content;
            if (R.isIOS) {
                var a = document.createElement("a");
                a.className = "btn_map_road";
                a.innerHTML = "<span>路线</span>";
                this.dom.appendChild(a);
                soso.maps.Event.addDomListener(a, 'touchend', MAP.getRoute);
            }
            this.getPanes().overlayLayer.appendChild(this.dom);
        };
        Label.prototype.draw = function () {
            var position = this.get('position');
            if (position) {
                var pixel = this.getProjection().fromLatLngToDivPixel(position);
                this.dom.style.left = pixel.getX() + 10 + 'px';
                this.dom.style.top = pixel.getY() - 88 + 'px';
            }
        };
        Label.prototype.destroy = function () {
            this.dom.parentNode.removeChild(this.dom);
        };
        var label = new Label({
            map: R.map,
            position: opts.position
        });
        label.setMap(R.map);
    },
    getZoomControl: function () {
        var R = MAP.RUNTIME;
        R.ZoomControl = new soso.maps.Control({
            content: '',
            align: soso.maps.ALIGN.BOTTOM_RIGHT,
            map: R.map
        });
        var div = document.createElement("div"),
            zoomIn = document.createElement("div"),
            zoomOut = document.createElement("div");
        div.style.cssText = "margin-bottom:1.5em;margin-right:0.8em;background:transparent;"
        zoomIn.style.cssText = "width:36px;height:36px;text-indent:-999em;border-radius:18px;margin-bottom:0.5em;box-shadow:0 2px 3px rgba(88,88,88,0.25);background:rgba(236,236,236,0.85) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAgCAMAAACcqC7MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9QTFRFZ2h9g4SVZGV6XV51aGl+b3CEZmd8dneKbm+DY2R6Zmd9ZGV7ZWZ7XF10gYGThYaW8/P1oqOwbG2BaGl96OjrXl91YmN5e3yOl5imVVZuYGF3dHWIZmZ7aWp/Y2V7WltyZWZ8Xl92dHWJjo+ecHGFa2yAaWp+Z2h+gIGSYWJ5cXKGY2R7qaq2ysrSYGF4YWJ429vgXV50np6s2dnf////Kc8bKgAAADV0Uk5T/////////////////////////////////////////////////////////////////////wB8tdAKAAAAtUlEQVR42uzVxw7CMAwGYBOS0kLL3nt1sOf7PxspBimHRBycCoT63yxbnyIlVuBuIZAFchVClKiIABkqMreBlG0gkCP/ibhgyAqn2v1qQZNkryILExLi1M3Ttycq0jUhr12sD7i+ryInn2Eqz5bzrpiLU+cjfEaasyImSDvc62B1CWo4dRjrThK3mHkBN9Qr3klkSEWYRHwq4uS7kw0yTR8sFVkD5xEVaWyXo95P/MXfQx4CDAAZJXXiOuSxhQAAAABJRU5ErkJggg==) no-repeat left center;";
        zoomOut.style.cssText = "width:36px;height:36px;text-indent:-999em;border-radius:18px;box-shadow:0 2px 2px rgba(88,88,88,0.25);background:rgba(236,236,236,0.85) url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAgCAMAAACcqC7MAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9QTFRFZ2h9g4SVZGV6XV51aGl+b3CEZmd8dneKbm+DY2R6Zmd9ZGV7ZWZ7XF10gYGThYaW8/P1oqOwbG2BaGl96OjrXl91YmN5e3yOl5imVVZuYGF3dHWIZmZ7aWp/Y2V7WltyZWZ8Xl92dHWJjo+ecHGFa2yAaWp+Z2h+gIGSYWJ5cXKGY2R7qaq2ysrSYGF4YWJ429vgXV50np6s2dnf////Kc8bKgAAADV0Uk5T/////////////////////////////////////////////////////////////////////wB8tdAKAAAAtUlEQVR42uzVxw7CMAwGYBOS0kLL3nt1sOf7PxspBimHRBycCoT63yxbnyIlVuBuIZAFchVClKiIABkqMreBlG0gkCP/ibhgyAqn2v1qQZNkryILExLi1M3Ttycq0jUhr12sD7i+ryInn2Eqz5bzrpiLU+cjfEaasyImSDvc62B1CWo4dRjrThK3mHkBN9Qr3klkSEWYRHwq4uS7kw0yTR8sFVkD5xEVaWyXo95P/MXfQx4CDAAZJXXiOuSxhQAAAABJRU5ErkJggg==) no-repeat right center;";
        div.appendChild(zoomIn);
        div.appendChild(zoomOut);
        R.ZoomControl.setContent(div);
        soso.maps.Event.addDomListener(zoomIn, 'click', function () {
            var zoom = R.map.getZoomLevel();
            if (zoom < 18) {
                R.map.zoomTo(zoom + 1);
            }
        });
        soso.maps.Event.addDomListener(zoomOut, 'click', function () {
            var zoom = R.map.getZoomLevel();
            if (zoom > 1) {
                R.map.zoomTo(zoom - 1);
            }
        });
    },
    getRoute: function (res) {
        var R = MAP.RUNTIME,
            C = MAP.CONFIG;
        if (res && res.coords) {
            R.lastGPS = res.coords;
            R.start_marker && R.start_marker.setVisible(false);
            var latlng = new soso.maps.LatLng(res.coords.latitude, res.coords.longitude);
            MAP.calcRoute(latlng);
        } else {
            if (R.supportGPS) {
                navigator.geolocation.getCurrentPosition(MAP.getRoute, MAP.getRoute, C.geoOptions);
            } else {
                if (R.lastGPS) {
                    MAP.getRoute({
                        coords: R.lastGPS
                    });
                    return;
                }
                $('#confirmPlay').one('click', function () {
                    $('#popTips').hide();
                });
                $('#popTips').show();
            }
        }
    },
    calcRoute: function (nowLatLng) {
        var R = MAP.RUNTIME,
            C = MAP.CONFIG,
            request = {
                region: R.region,
                start: nowLatLng,
                end: new soso.maps.LatLng(C.opts.latlng.lat, C.opts.latlng.lng),
                policy: soso.maps.DirectionsPolicy.REAL_TRAFFIC
            };
        R.route_steps = [];
        R.directionsService.route(request, function (response, status) {
            if (status == soso.maps.DirectionsStatus.OK) {
                var R = MAP.RUNTIME,
                    routes_desc = [],
                    start = response.start,
                    end = response.end,
                    anchor = new soso.maps.Point(6, 6),
                    size = new soso.maps.Size(24, 36),
                    start_icon = new soso.maps.MarkerImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAkCAYAAAB2UT9CAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABh0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzT7MfTgAABBF0RVh0WE1MOmNvbS5hZG9iZS54bXAAPD94cGFja2V0IGJlZ2luPSIgICAiIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNC4xLWMwMzQgNDYuMjcyOTc2LCBTYXQgSmFuIDI3IDIwMDcgMjI6Mzc6MzcgICAgICAgICI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnhhcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx4YXA6Q3JlYXRvclRvb2w+QWRvYmUgRmlyZXdvcmtzIENTMzwveGFwOkNyZWF0b3JUb29sPgogICAgICAgICA8eGFwOkNyZWF0ZURhdGU+MjAxMC0wOS0yMFQxMDoxNjoyOFo8L3hhcDpDcmVhdGVEYXRlPgogICAgICAgICA8eGFwOk1vZGlmeURhdGU+MjAxMC0wOS0yNlQwOTowMjoxNVo8L3hhcDpNb2RpZnlEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIj4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg5TnlvQAAABZ0RVh0Q3JlYXRpb24gVGltZQAwOS8yMC8xMOiewJIAAApRSURBVGiB1Zt7cFTVHce/Z3ezISKiiekEVBTFR9VYXxMtw7QotkVFOwVFixWVAVqCEouVYQpBCwGfo3ZxUEgkkQ4SGVMHeSiSUsQQgxOCokCEhCSQhCS7eWwe7OOe3zn949672d3cu9kkm5D+Zn5z7vn9fudzzj2/e+5r77LMZgcM5HoAswD8BsA4AJcZBQE4DaAOwB4A/1qZ+FxFj4i8fTHj4+nJPfir/2vYrl/8ZfdgyPlsufOd4LoVwFIAKwDYTaBmQgA+APDCqkszOnWj3Lg35nw2594Af9V/QmJiws+cgiHjW4QQ0HS8EKJYCJElhLAH2aNVqxBivhCieFnT2+P0DiQJXcdLEsWSRJYkYQ+yR6tWSWK+JFEssgsDfBIBHU8CxSSQRQL2IHu0aiWB+SRQ/PIeDBnfQoJAgpJJ0JckKE2rD0RTSdCOpQ1vjlb3gACiZBB9CaI0rT4QTQXRDvH+7tFBE5RMAl+SQFo/JiZcU0lgR+ZuDAnfJgQBwDsAJvRxSUWSVACvAEiXXAwqnwj/13y2+PTqVABHYgjXhQBc+2rBLRcOJn/5NdMGlQ9gUPk2Ij6rt8h3rloBAHi+emVfOrACeExyGh0pyP633wMA/G9uM6z3xucEU/5NKcCcuyNDNpYARxvM+cDg8m2caKpZ43ev+UdIXU9EuDxb+ZIZYqrk3HQH4pfOAAD4Xi3o4dMTYebX+WYJuHlM75MDqDHZxcCPZ435MElArPg2In69WeMFJ5YBAN67bnVIXRfdTsTNENdLxXgFjMicCQDwrtoa2NbFu2prSIxU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', size, anchor);
                R.start_marker && R.start_marker.setMap(null);
                MAP.clearOverlay(R.route_lines);
                R.start_marker = new soso.maps.Marker({
                    icon: start_icon,
                    position: start.latLng,
                    map: R.map,
                    zIndex: 1
                });
                R.directions_routes = response.routes;
                for (var i = 0; i < R.directions_routes.length; i++) {
                    var route = R.directions_routes[i],
                        legs = route.legs;
                    for (var j = 0; j < legs.length; j++) {
                        var leg = legs[j],
                            steps = leg.steps;
                        R.route_steps = steps;
                        polyline = new soso.maps.Polyline({
                            path: leg.path,
                            strokeColor: '#3893F9',
                            strokeWeight: 6,
                            map: R.map
                        });
                        R.route_lines.push(polyline);
                    }
                }
                R.map.fitBounds(route.bounds);
            }
        });
    },
    clearOverlay: function (overlays) {
        var overlay;
        while (overlay = overlays.pop()) {
            overlay.setMap(null);
        }
    },
    checkGPS: function (res) {
        var R = MAP.RUNTIME;
        if (!res) {
            if ('geolocation' in navigator) {
                R.supportGPS = 0;
                navigator.geolocation.getCurrentPosition(MAP.checkGPS, MAP.checkGPS);
            } else {
                R.supportGPS = false;
            }
        } else {
            if (res && 'coords' in res) {
                R.lastGPS = res.coords;
                R.supportGPS = true;
            } else {
                if (MAP.opts.gpsCount < C.opts.maxGPSCount) {
                    setTimeout(MAP.checkGPS, C.geoOptions.timeout);
                }
                MAP.opts.gpsCount++;
            }
        }
    },
    loadMapData: function () {
        window.renderData = MAP.renderData;
        var eid = window.gQuery && gQuery.eid ? gQuery.eid : 'default',
            dt = new Date();
        eid = eid.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');

        var pathParameter = window.gQuery && gQuery.openid && gQuery.openid == 0 ? 'test':'wechat';
        // mod by aohajin
        var path = '/weapp/public_html/data/'+eid+'/'+pathParameter+'/geo.js?';
        $.ajax({
            url: path + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });
        /*
        var datafile = window.gQuery && gQuery.id ? gQuery.id + '.' : '',
            dt = new Date();
        datafile = datafile.replace(/[<>\'\"\/\\&#\?\s\r\n]+/gi, '');
        datafile += 'geo.js?'
        $.ajax({
		  url: datafile + dt.getDate() + dt.getHours(),
            dataType: 'jsonp'
        });
        */
    },
    renderData: function (data) {
        var R = MAP.RUNTIME;
        for (var i in data) {
            R[i] = data[i];
        }
        MAP.initMap(data);
        R.btnClose.show();
    },
    initMap: function (data) {
        var R = MAP.RUNTIME,
            C = MAP.CONFIG,
            container = R.mapDiv,
            h = document.documentElement.clientHeight,
            w = document.documentElement.clientWidth,
            latlng = new soso.maps.LatLng(data.latlng.lat, data.latlng.lng);
        C.opts.latlng = data.latlng;
        container.css({
            height: h + 'px',
            width: w + 'px'
        });
        R.directionsService = new soso.maps.DirectionsService();
        R.route_lines = [];
        R.map = new soso.maps.Map(container[0], {
            center: latlng,
            zoom: 18
        });
        var makerImg = new soso.maps.MarkerImage('data:image/png;base64,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', new soso.maps.Size(16, 32), new soso.maps.Point(8, 30));
        var marker = new soso.maps.Marker({
            position: latlng,
            map: R.map,
            icon: makerImg
        });
        MAP.getInfoOverlay({
            position: latlng,
            visible: true
        });
        MAP.getZoomControl();
        FCAPP.Common.hideLoading();
        MAP.checkGPS();
    }
};
var MAP = FCAPP.MAP;
$(document).ready(MAP.init);
var FCAPP = FCAPP || {};