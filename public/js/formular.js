$(function() {

  //Ausgabe gespeicherte Daten
  $.ajax({
    type: "GET",
    url: "times",
    success : function(data, status) {
      for (i=0; i<data.length; i++) {
        $("#timetable").append("<tr id="+ data[i]._id+"><td>" + data[i].date +  "</td><td>" + data[i].from + "</td><td>" + data[i].to + "</td><td>" + data[i].lunch +
          "</td><td><button type='button' class='btn btn-primary update'>/</button></td><td>" +
          "<button type='button' class='btn btn-primary delete'>X</button></td>" + "</tr>")
      }
    }
  });


  //Löschen des Datensatz incl löschen aus dem DOM
  $("#timetable").on( "click", ".delete", function(){
    var iddelete = $(this).parent().parent().attr('id');
    $.ajax({
      type: "DELETE",
      url: "time",
      data: {
        _id: iddelete
      },
      success: function (document1, status, button) {
        $("#"+iddelete).remove()
      }
    })
  });

  //Update
  $("#timetable").on("click", ".update", function(){

   var idupdate = $(this).parent().parent().attr('id');
    var date = $(this).parent().parent().children(":first").text();
    var from = $(this).parent().parent().children(":nth-child(2)").text();
    var to = $(this).parent().parent().children(":nth-child(3)").text();
    var lunch = $(this).parent().parent().children(":nth-child(4)").text();


    $("#date").val(date);
    $("#from").val(from);
    $("#to").val(to);
    $("#lunch").val(lunch);
    $("#id").val(idupdate);
    $("#submit").text('Update');
  })


  $("#reset").click(
    function() {
      $("#id").val("");
  });


  //Liest mit click die Daten aus dem HTML Formular und schickt (POST) sie an die mongo
  $("#submit").click(
    function() {
      if ($("#id").val()) {
        console.log($("#id").val());

      } else if($("#date").val() && $("#from").val() && $("#to").val()){
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
            $("#timetable").append("<tr id="+ data._id+"><td>" + data.date +  "</td><td>" + data.from + "</td><td>" + data.to + "</td><td>" + data.lunch +
              "</td><td><button type='button' class='btn btn-primary update'>/</button></td><td>" +
              "<button type='button' class='btn btn-primary delete'>X</button></td>" + "</tr>");
          }
        });
      } else{
        alert('All fields must be filled');
      }

    }
  )
});


