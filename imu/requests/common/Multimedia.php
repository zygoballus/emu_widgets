<?php
/* Copyright (c) 2011-2013 KE Software Pty Ltd
*/
require_once dirname(__FILE__) . '/Handler.php';

require_once IMu::$lib . '/Module.php';
require_once IMu::$lib . '/Terms.php';
require_once IMu::$lib . '/Trace.php';

/**
 * @class WebMultimedia
 * @brief Retrieve multimedia resources from the IMu server.
 * @code{.php}
 *   require_once 'requests/common/Multimedia.php'
 *   - OR -
 *   request.php?request=Multimedia&key=1
 * @endcode
 *
 * @details Provides a simple mechanism to generate an HTTP response to output
 * information or data for a single multimedia resource from the IMu server. It
 * also provides a simple caching mechanism based on the given parameters.
 *
 * If caching is enabled:
 * - all resources retrieved from the IMu server will be added to the cache.
 * - the cache will be consulted before resources are retrieved from the IMu
 * server.
 *
 *
 * @see
 *   WebMultimediaCache
 * @copyright
 *   2011-2012 KE SOFTWARE PTY LTD
 */
$class = 'WebMultimedia';
class WebMultimedia extends WebHandler
{
    /**
     * Removes all entries from the cache.
     */
    public function
    method_clearCache()
    {
        IMuTrace::write(1, 'clearing cache');
        $this->loadCache()->clear();
    }

    /**
     * Outputs cache information encoded as a json string.
     */
    public function
    method_fetchCacheInfo()
    {
        IMuTrace::write(1, 'fetching cache information');
        $info = $this->loadCache()->entries;
        IMuTrace::write(3, 'cache information: %s', $info);
        return($info);
    }

    /**
     * Outputs resource information encoded as a json string.
     *
     * Accepts the same parameters as method_fetch().
     *
     * @note The multimedia resource itself will still be retrieved and, if
     * caching is enabled, cached even though this method only returns
     * information about the resource.
     *
     * @see method_fetch()
     *
     * @param array $params
     *   The request parameters.
     */
    public function
    method_fetchInfo(array $params)
    {
        IMuTrace::write(1, 'fetching resource information');
        $this->params = $params;
        $this->validateParams();

        $resource = $this->fetchResource();
        if (isset($resource['file']))
        {
            @fclose($resource['file']);
            unset($resource['file']);
        }
        IMuTrace::write(3, 'multimedia info: %s', $resource);
        return($resource);
    }

