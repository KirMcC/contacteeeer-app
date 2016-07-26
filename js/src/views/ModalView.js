'use strict';

//Loading dependencies
var Backbone = require('backbone');
var $ = require('jquery');
var AppRouter = require('../utils/AppRouter');
var EventBus = require('../utils/EventBus');

module.exports = Backbone.View.extend({

    //Set the view div el with following class name
    className: 'js-modal-dialog',

    //Set the classname to toggle the modal view
    showClass: 'show-dialog',

    //Using this template for rendering.
    template: require('../templates/modalView.hbs'),

    /**
     * On a keydown event, check if the element has the showClass class attached
     * and if it's the esc key. Close the modal if both statements are true.
     */
    initialize: function() {
        var self = this;
        this.appRouter = new AppRouter();
        $(window).on('keydown', function(e) {
            if (self.$el.hasClass(self.showClass) && e.which === 27) {
                self.hideModal();
            }
        });
    },

    //Delegate DOM events which should be bound to the view
    events: {
        'click .js-cancel-btn': 'hideModal',
        'click .js-delete-contact': 'onDeleteClick',
        'click': 'hideModal',
        'click .js-edit-back': 'navBack',
        'click .inner': 'onStopRemove'
    },

    /**
     * Creates a string of HTML markup containg to correct contact details
     * by passing the model containing JSON data.
     *
     * The modal is then shown by adding the show-dialog to the element.
     *
     *@return {object} - returns the view reference.
     */
    render: function() {
        this.$el.html(this.template(this.model));
        this.showModal();
        return this;
    },

    //Attaches the show-dialog class to the element.
    showModal: function() {
        this.$el.addClass(this.showClass);
    },

    //Dispose of the modal view
    hideModal: function() {
        this.dispose();
    },

    //Stops the modal from closing if user clicks on the modal box.
    onStopRemove: function(e) {
        e.stopPropagation();
    },

    //Trigger the delete profile event and dispose of the modal view
    onDeleteClick: function() {
        EventBus.trigger(EventBus.eventKeys.DEL_PROFILE, this.model.id);
        this.dispose();
        this.appRouter.navigate('/', {trigger: true});
    },

    navBack: function() {
        this.hideModal();
        window.history.back();
    },

    //Remove the class and remove the modal
    dispose: function() {
        this.$el.removeClass(this.showClass);
        return this.remove();
    }

});
