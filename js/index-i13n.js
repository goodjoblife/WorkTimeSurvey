$(function(){
    var category = "LANDING_PAGE";

    // Tracking click events
    $("a").click(function(e){
        if (this.dataset['logaction'] && ga) {
            var logAction = this.dataset['logaction'];
            ga('send', 'event', category, logAction);
        }
    });

    $("#form input").focus(function(e){
    	if(this.dataset['logaction'] && ga) {
            var logAction = this.dataset['logaction'];
            ga('send', 'event', category, logAction);
        }
    });

    var form = $("#form");
    var formBeginTime = null;
    var formSubmittedTime = null;

    form.one('beginWriting', function(e) {
        formBeginTime = performance.now();
        ga('send', 'timing', category, 'form-begin-writing', formBeginTime);
    });

    form.one('submitted', function(e) {
        formSubmittedTime = performance.now();

        var elapsedTime = formSubmittedTime - formBeginTime;

        ga('send', 'timing', category, 'form-submitted', formSubmittedTime);
        ga('send', 'timing', category, 'form-writing', elapsedTime);
    });
});
