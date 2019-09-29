$.ajax({
    type: "POST",
    url: "/chart.php",
    data: {
        code_ya: "RU-ALL",
    },
    //При удачном завершение запроса - выводим то, что нам вернул PHP
    success: function(html) { 
       charts (html)
    }
}); 

ymaps.ready(init);

function init() {

    map = new ymaps.Map('map', {
        center: [66.413951, 94.241942],
        zoom: 3,
        type: 'yandex#map'
    });

    arr_point = [
        [[50.970898, 40.233395], '16,26%', 'red'],  //Воронежская область
        [[51.535008, 36.121347], '21,21%', 'red'],  //Курская область
        [[54.559725, 40.950331], '26,72%', 'red'],  //Рязанская область
        [[63.637517, 43.336661], '12,20%', 'red'],  //Архангельская область желтый
        [[54.560090, 21.218944], '20,29%', 'red'],  //Калининградская область желтый
        [[59.939095, 30.315868], '8,56%', 'green'],  // г. Санкт-Петербург
        [[55.755814, 37.617635], '11,91%', 'green'],  //г. Москва
        [[47.728732, 41.268128], '29,06%', 'red'],  // Ростовская область 
        [[55.350336, 50.911013], '9,40%', 'green'],  //Республика Татарстан
        [[54.446199, 60.395641], '6,11%', 'green'],  //Челябинская область
        [[51.695886, 136.637034], '0,0%', 'green'],  //Хабаровский край 
        [[57.100294, 106.363305], '25,76%', 'red'],  //Иркутская область
        [[45.544904, 39.610422], '0,0%', 'green'] , //Краснодарский край
    ];

    console.log(arr_point);


    for (var i = 0; i < 13; i++) {
            // Создаем геообъект с типом геометрии "Точка".
            myGeoObject = new ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                    type: "Point",
                    coordinates: arr_point[i][0]
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    iconContent: arr_point[i][1],
                    hintContent: 'Темп убыли'
                }
            }, {
                // Опции.
                // Иконка метки будет растягиваться под размер ее содержимого.
                preset: 'islands#blackStretchyIcon',
                iconColor: arr_point[i][2], // Желтый! 
                // Метку можно перемещать.
                draggable: false
            });
            map.geoObjects.add(myGeoObject);

    }







        myGeoObject1 = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: [100.970898, 40.233395]
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: '16,26%',
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            iconColor: 'red', // Желтый! 
            // Метку можно перемещать.
            draggable: true
        });
        map.geoObjects.add(myGeoObject1);

    // Зададим цвета для раскрашивания.
    var colors = ['#E31E24','#EF7F1A','#FFED00','#009846','#00A0E3','#393185'];

    var objectManager = new ymaps.ObjectManager();

    // Загрузим регионы.
    ymaps.borders.load('RU', {
        lang: 'ru',
        quality: 0
    }).then(function (result) {
        // Очередь раскраски.
        var queue = [];
        // Создадим объект regions, где ключи это ISO код региона.
        regions = result.features.reduce(function (acc, feature) {
            // Добавим ISO код региона в качестве feature.id для objectManager.
            var iso = feature.properties.iso3166;
            feature.id = iso;
            // Добавим опции региона по умолчанию.
            feature.options = {
                fillOpacity: 1,
                strokeColor: '#FFF',
                strokeOpacity: 1
            };
            acc[iso] = feature;
            return acc;
        }, {});

        // Функция, которая раскрашивает регион и добавляет всех нераскрасшенных соседей в очередь на раскраску.
        function paint(iso) {
            var random = Math.floor(Math.random() * (6 + 1)) - 1;
            var allowedColors = colors.slice();

            // Получим ссылку на раскрашиваемый регион и на его соседей.
            var region = regions[iso];
            var neighbors = region.properties.neighbors;
            // Если у региона есть опция fillColor, значит мы его уже раскрасили.
            if (region.options.fillColor) {
                return;
            }
            // Если у региона есть соседи, то нужно проверить, какие цвета уже заняты.
            if (neighbors.length !== 0) {
                neighbors.forEach(function (neighbor) {
                    if (queue.indexOf(neighbor) === -1) {
                        queue.push(neighbor);
                    }
                });
            }
            
            // Раскрасим регион в рандомный доступный цвет.
            region.options.fillColor = colors[random];
        }

        for (var iso in regions) {
            // Если регион не раскрашен, добавим его в очередь на раскраску.
            if (!regions[iso].options.fillColor) {
                queue.push(iso);
            }
            // Раскрасим все регионы из очереди.
            while (queue.length > 0) {
                paint(queue.shift());
            }
        }
        // Добавим регионы на карту.
        result.features = [];
        for (var reg in regions) {
            result.features.push(regions[reg]);
        }
        objectManager.add(result);
        map.geoObjects.add(objectManager);
    })

     objectManager.objects.events.add('click', function (e) {
        var objectId = e.get('objectId');
        console.log(objectId);
            $.ajax({
                type: "POST",
                url: "/chart.php",
                data: {
                    code_ya: objectId,
                },
                //При удачном завершение запроса - выводим то, что нам вернул PHP
                success: function(html) { 
                   charts (html)
                }
            }); 
    });
}


//Отрисовка графиков 
function charts (data_chart) {
    $("#container").html("<h1>Распределение младенческой смертности</h1><h3>за период с 2000 по 2018</h3>");
    var arr = JSON.parse(data_chart);
    arr_data = [['Год', 'Смертность']];
    for (var i = 0; i < 20; i++) {
        arr_data.push ([parseInt(arr[i][0]), parseFloat(arr[i][1])]);
        if ((arr[i][1])==null ){
            $("#container").html("<h1>К сожалению данных нет</h1>");
            return;
        }
    }

    var data = arr_data;
    // create a chart
    chart = anychart.area();
    // create an area series and set the data
    var series = chart.area(data);
    // set the container id
    // turn on chart animation
    chart.animation(true);

    // turn on the crosshair
    chart.crosshair(true);

    // set y axis title
    chart.yAxis().title('количесво детей');

    chart.container("container");
    // initiate drawing the chart
    chart.draw();
}