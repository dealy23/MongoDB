$(function() {

  get_times("GET");

  var d = new Date();

  $("#id").val("");
  $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
  $("#from").val(d.getHours()+":"+ d.getMinutes());
  $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
  $("#lunch").val("30");

  //Löschen des Datensatz incl löschen aus dem DOM
  $("#timetable").on( "click", ".delete", function(){
    var iddelete = $(this).parent().parent().attr('id');
    $.ajax({
      type: "DELETE",
      url: "time",
      data: {
        _id: iddelete
      },
      success: function () {
        $("#"+iddelete).remove();
        get_times("DELETE");
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
      $("#submit").text('Submit');
  });


  //Liest mit click die Daten aus dem HTML Formular und schickt (POST) sie an die mongo
  $("#submit").click(
    function() {

      if ($("#id").val()) {
        console.log($("#id").val());

        //Wenn eine id vorhanden dann update
        $.ajax({
          type: "PUT",
          url: "time",
          data: {
            _id: $("#id").val(),
            date: $("#date").val(),
            from: $("#from").val(),
            to: $("#to").val(),
            lunch: $("#lunch").val()
          },
          dataType: 'json',
          success: function(data, status) {
           $("#"+$("#id").val()).html("<td>" + $('#date').val() +  "</td><td>" + $('#from').val() + "</td><td>" + $('#to').val() + "</td><td>" + $('#lunch').val() +
            "</td><td><button type='button' class='btn btn-primary update'><span class='glyphicon glyphicon-pencil'></span></button></td><td>" +
            "<button type='button' class='btn btn-primary delete'><span class='glyphicon glyphicon-trash'></span></button></td>");

            get_times("PUT");
            $("#id").val("");
            $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
            $("#from").val(d.getHours()+":"+ d.getMinutes());
            $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
            $("#lunch").val("30");
            $("#submit").text('Submit');
          }
        })
        //Ansonsten neuer post(einfügen)
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
              "</td><td><button type='button' class='btn btn-primary update'><span class='glyphicon glyphicon-pencil'></span></button></td><td>" +
              "<button type='button' class='btn btn-primary delete'><span class='glyphicon glyphicon-trash'></span></button></td>" + "</tr>");

            get_times("POST");
            $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
            $("#from").val(d.getHours()+":"+ d.getMinutes());
            $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
            $("#lunch").val("30");
          }
        });
      } else{
        alert('All fields must be filled');
      }
    }
  )
});

//Ausgabe gespeicherte Daten
function get_times(type) {
  $.ajax({
    type: "GET",
    url: "times",
    success: function (data, status) {
      if(type == "GET") {
        fill_table(data);
      }
      generate_balance(data);
    }
  });
}

function fill_table(data) {
  for (i = 0; i < data.length; i++) {
    $("#timetable").append("<tr id=" + data[i]._id + "><td>" + data[i].date + "</td><td>" + data[i].from + "</td><td>" + data[i].to + "</td><td>" + data[i].lunch +
      "</td><td><button type='button' class='btn btn-primary update'><span class='glyphicon glyphicon-pencil'></span></button></td><td>" +
      "<button type='button' class='btn btn-primary delete'><span class='glyphicon glyphicon-trash'></span></button></td>" + "</tr>")
  }
};

//Zusammenrechnen für Gesamtstunden
function generate_balance(data) {
  var tohour = 0, tomin = 0, fromhour = 0, frommin = 0, lunchmin = 0;
  for (i=0; i<data.length; i++) {
    tohour += parseInt(data[i].to.match(/\d{1,2}/));
    tomin += parseInt(data[i].to.match(/(\d+)(?!.*\d)/));
    fromhour += parseInt(data[i].from.match(/\d{1,2}/));
    frommin += parseInt(data[i].from.match(/(\d+)(?!.*\d)/));
    lunchmin += parseInt(data[i].lunch);

  }
  var togesamt = ((tohour*60)+tomin);
  var fromgesamt = ((fromhour*60)+frommin);
  var sollzeit = data.length * 8 * 60;

  var gesamtminuten= (togesamt - fromgesamt - lunchmin - sollzeit);

  var hour = Math.floor(gesamtminuten%3600/60);
  var minute = Math.floor(gesamtminuten%60);

  var zeit = (hour+ ":"+ minute );

  $("h3").html("Balance: "+zeit);
}