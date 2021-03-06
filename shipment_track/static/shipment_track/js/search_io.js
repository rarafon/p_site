var io = {
    trackingList: null,
    searchForm: null,
    get_types_url: get_types_url,
    postAjax_url: postAjax_url,
    csrf_token: null,

    load: function() {
        this.csrf_token = io.get_csrf();
        this.searchForm = new SearchForm("search-form", this);
        this.trackingList = new TrackingList("tracking-list-container", get_data_url, this);

        var that = this;
        var csvButton = document.getElementById("exportCSVButton");
        csvButton.addEventListener("click", function(e) {
            e.preventDefault();
            that.trackingList.createCSV();
        });
    },
    get_csrf: function() {
        var csrf_input = document.getElementsByName('csrfmiddlewaretoken')[0];
        return csrf_input.value;
    },
    
    get_tracking_data: function(get_data_url, response_func) {
        controller.get_tracking_data(get_data_url, response_func);
    },
    get_tracking_types: function(response_func) {
        controller.get_tracking_types(this.get_types_url, response_func);
    },
    submitSearchForm: function(formData) {
        formData.append("ajax_command", "getTrackingData");
        var that = this;

        controller.postAjax(
            this.postAjax_url, this.csrf_token, formData
        ).then(function(trackingNum_json) {
            var trackingNumId,
                dataObj,
                trackingNum_obj = JSON.parse(trackingNum_json);

            that.trackingList.clearList();
            for (trackingNumId in trackingNum_obj) {
                dataObj = trackingNum_obj[trackingNumId]
                that.trackingList.add_tracking_num(trackingNumId, dataObj, true);
            }
            
        }, function(error) {
            console.log("error with submitting search form");
        });
    },
    delete: function(id) {
        var that = this;
        var formData = new FormData();
        formData.append("id", id);
        formData.append("ajax_command", "delete_tracking_num");

        controller.postAjax(
            that.postAjax_url, this.csrf_token, formData
        ).then(function(response) {
            that.trackingList.remove_tracking_num(id);
        }), function(error) {
            console.log("Error with delete", error);
        };
    },
};

class SearchForm {
    constructor(formId, ioController) {
        this.io_controller_ref = ioController;
        this.typeInputObj = new TypeInput(this, false, true);
        this.form = document.getElementById("search-form");
        this.load();
    }

    addButtonHandlers() {
        var that = this;
        this.form.addEventListener("submit", function(e) {
            e.preventDefault();
            that.submitHandler(e);
        });
    }

    submitHandler(e) {
        e.preventDefault();
        var formData = this.getData();
        this.io.submitSearchForm(formData);
    }

    load() {
        this.addButtonHandlers();
    }

    get io() {
        return this.io_controller_ref;
    }

    getData() {
        var formData = new FormData(this.form);
        return formData;
    }
}

window.onload = function() {
    io.load();
};