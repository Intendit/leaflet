<?php

namespace Bolt\Extension\johan\leaflet;

use Bolt\Extension\SimpleExtension;
use Bolt\Asset\File\JavaScript;
use Bolt\Asset\File\Stylesheet;
use Bolt\Controller\Zone;
use Bolt\Extension\johan\leaflet\Field\leafletField;

/**
 * ExtensionName extension class.
 *
 * @author Johan 'Kaninjegarn' Engdahl  johan.engdahl@intendit.se>
 */
class leaflet extends SimpleExtension{

    private $map = [];
    private $args = [];

    private $defaults =  [
        'latitude' => '55,61460015',
        'longitude' => '12,98972694',
        'html' => "dockplatsen 12, malmö",
        'icon' => "marker-icon.png",
        'color' => "rgba(0,0,0,1)",
        'map' => false,
        'maps' => [],
        'record' => false,
        'records' => [],
        'leaflet_field' => "leaflet",
        'html_field' => "body",
        'icon_field' => "icon",
        'color_field' => "color",
        'leaflet' => false,
        'duration_holder' => "",
        'distance_holder' => "",
        'visitor_icon' => "fa-male",
        'visitor_color' => "rgba(0,0,0,1)",
        'travel_mode' => 'driving',
        'units' => 'metric'
    ];

    private $mapfields =  [
        'records',
        'map',
        'record',
        'latitude',
        'longitude',
        'zoom',
        'themeUrl',
        'html',
        'icon',
        'color',
        'maps'
    ];

    private $assetsAdded = false;

     /**
     * Register a leafletField.
     *
     * 
     * @return object leafletField()
     */
    public function registerFields(){
        return [
            new leafletField(),
        ];
    }

     /**
     * Register a twig function (leaf)
     * 
     * @return array leaf
     * 
     */
    protected function registerTwigFunctions(){
        return [
            'leaf' => ['leaf', ['is_variadic' => true]],
        ];
    }
     /**
     * Register css/js files
     *
     * @param object $leaflet_js_backend_output
     * @param object $leaflet_js_backend_src
     * @param object $leaflet_css_backend_src
     * @param object $leaflet_js_frontend_output
     * @param object $leaflet_js_frontend_src
     * @param object $leaflet_css_frontend_src
     * 
     * @return object $leaflet_js_backend_output
     * @return object $leaflet_js_backend_src
     * @return object $leaflet_css_backend_src
     * @return object $leaflet_js_frontend_output
     * @return object $leaflet_js_frontend_src
     * @return object $leaflet_css_frontend_src
     */
    protected function registerAssets(){

        $leaflet_js_backend_output = Javascript::create()
            ->setFileName('js/app.js')
            ->setLate(true)
            ->setPriority(5)
            ->setZone(Zone::BACKEND);
        
        $leaflet_js_backend_src = Javascript::create()
            ->setFileName('js/leaflet.js')
            ->setLate(true)
            ->setPriority(1)
            ->setZone(Zone::BACKEND);
            
        $leaflet_css_backend_src = (new Stylesheet('css/leaflet.css'))
            ->setZone(Zone::BACKEND);
        
        $leaflet_js_frontend_output = Javascript::create()
            ->setFileName('js/leaflet_frontend.js')
            ->setLate(true)
            ->setPriority(1)
            ->setZone(Zone::FRONTEND);

        $leaflet_js_frontend_src = Javascript::create()
            ->setFileName('js/leaflet-frontend.js')
            ->setLate(true)
            ->setPriority(1)
            ->setZone(Zone::FRONTEND);

        $leaflet_css_frontend_src = (new Stylesheet('css/leaflet-frontend.css'))
            ->setZone(Zone::FRONTEND);
        
        return [
            // backend files
            $leaflet_js_backend_output,            
            $leaflet_js_backend_src,
            $leaflet_css_backend_src,
            
            // frontend files
            $leaflet_js_frontend_output,
            $leaflet_js_frontend_src,
            $leaflet_css_frontend_src
        ];
    }
    // register twig paths
    protected function registerTwigPaths(){
        return [
            'templates' => ['position' => 'prepend', 'namespace' => 'bolt']
        ];
    }
    // render twig output.
    public function getLeafletTemplate(){
        return $this->renderTemplate('leaflet_frontend.twig');
    }
    // Merging the 2 arrays(deafault and args).
    public function leaf(array $args = []){
        $config = $this->getConfig();
        $this->args = array_merge($this->defaults, $args);
        $this->unifyData();
        $this->map = [];
        $this->zoom = $this->args['zoom'];
        $layerUrl = $config["layerUrl"];
        foreach ($this->args['records'] as $record){
            $field = $record[$this->args['leaflet_field']];            
            array_push(
                $this->map,
                [
                    'latitude' => $field['latitude'],
                    'longitude' => $field['longitude'],
                    'html' => $record[$this->args['html_field']] ?: $field['formatted_address'],
                    'icon' => $record[$this->args['icon_field']] ?: $this->args['icon'],
                    'color' => $record[$this->args['color_field']] ?: $this->args['color']
                ]
            );
        }
        foreach ($this->args['maps'] as $this->mapItem){
            array_push(
                $this->map,
                [
                    'latitude' => $this->mapItem['latitude'],
                    'longitude' => $this->mapItem['longitude'],
                    'html' => $this->args['html'] ?: ($this->mapItem['html'] ?: $this->mapItem['formatted_address']),
                    'icon' => $this->mapItem['icon'] ?: $this->args['icon'],
                    'color' => $this->mapItem['color'] ?: $this->args['color']
                ]
            );
        }
        $this->removeData();
        $options = json_encode($this->args, JSON_HEX_APOS);
        $map = json_encode($this->map, JSON_HEX_APOS);

        // outputs a twig markup, 
        $str = "<div class='map-canvas' data-mapobj='$map' data-zoom='$this->zoom' data-layerurl='$layerUrl' data-options='$options'></div>";
        return new \Twig_Markup($str, 'UTF-8');
    }
    // stuffing the array with.. stuff 
    private function unifyData()
    {
        if($this->args['record']) {
            array_push(
                $this->args['records'],
                $this->args['record']
            );
        }
        if($this->args['map']) {
            array_push(
                $this->args['maps'],
                $this->args['map']
            );
        }
        if($this->args['latitude']) {
            array_push(
                $this->args['maps'],
                [
                    'latitude' => $this->args['latitude'],
                    'longitude' => $this->args['longitude'],
                    'html' => $this->args['html'],
                    'icon' => $this->args['icon'],
                    'color' => $this->args['color']
                ]
            );
        }
    }
    private function removeData()
    {
        foreach ($this->mapfields as $this->mapfield){
            unset($this->args[$this->mapfield]);
        }
    }    
}
