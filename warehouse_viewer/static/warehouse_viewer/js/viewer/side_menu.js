var side_menu = {
    form_id: "side-menu-form",
    container_id: "mode-settings-div",
    set_settings_from_mode: function () {
        var mode_type = $("#data-mode").val();

        this.clear_settings();

        var mode_settingsObj;
        switch (mode_type) {
            case "map":
                mode_settingsObj = map_mode_settings;
                break;
            case "chart":
                mode_settingsObj = chart_mode_settings;
                break;
            case "graph":
                mode_settingsObj = graph_mode_settings;
                break;
            default:
                return 1;
        };
        var $menu_div = mode_settingsObj.add_dataType(this.container_id);
    },
    clear_settings: function() {
        $("#" + this.container_id).empty();
    },
    make_submitButton_loading: function() {
        var $submit_button = $("#submit-button");
        $submit_button.prop("disabled", true);
        $submit_button.html("<i class='fa fa-spinner fa-pulse fa-2x '></i>");
    },
    renew_submitButton: function() {
        $("#submit-button").html("Submit");
    },
    submit: function(e) {
        var $form = $( e.target ),
            data_array = $form.serializeArray(),
            form_url = $form.attr("action"),
            form_method = $form.attr("method");

        var form_data = {},
            i,
            data_arr_len = data_array.length;

        for (i = 0; i < data_arr_len; i++) {
             var data_dic = data_array[i];
             if (data_dic["name"] != "csrfmiddlewaretoken") {
                 form_data[data_dic["name"]] = data_dic["value"];
             }
        }

        var data_mode = form_data["mode"],
            data_type = form_data['data-type'];

        this.make_submitButton_loading();

        $.ajax({
            url: form_url,
            data: form_data,
            method: form_method,
            success: function (data) {
                viewer.display(data_mode, data_type, data);
                side_menu.renew_submitButton();
            },
        });
    },
};


var map_mode_settings = {
    make_menu: function(container_id) {},
};


var chart_mode_settings = {
    container_id: null,
    add_dataType: function(container_id) {
        var data_select_id = element_ids.data_select_id,
            $container = $("#" + container_id),
            data_type_dic = {
                    "total_item_count": "Total Item Count",
                };

        this.container_id = container_id;

        var $dataType_select_div = settings_maker.data_type(data_type_dic, data_select_id);
        $container.append($dataType_select_div);

        // Make the subcontainer which will contain menu options
        $("<div>", {
            id: element_ids.options_container_id,
        }).appendTo($container);

        var $dataType_select = $("#" + data_select_id);

        $dataType_select.change(function(e){
            this.onchange_dataType();
        });

        this.onchange_dataType();

        return $container;
    },
    get_data_type: function() {
        var data_select_id = element_ids.data_select_id,
            $dataType_select = $("#" + data_select_id);

        return $dataType_select.val();
    },
    onchange_dataType: function() {
        var $options_container = $("#" + element_ids.options_container_id);
        $options_container.empty();

        var data_type = this.get_data_type();

        this.set_options(data_type, $options_container);
    },
    set_options: function(data_type, $options_container) {
        var $date_1 = settings_maker.date_input_1();
        $options_container.append($date_1);

        switch(data_type) {
            case "item_count":
                console.log("item_count");
                break;
        }
    },
};

var graph_mode_settings = {
    make_menu: function(container_id) {},
};

var element_ids = {
    options_container_id: "options-container",
    data_select_id: "data-type-select",
    date_select_1_id: "date-select-1",
    date_select_1_name: "date-1",
};

var settings_maker = {
    data_select_id: "data-type-select",
    data_type: function(data_type_dic) {
        /**
         * data_type_dic: object with the key being the value for the
         *  select html & value of the obj being the text.
         * Returns div containing label & select HTML for
         *  the data type.
         */
        var $div = $("<div class='form-group'>");

        $("<label>", {
            "for": this.data_select_id,
        }).html("Data Type").appendTo($div);

        var $select = $("<select>", {
            id: this.data_select_id,
            "class": "form-control",
            name: "data-type",
        }).appendTo($div);

        for (var data_type_value in data_type_dic) {
            $("<option>", {
                "value":  data_type_value,
            }).text(data_type_dic[data_type_value]).appendTo($select);
        }
        return $div
    },

    date_select_1_id: "date-select-1",
    date_select_1_name: "date-1",
    date_input_1: function() {
        /**
         * Returns div with bootstrap CSS format containing
         *  label & select HTML.
         */

        var $div,
            $date_select = $("<select>", {
            id: element_ids.date_select_1_id,
            name: element_ids.date_select_1_name,
            "class": "form-control",
        });

        $.ajax({
           url: dates_ajax_url,
            action: "get",
            data: {
               "num_dates": 20,
            },
            success: function(data){
               var i, data_len = data.length,
                    date_id, date_str, date_option;

               for (i = 0; i < data_len; i++){
                   date_obj = data[i];
                   date_id = date_obj["date_id"];
                   date_str = date_obj["date_string"];

                   $date_option = $("<option>",{
                       value: date_id,
                       text: date_str,
                   }).appendTo($date_select);
               }
            },
        });

        $div = $("<div class='form-group'>");

        $("<label>", {
            "for": element_ids.date_select_1_id,
        }).html("Date").appendTo($div);

        $div.append($date_select);
        return $div;
    },
};