    /**
     * Retrieves and outputs a multimedia resource.
     *
     * Parameters:
     *
     * - cache: Specify caching behaviour for this request. Requires that the
     * cache directory is set up correctly.
     *
     *   - no (default): Do not check the cache for resources or cache
     *   resources retrieved from the IMu server.
     *
     *   - redirect: Requires that requests are redirected (using HTTP Location
     *   header) to files in the cache. Caches all resources retrieved from the
     *   IMu server.
     *
     *   - yes: Check the cache for resources and cache all resources retrieved
     *   from the IMu server.
     *
     * - disposition: Set the Content-disposition HTTP header for the displayed
     * multimedia.
     *
     *   - attachment: Suggest to agents that the resource should be downloaded
     *   and not displayed.
     *
     *   - inline (default): Suggest to agents that the resource should be
     *   displayed.
     *
     * - filter: Specify the particular resolution or supplementary multimedia
     * resource based on certain characteristics of the resource.
     *
     *   - Format: \<type\>:\<operator\>:\<value\>[;...]
     *
     *   - Type (not a complete list):
     *
     *     - height: The height (pixels) of the resource (images only).
     *     - identifier: The record identifier (MulIdentifier) column.
     *     - index: The index of the resource in the multimedia record
     *     documents & supplementary tables (combined).
     *     - kind: Specify the (abstract) kind of resource e.g. thumbnail,
     *     master, resolution or supplementary.
     *     - mimeFormat: The media format of the resource.
     *     - mimeType: The media type of the resource.
     *     - size: The file size of the resource.
     *     - width: The width (pixels) of the resource (images only).
     *
     *   - Operator:
     *
     *     - eq: Equals.
     *     - ne: Not equals.
     *     - lt: Less than.
     *     - gt: Greater than.
     *     - le: Less than or equal to.
     *     - ge: Greater than or equal to.
     *     - bf: Best fit. Selects the resource with the closest value.
     *     - bg: Similar to best fit. Selects the resource with the closest
     *     value greater than or equal to the supplied value.
     *
     *     The lt, gt, le, ge, bf and bg operators can only be used with filter
     *     types that support numeric comparison.
     *
     *   - Examples:
     *
     *     - kind:eq:resolution;width:lt:400
     *
     *     Select a resolution (not master, thumbnail or supplementary
     *     resources) with a width less than 400.
     *
     *     - width:gt:300;height:gt:300
     *
     *     Select the first resource with a width and height greater than 300.
     *
     *     - width:bf:300;height:bf:300
     *
     *     Select the resource whose width and height values are both closest
     *     to 300.
     *
     *     - kind:eq:thumbnail
     *
     *     Select the thumbnail image.
     *
     *     - mimeType:eq:video
     *
     *     Select the first video resource.
     *
     * - key: Specify the key (irn) of the multimedia record from which you
     * want to retrieve a resource.
     *
     * - identifier: Specify the identifier (MulIdentifier) of the multimedia
     * record from which you want to retrieve a resource.
     *
     * - modifier: Specify an on-the-fly modification to the resource.
     *
     *   - Format: \<type\>:\<value\>[;...]
     *
     *   - Type (not a complete list):
     *
     *     - height: Resize the resource to the specified height. (images
     *     only).
     *     - format: Convert the resource to the specified media format.
     *     (images only).
     *     - width: Resize the resource to the specified width. (images only).
     *
     *   - Examples:
     *
     *     - format:jpeg
     *
     *     Convert the resource to the JPEG format.
     *
     *     - width:300
     *
     *     Resize the resource to have a width of 300 pixels.
     *
     *     - format:jpeg;height:90
     *
     *     Convert the resource to the JPEG format and resize to have a height
     *     of 90 pixels.
     *
     * Configuration options:
     *
     * - multimedia-cache: Set the default caching parameter. See the 'cache'
     * parameters for allowed values.
     *
     * @param array $params
     *   The request parameters.
     */
    public function
    method_fetch(array $params)
    {
        IMuTrace::write(1, 'fetching resource');
        $this->params = $params;
        $this->validateParams();

        $this->output = 'resource';
        $resource = $this->fetchResource();
        IMuTrace::write(3, 'multimedia resource: %s', $resource);
        return($resource);
    }

    /**
     * The multimedia cache.
     * @var WebMultimediaCache $cache
     */
    protected $cache;
    /**
     * The parameters given to the process() method.
     * @var array $params
     */
    protected $params;
    /**
     * The source of fetched multimedia (cache or server).
     * @var string $source
     */
    protected $source;

    /**
     * Generates a 'filter' string in the format used by the IMu server.
     *
     * Convert the 'filter' parameter format supplied to the process() method
     * to the format that is used by the IMu server and append it to $column
     * parameter supplied to this method.
     *
     * @param string &$column
     *   A resource column string.
     *
     * @throws IMuException
     *   If the 'filter' parameter is malformed.
     * @throws IMuException
     *   If the 'filter' parameter operator is unknown.
     *
     * @see $params
     */
    protected function
    addFilters(&$column)
    {
        if (! isset($this->params['filter']))
        {
            return;
        }
        $count = 0;
        $column .= '(';
        foreach (explode(';', $this->params['filter']) as $filter)
        {
            @list($name, $op, $value) = explode(':', $filter, 3);
            if (! isset($name) || ! isset($op) || ! isset($value))
            {
                $e = new IMuException('MultimediaMalformedFilter', $filter);
                $e->setCode(400);
                throw $e;
            }
            switch (strtolower($op))
            {
                case 'eq':
                    $op = '==';
                    break;
                case 'ne':
                    $op = '!=';
                    break;
                case 'lt':
                    $op = '<';
                    break;
                case 'gt':
                    $op = '>';
                    break;
                case 'le':
                    $op = '<=';
                    break;
                case 'ge':
                    $op = '>=';
                    break;
                case 'bf':
                    $op = '@';
                    break;
                case 'bg':
                    $op = '^';
                    break;
                default:
                    $e = new IMuException('MultimediaUnknownFilterOperator',
                        $op);
                    $e->setCode(400);
                    throw $e;
                    break;
            }
            if ($count > 0)
                $column .= ';';
            $count++;
            $column .= $name . $op . $value;
        }
        $column .= ')';
    }

