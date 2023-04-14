$(document).ready(function() {
    $(document).on("click", ".text_section__more_button", function() {
        var $parent = $(this).closest(".text_section");
        var $moreContent = $parent.find(".text_section__content_more");

        if($moreContent.hasClass("active")) {
            $(this).find("span").text("ПОКАЗАТЬ ЕЩЁ");
        } else {
            $(this).find("span").text("СКРЫТЬ");
        }

        $moreContent.toggleClass("active");
        $moreContent.slideToggle();

    })
});