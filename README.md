# Entrega2_TallerdeTecnologia

## Decisiones de Diseño

### Gestión de Signers

En esta implementación se optó por un conjunto de signers fijo definido durante el despliegue del contrato.

El constructor recibe una lista de direcciones autorizadas (signers) y un threshold que representa la cantidad mínima de aprobaciones necesarias para ejecutar una propuesta.

No se incluyeron funciones para agregar o remover signers después del despliegue. Esta decisión se tomó para mantener la simplicidad del contrato, reducir la complejidad de la lógica y enfocarse en los requisitos principales del ejercicio:

* Creación de propuestas.
* Aprobación de propuestas.
* Ejecución de transacciones al alcanzar el threshold requerido.
* Cancelación de propuestas por parte del creador.

Este enfoque cumple con los requisitos establecidos, que permiten utilizar un conjunto de signers fijo o dinámico.
