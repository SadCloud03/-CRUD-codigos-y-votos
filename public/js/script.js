// Esperamos a que el DOM esté cargado para no tener errores de elementos null
document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Superhéroe JS listo para la acción en Ubuntu");
});

// Función para manejar el clic en el botón de votar
async function votar(id_tema) {
    try {
        // En un sistema real, el id_usuario vendría de un login
        const id_usuario = 99; 

        // 1. Llamada a tu API (la que acabamos de probar en Postman)
        const response = await fetch(`/temas/${id_tema}/votos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario })
        });

        if (response.ok) {
            // 2. Si el voto fue exitoso, recargamos la página para ver el nuevo ranking
            // (Esto hace que el tema "salte" de posición si superó a otro)
            window.location.reload();
        } else {
            const error = await response.json();
            alert("Error al votar: " + error.error);
        }
    } catch (err) {
        console.error("Error en la conexión:", err);
        alert("No se pudo conectar con el servidor.");
    }
}