document.addEventListener('DOMContentLoaded', () => {


   //Табы

   const tabsContent = document.querySelectorAll('.tabcontent'),
         tab = document.querySelectorAll('.tabheader__item'),
         tabParent = document.querySelector('.tabheader__items');

   //прячем ВЕСЬ контент      
   const tabHide = () => {
      tabsContent.forEach(item => {
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });
      tab.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   };
   //показываем i-тый контент и делаем активным i-тый таб
   const tabShow = (i=0) => {
      tabsContent[i].classList.add('show', 'fade');
      tabsContent[i].classList.remove('hide');
      tab[i].classList.add('tabheader__item_active');
   };
   
   //вешаем прослушку на родителя вызываем ф-ции и передаем i
   const tabChange = () => {
      tabParent.addEventListener('click', (e) => {
         if (e.target && e.target.classList.contains('tabheader__item')) {
            tab.forEach((item, i) => {
               if (item == e.target) {
                  tabHide();
                  tabShow(i);
               }
            });
         }
      });
   };
   
   tabHide();
   tabShow();
   tabChange();


   //Таймер

   const deadline = '2022-09-01';

   //получаем разницу между настоящим временем и дедлайном
   function getRemainingTime(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor (t / (1000 * 60 * 60 * 24)),
            hours = Math.floor (t / (1000 * 60 * 60) % 24),
            minutes = Math.floor (t / (1000 * 60) % 60),
            seconds = Math.floor ((t / 1000) % 60);

      return {
         timer: t,
         days: days,
         hours: hours,
         minutes: minutes,
         seconds: seconds,
      }; 
   }
   //добавление нуля
   function addZero(num) {
      if (num < 10 && num >=0) {
            return `0${num}`;
      } else {
         return num;
      }
   }
   //добавляем время в HTML
   function setClock(selector, endtime) {

      const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            
            //обновляем данные каждую секунду
            timerImterval = setInterval(updateClock, 1000);
      //запускаем таймер, чтобы не было задержки на 1 секунду при обновлении
      updateClock();

      function updateClock() {
         const t = getRemainingTime(endtime);

         days.innerHTML = addZero(t.days);
         hours.innerHTML = addZero(t.hours);
         minutes.innerHTML = addZero(t.minutes);
         seconds.innerHTML = addZero(t.seconds);

         //отключаем таймер, когда выйдет время
         if (t.t <=0) {
            clearInterval(timerImterval);
         }
      }
   }

   setClock('.timer', deadline);

   //Modal

   const modalBtn = document.querySelectorAll('[data-modal]'),
         modalClose = document.querySelector('[data-close]'), 
         modalWindow = document.querySelector('.modal');

   
   function modalShow () {
      modalWindow.classList.add('show');
      modalWindow.classList.remove('hide');
      //блокируем скролл
      document.body.style.overflow = 'hidden';
      //чтобы не показывалось во второй раз по таймеру
      clearInterval(modalTimer);
   }

   modalBtn.forEach(btn => {
      btn.addEventListener('click', modalShow);
   });
   

   function modalHide() {
         modalWindow.classList.remove('show');
         modalWindow.classList.add('hide');
         //разблокируем скролл
         document.body.style.overflow = '';
   
   }  
   
   modalClose.addEventListener('click', modalHide);

   //закрывается при нажатии на подложку
   
   modalWindow.addEventListener('click', (e) =>{
      if (e.target === modalWindow) {
         modalHide();
      }
   });
   
   //заркывается при нажатии esc

   document.addEventListener('keydown', (e) =>{
      if (e.code === 'Escape' && modalWindow.classList.contains('show')) {
         modalHide();
      }
   });

   //открывается через 5 сек

   const modalTimer = setTimeout(modalShow, 5000);

   //открывается, если долистал до конца

   function showModalByScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
         modalShow();
         //удаляем, чтобы показывалось только один раз
         window.removeEventListener('scroll', showModalByScroll);
      }
      
   }
   
   window.addEventListener('scroll', showModalByScroll);

   //классы, создание карточек продукта

   class ProductCard {
      constructor(src, alt, title, text, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.text = text;
         this.price = price;
         this.classes = classes;
         this.parent = document.querySelector(parentSelector);
         this.rate = 2;
         this.conversion();
      }
      conversion() {
         this.price = this.price * this.rate;
      }
      createCard() {
         const div = document.createElement('div');
         if (this.classes.length === 0) {
            this.classes = 'menu__item';
            div.classList.add(this.classes);
         } else {
            this.classes.forEach(classItem => {
               div.classList.add(classItem);
            });
         }

         div.innerHTML = `
               <img src=${this.src} alt=${this.alt}>
               <h3 class="menu__item-subtitle">${this.title}</h3>
               <div class="menu__item-descr">${this.text}</div>
               <div class="menu__item-divider"></div>
               <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
               </div>`;
         this.parent.append(div);
      }
   }

   new ProductCard(
      "img/tabs/vegy.jpg",
      "vegy",
      'Меню "Фитнес"',
      'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      229,
      '.menu .container'
   ).createCard();

   new ProductCard(
      "img/tabs/elite.jpg",
      "elite",
      'Меню “Премиум”',
      'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
      550,
      '.menu .container',
      'menu__item'
   ).createCard();

   new ProductCard(
      "img/tabs/post.jpg",
      "post",
      'Меню "Постное"',
      'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
      430,
      '.menu .container',
      'menu__item'
   ).createCard();
   
});