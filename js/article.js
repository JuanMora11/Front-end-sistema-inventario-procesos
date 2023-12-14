const urlApiArticle = "http://localhost:8088/articles";//colocar la url con el puerto
const headersArticle = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listar_article() {
    validaToken();
    var settings = {
        method: 'GET',
        headers: headersArticle,
    }
    fetch(urlApiArticle, settings)
        .then(response => response.json())
        .then(function (articles) {

            var articulos = '';
            for (const articulo of articles) {
                articulos += `
                <tr>
                            <th scope="row">${articulo.id}</th>
                            <td><span style="color: black;">${articulo.name}</span></td>
                            <td><p class="card-text"> ${articulo.price}</p></td>
                            <td><p class="card-text"> ${articulo.description}</p></td>
                            <td><p class="card-text"> ${articulo.color}</p></td>
                            <td><p class="card-text"> ${articulo.material}</p></td>
                            <td><p class="card-text"> ${articulo.quantity}</p></td>
                            <td><p class="card-text"> ${articulo.category.nameCategory}</p></td>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                <td>
                                    <a href="#" onclick="verModificarArticle('${articulo.id}')" class="btn btn-outline-warning">
                                        <i class="fa-solid fa-user-pen"></i>
                                    </a>
                                    <a href="#" onclick="verArticle('${articulo.id}')" class="btn btn-outline-info">
                                        <i class="fa-solid fa-eye"></i>
                                    </a>
                                    <a href="#" onclick="eliminarArticle('${articulo.id}')" class="btn btn-outline-danger">
                                        <i class="fa-solid fa-trash"></i> 
                                    </a>
                                </td>    
                                </div>
                            </div>
                </tr>`;
            }
            document.getElementById("listar_article").innerHTML = articulos;
        })
}

function verModificarArticle(id) {
    validaToken();
    var settingsArticle = {
        method: 'GET',
        headers: headersArticle,
    };
    fetch(urlApiArticle + "/" + id, settingsArticle)
        .then(articulo => articulo.json())
        .then(function (articulo) {
            if (!articulo) {
                console.error("Artículo no encontrado");
                return;
            }
            var settingsCategory = {
                method: 'GET',
                headers: headersArticle,
            };
            fetch(urlApiCategory, settingsCategory)
                .then(categorias => categorias.json())
                .then(function (categorias) {
                    var cadena = `
                    <div class="p-3 mb-2 bg-light text-dark">
                        <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Modificar Articulo</h1>
                    </div>
                  
                    <form action="" method="post" id="modificar">
                        <input type="hidden" name="id" id="id" value="${articulo.id}">

                        <label for="name" class="form-label">Nombre articulo</label>
                        <input type="text" class="form-control" name="name" id="name" required value="${articulo.name}"> <br>
                        <label for="name" class="form-label">Precio</label>
                        <input type="text" class="form-control" name="price" id="price" required value="${articulo.price}"> <br>
                        <label for="name" class="form-label">Descripcion</label>
                        <input type="text" class="form-control" name="description" id="description" required value="${articulo.description}"> <br>
                        <label for="name" class="form-label">Color</label>
                        <input type="text" class="form-control" name="color" id="color" required value="${articulo.color}"> <br>
                        <label for="name" class="form-label">Material</label>
                        <input type="text" class="form-control" name="material" id="material" required value="${articulo.material}"> <br>
                        <label for="name" class="form-label">quantity</label>
                        <input type="text" class="form-control" name="quantity" id="quantity" required value="${articulo.quantity}"> <br>

                        <label for="idCategorySel" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategorySel" id="idCategorySel" required>
                        ${categorias.map(categoria => `<option value="${categoria.idCategory}" ${articulo.categoria.idCategory === categoria.idCategory ? 'selected' : ''}>${categoria.nameCategory}</option>`).join('')}
                        </select> <br>
                    
                        <button type="button" class="btn btn-outline-warning" 
                            onclick="modificarArticle('${articulo.id}')">Modificar
                        </button>
                    </form>`;

                    document.getElementById("contentModalArticle").innerHTML = cadena;
                    var myModal = new bootstrap.Modal(document.getElementById('modalArticulo'))
                    myModal.toggle();




                });
        })
}


async function modificarArticle(id) {
    validaToken();
    console.log("ID del artículo a modificar:", id);
    //var idCategorySel2 = document.getElementById("idCategorySel").value;
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {
        jsonData[k] = v;
    }
    console.log("Cuerpo de la solicitud PUT:", JSON.stringify(jsonData));
    const request = await fetch(urlApiArticle + "/" + id, {
        method: 'PUT',
        headers: headersArticle,
        body: JSON.stringify(jsonData)
    });
    if (request.ok) {
        alertas("¡Articulo Modificado!", 1)
        await listar_article();
    }
    else {
        const data = await request.json();
        console.log(data);
        const dataArray = Object.values(data);
        console.log(dataArray);
        var dataResponse = '';
        for (var v of dataArray) {
            dataResponse += "<li>" + v + "</li>";
        }

        alertas("Error: <br>" + dataResponse, 2)
    }
    document.getElementById("contentModalArticle").innerHTML = '';
    var myModalEl = document.getElementById('modalArticulo')
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}

