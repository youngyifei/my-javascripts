var pageHandler = function (div$, pageNo, pageCount, callBack) {
    var _div$ = div$;
    var _pageNo = pageNo;
    var _pageCount = pageCount;
    var _callBack = callBack;
    var pageBuild = function () {
        var start = null;
        var end = null;
        if (_pageNo < 5) {
            start = 1;
        } else {
            start = _pageNo - 4;
        }
        end = _pageNo - 0 + 4;
        if (end > _pageCount) {
            end = _pageCount;
        }
        var li$ = '';
        if (_pageNo > 1) {
            li$ += '<li class="myli" value="' + (_pageNo - 1) + '"><a href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        } else {
            li$ += '<li class="current" value="' + _pageNo + '"><a href="javascript:void(0)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        for (var i = start; i <= end; i++) {
            if (i == _pageNo) {
                li$ += '<li class="current" value="' + i + '"><a href="javascript:void(0)">' + i + '</a></li>';
            } else {
                li$ += '<li class="myli" value="' + i + '"><a href="javascript:void(0)">' + i + '</a></li>';
            }
        }
        if (_pageNo < _pageCount) {
            li$ += '<li class="myli" value="' + (_pageNo - 0 + 1) + '"><a href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        } else {
            li$ += '<li class="current" value="' + _pageNo + '"><a href="javascript:void(0)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        }

        var nav$ = '<nav><ul class="pagination" style="margin-top:0px;margin-bottom:0px;" >' + li$ + '</ul></nav>';
        _div$.html('');
        if (_pageCount > 0) {
            _div$.append(nav$);
        } else {
            _div$.append('<h1>暂无数据</h1>');
        }
        $('.myli').off('click').on('click', function () {
            _pageNo = $(this).attr('value');
            if (_callBack != undefined) {
                _callBack($(this).attr('value'));
            }
            pageBuild();
        });
    }
    return {
        init: function (div$, pageNo, pageCount, callBack) {
            _div$ = div$;
            _pageNo = pageNo;
            _pageCount = pageCount;
            _callBack = callBack;
            pageBuild();
        }
    }
};
////options参数说明
//var options = {
//    div$: $(),//内容容器
//    page$:$(),//页码容器
//    pageSize:10,
//    pageCurrent: 1,//起始页码
//    template: "<a>{{Id}}</a><a>{{hehe}}</a>", //不能为空
//    templateDataRender:[
//       {
//           name: "Id",
//           render: function (row, name) {
//               return "你是SB";
//           }//渲染方法,不必每个都填。不填则默认value填充
//       },
//       {
//           name: "hehe",
//           render: function (row, name) {
//               return "你是233";
//           }//渲染方法,不必每个都填。不填则默认value填充
//       }
//    ],
//    url: "",//返回的参数参考ajaxF，该参数与ajaxF必须有一个必填
//    ajax:"get",//||"post"
//    ajaxData: {},//与url参数是一起的
//    ajaxF: function (deferred,pageCurrent) {//不提倡。会自动执行该方法，并需要给json赋值，再把deferred对象提交（deferred.resolve(json)）。方会执行下一步
//        $.ajax({
//            url: "", data: [], success: function (data) {
//                var json = { //通过这个获取值
//                    total: 1,//总数
//                    list: [],//data
//                    pageCurrent: 1//页码
//                }
//                //获取到数据后
//                deferred.resolve(json);
//            }, fail: function (data) {
//                deferred.reject(data.msg);
//            }
//        })
//      return deferred.promise();
//    }//if(ajaxF）不为空则用这个方法获取渲染界面的Data
//}
var PageTemplateHandler = function (options) {
    var defaluts = {
        pageSize: 10,
        pageCurrent: 1,
        ajax:"get"
    }
    var _regex = /\{\{([0-9a-zA-Z\_]+)\}\}/g;
    var _templateStr = '';
    var _renderConfig = {};
    var _page = null;
    var format = function (str, json) {
        return str.replace(_regex, function (a, b) {
            return _renderConfig[b](json, b);
        });
    }
    var renderDefaluts = function (json, b) {
        return json[b];
    }
    var renderConfigInit = function () {
        var renderT = defaluts.templateDataRender;
        var match = [];
        while (match = _regex.exec(_templateStr)) {
            var name = match[1];
            _renderConfig[name] = renderDefaluts;
        }
        if (renderT) {
            for (var i = 0; i < renderT.length; i++) {
                _renderConfig[renderT[i].name] = renderT[i].render;
            }
        }
    }
    var getStr = function (data) {
        var str = '';
        $.each(data, function (index, item) {
            str += format(_templateStr, item);
        });
        return str;
    }

    var init = function (pageCurrent) {
        var ajaxData = {pageCurrent:pageCurrent,pageSize:defaluts.pageSize};
        ajaxData = $.extend({},defaluts.ajaxData,ajaxData);
        if (defaluts.url && defaluts.url != '') {
            $.ajax({
                url: defaluts.url,
                type: defaluts.ajax,
                data: ajaxData,
                success: function (data) {
                    var json = [];
                    if (typeof (JSON) != 'undefined') json = JSON.parse(data);
                    else json = (new Function("return " + data))();
                    var str = getStr(json.list);
                    defaluts.div$.html('').append(str);
                    var pageCount = Math.ceil(json.total / defaluts.pageSize);
                    _page.init(defaluts.page$, pageCurrent, pageCount, init);
                },
                fail: function () {

                }
            })
        } else {
            var deferred = $.Deferred();
            defaluts.ajaxF(deferred,pageCurrent).done(function (data) {
                var str = getStr(data.list);
                defaluts.div$.html('').append(str);
                var pageCount = Math.ceil(data.total / defaluts.pageSize);
                _page.init(defaluts.page$, pageCurrent, pageCount, init);
            }).fail(function () {
            });
        }
    }
    return {
        init: function (options) {
            defaluts = $.extend({}, defaluts, options);
            _page = new pageHandler();
            if (defaluts.template && defaluts.template != '') {
                _templateStr = defaluts.template;
                renderConfigInit();
                init(defaluts.pageCurrent);
            } else {
                return;
            }
        },
        reload:init
    }
};
