$( document ).ready(function() {
    $(".downArrow").click(function(){
        $(".enterEmail").slideUp(500);
        $(".sendEmail").delay(500).slideDown(500);
        $('#div').show(0).delay(5000).hide(0);
    });
});