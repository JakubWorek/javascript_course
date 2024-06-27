for (var i = 0; i < 4; i++) {
  wartosc = window.prompt('Podaj '+ (i+1) +' wartosc');
  console.log(wartosc + ':' + typeof(wartosc));
}

function funkcja_zwrotna(){
wartosc_pole_tekstowe = document.forms[0].elements[0].value;
wartosc_pole_liczbowe = document.forms[0].elements[1].value;
console.log(wartosc_pole_tekstowe + ':' + typeof(wartosc_pole_tekstowe));
console.log(wartosc_pole_liczbowe + ':' + typeof(wartosc_pole_liczbowe));
}