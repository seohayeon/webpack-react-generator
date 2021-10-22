#!/usr/bin/env node

const fs = require('fs')
const { program } = require('commander')
const options = program.opts();
var VERSION = require('../package').version
const path = require('path')
const mkdirp = require('mkdirp')
var MODE_0666 = parseInt('0666', 8)
var MODE_0755 = parseInt('0755', 8)
var TEMPLATE_DIR = path.join(__dirname, '..', 'templates')
const minimatch = require('minimatch')

process.exit = exit


program
  .name('react')
  .version(VERSION, '    --version')
  .usage('[options] [dir]')
  .option('-t, --typescript', 'constructed with typescript')
  .option('-j, --javasrcript', 'constructed with javascript')

program.parse(process.argv)


//console.log(program.args.shift())
//const options = program.opts();
//if (options.typescript) console.log(options);

if (!exit.exited) {
  main()
}

function emptyDirectory (dir, fn) {
  fs.readdir(dir, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

function main () {
    //Path
    var destinationPath = program.args.shift() || '.'
    var appName = destinationPath
  
    
    emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      createApplication(appName, destinationPath)
    } else {
      
    }
    })
}

var pkg = {
    name: 'hello-world',
    version: '0.0.0',
    scripts: {
      start: "webpack serve --mode development",
      prebuild: "rimraf dist",
      build: "webpack --progress --mode production"
    },
    dependencies: {
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-router-dom": "^5.3.0"
  },
  devDependencies: {
        "@babel/core": "^7.15.8",
        "@babel/preset-env": "^7.15.8",
        "@babel/preset-react": "^7.14.5",
        "@babel/preset-typescript": "^7.15.0",
        "babel-loader": "^8.2.2",
        "fork-ts-checker-webpack-plugin": "^6.3.4",
        "html-webpack-plugin": "^5.4.0",
        "rimraf": "^3.0.2",
        "webpack": "^5.58.2",
        "webpack-cli": "^4.9.1",
        "webpack-dev-server": "^4.3.1"
  }
  }
var babelrc = {
  "presets": [
    [
      "@babel/preset-env",
      { "targets": { "browsers": ["last 2 versions", ">= 5% in KR"] } }
    ],
    "@babel/react"
  ]
}

var tsconfig = {
 "compilerOptions": {
   "target": "es6",
   "module": "esnext",
   "moduleResolution": "node",
   "noResolve": false,
   "noImplicitAny": false,
   "removeComments": false,
   "sourceMap": true,
   "allowJs": true,
   "jsx": "react",
   "allowSyntheticDefaultImports": true,
   "keyofStringsOnly": true
 },
 "typeRoots": ["node_modules/@types", "src/@type"],
 "exclude": [
   "node_modules",
   "build",
   "scripts",
   "acceptance-tests",
   "webpack",
   "jest",
   "src/setupTests.ts",
   "./node_modules/**/*"
 ],
 "include": ["./src/**/*", "@type"]
}

  
function createApplication(appName,dir){
    pkg.name = appName
    mkdir(dir,'src')
    mkdir(dir,'public')
    copyTemplateMulti('css', dir + '/src', '*.css')
    if(options.typescript){
       copyTemplateMulti('tsx', dir, '*.json')
       copyTemplateMulti('tsx', dir + '/src', '*.tsx') 
       pkg.dependencies["@types/node"] =  "^16.11.1"
       pkg.devDependencies["ts-loader"] = "^9.2.6",
       pkg.devDependencies["typescript"] = "^4.4.4",
       copyTemplate('tsx/webpack.config.js',dir+'/webpack.config.js')
    }else{
       copyTemplateMulti('jsx', dir + '/src', '*.js') 
       copyTemplate('webpack.config.js',dir+'/webpack.config.js')
    }
    copyTemplate('index.html',dir + '/public/index.html')
    write(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
    write(path.join(dir, '.babelrc'), JSON.stringify(babelrc, null, 2) + '\n')
    console.log('success')
}

function mkdir (base, dir) {
  var loc = path.join(base, dir)

  console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
  mkdirp.sync(loc, MODE_0755)
}


function exit (code) {
  exit.exited = true
}

function write (file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}

function copyTemplate (from, to) {
  write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'))
}
function copyTemplateMulti (fromDir, toDir, nameGlob) {
  fs.readdirSync(path.join(TEMPLATE_DIR, fromDir))
    .filter(minimatch.filter(nameGlob, { matchBase: true }))
    .forEach(function (name) {
      copyTemplate(path.join(fromDir, name), path.join(toDir, name))
    })
}