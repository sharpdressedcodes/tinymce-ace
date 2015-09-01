(function() {

    'use strict';

    var aceThemes = [
        'ambiance',
        'chaos',
        'chrome',
        'clouds',
        'clouds_midnight',
        'cobalt',
        'crimson_editor',
        'dawn',
        'dreamweaver',
        'eclipse',
        'github',
        'idle_fingers',
        'iplastic',
        'katzenmilch',
        'kr_theme',
        'kuroir',
        'merbivore',
        'merbivore_soft',
        'mono_industrial',
        'monokai',
        'pastel_on_dark',
        'solarized_dark',
        'solarized_light',
        'sqlserver',
        'terminal',
        'textmate',
        'tomorrow',
        'tomorrow_night',
        'tomorrow_night_blue',
        'tomorrow_night_bright',
        'tomorrow_night_eighties',
        'twilight',
        'vibrant_ink',
        'xcode'
    ];
    var textAreaId = 'htmlSource';
    var DEFAULT_THEME = 'ace/theme/monokai';
    var STYLE_CLASS = 'ace-code-editor';
    var prettyPrinter = null;

    var PrettyPrinter = function(options) {
        
        this.initialEl = options.initialEl;
        this.isLegacy = options.isLegacy;
        this.isHtml = options.isHtml;
        this.margintop = (this.isLegacy ? '0' : '-5') + 'px';
        this.initialEl.style.display = "none";
       
        this.buildEl();
        this.buildAce();
        this.normalScreen();
        this.initTheme();
        this.buildOpt(this.margintop);
    
        window.prettyPrinter = this;
        
    };

    PrettyPrinter.prototype = {
        
        buildEl: function(){

            this.el = document.createElement("div");
            this.el.style.position = "relative";
            this.el.style.zIndex = 999;
            this.el.id = "maxWidth";

            this.editorEl = document.createElement("div");
            this.editorEl.id = "description";
            this.editorEl.style.outline = '1px solid #EBEBEB';

            this.toggleContainer = document.createElement('span');

            var theme = localStorage.getItem('theme');

            this.cboTheme = document.createElement('select');

            for (var i = 0, i_ = aceThemes.length; i < i_; i++){
                var option = document.createElement('option');
                option.textContent = aceThemes[i];
                if (theme !== null && theme === ('ace/theme/' + aceThemes[i])){
                    option.setAttribute('selected', 'selected')
                }
                this.cboTheme.appendChild(option);
            }

            this.toggleContainer.appendChild(document.createTextNode('Theme: '));
            this.toggleContainer.appendChild(this.cboTheme);

            var label = document.querySelector('#wrapline');

            if (label !== null){
                label.insertBefore(this.toggleContainer, label.firstChild);
            }
            this.el.appendChild(this.editorEl);

            this.initialEl.parentNode.insertBefore(this.el, this.initialEl);
            
        },
        
        initTheme: function() {
            
            this.cboTheme.addEventListener('change', this.onThemeChange.bind(this), false);
            this.cboTheme.addEventListener('click', this.onThemeChange.bind(this), false);
            this.cboTheme.addEventListener('keydown', this.onThemeChange.bind(this), false);

            var theme = localStorage.getItem('theme');
            if (theme === null){
                theme = DEFAULT_THEME;
                localStorage.setItem('theme', theme);
            }

            this.aceEditor.setTheme(theme);
            
        },
        
        buildAce: function() {

            this.aceEditor = ace.edit('description');
            this.aceSession = this.aceEditor.getSession();
            this.aceEditor.$blockScrolling = Infinity;
            this.aceEditor.setShowPrintMargin(false);
            this.aceSession.setUseWorker(false);
            this.aceSession.setMode('ace/mode/' + (this.isHtml ? 'html' : 'javascript'));
            this.aceSession.setFoldStyle('markbeginend');
            this.aceSession.setValue(this.initialEl.value);
            
            this.aceSession.on('change', function(){
                this.initialEl.value = this.aceSession.getValue();
            }.bind(this));
            
        },

        onThemeChange: function() {

            setTimeout(function(){
                var theme = 'ace/theme/' + this.cboTheme.selectedOptions[0].value;
                var currentTheme = localStorage.getItem('theme');
                if (currentTheme !== theme){
                    localStorage.setItem('theme', theme);
                    this.aceEditor.setTheme(theme);
                }
            }.bind(this), 100);

        },

        normalScreen: function() {

            this.screenMode = "normal";
            this.el.style.position = "relative";
            this.el.style.zIndex = 0;
            this.editorEl.style.height = "525px";
            this.editorEl.style.width = "100%";

            this.aceEditor.resize();
            this.buildOpt(this.margintop);

        },

        buildOpt: function(margintop) {

            var zIndex = parseInt(getComputedStyle(this.el, null)['zIndex'], 10);

            this.toggleContainer.className = 'ace-toggle-container';

            switch (this.screenMode){
                case 'normal':
                    var label = document.querySelector('#wrapline');
                    if (this.toggleContainer.parentNode !== label){
                        this.toggleContainer.parentNode.removeChild(this.toggleContainer);
                        label.insertBefore(this.toggleContainer, label.firstChild);
                    }
                    this.toggleContainer.style.position = 'relative';
                    this.toggleContainer.style.zIndex = zIndex + 1;
                    this.toggleContainer.style.color = '#646464';
                    this.toggleContainer.style.top = 0;
                    this.toggleContainer.style.right = 0;
                    break;
                default:
            }

        }
    };

    function setup(){

        window.addEventListener('load', onLoad, false);
        //window.addEventListener('resize', onResize, false);

        onLoad();

    }

    function onLoad(){

        if (!isStyleLoaded()){
            loadStyle();
        }

        loadEditor();

    }

    function onUnload(){

        unloadEditor();

    }

    function isStyleLoaded(){

        var els = [].slice.call(document.getElementsByTagName('style'));

        for (var i = 0, i_ = els.length; i < i_; i++){
            if (els[i].className === STYLE_CLASS){
                return true;
            }
        }

        return false;

    }

    function loadStyle(){

        if (!document.body){
            return;
        }

        var el = document.createElement('style');
        el.textContent = [
            "#" + textAreaId + " { visibility:hidden }"
        ].join('');
        el.className = STYLE_CLASS;
        document.body.appendChild(el);

    }

    function findElement(){

        return {
            initialEl: document.getElementById(textAreaId),
            isLegacy: true,
            isHtml: true
        };

    }

    function loadEditor() {

        var data = findElement();

        if (data.initialEl &&
            data.initialEl.style.display !== 'none' &&
            document.getElementById('maxWidth') === null){

            prettyPrinter = new PrettyPrinter(data);

            // Stop TinyMCE trying to resize the controls.
            window.resizeInputs = function(){};

            window.moveTo(0, 0);
            window.resizeTo(screen.availWidth, screen.availHeight);

            addAceTitle();
            onResize();

            window.addEventListener('resize', onResize, false);

        }

    }

    function unloadEditor(){

        var data = findElement();
        var el = document.getElementById('maxWidth');

        if (data.initialEl && el !== null){
            prettyPrinter = null;
            el.parentNode.removeChild(el);
            data.initialEl.style.display = 'block';
        }

    }

    function onResize(event){

        var el = document.querySelector('#description');
        el && (el.style.height = (window.innerHeight - 60) + 'px');

    }

    function addAceTitle(){

        var ace = 'Ace ';
        var label = document.querySelector('label[for="' + textAreaId + '"]');

        label && (label.textContent = ace + label.textContent);
        document.title = ace + document.title;

    }

    setup();

})();