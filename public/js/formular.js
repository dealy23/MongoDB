$(function() {

  $.ajax({
    type: "GET",
    url: "times",
    success : function(data, status) {
      for (i=0; i<data.length; i++) {
        $(".ausgabe").append("<div id=1"+ data[i]._id+">" + data[i].date +  " " + data[i].from + " " + data[i].to + " " + data[i].lunch +
          "<button type='button' class='btn btn-primary update " + data[i]._id +"'>/</button>" +
          "<button id=" + data[i]._id +" type='button' class='btn btn-primary delete'>X</button>" + "</div>")
      }
    }
  });


  $(".ausgabe").on( "click", ".delete", function(){
    var iddelete = ($(this).attr('id'));
    console.log(iddelete);
    $.ajax({
      type: "DELETE",
      url: "time",
      data: {
        _id: iddelete
      },
      success: function (document1, status, button) {
        $("div #1" +iddelete).remove()
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