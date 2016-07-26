'use strict';
//Loading dependencies
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var dataStore = require('../utils/dataStore');
var EventBus = require('../utils/EventBus');
var AppRouter = require('../utils/AppRouter');

module.exports = Backbone.View.extend({

    //Set the view div el with following class name
    className: 'js-editcontact-view',

    //Require to template to be rendered
    template: require('../templates/editContact.hbs'),

    //Attach a click event to the DOM
    events: {
        'click .js-edit-contact': 'onEditClick',
        'click .js-form-back': 'onBackClick',
        'change input': 'onEdit'
    },

    //Start the router for navigation purpose
    initialize: function() {
        this.appRouter = new AppRouter();
    },

    /**
     * Create a string of html markup, passing in the model data,
     * to get the correct contact data
     *
     *@return {object} - reference to this view
     *
     */
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.setGender();
        return this;
    },

    /**
     * When a change has been made in any of the input elements,
     * loop through the contact object get each of the form values.
     *
     * After, find the matching property keys in the model with the contacts property values.
     *
     * If any of the forms values don't match the saved contact details, display a flag message.
     *
     * Otherwise hide the flag message.
     *
     * @ param {object} event - The DOM event
     */
    onEdit: function() {
        var contact = {
            gender: this.$el.find('.selGender option:selected').val(),
            firstName: this.$el.find('[name="firstName"]').val(),
            lastName: this.$el.find('[name="lastName"]').val(),
            jobTitle: this.$el.find('[name="jobTitle"]').val(),
            email: this.$el.find('[name="email"]').val()
        };

        var modelAtt = this.model.attributes;

        for (var prop in contact) {
            //Get each form values
            var modelVals = contact[prop];
            //Find matching property keys in model, returns object
            var pick = _.pick(modelAtt, prop);
            if (modelVals != pick[prop]) {
                this.$el.find('.message').addClass('on-open');
                this.$el.find('.message').attr('aria-hidden', 'false');
                break;
            } else {
                this.$el.find('.message').removeClass('on-open');
                this.$el.find('.message').attr('aria-hidden', 'true');
            }
        }
    },

    /**
     * Get each of the values from the edit form.
     * Get the correct contact model matching the clicked elements idData attribute.
     *
     * Once the correct contact detail is selected, save the updates only if validation passes.
     *
     * If inputted data contains validation error call showErrors passing the validation error messages.
     *
     * If the details are validated, update the selected model and redirect back to home page, by triggering
     * the route function. Then trigger the toast message passing the correct html string message.
     *
     *
     *@param {object} e - clicked element object
     *
     */
    onEditClick: function(event) {
        this.$el.find('.errorMessage').remove();
        event.preventDefault();

        var contact = {
            gender: this.$el.find('.selGender option:selected').val(),
            firstName: this.$el.find('[name="firstName"]').val(),
            lastName: this.$el.find('[name="lastName"]').val(),
            jobTitle: this.$el.find('[name="jobTitle"]').val(),
            email: this.$el.find('[name="email"]').val()
        };

        var contactId = dataStore.contacts.get(event.currentTarget.getAttribute('id-data'));
        var test = contactId.save(contact);

        if (test === false) {
            this.showErrors(this.model.validationError);
        } else {
            var firstName = contact.firstName;
            var lastName = contact.lastName;

            var statusString = firstName + ' ' + lastName + ' updated!';
            EventBus.trigger(EventBus.eventKeys.SHOW_UPDATE, statusString);
            this.appRouter.navigate('/', {trigger: true});
        }
    },

    /**
     * Whenever the cancel button is clicked, it first checks if the unsaved
     * flagged message is shown.
     *
     * If shown this will trigger an event that will, get the clicked elements idData attribute.
     * Then trigger the modal string event and pass type of message and the attribute ID to show correct string.
     *
     * If no flag message is shown it will update the URL for the landing page (/)
     * triggering the route function.
     *
     *@param {object} event - clicked DOM element
     *
     */
    onBackClick: function(event) {
        event.preventDefault();
        var checkClass = this.$el.find('.message').hasClass('on-open');

        if (checkClass) {
            var contactID = event.currentTarget.getAttribute('id-data');
            EventBus.trigger(EventBus.eventKeys.MODAL_STRING, ['edit', parseInt(contactID)]);
        } else {
            window.history.back();
        }
    },

    /**
     * Append the error message in the view.
     * Error message retreived from the ContactModel validation.
     *
     *@params {object} errors - Error message to display
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
        console.log(nodeFocus[0]);
        nodeFocus[0].focus();
    },

    //Set the select box to match the model gender property.
    setGender: function() {
        var gender = this.model.get('gender');
        this.$el.find('.selGender').val(gender);
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
