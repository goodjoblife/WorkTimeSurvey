$(function(){
    var category = "QUERY_PAGE";

    $("a").click(function(e){
        if (this.dataset['logaction'] && ga) {
            var logAction = this.dataset['logaction'];
            ga('send', 'event', category, logAction);
        }
    });
});
