<?php

defined('MOODLE_INTERNAL') || die();

/**
 * Funções e hooks para o plugin local_aguia.
 */

require_once(__DIR__ . '/classes/aguia_accessibility_manager.php'); // Inclui o nosso manager

/**
 * Função hook para adicionar recursos CSS e JS em todas as páginas.
 * Esta função é chamada automaticamente pelo Moodle em um evento de antes da renderização.
 *
 * @param array $settings Informações da página.
 * @return void
 */
function local_aguia_before_footer() {
    global $PAGE, $OUTPUT;

    if (!get_config('local_aguia', 'enableplugin')) {
        return;
    }

    // Injeta JS do plugin
    $PAGE->requires->js_call_amd('local_aguia/aguia_main', 'init', [], [
        'waitfor: jquery',
        'async' => true
    ]);

    // Injeta o painel AGUIA no rodapé
    $html = \local_aguia\aguia_accessibility_manager::render_aguia_panel_icon($OUTPUT);
    echo $html;
}


/**
 * Função para retornar um HTML personalizado para um ícone/botão do AGUIA,
 * que será inserido por um renderer, por exemplo, no footer.
 *
 * NOTA: Esta é uma forma simplificada. Em um cenário real de integração,
 * seria melhor estender o renderer de tema ou adicionar um bloco.
 * Por ora, vamos usá-lo como um exemplo de como renderizar o template.
 * O posicionamento exato dependerá de onde você quer que o ícone apareça
 * na interface do seu tema Moodle.
 *
 * @return string HTML do ícone/painel.
 */
function local_aguia_add_icon_to_footer(\core_output_renderer $output) {
    global $CFG;

    // Se o plugin estiver desabilitado, retorna vazio.
    if (!get_config('local_aguia', 'enableplugin')) {
        return '';
    }

    // Renderiza o painel AGUIA. O CSS posicionará ele.
    return \local_aguia\aguia_accessibility_manager::render_aguia_panel_icon($output);
}

function local_aguia_before_standard_html_head() {
    global $PAGE;

    if (!get_config('local_aguia', 'enableplugin')) {
        return;
    }

    $PAGE->requires->css('/local/aguia/scss/aguia_styles.css');
}
