$(document).ready(function(){
    $("div.blueprintContainer a.more").click(function(){
        $(this).toggleClass("open");
        $(this).parent().parent().next().toggleClass("open");
    });
});