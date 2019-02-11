/**
 * ExtensionName extension class.
 *
 * @author Johan 'Kaninjegarn' Engdahl  johan.engdahl@intendit.se>
 */
var startlat = "";
    var startlon = "";

    var options = {
        center: [startlat, startlon],
        zoom: 9
    }
    // Creating map obj.
    var map = L.map('map', options);
    var nzoom = 12;

    // Creating marker obj
    var mapMarker1 = L.icon({
        iconUrl: '/extensions/vendor/johan/leaflet/images/marker-icon.png', // img path
        iconSize:     [25, 40], // size of the marker width/height
    });
    // adding a background img as map on the map obj
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'SANTANA'}).addTo(map);

    // adding the map marker on the given lat/long
    var myMarker = L.marker([startlat, startlon], {title: "Coordinates",icon: mapMarker1, alt: "Coordinates", draggable: true}).addTo(map).on('dragend', function() {
    var lat = myMarker.getLatLng().lat.toFixed(8);
    var lon = myMarker.getLatLng().lng.toFixed(8);
    
    // Zoom functions
    var czoom = map.getZoom();
        if(czoom < 18) {
            nzoom = czoom + 2;
        }
        if(nzoom > 18) {
            nzoom = 18;
        }
        if(czoom != 18) {
            map.setView([lat,lon], zoom);
            }
            else {
                map.setView([lat,lon,zoom]);
            }
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;

    myMarker.bindPopup("Lat " + lat + "<br />Lon " + lon).openPopup();
    });

    // function that sets the correkt lat/long and zoom. creating a popup box and the output inside the box. 
    function chooseAddr(lat1, lng1, zoom, current_place){
        myMarker.closePopup();
        zoom_init = document.getElementById('zoomlvl');
        zoom = zoom_init.options[zoom_init.selectedIndex].value;
        
        map.setView([lat1, lng1, zoom]);
        map.setZoom(zoom);
        myMarker.setLatLng([lat1, lng1]);
        lat = lat1.toFixed(8);
        lon = lng1.toFixed(8);


        document.getElementById('lat').value = lat;
        document.getElementById('lon').value = lon;
        
        document.getElementById('zoomlvl').value = zoom
        current_place = document.getElementById('addr').value;
        myMarker.bindPopup("<i><b>" + capitalize(current_place) + " ligger här!</b><br>Lat: </i>" + "<b>" + lat + 
        "</b>" + "<i><br />Lon: </i>" + "<b>" + lon + "</b>").openPopup();
    }

    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }
    // function that makes the "search button" activate on "enter"
    // only for dev, will be disabled on live version.
    $('.address').keypress(function(event) {
        if (event.keyCode == 13) {
            addr_search();
        }
    });
    // function that outputs a green button with correct matched address and updates the map.
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
    // Function that updates the map with the given fields, zoom/lat/long.
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