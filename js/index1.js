var timer;

$(".controls").on( "change keyup" , function(e) {
  
  var vals = {};
  
  // location code
  
  vals.lat = $("#latitude").val();
  vals.long = $("#longitude").val();
  vals.loc = $("#location").val();
  
  vals.center = vals.loc || vals.lat + "," + vals.long;
  
  
  // sizes of map code
  
  vals.sizes = {
    w: $("#width").val(),
    h: $("#height").val(),
    iw: $("#iwidth").val(),
    ih: $("#iheight").val()
  }
  
  if( !$(".custom-sizes input").is(":checked") ) {
    vals.size = vals.sizes.w + "x" + vals.sizes.h;
  } else {
    vals.size = vals.sizes.iw + "x" + vals.sizes.ih;
  }
  
  // sensor... always false?
  
  vals.sensor = false;
  
  // map zoom level
  
  vals.zoom = $("#zoom").val();
  
  // map style
  
  vals.style = $("#style").val();
  
  // map marker style 
  //(<3 color picker html5 elem)
  
  vals.color = "0x"+$("#color").val().replace("#",""); 
  vals.icon = $("#icon").val();
  
  vals.marker = ( vals.icon ) ? "icon:" + vals.icon : "color:" + vals.color;
  
  // custom styles

  vals.customise = "";
  $(".json-error").empty();
  
  if( $("#customise").val() ) {
    
    try {
      
      vals.custom = $.parseJSON($("#customise").val());
      vals.customise = getStaticStyles( vals.custom );
      
    } catch(error) {
      
      var $error = $("<span>").text("Error in JSON Format");
      $(".json-error").html( $error );
      
    }
      
  } else {
    
    vals.customise = "";
    
  }
  
  // now generate the URL...
  
  var url = 
      "https://maps.googleapis.com/maps/api/staticmap?" + 
      "center="+ vals.center + "&" +
      "size=" + vals.size + "&" +
      "sensor=" + vals.sensor + "&" +
      "zoom=" + vals.zoom + "&" +
      "maptype=" + vals.style + "&" +
      "markers="+ vals.marker + "|" + vals.center + "&" +
      vals.customise;
  
  // prevent super-fast map requests
  clearTimeout( timer );
  
  $(".result")
    .empty()
    .append("<span class='spinner'>Loading...</span>");

  $(".spinner")
    .hide()
    .fadeIn();
  
  timer = setTimeout( function() {
    $(".result")
    .fadeOut( 100, function() {
      $(this)
      .empty()
      .append("<img src=\""+ url +"\">")
      .append("<br><br>")
      .append( "<a href=\""+url+"\" target=\"_blank\">"+url+"</a>" )
      .fadeIn( 200 );
    });
  }, 1000 );
  
}).trigger("change");









// some UI stuff!


$(".custom-sizes input").on( "change" , function(e) {

  var display = $(this).is(":checked");
  if( display ) {
    $("#sizes").fadeOut( 100, function() {
      $("#customSizes").fadeIn(300);
    });
  } else {
    $("#customSizes").fadeOut( 100, function() {
      $("#sizes").fadeIn(300);
    });
  }

});







$("#iconTry").on("click",function(e) {
  e.preventDefault();
  
  $("#icon").val("http://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/32/Map-Marker-Marker-Outside-Pink.png").trigger("change");
  
  $(this).text("Isn't that pretty? (look at map)")

});



$("#tryThis").on("click", function(e) {
  
  e.preventDefault();

  // theme from http://snazzymaps.com/style/25/blue-water
  var style = '[{"featureType":"water","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}]';
  
  $("#customise").val( style ).trigger("change");

});






function getStaticStyles(styles) {

  if( styles ) {
    var result = [];
    styles.forEach(function(v, i, a){

      var style='';
      if( v.stylers ) { 
        if (v.stylers.length > 0) { 
          style += (v.hasOwnProperty('featureType') ? 'feature:' + v.featureType : 'feature:all') + '|';
          style += (v.hasOwnProperty('elementType') ? 'element:' + v.elementType : 'element:all') + '|';
          v.stylers.forEach(function(val, i, a){
            var propertyname = Object.keys(val)[0];
            var propertyval = val[propertyname].toString().replace('#', '0x');
            style += propertyname + ':' + propertyval + '|';
          });
        }
      }
      result.push('style='+encodeURIComponent(style));
    });

    return result.join('&');

  }
  
}