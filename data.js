export const PROFILES = {
  "79465056": {
    caso: "A",
    veredicto: "aprobado",
    nombre: "JUAN CARLOS RESTREPO TOBÓN",
    cedulaFormateada: "79.465.056",
    declarado: {
      ingresosMensuales: "$2.100.000",
      bienesInmuebles: ["1 Apartamento en Cali, identificado con FMI No. 370-102548"],
      vehiculos: ["1 Vehículo Renault Logan Modelo 2019, Placas MCU-010"],
      deudasTotales: "$32.000.000 con cuatro acreedores",
      negociosRecientes: "Ninguno",
      informacionRelevante: "Sociedad conyugal vigente"
    },
    encontrado: {
      VUR: { detalle: "1 Apartamento en Cali, identificado con FMI No. 370-102548", resultado: "coincide" },
      RNAT: { detalle: "1 Vehículo Renault Logan Modelo 2019, Placas MCU-010", resultado: "coincide" },
      DIAN: { detalle: "Información tributaria coherente con ingresos mensuales", resultado: "coincide" },
      OPEN_FINANCE: { detalle: "Obligaciones bancarias reportadas coinciden con el pasivo", resultado: "coincide" },
      RUES: { detalle: "Sin actividad comercial ni creación de empresas", resultado: "coincide" },
      ESTADO_CIVIL: { detalle: "Sociedad conyugal vigente confirmada en registros", resultado: "coincide" }
    },
    inconsistencias: [],
    mensajeFinal: "Sin inconsistencias — la declaración coincide con los registros"
  },
  "43876543": {
    caso: "B",
    veredicto: "amarilla",
    nombre: "LILIANA PATRICIA GÓMEZ BUENDÍA",
    cedulaFormateada: "43.876.543",
    declarado: {
      ingresosMensuales: "$2.900.000",
      bienesInmuebles: ["No posee bienes inmuebles"],
      vehiculos: ["No posee vehículos"],
      deudasTotales: "$86.000.000 con dos acreedores",
      negociosRecientes: "Ninguno",
      informacionRelevante: "No se registran movimientos financieros atípicos relacionados con su situación de insolvencia"
    },
    encontrado: {
      VUR: { detalle: "No hay registro de bien inmueble", resultado: "coincide" },
      RNAT: { detalle: "Motocicleta Yamaha Modelo 2021, Placas XFD-38D", resultado: "inconsistencia" },
      DIAN: { detalle: "Información tributaria coherente con ingresos mensuales", resultado: "coincide" },
      OPEN_FINANCE: { detalle: "Obligaciones bancarias reportadas coinciden con el pasivo", resultado: "coincide" },
      RUES: { detalle: "Sin actividad comercial ni creación de empresas", resultado: "coincide" },
      MOVIMIENTOS: { detalle: "Transferencia de $9.000.000 a tercero en el mes anterior a la solicitud", resultado: "inconsistencia" }
    },
    inconsistencias: [
      "Vehículo no declarado: Motocicleta Yamaha Modelo 2021, Placas XFD-38D",
      "Transferencia de $9.000.000 a tercero en el mes anterior a la solicitud"
    ],
    mensajeFinal: "2 inconsistencias menores — requiere verificación adicional"
  },
  "1024570007": {
    caso: "C",
    veredicto: "roja",
    nombre: "CARLOS ANDRÉS PÉREZ CARVAJAL",
    cedulaFormateada: "1.024.570.007",
    declarado: {
      ingresosMensuales: "$2.100.000",
      bienesInmuebles: ["1 Casa en Bogotá D.C., identificada con FMI No. 10C-114765"],
      vehiculos: ["1 Vehículo Chevrolet Camaro Modelo 2022, Placas XUS-093"],
      deudasTotales: "$143.867.000 con siete acreedores",
      negociosRecientes: "Ninguno",
      informacionRelevante: "No se registran movimientos financieros atípicos relacionados con su situación de insolvencia"
    },
    encontrado: {
      VUR: { detalle: "Bien declarado verificado: 1 Casa en Bogotá D.C. (FMI No. 10C-114765). Hallazgos adicionales: 1 Apartamento en Barranquilla (FMI No. 040-265908) NO declarado; 1 Apartamento en Barranquilla (FMI No. 040-356554) traspasado hace 2 meses", resultado: "inconsistencia_grave" },
      RNAT: { detalle: "Vehículo declarado verificado: Chevrolet Camaro 2022 (XUS-093). Hallazgo adicional: Toyota Corolla Modelo 2020 (HYB-477) transferido hace 3 meses", resultado: "inconsistencia_grave" },
      DIAN: { detalle: "Declaró renta sobre un patrimonio de $180.000.000 hace apenas 14 meses — incoherente con su estado actual", resultado: "inconsistencia_grave" },
      OPEN_FINANCE: { detalle: "Obligaciones bancarias reportadas ascienden a $79.658.000 (declaró $143.867.000)", resultado: "inconsistencia_grave" },
      RUES: { detalle: "Socio activo de la sociedad \"BLU EXPRESS S.A.S.\"", resultado: "inconsistencia_grave" },
      MOVIMIENTOS: { detalle: "Transferencias por $34.000.000 a terceros en los dos meses anteriores a la solicitud", resultado: "inconsistencia_grave" }
    },
    inconsistencias: [
      "Apartamento en Barranquilla (FMI No. 040-265908) no declarado",
      "Apartamento en Barranquilla (FMI No. 040-356554) traspasado hace 2 meses",
      "Vehículo Toyota Corolla 2020 (HYB-477) transferido hace 3 meses",
      "Patrimonio declarado en renta de $180.000.000 hace 14 meses, incoherente con estado actual",
      "Pasivo declarado ($143.867.000) no coincide con obligaciones reportadas ($79.658.000)",
      "Socio activo de la SAS \"BLU EXPRESS S.A.S.\" no declarada",
      "Transferencias por $34.000.000 a terceros en los dos meses previos a la solicitud"
    ],
    mensajeFinal: "Inconsistencias graves — indicios de ocultamiento deliberado de patrimonio"
  }
};

export const SOURCES = [
  { id: "DIAN", name: "DIAN", subtitle: "Información tributaria", logo: "./img/DIAN.png" },
  { id: "VUR", name: "Superintendencia de Notariado y Registro", subtitle: "Ventanilla Única de Registro", logo: "./img/VUR.jpg" },
  { id: "RUES", name: "RUES", subtitle: "Registro empresarial", logo: "./img/RUES.jpg" },
  { id: "RNAT", name: "Registro Nacional Automotor", subtitle: "Consulta de vehículos", logo: "./img/RUNT.png" },
  { id: "OPEN_FINANCE", name: "Sistema financiero", subtitle: "Open Finance", logo: "./img/SUPERINTENDENCIA.png" }
];
