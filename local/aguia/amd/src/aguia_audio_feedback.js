define([
    'jquery',
    'core/config',         // Para obter o wwwroot
    'core/localstorage',   // Para persistir a preferência
    'core/str'             // Para strings de idioma (Ligado/Desligado)
], function($, MoodleConfig, LocalStorage, Str) {

    var exports = {}; // Objeto que será exportado pelo módulo

    // Chave para armazenar a preferência no LocalStorage
    var LS_AUDIO_FEEDBACK_KEY = 'aguia_pref_audio_feedback';

    // Seletor do botão de toggle de feedback auditivo
    var SELECTOR_TOGGLE_AUDIO_FEEDBACK = '#aguia-toggle-auditory-feedback';

    // Referências e estado
    var sendLog; // Função para enviar logs
    var isAudioFeedbackEnabled = false; // Estado atual do feedback auditivo

    // URLs dos arquivos de áudio
    var SOUND_PATHS = {
        'page_loaded': MoodleConfig.get('wwwroot') + '/local/aguia/pix/sounds/page_loaded.mp3',
        'action_completed': MoodleConfig.get('wwwroot') + '/local/aguia/pix/sounds/action_completed.mp3',
        'navigation': MoodleConfig.get('wwwroot') + '/local/aguia/pix/sounds/navigation.mp3',
        'mode_toggle_on': MoodleConfig.get('wwwroot') + '/local/aguia/pix/sounds/mode_toggle_on.mp3',
        'mode_toggle_off': MoodleConfig.get('wwwroot') + '/local/aguia/pix/sounds/mode_toggle_off.mp3'
    };

    // Objetos de áudio pré-carregados para reprodução instantânea
    var audioObjects = {};

    // Função para pré-carregar os sons
    function preloadSounds() {
        for (var key in SOUND_PATHS) {
            if (SOUND_PATHS.hasOwnProperty(key)) {
                audioObjects[key] = new Audio(SOUND_PATHS[key]);
                audioObjects[key].load(); // Carrega o áudio para reprodução rápida
            }
        }
    }

    // Função para tocar um som
    function playSound(soundName) {
        if (!isAudioFeedbackEnabled) {
            return; // Não toca se o feedback auditivo estiver desabilitado
        }
        if (audioObjects[soundName]) {
            audioObjects[soundName].currentTime = 0; // Reinicia o áudio se já estiver tocando
            audioObjects[soundName].play().catch(function(error) {
                // Captura e ignora erros de "Promise-rejection" (ex: usuário não interagiu com a página ainda)
                // console.warn("AGUIA Audio: Erro ao tentar reproduzir áudio:", error);
            });
        } else {
            console.warn('AGUIA Audio: Som não encontrado:', soundName);
        }
    }

    /**
     * Atualiza o texto "Ligado/Desligado" do botão de toggle.
     * @param {boolean} isEnabled True se o feedback auditivo estiver habilitado.
     */
    function updateToggleButtonText(isEnabled) {
        var $button = $(SELECTOR_TOGGLE_AUDIO_FEEDBACK);
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
     * Define o estado do feedback auditivo.
     * @param {boolean} enable True para ativar, False para desativar.
     */
    exports.setAuditoryFeedback = function(enable) {
        isAudioFeedbackEnabled = enable;
        LocalStorage.setItem(LS_AUDIO_FEEDBACK_KEY, enable);
        updateToggleButtonText(enable);
        sendLog('toggle_auditory_feedback', enable ? 'on' : 'off');
        // Toca um som de confirmação apropriado
        if (enable) {
            playSound('mode_toggle_on');
        } else {
            playSound('mode_toggle_off');
        }
    };

    /**
     * Alterna o estado do feedback auditivo.
     */
    exports.toggleAuditoryFeedback = function() {
        exports.setAuditoryFeedback(!isAudioFeedbackEnabled);
    };

    /**
     * Toca o som de página carregada.
     */
    exports.playPageLoadedSound = function() {
        playSound('page_loaded');
        sendLog('audio_feedback_played', 'page_loaded');
    };

    /**
     * Toca o som de ação concluída.
     */
    exports.playActionSound = function() {
        playSound('action_completed');
        sendLog('audio_feedback_played', 'action_completed');
    };

    /**
     * Toca o som de navegação (para atalhos de teclado de navegação).
     */
    exports.playNavigationSound = function() {
        playSound('navigation');
        sendLog('audio_feedback_played', 'navigation');
    };

    /**
     * Inicializa o módulo de feedback auditivo.
     * @param {function} logFunction Função para enviar logs.
     * @param {object} localStorageApi A API de LocalStorage do Moodle.
     * @param {object} strApi A API de strings do Moodle.
     */
    exports.init = function(logFunction, localStorageApi, strApi) {
        sendLog = logFunction;
        LocalStorage = localStorageApi;
        Str = strApi;

        preloadSounds(); // Pré-carrega os arquivos de áudio

        // Carregar preferência do LocalStorage
        var storedPref = LocalStorage.getItem(LS_AUDIO_FEEDBACK_KEY);
        // Garante que o estado seja booleano. Se não há preferência, desabilitado por padrão.
        exports.setAuditoryFeedback(storedPref === 'true'); // Armazenado como string 'true' ou 'false'

        // Adiciona listener de evento ao botão do painel
        $(SELECTOR_TOGGLE_AUDIO_FEEDBACK).on('click', exports.toggleAuditoryFeedback);

        console.log('AGUIA Audio Feedback Initialized.');
    };

    return exports;
});