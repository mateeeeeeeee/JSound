let $body =  $('body');
let $input = $('#teste');

let isWhiteMode = localStorage.getItem('esta-no-modo-claro');

if(isWhiteMode === 'true')
{
    $body.removeClass();
    $body.addClass('modoClaro');
    
    $input.prop('checked', false);
}


$input.click( () => {
    $body.toggleClass('modoClaro');
    $body.toggleClass('modoEscuro');

    localStorage.setItem('esta-no-modo-claro', $body.hasClass('modoClaro'));
    isWhiteMode = localStorage.getItem('esta-no-modo-claro');
});


