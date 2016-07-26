'use strict';

//Loading dependencies
var Backbone = require('backbone');
var $ = require('jquery');

//Views to render
var LandingView = require('./views/LandingView');
var AddContactView = require('./views/AddContactView');
var EditcontactView = require('./views/EditContact');
var ProfileLanding = require('./views/ProfileLanding');

var ModalView = require('./views/ModalView');

var LoaderView = require('./views/Loader');

//Router
var AppRouter = require('./utils/AppRouter.js');

//Events keys
var EventBus = require('./utils/EventBus.js');

//Data storage
var dataStore = require('./utils/dataStore');
var ContactCollection = require('./collections/ContactCollection');
var FilterModel = require('./models/FilterModel');

var AppView = Backbone.View.extend({

    //Attach the view with element using this classname
    el: '.js-main-container',

    //Set an object with page reference and view name for the route function
    routeToViewMap: {
        'landing': LandingView,
        'add': AddContactView,
        'edit': EditcontactView,
        'view': ProfileLanding
    },

    /**
     * On startup setup the dataStore with the contacts data and filter data.
     * Instantiate the router for client-side routing.
     *
     * We then set up listeners to listen for any events that require a view change,
     * listen for any update to show toast message detailing changes,
     * listen for a delete event when a profile has been deleted,
     * listen for a modal box event.
     *
     * Listen only once for a collection reset, this will start to monitor changes in the URL using backbone.history.start,
     * then set to use pushState not hashChange URL.
     *
     */
    initialize: function() {

        var self = this;

        //Navigate using keyboard keys alt + b
        $(window).on('keydown', function(e) {
            if (e.which === 66 && e.altKey) {
                window.location.href = '/';
            }

            //Navigate using keyboard keys alt + a
            if (e.which === 65 && e.altKey) {
                window.location.href = '/add';
            }
        });

        this.setupDataStore();

        this.appRouter = new AppRouter();

        this.bindAppListeners();

        this.loaderView = new LoaderView({
            el: '.js-loader'
        });

        //Event Delegation to find any click events with the class from the parent.
        this.$el.on('click', '.js-app-link', function(event) {
            event.preventDefault();
            var linkHref = $(this).attr('href');

            //Update the URL and call function by setting trigger: true
            self.appRouter.navigate(linkHref, {trigger: true});
        });

        /* jshint ignore:start */
        dataStore.contacts.reset(contactsData);
        /* jshint ignore:end */
    },

    bindAppListeners: function() {
        this.listenTo(EventBus, EventBus.eventKeys.CHANGE_PAGE, this.onChangePage);
        this.listenTo(EventBus, EventBus.eventKeys.SHOW_UPDATE, this.onShowUpdate);
        this.listenTo(EventBus, EventBus.eventKeys.ON_DEL, this.onDelete);
        this.listenTo(EventBus, EventBus.eventKeys.MODAL_BOX, this.showModal);
        this.listenToOnce(dataStore.contacts, 'reset', function() {
            Backbone.history.start({pushState: true});
        });
    },

    /**
     * Instantiate the filterModel to dataStore.filter.
     *
     * Construct an instances for the contactsCollecton passing null for models
     * to create an empty Collection with options.
     *
     * The Contact data is not passed until a collection reset event, this will stop any contact details being
     * overwritten when a filter event occurs.
     *
     * Pass the dataStore.filter model as one of the options.
     */
    setupDataStore: function() {
        dataStore.filter = new FilterModel();
        dataStore.contacts = new ContactCollection(null, {
            filterModel: dataStore.filter
        });
    },

    /**
     * On page change the if a view and modal is set already, dispose of it to avoid zombie views.
     *
     * Check if the pageName array length is more than 1.
     * If true, instantiate a new view passing the contact matching
     * the id and render it. (Editview and AddContactView).
     *
     * If less than 1 then instantiate the new view and render it. Showing the loader view,
     * on transtion.
     *
     *@param {array} pageName - contains view name reference and possibly a unique contact ID.
     *
     */
    onChangePage: function(pageName) {
        var self = this;
        var oldViewHidden = $.Deferred();

        if (self.currentView) {
            this.$el.fadeOut(600, function() {
                oldViewHidden.resolve();
            });

            EventBus.trigger(EventBus.eventKeys.LOADER_SHOW);

        } else {
            EventBus.trigger(EventBus.eventKeys.LOADER_SHOW);
            this.$el.hide();
            oldViewHidden.resolve();
        }

        $.when(oldViewHidden).then(function() {
            if (self.currentView) {
                self.currentView.dispose();
                self.currentView = null;
            }

            if (pageName.length > 1) {
                self.currentView = new self.routeToViewMap[pageName[0]]({
                    model: dataStore.contacts.get(pageName[1])
                });
                self.$el.append(self.currentView.render().el);
                EventBus.trigger(EventBus.eventKeys.LOADER_HIDE);
                self.$el.fadeIn(500);
            } else {
                self.currentView = new self.routeToViewMap[pageName]();
                self.$el.append(self.currentView.render().el);
                EventBus.trigger(EventBus.eventKeys.LOADER_HIDE);
                self.$el.fadeIn(500);
            }
        });
    },

    /**
     * When a profile has been deleted trigger the router directing the user back to the landing page.
     *
     */
    onDelete: function() {
        this.appRouter.navigate('/', {trigger: true});
    },

    /**
     * When any changes have been made in the app (delete, edit or add) display a toast message,
     * detailing the correct update message.
     *
     * Set a timer show toast message then hide.
     *
     *@param {string} status - HTML string containing udpate message.
     *
     */
    onShowUpdate: function(status) {
        var toastMessage = this.$el.find('.toast-message');
        var hideShow = $(toastMessage).removeClass('on-out on-show');
        toastMessage.empty();

        toastMessage.append(status);

        function transitionEnd() {
            hideShow.addClass('on-out');
            hideShow.removeClass('on-show');
        }

        //Used to activate transition on page change
        setTimeout(function() {
            hideShow.addClass('on-show');
        }, 800);

        toastMessage.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
        transitionEnd);
    },

    /**
     * When a user attempts to leave a incomplete form or deleting a profile,
     * render the modal box view containing a confirmation message
     *
     * Instiatiate the modalView passing the modalData object and render the view.
     *
     *@param {array} modalData - Object containg the type of modal to show,
     * with possible contact details.
     *
     */
    showModal: function(modalData) {
        this.modalView = new ModalView({
            model: modalData
        });

        this.$el.append(this.modalView.render().el);
    }
});

//Instatiate the AppView
new AppView();
