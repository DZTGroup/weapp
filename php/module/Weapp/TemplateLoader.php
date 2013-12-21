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
            '__TARGET__' => 'impression.js',
            'estate_id' => array('__CTX__', array('estate_id')),
            'sum' => array('init', 'number'),
            'impressions' => array('__OBJECT__', array('impressions')),
        ),
        // pic show
        'picture' => array(
            '__DEFAULT__' => array(),
            '__TEMPLATE__' => 'picture.js.php',
            '__TARGET__' => 'picture.js',
            'estate_id' => array('__CTX__', array('estate_id')),
            'data' => array('__OBJECT__', array()),
        ),
        // visit group
        'group' => array(
            '__DEFAULT__' => array(),
            '__TEMPLATE__' => 'group.js.php',
            '__TARGET__' => 'group.js',
            'estate_id' => array('__CTX__', array('estate_id')),
            'groupId' => array('__CTX__', array('group_id')),
            'startDate' => array('event', 'sign_end_date'),
            'startTime' => array('event', 'sign_end_time'),
            'endDate' => array('event', 'watch_end_date'),
            'endTime' => array('event', 'watch_end_time'),
            'routes' => array('__OBJECT__',array('lines')),
            'cookies' => array('__SPLIT__', array('event', 'discount')),
            'announcement' => array('__SPLIT__', array('event', 'announce')),
        ),
        // multi layer ad
        'advertise' => array(
            '__DEFAULT__' => array(),
            '__TEMPLATE__' => 'ad.js.php',
            '__TARGET__' => 'ad.js',
            'estate_id' => array('__CTX__', array('estate_id')),

            //TODO
            'title' => array('intro', 'title'),
            'desc' => array('intro', 'desc'),
            'banner_id' => array('intro', 'img'),
            'ads' => array('__OBJECT__', array('list')),

            '__ARRAY_REF__' => array('sub_advertise',  array('list')),
        ),

        'sub_advertise' => array(
            '__DEFAULT__' => array(),
            '__TEMPLATE__' => 'sub-ad.js.php',
            '__TARGET__' => 'sub-ad.%index%.js',

            'id' => array('__CTX__', array('index')),
            'intro' => array('__OBJECT__', array('intro')),
        ),
    );

    public function __construct($includePath) {
        $this->engine = Engine::create($includePath);
    }

    private function decorateTemplateValue($tvalue){
        foreach($this->context as $key => $value){
            $tvalue = preg_replace('/%'.$key.'%/', $value, $tvalue);
        }

        return $tvalue;
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

    public function render($content, $type, $target='wechat', $is_root = true){
        if ($this->context == NULL) throw new \Exception('Call setUpContext before render.');

        $templateMapping = $this->templateMapping[$type];
        if ($templateMapping == NULL) throw new \Exception('Type '.$type.' not found.');

        $data = json_decode($content, true);
        if( $is_root ){
            $this->context['entity_id'] = $data['entity_id'];
            $this->context['group_id'] = $data['group_id'];
            $data = $data['content'];
        }

        $templateValues = array();
        foreach($templateMapping as $key => $value){
            if (Util::startsWith($key, '__')){
                // external templating
                if(Util::startsWith($key, '__ARRAY_REF__')){
                    $arr = retrieveData($data, $value[1]);
                    //check
                    if ( ! is_array($arr)) continue;
                    $index = 0;
                    foreach($arr as $item){
                        $this->context['index'] = $index;
                        $this->render(json_encode($item), $value[0], $target, false);
                        $index ++;
                    }
                    unset($this->context['index']);
                }
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

                // remove all line breaks in text
                if(is_string($templateValues[$key])){
                    $templateValues[$key] = preg_replace("/\r\n|\r|\n/", ' ', $templateValues[$key]);
                }
            }
        }

        $text = $this->engine->render($this->decorateTemplateValue($templateMapping['__TEMPLATE__']), $templateValues);

        /*
         * file output
         * */

        $path = Util::getPath($this->context['estate_id']).'/'.$target;

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $fh = fopen($path.'/'.$this->decorateTemplateValue($templateMapping['__TARGET__']), 'w');
        fwrite($fh, $text);
        fclose($fh);

        return $text;
    }
}