function verArticle(id) {
    validaToken();
    var settings = {
        method: 'GET',
        headers: headersArticle,
    }
    fetch(urlApiArticle + "/" + id, settings)
        .then(articulo => articulo.json())
        .then(function (articulo) {
            var cadena = '';
            if (articulo) {
                console.log(articulo);
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Ver Articulo</h1>
                </div>
                <ul class="list-group">
                <li class="list-group-item">Nombre: <span style="color: green;">${articulo.name}</span></li>
                <li class="list-group-item">Nombre: <span style="color: green;">${articulo.price}</span></li>
                <li class="list-group-item">Descripcion: <span style="color: green;">${articulo.description}</span></li>
                <li class="list-group-item">Nombre: <span style="color: green;">${articulo.color}</span></li>
                <li class="list-group-item">Nombre: <span style="color: green;">${articulo.material}</span></li>
                <li class="list-group-item">Nombre: <span style="color: green;">${articulo.quantity}</span></li>
                <li class="list-group-item">Categoria: <span style="color: green;">${articulo.categoria.nameCategory}</span></li>
                </ul>`;

            }
            document.getElementById("contentModalArticle").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticulo'));
            myModal.toggle();

        })
}

async function createArticle() {

    var idCategorySel = document.getElementById("idCategorySel").value;

    var myForm = document.getElementById("articleForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for (var [k, v] of formData) {
        jsonData[k] = v;
    }

    const request = await fetch(urlApiArticle + "/" + idCategorySel, {
        method: 'POST',
        headers: headersArticle,
        body: JSON.stringify(jsonData)
    });
    if (request.ok) {
        alertas("Articulo Creado", 1);
        listar_article();
    }
    else {
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse = '';
        for (var v of dataArray) {
            dataResponse += "<li>" + v + "</li>";
        }

        alertas("Error: <br>" + dataResponse, 2)
    }
    document.getElementById("contentModalArticle").innerHTML = '';
    var myModalEl = document.getElementById('modalArticulo')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}


function createArticleForm() {
    validaToken();
    const urlApiCategory = "http://localhost:8088/categories";
    const settings = {
        method: 'GET',
        headers: headersArticle, // Asegúrate de tener esta variable definida y configurada
    };

    fetch(urlApiCategory, settings)
        .then(categoria => categoria.json())
        .then(function (categoria) {
            var cadena = '';
            if (categoria) {
                console.log(categoria);
                // Ahora que tienes la lista de categorías, puedes mostrar el formulario
                cadena = `
                    <div class="p-3 mb-2 bg-light text-dark">
                        <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Crear Articulo</h1>
                    </div>

                    <form action="" method="post" id="articleForm">
                        <input type="hidden" name="id" id="id">

                        <label for="name" class="form-label">Nombre Articulo</label>
                        <input type="text" class="form-control" name="name" id="name" required> <br>

                        <label for="price" class="form-label">Precio</label>
                        <input type="text" class="form-control" name="price" id="price" required> <br>

                        <label for="description" class="form-label">Descripcion</label>
                        <input type="text" class="form-control" name="description" id="description" required> <br>

                        <label for="color" class="form-label">Color</label>
                        <input type="text" class="form-control" name="color" id="color" required> <br>

                        <label for="material" class="form-label">Material</label>
                        <input type="text" class="form-control" name="material" id="material" required> <br>

                        <label for="quantity" class="form-label">Cantidad</label>
                        <input type="text" class="form-control" name="quantity" id="quantity" required> <br>

                        <label for="idCategorySel" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategorySel" id="idCategorySel" required>
                            <option value="" disabled selected>Seleccionar</option>
                            ${categoria.map(categoria => `<option value="${categoria.idCategory}">${categoria.nameCategory}</option>`).join('')}
                        </select>
                        <br>


                        <button type="button" class="btn btn-outline-info" onclick="createArticle()">Crear</button>
                    </form>`;
            }
            document.getElementById("contentModalArticle").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticulo'))
            myModal.toggle();
        });
}


function eliminarArticle(id) {
    validaToken();

    // Muestra el modal de confirmación
    var confirmacionModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    confirmacionModal.show();

    // Configura el evento para el botón de confirmar dentro del modal
    document.getElementById("confirmarEliminar").addEventListener("click", function () {
        var settings = {
            method: 'DELETE',
            headers: headersArticle,
        };

        fetch(urlApiArticle + "/" + id, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al intentar eliminar el articulo. Código de estado: ${response.status}`);
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(function (data) {

                alertas("Articulo eliminado!", 2);
                confirmacionModal.hide(); // Oculta el modal después de la eliminación
                listar_article();
            })
            .catch(function (error) {
                console.error('Error al intentar eliminar el articulo:', error);
                confirmacionModal.hide(); // También cerramos el modal en caso de error
            });
    });
}