const wojskisConcert = [
  `Natenczas Wojski chwycił na taśmie przypięty Swój róg bawoli, długi, cętkowany, kręty Jak wąż boa, oburącz do ust go
  przycisnął, Wzdął policzki jak banię, w oczach krwią zabłysnął, Zasunął wpół powieki, wciągnął w głąb pół brzucha I do płuc
  wysłał z niego cały zapas ducha, I zagrał: róg jak wicher, wirowatym dechem Niesie w puszczę muzykę i podwaja echem.`,
  `Umilkli strzelcy, stali szczwacze zadziwieni Mocą, czystością, dziwną harmoniją pieni. Starzec cały kunszt, którym niegdyś w
  lasach słynął, Jeszcze raz przed uszami myśliwców rozwinął; Napełnił wnet, ożywił knieje i dąbrowy, Jakby psiarnię w nie
  wpuścił i rozpoczął łowy.`,
  `Bo w graniu była łowów historyja krótka: Zrazu odzew dźwięczący, rześki: to pobudka; Potem jęki po jękach skomlą: to psów
  granie; A gdzieniegdzie ton twardszy jak grzmot: to strzelanie.`
].reverse();

const setButton = document.getElementById('set-button');
const deleteButton = document.getElementById('delete-button');
const addButton = document.getElementById('add-button');
const wojskiCtn = document.getElementById('wojskis-concert');

const addStyle = () => {
  document.querySelectorAll('h1').forEach(el => el.style.animation = 'animation: text-fade 2s infinite alternate');
  document.querySelectorAll('.my-container').forEach(el => {
     el.style.padding = '0.5rem';
     el.style.backgroundColor = '#eff';
     el.style.border = '#a8a8a8';
     el.style.boxShadow = '0 0 6px 0 rgb(0, 0, 0, 0.4)';
  });
  document.querySelectorAll('.main-container').forEach(el => {
      el.style.display = 'grid';
      el.style.gridTemplateColumns = 'repeat(2, 1fr)';
      el.style.gap = '0.5rem';
      el.style.alignItems = 'start';
  });
};

const deleteStyle = () => {
  document.querySelectorAll('h1').forEach(el => el.style.animation = '');
  document.querySelectorAll('.my-container').forEach(el => {
     el.style.padding = '';
     el.style.backgroundColor = '';
     el.style.border = '';
     el.style.boxShadow = '';
  });
  document.querySelectorAll('.main-container').forEach(el => {
      el.style.display = '';
      el.style.gridTemplateColumns = '';
      el.style.gap = '';
      el.style.alignItems = '';
  });
};

const addParagraph = () => {
  const p = document.createElement('p');
  const content = document.createTextNode(wojskisConcert.pop());
  p.appendChild(content);

  wojskiCtn.appendChild(p);

  if (wojskisConcert.length == 0) {
      addButton.disabled = true;
      return;
  }
};

setButton.addEventListener('click', addStyle);
deleteButton.addEventListener('click', deleteStyle);
addButton.addEventListener('click', addParagraph);