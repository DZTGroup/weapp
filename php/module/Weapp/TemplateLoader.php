<?php
namespace Weapp;

use Herrera\Template\Engine;

function retrieveData( $origData, $path) {
    $data = $origData;

    foreach ( $path as $node ) {
        if ( !is_array($data) || !array_key_exists($node, $data)) return;
        $data = $data[$node];
    }

    return $data;
}

class TemplateLoader{
    private $engine;
    private $context;

    private $templateMapping = array(
        'intro' => array(
            '__DEFAULT__' => array(
                'banner_id' => '../banner.jpg',
            ),
            '__TEMPLATE__' => 'intro.js.php',
            '__TARGET__' => 'intro.js',
            'estate_id' => array('__CTX__', array('estate_id')),
            'banner_id' => array('banner','img'),
            'selling_info' => array('__SPLIT__', array('saling_info', 'text')),
            'video_id' => array('video_info', 'link'),
            'video_title' => array('video_info', 'name'),
            'address' => array('location_info','address'),
            'lat' => array('location_info', 'lat'),
            'lng' => array('location_info', 'lng'),
            'intro' => array('intro_info', 'text'),
            'traffic' => array('traffic_info', 'text'),
        ),
        'impression' => array(
            '__DEFAULT__' => array(),
            '__TEMPLATE__' => 'impression.js.php',
            '__TARGET__' => 'impression.json',
            'estate_id' => array('__CTX__', array('estate_id')),
            'sum' => array('init', 'number'),
            'impressions' => array('__OBJECT__', array('impressions')),
        ),
    );

    public function __construct($includePath) {
        $this->engine = Engine::create($includePath);
    }

    public function setUpContext($estateId, $name, $appId, $appKey, $wechatId){
        $this->context = array(
            'estate_id' => $estateId,
            'name' => $name,
            'app_id' => $appId,
            'app_key' => $appKey,
            'wechat_id' => $wechatId,
        );
    }

    public function render($content, $type, $target='wechat'){
        if ($this->context == NULL) throw new \Exception('Call setUpContext before render.');

        $templateMapping = $this->templateMapping[$type];
        if ($templateMapping == NULL) throw new \Exception('Type '.$type.' not found.');

        $data = json_decode($content, true);

        $templateValues = array();
        foreach($templateMapping as $key => $value){
            if (Util::startsWith($key, '__')){

            }else{
                $head = $value[0];
                if (Util::startsWith($head, '__CTX__')){
                    $templateValues[$key] = retrieveData($this->context, $value[1]);
                }elseif(Util::startsWith($head, '__SPLIT__')){
                    $plain = retrieveData($data, $value[1]);
                    // string => array
                    if (is_string($plain))
                        $templateValues[$key] = preg_split("/\r\n|\r|\n/", $plain);
                    else
                        $templateValues[$key] = ARRAY();
                }elseif(Util::startsWith($head, '__OBJECT__')){
                    $templateValues[$key] = retrieveData($data, $value[1]);
                }else{
                    $templateValues[$key] = retrieveData($data, $value);
                }

                if ( !$templateValues[$key] && array_key_exists($key, $templateMapping['__DEFAULT__'])){
                    $templateValues[$key] = $templateMapping['__DEFAULT__'][$key];
                }
            }
        }

        $text = $this->engine->render($templateMapping['__TEMPLATE__'], $templateValues);

        /*
         * file output
         * */

        $path = Util::getPath($this->context['estate_id']).'/'.$target;

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $fh = fopen($path.'/'.$templateMapping['__TARGET__'], 'w');
        fwrite($fh, $text);
        fclose($fh);

        return $text;
    }
}