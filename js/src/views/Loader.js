'use strict';

//Loading dependencies
var Backbone = require('backbone');
var EventBus = require('../utils/EventBus');

module.exports = Backbone.View.extend({

    visibilityClass: 'show',

    initialize: function() {
        this.listenTo(EventBus, EventBus.eventKeys.LOADER_SHOW, this.onLoaderShow);
        this.listenTo(EventBus, EventBus.eventKeys.LOADER_HIDE, this.onLoaderHide);
    },

    onLoaderShow: function() {
        this.$el.addClass(this.visibilityClass);
    },

    onLoaderHide: function() {
        this.$el.removeClass(this.visibilityClass);
    },

    dispose: function() {
        return this.remove();
    }

});
