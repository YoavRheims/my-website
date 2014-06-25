var open = false;
$('button').click(function(){
  if(!open){
    $('li').addClass('slideout');
     open = true;
  }
  else{
    open = false;
    $('li').removeClass('slideout');
  }
});