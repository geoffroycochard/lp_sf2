(function(doc,$){
    $('a[href^="http://symfony.com/doc/"]')
        .addClass('go-to-sf-doc')
        .attr('target', '_blank');
})(document,$);