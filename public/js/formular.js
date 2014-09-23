$(function() {

  $("#bla").click(
    function() {

      $.ajax({
        type: "POST",
        url: "save_time",
        data: {
          from: $("#from").val(),
          to: $("#to").val(),
          lunch: $("#lunch").val()
        },
        dataType: 'json'
      });

      $(".ausgabe").append("<p>"+from + " " + to + " " + lunch+"</p>");
    }
  )
});