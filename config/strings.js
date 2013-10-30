define({
    /** modules */
    "MODULE_STARTED"        : "module : <%= m %> started at <%= t %> with <%= s %>",
    "MODULE_STOPPED"        : "module : <%= m %> stopped at <%= t %>",
    /** events */
    "SUBSCRIBE_INVALID_ID"          : "Invalid subscriber ID",
    "SUBSCRIBE_INVALID_DEF"         : "Subscription definition must contain a topic and callback",
    "UNSUBSCRIBE_ERROR"             : "Unsubscribe requires a topic and channel",
    /** modules */
    "ERR_MODULE_NOT_FUNC"           : "Module <%= m %> must return a function",
    "ERR_MODULE_NO_API"             : "Module <%= m %> should return a public interface",
    "ERR_MODULE_MISSING_METHOD"     : "Module <%= m %> is missing a required method",
    "ERR_MODULE_NO_NAME"            : "No module name supplied",
    "ERR_MODULE_NAME_NOT_STR"       : "Module name must be a string",
    "ERR_MODULE_NOT_FOUND"          : "Unable to find module <%= m %>",
    "ERR_MODULE_DEF_NOT_OBJECT"     : "Module definition not object",
    "ERR_CALLBACK_NOT_FUNC"         : "Callback must be a function"
});
