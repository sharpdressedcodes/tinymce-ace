!function(){"use strict";function n(n,e,i){function c(){++a<o.length?t(n+o[a],e,c):"function"==typeof i&&i()}var a=0;0===o.length?"function"==typeof i&&i():t(n+o[a],e,c)}function t(n,t,e){t=t||window;var o=t.document,i=o.createElement("script");i.async="async",i.type="text/javascript",e&&(i.onload=e),o.head.appendChild(i),i.src=n}var e="/source_editor.htm",o=["/js/ace/ace.js","/js/tinymce-hook.js"];tinymce.create("tinymce.plugins.AceCodeEditorPlugin",{init:function(t,o){this.editor=t,t.windowManager.onOpen.add(function(){var t=arguments.length>1?arguments[1]:null;t instanceof Window&&t.location.href.substr(t.location.href.length-e.length,e.length)===e&&setTimeout(function(){n(o,t)},1500)})},getInfo:function(){return{longname:"Ace Code Editor plugin",author:"Greg Kappatos",authorurl:"http://www.websiteconnect.com.au/",infourl:"http://www.websiteconnect.com.au/",version:"1.0"}}}),tinymce.PluginManager.add("ace",tinymce.plugins.AceCodeEditorPlugin)}();