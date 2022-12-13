// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const inputWeightMin = document.getElementById('minweight')
const inputWeightMax = document.getElementById('maxweight')
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('#fruit-select'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;
const arrColor = [
  { 'color': 'фиолетовый', 'engColor': 'violet', 'Code': '#8b00ff' },
  { 'color': 'зеленый', 'engColor': 'green', 'Code': '#84cd1b' },
  { 'color': 'розово-красный', 'engColor': 'carmazin', 'Code': '#dc143c' },
  { 'color': 'желтый', 'engColor': 'yellow', 'Code': '#ffd800' },
  { 'color': 'светло-коричневый', 'engColor': 'lightbrown', 'Code': '#cd853f' },
  { 'color': 'красный', 'engColor': 'red', 'Code': 'red' },
  { 'color': 'оранжевый', 'engColor': 'orange', 'Code': 'orange' }
]

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
// const checkArr = JSON.parse(fruitsJSON); //дублирующий массив для проверки на уникальность
/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  let ulChilds = document.querySelectorAll('li')
  ulChilds.forEach((child) => {
    fruitsList.removeChild(child)
  })
  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let newLi = document.createElement("li");                                    //добавляем тег li
    let liDiv = document.createElement('div');                                 //добавляем тег Div
    liDiv.className = 'fruit__info';
    newLi.appendChild(liDiv);                                                //ставим тег Div под li
    liDiv.insertAdjacentHTML('afterbegin', `<div>index: ${i}</div>`);        //внедряем контент с индексом сразу после открытия liDiv

    for (var prop in fruits[i]) {                                            //перебираем все значеия в объекте с индеком i в массиве fruits
      let liDivContent = document.createElement('div');                      //добавляем еще Div для контента
      liDivContent.innerHTML = `${prop}: ${fruits[i][prop]}`;
      liDiv.appendChild(liDivContent);                                      //вставляем divы с контеном под liDiv
    }

    newLi.className = `fruit__item fruit_${getColor(fruits[i].color)}`;

    fruitsList.appendChild(newLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    let randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits[randomIndex]);
    fruits.splice(randomIndex, 1);
  }

  fruits = result;

};

shuffleButton.addEventListener('click', () => {
  let checkArr =  JSON.stringify(fruits.slice(0)); //добавляем исходный массив в переменную в виде JSON
  shuffleFruits();
  display();
  //если checkArr совпадает со сгенерированным массивом - выдаем предупреждение
  if (checkArr === JSON.stringify(fruits)) {
    alert('Массив не изменился, поробуйте еще раз')
  }

});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  //если введенное значение неопределено - вставляем ноль
  minWeight = isNaN(parseInt(inputWeightMin.value)) ? 0 : parseInt(inputWeightMin.value)
  maxWeight = isNaN(parseInt(inputWeightMax.value)) ? 0 : parseInt(inputWeightMax.value)
  fruits = fruits.filter((item) => {
    // TODO: допишите функцию
    return minWeight <= item.weight && item.weight <= maxWeight

  })
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (obj1, obj2) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  //сравнение цветов по алфавиту, если первая буква цвета больше - возвращаем true
  return obj1.color[0] > obj2.color[0] ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    const n = arr.length; //Длина массива
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }

  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    const newArr = sortArr(arr);
    function sortArr(arr) {
      if (arr.length < 2) return arr;
      let pivot = arr[0]; //элемент массива, который сравнивается с другими элементами того же массива.
      const left = [];    // это массив, в котором хранятся элементы переданного массива, меньшие, чем pivot
      const right = [];   // это массив, в котором хранятся элементы переданного массива, большие, чем pivot
      for (let i = 1; i < arr.length; i++) { //перебирает входящий массив
        //вызов функции сравнения, вставляем отобранные значения либо в left либо в right
        if (comparation(pivot, arr[i])) {
          left.push(arr[i]);
        } else {
          right.push(arr[i]);
        }
      }
      //возвращаем значение, соединенного массива из pivot и сортированных left и right 
      return sortArr(left).concat(pivot, sortArr(right))
    }
    fruits = newArr; //запутался в вызовах функций, поэтому просто переписал fruits
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  sortKind === 'quickSort' ? sortKind = 'bubbleSort' : sortKind = 'quickSort';
  sortKindLabel.textContent = sortKind;

});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  let newFruit = {
    "kind": kindInput.value,
    "color": colorInput.value,
    "weight": weightInput.value
  };
  switch (false) {
    case !!kindInput.value:
      alert('Значение вида не заполнено');
      break;
    case !!colorInput.value:
      alert('Значение цвета не выбрано');
      break;
    case !!weightInput.value:
      alert('Значение веса не заполнено');
      break;
    default:
      fruits.push(newFruit);
      display();
  }

});

// получаем цвет из массива цветов
function getColor(color) {
  newColor = '';
  arrColor.forEach((element) => {
    //если входящий аргумент соответствует значению в массиве - выбираем необходимый эквивалент на английском
    if (element.color === color) {  
      newColor = element.engColor
    }
  })
  return newColor
}
// получаем код цвета из массива цветов
function getColorCode(color) {
  newColor = '';
  arrColor.forEach((element) => {
    //если входящий аргумент соответствует значению в массиве - выбираем необходимый эквивалент кода
    if (element.color === color) {
      newColor = element.Code
    }
  })
  return newColor

}
//При выборе цвета будет подсвечиваться поле select
colorInput.addEventListener('click', (e) => {
  target = e.target;
  colorInput.style.cssText = `background-color: ${getColorCode(target.value)};` //прописываем полю css свойство
})
