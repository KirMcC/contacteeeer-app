'use strict';

//Loading Dependencies
var Backbone = require('backbone');
var _ = require('underscore');

/**
* Return the eventskeys object to the Backbone.Events method
* each event name can be used when called on another module e.g appView
*/
module.exports = _.extend({
    eventKeys: {
        CHANGE_PAGE: 'route:landing',

        COLLECTION_FILTERED: 'contacts:filtered',
        UPDATE_GRID: 'Grid:render',
        SHOW_UPDATE: 'app:toastMessage',
        MODAL_BOX: 'app:modal',

        MODAL_STRING: 'collection:modal',
        DEL_PROFILE: 'collection:delete',
        ON_DEL: 'profile:onDelete',

        LOADER_SHOW: 'loader:show',
        LOADER_HIDE: 'loader:hide'
    }
}, Backbone.Events);
