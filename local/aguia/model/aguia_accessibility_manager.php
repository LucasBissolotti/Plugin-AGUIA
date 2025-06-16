<?php

namespace local_aguia;

defined('MOODLE_INTERNAL') || die();

use renderable;
use renderer_base;
use templatable;

/**
 * Classe para gerenciar a injeção de recursos (JS/CSS) e a renderização do painel de acessibilidade do AGUIA.
 */
class aguia_accessibility_manager {

    /**
     * Injeta os arquivos CSS e JavaScript do plugin AGUIA em todas as páginas do Moodle.
     * Este método será chamado por um hook do Moodle (ex: em lib.php ou via um renderer).
     */
    public static function inject_resources() {
        global $PAGE, $CFG;

        // Se o plugin estiver desabilitado via configurações, não injeta nada.
        if (!get_config('local_aguia', 'enableplugin')) {
            return;
        }

        // Adiciona o módulo JavaScript principal do AGUIA.
        // O Moodle garante que este módulo e suas dependências (AMD) sejam carregados.
        $PAGE->requires->js_call_amd('local_aguia/aguia_main', 'init', [], [
            'waitfor: jquery', // Garante que jQuery seja carregado antes do nosso script
            'async' => true // Carregamento assíncrono para não bloquear o render
        ]);

        // Adiciona o arquivo CSS principal do AGUIA.
        $PAGE->requires->css('/local/aguia/css/aguia_styles.css');

        // Adiciona o ícone do painel de acessibilidade na barra de navegação/rodapé
        // Isso pode ser feito via um renderer ou um hook específico.
        // Por enquanto, vamos adicionar um HTML simples via um evento ou render_base.
        // Uma abordagem mais robusta envolveria estender um renderer do Moodle.
        // Para simplificar a demonstração, podemos adicionar uma chamada de render para um bloco ou elemento fixo.
    }

    /**
     * Renderiza o ícone do AGUIA e o painel de acessibilidade (como um modal ou elemento fixo).
     *
     * @param renderer_base $output O renderer de saída do Moodle.
     * @return string O HTML do ícone/painel.
     */
    public static function render_aguia_panel_icon(renderer_base $output): string {
        global $CFG;

        // Se o plugin estiver desabilitado, não renderiza o ícone.
        if (!get_config('local_aguia', 'enableplugin')) {
            return '';
        }

        // Cria um contexto para o template Mustache.
        // Pode incluir URLs de ícones, strings de idioma, etc.
        $templatecontext = [
            'iconurl' => new \moodle_url('/local/aguia/pix/accessibility_icon.svg'), // URL para o ícone do AGUIA
            'paneltitle' => get_string('accessibilitypanel', 'local_aguia'),
            'togglecontrasttext' => get_string('togglehighcontrast', 'local_aguia'),
            'increasefonttext' => get_string('increasefontsize', 'local_aguia'),
            'decreasefonttext' => get_string('decreasefontsize', 'local_aguia'),
            'togglelinespacingtext' => get_string('togglelinespacing', 'local_aguia'),
            'toggleauditoryfeedbacktext' => get_string('toggleauditoryfeedback', 'local_aguia'),
            'viewshortcutstext' => get_string('viewshortcuts', 'local_aguia'),
            'panelclosetext' => get_string('panel_close', 'local_aguia'),
            // Adicione mais strings conforme o painel é construído
        ];

        // Renderiza o template Mustache.
        // O template 'local_aguia/accessibility_panel' deve existir em 'local/aguia/templates/accessibility_panel.mustache'
        return $output->render_from_template('local_aguia/accessibility_panel', $templatecontext);
    }
}