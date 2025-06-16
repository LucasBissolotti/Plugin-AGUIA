define([
    'jquery',
    'core/localstorage', // Para persistir as preferências
    'core/str'           // Para acessar as strings de idioma
], function($, LocalStorage, Str) {

    var exports = {}; // Objeto que será exportado pelo módulo

    // Classes CSS que serão aplicadas ao <body>
    var CSS_HIGH_CONTRAST = 'aguia-high-contrast';
    var CSS_FONT_LEVEL_PREFIX = 'aguia-font-level-'; // aguia-font-level-0, aguia-font-level-1, etc.
    var CSS_LINE_SPACING = 'aguia-line-height-enhanced';

    // Chaves para armazenar no LocalStorage
    var LS_HIGH_CONTRAST_KEY = 'aguia_pref_high_contrast';
    var LS_FONT_LEVEL_KEY = 'aguia_pref_font_level';
    var LS_LINE_SPACING_KEY = 'aguia_pref_line_spacing';

    // Seletores dos botões no painel de acessibilidade
    var SELECTOR_TOGGLE_CONTRAST = '#aguia-toggle-contrast';
    var SELECTOR_INCREASE_FONT = '#aguia-increase-font';
    var SELECTOR_DECREASE_FONT = '#aguia-decrease-font';
    var SELECTOR_TOGGLE_LINE_SPACING = '#aguia-toggle-linespacing';

    // Funções de utilidade e strings
    var sendLog; // Receberá a função sendLog do aguia_main.js
    var currentFontLevel = 0; // Nível atual da fonte (0, 1, 2)
    var maxFontLevel = 2; // Máximo de níveis de aumento de fonte

    // Função para atualizar o texto "Ligado/Desligado" dos botões toggle
    function updateToggleButtonText($button, isEnabled) {
        var textSpan = $button.find('.aguia-button-text');
        var switchElement = $button.find('.aguia-toggle-switch');
        if (textSpan.length) {
            Str.get(isEnabled ? 'enabled' : 'disabled', 'local_aguia').done(function(str) {
                textSpan.text(str);
            });
        }
        $button.attr('aria-pressed', isEnabled);
        switchElement.attr('aria-checked', isEnabled);
    }

    /**
     * Aplica ou remove o modo de alto contraste.
     * @param {boolean} enable True para ativar, False para desativar.
     */
    exports.setHighContrast = function(enable) {
        if (enable) {
            $('body').addClass(CSS_HIGH_CONTRAST);
        } else {
            $('body').removeClass(CSS_HIGH_CONTRAST);
        }
        LocalStorage.setItem(LS_HIGH_CONTRAST_KEY, enable);
        updateToggleButtonText($(SELECTOR_TOGGLE_CONTRAST), enable);
        sendLog('toggle_high_contrast', enable ? 'on' : 'off');
    };

    /**
     * Alterna o modo de alto contraste.
     */
    exports.toggleHighContrast = function() {
        var isEnabled = $('body').hasClass(CSS_HIGH_CONTRAST);
        exports.setHighContrast(!isEnabled);
    };

    /**
     * Define o nível de tamanho da fonte.
     * @param {number} level O nível da fonte (0 para padrão, 1 para médio, 2 para grande).
     */
    exports.setFontLevel = function(level) {
        // Remover todas as classes de nível de fonte existentes
        for (var i = 0; i <= maxFontLevel; i++) {
            $('body').removeClass(CSS_FONT_LEVEL_PREFIX + i);
        }
        if (level > 0) {
            $('body').addClass(CSS_FONT_LEVEL_PREFIX + level);
        }
        currentFontLevel = level;
        LocalStorage.setItem(LS_FONT_LEVEL_KEY, level);
        sendLog('change_font_size', 'level_' + level);
    };

    /**
     * Aumenta o tamanho da fonte para o próximo nível.
     */
    exports.increaseFontSize = function() {
        if (currentFontLevel < maxFontLevel) {
            exports.setFontLevel(currentFontLevel + 1);
        }
    };

    /**
     * Diminui o tamanho da fonte para o nível anterior.
     */
    exports.decreaseFontSize = function() {
        if (currentFontLevel > 0) {
            exports.setFontLevel(currentFontLevel - 1);
        }
    };

    /**
     * Aplica ou remove o espaçamento de linha aprimorado.
     * @param {boolean} enable True para ativar, False para desativar.
     */
    exports.setLineSpacing = function(enable) {
        if (enable) {
            $('body').addClass(CSS_LINE_SPACING);
        } else {
            $('body').removeClass(CSS_LINE_SPACING);
        }
        LocalStorage.setItem(LS_LINE_SPACING_KEY, enable);
        updateToggleButtonText($(SELECTOR_TOGGLE_LINE_SPACING), enable);
        sendLog('toggle_line_spacing', enable ? 'on' : 'off');
    };

    /**
     * Alterna o espaçamento de linha.
     */
    exports.toggleLineSpacing = function() {
        var isEnabled = $('body').hasClass(CSS_LINE_SPACING);
        exports.setLineSpacing(!isEnabled);
    };

    /**
     * Inicializa o módulo de modos visuais, aplicando as preferências salvas
     * e configurando os listeners de eventos.
     * @param {function} logFunction A função para enviar logs.
     * @param {object} localStorageApi A API de LocalStorage do Moodle.
     * @param {object} strApi A API de strings do Moodle.
     */
    exports.init = function(logFunction, localStorageApi, strApi) {
        sendLog = logFunction; // Salva a função de log
        LocalStorage = localStorageApi; // Atualiza a referência do LocalStorage
        Str = strApi; // Atualiza a referência das strings

        // Carregar preferências do LocalStorage e aplicá-las
        var storedHighContrast = LocalStorage.getItem(LS_HIGH_CONTRAST_KEY);
        if (storedHighContrast === 'true') { // 'true' é string, não boolean
            exports.setHighContrast(true);
        } else {
            // Se não houver preferência ou for 'false', garantir que esteja desativado e atualizar UI
            exports.setHighContrast(false);
        }

        var storedFontLevel = parseInt(LocalStorage.getItem(LS_FONT_LEVEL_KEY) || '0');
        exports.setFontLevel(storedFontLevel);

        var storedLineSpacing = LocalStorage.getItem(LS_LINE_SPACING_KEY);
        if (storedLineSpacing === 'true') {
            exports.setLineSpacing(true);
        } else {
            exports.setLineSpacing(false);
        }


        // Adicionar listeners de eventos aos botões do painel
        $(SELECTOR_TOGGLE_CONTRAST).on('click', exports.toggleHighContrast);
        $(SELECTOR_INCREASE_FONT).on('click', exports.increaseFontSize);
        $(SELECTOR_DECREASE_FONT).on('click', exports.decreaseFontSize);
        $(SELECTOR_TOGGLE_LINE_SPACING).on('click', exports.toggleLineSpacing);

        // Adicionar strings de idioma para 'enabled' e 'disabled'
        // Precisamos adicionar essas strings no arquivo de idioma PHP `local_aguia.php`
        // Ex: $string['enabled'] = 'Ligado'; $string['disabled'] = 'Desligado';
        Str.get('enabled', 'local_aguia').done(function(str) {
            // Placeholder: A string 'enabled' será usada pelos botões toggle.
        });
        Str.get('disabled', 'local_aguia').done(function(str) {
            // Placeholder: A string 'disabled' será usada pelos botões toggle.
        });

        console.log('AGUIA Visual Modes Initialized.');
    };

    return exports;
});