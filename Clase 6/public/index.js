//Funcion autoinvocada para proteger el codigo
(() => {
  //Formulario de datos
  let nombre = document.getElementById("inputName");
  let seleccion = document.getElementById("select");

  //Alerta
  let alerta = document.getElementById("alerta");

  //Botones de Add y Delete
  let boton = document.getElementById("botonAdd");
  let botonDel = document.getElementById("botonDel");

  //Botones de control de datos (la nomenclaruta es para representar la funcion del boton, btn = boton)
  let btnAtL = document.getElementById("btnAtL"); //AtL = 1 desde Aguilas al Licey
  let btnLtA = document.getElementById("btnLtA"); //LtA = 1 desde Licey a las Aguilas
  let btnTAtL = document.getElementById("btnTAtL"); //TAtL = Todos desde Aguilas al Licey
  let btnTLtA = document.getElementById("btnTLtA"); //TLtA = Todos desde Licey a las Aguilas

  //Tablas de los equipos.
  let tAguilas = document.getElementById("tablaAguilas");
  let tLicey = document.getElementById("tablaLicey");

  //Configuracion de firebase para la base de datos
  var firebaseConfig = {
    apiKey: "AIzaSyC9duGcMV0_GDwYNdpYG97aO9_xN0bQomo",
    authDomain: "datab-71bdd.firebaseapp.com",
    databaseURL: "https://datab-71bdd.firebaseio.com",
    projectId: "datab-71bdd",
    storageBucket: "datab-71bdd.appspot.com",
    messagingSenderId: "585258342193",
    appId: "1:585258342193:web:92b547b2a04a7ed3ff4210",
    measurementId: "G-NW3M18RZEY",
  };

  //Inicializacion de la configuracion de firebase
  firebase.initializeApp(firebaseConfig);

  //Inicializa la variable database
  let database = firebase.firestore();

  //Funcion para agregar datos a la base de datos
  let agregar = () => {
    //Obtener datos del form y plasmarlos en la tabla
    if (
      (seleccion.value == "Aguilas" && nombre.value) ||
      (seleccion.value == "Licey" && nombre.value)
    ) {
      //Agregando una coleccion a la base de datos
      database
        .collection("users")
        .add({
          name: nombre.value,
          equipo: seleccion.value,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      //Restablece los campos a false o su valor inicial
      nombre.value = "";
      seleccion.value = "Equipo..";

      //Validacion de campos
    } else if (nombre.value == false && seleccion.value == "Equipo..") {
      alertar("Inserta un nombre y selecciona un equipo", 2000);
    } else if (nombre.value == false) {
      alertar("Inserta un nombre", 2000);
    } else if (seleccion.value == "Equipo..") {
      alertar("Selecciona un equipo", 2000);
    }
  };

  //Obtener los datos desde Firebase en tiempo real
  (() => {
    database.collection("users").onSnapshot((doc) => {
      tAguilas.innerHTML = "";
      tLicey.innerHTML = "";
      for (let i of doc.docs) {
        //Plasmar los elementos en las tablas correspondientes
        if (i.data().equipo == "Aguilas") {
          tAguilas.innerHTML += `
        <tr>
          <td><input type="checkbox" class="input" id="inputAguilas"></td>
          <td> ${i.data().name}</td>
        </tr>`;
        } else if (i.data().equipo == "Licey") {
          tLicey.innerHTML += `
      <tr>
        <td><input type="checkbox" class="input2" id="inputLicey"></td>
        <td> ${i.data().name}</td>
      </tr>`;
        }
      }
    });
  })();

  //Eliminar datos de la base de datos
  let borrar = () => {
    database
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((res) => {
          database
            .collection("users")
            .doc(res.id)
            .delete()
            .then(function () {
              console.log("Document successfully deleted!");
            })
            .catch(function (error) {
              console.error("Error removing document: ", error);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Funcion para actualizar el equipo a todos los elementos
  let actualizar = (team) => {
    //Actualizar los equipos de Licey a Aguilas
    database
      .collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((res) => {
          let actualizarElem = database.collection("users").doc(res.id);
          return actualizarElem.update({
            equipo: team,
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Funcion para actualizar el equipo de los elementos seleccionados
  let actualizarUno = (clase, team1, team2) => {
    let input = document.getElementsByClassName(clase);

    let inputStates = [];
    let x = 0;

    database
      .collection("users")
      .where("equipo", "==", team1)
      .get()
      .then((querySnapshot) => {
        for (let i of input) {
          inputStates.push(i.checked);
        }
        querySnapshot.forEach((res) => {
          let object = {
            id: res.id,
            status: inputStates[x],
          };
          x++;
          if (object.status) {
            let actualizarElem = database.collection("users").doc(object.id);
            return actualizarElem.update({
              equipo: team2,
            });
          }
        });
      });
  };

  //Pasar todos del Licey a las Aguilas
  let pasarTAtL = () => {
    actualizar("Licey");
  };

  //Pasar todos de Aguilas a Licey
  let pasarTLtA = () => {
    actualizar("Aguilas");
  };

  // Pasar seleccionados de Licey a Aguilas
  let pasarAtL = () => {
    actualizarUno("input", "Aguilas", "Licey");
  };

  // Pasar seleccionados de Aguilas a Aguilas
  let pasarLtA = () => {
    actualizarUno("input2", "Licey", "Aguilas");
  };

  //Funcion de alerta
  let alertar = (mensaje) => {
    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => {
      alerta.style.display = "none";
    }, 3000);
  };

  //Eventos de los botones
  boton.addEventListener("click", agregar);
  botonDel.addEventListener("click", borrar);

  //Eventos para el control de datos
  btnTAtL.addEventListener("click", pasarTAtL);
  btnTLtA.addEventListener("click", pasarTLtA);
  btnAtL.addEventListener("click", pasarAtL);
  btnLtA.addEventListener("click", pasarLtA);
})();
