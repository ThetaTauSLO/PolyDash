$()


$(document).ready(function() {
  let $form = $(".wj-contact-form");
  console.log("HKN subscribe module loaded.", $form);

  if ($form.length > 0) {
    $('form input[type="submit"]').bind('click', function (event) {
      if (event) event.preventDefault();
      // validate_input() is a validation function I wrote, you'll have to substitute this with your own.
      if (validate_input($form)) { register($form); }
    });
  }
})

function register($form) {
  $.ajax({
    type: $form.attr('method'),
    url: $form.attr('action'),
    data: $form.serialize(),
    cache: false,
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    error: function (err) {
      // $("#fail-message").show();
      $("#fail-message-description").text("Cannot connect to subscription server. Please try again later!");
      $("#fail-message-description").show();
    },
    success: function (data) {
      if (data.result != "success") {
        // $("#fail-message").show();
      } else {
        $("#fail-message-description").text(data.message);
        $("#fail-message-description").show();
      }
    }
  });
}

function validate_input($form) {
  return true;
}
