var side_menu = {
    form_id: "side-menu-form",
    container_id: "mode-settings-div",
    load_side_menu: function() {
        this.set_settings_from_mode();

        $("input:radio[name=mode]").change(
            function() {
                side_menu.set_settings_from_mode();
            }
        )
    },
    set_settings_from_mode: function () {
        var mode = this.get_mode();

        this.clear_settings();

        var mode_settingsObj;
        switch (mode) {
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
        var $menu_div = mode_settingsObj.make_menu(this.container_id);
    },
    get_mode: function() {
        return $("input:radio[name=mode]:checked").val();
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
        var $submit_button = $("#submit-button");
        $submit_button.html("Submit");
        $submit_button.prop("disabled", false);
    },
    submit: function(e) {
        this.make_submitButton_loading();

        viewer_processor.submit_search(e, function() {
            side_menu.renew_submitButton();
        });
    },
};


var map_mode_settings = {
    make_menu: function(container_id) {
        var $container = $("#" + container_id),
            data_select_id = element_ids.data_select_id,
            data_type_dic = {
                "item_count": gettext("Item Count"),
            };

        var $dataType_select_div = settings_maker.data_type(data_type_dic, data_select_id);
        $container.append($dataType_select_div);

        var $options_container = settings_maker.options_container();
        $container.append($options_container);

        return $container;
    },
};


var chart_mode_settings = {
    make_menu: function(container_id) {
        var $container = $("#" + container_id),
            data_select_id = element_ids.data_select_id,
            data_type_dic = {
                "total_item_count": gettext("Total Item Count"),
                "empty_locations": gettext("Empty Locations"),
            };

        var $dataType_select_div = settings_maker.data_type(data_type_dic, data_select_id);
        $container.append($dataType_select_div);

        // Make the subcontainer which will contain menu options
        var $options_container = settings_maker.options_container();
        $container.append($options_container);

        var $dataType_select = $("#" + data_select_id);

        $dataType_select.change(function(e){
            chart_mode_settings.set_menu_from_dataType();
        });

        this.set_menu_from_dataType();

        return $container;
    },
    get_data_type: function() {
        var data_select_id = element_ids.data_select_id,
            $dataType_select = $("#" + data_select_id);

        return $dataType_select.val();
    },
    set_menu_from_dataType: function() {
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
            case "empty_locations":
                var $element_dic = settings_maker.loc_and_level_container();

                var $loc_div = $element_dic["$loc_div"],
                    $level_container = $element_dic["$level_container"];

                $options_container.append($loc_div);
                $options_container.append($level_container);

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
    data_select_name: "data-type",
    date_select_1_id: "date-select-1",
    date_select_1_name: "date-1",
    loc_select_name: "loc",
    loc_select_id: "loc-select",
    level_container_id: "level-container",
    level_modifier: "level-modifier",
    level_select_id: "level-select",
    level_select_name: "level",
};

var settings_maker = {
    data_type: function(data_type_dic) {
        /**
         * data_type_dic: object with the key being the value for the
         *  select html & value of the obj being the text.
         * Returns div containing label & select HTML for
         *  the data type.
         */
        var $div = $("<div class='form-group'>"),
            data_select_id = element_ids.data_select_id,
            data_select_name = element_ids.data_select_name;

        $("<label>", {
            "for": data_select_id,
        }).html(gettext("Data Type")).appendTo($div);

        var $select = $("<select>", {
            id: data_select_id,
            "class": "form-control",
            name: data_select_name,
        }).appendTo($div);

        for (var data_type_value in data_type_dic) {
            $("<option>", {
                "value":  data_type_value,
            }).text(data_type_dic[data_type_value]).appendTo($select);
        }
        return $div
    },
    options_container: function() {
        return $("<div>", {
            id: element_ids.options_container_id,
        })
    },
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
        }).html(gettext("Date")).appendTo($div);

        $div.append($date_select);
        return $div;
    },
    loc_select: function() {
        /**
         * Returns HTML input with locs S, P, F, VC.
         */
        var $div = $("<div class='form-group'>"),
            i,
            loc_select_id = element_ids.loc_select_id,
            loc_select_name = element_ids.loc_select_name,
            $loc_select,
            loc_arr = ["S", "P", "F", "VC",]
            arr_len = loc_arr.length;

        $("<label>", {
            "for": loc_select_id,
        }).html(gettext("Location")).appendTo($div);

        $loc_select = $("<select>", {
            id: loc_select_id,
            name: loc_select_name,
            "class": "form-control",
        });

        for (i = 0; i < arr_len; i++) {
            $date_option = $("<option>",{
               value: loc_arr[i],
               text: loc_arr[i],
           }).appendTo($loc_select);
        }

        $div.append($loc_select);

        return $div;
    },
    loc_and_level_container: function() {
        var $loc_select_div = this.loc_select(),
            $loc_select = $loc_select_div.find("#" + element_ids.loc_select_id),
            $level_container = $("<div>", {
                id: element_ids.level_container_id,
            });

        var loc_val = $loc_select.val();

        $level_container.append(settings_maker.level_select(loc_val));

        $loc_select.on("change", function() {
            $level_container.empty();
            var loc = $(this).val();
            $level_container.append(settings_maker.level_select(loc));
        });

        return {
            "$loc_div": $loc_select_div,
            "$level_container": $level_container,
        }
    },
    level_select: function(loc) {
        var select_id = element_ids.level_select_id,
            select_name = element_ids.level_select_name,
            $div = $("<div class='form-group'>");

        $("<label>", {
            "for": select_id,
            text: gettext("Level"),
        }).appendTo($div);

        var $input_group = $("<div>",{
           "class": "input-group-btn",
        });

        var $level_modifier_select = $("<select>", {
            "class": "form-control",
            name: element_ids.level_modifier,
        }).appendTo($input_group);

        $("<option>", {
            "value": "lt",
            text: "<=",
        }).appendTo($level_modifier_select);

        $("<option>", {
            "value": "gt",
            text: ">=",
        }).appendTo($level_modifier_select);

        $("<option>", {
            "value": "eq",
            text: "=",
        }).appendTo($level_modifier_select);


        var $select = $("<select>", {
            id: select_id,
            "class": "form-control",
            name: select_name,
        }).appendTo($input_group);

        $input_group.appendTo($div);

        var level = get_loc_level(loc),
            i;

        $("<option>", {
            "value":  "all",
            text: "All",
        }).appendTo($select);

        for (i = 1; i < level + 1; i++) {
            $("<option>", {
                "value":  i,
                text: i,
            }).appendTo($select);
        }
        return $div
    },
};


function get_loc_level(loc) {
    switch(loc) {
        case "S":
            return 6
        case "F":
            return 4;
        case "P":
            return 4;
        case "VC":
            return 5;
    };
};