<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Modules.php';

$class = 'WebSearch';
class WebSearch extends WebModules
{
    public function
    method_findKey($params)
    {
        $include = $this->setupSearch($params);

        $key = $params['key'];
        $key = explode('.', $key);
        $keys = array($key);
        $this->handler->findKeys($keys, $include);

        return $this->handler->getAllHits();
    }

    public function
    method_findKeys($params)
    {
        $include = $this->setupSearch($params);

        $keys = $params['keys'];
        $this->handler->findKeys($keys, $include);

        return $this->handler->getAllHits();
    }

    public function
    method_search($params)
    {
        $include = $this->setupSearch($params);

        $terms = $params['terms'];
        $this->handler->findTerms($terms, $include);

        return $this->handler->getAllHits();
    }

    public function
    method_searchSavedSet($params)
    {
        $set = null;
        $module = null;

        if (array_key_exists('set', $params))
            $set = $params['set'];
        else
        {
            $e = new IMuException('SavedSetSearchNoSet');
            $e->setCode(400);
            throw $e;
        }

        if (array_key_exists('module', $params))
            $module = $params['module'];
        else
        {
            $e = new IMuException('SavedSetSearchNoModule');
            $e->setCode(400);
            throw $e;
        }

        $hits = null;
        $file = $set;
        IMuTrace::write(3, 'fetching irn set: file %s', $file);
        try
        {
            $this->setupSearch($params);
            $this->handler->restoreFromTemp($file, $module);
        }
        catch (Exception $e)
        {
            $e = new IMuException('SavedSetSearchCannotRestoreSet', "$e:set=$set,module=$module");
            $e->setCode(500);
            throw $e;
        }
        return $this->handler->getAllHits();
    }

    private function
    setupSearch($params)
    {
        global $config;

        $this->handler->addSearchAliases($config['search-aliases']);
        $this->handler->addFetchSets($config['fetch-sets']);

        $include = $config['include-modules'];
        if (isset($params['include']))
            $include = $params['include'];

        return $include;
    }
}
?>
