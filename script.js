// Inicialización de variables de tiempo
var time = new Date(); // Tiempo actual
var deltaTime = 0;    // Diferencia de tiempo entre fotogramas

// Verificar si el documento está completamente cargado o interactivo
if(document.readyState === "complete" || document.readyState === "interactive"){
    // Si el documento está listo, inicia el juego con un pequeño retraso
    setTimeout(Init, 1);
}else{
    // Si el documento no está listo, espera al evento DOMContentLoaded para iniciar el juego
    document.addEventListener("DOMContentLoaded", Init); 
}

// Función de inicialización del juego
function Init() {
    // Establecer el tiempo actual
    time = new Date();
     // Iniciar componentes esenciales del juego
    Start();
    // Iniciar el bucle del juego
    Loop();
}

// Bucle principal del juego
function Loop() {
     // Calcular el tiempo transcurrido entre fotogramas (deltaTime)
    deltaTime = (new Date() - time) / 1000;
    // Actualizar el tiempo actual
    time = new Date();
    // Actualizar el estado del juego
    Update();
    // Solicitar la siguiente animación de fotograma
    requestAnimationFrame(Loop);
}

// Variables de juego y personaje
var sueloY = 22;                // Posición vertical del suelo
var velY = 0;                   // Velocidad vertical del personaje
var impulso = 900;              // Fuerza de impulso al saltar
var gravedad = 2500;            // Aceleración debida a la grave

// Posición horizontal y vertical inicial del personaje
var dinoPosX = 42;              // Posición horizontal del personaje en la pantalla
var dinoPosY = sueloY;          // Posición vertical del personaje en relación al suelo 

// Posición horizontal del suelo y velocidad de desplazamiento del escenario
var sueloX = 0;                 // Posición horizontal actual del suelo
var velEscenario = 1280 / 3;    // Velocidad de desplazamiento horizontal del escenario
var gameVel = 1;                // Velocidad general del juego (afecta obstáculos y nubes)
var score = 0;                  // Puntuación actual del jugador

// Variables de estado del juego y personaje
var parado = false;             // Indica si el juego está en pausa (true) o en ejecución (false)
var saltando = false;           // Indica si el personaje está en el aire saltando (true) o en el suelo (false)

// Temporizadores para obstáculos y nubes
var tiempoHastaObstaculo = 2;   // Tiempo restante para crear el próximo obstáculo
var tiempoObstaculoMin = 0.7;   // Tiempo mínimo para crear obstáculos
var tiempoObstaculoMax = 1.8;   // Tiempo máximo para crear obstáculos
var obstaculoPosY = 16;         // Posición vertical de los obstáculos en relación al suelo
var obstaculos = [];            // Arreglo que almacenará los elementos de obstáculos generados

var tiempoHastaNube = 0.5;      // Tiempo restante para crear la próxima nube
var tiempoNubeMin = 0.7;        // Tiempo mínimo  para crear la próxima nube
var tiempoNubeMax = 2.7;        // Tiempo máximo para crear nubes

// Rangos verticales para la generación de nubes
var maxNubeY = 270;        // Altura máxima para generar nubes
var minNubeY = 100;        // Altura mínima para generar nubes
var nubes = [];            // Arreglo que almacenará los elementos de nubes generados
var velNube = 0.5;         // Velocidad de desplazamiento lateral de las nubes

// Elementos del DOM
var contenedor;            // Contenedor principal del juego
var dino;                  // Elemento que representa al personaje
var textoScore;            // Elemento que muestra la puntuación en pantalla
var suelo;                 // Elemento que representa el suelo del juego
var gameOver;              // Elemento que muestra la pantalla de fin de juego

// Función de inicio del juego
function Start() {
    // Asignar elementos del DOM a las variables correspondientes
    gameOver = document.querySelector(".game-over");        // Asignar elemento de fin de juego
    suelo = document.querySelector(".suelo");               // Asignar elemento de suelo
    contenedor = document.querySelector(".contenedor");     // Asignar elemento de contenedor principal
    textoScore = document.querySelector(".score");          // Asignar elemento de puntuación en pantalla
    dino = document.querySelector(".dino");                 // Asignar elemento del personaje
    document.addEventListener("keydown", HandleKeyDown);    // Agregar evento de tecla presionada
}

