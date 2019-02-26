Array.prototype.forEach.call(document.getElementsByClassName("map-canvas"), function (elem) {
    var places = JSON.parse(elem.dataset.mapobj);
    var zoom = JSON.parse(elem.dataset.zoom);
    var layerurl = elem.dataset.layerurl;
    setTimeout(function(){
        map.setZoom(zoom);
    }, 1000);
    var center = L.latLngBounds([places[0].latitude, places[0].longitude], [places[0].latitude, places[0].longitude]);
    places.forEach(function(place){
        center.extend([ place.latitude, place.longitude ]);
    })
    var map = L.map(elem, {
        scrollWheelZoom: false,
        center: center.getCenter(),
        layers: [L.tileLayer(layerurl, {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        })],
    }).fitBounds(center);
    places.forEach(function(place){
        var cssIcon = L.icon({
            className: typeof place.icon == "string" ? 'fa ' + place.icon : 'fa fa-taxi',
            iconSize: typeof place.iconSize == "array" ? place.icon : [20, 37],
            iconUrl: '/extensions/vendor/johan/leaflet/images/marker-icon.png',
        });
        L.marker(
            [ place.latitude, place.longitude ],
            { icon: cssIcon }
        ).bindPopup(
            L.popup()
            .setContent(place.html)
        ).addTo(map);
    })
    map.fitBounds(center);
}); 
