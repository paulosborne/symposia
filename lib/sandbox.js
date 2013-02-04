define("sandbox", function () {
    return function ( core, selector ) {
        if ( typeof core !== 'object' ) {
            throw new Error("Core must be an object.");
        }
        return core;
    };
});
