$(document).ready(function () {

    initSpecsSlider();


    //раскрытие плашки
    $(document).on('click', '.card', function () {
        if (!$(this).hasClass('opened')) {

            $(this).addClass('opened')

            $(this).find('.card__body').slideDown({
                start: function () {
                    $('.card__slider_container').slick('setPosition', 0)
                },
                duration: 300,
            })
        }
    });
    $(document).on('click', '.card__head', function () {

        if ($(this).parent().hasClass('opened')) {

            $(this).next('.card__body').slideUp(300, function () {
                $(this).parent().removeClass('opened')
            })

        }
    });
    //раскрытие плашки END


    //Алфавит фильтрация
    $(document).on('click', '.service__letters_letter:not(.disable)', function (e) {
        e.preventDefault();
        $(document).find('.service__letters_letter').removeClass('active')
        $(this).addClass('active');
        filterSpecs();
    })

    /*$(document).on("click", ".filterSubmit", function () {
        filterSpecs();
    });*/

    $(document).on("click", ".clearServicesSearch", function(){
        $(document).find(".service__filter_input-search").find("input").val("");
        filterSpecs();
    });
    //Алфавит фильтрация END



    //Фильтрация поиска
    $(document).on('keyup', '.js-search input', function (e) {

        if(e.keyCode === 13){

            if($(this).val().length >= 3) {
                filterSpecs();
            }

        }else{

            if ($(this).val().length >= 3) {
                var value = $(this).val();
                var $this = $(this);

                $.ajax({
                    type: "POST",
                    data: {
                        "search": value,
                    },
                    url: "/local/include/ajax/specSearch.php",
                    dataType: "html",
                    success: function (data) {
                        if (data.trim().length) {
                            $this.parent().find('.dropdown__container').html(data)
                            $this.parent().find('.dropdown__body').fadeIn()
                        } else {
                            $this.parent().find('.dropdown__body').fadeOut(function () {
                                $this.parent().find('.dropdown__list').remove()
                            })
                        }
                    }
                });
            } else {
                $(this).parent().find('.dropdown__body').fadeOut();

                if ($(this).val().length == 0){
                    filterSpecs();
                }
            }

        }
        
    });



    $(document).on('click', '.js-search .dropdown__list_item', function () {
        var text = $(this).text()
        var parent = $(this).closest('.custom__input')

        parent.find('input').val(text)
        parent.find('.dropdown__body').fadeOut();

        filterSpecs();
    })

    $(document).on("click", ".js-search .icon-search", function(){
        $(this).closest(".service__filter").find(".filterSubmit").trigger("click");
    });
    //Фильтрация поиска END


    //Чекбокс
    $(document).on('click', '.custom__checkbox', function () {
        var $parent = $(this).closest(".custom__input");

        if ($(this).closest('[data-choose-clinic]').length) {
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

        if ($(this).closest('[data-choose-city]').length) {
            $(this).addClass('active')
            $('.js-location').find('.dropdown__head').text($(this).text())
            $('.js-location .custom__checkbox').not($(this)).removeClass('active')
        }

        filterSpecs();
    })

    $(document).on("click", "[data-choose-city] .custom__checkbox", function () {
        $.ajax({
            type: "POST",
            data: {
                "city": $(document).find("[data-choose-city]").find("[data-name=city].active").attr("data-value"),
            },
            url: "/local/include/ajax/clinicsList.php",
            dataType: "html",
            success: function (data) {
                $(document).find("[data-choose-clinic]").html($("<div>" + data + "</div>").find("[data-choose-clinic]").html());
            }
        });
    });
    //Чекбокс END

})

function initSpecsSlider(){
    $(document).find('.card__slider_container').each(function () {
        var nextArrow = $(this).parent().find("[data-next-arrow]")
        var prevArrow = $(this).parent().find("[data-prev-arrow]")
        $(this).slick({
            adaptiveHeight: false,
            variableWidth: false,
            slidesToShow: 1,
            // fade: true,
            // cssEase: 'linear',
            nextArrow: nextArrow,
            prevArrow: prevArrow,
            zIndex: 10,
        });
    })
}


function filterSpecs() {
    var char = $(document).find(".service__letters_letter.active").attr("data-char");
    var search = $(document).find(".service__filter_input-search").find("input").val();
    var city = $(document).find("[data-choose-city]").find("[data-name=city].active").attr("data-value");
    var clinics = [];
    $(document).find(".service__filter_input-clinic").find("[data-name=clinic].active").each(function () {
        clinics.push($(this).attr("data-value"));
    });

    $(document).find(".emptyBlock").hide();
    $(document).find(".service__cards").find(".card").hide();
    $(document).find(".service").find(".preloader").css("display", "flex");
    $.ajax({
        type: "POST",
        data: {
            "char": char,
            "search": search,
            "city": city,
            "clinics": clinics
        },
        url: "/local/include/uslugi/specializations.php",
        dataType: "html",
        success: function (data) {
            $(document).find(".service").html($("<div>" + data + "</div>").find(".service").html());
            initSpecsSlider();
        }
    });
}