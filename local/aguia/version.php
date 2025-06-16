<?php

defined('MOODLE_INTERNAL') || die();

$plugin->component = 'local_aguia'; // Nome único do componente
$plugin->version = 2025061300;     // Versão do plugin (AAAA MM DD NN - Ano Mês Dia Número de build)
$plugin->requires = 2023100900;    // Versão mínima do Moodle compatível (Moodle 4.3+, exemplo: 2023100900 para Moodle 4.3)
$plugin->maturity = MATURITY_ALPHA; // Estágio de desenvolvimento (ALPHA, BETA, RC, STABLE)
$plugin->release = '0.1 Alpha';     // Texto descritivo da versão
$plugin->dependencies = array();   // Dependências de outros plugins, se houver