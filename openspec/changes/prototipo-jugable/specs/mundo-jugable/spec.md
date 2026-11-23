## ADDED Requirements

### Requirement: Presencia en tiempo real
The system SHALL show every player present on the same floor, with name and card tier, and SHALL update their position for the others in real time.

#### Scenario: Dos jugadores en la misma planta
- **WHEN** dos jugadores entran en el Vestíbulo
- **THEN** cada uno ve al otro y ve cómo se mueve

#### Scenario: Plantas separadas
- **WHEN** un jugador está en el Café y otro en el Gran Salón
- **THEN** no se ven entre sí

### Requirement: Movimiento y colisiones
The system SHALL move the player with keyboard or gamepad, SHALL stop the player at walls and furniture, and SHALL validate movement on the server.

#### Scenario: Pared
- **WHEN** un jugador camina contra una pared
- **THEN** se detiene sin atravesarla

#### Scenario: Mando
- **WHEN** el jugador usa el stick de un mando
- **THEN** se mueve a velocidad proporcional a la inclinación, ignorando derivas pequeñas

### Requirement: Ascensor
The system SHALL offer an elevator menu listing the floors the player knows about, showing how many players are on each and, for closed floors, the reason.

#### Scenario: Subir a una planta abierta
- **WHEN** el jugador elige una planta a la que puede entrar
- **THEN** cambia de planta con una transición

#### Scenario: Planta cerrada
- **WHEN** el jugador ve una planta cerrada
- **THEN** aparece con candado y la condición para abrirla

### Requirement: Chat de proximidad
The system SHALL deliver a chat message only to players within hearing distance on the same floor.

#### Scenario: Cerca
- **WHEN** dos jugadores están a menos de 6 baldosas y uno escribe
- **THEN** el otro recibe el mensaje

#### Scenario: Lejos
- **WHEN** dos jugadores están a más de 6 baldosas
- **THEN** el segundo no recibe el mensaje

### Requirement: Gestos
The system SHALL let a player trigger a gesture (aplauso, mano levantada) visible to nearby players on the same floor.

#### Scenario: Aplauso
- **WHEN** un jugador hace un aplauso
- **THEN** los jugadores cercanos lo ven sobre su avatar durante unos segundos
