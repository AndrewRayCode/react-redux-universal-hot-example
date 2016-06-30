require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', {transforms: []}];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});


var NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
var NodeTargetPlugin = require("webpack/lib/node/NodeTargetPlugin");
var LibraryTemplatePlugin = require("webpack/lib/LibraryTemplatePlugin");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

function HelloWorldPlugin(options) {}

HelloWorldPlugin.prototype.apply = function(compiler) {
    //compiler.plugin('done', function() {
        //console.log('Hello World!');
    //});
    compiler.plugin( 'emit', function( compilation, callback ) {

        console.log(path.join( __dirname, '..', 'node_modules/thingy-loader/client.js' ));
        compilation.fileDependencies.push(
            path.join( __dirname, '..', 'node_modules/thingy-loader/client.js' )
        );
        callback();

    });


        //console.log(params);
        //var entry = compilation.compiler.options.entry;
        //var middlewareEntry;

        ////console.log('entry',entry);

        //Object.keys( entry ).some( key => {
            //return [].concat( entry[ key ] ).some( moduleString => {
                //if( ( /webpack-hot-middleware\/client/ ).test( moduleString ) ) {
                    //middlewareEntry = moduleString;
                    //return true;
                //}
            //})
        //});

        //if( !middlewareEntry ) {
            //console.warn(
                //'Warning: webpack-hot-2048 could not find webpack-hot-middlware/client anywhere in your entry config. This module will be disabled.'
            //);
            //return;
        //}

        //const matchResult = middlewareEntry.match( /\?.+$/ ) || '';
        //const queryString = matchResult && matchResult.length ?
            //matchResult[ 0 ] : '';

        //compiler.addEntry( {}, 'fuck', 'you', callback );
        ////callback();
    //});
        
        //const sourcePath = path.join( process.cwd(), 'node_modules/thingy/client.js' );
        //require('fs').readFile( sourcePath, 'utf8', function( err, data ) {
            //if( err ) {
                //throw err;
            //}
            //compilation.assets[ 'thingy/client' + queryString ] = {
                //source: function () { return data; },
                //size:   function () { return data.length; }
            //};
            //console.log(
                //'queryString:', queryString,'and',compilation.fileDependencies
            //);
            //callback();
        //});
    //});
};

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'thingy?website=http://andrewray.me!webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      'bootstrap-sass!./src/theme/bootstrap.config.js',
      'font-awesome-webpack!./src/theme/font-awesome.config.js',
      './src/client.js'
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel?' + JSON.stringify(babelLoaderQuery), 'eslint-loader']},
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap' },
      { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240' }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    new HelloWorldPlugin(),
    webpackIsomorphicToolsPlugin.development()
  ]
};