    /**
     * Generates a 'modifier' string in the format used by the IMu server.
     *
     * Convert the 'modifier' parameter format supplied to the process() method
     * to the format that is used by the IMu server and append it to $column
     * parameter supplied to this method.
     *
     * @param string &$column
     *   A resource column string.
     *
     * @throws IMuException
     *   If the 'modifier' parameter is malformed.
     *
     * @see $params
     */
    protected function
    addModifiers(&$column)
    {
        $column .= '{resource:only';
        if (isset($this->params['modifier']))
        {
            foreach (explode(';', $this->params['modifier']) as $modifier)
            {
                @list($name, $value) = explode(':', $modifier, 2);
                if (! isset($name) || ! isset($value))
                {
                    $e = new IMuException('MultimediaMalformedModifier',
                        $modifier);
                    $e->setCode(400);
                    throw $e;
                }
                $column .= ';' . $name . ':' . $value;
            }
        }
        $column .= '}';
    }

    /**
     * Generates an md5 cache descriptor.
     *
     * The descriptor is based on the key, identifier, filter and modifier
     * parameters supplied to process().
     *
     * @see $params
     */
    protected function
    buildCacheDescriptor()
    {
        $parameters = '';
        foreach (array('key', 'identifier', 'filter', 'modifier') as $name)
        {
            if (! isset($this->params[$name]))
                continue;
            $value = $this->params[$name];
            #
            # Apply a consistent order to parameters that allow multiple
            # 'parts' so that we generate the same descriptor despite the
            # ordering of the parts.
            #
            if ($name == 'filter' || $name == 'modifier')
            {
                $values = explode(';', $value);
                sort($values);
                $value = implode(';', $values);
            }
            if ($parameters != '')
                $parameters .= '&';
            $parameters .= $name . '=' . $value;
        }
        IMuTrace::write(3, 'descriptor string: %s', $parameters);
        return(md5($parameters));
    }

    /**
     * Fetches a multimedia resource array.
     *
     * If caching is enabled it checks the cache first and, if the resource is
     * not found there, it retrieves the resource from the IMu server.
     *
     * @retval array
     *   A multimedia resource.
     */
    protected function
    fetchResource()
    {
        if ($this->params['cache'] != 'no')
            return($this->fetchCacheResource());
        else
            return($this->fetchServerResource());
    }

    /**
     * Retrieves an entry from the cache.
     *
     * If no entry is found in the cache a resource is fetched from the IMu
     * server, added to the cache and returned.
     *
     * @retval array
     *   A multimedia resource.
     *
     * @throws IMuException
     *   If the 'cache' parameter is 'redirect' and we could not add/fetch the
     *   multimedia resource from the cache.
     *
     * @see buildCacheDescriptor()
     * @see fetchServerResource
     */
    protected function
    fetchCacheResource()
    {
        $descriptor = $this->buildCacheDescriptor();
        $cache = null;
        try
        {
            $cache = $this->loadCache();
        }
        catch (IMuException $e)
        {
            if ($this->params['cache'] == 'redirect')
                throw $e;
            IMuTrace::write(1, 'cache error: ' . $e);
            return($this->fetchServerResource());
        }

        $resource = $cache->lookup($descriptor);
        if ($resource !== false)
        {
            $this->source = 'cache';
            return($resource);
        }

        #
        # Cache miss.
        #
        IMuTrace::write(2, 'multimedia not found in cache');
        $resource = $this->fetchServerResource();
        try
        {
            $cache->add($descriptor, $resource);
            #
            # We could just return the resource from the server but since we
            # may need to be serving the resource from the cache
            # (cache=redirect parameter) we lookup the cache resource.
            #
            $cacheResource = $cache->lookup($descriptor);
            #
            # In the unlikely event we cannot lookup a cache entry we just
            # successfully added, throw an exception.
            #
            if ($cacheResource === false)
                throw new IMuException('MultimediaCacheLookup', $descriptor);

            $this->source = 'cache';
            $resource = $cacheResource;
        }
        catch (IMuException $e)
        {
            #
            # If we are using redirect then we must serve content from the
            # cache. Fail if we cannot.
            #
            if ($this->params['cache'] == 'redirect')
                throw $e;
            IMuTrace::write(1, 'cache error: ' . $e);
        }
        return($resource);
    }

