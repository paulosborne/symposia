var config = module.exports;

config["symposia"] = {
    rootPath: "../",
    libs: [
        'test/lib/requirejs/require.js',
        'test/require.conf.js'
    ],
    resources: ['*.js','src/*.js','lib/**/*.js'],
    tests: ['test/specs/*.js'],
    extensions: [
        require("buster-amd")
    ],
    "buster-amd": {
        pathMapper: function (path) {
            // prefix any path starting with a slash with ../
            return path.replace(/\.js$/, "").replace(/^\//, "../");
        }
    }
};
