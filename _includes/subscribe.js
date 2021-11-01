$(document).ready(function() {
  let $form = $(".wj-contact-form");
  console.log("HKN subscribe module loaded.", $form);

  if ($form.length > 0) {
    $('form input[type="submit"]').bind('click', function (event) {
      if (event) event.preventDefault();
      if (validate_input($form)) { register($form); }
    });
  }
});

function register($form) {
  $('.wj-contact-form input[type="submit"]').prop('disabled', true);
  $.ajax({
    type: $form.attr('method'),
    url: $form.attr('action'),
    data: $form.serialize(),
    cache: false,
    dataType: 'jsonp',
    contentType: "application/json; charset=utf-8",
    error: function (err) {
      $("#fail-message-description").text("Cannot connect to subscription server. Please try again later!");
      $("#fail-message-description").show();
      $('.wj-contact-form input[type="submit"]').prop('disabled', false);
    },
    success: function (data) {
      if (data.result != "success") {
        $("#fail-message-description").html(data.msg);
        $("#fail-message-description").show();
      } else {
        $("#fail-message-description").hide();
        $("#success-message").show();
      }
      $('.wj-contact-form input[type="submit"]').prop('disabled', false);
    }
  });
  
}

function validate_input($form) {
  return true;
}
