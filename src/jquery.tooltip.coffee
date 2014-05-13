# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

  # window and document are passed through as local variable rather than global
  # as this (slightly) quickens the resolution process and can be more efficiently
  # minified (especially when both are regularly referenced in your plugin).

  # Create the defaults once
  pluginName = "toolpop"
  defaults = {
    linkText: "Learn More"
    className: 'bolster-tooltip'
  }

  # The actual plugin constructor
  class Plugin
    constructor: (@element, options) ->
      # jQuery has an extend method which merges the contents of two or
      # more objects, storing the result in the first object. The first object
      # is generally empty as we don't want to alter the default options for
      # future instances of the plugin
      @options = $.extend {}, defaults, options
      @_defaults = defaults
      @_name = pluginName
      @$el = $(@element)

      tooltipContent = @$el.attr "title"
      tooltipLink = @$el.data('learnMore') || @$el.attr "href"
      target = @$el.attr "target"

      tmpl = """<div class="#{@options.className}">#{tooltipContent}<a href="#{tooltipLink}" target="#{target}" class="#{@options.className}__link">#{@options.linkText}</a></div>"""
      @$tooltip = $(tmpl)

      #Clean Up
      tooltipContent = null
      tooltipLink = null
      tmpl = null

      @init()

    offsetRelative: (rel)->
      $thisOffset = @$el.offset()

      $rel = $(rel)
      $relOffset = $rel.offset()

      offset = {}

      offset.top = $thisOffset.top - $relOffset.top
      offset.left = $thisOffset.left - $relOffset.left
      offset

    init: ->
      # Place initialization logic here
      # You already have access to the DOM element and the options via the instance,
      # e.g., @element and @options
      @calibrate()
      @options.timer = null

      @$el.on "click", (e)->
        return false
      
      @$el.on "mouseenter", @mouseenter
      @$el.on "mouseleave", @mouseleave

    tooltipEnter: =>
      clearTimeout @options.timer

    calibrate: ->
      @$tooltip.css
        "opacity": 0
        "position": "absolute"
      .appendTo("body")
      @options.height = @$tooltip.outerHeight()
      @options.width = @$tooltip.outerWidth()

      @options.targetWidth = @$el.outerWidth()
      @$tooltip.remove()

    animateIn: =>
      @$tooltip.stop(true, true).animate
        "opacity": 1
      , 100

    position: (callback)=>
      offsetBody = @offsetRelative("body")

      getTop = =>
        offsetBody.top - ((@options.height) + parseInt(@$tooltip.css('margin-bottom')))

      getLeft = =>
        offsetBody.left - ((@options.width / 2) - (@options.targetWidth / 2))

      @$tooltip.css
        "position": "absolute"
        "top": getTop()
        "left": getLeft()

      callback()

    mouseenter: ()=>
      clearTimeout(@options.timer)
      @$tooltip.remove()
      @$tooltip.appendTo("body")
      @position(@animateIn)
      @$tooltip.off "mouseenter"
      @$tooltip.off "mouseleave"
      @$tooltip.on "mouseenter", @tooltipEnter
      @$tooltip.on "mouseleave", @mouseleave
      @$tooltip.find(".#{@options.className}__link").off "click"
      @$tooltip.find(".#{@options.className}__link").on "click", (e)->
        link = $(e.currentTarget).attr('href')
        $(document).trigger 'toolpop:linkClick',
          url: link

    mouseleave: ()=>
      @options.timer = setTimeout ()=>
        @$tooltip.stop(true, true).animate
          "opacity": 0
        , 100, ()->
          $(this).remove()
      , 100
      # some logic

  # A really lightweight plugin wrapper around the constructor,
  # preventing against multiple instantiations
  $.fn[pluginName] = (options) ->
    @each ->
      if !$.data(@, "plugin_#{pluginName}")
        $.data(@, "plugin_#{pluginName}", new Plugin(@, options))
