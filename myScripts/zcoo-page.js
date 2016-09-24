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
            li$ += '<li class="myli" value="' + (_pageNo - 1) + '"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        } else {
            li$ += '<li class="disabled" value="' + _pageNo + '"><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        }
        for (var i = start; i <= end; i++) {
            if (i == _pageNo) {
                li$ += '<li class="active" value="' + i + '"><a href="#">' + i + '</a></li>';
            } else {
                li$ += '<li class="myli" value="' + i + '"><a href="#">' + i + '</a></li>';
            }
        }
        if (_pageNo < _pageCount) {
            li$ += '<li class="myli" value="' + (_pageNo - 0 + 1) + '"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        } else {
            li$ += '<li class="disabled" value="' + _pageNo + '"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        }

        var nav$ = '<nav><ul class="pagination" style="margin-top:0px;margin-bottom:0px;" id="page" >' + li$ + '</ul></nav>';
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
}