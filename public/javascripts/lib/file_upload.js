$(function(){
    $('#file_input').change(function() {
        $('#dummy_file').val($(this).val());
    });
});