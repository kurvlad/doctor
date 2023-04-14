$(document).ready(function () {
    
    $(document).on('click', '.dropdown__head', function (e) {
        var $parent = $(this).closest(".dropdown");
        
        $parent.toggleClass("active");

        $('.dropdown__head').not($(this)).next('.dropdown__body').fadeOut()

        $(this).next('.dropdown__body').fadeToggle()
    })

    //Закрыть при клике вне
    $(document).on('click', function (e) {
        var dropdown = $(".dropdown");
        var side = $('.side')

        if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
            dropdown.find('.dropdown__body').fadeOut();
            dropdown.removeClass("active");
        }


        if (!side.is(e.target) && side.has(e.target).length === 0 && side.find('.side__container').hasClass('open')) {
            dropdown.removeClass("active");
            side.find('.side__container').removeClass('open')
            side.find('.side__button i').toggleClass('icon-note icon--red').toggleClass('icon-close')
            side.find('.side__text').toggle()
        }
    })
    //Закрыть при клике вне END



    //Бургер меню в шапке
    $('.header__burger').on('click', function () {
        $(this).find('.icon__burger').toggleClass('opened')
        $('.header__menu').slideToggle()
        $('body').toggleClass('filter--blur')
    })

    $(document).on('click', function (e) {
        if ($(".filter--blur").is(e.target)) {
            $('.header__burger').trigger('click')
        }
    })
    //Бургер меню в шапке END



    //Выбор города в шапке
    if(!getCookie("citySelected")){
        $(".selectCity").find('.dropdown__body').fadeIn()
    }
    
    $(document).on("click", ".acceptCity", function(){
        setCookie("citySelected", true, {
            expires: 86400 * 30
        });

        $('.dropdown__head').not($(this)).next('.dropdown__body').fadeOut()

        $(this).next('.dropdown__body').fadeToggle().find('.city__list').fadeOut()
    });

    $('.city__choose_other').on('click', function () {
        $(this).closest('.dropdown__body').find('.city__list').fadeIn()
    })

    $('.city__list_item').on('click', function(){
        var text = $(this).clone().children().remove().end().text().trim();
        var city = $(this).attr("data-city").trim();

        $('.city__list_item').removeClass('active')
        $(this).addClass('active')
        
        $('[data-city]').attr('data-city',text)

        setCookie("my_city", city, {
            expires: 86400 * 30
        });
        setCookie("citySelected", true, {
            expires: 86400 * 30
        });

        window.location.reload();
    })

    $('.city__choose_button').on('click', function(){
        var city = $(this).closest('.dropdown__body_city').find('.city__title').attr('data-city')
        $(this).closest('.city__dropdown').find('.city__dropdown_title').text(city)
    })
    //Выбор города в шапке END

    // Якорь ссылка
    $('.service__note').on('click', function () {
        $('html, body').animate({
            scrollTop: $('.feedback').offset().top - 70
        }, 1500);
    })
    // Якорь ссылка END


    //Круглый текст
    // $('.side__button').on('click', function(){
    //     $(this).parent().toggleClass('open')
    //     $(this).find('i').toggleClass('icon-note icon--red').toggleClass('icon-close')
    //     $(this).find('.side__text').toggle()
    // })

    const text = document.querySelector(".side__text p");

    text.innerHTML = text.innerText
        .split("")
        .map(
            (char, i) => `<span style="transform:rotate(${i * 10.2}deg)">${char}</span>`
        )
        .join("");
    //Круглый текст END



    //Табы карты
    $('.adds__tabs_tab').on('click', function () {
        $('.adds__tabs_tab').removeClass('active')
        $(this).toggleClass('active')

        var type = $(this).attr('data-adds-tab')

        if (type == 'map') {
            $('.adds__list_body').hide()
            $('.adds__col:nth-child(2)').show()
        } else {
            $('.adds__list_body').show()
            $('.adds__col:nth-child(2)').hide()
        }
    })

    // $(window).on('resize', function(){
    //     if($(window).width() > 1199){
    //         $('.adds__tabs_tab').removeClass('active')
    //         $('[data-adds-tab=list]').trigger('click')
    //     }
    // })
    //Табы карты END

    $(document).on('click','.feedback__success_button',function(){
        $('.feedback__col_success').fadeOut(200,function(){
            $('.feedback__col_form').fadeIn(200)
        })
    })

    // Отправка форм
    $(document).on("submit", "form", function (e) {
        if ($(this).closest(".bx-core-window").length) {
            return;
        }

        e.preventDefault();
        var $form = $(this);
        var formName = $(this).attr("name");
        var action = $(this).attr("action");

        // Скролл к ошибке
        if (!validateForm($form)) {
            var $error = $form.find(".error").eq(0);
            $("body,html").animate({
                scrollTop: $error.offset().top,
            });
            return;
        }

        // Email подиска
        if (formName === "feedback") {
            $.post(action, $form.serialize()).then(function () {
                

                if($form.closest('.popup__feedback').length){
                    $form.fadeOut(200,function(){
                        $('.feedback__success').fadeIn(200)
                        $('.popup__img').attr('src','/local/assets/img/feedback__modal_success.svg')
                        $('.popup__title span').text('Спасибо!')
                    })
                }else{
                    $form.parent().fadeOut(200,function(){
                        $('.feedback__col_success').fadeIn(200)
                    })
                }
            
                clearForm($form);
            });
        }

    });
    // Отправка форм END



    // Инициализация масок
    function initMask() {
        $("[data-mask=phone]:not(.initiallized)")
            .addClass("initiallized")
            .inputmask({
                mask: "+7 (999) 999-99-99",
                showMaskOnHover: false,
                clearIncomplete: true,
            });
    }
    initMask();
    // Инициализация масок END

    $(document).on('open','[data-popup]',function(){
        if($('.popup').find('form').length){
            initMask()
        }
    })


    // Css переменная с высотой экрана
    function updateViewportHeight() {
        document.documentElement.style.setProperty(
            "--viewport-height",
            window.innerHeight + "px"
        );
    }
    window.addEventListener("resize", updateViewportHeight);
    updateViewportHeight();
    // Css переменная с высотой экрана END

    // Табы
    $(document).on("click", ".tab_button", function() {
        var $parent = $(this).closest(".tab_button_list");
        $parent.find(".tab_button").removeClass("active");
        $(this).addClass("active");
    });
    // Табы END

    // Пагинация
    $(document).on("click", ".pagination__item a", function() {
        var $parent = $(this).closest(".pagination");

        $parent.find(".pagination__item").removeClass("active");
        $(this).addClass("active");
    });
    // Пагинация END
})


// возвращает cookie если есть или undefined
function getCookie(name) {

    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

// уcтанавливает cookie
function setCookie(name, value, props) {

    props = props || {}

    var exp = props.expires

    if (typeof exp == "number" && exp) {

        var d = new Date()

        d.setTime(d.getTime() + exp * 1000)

        exp = props.expires = d

    }

    if (exp && exp.toUTCString) {
        props.expires = exp.toUTCString()
    }

    value = encodeURIComponent(value)

    var updatedCookie = name + "=" + value

    for (var propName in props) {

        updatedCookie += "; " + propName

        var propValue = props[propName]

        if (propValue !== true) {
            updatedCookie += "=" + propValue
        }
    }

    document.cookie = updatedCookie

}

// удаляет cookie
function deleteCookie(name) {

    setCookie(name, null, {
        expires: -1
    })

}