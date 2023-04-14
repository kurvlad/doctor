$(document).ready(function () {

    // Аякс докторов
    function getDoctors(options) {
        var options = options || {};
        options.isShoreMore = options.isShoreMore || false;

        var $preloader = $(".doctors .preloader");
        var $list = $(".doctors_data");

        var clinics = $("[data-doctors-clinics] .custom__checkbox.active").map((index, el) => $(el).attr("data-value")).get();
        //var page = +$("[data-doctors-pagination] .pagination__item.active").text();

        if(!options.isShowMore) {
            $preloader.css("display", "flex");
            $list.hide();
        }

        var url;
        if(options.Url){
            url = options.Url;
        }

        return $.ajax({
            type: "POST",
            url: url,
            data: {
                "clinics[]": clinics,
                "doctors_filter":"y"/*,
                page: options.isShowMore ? page + 1 : page,*/
            },
            success: function (html) {
                var $html = $("<div>" + html + "</div>");

                if (options.isShowMore) {
                    // Обновление html при клике "Показать еще"
                    $(".doctors_data .doctors_list").append(
                        $html.find(".doctors_data .doctors_list").html()
                    );

                    $(".doctors_data").append("<div class='doctors_pagination' data-doctors-pagination></div>");
                    $(".doctors_data .doctors_pagination").append(
                        $html.find(".doctors_pagination").html()
                    );

                } else {
                    // Обновление html
                    $(".doctors_data").html(
                        $html.find(".doctors_data").html()
                    );
                }

                /*$(".doctors_pagination").html(
                    $html.find(".doctors_pagination").html()
                );*/

                $preloader.hide();
                $list.show();

                initTooltips();
            },
        });
    }

    // Вызов аякса при изменении фильтров
    //$(document).on("click", "[data-doctors-clinics] .custom__checkbox", getDoctors);

    $(document).on("click", "[data-doctors-clinics] .custom__checkbox", function() {

        var $parent = $(this).closest(".custom__input");

        if ($(this).closest('[data-doctors-clinics]').length) {
            $(this).toggleClass('active')
            var checkboxCount = $(this).closest('.dropdown__list').find('.custom__checkbox.active').length

            if (checkboxCount > 0) {
                $parent.find('.dropdown__head')
                    .css('color', 'var(--black)')
                    .text(`Выбрано клиник`)
                    .append(`<span class='dropdown__count' data-count='${checkboxCount}'></span>`)
            } else {
                $parent.find('.dropdown__head').css('color', '').text('Выберите клинику')
            }
        }

        getDoctors();
    });


    // Пагинация
    $(document).on("click", "[data-doctors-pagination] .pagination__item a", function() {
        var url = $(this).attr("href");

        getDoctors(
            { 
                Url: url
            }
        );

        $('body,html').animate({scrollTop: $(".doctors__head").offset().top});
        return false;
    });
    // Пагинация END


    // Показать еще
    $(document).on("click", "[data-doctors-show-more]", function() {

        var url = $(this).attr("href");

        $(this).closest("[data-doctors-pagination]").remove();

        getDoctors(
            { 
                isShowMore: true,
                Url: url
            }
        );
        return false;
    });
    //(document).on("click", "[data-doctors-show-more]", () => getDoctors({ isShowMore: true }))
    // Показать еще END


    // Расписание врача
    $(document).on("click", ".doctor_card__nav_show", function () {
        var $parent = $(this).closest(".doctor_card");
        var $content = $parent.find(".doctor_card__nav_content");

        $(this).toggleClass("active");
        $parent.toggleClass("active");
        $content.stop().slideToggle();
    });

    // Стрелки фильтров
    $(document).on(
        "click",
        "[data-doctor-filter-next], [data-doctor-filter-prev]",
        function () {
            var isNext = $(this).get(0).hasAttribute("data-doctor-filter-next");
            var toScroll = isNext ? 300 : -300;
            var $parent = $(this).closest(".doctor_filter");
            var $items = $parent.find(".doctor_filter__list");

            $items
                .stop()
                .animate({ scrollLeft: $items.scrollLeft() + toScroll });
        }
    );

    // Изменение фильтров
    $(document).on("click", ".doctor_filter__tag, .doctor_filter__tag2", function() {
        var $parent = $(this).closest(".doctor_filter__list");
        $parent.find(".doctor_filter__tag, .doctor_filter__tag2").removeClass("active");
        $(this).addClass("active");
    });


});
