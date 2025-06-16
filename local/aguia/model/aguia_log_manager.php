<?php

namespace local_aguia;

defined('MOODLE_INTERNAL') || die();

/**
 * Classe para gerenciar o registro de logs de uso do plugin AGUIA.
 */
class aguia_log_manager {

    /**
     * Registra uma ação do usuário no banco de dados do AGUIA.
     *
     * @param string $action O nome da ação a ser logada (ex: 'toggle_high_contrast').
     * @param string|null $value Um valor opcional associado à ação (ex: 'on', 'off', 'level_1').
     * @param string|null $pageurl A URL da página onde a ação ocorreu (pode ser obtida automaticamente se nulo).
     * @return int O ID do registro de log inserido, ou 0 em caso de falha.
     */
    public static function log_action(string $action, ?string $value = null, ?string $pageurl = null): int {
        global $DB, $USER;

        // Verifica se o usuário está logado
        $userid = $USER->id ?? 0; // Se não houver usuário logado (ex: convidado), usa 0

        // Obtém a URL atual se não for fornecida
        if (is_null($pageurl)) {
            $pageurl = \current_url();
            // Limita o tamanho da URL para evitar estouro do campo
            if (strlen($pageurl) > 255) {
                $pageurl = substr($pageurl, 0, 255);
            }
        }

        // Obtém o endereço IP do usuário
        $ipaddr = \getremoteaddr();

        $record = new \stdClass();
        $record->userid = $userid;
        $record->action = $action;
        $record->value = $value;
        $record->pageurl = $pageurl;
        $record->ipaddr = $ipaddr;
        $record->timecreated = time();

        try {
            // Insere o registro no banco de dados
            $id = $DB->insert_record('local_aguia_logs', $record);
            return $id;
        } catch (\moodle_exception $e) {
            \debugging('AGUIA: Erro ao registrar log: ' . $e->getMessage(), DEBUG_DEVELOPER);
            return 0;
        }
    }
}