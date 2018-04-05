$( document ).ready(function(){
    $("#search-form").submit(function(e){
        e.preventDefault();
        formObj.submit();
    })
    formObj.create_form()
});

var formObj = {
    submit: function() {
        // Submit function for the search form.
        var $form = this.get_$form(),
            form_data = {};
        console.log($form.serializeArray());
    },
    create_form: function() {
        this.add_filter_div();
        this.add_date_input();
        this.add_level_select();
    },
    get_$form: function() {
        return $("#search-form");
    },
    get_$form_container: function() {
        return $("#form-container");
    },
    add_date_input: function() {
        var $form_container = this.get_$form_container();

        var $form_group = settings_maker.date_input_1();
        $form_group.addClass("col-md-2");
        $form_container.append( $form_group );
    },
    add_filter_div: function() {
        var $form_container = this.get_$form_container();
        var $form_group = settings_maker.adv_filter_div();
        $form_group.addClass("col-md-3");

        $form_container.append($form_group);
    },
    add_level_select: function() {
        var $form_container = this.get_$form_container(),
            $level_div = settings_maker.level_select();

        $level_div.addClass("col-md-3");

        $form_container.append($level_div);
    },
};