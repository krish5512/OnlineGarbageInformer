/*
$("#slideshow>div:gt(0)").hide();
setInterval(function(){
    $('#slideshow>div:first')
    .fadeout(1000)
    .next()
    .fadein(1000)
    .appendTo('#slideshow');
},3000);*/

<script>
var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 9000);    
}
</script>
