<?php
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'neon_bites_db';

$conexion = new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$resultado = $conexion->query("SELECT * FROM reservas ORDER BY creado_en DESC");
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Neon Bites - Gestión de Pedidos y Reservas</title>
    <style>
        body { background-color: #0d0d0d; color: #00ffcc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }
        h1 { text-align: center; text-shadow: 0 0 10px #ff00ff; color: #ff00ff; }
        .card { background: #1a1a1a; border: 1px solid #00ffcc; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 0 8px rgba(0,255,204,0.2); }
        .card h3 { margin-top: 0; color: #ffff00; }
        .pedido-box { background: #111; border-left: 4px solid #ff00ff; padding: 10px; margin-top: 10px; color: #fff; }
    </style>
</head>
<body>
    <h1>Panel de Pedidos y Reservas - Neon Bites</h1>
    
    <?php if ($resultado->num_rows > 0): ?>
        <?php while($row = $resultado->fetch_assoc()): ?>
            <div class="card">
                <h3><?= htmlspecialchars($row['nombre'] . ' ' . $row['apellido']) ?> (<?= htmlspecialchars($row['email']) ?>)</h3>
                <p><strong>Fecha de reserva:</strong> <?= $row['fecha'] ?> a las <?= $row['hora'] ?></p>
                <p><strong>Personas:</strong> <?= htmlspecialchars($row['personas']) ?> | <strong>Zona:</strong> <?= htmlspecialchars($row['zona']) ?></p>
                
                <div class="pedido-box">
                    <strong>Platos / Pedido seleccionado:</strong><br>
                    <?= nl2br(htmlspecialchars($row['pedido'])) ?>
                </div>
                
                <?php if(!empty($row['mensaje'])): ?>
                    <p><em>Nota adicional: <?= htmlspecialchars($row['mensaje']) ?></em></p>
                <?php endif; ?>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p style="text-align: center;">Aún no hay reservas ni pedidos registrados.</p>
    <?php endif; ?>

</body>
</html>
<?php
$conexion->close();
?>