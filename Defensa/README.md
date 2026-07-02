# Sistema basado en CAA para la complementación de la logopedia

---

<a name="top"></a>

## Índice

- [1. Contexto](#1-Contexto)
- [2. Requisitos](#2-Requisitos)
- [3. Detalle de casos de uso](#3-Detalle-de-casos-de-uso)
- [4. Solución](#4-Solución)
- [5. Conclusiones](#5-Conclusiones)
  
---

## 1. Contexto
### Marco teórico

- El **desarrollo del lenguaje y la comunicación** en la **infancia** constituye uno de los hitos más determinantes para la integración social y el aprendizaje académico. Sin embargo, existe una parte significativa de la población infantil que presenta dificultades severas en este proceso, bien por condiciones neurológicas como el TEA, bien por discapacidades intelectuales u otras alteraciones del desarrollo.
- En el contexto de la atención logopédica a niños con TEA u otras dificultades de comunicación, una de las **limitaciones** más frecuentes es la **discontinuidad** entre el trabajo realizado en terapia y el entorno familiar. Las sesiones clínicas tienen una duración y frecuencia limitadas y, aunque pueden llegar a ser de varias veces por semana, no son suficientes por sí solas para consolidar los aprendizajes si estos no se refuerzan en el día a día del niño.
- Esta discontinuidad tiene una doble vertiente:
  - Por un lado, el **logopeda** carece de herramientas digitales que le permitan diseñar actividades estructuradas, asignarlas a sus pacientes y hacer un seguimiento real de cómo se realizan fuera de consulta.
  - Por otro, las **familias** no cuentan con un canal claro a través del cual recibir las actividades prescritas, registrar la práctica diaria y compartir el progreso con el profesional.

### Modelo de dominio

#### - Entidades
![entidades](../Requisitos/Modelo%20de%20dominio/v3/DDEn.svg)

#### - Estados

| Actividad | Actividad en curso | Sesión | Registro Clínico |
|--------------|--------------|--------|------------------|
| ![actividadc](../Requisitos/Modelo%20de%20dominio/v2/DDEs%20Actividad(Contenido).svg) | ![actividadp](../Requisitos/Modelo%20de%20dominio/v3/DDEs%20AsignacionActividad.svg) | ![sesion](../Requisitos/Modelo%20de%20dominio/v3/DDEs%20Sesion.svg) | ![nota](../Requisitos/Modelo%20de%20dominio/v2/DDEs%20Registro.svg) |

<p align="right"><a href="#top">⬆ Volver arriba</a></p>

---

## 2. Requisitos

### - Actores

![actores](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v3/DDAc.svg)

### - Casos de uso

#### Logopeda

|            |           |
|------------|-----------|
| ![cuL](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v5/DDCdU%20Logopeda1.svg) | ![cuL](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v5/DDCdU%20Logopeda2.svg) |

#### Familia

|            |           |
|------------|-----------|
| ![cuF](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v4/DDCdU%20Familia1.svg) | ![cuF](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/v4/DDCdU%20Familia2.svg) |

#### Usuario no Autenticado

 ![cuUnA](../Requisitos/Disciplina%20de%20requisitos/Actores%20y%20casos%20de%20uso/DDCdU%20UsuarioNoAutenticado.svg)
 
### Diagramas de Contexto

#### Logopeda

![ctxL](../Requisitos/Disciplina%20de%20requisitos/Diagrama%20de%20contexto/v3/DDCtx%20Logopeda.svg)

#### Familia

![ctxF](../Requisitos/Disciplina%20de%20requisitos/Diagrama%20de%20contexto/v3/DDCtx%20Familia.svg)

#### Usuario no Autenticado

![ctxUnA](../Requisitos/Disciplina%20de%20requisitos/Diagrama%20de%20contexto/DDCtx%20Usuario%20no%20Autenticado.svg)

<p align="right"><a href="#top">⬆ Volver arriba</a></p>

---

## 3. Detalle de casos de uso

### Cascadas de casos de uso

#### Caso de uso 3 Realizar actividad

|       Fase del CdU       |                                                       Diagrama                                                          |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------|
|        Detallado         | ![d1.1](../Requisitos/Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v4/Realizar%20Actividad.svg) |
|        Prototipo         |              ![d1.2](../Requisitos/Disciplina%20de%20requisitos/Prototipado/CdU%20Realizar%20Actividad.png)             |
|  Análisis (Colaboración) |                 ![d1.3](../Análisis%20y%20diseño/Análisis/Diagramas%20MVC/CdU03%20RealizarActividad.svg)                |
|    Diseño (Secuencia)    |                ![1.4](../Análisis%20y%20diseño/Diseño/Diagramas%20Secuencia/CdU03-RealizarActividad.svg)                |

#### Caso de uso 5 Registrar sesión

|       Fase del CdU       |                                                       Diagrama                                                          |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------|
|        Detallado         |  ![d2.1](../Requisitos/Disciplina%20de%20requisitos/Detallado%20de%20los%20casos%20de%20uso/v4/Registrar%20Sesion.svg)  |
|        Prototipo         |                 ![d2.2](../Requisitos/Disciplina%20de%20requisitos/Prototipado/v2/Pd_Sesion_Abierta.svg)                |
|  Análisis (Colaboración) |                  ![d2.3](../Análisis%20y%20diseño/Análisis/Diagramas%20MVC/CdU05%20RegistrarSesion.svg)                 |
|    Diseño (Secuencia)    |              ![2.4](../Análisis%20y%20diseño/Diseño/Diagramas%20Secuencia/v2/CdU05%20RegistrarSesion.svg)               |

<p align="right"><a href="#top">⬆ Volver arriba</a></p>

## 4. Solución

A continuación se mostrará la solución en funcionamiento y se demostrará brevemente el flujo de ambos roles:

<p align="right"><a href="#top">⬆ Volver arriba</a></p>

## 5. Conclusiones

- Se logró crear un sistema capaz de cubrir la necesidad tanto del logopeda como de la familia del paciente de documentar y extender la logopedia a casa mediante actividades a modo de **"deberes"**.
- El sistema ofrece muchas opciones de **trazabilidad** y **documentación** del progreso del paciente para mantener informados a los interesados.
- El diseño modular del sistema permite **escalabilidad** a la hora de implementar nuevos tipos de tareas y se preveen funcionalidades nuevas a futuro.
- Ha sido **probado** junto con un **profesional** del campo de la logopedia lo que ha permitido un **feedback** indispensable y ha resultado en esta solución.
<p align="right"><a href="#top">⬆ Volver arriba</a></p>


<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
