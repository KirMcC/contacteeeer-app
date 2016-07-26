'use strict';

//Loading Dependices
var Backbone = require('backbone');
var dataStore = require('../utils/dataStore.js');
var $ = require('jquery');

module.exports = Backbone.View.extend({

    //Set the view div el with following class name
    className: 'js-filter-view',

    //Template called during rendering
    template: require('../templates/filterView.hbs'),

    //Delegate DOM events which should be bound to the view
    events: {
        'change #type-list': 'onFirstFilter',
        'change #populated-list': 'onFilterChange',
        'click .js-filter-reset': 'onFilterReset',
        'click .filter-arrow': 'toggleFilter',
        'focus .filter-form': 'showFilter',
        'focusout .filter-form': 'hideFilter'
    },

    /**
     * Creates a string of html markup by passing in the FilterModel data
     * to the set template.
     *
     * The template is then injected into the views DOM element.
     *
     *@return {object} - This views reference
     */
    render: function() {
        var filterHTML = this.template(this.model.toJSON());
        this.$el.html(filterHTML);
        this.filterSelection();
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

    filterSelection: function() {
        var contacts = dataStore.contacts;
        var filterObj = {};
        this.$el.find('.filter-arrow').html('<p>Filter</p>');

        var path = location.pathname.split('/');
        var filterType = path[1];
        var filterValue = decodeURIComponent(path[2]);

        if (path.length === 3) {
            this.$el.find('#populated-list').empty();
            var selectedType = filterType;

            this.$el.find('#type-list').val(selectedType);

            if (selectedType === 'gender') {
                this.appendOptions(dataStore.filter.get('filterGender'));
            } else {
                this.appendOptions(contacts.pluck('jobTitle'));
            }

            this.$el.find('#populated-list').val(filterValue);
            this.$el.find('.filter-arrow').html('<p>' + filterType + ': ' + filterValue + '</p>');

            filterObj[filterType] = filterValue;
            this.model.set('selectedFilterData', filterObj);
        }
    },

    /**
     * Function which takes to passed data and appends to the second filter.
     */
    appendOptions: function(listArray) {
        var secondFilter = this.$el.find('#populated-list');
        secondFilter.empty();
        listArray.forEach(function(value) {
            secondFilter.append('<option>' + value + '</option>');
        });
    },

    /**
     * Whenever the first select box changes. Calls a change event and
     * targets the current select box and retrieved it's value.
     *
     * Options element are then appended accordingly with correct value
     * depending on the selected type.
     *
     *@param {object} e - DOM event
     */
    onFirstFilter: function(e) {
        var contacts = dataStore.contacts;
        var secondFilter = this.$el.find('#populated-list');
        var field = $(e.currentTarget);
        var selectedVal = $('option:selected', field).val();
        secondFilter.empty();

        switch (selectedVal){
            case 'All':
                secondFilter.append('<option>Please choose type first</option>').trigger('change');
                break;
            case 'gender':
                var genderVal = dataStore.filter.get('filterGender');
                this.appendOptions(genderVal);
                break;
            case 'jobTitle':
                var jobTitleVal = contacts.pluck('jobTitle');
                this.appendOptions(jobTitleVal);
                break;
        }
    },

    /**
     * Get the selectFilter attribute located within the FilterModel,
     * and empty it's object. Set the values of both select box.
     * If all is a type value delete the models object or create a new object with
     * key and value.
     *
     * Set the new object to the filterModel to activate a change event in ContactCollection
     */
    onFilterChange: function() {

        var currentFilters = this.model.get('selectedFilterData');
        /*Empty the firstSelectedFilter object*/
        currentFilters = {};

        var type = $('#type-list option:selected').val();
        var item = $('#populated-list option:selected').val();

        if (type === 'All') {
            if (currentFilters.hasOwnProperty(item)) {
                delete currentFilters[item];
            }
        } else {
            currentFilters[type] = item;
        }

        this.$el.find('.filter-arrow').html('<p>' + type + ': ' + item + '</p>');
        this.$el.find('.filter-arrow').attr('aria-live', 'polite');
        this.$el.removeClass('show-filter');

        /*Set the type as key and item as value. e.g 'gender:female'*/
        this.model.set('selectedFilterData', currentFilters);
    },

    /**
     * On button click event, set the first select box to default and trigger a
     * change event to set second select box back to default.
     *
     * Empty the model object and pass the empty object to the filterModel.
     */
    onFilterReset: function() {
        this.$el.find('#type-list').prop('selectedIndex', 0).trigger('change');

        /*Empty the firstSelectedFilter object*/
        this.currentFilters = {};
        this.$el.find('.filter-arrow').html('<p> Filter </p>');
        this.model.set('selectedFilterData', this.currentFilters);
    },

    toggleFilter: function() {
        this.$el.find('.filter-arrow').removeAttr('aria-live', 'polite');
        this.$el.toggleClass('show-filter');
    },

    showFilter: function() {
        this.$el.find('.filter-arrow').removeAttr('aria-live', 'polite');
        this.$el.addClass('show-filter');
    },

    hideFilter: function() {
        this.$el.removeClass('show-filter');
    }
});
