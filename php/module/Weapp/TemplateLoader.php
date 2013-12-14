<?php
namespace Weapp;

use Herrera\Template\Engine;

function retrieveData( $origData, $path) {
    $data = $origData;

    foreach ( $path as $node ) {
        if ( !array_key_exists($node, $data)) return;
        $data = $data[$node];
    }

    if ( \is_string($data) ){
        str_replace($data, '\n', '<br />');
    }

    return $data;
}


class TemplateLoader{
    private $engine;
    private $context;

    private $templateMapping = array(
        'intro' => [
            '__TEMPLATE__' => 'estate-info.js',
            'estate_id' => array('__CTX__', array('estate_id')),
            'banner_id' => array('banner','img'),
            'selling_info' => array('selling_info', 'text'),
            'video_id' => array('video_info', 'id'),
            'video_title' => array('video_info', 'name'),
            'address' => array('location_info','address'),
            'lat' => array('location_info', 'lat'),
            'lng' => array('location_info', 'lng'),
            'intro' => array('intro_info', 'text'),
            'traffic' => array('traffic_info', 'text'),
        ],
    );

    public function __construct($includePath) {
        $this->engine = Engine::create($includePath);
    }

    public function setUpContext($estateId, $groupId, $name, $appId, $appKey, $wechatId){
        $this->context = array(
            'estate_id' => $estateId,
            'group_id' => $groupId,
            'name' => $name,
            'app_id' => $appId,
            'app_key' => $appKey,
            'wechat_id' => $wechatId,
        );
    }

    public function render($json, $type){
        if ($this->context == NULL) throw new \Exception('Call setUpContext before render.');

        $templateMapping = $this->templateMapping[$type];
        if ($templateMapping == NULL) throw new \Exception('Type '.$type.' not found.');

        $data = json_decode($json, true);

        $templateValues = array();
        foreach($templateMapping as $key => $value){
            if (Util::startsWith($key, '__')){

            }else{
                $head = $value[0];
                if (Util::startsWith($head, '__')){
                    $templateValues[$key] = retrieveData($this->context, $value[1]);
                }else{
                    $templateValues[$key] = retrieveData($data, $value);
                }
            }
        }

        $text = $this->engine->render($templateMapping['__TEMPLATE__'], $templateValues);

        /*
         * file output
         * */

        $path = Util::getPath($this->context['estate_id']);

        if (!file_exists($path)) {
            mkdir($path, 0700, true);
        }

        $fh = fopen($path.'/'.$templateMapping['__TEMPLATE__'], 'w');
        fwrite($fh, $text);
        fclose($fh);

        return $text;
    }
}