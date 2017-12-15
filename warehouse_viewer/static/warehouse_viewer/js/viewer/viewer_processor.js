var viewer_processor = {
    prev_search_form_data: null,
    prev_search_data: null,
    submit_search: function(form_element) {
        var form_data = helper_functions.form_element_to_form_data(form_element),
            form_url = form_element.target.action,
            form_method = form_element.target.method;

        var prev_form_data;

        prev_form_data = this.prev_search_form_data;
        $.ajax({
            // warehouse_viewer.search_ajax
            url: form_url,
            data: form_data,
            method: form_method,
            success: function(data) {
                // TODO SAVE PROCESSED DATA
                viewer_processor.create_map(form_data, data);
            },
        });
    },
    create_map: function(form_data, data) {
        var data_mode = form_data["mode"],
            data_type = form_data['data-type'];

        var proccessed_data = viewer_processor.process(form_data, data);

        console.log(proccessed_data);
        viewer.display(data_mode, data_type, proccessed_data, form_data);

        side_menu.renew_submitButton();
    },
    process: function(form_data, data) {
        /**
         * Handles processing thru JS,
         *  after retrieving the data
         */
        console.log(form_data);

        var mode = form_data["mode"],
            data_type = form_data["data-type"],
            level = form_data["level"],
            level_modifier = form_data["level-modifier"];

        if (mode == "map") {

        } else if (mode == "chart") {
            if (data_type == "item_type_filter") {
                if (level != "all") {
                    data["item-type-filter"] = helper_functions.filter_locations_arr_by_level(
                        data["item-type-filter"],
                        level,
                        level_modifier,
                    );
                }

                data["item-type-filter"] = data["item-type-filter"].sort(
                    helper_functions.compare_locations);
            }
        }

        return data;
    },
    retrieve_data: function(form_data) {

    },
    save_data: function(form_data, data) {

    },
};

var helper_functions = {
    filter_location_arr: function() {

    },
    compare_locations: function(a, b) {
        var re = /^USLA\.(\w+)\.(\d+)\.(\d+)\.(\d+)/;
        var a_re_results = re.exec(a),
            b_re_results = re.exec(b);

        var a_area = a_re_results[1],
            a_aisle = a_re_results[2],
            a_column = a_re_results[3],
            a_level = a_re_results[4],
            b_area = b_re_results[1],
            b_aisle = b_re_results[2],
            b_column = b_re_results[3],
            b_level = b_re_results[4];

        if (a_area != b_area) {
            return a_area.localeCompare(b_area);
        } else if (a_aisle != b_aisle) {
            return parseInt(a_aisle) - parseInt(b_aisle);
        } else if (a_column != b_column) {
            return parseInt(a_column) - parseInt(b_column);
        } else if (a_level != b_level) {
            return parseInt(a_level) - parseInt(b_level);
        } else {
            return 0;
        }
    },
    filter_locations_arr_by_level: function(locations_arr, level, level_modification) {
        var filterer = (function compare_function() {
            if (level_modification == "lt") {
                return function(loc_level) {
                    return loc_level <= level;
                }
            } else if (level_modification == "gt") {
                return function(loc_level) {
                    return loc_level >= level;
                }
            } else {
                return function(loc_level) {
                    return loc_level == level;
                }
            }
        })();

        var i, re_result, level,
            locations_len = locations_arr.length,
            new_loc_arr = [],
            re = /\.(\d+)$/;

        for (i =0; i < locations_len; i++) {
            re_result = re.exec(locations_arr[i]);
            loc_level = re_result[1];
            if (filterer(loc_level)) {
                new_loc_arr.push(locations_arr[i]);
            }
        }
        return new_loc_arr;
    },
    form_element_to_form_data: function(form_element) {
        var $form = $( form_element.target ),
            data_array = $form.serializeArray();

        var form_data = {},
            i,
            data_arr_len = data_array.length;

        for (i = 0; i < data_arr_len; i++) {
             var data_dic = data_array[i];
             if (data_dic["name"] != "csrfmiddlewaretoken") {
                 form_data[data_dic["name"]] = data_dic["value"];
             }
        }
        return form_data;
    }
}