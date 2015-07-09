$(function(){
    var $container = $('.thumbnails');
    console.log($container);
    $container.imagesLoaded(function(){
        $container.masonry({
          itemSelector : '.goods',
          columnWidth: 180,
          isFitWidth: true
        });
    });
    $(window).resize(function(){
        $container.masonry({itemSelector : '.goods'});
    });
});