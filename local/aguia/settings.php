<?php

defined('MOODLE_INTERNAL') || die();

// Verifica se a variável global $ADMIN está definida, o que indica um contexto administrativo.
if ($ADMIN->fulltree) {

    // Seção principal para as configurações do AGUIA.
    $settings = new admin_settingpage(
        'local_aguia_settings', // Nome interno único para a página de configurações
        get_string('pluginname', 'local_aguia') // Título da página usando a string de idioma
    );

    // Adiciona uma nova configuração à seção.
    // 1. Configuração para Habilitar/Desabilitar o Plugin
    $settings->add(new admin_setting_configcheckbox(
        'local_aguia/enableplugin', // Nome da configuração (componente/nome_da_configuracao)
        get_string('enableplugin', 'local_aguia'), // Título visível na interface
        get_string('enableplugin_desc', 'local_aguia'), // Descrição da configuração
        0, // Valor padrão (0 para desabilitado, 1 para habilitado)
        PARAM_BOOL // Tipo de dado (booleano)
    ));

    // 2. Configuração para o Modo de Alto Contraste Padrão (para novos usuários)
    $settings->add(new admin_setting_configcheckbox(
        'local_aguia/default_highcontrast',
        get_string('default_highcontrast', 'local_aguia'),
        get_string('default_highcontrast_desc', 'local_aguia'),
        0, // Valor padrão: 0 (desabilitado)
        PARAM_BOOL
    ));

    // 3. (Opcional) Limite de registros de log para evitar tabelas muito grandes
    // Esta é uma sugestão avançada para controle de dados.
    // $settings->add(new admin_setting_configtext(
    //     'local_aguia/max_log_entries',
    //     get_string('max_log_entries', 'local_aguia'), // 'Número máximo de registros de log'
    //     get_string('max_log_entries_desc', 'local_aguia'), // 'Define o limite para registros de log do AGUIA (0 para ilimitado).'
    //     100000, // Valor padrão: 100.000 registros
    //     PARAM_INT // Tipo de dado: inteiro
    // ));

    // Adiciona a seção de configurações ao grupo de plugins locais na administração.
    $ADMIN->add('localplugins', $settings);
}