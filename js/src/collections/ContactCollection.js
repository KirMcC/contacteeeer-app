'use strict';

//Loading dependencies
var Backbone = require('backbone');
var ContactModel = require('../models/ContactModel');
var EventBus = require('../utils/EventBus');
var AppRouter = require('../utils/AppRouter');

module.exports = Backbone.Collection.extend({

    //Store this model within this collection
    model: ContactModel,

    //Reference this collection to the following URL
    url:  '/contacts',

    /**
     * On initialize load in the model data and set the filter model.
     * Set up listeners to listen for any DOM events such as,
     * Listen for any changes in the filter model.
     *
     * Listen for a MODAL_STRING for alert messages when the user leaves the page for delete, edit and add.
     *
     * Listen for a delete profile event when clicked on either grid or profile view.
     *
     * Listen for reset when the collection's entire content has been replaced.
     *
     *@param {object} model - JSON data from server
     *@param {object} options - Filtermodel for filtering purposes
     *
    */
    initialize: function(model, options) {
        this.appRouter = new AppRouter();
        this.filterModel = options.filterModel;
        this.bindListeners();
    },

    bindListeners: function() {
        this.listenTo(this.filterModel, 'change', this.onFilterChange);

        this.listenTo(EventBus, EventBus.eventKeys.MODAL_STRING, this.getModalType);
        this.listenTo(EventBus, EventBus.eventKeys.DEL_PROFILE, this.onProfileDel);
        this.listenTo(this, 'reset', this.onReset);
    },

    /**
     * When filter is called and changed the filter model,
     * call the applyFilter function passing the updated selected filter object.
     *
     *@return {object} - the filterModel object 'selectedFilter'
     */
    onFilterChange: function() {
        return this.applyFilter(this.filterModel.get('selectedFilterData'));
    },

    /**
     * ApplyFilter called after onFilterChange.
     *
     * Passes the updated filtered object value from the filterModel('selectedFilter') and
     * compares it to the models object (Contact details). The result is then set into displayModal.
     *
     * If a match is found, this then triggers the collection_filtered event and returns
     * the new updated displayModels.
     *
     *@param {object} filters - The selected filter object.
     *@return {object} - Contact models matching the filter object
     *
     */
    applyFilter: function(filters) {
        var toastString = '';
        this.displayModels = this.where(filters);
        if (this.displayModels.length === 0) {

            toastString = '<div style="background-color:#B42525;" class="toast-message">';
            toastString += 'No contact found!';
            toastString += '</div>';

            EventBus.trigger(EventBus.eventKeys.SHOW_UPDATE, toastString);
            EventBus.trigger(EventBus.eventKeys.COLLECTION_FILTERED);
            return toastString;

        } else {
            if (Object.getOwnPropertyNames(filters).length > 0) {
                for (var key in filters) {
                    this.appRouter.navigate(key + '/' + filters[key]);
                }
            } else {
                this.appRouter.navigate('/');
            }
            EventBus.trigger(EventBus.eventKeys.COLLECTION_FILTERED);
            return this.displayModels;
        }
    },

    /**
     * On a collection reset set the contact details as a displayModel object,
     * to keep the original contact details on filter event.
     *
     *@return {object} - display model containing the contact details model.
     *
     */
    onReset: function() {
        this.displayModels = this.models;
        return this.displayModels;
    },

    /**
     *
     * Find the correct contact detail matching ID.
     * Check to type of modal, if delete or edit set the type of modal within a new object,
     * with the contact details.
     *
     * Otherwise just set the type of modal within object.
     *
     *@param {array} modalArray - passing the selected contacts id and type of event
     *(delete,add,edit)
     *
     *@return {array} - Type of alert with the matching contact details.
     *
     */
    getModalType: function(modalArray) {
        var typeOfModal = modalArray[0];
        var modalObject = {};
        if (typeOfModal === 'delete' || typeOfModal === 'edit') {
            var contactDetail = this.get(modalArray[1]).toJSON();
            modalObject = contactDetail;
            modalObject[typeOfModal] = typeOfModal;
        } else {
            modalObject[typeOfModal] = typeOfModal;
        }
        EventBus.trigger(EventBus.eventKeys.MODAL_BOX, modalObject);
        return modalObject;
    },

    /**
     *
     * Get contact model matching the param ID value, once found destroy
     * this model.
     *
     * After trigger an event to render the girdview, set the html string message and trigger the udpate event.
     * This will display an toast message detailing the deleted contact within the app.
     *
     *
     *@param {integer} id - Unique id number
     *@return {string} - string message detailing the deleted contact.
     *
     */
    onProfileDel: function(id) {
        var self = this;

        var contactDetails = this.get(id);
        var firstName = contactDetails.get('firstName');
        var lastName = contactDetails.get('lastName');

        contactDetails.destroy({
            success: function() {

                //Used to refresh after a filter change has occured, otherwise grid won't render.
                self.onFilterChange();

                var statusString = firstName + ' ' + lastName + ' deleted!';
                EventBus.trigger(EventBus.eventKeys.SHOW_UPDATE, statusString);
            }
        });
    }

});
