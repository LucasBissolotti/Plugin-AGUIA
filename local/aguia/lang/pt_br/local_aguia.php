<?php

defined('MOODLE_INTERNAL') || die();

// Nome do plugin
$string['pluginname'] = 'AGUIA - Acessibilidade e Guia para Pessoas com Deficiência Visual';
$string['aguia:addinstance'] = 'Adicionar um novo bloco AGUIA';
$string['aguia:myaddinstance'] = 'Adicionar um novo bloco AGUIA à página Meu Moodle';

// Título do painel de acessibilidade
$string['accessibilitypanel'] = 'Painel de Acessibilidade AGUIA';

// Opções do painel
$string['highcontrastmode'] = 'Modo de Alto Contraste';
$string['togglehighcontrast'] = 'Ativar/Desativar Alto Contraste';
$string['fontsize'] = 'Tamanho da Fonte';
$string['increasefontsize'] = 'Aumentar Tamanho da Fonte';
$string['decreasefontsize'] = 'Diminuir Tamanho da Fonte';
$string['linespacing'] = 'Espaçamento de Linha';
$string['togglelinespacing'] = 'Ativar/Desativar Espaçamento de Linha';
$string['auditoryfeedback'] = 'Feedback Auditivo';
$string['toggleauditoryfeedback'] = 'Ativar/Desativar Feedback Auditivo';
$string['keyboardshortcuts'] = 'Atalhos de Teclado';
$string['viewshortcuts'] = 'Ver Atalhos de Teclado';
$string['panel_close'] = 'Fechar Painel';

// Mensagens de feedback auditivo (serão mais detalhadas no JS)
$string['audio_page_loaded'] = 'Página carregada';
$string['audio_action_completed'] = 'Ação concluída';
$string['audio_modal_opened'] = 'Janela pop-up aberta';

// Logs
$string['logaction:toggle_high_contrast'] = 'Alterou o modo de alto contraste do AGUIA para {$a}.';
$string['logaction:change_font_size'] = 'Alterou o tamanho da fonte do AGUIA para o nível {$a}.';
$string['logaction:toggle_line_spacing'] = 'Alterou o espaçamento de linha do AGUIA para {$a}.';
$string['logaction:toggle_auditory_feedback'] = 'Alterou o feedback auditivo do AGUIA para {$a}.';
$string['logaction:shortcut_used'] = 'Utilizou o atalho de teclado: {$a}.';
$string['logaction:panel_opened'] = 'Abriu o painel de acessibilidade AGUIA.';
$string['logaction:panel_closed'] = 'Fechou o painel de acessibilidade AGUIA.';

// Configurações administrativas (settings.php)
$string['enableplugin'] = 'Habilitar plugin AGUIA';
$string['enableplugin_desc'] = 'Marque para habilitar o plugin AGUIA em todo o site.';
$string['default_highcontrast'] = 'Modo de Alto Contraste Padrão';
$string['default_highcontrast_desc'] = 'Define se o modo de alto contraste deve ser ativado por padrão para novos usuários.';
// ... adicione mais strings conforme necessário

$string['enabled'] = 'Ligado';
$string['disabled'] = 'Desligado';