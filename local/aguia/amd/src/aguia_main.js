define([
    'jquery',
    'core/ajax', // Módulo AJAX do Moodle para comunicação com o backend
    'core/str',  // Módulo de strings do Moodle para traduções JS
    'core/config', // Módulo de configuração do Moodle (para wwwroot, por exemplo)
    'core/localstorage', // Para persistir preferências do usuário
    'local_aguia/aguia_visual_modes', // Nosso módulo para alto contraste, fonte, etc.
    'local_aguia/aguia_keyboard_shortcuts', // Nosso módulo para atalhos de teclado
    'local_aguia/aguia_audio_feedback' // Nosso módulo para feedback auditivo
], function($, Ajax, Str, MoodleConfig, LocalStorage, AguiaVisualModes, AguiaKeyboardShortcuts, AguiaAudioFeedback) {

    // Define a classe CSS para ocultar/exibir elementos
    var CSS_CLASS_HIDDEN = 'aguia-hidden';
    var CSS_CLASS_PANEL_VISIBLE = 'aguia-panel-visible';
    var CSS_CLASS_OVERLAY_VISIBLE = 'aguia-overlay-visible';

    // Seletores dos elementos principais
    var SELECTOR_CONTAINER = '#aguia-accessibility-container';
    var SELECTOR_TOGGLE_BUTTON = '#aguia-toggle-button';
    var SELECTOR_ACCESSIBILITY_PANEL = '#aguia-accessibility-panel';
    var SELECTOR_CLOSE_BUTTON = '#aguia-close-button';
    var SELECTOR_OVERLAY = '#aguia-overlay';

    var Aguia = {}; // Objeto principal que será retornado

    /**
     * Função para enviar logs para o backend.
     * @param {string} action Ação a ser logada (ex: 'panel_opened', 'toggle_high_contrast').
     * @param {string} [value=null] Valor opcional associado à ação.
     */
    function sendLog(action, value = null) {
        var wwwroot = MoodleConfig.get('wwwroot');
        Ajax.call([
            {
                methodname: 'local_aguia_log_action', // O método Moodle Web Service, que criaremos se precisarmos de WS
                args: {
                    action: action,
                    value: value,
                    pageurl: window.location.href
                },
                // Se não usarmos Web Services, faremos um POST direto para ajax_log.php
                // O Moodle tem um jeito mais "Moodle-like" de fazer AJAX sem WS, que é o Ajax.call_external_service.
                // Mas para este caso simples, vamos simular o que o `ajax_log.php` espera,
                // ou melhor, vamos fazer um POST direto para o ajax_log.php.
                // O Moodle Ajax não é ideal para endpoints PHP arbitrários.
                // Vamos usar jQuery para a requisição POST direta ao ajax_log.php
            }
        ]);

        // Usando jQuery para a requisição POST direta, mais simples para este caso
        // Necessário que o Moodle.cfg.wwwroot esteja disponível e o jQuery carregado.
        $.ajax({
            url: wwwroot + '/local/aguia/ajax_log.php',
            type: 'POST',
            data: {
                action: action,
                value: value,
                pageurl: window.location.href
            },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    // console.log('Log registrado: ' + action);
                } else {
                    console.error('AGUIA Log Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AGUIA AJAX Log Failed:', status, error);
            }
        });
    }

    /**
     * Alterna a visibilidade do painel de acessibilidade.
     */
    function togglePanel() {
        var container = $(SELECTOR_CONTAINER);
        var panel = $(SELECTOR_ACCESSIBILITY_PANEL);
        var overlay = $(SELECTOR_OVERLAY);
        var isVisible = panel.hasClass(CSS_CLASS_PANEL_VISIBLE);

        if (isVisible) {
            panel.removeClass(CSS_CLASS_PANEL_VISIBLE);
            overlay.removeClass(CSS_CLASS_OVERLAY_VISIBLE);
            // Atrasa a remoção de display:block para permitir a transição
            setTimeout(function() {
                overlay.css('display', 'none');
                container.attr('aria-hidden', 'true');
                panel.attr('aria-hidden', 'true');
            }, 300); // Duração da transição CSS
            sendLog('panel_closed');
        } else {
            overlay.css('display', 'block'); // Garante que o overlay apareça primeiro
            setTimeout(function() { // Pequeno delay para a transição do overlay
                overlay.addClass(CSS_CLASS_OVERLAY_VISIBLE);
                panel.addClass(CSS_CLASS_PANEL_VISIBLE);
            }, 10);
            container.attr('aria-hidden', 'false');
            panel.attr('aria-hidden', 'false');
            // Focar no título do painel para usuários de leitor de tela
            panel.find('h2').focus();
            sendLog('panel_opened');
        }
    }

    /**
     * Inicializa todos os componentes do plugin AGUIA.
     */
    Aguia.init = function() {
        var container = $(SELECTOR_CONTAINER);

        // Remove a classe 'hidden' do container principal para torná-lo visível (mas o painel inicia fechado)
        container.removeClass(CSS_CLASS_HIDDEN).attr('aria-hidden', 'true');

        // Adiciona listeners de evento
        $(SELECTOR_TOGGLE_BUTTON).on('click', togglePanel);
        $(SELECTOR_CLOSE_BUTTON).on('click', togglePanel);
        $(SELECTOR_OVERLAY).on('click', togglePanel); // Fechar painel clicando no overlay

        // Inicializa os submódulos
        AguiaVisualModes.init(sendLog, LocalStorage, Str); // Passa sendLog, LocalStorage e Str
        AguiaKeyboardShortcuts.init(togglePanel, sendLog, AguiaVisualModes, AguiaAudioFeedback); // Passa o toggle, sendLog e módulos
        AguiaAudioFeedback.init(sendLog, LocalStorage, Str); // Passa sendLog, LocalStorage e Str

        // Adiciona um listener para o carregamento completo da página (se necessário)
        $(window).on('load', function() {
            AguiaAudioFeedback.playPageLoadedSound();
        });

        console.log('AGUIA Plugin Initialized!');
    };

    return Aguia;
});