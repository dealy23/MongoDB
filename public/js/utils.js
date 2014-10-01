$(function() {

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
      console.log("correct time");
      $(this).parent().removeClass("has-error");
      $("#submit").attr("disabled", false);
    }else{
      $(this).parent().addClass("has-error");
      $("#submit").attr("disabled", true);
      console.log("false Time");
    }
  })

  $("#to").on("keyup", function(){
    if(isTime($(this).val())) {
      console.log("correct time");
      $(this).parent().removeClass("has-error");
      $("#submit").attr("disabled", false);
    }else{
      $(this).parent().addClass("has-error");
      $("#submit").attr("disabled", true);
      console.log("false Time");
    }
  })

  $("#lunch").on("keyup", function(){
    if(isLunch($(this).val())) {
      console.log("correct lunch");
      $(this).parent().removeClass("has-error");
      $("#submit").attr("disabled", false);
    }else{
      $(this).parent().addClass("has-error");
      $("#submit").attr("disabled", true);
      console.log("false lunch");
    }
  })
});

//Auswertung Datum
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
  else if (dtDay < 1 || dtDay > 31)
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

//Auswertung Zeit -> from & to
function isTime(txtTime) {
  var validTime = txtTime;
  if (validTime == '')
    return false;

  var rxTimePattern = /^(\d{1,2})(:|-)(\d{1,2})$/;
  var tArray = validTime.match(rxTimePattern);

  if (tArray == null)
    return false;

  var dtHour= tArray[1];
  var dtMinute= tArray[3];

  if (dtMinute < 0 || dtMinute > 59)
    return false;
  if (dtHour < 0 || dtHour > 23)
    return false;

  return true;
}

function isLunch(txtLunch){
  var validLunch = txtLunch;
  if (validLunch == '')
    return false;

  var rxLunchPattern = /^(\d{1,2})$/;
  var lArray=validLunch.match(rxLunchPattern);

  if (lArray == null)
    return false;

  if (lArray < 0 || lArray > 99)
    return false;

  return true;
}