    /**
     * Retrieves a resource from the IMu server.
     *
     * @retval array
     *   A multimedia resource.
     *
     * @throws IMuException
     *   If the IMu server returns an empty result set.
     */
    protected function
    fetchServerResource()
    {
        IMuTrace::write(2, 'fetching server resource');

        $terms = $this->getTerms();
        $hits = $this->handler->findTerms($terms);
        IMuTrace::write(2, 'multimedia server hits: %d', $hits);
        if ($hits == 0)
        {
            $e = new IMuException('MultimediaResourceNotFound');
            $e->setCode(404);
            throw $e;
        }

        $resourceColumn = 'resource';
        $this->addFilters($resourceColumn);
        $this->addModifiers($resourceColumn);
        IMuTrace::write(3, 'resource column: %s', $resourceColumn);

        $result = $this->handler->fetch('start', 0, 1, array($resourceColumn,
            'title=MulTitle'));
        IMuTrace::write(3, 'result: %s', $result);

        if (count($result->rows) == 0)
        {
            $e = new IMuException('MultimediaResourceNotFound');
            $e->setCode(404);
            throw $e;
        }
        $record = $result->rows[0];
        if (! isset($record['resource']))
        {
            $e = new IMuException('MultimediaResourceNotFound');
            $e->setCode(404);
            throw $e;
        }
        $this->source = 'server';

        # Add to the resource information.
        #
        $resource = $record['resource'];
        foreach ($record as $column => $value)
        {
            if ($column == 'rownum' || $column == 'resource')
                continue;
            if ($column == 'irn')
            {
                $resource['key'] = $value;
                continue;
            }
            $resource[$column] = $value;
        }
        return($resource);
    }

    protected function
    getHandler(&$request)
    {
		$this->session->suspend = true;

        $this->handler = new IMuModule('emultimedia', $this->session);
        $this->handler->destroy = false;
    }

    /**
     * Gets an IMuTerms object.
     *
     * The key and/or identifier parameters supplied to the process() method
     * are automatically added to the IMuTerms object.
     *
     * @retval IMuTerms
     */
    protected function
    getTerms()
    {
        $terms = new IMuTerms();
        if (isset($this->params['key']))
            $terms->add('irn', $this->params['key']);
        if (isset($this->params['identifier']))
            $terms->add('MulIdentifier', $this->params['identifier']);
        return($terms);
    }

    /**
     * Instantiates and returns a WebMultimediaCache object.
     *
     * @retval WebMultimediaCache
     */
    protected function
    loadCache()
    {
        if (! isset($this->cache))
            $this->cache = new WebMultimediaCache('cache/multimedia');
        return($this->cache);
    }

    /**
     * Outputs (or redirects to) the given multimedia resource.
     *
     * Also emits the required HTTP headers.
     *
     * @param array $resource
     *   A multimedia resource array.
     *
     * @see redirectFile()
     */
    protected function
    output_resource(array $resource)
    {
        if (isset($this->source))
            header('X-IMu-cache: ' .
                ($this->source == 'cache' ? 'true' : 'false'));

        if ($this->params['cache'] == 'redirect')
        {
            IMuTrace::write(2, 'redirecting resource: %s', $resource);
            $this->redirectFile($resource);
            return;
        }

        $type = $resource['mimeType'];
        $format = $resource['mimeFormat'];
        header("Content-type: $type/$format");

        $identifier = $resource['identifier'];
        $disposition = $this->params['disposition'] .
            ';filename="' . $identifier . '"';
        header('Content-disposition: ' . $disposition);

        /* TODO: we have the size in the resource array. Use that instead of
         * stat?
         */
        $handle = $resource['file'];
        $stat = @fstat($handle);
        if ($stat)
            header('Content-length: ' . $stat['size']);

		/* A bit of magic to ensure the output buffers are completely clean
		** before we start sending binary data
		*/
		if (ob_get_length() > 0)
			ob_clean();
		flush();
        for (;;)
        {
            $data = @fread($handle, 8192);
            if ($data === false)
            {
                IMuTrace::write(1, 'multimedia read error');
                break;
            }
            if (strlen($data) == 0)
                break;
            print($data);
        }
        @fclose($handle);
    }

