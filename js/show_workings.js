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
            $.map(View.currentWorkings, View.method.make).forEach(function($html) {
                $html.appendTo(View.$container);
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
            return $("<tr>")
                .append($("<td>").text(w.company ? w.company.name : ""))
                .append($("<td>").text(w.job_title))
                .append($("<td>").text(w.week_work_time));
        },
    };

    /*
     * query a specific page workings
     */
    function queryWorkings(page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/workings/latest',
            data: {
                page: page,
            },
            method: 'GET',
            dataType: 'json',
        });
    }

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

