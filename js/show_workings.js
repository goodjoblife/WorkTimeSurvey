(function() {
    var View = {
        page: 0,
        limit: 25,
        workings: [],
        $page: undefined,
        $alert: undefined,
        $container: undefined,
        $previous: undefined,
        $next: undefined,
    };

    var Method = {
        update: function() {
            View.$container.empty();
            $.map(View.workings, Method.make).forEach(function($html) {
                $html.appendTo(View.$container);
            });

            View.$page.html(View.page + 1);
        },
        addSpinner: function() {
            View.$page.html($("<i class=\"fa fa-spinner fa-spin fa-fw\"></i>"));
        },
        showAlert: function(message) {
            View.$alert.html(message).removeClass("hidden");

            setTimeout(function() {
                View.$alert.addClass("hidden");
            }, 3000);
        },
        // A view convert working to view
        make: function(w) {
            return $("<div>").addClass("row")
                .append($("<div>").addClass("col-xs-12 col-sm-6 text-left").css("font-weight", "bold").text(w.company ? w.company.name : ""))
                .append($("<div>").addClass("col-xs-offset-2 col-xs-6 col-sm-offset-0 col-sm-3 text-left").text(w.job_title))
                .append($("<div>").addClass("col-xs-4 col-sm-3").text(w.week_work_time))
                .css("border-bottom", "1px solid black");
        },
    };

    /*
     * query a specific page workings
     */
    function queryWorkings(page, limit) {
        limit = limit || 25;
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/workings/latest',
            data: {
                page: page,
                limit: limit,
            },
            method: 'GET',
            dataType: 'json',
        });
    }

    function init(callback) {
        View.$page = $("#newest-view-page");
        View.$alert = $("#newest-view-alert");
        View.$container = $("#newest-workings-list");
        View.$previous = $("#newest-view-previous");
        View.$next = $("#newest-view-next");

        callback && callback();
        
        View.$previous.on('click', function(e) {
            e.preventDefault();
            loadPage(View.page - 1);
        });

        View.$next.on('click', function(e) {
            e.preventDefault();
            loadPage(View.page + 1);
        });

    }

    var loading = false;
    function loadPage(page) {
        if (loading) {
            return;
        }
        loading = true;
        Method.addSpinner();

        console.log("begin");

        __loadPage(page).then(function(d) {
            loading = false;

            View.page = d.page;
            View.workings = d.workings;
            Method.update();

            console.log("resolved!");
        }, function(e) {
            loading = false;

            Method.update();
            Method.showAlert(e.message);

            console.log("rejected!");
        });
    }

    function __loadPage(page) {
        var deferred = $.Deferred();

        if (page < 0) {

            deferred.reject(new Error("第一頁！"));
        } else {
            queryWorkings(page, View.limit).then(function(workings) {
                if (workings.length == 0) {
                    deferred.reject(new Error("最後一頁"));
                    return;
                }

                deferred.resolve({
                    page: page,
                    workings: workings,
                });
            }, function() {
                deferred.reject(new Error("存取錯誤"));
            });
        }

        return deferred.promise();
    }

    window.WorkingLoader = {
        View: View,
        Method: Method,
        loadPage: loadPage,
        init: init,
    };
})();

