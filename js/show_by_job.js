$(function() {
    var View = {
        currentPage: 0,
        currentWorkings: [],
        $section_body: $("#search-result-section"),
        $page: $("#search-view-page"),
        $alert: $("#search-view-alert"),
        $container: $("#search-data-table tbody"),
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
                .append($("<td>").text(w._id ? w._id.name : ""))
                .append($("<td>").text(w.average_week_work_time));
        },
        show: function(){
            View.$section_body.removeClass("hidden");
        },
        hide: function(){
            View.$section_body.addClass("hidden");
        },
        reset: function(){
            View.currentPage = 0;
            View.currentWorkings = [];
        }
    };

    /*
     * query a specific page workings
     */
    function queryWorkings(job_title, page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/jobs/' + encodeURIComponent(job_title),
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

    $("#search-button").on('click', function(e){
        var job_title = $("#query").val();
        console.log(job_title);
        $("#job-title").text(job_title);
        View.job_title = job_title;
        View.currentPage = 0; 
        loadPage(0);
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
            View.method.show();
            console.log("resolved!");
        }, function(e) {
            loading = false;
            View.method.hide();
            View.method.reset();
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
            queryWorkings(View.job_title, page).then(function(workings) {
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


    var getUrlParameter = function getUrlParameter(sParam) {
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
    };

    var query = getUrlParameter("job_title");
    if(query !== undefined && query !== ''){
        $("#query").val(query);
        $("#job-title").text(query);
        View.job_title = query;
        loadPage(0);        
    }

});

