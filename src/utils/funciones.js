import axios from 'axios';
import Swal from 'sweetalert2';

export const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL;


// -----------------------------
// MANEJO DE ERRORES
// -----------------------------
function handleError(error) {

    let errorMessage = "Ocurrió un error";

    if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
    } else if (error.message) {
        errorMessage = error.message;
    }

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
    });

    return errorMessage;
}


// -----------------------------
// RESPUESTA EXITOSA
// -----------------------------
function handleResponse(response) {

    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    let errorMessage = "Ocurrió un error";

    if (response.data?.error) {
        errorMessage = response.data.error;
    }

    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
    });

    throw new Error(errorMessage);
}


// -----------------------------
// GET
// -----------------------------
export async function get(recurso) {
    try {

        const { url, headers } = await datosDePeticion(recurso);

        const response = await axios.get(url, { headers });

        return handleResponse(response);

    } catch (error) {

        console.error(error);

        handleError(error);
    }
}


// -----------------------------
// POST
// -----------------------------
export async function post(recurso, datos) {
    try {

        const { url, headers } = await datosDePeticion(recurso);

        const response = await axios.post(url, datos, { headers });
        console.log(response);

        return response;

    } catch (error) {

        const message = handleError(error);

        throw new Error(message);

    }
}


// -----------------------------
// PUT
// -----------------------------
export async function put(recurso, datos) {
    try {

        const { url, headers } = await datosDePeticion(recurso);

        const response = await axios.put(url, datos, { headers });

        return handleResponse(response);

    } catch (error) {

        console.error(error);

        handleError(error);
    }
}


// -----------------------------
// DELETE
// -----------------------------
export async function borrar(recurso) {
    try {

        const { url, headers } = await datosDePeticion(recurso);

        const response = await axios.delete(url, { headers });

        return handleResponse(response);

    } catch (error) {

        console.error(error);

        handleError(error);
    }
}


// -----------------------------
// CONFIGURACIÓN DE PETICIÓN
// -----------------------------
async function datosDePeticion(recurso) {

    const url = `${backendBaseUrl}${recurso}`;

    const token = localStorage.getItem('loginToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };

    return { url, headers };
}