    /**
     * Redirects to a cached multimedia resource.
     *
     * Generate an HTTP redirection (using the HTTP Location header) to the
     * given cached multimedia resource.
     *
     * @param array $resource
     *   A multimedia resource array.
     *
     * @throws IMuException
     *   If we could not get stream metadata from the resource file handle.
     */
    protected function
    redirectFile(array $resource)
    {
        $metadata = stream_get_meta_data($resource['file']);
        if (! isset($metadata))
        {
            $e = new IMuException('MultimediaRedirect');
            $e->setSystem($php_errormsg);
            throw $e;
        }
        if (! isset($metadata['uri']))
            throw new IMuException('MultimediaRedirect', 'missing uri');

        header('Location: ' . $metadata['uri']);
    }

    /**
     * Validates the parameters supplied to the process() method.
     *
     * Unknown parameters are silently ignored.
     *
     * @throws IMuException
     *   If the parameters are invalid.
     *
     * @see $params
     */
    protected function
    validateParams()
    {
        IMuTrace::write(3, 'params: %s', $this->params);

        if (! isset($this->params['key']) &&
            ! isset($this->params['identifier']))
        {
            $e = new IMuException('MultimediaBadRequest',
                'missing key or identifier parameter');
            $e->setCode(400);
            throw $e;
        }
        if (isset($this->params['key']) &&
            preg_match('/^\d+$/', $this->params['key']) !== 1)
        {
            $e = new IMuException('MultimediaBadRequest',
                    'bad key parameter', $this->params['key']);
            $e->setCode(400);
            throw $e;
        }

        if (! isset($this->params['cache']))
        {
            global $config;
            if (isset($config['multimedia-cache']))
                $this->params['cache'] = $config['multimedia-cache'];
            else
                $this->params['cache'] = 'no';
        }

        if (! isset($this->params['disposition']))
        {
            $this->params['disposition'] = 'inline';
        }
        else if ($this->params['disposition'] != 'inline' &&
                 $this->params['disposition'] != 'attachment')
        {
            $e = new IMuException('MultimediaBadRequest',
                'invalid disposition parameter');
            $e->setCode(400);
            throw $e;
        }
    }
}

/**
 * A simple multimedia cache.
 *
 * The multimedia cache allows adding multimedia resources retrieved from the
 * IMU server indexed by a given string (descriptor). The multimedia resource
 * can then be retrieved or removed from the cache using that descriptor. The
 * cache implements a simple strategy for limiting the size of the cache; the
 * least recently used (i.e. added or looked up) items are removed form the
 * cache when the addition of a new cache item would cause the cache to exceed
 * its maximum size.
 *
 * @code{.php}
 *   require_once 'requests/common/Multimedia.php'
 * @endcode
 *
 * Configuration options:
 *
 * - multimedia-cache-max-size: Specify the maximum size (in bytes) that the
 * cache will use. If any incoming multimedia will make the cache exceed this
 * value then the oldest cache entries are removed until the incoming entry
 * 'fits'. An exception will be thrown if you try to add multimedia that is
 * larger than this value. Defaults to 1GB.
 *
 * @copyright
 *   2011-2012 KE SOFTWARE PTY LTD
 *
 * @internal
 *   Might be nice to
 *   - push class out to another file.
 *   - use a parent cache class that handles the generic cache stuff.
 *   - use a cache entry class.
 */
class WebMultimediaCache
{
    /**
     * Constructor.
     *
     * @param string $dir
     *   The directory to store the cache files.
     *
     * @see #$dir
     */
    public function
    __construct($dir)
    {
        if (! file_exists($dir) && ! @mkdir($dir, 0777, true))
        {
            $e = new IMuException('MultimediaCacheDir', $dir);
            $e->setSystem($php_errormsg);
            throw $e;
        }
        /* mkdir is modified by the current umask. We don't want to change the
         * umask (see PHP umask function page for reason) so we attempt to
         * assign the permissions we want directly.
         */
        if (@chmod($dir, 0777) === false)
            IMuTrace::write(1, 'could not change permissions of %s: %s', $dir,
                $php_errormsg);

        $file = $dir . '/entries.json';
        $handle = $this->openFile($file, 'a+');

        if (@chmod($file, 0666) === false)
            IMuTrace::write(1, 'could not change permissions of %s: %s', $file,
                $php_errormsg);

        $this->dir = $dir;
        $this->file = $file;
        $this->handle = $handle;

        global $config;
        if (isset($config['multimedia-cache-max-size']))
            $this->maxSize = $config['multimedia-cache-max-size'];
        else
            $this->maxSize = 1024 * 1024 * 1024; # 1GB
    }

