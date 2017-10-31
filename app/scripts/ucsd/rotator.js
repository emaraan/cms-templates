$(function() {
  /* Initialize Carousel */
  var paused = 0;
  $('#myCarousel').carousel({
    interval: 8000,
    pause: 0
  });

  /* Play trigger */
  $('#toggleCarousel').click(function() {
    var state = (paused) ? 'cycle' : 'pause';
    paused = (paused) ? 0 : 1;
    $('#myCarousel').carousel(state);
    $(this).find('span').toggleClass('glyphicon-play glyphicon-pause');
  });
});
