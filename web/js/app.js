/**
 * ExtensionName extension class.
 *
 * @author Johan 'Kaninjegarn' Engdahl  johan.engdahl@intendit.se>
 */

var leafletCounter = 1;
var mapDivCounter = 1;

var startlat = "";
var startlon = "";

var map ="";
var maps = {};
var markers = {};
var options = {
    center: [startlat, startlon],
    zoom: 9
}

var myMarker = "";
var zoom_init = "";
var containerId = "";

$(document).ready(function () {
    // adding uniuqe id when init.
    $(".leaflet-main").each(function() {
        $(this).attr("id", "leaflet_container" + leafletCounter);        
        leafletCounter++;
    });
    $(".mapframe").each(function() {    
        $(this).attr("id", "map" + mapDivCounter++ );    
    });
    mapCreate();
    $('.add-button').click(function() {
        $('.repeater-field').find('.leaflet-main').each(function() {
            var innerDivId = $(this).attr('id');
            if(innerDivId == undefined) {
                $(this).attr("id", "leaflet_container" + leafletCounter++ );
            }
        });
        $('.map-target').find('.mapframe').each(function() {
            var innerDivId = $(this).attr('id');
            if(innerDivId == undefined) {
                $(this).attr("id", "map" + mapDivCounter++ );
            }
        });       
        mapCreate();
    });   
});
// Creating map obj.
function mapCreate() {
    $(".mapframe").each(function() {
        if ($(this).hasClass( "leaflet-container" )) { 
        } else {
        maps[this.id] = L.map(this.id, options);
        
        // Creating marker obj
        var mapMarker1 = L.icon({
            iconUrl: '/extensions/vendor/johan/leaflet/images/marker-icon.png', // img path
            iconSize:     [25, 40], // size of the marker width/height
        });
        // adding a background img as map on the map obj
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(maps[this.id]);
            // adding the map marker on the given lat/long
            markers[this.id] = L.marker([startlat, startlon], {title: "Coordinates",icon: mapMarker1, alt: "Coordinates", draggable: true}).addTo(maps[this.id]).on('dragend', function() {
            });
        }
    });
}
// function that sets the correkt lat/long and zoom. creating a popup box and the output inside the box. 
function chooseAddr(lat1, lng1, event, current_place) {
    containerId = event.target.closest('.leaflet-main').getAttribute('id');
    var i = event.target.closest('.leaflet-main').getElementsByClassName('mapframe')[0].getAttribute('id');
    markers[i].closePopup();
    zoom_init = event.target.closest('.leaflet-main').getElementsByClassName('zoom')[0];
    var zoom = zoom_init.options[zoom_init.selectedIndex].value;
    maps[i].setView([lat1, lng1, zoom]);
    maps[i].setZoom(zoom);
    markers[i].setLatLng([lat1, lng1]);
    lat = lat1.toFixed(8);
    lon = lng1.toFixed(8);

    event.target.closest('.leaflet-main').getElementsByClassName('latitude')[0].value = lat;
    event.target.closest('.leaflet-main').getElementsByClassName('longitude')[0].value = lon;
    event.target.closest('.leaflet-main').getElementsByClassName('zoom')[0].value = zoom;
    current_place = event.target.closest('.leaflet-main').getElementsByClassName('address')[0].value;

    markers[i].bindPopup("<i><b>" + current_place + " ligger här!</b><br>Lat: </i>" + "<b>" + lat + 
    "</b>" + "<i><br />Lon: </i>" + "<b>" + lon + "</b>").openPopup();
}
// function that gives mapframe correct id, even when a new repeater field is init. 
// function that outputs a green button with correct matched address and updates the map.
function myFunction(arr, containerId) {
    var out = "<br />";
    var i;

    if (arr.length > 0) {
        for (i = 0; i < arr.length; i++) {
            out += "<button class='address btn-primary' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " 
            + arr[i].lon + ", event);return false;'>" + arr[i].display_name + "</button>";
        }
        $('#'+containerId+' .results').html(out);
    } else {  
        $('#'+containerId+' .results').html("No such address im afraid!");
    }
}
// api request/search
function addr_search(event) {
    containerId = event.target.closest('.leaflet-main').getAttribute('id');
    var inp = $('#'+containerId+' .address').val();
    var xmlhttp = new XMLHttpRequest();
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp;
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                myFunction(myArr, containerId);
            }    
        };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
