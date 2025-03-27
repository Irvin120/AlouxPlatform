const self = module.exports;

self.satInfo = async (req, res) => {
    try {

        let resp = []

        const fisica = [
            {
              clave: 605,
              name: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
              description: "Trabajadores en general."
            },
            {
              clave: 606,
              name: "Arrendamiento",
              description: "Dueños de inmuebles en renta."
            },
            {
              clave: 608,
              name: "Demás ingresos",
            },
            {
              clave: 611,
              name: "Ingresos por Dividendos (socios y accionistas)",
            },
            {
              clave: 612,
              name: "Personas Físicas con Actividades Empresariales y Profesionales",
            },
            {
              clave: 614,
              name: "Ingresos por intereses",
            },
            {
              clave: 615,
              name: "Régimen de los ingresos por obtención de premios",
            },
            {
              clave: 616,
              name: "Sin obligaciones fiscales",
            },
            {
              clave: 621,
              name: "Incorporación Fiscal",
            },
            {
              clave: 622,
              name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
            },
            {
              clave: 629,
              name: "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales",
            },
            {
              clave: 630,
              name: "Enajenación de acciones en bolsa de valores",
            },
        ]
        const moral = [
            {
              clave: 601,
              name: "General de Ley Personas Morales",
            },
            {
              clave: 603,
              name: "Personas Morales con Fines no Lucrativos",
            },
            {
              clave: 607,
              name: "Régimen de Enajenación o Adquisición de Bienes",
            },
            {
              clave: 609,
              name: "Consolidación",
            },
            {
              clave: 620,
              name: "Sociedades Cooperativas de Producción que optan por Diferir sus Ingresos",
            },
            {
              clave: 622,
              name: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras",
            },
            {
              clave: 623,
              name: "Opcional para Grupos de Sociedades",
            },
            {
              clave: 624,
              name: "Coordinados",
            },
            {
              clave: 628,
              name: "Hidrocarburos",
            },
        ]

        if(req.params.key === 'moral'){
            resp= moral
        }else{
            resp=fisica
        }

        res.status(200).send(resp)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

self.satInfoComplete = async (req, res) => {
  try {

    let resp = [
      {
        "id": "601",
        "description": "General de Ley Personas Morales"
      },
      {
        "id": "603",
        "description": "Personas Morales con Fines no Lucrativos"
      },
      {
        "id": "605",
        "description": "Sueldos y Salarios e Ingresos Asimilados a Salarios"
      },
      {
        "id": "606",
        "description": "Arrendamiento"
      },
      {
        "id": "608",
        "description": "Demás ingresos"
      },
      {
        "id": "609",
        "description": "Consolidación"
      },
      {
        "id": "610",
        "description": "Residentes en el Extranjero sin Establecimiento Permanente en México"
      },
      {
        "id": "611",
        "description": "Ingresos por Dividendos (socios y accionistas)"
      },
      {
        "id": "612",
        "description": "Personas Físicas con Actividades Empresariales y Profesionales"
      },
      {
        "id": "614",
        "description": "Ingresos por intereses"
      },
      {
        "id": "616",
        "description": "Sin obligaciones fiscales"
      },
      {
        "id": "620",
        "description": "Sociedades Cooperativas de Producción que optan por diferir sus ingresos"
      },
      {
        "id": "621",
        "description": "Incorporación Fiscal"
      },
      {
        "id": "622",
        "description": "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras"
      },
      {
        "id": "623",
        "description": "Opcional para Grupos de Sociedades"
      },
      {
        "id": "624",
        "description": "Coordinados"
      },
      {
        "id": "628",
        "description": "Hidrocarburos"
      },
      {
        "id": "607",
        "description": "Régimen de Enajenación o Adquisición de Bienes"
      },
      {
        "id": "629",
        "description": "De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales"
      },
      {
        "id": "630",
        "description": "Enajenación de acciones en bolsa de valores"
      },
      {
        "id": "615",
        "description": "Régimen de los ingresos por obtención de premios"
      },
      {
        "id": "625",
        "description": "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas"
      },
      {
        "id": "626",
        "description": "Régimen Simplificado de Confianza"
      }
    ]

    res.status(200).send(resp)
  } catch (error) {

    res.status(400).send({ error: error.message })

  }
}

self.cfdiInfo = async (req, res) => {
  try {

    let resp = [
      {
        "id": "G01",
        "description": "Adquisición de mercancías.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "G02",
        "description": "Devoluciones, descuentos o bonificaciones.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "G03",
        "description": "Gastos en general.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I01",
        "description": "Construcciones.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I02",
        "description": "Mobiliario y equipo de oficina por inversiones.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I03",
        "description": "Equipo de transporte.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I04",
        "description": "Equipo de computo y accesorios.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I05",
        "description": "Dados, troqueles, moldes, matrices y herramental.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I06",
        "description": "Comunicaciones telefónicas.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I07",
        "description": "Comunicaciones satelitales.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "I08",
        "description": "Otra maquinaria y equipo.",
        "rfReceptor": [
          601,
          603,
          606,
          612,
          620,
          621,
          622,
          623,
          624,
          625,
          626
        ]
      },
      {
        "id": "D01",
        "description": "Honorarios médicos, dentales y gastos hospitalarios.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D02",
        "description": "Gastos médicos por incapacidad o discapacidad.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D03",
        "description": "Gastos funerales.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D04",
        "description": "Donativos.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D05",
        "description": "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D06",
        "description": "Aportaciones voluntarias al SAR.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D07",
        "description": "Primas por seguros de gastos médicos.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D08",
        "description": "Gastos de transportación escolar obligatoria.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D09",
        "description": "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "D10",
        "description": "Pagos por servicios educativos (colegiaturas).",
        "rfReceptor": [
          605,
          606,
          608,
          611,
          612,
          614,
          607,
          615,
          625
        ]
      },
      {
        "id": "S01",
        "description": "Sin efectos fiscales.",
        "rfReceptor": [
          601,
          603,
          605,
          606,
          608,
          610,
          611,
          612,
          614,
          616,
          620,
          621,
          622,
          623,
          624,
          607,
          615,
          625,
          626
        ]
      },
      {
        "id": "CP01",
        "description": "Pagos",
        "rfReceptor": [
          601,
          603,
          605,
          606,
          608,
          610,
          611,
          612,
          614,
          616,
          620,
          621,
          622,
          623,
          624,
          607,
          615,
          625,
          626
        ]
      },
      {
        "id": "CN01",
        "description": "Nómina",
        "rfReceptor": [
          605
        ]
      }
    ]

    res.status(200).send(resp)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}