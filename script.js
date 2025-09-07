let data_list = JSON.parse(localStorage.getItem("defectoData"));
if(data_list === null) data_list = [];

function hoyISO() {
      const d = new Date();
      const pad = n => String(n).padStart(2,'0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }


const defectoSelect = document.getElementById("defecto");
    const otroLabel = document.getElementById("otroLabel");
    const otroDefecto = document.getElementById("otroDefecto");
    const form = document.getElementById("defectoForm");

    // Mostrar/ocultar campo "otro"
    defectoSelect.addEventListener("change", function() {
      if (this.value === "otro") {
        otroLabel.style.display = "block";
        otroDefecto.style.display = "block";
        otroDefecto.required = true;
      } else {
        otroLabel.style.display = "none";
        otroDefecto.style.display = "none";
        otroDefecto.required = false;
        otroDefecto.value = "";
      }
    });

    // Guardar en localStorage
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const defecto = defectoSelect.value === "otro" ? otroDefecto.value : defectoSelect.options[defectoSelect.selectedIndex].text;
      const metodo = document.getElementById("metodo").value;
      const lado = document.getElementById("lado").value;
      const color = "Verde";
     // hora = hoyISO();

      const data = {
        defecto,
        metodo,
        lado,
        color,
        hora:[], 
        contador:0
      };

      let found = false;
      data_list.forEach(item => {
        if (item.defecto === data.defecto && item.metodo === data.metodo && item.lado === data.lado && item.color === data.color) {
          item.contador += 1;
          item.hora.push(hoyISO());
          found = true;
          return;
        }
      });
      if (!found){
        data.contador = 1;
        data.hora.push(hoyISO());
        data_list.push(data);
      }
      

      // Guardar como JSON en localStorage
      localStorage.setItem("defectoData", JSON.stringify(data_list));

    
      window.location.href = 'registros.html';

      form.reset();
      otroLabel.style.display = "none";
      otroDefecto.style.display = "none";
    });