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