$(function() {
    var View = {
        currentPage: 0,
        currentWorkings: [],
        $page: $("#newest-view-page"),
        $alert: $("#newest-view-alert"),
        $container: $("#newest-data-table tbody"),
    };

    View.method = {
        update: function() {
            View.$container.empty();
            $.map(View.currentWorkings, View.method.make).forEach(function(html) {
                $(html).appendTo(View.$container);
            });

            View.$page.html(View.currentPage + 1);
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
            return "<tr><td>" + w.company_name + "</td><td>" + w.job_title + "</td><td>" + w.week_work_time + "</td></tr>";
        },
    };

    /*
     * query a specific page workings
     */
    function queryWorkings(page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/workings',
            data: {
                page: page,
            },
            method: 'GET',
            dataType: 'json',
        });
    }

    /*
     * query workings starting from a specific page
     */
    /*
    function queryAllWorkings(page) {
        page = page || 0;

        return queryWorkings(page).then(function(workings) {
            $.map(workings, view).forEach(function(html) {
                $(html).appendTo(container);
            });

            return workings;
        }).then(function(workings) {
            if (workings.length != 0) {
                return queryAllWorkings(page + 1);
            } else {
                return true;
            }
        });
    }

    queryAllWorkings().then(function(res) {
        if (res) {
            console.log("finish all page query");
        }
    });
    */

    $("#newest-view-previous").on('click', function(e) {
        e.preventDefault();
        loadPage(-1);
    });

    $("#newest-view-next").on('click', function(e) {
        e.preventDefault();
        loadPage(1);
    });

    var loading = false;
    function loadPage(offset) {
        if (loading) {
            return;
        }
        loading = true;
        View.method.addSpinner();

        console.log("begin");

        __loadPage(offset).then(function() {
            loading = false;
            View.method.update();

            console.log("resolved!");
        }, function(e) {
            loading = false;
            View.method.update();
            View.method.showAlert(e.message);

            console.log("rejected!");
        });
    }

    function __loadPage(offset) {
        var deferred = $.Deferred();

        if (offset == -1 && View.currentPage == 0) {

            deferred.reject(new Error("第一頁！"));
        } else {
            var page = View.currentPage + offset;

            queryWorkings(page).then(function(workings) {
                if (workings.length == 0) {
                    deferred.reject(new Error("最後一頁"));
                    return;
                }

                View.currentPage = page;
                View.currentWorkings = workings;
                deferred.resolve();
            }, function() {
                deferred.reject(new Error("存取錯誤"));
            });
        }

        return deferred.promise();
    }

    loadPage(0);
});

