'use strict';

//Loading dependencies
var Backbone = require('backbone');
var EventBus = require('./EventBus.js');

module.exports = Backbone.Router.extend({

    routes: {
        '': 'landing',
        'add': 'addContact',
        'edit/:id': 'editContact',
        'view/:id': 'viewContact',
        ':type/:value': 'filterView'
    },

    //Trigger the event from the EventBus for CHANGE_PAGE
    landing: function() {
        EventBus.trigger(EventBus.eventKeys.CHANGE_PAGE, ['landing']);
    },

    addContact: function() {
        EventBus.trigger(EventBus.eventKeys.CHANGE_PAGE, ['add']);
    },

    editContact: function(profile) {
        EventBus.trigger(EventBus.eventKeys.CHANGE_PAGE, ['edit', profile]);
    },

    viewContact: function(profile) {
        EventBus.trigger(EventBus.eventKeys.CHANGE_PAGE, ['view', profile]);
    },

    filterView: function() {
        EventBus.trigger(EventBus.eventKeys.CHANGE_PAGE, ['landing']);
    }
});

