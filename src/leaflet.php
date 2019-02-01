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

    public function registerFields(){
        return [
            new leafletField(),
        ];
    }

    // register twigfunctions
    protected function registerTwigFunctions(){
        return [
            'leaf' => ['getLeafletTemplate', ['is_safe' => ['html']]],
        ];
    }
    // register javascript/css paths
    // 
    protected function registerAssets(){

        $leaflet_js = Javascript::create()
            ->setFileName('js/app.js')
            ->setLate(true)
            ->setPriority(5)
            ->setZone(Zone::BACKEND);
        
        $leaflet_js_src = Javascript::create()
            ->setFileName('js/leaflet.js')
            ->setLate(true)
            ->setPriority(1)
            ->setZone(Zone::BACKEND);

        $leaflet_css_src = (new Stylesheet('css/leaflet.css'))
            ->setZone(Zone::BACKEND);
        
        return [
            $leaflet_js,            
            $leaflet_js_src,
            $leaflet_css_src,            
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
        return $this->renderTemplate('leaflet.twig');
    }
}
