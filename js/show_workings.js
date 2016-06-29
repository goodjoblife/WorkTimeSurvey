$(function() {
    var container = $("#newest-data-table tbody");

    // A view convert working to view
    function view(w) {
        return "<tr><td>" + w.company_name + "</td><td>" + w.job_title + "</td><td>" + w.week_work_time + "</td></tr>";
    }

    /*
     * query a specific page workings
     */
    function queryWorkings(page) {
        return $.ajax({
            url: 'https://tranquil-fortress-92731.herokuapp.com/',
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
});

