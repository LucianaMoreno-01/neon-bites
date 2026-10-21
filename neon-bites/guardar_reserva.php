<?php
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'neon_bites_db';

$conexion = new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la Base de Datos.']);
    exit;
}

$nombre = $_POST['nombre'] ?? '';
$apellido = $_POST['apellido'] ?? '';
$email = $_POST['email'] ?? '';
$fecha = $_POST['fecha'] ?? '';
$hora = $_POST['hora'] ?? '';
$personas = $_POST['personas'] ?? '';
$zona = $_POST['zona'] ?? '';
$pedido = $_POST['pedido'] ?? 'Sin selección de menú';
$mensaje = $_POST['mensaje'] ?? '';

if (empty($nombre) || empty($email) || empty($fecha) || empty($hora)) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios.']);
    exit;
}

$sql = "INSERT INTO reservas (nombre, apellido, email, fecha, hora, personas, zona, pedido, mensaje) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sssssssss", $nombre, $apellido, $email, $fecha, $hora, $personas, $zona, $pedido, $mensaje);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => '¡Reserva y pedido guardados con éxito en MySQL!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar en la base de datos.']);
}

$stmt->close();
$conexion->close();
?>