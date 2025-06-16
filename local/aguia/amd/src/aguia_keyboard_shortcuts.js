define([
    'jquery',
    'core/str',
    'local_aguia/mousetrap' // A nova dependência Mousetrap
], function($, Str, Mousetrap) {

    var exports = {}; // Objeto que será exportado pelo módulo

    // Funções e referências que serão passadas de aguia_main.js
    var togglePanelFunction;
    var sendLogFunction;
    var aguiaVisualModes; // Referência ao módulo de modos visuais
    var aguiaAudioFeedback; // Referência ao módulo de feedback auditivo

    var currentFocusIndex = -1; // Índice do elemento atualmente focado na navegação sequencial
    var focusableElements = []; // Lista de elementos focáveis na página

    // Atalhos de teclado definidos
    var shortcuts = {
        'ctrl+alt+a': { action: 'toggle_panel', description: 'Abrir/Fechar Painel AGUIA' },
        'ctrl+alt+t': { action: 'toggle_high_contrast', description: 'Alternar Alto Contraste' },
        'ctrl+alt+i': { action: 'increase_font', description: 'Aumentar Fonte' },
        'ctrl+alt+d': { action: 'decrease_font', description: 'Diminuir Fonte' },
        'ctrl+alt+s': { action: 'toggle_line_spacing', description: 'Alternar Espaçamento de Linha' },
        'ctrl+alt+v': { action: 'toggle_auditory_feedback', description: 'Alternar Feedback Auditivo' },
        'ctrl+alt+n': { action: 'next_focusable_element', description: 'Próximo Item Navegável' },
        'ctrl+alt+p': { action: 'previous_focusable_element', description: 'Item Navegável Anterior' },
        // Adicione mais atalhos conforme necessário, ex:
        // 'ctrl+alt+h': { action: 'go_home', description: 'Ir para Home do Moodle' },
        // 'ctrl+alt+c': { action: 'go_to_course_content', description: 'Ir para Conteúdo do Curso' },
    };

    /**
     * Atualiza a lista de elementos focáveis na página.
     */
    function updateFocusableElements() {
        focusableElements = $('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
                            .filter(':visible'); // Apenas elementos visíveis
    }

    /**
     * Move o foco para o próximo elemento navegável.
     */
    function focusNextElement() {
        if (focusableElements.length === 0) {
            updateFocusableElements();
            if (focusableElements.length === 0) {
                console.warn('AGUIA: Nenhum elemento focável encontrado.');
                return;
            }
        }

        currentFocusIndex = (currentFocusIndex + 1) % focusableElements.length;
        $(focusableElements[currentFocusIndex]).focus();
        sendLogFunction('shortcut_used', 'next_focusable_element');
        aguiaAudioFeedback.playNavigationSound(); // Adiciona feedback auditivo
    }

    /**
     * Move o foco para o elemento navegável anterior.
     */
    function focusPreviousElement() {
        if (focusableElements.length === 0) {
            updateFocusableElements();
            if (focusableElements.length === 0) {
                console.warn('AGUIA: Nenhum elemento focável encontrado.');
                return;
            }
        }

        currentFocusIndex = (currentFocusIndex - 1 + focusableElements.length) % focusableElements.length;
        $(focusableElements[currentFocusIndex]).focus();
        sendLogFunction('shortcut_used', 'previous_focusable_element');
        aguiaAudioFeedback.playNavigationSound(); // Adiciona feedback auditivo
    }

    /**
     * Registra todos os atalhos de teclado.
     */
    function registerShortcuts() {
        Mousetrap.reset(); // Reseta atalhos existentes para evitar duplicações em SPA
        for (var key in shortcuts) {
            if (shortcuts.hasOwnProperty(key)) {
                (function(shortcutKey, shortcutDetails) { // Closure para capturar valores
                    Mousetrap.bind(shortcutKey, function(e) {
                        e.preventDefault(); // Previne o comportamento padrão do navegador
                        sendLogFunction('shortcut_used', shortcutKey);
                        aguiaAudioFeedback.playActionSound(); // Feedback geral para atalho

                        switch (shortcutDetails.action) {
                            case 'toggle_panel':
                                togglePanelFunction();
                                break;
                            case 'toggle_high_contrast':
                                aguiaVisualModes.toggleHighContrast();
                                break;
                            case 'increase_font':
                                aguiaVisualModes.increaseFontSize();
                                break;
                            case 'decrease_font':
                                aguiaVisualModes.decreaseFontSize();
                                break;
                            case 'toggle_line_spacing':
                                aguiaVisualModes.toggleLineSpacing();
                                break;
                            case 'toggle_auditory_feedback':
                                aguiaAudioFeedback.toggleAuditoryFeedback();
                                break;
                            case 'next_focusable_element':
                                focusNextElement();
                                break;
                            case 'previous_focusable_element':
                                focusPreviousElement();
                                break;
                            // Adicionar outros casos conforme os atalhos forem implementados
                            // case 'go_home':
                            //     window.location.href = M.cfg.wwwroot;
                            //     break;
                            // case 'go_to_course_content':
                            //     // Lógica para ir ao conteúdo do curso atual, mais complexo, pode precisar de ID do curso
                            //     // ou uma URL genérica. Por simplicidade, pode ser um link direto.
                            //     break;
                        }
                    });
                })(key, shortcuts[key]);
            }
        }
    }

    /**
     * Inicializa o módulo de atalhos de teclado.
     * @param {function} panelToggleFn Função para alternar o painel.
     * @param {function} logFn Função para enviar logs.
     * @param {object} visualModes Módulo aguia_visual_modes.
     * @param {object} audioFeedback Módulo aguia_audio_feedback.
     */
    exports.init = function(panelToggleFn, logFn, visualModes, audioFeedback) {
        togglePanelFunction = panelToggleFn;
        sendLogFunction = logFn;
        aguiaVisualModes = visualModes;
        aguiaAudioFeedback = audioFeedback;

        // Registra os atalhos na inicialização
        registerShortcuts();

        // Atualiza a lista de elementos focáveis quando o DOM estiver pronto
        $(document).ready(function() {
            updateFocusableElements();
        });

        // Opcional: Re-atualizar elementos focáveis em modificações do DOM (ex: ajax content loads)
        // Isso pode ser feito observando mutações DOM ou em callbacks de AJAX.
        // Por exemplo, após carregar um modal ou uma nova seção de conteúdo.
        // MutationObserver pode ser usado para isso em cenários mais complexos.
        // $(document).on('moodle-page-updated', function() { // Exemplo de evento Moodle
        //     updateFocusableElements();
        // });

        console.log('AGUIA Keyboard Shortcuts Initialized.');
    };

    /**
     * Retorna a lista de atalhos para exibir no painel.
     * @returns {object} Um objeto com os atalhos e suas descrições.
     */
    exports.getShortcuts = function() {
        return shortcuts;
    };

    return exports;
});