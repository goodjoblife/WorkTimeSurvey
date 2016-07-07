$(function() {
    var View = {
        job_title: null,
        currentPage: 0,
        currentWorkings: [],
        sectionHide: true,
        $section_body: $("#search-result-section"),
        $page: $("#search-view-page"),
        $alert: $("#search-view-alert"),
        $container: $("#search-data-table tbody"),
        $title: $("#job-title"),
    };

    View.method = {
        update: function() {
            View.$container.empty();
            $.map(View.currentWorkings, View.method.make).forEach(function($html) {
                $html.appendTo(View.$container);
            });

            View.$page.html(View.currentPage + 1);
            View.$title.text(View.job_title);

            if (View.sectionHide) {
                View.$section_body.addClass("hidden");
            } else {
                View.$section_body.removeClass("hidden");
            }
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
                .append($("<td>").text(w._id ? w._id.name : ""))
                .append($("<td>").text(w.average_week_work_time))
                .append($("<td>").text(w.count));
        },
    };

    /*
     * query a specific page workings
     */
    function queryWorkings(job_title, page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/jobs/' + encodeURIComponent(job_title) + '/statistics',
            data: {
                page: page,
            },
            method: 'GET',
            dataType: 'json',
        });
    }

    $("#search-view-previous").on('click', function(e) {
        e.preventDefault();
        loadPage(-1);
    });

    $("#search-view-next").on('click', function(e) {
        e.preventDefault();
        loadPage(1);
    });

    $("#search-form").on('submit', function(e) {
        e.preventDefault();
        
        loadSearch($("#query").val());
    });

    $("#query").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://tranquil-fortress-92731.herokuapp.com/jobs/search",
                data: {
                    key : request.term,
                },
                dataType: "json",
            }).done(function(res) {
                var nameList = $.map(res, function(item, i) {
                    return {
                        value: item.des,
                        id: item._id,
                    };
                });
                response(nameList);
            }).fail(function( jqXHR, textStatus ) {
                response([]);
            });
        },
    });

    var loading = false;
    function loadSearch(job_title) {
        if (loading) {
            return;
        }
        loading = true;
        View.method.addSpinner();

        console.log("begin");

        View.job_title = job_title;

        queryWorkings(job_title, 0).then(function(workings) {
            loading = false;
            
            View.currentPage = 0;
            View.currentWorkings = workings;
            if (workings.length == 0) {
                View.sectionHide = true;
                View.method.showAlert("查詢無資料");
                console.log("0 search result resolved!");
            } else {
                View.sectionHide = false;
            }
            View.method.update();
            console.log("resolved!");
        }, function() {
            loading = false;

            View.currentPage = 0;
            View.currentWorkings = [];
            View.sectionHide = true;
            View.method.update();
            View.method.showAlert("存取錯誤");
            console.log("rejected!");
        });
    }

    function loadPage(offset) {
        if (loading) {
            return;
        }
        loading = true;
        View.method.addSpinner();

        console.log("begin");

        __loadPage(offset).then(function(d) {
            loading = false;
            console.log("resolved!");

            View.currentPage = d.page;
            View.currentWorkings = d.workings;
            View.method.update();
        }, function(e) {
            loading = false;
            console.log("rejected!");

            View.method.update();
            View.method.showAlert(e.message);
        });
    }

    function __loadPage(offset) {
        var deferred = $.Deferred();

        if (offset == -1 && View.currentPage == 0) {

            deferred.reject(new Error("第一頁！"));
        } else {
            var page = View.currentPage + offset;
            queryWorkings(View.job_title, page).then(function(workings) {
                if (workings.length == 0) {
                    deferred.reject(new Error("最後一頁"));
                    return;
                }

                deferred.resolve({page: page, workings: workings});
            }, function() {
                deferred.reject(new Error("存取錯誤"));
            });
        }

        return deferred.promise();
    }


    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

    var query = getUrlParameter("job_title");
    if (query !== undefined && query !== '') {
        $("#query").val(query);
        $("#job-title").text(query);
        View.job_title = query;
        loadPage(0);        
    }

});

