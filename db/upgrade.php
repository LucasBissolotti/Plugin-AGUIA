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
 * Upgrade procedure
 *
 * @package    local_aguiaplugin
 * @copyright  2025 Prolux
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Upgrade function for plugin
 * @param int $oldversion The old version of the plugin
 * @return bool
 */
function xmldb_local_aguiaplugin_upgrade($oldversion) {
    global $DB;
    $dbman = $DB->get_manager();

    if ($oldversion < 2025070100) {
        // Define table local_aguiaplugin_prefs.
        $table = new xmldb_table('local_aguiaplugin_prefs');

        // Add fields.
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('fontsize', XMLDB_TYPE_INTEGER, '3', null, null, null, '100');
        $table->add_field('contrast', XMLDB_TYPE_CHAR, '20', null, null, null, 'normal');
        $table->add_field('readablefonts', XMLDB_TYPE_INTEGER, '1', null, null, null, '0');
        $table->add_field('linespacing', XMLDB_TYPE_INTEGER, '3', null, null, null, '100');
        $table->add_field('speech', XMLDB_TYPE_INTEGER, '1', null, null, null, '0');
        $table->add_field('texthelper', XMLDB_TYPE_INTEGER, '1', null, null, null, '0');
        $table->add_field('timemodified', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');

        // Add keys.
        $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
        $table->add_key('userid', XMLDB_KEY_UNIQUE, ['userid']);

        // Create table if it doesn't exist.
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // Aguiaplugin savepoint reached.
        upgrade_plugin_savepoint(true, 2025070100, 'local', 'aguiaplugin');
    }

    return true;
}
