let w = $(window);

let $tutorial1 = $('#tutorial1');
$tutorial1.width(w.width() / 2);

let $tutorial2 = $('#tutorial2');


let $tutorial3 = $('#tutorial3');
$tutorial3.width(w.width() / 2);

let $tutorial4 = $('#tutorial4');
$tutorial4.width(w.width() / 2);

w.resize(e => {
    $tutorial1.width(w.width() / 2);
    $tutorial3.width(w.width() / 2);
    $tutorial4.width(w.width() / 2);
});