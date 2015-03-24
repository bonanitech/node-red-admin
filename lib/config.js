/**
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var path = require("path");
var fs = require("fs");

var userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var configDir = path.join(userHome, ".node-red");
var configFile = path.join(configDir, ".cli-config.json");

var config;

function load() {
    if (config === null || typeof config === "undefined") {
        try {
            config = JSON.parse(fs.readFileSync(configFile));
        } catch (err) {
            config = {};
        }
    }
}

function save() {
    try {
        fs.mkdirSync(configDir);
    } catch (err) {
        if (err.code != "EEXIST") {
            throw err;
        }
    }
    fs.writeFileSync(configFile, JSON.stringify(config, null, 4));
}
module.exports = {
    unload: function() {
        config = null;
    }
};

var properties = [
    {name:"target",default:"http://localhost:1880"},
    {name:"tokens"}
];

properties.forEach(function(prop) {
    Object.defineProperty(module.exports,prop.name,{
        get: function() {
            load();
            return config[prop.name] || prop.default
        },
        set: function(v) {
            load();
            if (v === null) {
                delete config[prop.name];
            } else {
                config[prop.name] = v;
            }
            save();
        }
    });
});
