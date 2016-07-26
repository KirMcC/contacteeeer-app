//Loading dependencies
var Backbone = require('backbone');
var $ = require('jquery');
var EventBus = require('../utils/EventBus');
var ContactModel = require('../models/ContactModel');
var dataStore = require('../utils/dataStore');
var AppRouter = require('../utils/AppRouter');

module.exports = Backbone.View.extend({

    //Attach the view with element using this classname
    className: 'js-addcontact-page',

    //Require the template to be rendered
    template: require('../templates/addContactView.hbs'),

    //Delegate DOM events which should be bound to the view
    events: {
        'click .js-add-contact': 'onAddClick',
        'click .js-form-back': 'onBackClick',
        'change input': 'onEdit'
    },

    //Start the router for navigation purpose
    initialize: function() {
        this.appRouter = new AppRouter();
    },

    /**
     * Creates a string of html markup.
     * The template is then injected into the views DOM element.
     *
     *@return {object} - This views reference
     */
    render: function() {
        this.$el.html(this.template());
        return this;
    },

    /**
     * If any of the form input have been changed on input, flag a message
     * detailing unsaved changes have been made.
     *
     *@param {object} event -DOM event
     */
    onEdit: function() {
        var input = this.$el.find('.edit-form input');

        for (var i = 0; i < input.length; i++) {
            // only validate the inputs that have the required attribute
            if (input[i].hasAttribute('aria-required', 'required')) {
                if (input[i].value === '') {
                    // found an empty field that is required
                    this.$el.find('.message').removeClass('on-open');
                    this.$el.find('.message').attr('aria-hidden', 'true');
                } else {
                    this.$el.find('.message').addClass('on-open');
                    this.$el.find('.message').attr('aria-hidden', 'false');
                    break;
                }
            }
        }
    },

    /**
     * Gather all of the inputed values and instatiate a new ContactModel passing each of the
     * input values.
     *
     * Check if the modal is valid, if not display error messages,
     * else add the new modal to collection by creating a new instance of the modal.
     *
     * Once created direct back to landing page and notify an update has been made.
     *
     *
     */
    onAddClick: function(event) {
        var self = this;
        event.preventDefault();

        this.$el.find('.errorMessage').remove();
        this.$el.find('.edit-form :input').attr('aria-invalid', 'false');
        var contact = new ContactModel({
            gender: this.$el.find('.selGender option:selected').val(),
            firstName: this.$el.find('[name="firstName"]').val(),
            lastName: this.$el.find('[name="lastName"]').val(),
            jobTitle: this.$el.find('[name="jobTitle"]').val(),
            email: this.$el.find('[name="email"]').val(),
            image: '500/500'
        });

        if (!contact.isValid()) {
            this.showErrors(contact.validationError);
        } else {
            dataStore.contacts.create(contact, {
                success: function() {
                    var firstName = contact.get('firstName');
                    var lastName = contact.get('lastName');
                    var statusString = firstName + ' ' + lastName + ' added!';

                    EventBus.trigger(EventBus.eventKeys.SHOW_UPDATE, statusString);
                    dataStore.contacts.displayModels = dataStore.contacts.models;
                    self.appRouter.navigate('/', {trigger: true});
                }
            });
        }
    },

    /**
     * Loop through each validation error and set message in html string.
     * Match the error name to the corresponding form input name.
     * Append the error message after the form input
     *
     *@param {object} errors - contans error feedback from contactModel
     */
    showErrors: function(errors) {
        var nodeFocus = [];
        errors.forEach(function(error) {
            var errorElement = $('<span id="' + error.name + '" class="errorMessage"></span>').html(error.message);
            var matchInput = this.$el.find('[name="' + error.name + '"]');
            matchInput.after(errorElement);
            matchInput.attr({'aria-invalid': 'true', 'aria-labelledby': error.name});
            nodeFocus.push(matchInput);
        }, this);
        nodeFocus[0].focus();
    },

    /**
     * If the flag message is shown then trigger and event to show modal box,
     * when user attempts to leave page with incomplete form.
     *
     * Else redirect straight back to landing page.
     */
    onBackClick: function(event) {
        var checkClass = this.$el.find('.message').hasClass('on-open');
        event.preventDefault();

        if (checkClass) {
            EventBus.trigger(EventBus.eventKeys.MODAL_STRING, ['add']);
        } else {
            window.history.back();
        }
    },

    /**
     * Disposes this view when called by an event listener called from
     * AppView on change page.
     *
     *@return {object} - this views reference
     */
    dispose: function() {
        return this.remove();
    }
});