// Función para actualizar el estado del juego en cada ciclo
function Update() {
    if(parado) return;               // Si el juego está detenido, no realizar ninguna acción

    MoverDinosaurio();               // Mover al personaje principal
    MoverSuelo();                    // Mover el suelo para crear la ilusión de movimiento
    DecidirCrearObstaculos();        // Decidir si se debe crear un nuevo obstáculo
    DecidirCrearNubes();             // Decidir si se debe crear una nueva nube
    MoverObstaculos();               // Mover los obstáculos en pantalla
    MoverNubes();                    // Mover las nubes en pantalla
    DetectarColision();              // Detectar colisiones entre el personaje y los obstáculos
    
    velY -= gravedad * deltaTime;    // Aplicar la gravedad al personaje
}

// Función para manejar el evento de tecla presionada
function HandleKeyDown(ev){
    if(ev.keyCode == 32){             // Si la tecla presionada es la barra espaciadora
        Saltar();                     // Realizar un salto del personaje
    }
}

// Función para hacer que el personaje realice un salto
function Saltar(){
    if(dinoPosY === sueloY){     // Verificar si el personaje está en el suelo
        saltando = true;         // Indicar que el personaje está en proceso de salto
        velY = impulso;          // Asignar la velocidad vertical para el salto
        dino.classList.remove("dino-corriendo");   // Remover la clase de correr para la animación
    }
}

// Función para mover al personaje verticalmente y gestionar la detección de tocar el suelo
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;     // Actualizar la posición vertical del personaje según la velocidad
    if(dinoPosY < sueloY){            // Verificar si el personaje está en el aire
        TocarSuelo();                 // Llamar a la función para manejar el aterrizaje en el suelo
    }
    dino.style.bottom = dinoPosY + "px";   // Actualizar la posición en el estilo CSS
}

// Función para gestionar el aterrizaje del personaje en el suelo
function TocarSuelo() {
    dinoPosY = sueloY;     // Establecer la posición vertical del suelo
    velY = 0;              // Detener la velocidad vertical (ya que está en el suelo)
    if(saltando){          // Verificar si el personaje estaba saltando
        dino.classList.add("dino-corriendo");   // Agregar la clase de correr para animación
    }
    saltando = false;  // Restablecer la variable de salto
}

// Función para mover el suelo (escenario) horizontalmente
function MoverSuelo() {
    sueloX += CalcularDesplazamiento(); // Actualizar la posición horizontal del suelo
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px"; // Actualizar la posición en el estilo CSS
}

// Función para calcular el desplazamiento horizontal del suelo (escenario)
function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel; // Calcular el desplazamiento basado en la velocidad y el tiempo
}

// Función para realizar la animación de choque del personaje
function Estrellarse() {
    dino.classList.remove("dino-corriendo");   // Eliminar la clase de correr
    dino.classList.add("dino-estrellado");     // Agregar la clase de choque para animación
    parado = true;                             // Establecer la variable de estado en "parado"
}
// Función para decidir si se debe crear un nuevo obstáculo en el juego
function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime; // Reducir el tiempo restante para crear obstáculos
    if(tiempoHastaObstaculo <= 0) {    // Verificar si es momento de crear un obstáculo
        CrearObstaculo();              // Llamar a la función para crear un obstáculo
    }
}

// Función para decidir si se debe crear una nueva nube en el juego
function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;   // Reducir el tiempo restante para crear nubes
    if(tiempoHastaNube <= 0) {      // Verificar si es momento de crear una nube
        CrearNube();                // Llamar a la función para crear una nube
    }
}

// Función para crear un nuevo obstáculo en el juego
function CrearObstaculo() {
    var obstaculo = document.createElement("div");                // Crear un nuevo elemento div para el obstáculo
    contenedor.appendChild(obstaculo);                            // Agregar el obstáculo al contenedor principal
    obstaculo.classList.add("cactus");                            // Agregar la clase "cactus" para el estilo del obstáculo
    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");   // Agregar la clase "cactus2" con una probabilidad del 50%
    obstaculo.posX = contenedor.clientWidth;                      // Establecer la posición inicial del obstáculo en el borde derecho del contenedor
    obstaculo.style.left = contenedor.clientWidth+"px";           // Establecer la posición horizontal del obstáculo en el borde derecho del contenedor

    obstaculos.push(obstaculo);   // Agregar el obstáculo a la lista de obstáculos
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel; // Establecer el tiempo restante para crear el próximo obstáculo
}

