import SibApiV3Sdk from "sib-api-v3-sdk";
import { API_KEY_BREVO } from "../config.js";

// Configura el cliente de Brevo usando tu clave API
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  API_KEY_BREVO;

// Crear una instancia del API de correos
export const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
