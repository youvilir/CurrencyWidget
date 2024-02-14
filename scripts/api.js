(function(){

  let timer; // пока пустая переменная
  let xhr = new XMLHttpRequest();
  initValutes(xhr);

  function initValutes(xhr){
    clearTimeout(timer);
    clearValutesWidget();
    createLoader();

    xhr.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js');
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = setTimeout(function() {
      deleteLoader();
      let valutes = xhr.response.Valute;
      console.log(valutes); 

      localStorage.clear();
      localStorage.setItem("valutes", JSON.stringify(valutes));

      valutesWidget(valutes);
    }, 1000);
  }

  function createLoader() {
    let valutesEl = document.getElementsByClassName('valutes-widget')[0];

    let loader = document.createElement('img');
    loader.classList.add('loader');
    loader.src = 'images/loader.gif';

    valutesEl.append(loader);
  }

  function deleteLoader() {
    let loader = document.getElementsByClassName('valutes-widget')[0].getElementsByClassName('loader')[0];
    console.log(loader);
    loader?.remove();
  }

  //клик по таймеру
  function timerClick() {
    initValutes(xhr);
  }

  // таймер для обновления виджета
  function initTimer(timerEl) {
    let x = 10; // стартовое значение обратного отсчета
    countdown(timerEl); // вызов функции

    function countdown(timerEl) { // функция обратного отсчета
      timerEl.innerHTML = x + ' sec';
      x--; // уменьшаем число на единицу
      if (x < 0){
        clearTimeout(timer); // таймер остановится на нуле
        initValutes(xhr);
      }
      else {
        timer = setTimeout(countdown, 1000, timerEl);
      }
    }
  }


  // таймер элемент
  function initTimerElement() {
    let span = document.createElement('span');
    span.classList.add('label');

    let timer = document.createElement('span');
    timer.classList.add('timer');
    timer.innerHTML = '10 sec';
    // initTimer(timer);

    let iconTimer = document.createElement('img');
    iconTimer.classList.add('icon-timer');
    iconTimer.src = 'images/timer.png';
    iconTimer.onclick = timerClick;

    span.onmouseover = function(){
      timer.style.display = 'block';
    }
    span.onmouseout = function(){
      timer.style.display = 'none';
    }

    span.append(iconTimer);
    span.append(timer);

    return span;
  }

  // логика виджета валют
  function valutesWidget(valutes) {
    let valutesEl = document.getElementsByClassName('valutes-widget')[0];

    let widget = document.createElement('div');
    widget.classList.add('widget')

    let content = document.createElement('div');
    content.classList.add('content');

    // заполнение валютами
    for(key in valutes) {
      let tagA = document.createElement('a');
      tagA.innerHTML = valutes[key].CharCode + ' ' + valutes[key].Value;

      let avatar = document.createElement('img');
      avatar.classList.add('avatar');
      avatar.src = `images/valutes/${valutes[key].CharCode}.png`;

      content.append(avatar);
      content.append(tagA)
    }

    span = initTimerElement();

    // Отобразим таблицу на странице
    widget.append(content);
    valutesEl.append(widget);
    valutesEl.append(span);
  }

  // удаление валют
  function clearValutesWidget() {
    let valutesEl = document.getElementsByClassName('valutes-widget')[0];
    
    while(valutesEl.firstChild){
      valutesEl.removeChild(valutesEl.firstChild);
    }
  }

}());