    /**
     * Helper method for sorting cache entries. Used to sort entries by the
     * date they were added/last accessed.
     *
     * @param array $a
     *   First cache entry.
     * @param array $b
     *   Second cache entry.
     */
    public static function
    compare($a, $b)
    {
        $aDate = strtotime($a['date']);
        $bDate = strtotime($b['date']);

        if ($aDate == $bDate)
            return(0);
        return($aDate < $bDate ? -1 : 1);
    }

    /**
     * Adds a multimedia resource to the cache.
     *
     * The given descriptor is used as an index value for subsequent lookups or 
     * removals. The descriptor should be unique to the multimedia resource
     * that is being added.
     *
     * @param string $descriptor
     *   The index value for lookups.
     * @param array $resource
     *   The multimedia resource to add to the cache.
     *
     * @throws IMuException
     *   If the multimedia resource does not contain an open file handle.
     * @throws IMuException
     *   If the size of the resource exceeds the maximum size of the cache.
     */
    public function
    add($descriptor, array $resource)
    {
        IMuTrace::write(2, 'cache add');
        $this->lock();
        $this->read();

        if (! isset($resource['file']))
            throw new IMuException('MultimediaCacheAdd',
                'missing resource file handle');

        if ($resource['size'] > $this->maxSize)
        {
            $mesg = sprintf(
                'resource size %s is greater than max cache size %s',
                $resource['size'], $this->maxSize);
            throw new IMuException('MultimediaCacheAdd', $mesg);
        }
        $this->prune($resource['size']);

        $ext = pathinfo($resource['identifier'], PATHINFO_EXTENSION);
        $path = $this->dir . '/' . $descriptor . '.' . $ext;
        $this->writeFile($resource['file'], $path);

        $entry = array();
        $entry['date'] = date('c');
        $entry['path'] = $path;
        $entry['resource'] = $resource;
        #
        # Unset the resource file handle. We cannot write it to the cache.
        #
        unset($entry['resource']['file']);
        $this->_entries[$descriptor] = $entry;

        $this->write();
        $this->unlock();
    }

    /**
     * Clears all cache entries.
     *
     * Remove all files from the cache and clear the cache entries file.
     *
     * @throws Exception
     *   If a cache file could not be removed.
     */
    public function
    clear()
    {
        IMuTrace::write(2, 'cache clear');
        $this->lock();
        $this->read();
        try
        {
            foreach (array_keys($this->_entries) as $descriptor)
                $this->removeEntry($descriptor);
        }
        catch (Exception $e)
        {
            #
            # If an error happens while clearing the cache we want to make sure
            # that the current state of the entries file is written back to
            # disk.
            #
            $this->write();
            throw $e;
        }
        $this->write();
        $this->unlock();
    }

    /**
     * Retrieves the cache entry associted with the given descriptor.
     *
     * @param string $descriptor
     *   The index of the cache entry to lookup.
     *
     * @retval array
     *   A multimedia resource array.
     * @retval false
     *   if the cache entry could not be found.
     *
     * @see add()
     */
    public function
    lookup($descriptor)
    {
        IMuTrace::write(2, 'cache lookup: %s', $descriptor);
        $this->lock();
        $this->read();

        $resource = false;
        if (array_key_exists($descriptor, $this->_entries))
        {
            IMuTrace::write(2, 'cache hit');
            #
            # Update the date the cache item was used.
            #
            $entry = $this->_entries[$descriptor];
            $entry['date'] = date('c');
            $this->_entries[$descriptor] = $entry;
            $this->write();

            $resource = $entry['resource'];
            $resource['file'] = $this->openFile($entry['path']);
        }
        $this->unlock();
        return($resource);
    }

    /**
     * Removes the cache entry associted with the given descriptor.
     *
     * @param string $descriptor
     *   The index of the cache entry to remove.
     *
     * @see add()
     */
    public function
    remove($descriptor)
    {
        $this->lock();
        $this->read();
        $this->removeEntry($descriptor);
        $this->write();
        $this->unlock();
    }

