<?php
header("Content-Type: application/json; charset=UTF-8");

// Arquivo onde o histórico vai ser salvo
$historyFile = "../data/history.json";

// Recebendo dados enviados pelo JavaScript (POST)
$data = json_decode(file_get_contents("php://input"), true);

// Se os dados vieram vazios, encerra
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Nenhum dado recebido."]);
    exit;
}

// Se o arquivo history.json não existir, cria um array vazio
if (!file_exists($historyFile)) {
    file_put_contents($historyFile, "[]");
}

// Lê o histórico existente
$history = json_decode(file_get_contents($historyFile), true);

// Adiciona a nova entrada (dados) ao histórico
$history[] = $data;

// Salva novamente no arquivo
file_put_contents($historyFile, json_encode($history, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["status" => "success", "message" => "Histórico salvo com sucesso!"]);
?>