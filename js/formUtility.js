$(document).ready(function(){
    $("#job_title").autocomplete({
        source: function (request, response) {
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-search', request.term);
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
                ga('send', 'event', 'LANDING_PAGE', 'job-title-autocomplete-select', ui['item']['label']);
            }
        }
    });

    $("#company_query").autocomplete({
        source: function (request, response) {
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-search', request.term);
            }
            $.ajax({
                url: "https://tranquil-fortress-92731.herokuapp.com/companies/search",
                data: { key : request['term'] },
                dataType: "json",
            }).done(function( res ) {
                nameList = new Array(); 
                console.log(res);

                res.forEach(function(item, i) {
                    nameList.push({"value": item['name'], "company_id": item.id});
                });
                response(nameList);
            }).fail(function( jqXHR, textStatus ) {
                response([]);
            });
        },
        minLength: 2,
        select: function(event, ui){ 
            if(ga){
                ga('send', 'event', 'LANDING_PAGE', 'company-query-autocomplete-select', ui['item']['company_id']);
            }
            $("#company_id").val(ui['item']['company_id']);
        }
    });
});
