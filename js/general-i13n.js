$(function(){
    // Tracking click events
    $("a").click(function(e){
        if (this.dataset['logcategory'] && this.dataset['logaction'] && ga) {
            var category = this.dataset['logcategory'];
            console.log(category);
            var logAction = this.dataset['logaction'];
            ga('send', 'event', category, logAction);
        }
    });
});
