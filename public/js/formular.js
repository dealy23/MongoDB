$(function() {

  $.ajax({
    type: "GET",
    url: "times",
    success : function(data, status) {
      for (i=0; i<data.length; i++) {
        $(".ausgabe").append("<p>"+ data[i].date + "</p>"  + " " + data[i].from + " " + data[i].to + " " + data[i].lunch +
          "<button type='button' class='btn btn-primary update'>/</button>" +
          "<button id="+ data[i]._id +" type='button' class='btn btn-primary delete'>X</button>")
      }
    }
  });


  $(".ausgabe").on( "click", ".delete", function(){
    $.ajax({
      type: "DELETE",
      url: "time",
      data: {
        _id:($(this).attr('id'))
      },
      success: function(document1, status, buttton){
        //Remove line in HTML
      }
    })
  });

  $("#submit").click(
    function() {
      $.ajax({
        type: "POST",
        url: "save_time",
        data: {
          date: $("#date").val(),
          from: $("#from").val(),
          to: $("#to").val(),
          lunch: $("#lunch").val()
        },
        dataType: 'json',
        success : function(data, status) {
          $(".ausgabe").append("<p>"+ data.date + " " + data.from + " " + data.to + " " + data.lunch+"</p>");
        }
      });
    }
  )
});