<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Definição de serviços externos
 *
 * @package    local_aguiaplugin
 * @copyright  2025 Prolux
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$services = [
    'Serviço de Acessibilidade AGUIA' => [
        'functions' => [
            'local_aguiaplugin_get_preferences',
            'local_aguiaplugin_save_preferences'
        ],
        'restrictedusers' => 0, // Disponível para todos
        'enabled' => 1,
        'shortname' => 'local_aguiaplugin_service'
    ]
];

$functions = [
    'local_aguiaplugin_get_preferences' => [
        'classname' => 'local_aguiaplugin\external\get_preferences',
        'methodname' => 'execute',
        'classpath' => 'local/aguiaplugin/classes/external/get_preferences.php',
        'description' => 'Retorna as preferências de acessibilidade do usuário',
        'type' => 'read',
        'ajax' => true
    ],
    'local_aguiaplugin_save_preferences' => [
        'classname' => 'local_aguiaplugin\external\save_preferences',
        'methodname' => 'execute',
        'classpath' => 'local/aguiaplugin/classes/external/save_preferences.php',
        'description' => 'Salva as preferências de acessibilidade do usuário',
        'type' => 'write',
        'ajax' => true
    ]
];
