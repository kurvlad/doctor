// Открытие попапов по кнопке
$(document).on("click", "[data-open-popup]", function(e) {
	e.preventDefault();
    var popupName = $(this).attr("data-open-popup");
    var payload = $(this).data();

    if($(this).closest(".header__menu").length){
    	$(document).find('.header__burger').find('.icon__burger').removeClass('opened');
    	$('.header__menu').slideUp();
        $('body').removeClass('filter--blur');
    }

	Popup.openPopup(popupName, payload);
});
// Открытие попапов по кнопке END

// Инициализация существующих попапов
$(document).ready(function() {
    $("[data-popup]").each(function() {
        var popup = $(this).attr("data-popup");
        new Popup(popup);
    })
})



// Инициализация существующих попапов END

/**
 * @constructor
 * @param {string} fileName - Имя попап, так же должен соответствовать названию файла в /local/include/ajax/popup/fileName.php
 * @param {object} options - Опции попапа
 */

function Popup(fileName, options) {
	options = options || {};
	options.name = fileName || options.name || '';
	options.onInit = options.onInit || function() {};
	options.onOpen = options.onOpen || function() {};
	options.onClose = options.onClose || function() {};
	options.onLoad = options.onLoad || function() {};
	
	this.options = options;
	this.popupUrl = `/local/include/ajax/popup/${options.name}.php`;
	this.$popup = $("[data-popup='"+options.name+"']");
	this.isOpened = false;
	this.isLoaded = false;

	if($("[data-popup='"+options.name+"']").length && $("[data-popup='"+options.name+"']").data("instance"))
		return $("[data-popup='"+options.name+"']").data("instance");
		
	// Ajax получение верстки попапа
	this.fetchPopup = function(payload) {
		return new Promise(function(res) {
			if(this.$popup.length && !this.$popup[0].hasAttribute("data-removable")) {
				res();
			} else {
				var instance = this;
                payload = payload || {}
                
				$(`[data-popup="${instance.options.name}"][data-removable]`).remove();
				
				$.post(this.popupUrl).then(function(html) {
					var $html = $(html).attr("data-popup", instance.options.name);
					$("body").append($html);
					instance.$popup = $html;
					instance.$popup.data("instance", instance);
					$("[data-popup='"+instance.options.name+"']").trigger("load");
					res();
				});
			}
		}.bind(this)).then(function() {
			if(!this.isLoaded) {
				this.isLoaded = true;
				this.options.onLoad(this);
                this.initEvents();
			}
			return this;
		}.bind(this));
	}

	// Открытие попапа
	this.open = function(payload) {
		return new Promise(function(res) {
			this.fetchPopup(payload).then(res);
		}.bind(this)).then(function() {
			setTimeout(function() {
				this.$popup.addClass("active");
			}.bind(this))
			this.$popup.removeClass("closed");
			this.$popup.scrollTop(0);
			$("body").css("overflow", "hidden");
			this.isOpened = true;
            this.options.onOpen(this);
            $("[data-popup='"+this.options.name+"']").trigger("open");
			return this;
		}.bind(this));
	}
	
	// Закрытие попапа
	this.close = function() {
		this.$popup.removeClass("active");
		this.$popup.addClass("closed");
		$("body").css("overflow", "");
		this.isOpened = false;
        this.options.onClose(this);
        $("[data-popup='"+this.options.name+"']").trigger("close");
        setTimeout(function(){
			this.$popup.remove()
		}.bind(this),500)
	}

	// Подвязка событий в попапе
	this.initEvents = function() {
        // Закрытие попапа по аттрибуту "data-close"
		this.$popup.find("[data-close]").on("click", function() {
			this.close();
		}.bind(this));
        // Закрытие попапа при клике снаружи
		this.$popup.on("click", function(e) {
			if(!$(e.target).closest(".popup__inner").length) {
				this.close();
			}
		}.bind(this));
	}

	this.init = function() {
		this.$popup.data("instance", this);
	}
	this.init();
}

// Открытие любого попапа
Popup.__proto__.openPopup = function(name, payload) {
    var popup = new Popup(name);
    return popup.open(payload);
}
// Закрытие любого попапа
Popup.__proto__.closePopup = function(name) {
    var popup = new Popup(name);
    popup.close();
}