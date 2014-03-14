/* 
 *  jQuery tooltip - v0.1.0
 *  A tooltip library that doesn't make ALL THE ASSUMPTIONS.
 *  http://github.com/bolster/jquery-tooltip
 *
 *  Made by Nick Hudkins
 *  Under MIT License
 */

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "tooltip";
    defaults = {
      linkText: "Learn More",
      className: 'bolster-tooltip'
    };
    Plugin = (function() {
      function Plugin(element, options) {
        var tmpl, tooltipContent, tooltipLink;
        this.element = element;
        this.mouseleave = __bind(this.mouseleave, this);
        this.mouseenter = __bind(this.mouseenter, this);
        this.position = __bind(this.position, this);
        this.animateIn = __bind(this.animateIn, this);
        this.tooltipEnter = __bind(this.tooltipEnter, this);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(this.element);
        tooltipContent = this.$el.attr("title");
        tooltipLink = this.$el.attr("href");
        tmpl = "<div class=\"" + this.options.className + "\">" + tooltipContent + "<a href=\"" + tooltipLink + "\" class=\"" + this.options.className + "__link\">" + this.options.linkText + "</a></div>";
        this.$tooltip = $(tmpl);
        tooltipContent = null;
        tooltipLink = null;
        tmpl = null;
        this.init();
      }

      Plugin.prototype.offsetRelative = function(rel) {
        var $rel, $relOffset, $thisOffset, offset;
        $thisOffset = this.$el.offset();
        $rel = $(rel);
        $relOffset = $rel.offset();
        offset = {};
        offset.top = $thisOffset.top - $relOffset.top;
        offset.left = $thisOffset.left - $relOffset.left;
        return offset;
      };

      Plugin.prototype.init = function() {
        this.calibrate();
        this.options.timer = null;
        this.$el.on("click", function(e) {
          return false;
        });
        this.$el.on("mouseenter", this.mouseenter);
        return this.$el.on("mouseleave", this.mouseleave);
      };

      Plugin.prototype.tooltipEnter = function() {
        return clearTimeout(this.options.timer);
      };

      Plugin.prototype.calibrate = function() {
        this.$tooltip.css({
          "opacity": 0,
          "position": "absolute"
        }).appendTo("body");
        this.options.height = this.$tooltip.outerHeight();
        this.options.width = this.$tooltip.outerWidth();
        this.options.targetWidth = this.$el.outerWidth();
        return this.$tooltip.remove();
      };

      Plugin.prototype.animateIn = function() {
        return this.$tooltip.stop(true, true).animate({
          "opacity": 1
        }, 100);
      };

      Plugin.prototype.position = function(callback) {
        var getLeft, getTop, offsetBody,
          _this = this;
        offsetBody = this.offsetRelative("body");
        getTop = function() {
          return offsetBody.top - (_this.options.height + parseInt(_this.$tooltip.css('margin-bottom')));
        };
        getLeft = function() {
          return offsetBody.left - ((_this.options.width / 2) - (_this.options.targetWidth / 2));
        };
        this.$tooltip.css({
          "position": "absolute",
          "top": getTop(),
          "left": getLeft()
        });
        return callback();
      };

      Plugin.prototype.mouseenter = function() {
        clearTimeout(this.options.timer);
        this.$tooltip.remove();
        this.$tooltip.appendTo("body");
        this.position(this.animateIn);
        this.$tooltip.off("mouseenter");
        this.$tooltip.off("mouseleave");
        this.$tooltip.on("mouseenter", this.tooltipEnter);
        return this.$tooltip.on("mouseleave", this.mouseleave);
      };

      Plugin.prototype.mouseleave = function() {
        var _this = this;
        return this.options.timer = setTimeout(function() {
          return _this.$tooltip.stop(true, true).animate({
            "opacity": 0
          }, 100, function() {
            return $(this).remove();
          });
        }, 100);
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
