    var startlat = "";
    var startlon = "";

    var options = {
        center: [startlat, startlon],
        zoom: 9
    }
    // skapar kartobjektet som används och fylls senare. 
    var map = L.map('map', options);
    var nzoom = 12;

    // skapar map markerobjektet.
    var mapMarker1 = L.icon({
        iconUrl: '/extensions/vendor/johan/leaflet/images/marker-icon.png', // sökvägen till bilden.
        iconSize:     [25, 40], // storleken på markern, width / height
        iconAnchor:   [22, 94], // vart på bilden som skall agera som "startpunkt" i nuläget längst ner. 
        popupAnchor:  [-10, -76] // från vilken punkt popuprutan skall dyka upp, i nuläget ligger den i mitten. 
    });
    // lägger till kartbild till kartobjeket. 
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'OSM'}).addTo(map);

    // lägger till markerobjeket på rätt lat/long kordinater.
    var myMarker = L.marker([startlat, startlon], {title: "Coordinates",icon: mapMarker1, alt: "Coordinates", draggable: true}).addTo(map).on('dragend', function() {
    var lat = myMarker.getLatLng().lat.toFixed(8);
    var lon = myMarker.getLatLng().lng.toFixed(8);
    
    // Zoom funktionalitet.
    var czoom = map.getZoom();
        if(czoom < 18) {
            nzoom = czoom + 2;
        }
        if(nzoom > 18) {
            nzoom = 18;
        }
        if(czoom != 18) {
            map.setView([lat,lon], nzoom);
            }
            else {
                map.setView([lat,lon]);
            }
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;
    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
    });

    // funktion som ger popupenrutan ovanför markericon dess text.
    function chooseAddr(lat1, lng1){
        myMarker.closePopup();
        map.setView([lat1, lng1],18);
        myMarker.setLatLng([lat1, lng1]);
        lat = lat1.toFixed(8);
        lon = lng1.toFixed(8);
        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lon;
        myMarker.bindPopup("<i><b>Din önskade adress ligger här!</b><br>Lat: </i>" + "<b>" + lat + 
        "</b>" + "<i><br />Lon: </i>" + "<b>" + lon + "</b>").openPopup();
    }
    // funktion som gör att man inte behöver trycka på knappen "sök"
    // räcker med att trycka på enter.
    $('.address').keypress(function(event) {
        if (event.keyCode == 13) {
            addr_search();
        }
    });
    // funktionen som gör att korrekt adress kommer upp i form av en grön knapp(i nuläget)
    // när du trycker på sök/enter.
    function myFunction(arr){
        var out = "<br />";
        var i;

            if(arr.length > 0){
                for(i = 0; i < arr.length; i++){
                    out += "<button class='address btn-primary' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " 
                    + arr[i].lon + ");return false;'>" + arr[i].display_name + "</button>";
                }
                document.getElementById('results').innerHTML = out;
                }else {  
                    document.getElementById('results').innerHTML = "Sorry, no results...";
                }

    }
    // sökfunktionen som skriver ut matched address och gör requestet till leaflet. 
    function addr_search(){
        var inp = document.getElementById("addr");
        var xmlhttp = new XMLHttpRequest();
        var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
            xmlhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    var myArr = JSON.parse(this.responseText);
                    myFunction(myArr);
                }    
            };
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }
