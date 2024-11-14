(function()
{
    /*!
    **
    */
    IMu.Consumer =
    {
        /******************************
        ** Attributes
        ******************************/

        /*!
        **  Represents whether the Consumer is online or offline.
        **  By default this value is set to "online" as a connection
        **  is needed to load this script.
        */
        connectionStatus: "online",

        /*!
        ** An array of errors encountered when resubmitting queued requests.
        **
        ** errorList elements contain the queued request and the error details,
        ** including an error message, error code and the error name. 
        */
        errorList: [],

        /*!
        ** Handlers are registered request types and methods.
        ** When a request is queued, it is paired with a string representation 
        ** of the handler key it should be associated with.
        **
        ** Handlers contain a request type, method to be called on the request
        ** and an optional 'friendly name' (yet to be implemented).
        */
        handlers: {},

        /*!
        ** The time between attempting to resubmit queued requests.
        */
        interval: 10000,

        /*!
        ** An optional callback to be executed after an unsuccessful resubmit of
        ** a queued request.
        **
        ** NOTE: This might need some work, as currently there is only one 
        ** instance of Consumer, meaning if various callbacks are needed there
        ** may be clashes.
        */
        onError: undefined,

        /*!
        ** An optional callback to be executed after a successful resubmit of
        ** a queued request.
        **
        ** NOTE: This might need some work, as currently there is only one 
        ** instance of Consumer, meaning if various callbacks are needed there
        ** may be clashes.
        */
        onSuccess: undefined,

        /*!
        ** An array of queued requests in ordered from first to be submitted to 
        ** last.
        **
        ** Each item is a hash containing a handler key to use when resubmitting
        ** and an array of arguments to be submitted.
        */
        queue: [],

        /*!
        ** The timeout id of the active timeout.
        **
        ** This is not particularly needed other than to keep track of whether
        ** there is a timeout active or not.
        */
        timeout: undefined,

        /******************************
        ** Methods
        ******************************/

        /*!
        **
        */
        clearErrorList: function()
        {
            this.errorList = [];
            this.saveToLocalStorage();
        },

        /*!
        **
        */
        consume: function()
        {
            var self = this;

            // Ensure we have the latest queued requests and errors.
            //
            self.loadFromLocalStorage();

            // Return if there's nothing to do.
            //
            if (self.queue.length == 0)
                return;

            var data = self.queue[0];

            // Get the type of handler for this request.
            //
            var handlerType = data.handler;
            var handler = self.handlers[handlerType];
            if (! handler)
                return;

            // Get the arguments to be submitted.
            // Fallback on an empty array.
            //
            var args = data.args;
            if (! args)
                args = [];
            
            // Instantiate the request and method.
            //
            var Request = new handler.request()
            var Method = Request[handler.method];
            
            // Setup error event handling.
            //
            Request.onError = function()
            {
                self.doError(this.result.response);
            };

            // Setup success event handling.
            //
            Request.onSuccess = function()
            {
                self.doSuccess(this.result.response);
                if (self.onSuccess && typeof(self.onSuccess) == 'function')
                    self.onSuccess();
            };

            // Apply the method rather than call.
            // This lets us pass arguments as an array rather than
            // having to know exactly how many parameters are required.
            //
            Method.apply(Request, args);
        },

        // This function is split out to make overriding functionality 
        // easier.
        //
        /*!
        **
        */
        doError: function(response)
        {
            // If error was caused by a connectivity issue...
            if (response.id.toLowerCase() == "nowebserverconnection")
            {
                // ...set status to offline and run any onError event before 
                // beginning save deferral again,
                //
                this.connectionStatus = "offline";
                
                if (this.onError && typeof(this.onError) == 'function')
                    this.onError();

                this.startDelayedConsume();
            }
            else
            {
                // ...else set status to online and push error to list.
                //
                this.connectionStatus = "online";
                
                this.errorList.push(
                {
                    error:
                    {
                        code:   response.code,
                        id:     response.id,
                        name:   response.name,
                        message: response.toString()
                    },
                    request:    this.queue[0]
                });

                // Pop request from queue and save changes to local storage.
                //
                this.queue.shift();
                this.saveToLocalStorage();

                // Run any onError events.
                //
                if (this.onError && typeof(this.onError) == 'function')
                    this.onError();

                // Consume the next item in the queue.
                //
                this.consume();
            }
        },

        // This function is split out to make overriding functionality 
        // easier.
        //
        /*!
        **
        */
        doSuccess: function(TODO)
        {
            // Set connection to online.
            //
            this.connectionStatus = "online";

            // Pop request from queue and save changes to local storage.
            //
            this.queue.shift();
            this.saveToLocalStorage();

            // Run any onSuccess events.
            //
            if (this.onSuccess && typeof(this.onSuccess) == 'function')
                this.onSuccess();

            // Consume the next item in the queue.
            //
            this.consume();
        },

        /*!
        **
        */
        loadFromLocalStorage: function()
        {
            var deferredQueue = IMu.Storage.Local.get('deferredQueue');
            if (deferredQueue !== undefined)
                this.queue = deferredQueue;

            var deferredErrors = IMu.Storage.Local.get('deferredErrors');
            if (deferredErrors !== undefined)
                this.errorList = deferredErrors;
        },

        /*!
        **
        */
        queueRequest: function(handler, args)
        {
            if (! this.handlers[handler])
                return;

            IMu.Consumer.loadFromLocalStorage();
            IMu.Consumer.queue.push({ handler: handler, args: args });
            IMu.Consumer.saveToLocalStorage();
        },

        /*!
        **
        */
        registerHandler: function(key, request, method, friendlyName)
        {
            if (! key || ! request || ! method)
                return;

            // Exit if the handler has already been registered
            //
            if (this.handlers[key])
                return;

            if (IMu.Type.isString(request))
                request = request.split('.');
            else if (! IMu.Type.isArray(request))
                return;
           
            // Validate the request type.
            //
            var klass = IMu.Request;
            for (var i = 0; i < request.length; i++)
            {
                if (! klass[request[i]])
                    return;
                klass = klass[request[i]];
            }

            // Validate the method.
            //
            var Request = new klass();
            if (! Request[method] || typeof(Request[method]) != "function")
                return;

            // Set the user friendly name for the request being performed.
            //
            if (friendlyName === undefined)
                friendlyName = "pending-request-other";

            this.handlers[key] =
            {
                request: klass,
                method: method,
                friendlyName: friendlyName
            }
        },

        /*!
        **
        */
        saveToLocalStorage: function()
        {
            IMu.Storage.Local.set('deferredQueue', this.queue);
            IMu.Storage.Local.set('deferredErrors', this.errorList);
        },

        /*!
        **
        */
        startDelayedConsume: function()
        {
            // Return if already waiting for a timeout to finish.
            //
            if (this.timeout)
                return;

            var self = this;
            self.timeout = setTimeout(function()
            {
                // Clearing timeout here acts more as a flag to inform 
                // the Consumer that no timeout is currently running.
                // No clearTimeout call is needed here.
                //
                self.timeout = undefined;

                // Attempt to process first element in the queue.
                //
                self.consume();
            }, 
            this.interval);
        }
    };
})();
