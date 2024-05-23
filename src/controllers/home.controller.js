
async function goHome (req, res){ 
    let prestacionesMedicas = [
        {
          medico: {
            nombre: "Juan",
            apellido: "Perez"
          },
          paciente: {
            nombre: "Maria",
            apellido: "Gonzalez",
            documento: "123456789"
          },
          diagnostico: "Hipertensión arterial",
          fechaPrescripcion: "15 de mayo de 2024",
          medicamentos: ["Losartán 50mg", "Amlodipino 5mg"]
        },
        {
            medico: {
              nombre: "Juan",
              apellido: "Perez"
            },
            paciente: {
              nombre: "Maria",
              apellido: "Gonzalez",
              documento: "123456789"
            },
            diagnostico: "Hipertensión arterial",
            fechaPrescripcion: "15 de mayo de 2024",
            medicamentos: ["Losartán 50mg", "Amlodipino 5mg"]
          },
          {
            medico: {
              nombre: "Juan",
              apellido: "Perez"
            },
            paciente: {
              nombre: "Maria",
              apellido: "Gonzalez",
              documento: "123456789"
            },
            diagnostico: "Hipertensión arterial",
            fechaPrescripcion: "15 de mayo de 2024",
            medicamentos: ["Losartán 50mg", "Amlodipino 5mg"]
          },
        // Otras prestaciones médicas...
      ];
      
    res.render('presta-list', {prestacionesMedicas});    
}

module.exports= { 
    goHome
}