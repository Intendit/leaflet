<?php
namespace Bolt\Extension\johan\leaflet\Field;

use Bolt\Storage\Field\Type\FieldTypeBase;
use Doctrine\DBAL\Types\Type;

class leafletField extends FieldTypeBase{
    public function getName(){
        return 'leaflet';
    }

    public function getTemplate(){
        return '@bolt/leaflet.twig';
    }

    public function getStorageType(){
        return Type::getType('json');
        // return 'text';
    }

    public function getStorageOptions(){
        return ['default' => ''];
    }
}