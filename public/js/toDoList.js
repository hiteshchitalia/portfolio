$('.toDoBody').on('click', 'li', function () {
  $(this).toggleClass('completed')
})

$('.toDoBody').on('click', 'span', function (e) {
  $(this).parent().fadeOut(700, function () {
    $(this).remove()
  })
  e.stopPropagation()
})

$("input[type='text']").keypress(function (e) {
  if (e.which === 13) {
    var toDoText = $(this).val()
    $('.toDoBody ul').append('<li><span> <i class="fa fa-trash"></i> </span>' + toDoText + '</li>')
    $(this).val('')
  }
})

$('.fa-plus').click(function () {
  $("input[type='text']").slideToggle(500);
})
