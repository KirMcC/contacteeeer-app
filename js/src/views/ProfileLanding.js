'use strict';

//Loading dependencies
var Backbone = require('backbone');
var EventBus = require('../utils/EventBus');

module.exports = Backbone.View.extend({
    //Sets the div class name within this view
    className: 'js-profile-landing',

    //Require this template to render
    template: require('../templates/profileLanding.hbs'),

    //Delegate DOM events which should be bound to the view
    events: {
        'click .js-del-contact': 'onDeleteClick',
        'click .js-profile-back': 'onBackClick'
    },

    /**
     * Creates a string of html markup, passing corresponding model
     * to input correct contact details from ID.
     *
     * Pass in element to find and the contact details.
     * Renders each contact detail within the profileView
     *
     *@return {object} - this view reference
     */
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    /**
     * Disposes this view when called by an event listener called from
     * AppView on change page.
     *
     *@return {object} - this views reference
     */
    dispose: function() {
        return this.remove();
    },

    /**
     * Get the clicked elements idData attribute.
     * Then trigger the modal string event and pass type of message and the attribute ID to show correct string.
     *
     *@param {object} event - clicked DOM element
     *
     */
    onDeleteClick: function(event) {
        event.preventDefault();
        var contactID = event.currentTarget.getAttribute('id-data');
        EventBus.trigger(EventBus.eventKeys.MODAL_STRING, ['delete', parseInt(contactID, 10)]);
    },

    onBackClick: function() {
        window.history.back();
    }
});