    /**
     * Allows access to some restricted object members like they were public
     * members.
     *
     * Provides read-only access to some object members by other
     * names. This method should **not** be called directly. The supported
     * members aliases are:
     *
     * - entries: access the #$_entries member variable.
     *
     * For example:
     * @code
     *   $entries = $cache->entries;
     * @endcode
     *
     * @see
     *   http://www.php.net/manual/en/language.oop5.overloading.php#object.get
     *
     * @param string $name
     *   The name (alias) of the member to access.
     * @retval mixed
     *  The object member.
     *
     * @throws IMuException
     *   If the given parameter is unknown.
     */
    public function __get($name)
    {
        $this->lock();
        $this->read();
        switch ($name)
        {
            case 'entries':
                $value = $this->_entries;
                break;
            default:
                throw new IMuException('MultimediaCacheProperty', $name);
                break;
        }
        $this->unlock();
        return($value);
    }

    /**
     * The directory to store the cache files.
     * @var string $dir
     */
    protected $dir;
    /**
     * The cache entries.
     * @var array $_entries
     */
    protected $_entries = array();
    /**
     * The path to the entries file.
     * @var string $file
     */
    protected $file;
    /**
     * A file handle to the entries file.
     * @var resource $handle
     */
    protected $handle;
    /**
     * The maximum cache size in bytes.
     * @var int $maxSize
     */
    protected $maxSize;

    /**
     * Calculates and returns the total size of all cache multimedia files.
     *
     * @retval int
     *   The cache size in bytes.
     */
    protected function
    getCacheSize()
    {
        $size = 0;
        foreach (array_values($this->_entries) as $entry)
            $size += $entry['resource']['size'];
        return($size);
    }

    /**
     * Locks the #$handle resource.
     *
     * @throws IMuException
     *   If the resource could not be locked.
     */
    protected function
    lock()
    {
        IMuTrace::write(2, 'locking cache');
        if (! @flock($this->handle, LOCK_EX))
        {
            $e = new IMuException('MultimediaCacheLock', $this->file);
            $e->setSystem($php_errormsg);
            throw $e;
        }
    }

    /**
     * Removes cache entries if the cache is going to exceed its maximum size.
     *
     * Calculate if the addition of a file with size given by $base
     * will cause the cache to exceed its maximum size (#$maxSize). If so,
     * remove the least recently used entries from the cache until it can
     * accomodate a file of size $base.
     *
     * @param int $base
     *   file size in bytes.
     */
    protected function
    prune($base = 0)
    {
        $size = $this->getCacheSize();
        if (count($this->_entries) == 0 || ($base + $size) <= $this->maxSize)
            return;

        IMuTrace::write(2, 'cache prune');
        $this->sort();

        while (count($this->_entries) > 0 && ($base + $size) > $this->maxSize)
        {
            $descriptor = key($this->_entries);
            $this->removeEntry($descriptor);
            $size = $this->getCacheSize();
        }
    }

    /**
     * Reads and decodes (from json) the cache entries file from disk.
     *
     * @retval array
     *   The cache entries.
     *
     * @throws IMuException
     *   If an error occurs reading the entries file from disk.
     * @throws IMuException
     *   If an error occurs decoding the file from json.
     */
    protected function
    read()
    {
        IMuTrace::write(2, 'reading cache');
        $contents = @stream_get_contents($this->handle, -1, 0);
        if ($contents === false)
        {
            $e = new IMuException('MultimediaCacheRead', $this->file);
            $e->setSystem($php_errormsg);
            throw $e;
        }
        if ($contents != '')
        {
            $entries = json_decode($contents, true);
            if ($entries === null)
            {
                $e = new IMuException('MultimediaCacheRead', $this->file);
                $e->setSystem(json_last_error());
                throw $e;
            }
            $this->_entries = $entries;
        }
        return($this->_entries);
    }

    /**
     * Removes the cache file and entry associated with the given descriptor.
     *
     * @param string $descriptor
     *   The index of the cache entry to remove.
     *
     * @throws IMuException
     *   If the cache file could not be removed.
     *
     * @see add()
     */
    protected function
    removeEntry($descriptor)
    {
        if (! array_key_exists($descriptor, $this->_entries))
            return;

        IMuTrace::write(2, 'cache remove: %s', $descriptor);
        $entry = $this->_entries[$descriptor];

        $path = $entry['path'];
        if (file_exists($path) && ! @unlink($path))
        {
            $e = new IMuException('MultimediaCacheRemoveFile', $path);
            $e->setSystem($php_errormsg);
            throw $e;
        }
        unset($this->_entries[$descriptor]);
    }

