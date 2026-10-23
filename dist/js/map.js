
function loadYandexMaps() {
   return new Promise((resolve, reject) => {
      if (window.ymaps) {
         resolve();
         return;
      }

      const script = document.createElement('script');

      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
   });
}

function initOfficeMap() {
   const mapElement = document.querySelector('#officeMap');

   if (!mapElement) return;

   const { lat, lng, title, address } = mapElement.dataset;

   const latitude = Number(lat);
   const longitude = Number(lng);

   if (
      !lat ||
      !lng ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
   ) {
      console.error('Яндекс Карты: проверьте координаты в data-атрибутах.');
      return;
   }

   loadYandexMaps()
      .then(() => {
         ymaps.ready(() => {
            const coordinates = [latitude, longitude];

            const map = new ymaps.Map('officeMap', {
               center: coordinates,
               zoom: 16,
               controls: ['zoomControl'],
            });

            const groundPane = map.panes.get('ground');

            if (groundPane) {
               groundPane.getElement().style.filter = 'grayscale(100%)';
            }

            const placemark = new ymaps.Placemark(
               coordinates,
               {
                  balloonContentHeader: title || 'Наш офис',
                  balloonContentBody: address || '',
                  hintContent: title || 'Наш офис',
               },
               {
                  iconLayout: 'default#image',
                  iconImageHref: 'img/map-marker.svg',
                  iconImageSize: [60, 60],
                  iconImageOffset: [-30, -60],
               }
            );

            map.geoObjects.add(placemark);

         });
      })
      .catch((error) => {
         console.error('Не удалось загрузить Яндекс Карты:', error);
      });
}

initOfficeMap();
