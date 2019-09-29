
    /*Получаем координаты перинатальных центров

    $.ajax({
        type: "POST",
        url: "/query.php",
        data: {
            text: "Запрос точек",
        },
        //При удачном завершение запроса - выводим то, что нам вернул PHP
        success: function(html) {
           // alert(html);
            // alert(JSON.parse(html));  
            var coords = JSON.parse(html);

            var myCollection = new ymaps.GeoObjectCollection({}, {
                preset: 'islands#redIcon' //все метки красные
            });

            for (var i = 0; i < coords.length; i++) {
                myCollection.add(new ymaps.Placemark(coords[i]));
            }

            myMap.geoObjects.add(myCollection);      
        }
    }); */