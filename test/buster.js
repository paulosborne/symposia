var config = module.exports;

config["symposia"] = {
    rootPath: "../",
    libs: [
        'test/lib/requirejs/require.js',
        'test/require.conf.js'
    ],
    resources: ['*.js','src/*.js','lib/**/*.js','test/lib/**/*.js'],
    tests: ['test/specs/*.js'],
    extensions: [
        require("buster-amd")
    ],
    deps: ['test/lib/sinon/sinon-1.5.2'],
    "buster-amd": {
        pathMapper: function (path) {
            // prefix any path starting with a slash with ../
            return path.replace(/\.js$/, "").replace(/^\//, "../");
        }
    }
};
