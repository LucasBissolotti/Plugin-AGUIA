<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    $settings = new admin_settingpage('local_aguiaplugin_settings', get_string('settings', 'local_aguiaplugin'));

    // Configuração para escolher se o plugin será ativado ou não
    $settings->add(new admin_setting_configcheckbox(
        'local_aguiaplugin/enable',
        get_string('enableplugin', 'local_aguiaplugin'),
        get_string('enableplugin_desc', 'local_aguiaplugin'),
        1
    ));
    
    // Configuração para escolher se usará o estilo UserWay
    $settings->add(new admin_setting_configcheckbox(
        'local_aguiaplugin/use_userway_style',
        'Usar interface inspirada no UserWay',
        'Quando habilitado, o plugin usará uma interface mais moderna inspirada no design do UserWay',
        1
    ));

    // Adiciona as configurações à página de administração
    $ADMIN->add('localplugins', $settings);
}
