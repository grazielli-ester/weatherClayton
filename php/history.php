<?php
// avisa o navegador que estou enviando dados no formato JSON 
header('Content-Type: application/json');
// aceitar requisições de qualquer página 
header('Access-Control-Allow-Origin: *');

$historyFile = '../data/history.json';

// Verifica se o arquivo existe
if (!file_exists($historyFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'Nenhum histórico encontrado',
        'data' => []
    ]);
    exit;
}

// Lê o conteúdo do arquivo e converte JSON (string) em ARRAY
$content = file_get_contents($historyFile);
$history = json_decode($content, true);

// Verifica se há dados
if (empty($history)) {
    echo json_encode([
        'success' => false,
        'message' => 'Histórico vazio',
        'data' => []
    ]);
    exit;
}

// Inverte o array para mostrar os mais recentes primeiro
$history = array_reverse($history);

// Retorna os dados
echo json_encode([
    'success' => true,
    'message' => 'Histórico carregado com sucesso',
    'data' => $history
]);
?>