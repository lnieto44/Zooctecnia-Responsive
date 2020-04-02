// JavaScript Document

var main = function() {    
  /* Push the body and the nav over by 285px over */
  $('.icon-menu').click(function() {
    var izq = parseInt($('.jumbotronic').css("left"));    
    
    if(izq < 340){            
      $('.menu').animate({
        left: "0px"
      }, 200);


      $('.jumbotronic').animate({
        left: "340px"
      }, 200);

    }else{
      $('.menu').animate({
        left: "-340px"
      }, 200);


      $('.jumbotronic').animate({
        left: "0px"
      }, 200);
    }

  });

  
  $('.jumbotronic').click(function() { //cierra el menu de la izq al hacer clic en el jumbotronic
    var izq = parseInt($('.jumbotronic').css("left"));
    
    if(izq > 0){
      $('.menu').animate({
        left: "-340px"
      }, 200);


      $('.jumbotronic').animate({
        left: "0px"
      }, 200);
    }
    

  });
  


  /* Then push them back */
  $('.icon-close').click(function() {
    $('.menu').animate({
      left: "-340px"
    }, 200);

    $('.jumbotronic').animate({
      left: "0px"
    }, 200);
  });


};



$(document).ready(main);



