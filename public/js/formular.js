$(function() {

  // Bei reload -> felder entleeren
  var d = new Date();

  $("#id").val("");
  $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
  $("#from").val(d.getHours()+":"+ d.getMinutes());
  $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
  $("#lunch").val("");

  $("#date").on("keyup", function() {
    if(isDate($(this).val())) {
      console.log("is a date");
      $(this).parent().removeClass("has-error");
      $("#submit").attr("disabled", false);
    } else {
      $(this).parent().addClass("has-error");
      $("#submit").attr("disabled", true);
      console.log("is not a date");
    }
  })

  $("#from").on("keyup", function(){
    if(isTime($(this).val())) {
      $(this).parent().removeClass("has-errro");
      $("#submit").attr("disabled", false);
    }else{
      $(this).parent().addClass("has-error");
      $("#submit").attr("disabled", true);
    }
  })

  //Ausgabe gespeicherte Daten
  $.ajax({
    type: "GET",
    url: "times",
    success : function(data, status) {
      for (i=0; i<data.length; i++) {
        $("#timetable").append("<tr id="+ data[i]._id+"><td>" + data[i].date +  "</td><td>" + data[i].from + "</td><td>" + data[i].to + "</td><td>" + data[i].lunch +
          "</td><td><button type='button' class='btn btn-primary update'><span class='glyphicon glyphicon-pencil'></span></button></td><td>" +
          "<button type='button' class='btn btn-primary delete'><span class='glyphicon glyphicon-trash'></span></button></td>" + "</tr>")
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

            $("#id").val("");
            $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
            $("#from").val(d.getHours()+":"+ d.getMinutes());
            $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
            $("#lunch").val("");
            $("#submit").text('Submit');
          }
        })

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

            $("#date").val(d.getDate()+"."+ (d.getMonth()+1) +"."+ d.getFullYear());
            $("#from").val(d.getHours()+":"+ d.getMinutes());
            $("#to").val((d.getHours()+9)+":"+ d.getMinutes());
            $("#lunch").val("");
          }
        });
      } else{
        alert('All fields must be filled');
      }
    }
  )

  function isDate(txtDate) {
    var currVal = txtDate;
    if(currVal == '')
      return false;

    //Declare Regex
    var rxDatePattern = /^(\d{1,2})(.|-)(\d{1,2})(.|-)(\d{4})$/;
    var dtArray = currVal.match(rxDatePattern); // is format OK?

    if (dtArray == null)
      return false;

    //Checks for dd/mm/yyyy format.
    dtDay = dtArray[1];
    dtMonth= dtArray[3];
    dtYear = dtArray[5];

    if (dtMonth < 1 || dtMonth > 12)
      return false;
    else if (dtDay < 1 || dtDay> 31)
      return false;
    else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
      return false;
    else if (dtMonth == 2)
    {
      var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
      if (dtDay> 29 || (dtDay ==29 && !isleap))
        return false;
    }
    return true;
  }

  function isTime(txtTime) {
    var currVal = txtTime;
    if(currVal == '')
      return false;

    var rxTimePattern = /^(\t{1,2})(:)(\t{1,2})$/;
    var dtArray = currVal.match(rxTimePattern);

    dtHours = dtArray[1];
    dtMinutes = dtArray[3];

    if (dtHours < 0 || dtHours > 24 )
      return false;
    else if (dtMinutes < 0 || dtMinutes > 59)
      return false;

    return true;

  }

});




