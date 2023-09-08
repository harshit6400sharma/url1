(function ($) {
    $(document).ready(function () {
        //tab invidual 
        $("#get_Quotes").click(function () {
            $(".individual-step-one").hide();
            $(".individual-step-two").show();
        });
        //Health
        $("#helth").click(function () {

            $(".bannerarea").hide();
            $("#top-infography").hide();
            $("#health_tab").show();

        });
        $("#back").click(function () {

            $(".bannerarea").show();
            $("#top-infography").show();
            $("#health_tab").hide();

        });

    });
    $(window).on('load', function () {
    });
})(jQuery);
