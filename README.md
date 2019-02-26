Bolt Leaflet maps
================================

**This is the readme for v1**

This extension creates a twig function that takes a number of values
and creates a leaflet map via the v1.4.0 Leaflet Maps API.
You can pass in simple values, a single leaflet object, an array
of leaflet objects, a record or multiple records.

Example with Mapstyles, Leaflet and using optional parameters to
output the distance and the time to get to a marker:

**The map has no set height by default. This is because it is often
used in situations where no height should be set (like in a flex
grid). In your css just enter `.map-canvas{height:50vh}` or 
whatever height you want.**

I recommend that you install those if non-techies will update those 
fields.

####Named values

A simple map is usually constructed with named values passed to the map()
function, like this:

    {{leaf(
        latitude = record.leaflet.latitude,
        longitude = record.leaflet.longitude,
        html = record.leaflet.address,
        zoom = record.leaflet.zoom
    )}}

Or you can create the map as a repeater field, like this. 

    {% set maps = [] %}
        {% for record in record.leaflets %}
            {% set maps = maps|merge([record.add]) %}
        {% endfor %}
        {{leaf(
            maps = maps,
        )}}

for v1 of this extension the zoom and mapLayer(map styling) has to be set in the config file. 


