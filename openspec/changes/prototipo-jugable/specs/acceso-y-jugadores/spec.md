## ADDED Requirements

### Requirement: Entrada de prueba
The system SHALL let a person enter with a magician name, country, specialty and school, and SHALL restore the same profile when the same person returns with the same browser.

#### Scenario: Primera entrada
- **WHEN** una persona introduce un nombre que nadie usa
- **THEN** se crea un perfil nuevo en el nivel 0 sin notas y con rol de visitante

#### Scenario: Vuelta al hotel
- **WHEN** la misma persona vuelve con el mismo navegador
- **THEN** recupera su perfil, su nivel y sus llaves

#### Scenario: Nombre ocupado
- **WHEN** alguien intenta crear un perfil con un nombre ya usado por otra persona
- **THEN** el sistema lo rechaza y pide otro nombre

### Requirement: Nivel y carta calculados
The system SHALL compute a player's level as 0.30 × Técnica + 0.30 × Presentación + 0.25 × Creatividad + 0.15 × Enseñanza, rounded, and SHALL derive the tier (Antesala, Bronce, Plata, Oro, Neón) and rank name from that level.

#### Scenario: Nivel a partir de las notas
- **WHEN** un jugador tiene notas 84, 80, 83 y 79
- **THEN** su nivel es 82 y su tramo es Oro

#### Scenario: Jugador sin examinar
- **WHEN** un jugador no tiene notas
- **THEN** su carta se muestra en blanco, sin número

### Requirement: Roles y llaves
The system SHALL assign each player one role (visitante, huésped, tribunal, anfitrión) and a set of keys, and SHALL allow only an anfitrión to change another player's role, level or keys.

#### Scenario: Cambio de rol sin permiso
- **WHEN** un visitante intenta darse el rol de tribunal
- **THEN** el sistema lo rechaza

#### Scenario: Modo prueba
- **WHEN** el servidor está en modo prueba y un jugador usa el panel de pruebas
- **THEN** puede asignarse rol, nivel y llaves para comprobar los accesos

### Requirement: Reglas de acceso a las plantas
The system SHALL decide access to each floor from the player's role, level and keys, and SHALL return the reason when access is denied.

#### Scenario: Plantas libres
- **WHEN** un visitante pide entrar al Vestíbulo, al Café o al Gran Salón
- **THEN** el sistema le deja entrar

#### Scenario: Sala de mesa
- **WHEN** un visitante pide entrar a la Sala de mesa
- **THEN** el sistema lo rechaza indicando que requiere el rol de huésped

#### Scenario: Planta 13 con llave
- **WHEN** un jugador con la llave de examen pide entrar a la Planta 13
- **THEN** el sistema le deja entrar

#### Scenario: Planta 13 sin llave
- **WHEN** un jugador sin llave, sin rol de tribunal y sin invitación pide entrar a la Planta 13
- **THEN** el sistema lo rechaza y la planta no aparece en su ascensor
