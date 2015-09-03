/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {

    'use strict';

    var pageName = '/source_editor.htm';
    var scripts = [
        '/js/ace/ace.js',
        '/js/tinymce-hook.js'
    ];

    tinymce.create('tinymce.plugins.AceCodeEditorPlugin', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */
        init : function(ed, url) {

            this.editor = ed;

            ed.windowManager.onOpen.add(function(){

                var w = arguments.length > 1 ? arguments[1] : null;

                if (w instanceof Window && w.location.href.substr(w.location.href.length - pageName.length, pageName.length) === pageName){
                    loadScripts(url, w);
                }

            });

        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Ace Code Editor plugin',
                author : 'Greg Kappatos',
                authorurl : 'http://www.websiteconnect.com.au/',
                infourl : 'http://www.websiteconnect.com.au/',
                version : "1.0"
            };
        }
    });

    function loadScripts(url, win, callback){

        for (var i = 0; i < scripts.length; i++){
            loadScript(url + scripts[i], win);
        }

    }

    function loadScript(script, win, callback){

        win = win || window;

        var document = win.document;
        var el = document.createElement('script');

        el.async = 'async';
        el.type = 'text/javascript';

        if (callback){
            el.onload = callback;
        }

        document.head.appendChild(el);
        el.src = script;

    }

    // Register plugin
    tinymce.PluginManager.add('ace', tinymce.plugins.AceCodeEditorPlugin);
})();