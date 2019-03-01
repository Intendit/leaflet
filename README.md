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


####Single map
A simple map is usually constructed with named values passed to the map()
function, like this:

    {{leaf(
        latitude = record.leaflet.latitude,
        longitude = record.leaflet.longitude,
        html = record.leaflet.address,
        zoom = record.leaflet.zoom
    )}}

After this you create a contentype, like this.

		leaflet:
            type: leaflet
            group: leaflet
            label: leaflet

####Multiple maps with 1 marker(repeater)
You can also have multiple maps with 1 marker.

		{% set maps = [] %}
	        {% for record in record.leaflets %}
	            {{leaf(
	                latitude = record.leafletfields.latitude,
	                longitude = record.leafletfields.longitude,
	                html = record.leafletfields.address,
	                zoom = record.leafletfields.zoom
	            )}}
	        {% endfor %}


####Multiple mapmarkers(repeaterfields)

Or you can create the map as a repeater field, like this. 

    {% set maps = [] %}
        {% for record in record.leaflets %}
            {% set maps = maps|merge([record.leafletfields]) %}
        {% endfor %}
        {{leaf(
            maps = maps,
        )}}

After this you have to create a contenttype, like this.

		leaflets: 
            type: repeater
            group: leaflet
            fields: 
                leafletfields:
                    type: leaflet

####Config.yml
For v1 of this extension the zoom and mapLayer(map styling) has to be set in the config.yml.

**Zoom**
If you wanna change the zoom of the frontend map you have to go to the config file.

		zoom: value
Where 1 is really really zommed out. and 20 is really zoomed in. Recomended values is 10-16

**Example:**
	`zoom: 15`

**map styling**
If you wanna change the styling of the map output you can do that in config.yml.
Between the '' you insert the src path. In the README.MD there is a few examples of paths. 

		layerUrl: 'insert src path here'

**Example:**

		layerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'



