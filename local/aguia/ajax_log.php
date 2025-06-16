<?php

// Garante que o Moodle está carregado e que é uma requisição interna
define('NO_MOODLE_COOKIES', true); // Não precisamos de cookies de sessão específicos aqui
require_once(__DIR__ . '/../../config.php'); // Carrega o config.php do Moodle

// Inclui a nossa classe de log
require_once(__DIR__ . '/classes/aguia_log_manager.php');
use local_aguia\aguia_log_manager;

// Configura o cabeçalho para indicar que a resposta é JSON
header('Content-Type: application/json');

// Verifica se a requisição é um POST e se veio com dados
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = required_param('action', PARAM_ALPHANUMEXT); // Ação a ser logada
    $value = optional_param('value', null, PARAM_ALPHANUMEXT); // Valor opcional associado
    $pageurl = optional_param('pageurl', null, PARAM_RAW); // URL da página (raw para aceitar caracteres especiais)

    // Opcional: Adicionar uma verificação de sessão/token para maior segurança em um ambiente de produção real
    // Mas para um plugin local e logs, é comum simplificar.

    // Chama o método de log da nossa classe
    $logid = aguia_log_manager::log_action($action, $value, $pageurl);

    if ($logid > 0) {
        // Sucesso: retorna um JSON indicando que o log foi registrado
        echo json_encode(['status' => 'success', 'logid' => $logid]);
    } else {
        // Falha: retorna um JSON indicando erro
        echo json_encode(['status' => 'error', 'message' => 'Falha ao registrar o log.']);
    }
} else {
    // Requisição inválida: não é POST ou não tem a ação necessária
    echo json_encode(['status' => 'error', 'message' => 'Requisição inválida.']);
}

// Interrompe a execução para garantir que apenas o JSON seja retornado
die();