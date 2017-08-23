function randomId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


function renderList(ul_class, list){
    $('.' + ul_class).html('');
    list.forEach(function(item){
        var id = randomId();
        var completed = item.completed;
        var del_btn = '<div class="delete_task" data-id="'+ id +'" ><i class="fa fa-times" aria-hidden="true"></i></div>';
        var checkbox = completed ? '<input class="todo_checkbox" data-id="'+ id +'" type="checkbox" checked />' :'<input class="todo_checkbox" data-id="'+ id +'" type="checkbox" />';
        if(ul_class !== 'to_do_list'){
            del_btn = '';
            checkbox = '';
        };
        var li = $('<li class="clean" data-id="'+ id +'"><div class="list_item_name">' + item.name + '</div><div class="list_item_check">' + checkbox + del_btn + '</div></li>');
        $('.' + ul_class).append(li);
        delBtnClickHandler();
    });
}
$.ajax({
    type: 'GET',
    url: '/about/getList',
    dataType: 'json',
    contentType : "application/json; charset=utf-8",
    success: function(data){
        renderList('to_do_list', data);
    }
});

// delete button click
function delBtnClickHandler(){
    $('.delete_task').click(function(){
        var del_btn_id = $(this).data('id');
        var li = $('li[data-id=' + del_btn_id + ']');
        var task_name = li.find('.list_item_name').text();
        $.ajax({
            type: 'DELETE',
            url: '/about/delete',
            dataType: 'json',
            data: JSON.stringify({
                task_name: task_name
            }),
            contentType : "application/json; charset=utf-8",
            success: function(data){
                // renderList('to_do_list', data);
                li.hide();
            },
            error: function(error){
                console.log(error);
            }
        })
    });
};

$(document).ready(function(){
    delBtnClickHandler();
    // add button click
    $('.my_btn').click(function(){
        var new_todo = $('.new_todo_input').val();
        $('.new_todo_input').val('');
        $.ajax({
            type: 'PUT',
            url: '/about/add',
            dataType: 'json',
            data: JSON.stringify({
                new_item: new_todo
            }),
            contentType : "application/json; charset=utf-8",
            success: function(data){
                if(!data.exists){
                    renderList('to_do_list', data.tasks);
                }else{
                    alert('Task already exists!');
                }
            },
            error: function(err){
                console.log(err);
            }
        })
    });


    // checkbox change
    $('.todo_checkbox').change(function(){
        var chbox_id = $(this).data('id');
        var task_name = $('li[data-id=' + chbox_id + ']').find('.list_item_name').text();
        var completed = $(this).prop('checked');
        $.ajax({
            type: 'PUT',
            url: '/about/update',
            dataType: 'json',
            data: JSON.stringify({
                task_name: task_name,
                completed: completed
            }),
            contentType : "application/json; charset=utf-8",
            success: function(data){
            }
        })
    })


    // search input change
    $('.search_input').on('input', function(){
        var input_val = $(this).val();
        $.ajax({
            type: 'POST',
            url: '/about/search',
            dataType: 'json',
            data: JSON.stringify({
                input_val: input_val
            }),
            contentType : "application/json; charset=utf-8",
            success: function(data){
                renderList('filtered_list', data);
            }
        })
    })


})
