$(function() {
    var jobStatisticsVue = new Vue({
        el: '#data-section',
        data: {
            job: '',
            companies: [],
            isLoading: false,
        },
        methods: {
            searchJob: function(job) {
                this.isLoading = true;

                ga && ga('send', 'event', 'QUERY_PAGE', 'search-by-job-title', job);

                this.getStatistics(job).then(function(res) {
                    this.job = job;
                    this.companies = res.data;
                    this.isLoading = false;
                }, function(res) {
                    this.isLoading = false;
                    this.companies = [];
                });
            },
            getStatistics: function(job, page) {
                return this.$http.get('https://tranquil-fortress-92731.herokuapp.com/jobs/' + encodeURIComponent(job) + '/statistics');
            },
        }
    });

    $("#search-form").on('submit', function(e) {
        e.preventDefault();

        jobStatisticsVue.searchJob($("#query").val());
    });

    $("#query").autocomplete({
        source: function (request, response) {
            if(ga){
                ga('send', 'event', 'QUERY_PAGE', 'query-autocomplete-search', request.term);
            }
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
        select: function(event, ui){ 
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'query-autocomplete-select', ui['item']['label']);
            }
        }
    });

    function solveUrlParameter() {
        var params = {};

        $.each(window.location.search.substring(1).split("&"), function(i, item) {
            var param = decodeURIComponent(item).split('=');

            params[param[0]] = param[1] ? param[1] : true;
        });

        return params;
    }

    var query = solveUrlParameter().job_title;
    if (query && query !== '') {
        $("#query").val(query);
        $("#search-form").submit();
    }

});