// Función para crear una nueva nube en el juego
function CrearNube() {
    var nube = document.createElement("div");                // Crear un nuevo elemento div para la nube
    contenedor.appendChild(nube);                            // Agregar la nube al contenedor principal
    nube.classList.add("nube");                              // Agregar la clase "nube" para el estilo de la nube
    nube.posX = contenedor.clientWidth;                      // Establecer la posición inicial de la nube en el borde derecho del contenedor
    nube.style.left = contenedor.clientWidth+"px";           // Establecer la posición horizontal de la nube en el borde derecho del contenedor
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px"; // Establecer la posición vertical de la nube aleatoriamente dentro de un rango

    nubes.push(nube);   // Agregar la nube a la lista de nubes
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel; // Establecer el tiempo restante para crear la próxima nube
}
// Función para mover los obstáculos en el juego
function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            // Si el obstáculo ha salido completamente de la pantalla:
            obstaculos[i].parentNode.removeChild(obstaculos[i]);   // Eliminar el obstáculo del DOM
            obstaculos.splice(i, 1);                               // Eliminar el obstáculo de la lista de obstáculos
            GanarPuntos();                                         // Incrementar la puntuación del jugador
        } else {
            // Si el obstáculo aún está en pantalla:
            obstaculos[i].posX -= CalcularDesplazamiento();        // Actualizar la posición del obstáculo moviéndolo hacia la izquierda
            obstaculos[i].style.left = obstaculos[i].posX+"px";    // Actualizar la posición visual del obstáculo
        }
    }
}

// Función para mover las nubes en el juego
function MoverNubes() {
    // Recorre la lista de nubes en sentido inverso (de atrás hacia adelante)
    for (var i = nubes.length - 1; i >= 0; i--) {
        // Comprueba si la posición horizontal de la nube es menor que el ancho negativo de la nube
        if(nubes[i].posX < -nubes[i].clientWidth) {
            // Si la nube ha salido completamente de la pantalla, elimínala del DOM y de la lista de nubes
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            // Si la nube todavía está en pantalla, actualiza su posición
            // Resta el desplazamiento horizontal calculado por la velocidad de la nube
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            // Actualiza la posición visual de la nube en el DOM usando el estilo "left"
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

// Función para aumentar la puntuación y ajustar la velocidad del juego
function GanarPuntos() {
    // Incrementa la puntuación en 1
    score++;
    // Actualiza el contenido visual del marcador de puntuación en el DOM
    textoScore.innerText = score;  
    // Comprueba si la puntuación alcanza ciertos valores para ajustar la velocidad del juego y la apariencia
    if(score == 5){
        // Aumenta la velocidad del juego y agrega una clase para cambiar el fondo del contenedor a "mediodía"
        gameVel = 1.3;
        contenedor.classList.add("mediodia");
    } else if(score == 10) {
        // Aumenta aún más la velocidad del juego y cambia la clase del contenedor a "tarde"
        gameVel = 1.5;
        contenedor.classList.add("tarde");
    } else if(score == 20) {
        // Aumenta la velocidad nuevamente y cambia la clase del contenedor a "noche"
        gameVel = 2;
        contenedor.classList.add("noche");
    }  
    // Ajusta la duración de la animación del suelo en función de la velocidad del juego
    suelo.style.animationDuration = (3/gameVel) + "s";
}

// Función que indica el final del juego y muestra la pantalla de Game Over
function GameOver() {
    // Llama a la función "Estrellarse()" para detener la animación del personaje
    Estrellarse();   
    // Muestra la pantalla de Game Over estableciendo el estilo de visualización como "block"
    gameOver.style.display = "block";
}

// Función para detectar colisiones entre el personaje y los obstáculos
function DetectarColision() {
    // Itera a través de los obstáculos en el juego
    for (var i = 0; i < obstaculos.length; i++) {
        // Verifica si el obstáculo está lo suficientemente adelante como para que el personaje lo evite
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            // Si el obstáculo está lo suficientemente adelante, se detiene la iteración ya que no habrá más colisiones
            break;
        } else {
            // Si el obstáculo no está adelante del personaje, verifica si hay una colisión utilizando la función "IsCollision()"
            if(IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                // Si hay una colisión, llama a la función "GameOver()" para finalizar el juego
                GameOver();
            }
        }
    }
}

// Función para verificar si hay colisión entre dos elementos a y b con márgenes específicos
function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    // Obtiene el rectángulo delimitador del elemento a
    var aRect = a.getBoundingClientRect();
    // Obtiene el rectángulo delimitador del elemento b
    var bRect = b.getBoundingClientRect();
    // Retorna verdadero si no se cumple ninguna de las condiciones para la no colisión
    return !(
        // Verifica si la parte inferior de a está por encima de la parte superior de b, considerando el margen inferior
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        // Verifica si la parte superior de a está por debajo de la parte inferior de b, considerando el margen superior
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        // Verifica si la parte derecha de a está a la izquierda de la parte izquierda de b, considerando el margen derecho
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        // Verifica si la parte izquierda de a está a la derecha de la parte derecha de b, considerando el margen izquierdo
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}