    /**
     * Sorts the cache entries.
     *
     * Sort entries by the date they were added or last accessed. Helper method 
     * for pruning least recently used cache entries.
     *
     * @throws IMuException
     *   If the cache entries could not be sorted.
     *
     * @see prune()
     */
    protected function
    sort()
    {
        if (! @uasort($this->_entries, array('WebMultimediaCache','compare')))
        {
            $e = new IMuException('MultimediaCacheSort');
            $e->setSystem($php_errormsg);
            throw $e;
        }
    }

    /**
     * Unlocks the #$handle resource.
     *
     * @throws IMuException
     *   If the resource could not be unlocked.
     */
    protected function
    unlock()
    {
        IMuTrace::write(2, 'unlocking cache');
        if (! @flock($this->handle, LOCK_UN))
        {
            $e = new IMuException('MultimediaCacheUnlock', $this->file);
            $e->setSystem($php_errormsg);
            throw $e;
        }
    }

    /**
     * Encodes the cache entries to json and writes them to disk.
     *
     * @throws IMuException
     *   If an error occurs encoding the cache entries to json.
     * @throws IMuException
     *   If an error occurs encoding writing to disk.
     */
    protected function
    write()
    {
        IMuTrace::write(2, 'writing cache');
        $entries = json_encode($this->_entries);
        if ($entries === false)
        {
            $e = new IMuException('MultimediaCacheWrite');
            $e->setSystem(json_last_error());
            throw $e;
        }
        if (@ftruncate($this->handle, 0) === false)
        {
            $e = new IMuException('MultimediaCacheWrite');
            $e->setSystem($php_errormsg);
            throw $e;
        }
        if (@fwrite($this->handle, $entries) === false)
        {
            $e = new IMuException('MultimediaCacheWrite');
            $e->setSystem($php_errormsg);
            throw $e;
        }
        if (@fflush($this->handle) === false)
        {
            $e = new IMuException('MultimediaCacheWrite');
            $e->setSystem($php_errormsg);
            throw $e;
        }
    }

    /**
     * Writes a file to the given path.
     *
     * A helper method to write a file to the cache directory. Writes the data
     * from the resource given by $input to the path given by $path.
     *
     * @param resource $input
     *   The resource to write.
     * @param string $path
     *   The file path to write the resource to.
     *
     * @throws IMuException
     *   If an error occurs writing to disk.
     */
    protected function
    writeFile($input, $path)
    {
        IMuTrace::write(2, 'adding cache file: %s', $path);

        $output = $this->openFile($path, 'w');
        for (;;)
        {
            $data = @fread($input, 1048576); # 1MB
            if ($data === false)
            {
                $e = new IMuException('MultimediaTempRead');
                $e->setSystem($php_errormsg);
                throw $e;
            }
            $size = strlen($data);
            if ($size == 0)
                break;
            while ($size > 0)
            {
                $wrote = @fwrite($output, $data);
                if ($wrote === false || $wrote == 0)
                {
                    $e = new IMuException('MultimediaCacheFileWrite');
                    $e->setSystem($php_errormsg);
                    throw $e;
                }
                $data = substr($data, $wrote);
                $size -= $wrote;
            }
        }
        if (@fclose($output) === false)
        {
            $e = new IMuException('MultimediaCacheFileClose');
            $e->setSystem($php_errormsg);
            throw $e;
        }
        if (@chmod($path, 0666) === false)
            IMuTrace::write(1, 'could not change permissions of %s: %s', $path,
                $php_errormsg);
    }

    /**
     * Returns an open file handle to the given file.
     *
     * @param string $file
     *   The path to the file to open.
     * @param string $mode
     *   The mode to open the file in. Default: r.
     *
     * @retval resource
     * @throws IMuException
     *   If an error occurs opening the file.
     */
    private function
    openFile($file, $mode = 'r')
    {
        $handle = @fopen($file, $mode);
        if (! $handle)
        {
            $e = new IMuException('MultimediaCacheOpenFile', $file, $mode);
            $e->setSystem($php_errormsg);
            throw $e;
        }
        return($handle);
    }
}
?>
