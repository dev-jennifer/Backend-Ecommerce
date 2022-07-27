# 🏪 eCommerce 🏪
Este eCommerce fue desarrollado para el curso de CoderHouse con el nombre **Programación Backend** 


## 📁 Datos del proyecto 📁

* **Version de Node:**  v16.14.2
* **Tecnologias Utilizadas:**
Express, JavaScript, MongoDB, Compression,Passport, JsonWebToken,Handlebars,Twilio,Nodemailer,Bootstrap,SocketIO
* **Implementa chat a traves de Socket entre cliente y tienda.
* **URL de muestra:** *No Disponible*


## 🚀 Como ejecutar el proyecto 🚀

Para poder correr el proyecto debemos clonarlo

Luego debemos poder nuestras prorpias credecianles en el `.env` para eso podemos copiar el `.env.example` que nos muestra las credenciales que necesitamos.

```dotenv
## MongoDB
MONGOURL= sample
DB_NAME = sample
SECRET_MONGO=sample

## Facebook
FACEBOOK_APP_ID= sample
FACEBOOK_APP_SECRET= sample

## Google
GOOGLE_ID=sample
SECRET_ID=sample

## Emails
TEST_EMAIL =sample
PASS_EMAIL =sample
ADMIN_EMAIL=sample
CHAT_ADMIN_EMAIL=sample

## Twilo
ACCOUNT_SID=sample
AUTH_TOKEN=sample
TWILOPHONE=+sample

## WhatsApp
WHATSAPP_ADMIN=sample
WHATSAPP_FROM=sample

## Secret
PRIVATE_KEY_JWT=sample
 
```

Una vez que tengamos las dependencias instaladas podemos ejecutarlo de la siguiente manera:

```shell
npm i
npm start
```

---

## Usuario Administrador

EMAIL =  admin@test.com
PASSWORD = 123456
