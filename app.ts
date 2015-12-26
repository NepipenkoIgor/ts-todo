/**
 * Created by igor on 20/11/15.
 */
/// <reference path="./types/express.d.ts"/>
/// <reference path="./types/node.d.ts"/>
import express = require('express');
import fs = require('fs');
var app = express();
app.use(express.static(__dirname + '/public', { index: 'index.html' }));
app.listen(3000, () => {
    console.log('server start on port 3000')
})