$(document).ready(function() {

    // Аякс на обновление услуг
    function getPrices(options) {
        var options = options || {};
        
        var $preloader = $(".price_list_data .preloader");

        var $priceList = $(".price_data");

        options.isShoreMore = options.isShoreMore || false;  
        options.updateFilters = options.updateFilters || false;  

        //var category = $.trim($("[data-price-category].active").attr("data-price-category"));
        var search = $.trim($("[data-price-search]").val());
        var doctors = $("[data-price-doctors] .custom__checkbox.active").map((index, el) => $(el).attr("data-value")).get();
        var clinics = $("[data-price-clinics] .custom__checkbox.active").map((index, el) => $(el).attr("data-value")).get();
        var page = +$("[data-price-pagination] .pagination__item.active").text();

        if(!options.isShowMore) {
            $preloader.css("display", "flex");
            $priceList.hide();
        }

        return $.ajax({
            type: "POST",
            url: "",
            data: {
                //category,
                search,
                "doctors[]": doctors,
                "clinics[]": clinics/*,
                page: options.isShowMore ? page+1 : page*/
            },
            success: function(html) {
                var $html = $("<div>"+html+"</div>");

                /*if(options.isShowMore) {
                    // Обновление html при клике "Показать еще"
                    $priceList.append(
                        $html.find(".price_tab_list").html()
                    );
                    $pagination.html(
                        $html.find("[data-price-pagination]").html()
                    )
                } else {
                */

                    // Обновление html
                    $(".price_list_data").html(
                        $html.find(".price_list_data").html()
                    );


                //}

                // Обновление html фильтров
                if(options.updateFilters) {
                    $(".price_list__filters").html(
                        $html.find(".price_list__filters").html()
                    );
                }

                $preloader.hide();
                $priceList.show();

                initTooltips();
            }
        });
    }


    //Фильтрация поиска
    $(document).on('keyup', '.js-search input', function (e) {

        if(e.keyCode === 13){

            if($(this).val().length >= 3) {
                getPrices();
            }

        }else{

            if ($(this).val().length >= 3) {
                var value = $(this).val();
                var $this = $(this);

                var specialization = $.trim($("[data-price-specialization]").attr("data-price-specialization"));

                $.ajax({
                    type: "POST",
                    data: {
                        "search": value,
                        "specialization": specialization
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
                    getPrices();
                }
            }

        }
    });
    $(document).on('click', '.js-search .dropdown__list_item', function () {
        var text = $(this).text()
        var parent = $(this).closest('.custom__input')

        parent.find('input').val(text)
        parent.find('.dropdown__body').fadeOut();

        getPrices();
    })

    $(document).on("click", ".js-search .icon-search", function(){
        $(this).closest(".service__filter").find(".filterSubmit").trigger("click");
    });

    
    /*var getPricesDebounced = debounce(getPrices, 700);

    // Вызов аякса при изменении фильтров
    $(document).on("click", "[data-price-doctors] .custom__checkbox, [data-price-clinics] .custom__checkbox", getPricesDebounced);
    $(document).on("input", "[data-price-search]", getPricesDebounced);
    */

    // Аякс при пагинации
    $(document).on("click", "[data-price-pagination] .pagination__item", function() {
        getPrices();
        $('body,html').animate({scrollTop: $(".price_list__data").offset().top});
    })
    $(document).on("click", "[data-price-show-more]", () => getPrices({ isShowMore: true }));



    // Переключение табов 
    $(document).on("click", "[data-price-category]", function(event) {
        event.preventDefault();

        var options = options || {};
        
        var $preloader = $(".price_list_data .preloader");

        var $priceList = $(".price_data");

        options.isShoreMore = options.isShoreMore || false;  
        options.updateFilters = options.updateFilters || false;  
        
        var category = $.trim($(this).attr("data-price-category"));

        /*$("[data-price-category-content]").hide();
        $(`[data-price-category-content="${category}"]`).fadeIn();*/


        var search = $.trim($("[data-price-search]").val());
        var doctors = $("[data-price-doctors] .custom__checkbox.active").map((index, el) => $(el).attr("data-value")).get();
        var clinics = $("[data-price-clinics] .custom__checkbox.active").map((index, el) => $(el).attr("data-value")).get();

        if(!options.isShowMore) {
            $preloader.css("display", "flex");
            $priceList.hide();
        }

        return $.ajax({
            type: "POST",
            url: "",
            data: {
                category,
                search,
                "doctors[]": doctors,
                "clinics[]": clinics/*,
                page: options.isShowMore ? page+1 : page*/
            },
            success: function(html) {
                var $html = $("<div>"+html+"</div>");

                // Обновление html
                $(".price_list_data").html(
                    $html.find(".price_list_data").html()
                );

                $preloader.hide();
                $priceList.show();

                initTooltips();

                return false;
            }
        });

    });



    // Аккордеон направления
    $(document).on("click", ".price_tab__head", function() {
        $parent = $(this).closest(".price_tab");
        $content = $parent.find(".price_tab__content");
        
        if($parent.hasClass("active")) {
            $parent.removeClass("active");
            $content.stop().slideUp();
        } else {
            $parent.addClass("active");
            $content.stop().slideDown();
        }
    });
    
    // Аккордеон услуги
    $(document).on("click", ".price_service__name, .price_service__cross", function() {
        $parent = $(this).closest(".price_service");
        $content = $parent.find(".price_service__content");
        
        if($parent.hasClass("active")) {
            $parent.removeClass("active");
            $content.stop().slideUp();
        } else {
            $parent.addClass("active");
            $content.stop().slideDown();
            initSliders();
        }
    });

    // Слайдеры в услугах
    initSliders();
    function initSliders() {
        $(".price_person_slider.slick-initialized, .price_place_slider.slick-initialized").slick('setPosition', 0);

        $(".price_person_slider:not(.slick-initialized)").slick({
            nextArrow: '<i class="icon-arrow-right"></i>',
            prevArrow: '<i class="icon-arrow-left"></i>',
        });
        $(".price_place_slider:not(.slick-initialized)").slick({
            nextArrow: '<i class="icon-arrow-right"></i>',
            prevArrow: '<i class="icon-arrow-left"></i>',
        });
    }


    // Чекбоксы
    $(document).on("click", "[data-price-clinics] .custom__checkbox", function() {

        var $parent = $(this).closest(".custom__input");

        if ($(this).closest('[data-price-clinics]').length) {
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

        getPrices();

    });

    // Чекбоксы
    $(document).on("click", "[data-price-doctors] .custom__checkbox", function() {

        var $parent = $(this).closest(".custom__input");

        if ($(this).closest('[data-price-doctors]').length) {
            $(this).toggleClass('active')
            var checkboxCount = $(this).closest('.dropdown__list').find('.custom__checkbox.active').length

            if (checkboxCount > 0) {
                $parent.find('.dropdown__head')
                    .css('color', 'var(--black)')
                    .text(`Выбрано врачей`)
                    .append(`<span class='dropdown__count' data-count='${checkboxCount}'></span>`)
            } else {
                $parent.find('.dropdown__head').css('color', '').text('Выберите врача')
            }
        }

        getPrices();

    });

    $(document).on("click", ".clearServicesSearch", function(){
        $(document).find(".price_list__filters").find("input").val("");
        getPrices();
    });

 
});
