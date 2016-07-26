'use strict';

//Loading dependencies
var Backbone = require('backbone');
var EventBus = require('../utils/EventBus');
var AppRouter = require('../utils/AppRouter');

module.exports = Backbone.View.extend({

    //Set the element to render out as li
    tagName: 'li',

    //Set the view div el with following class name
    className: 'contact-item',

    //Template called during rendering
    template: require('../templates/griditem.hbs'),

    //Delegate DOM events which should be bound to the view
    events: {
        'click .js-del-contact': 'onDeleteClick'
    },

    //Start the router for navigation purpose
    initialize: function() {
        this.appRouter = new AppRouter();
    },

    /**
     * Creates a string of html markup using the modal data
     * to the set template.
     *
     * The template is then injected into the views DOM element.
     *
     *@return {object} - This views reference
     */
    render: function() {
        var modelHTML = this.template(this.model.toJSON());
        this.$el.html(modelHTML);
        return this;
    },

    onListClick: function() {
        var modelID = this.model.id;
        this.appRouter.navigate('view/' + modelID + '', {trigger: true});
    },
    /**
     * Disposes this view when called by an event listener called from
     * AppView on change page.
     *
     *@return {object} - this views reference
     */
    dispose: function() {
        this.remove();
    },

    /**
     * Get the clicked elements idData attribute.
     * Then trigger the modal string event and pass type of message and the attribute ID to show correct string.
     *@param {object} event - clicked DOM element
     */
    onDeleteClick: function(event) {
        var contactID = event.currentTarget.getAttribute('id-data');
        EventBus.trigger(EventBus.eventKeys.MODAL_STRING, ['delete', parseInt(contactID, 10)]);
    }

});

