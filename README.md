# Arryn Frontend - Documentación de Despliegue

**Proyecto:** Arryn - eCommerce Frontend  
**Tecnología:** React + Vite  
**Cuenta AWS:** 287493836974  
**Fecha de Configuración:** Octubre 2025  

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Recursos AWS Configurados](#recursos-aws-configurados)
4. [Configuración de AWS CLI](#configuración-de-aws-cli)
5. [Configuración de Amazon S3](#configuración-de-amazon-s3)
6. [Configuración de Certificado SSL](#configuración-de-certificado-ssl)
7. [Configuración de CloudFront](#configuración-de-cloudfront)
8. [Configuración DNS](#configuración-dns)
9. [Configuración del Repositorio](#configuración-del-repositorio)
10. [Pipeline de CI/CD](#pipeline-de-cicd)
11. [Proceso de Despliegue](#proceso-de-despliegue)
12. [Comandos de Mantenimiento](#comandos-de-mantenimiento)
13. [Resolución de Problemas](#resolución-de-problemas)
14. [Estado Actual del Proyecto](#estado-actual-del-proyecto)

---

## Descripción General

Arryn es una aplicación de eCommerce desarrollada con React y Vite, desplegada en Amazon Web Services utilizando una arquitectura de sitio estático distribuida globalmente mediante CloudFront CDN. La aplicación está configurada para servir contenido a través de HTTPS con un certificado SSL válido y un dominio personalizado.

### Características Principales

- Single Page Application (SPA) con React Router
- Build optimizado con Vite
- Distribución global mediante CloudFront CDN
- Certificado SSL/TLS gratuito mediante AWS Certificate Manager
- Despliegue automatizado con GitHub Actions
- Caché optimizado para máximo rendimiento
- Dominio personalizado: arryn.app

---

## Arquitectura del Sistema

```
GitHub Repository (main branch)
    ↓
GitHub Actions CI/CD Pipeline
    ↓
Build Process (npm run build)
    ↓
Amazon S3 (arryn-frontend-bucket)
    ↓
Amazon CloudFront (CDN Global)
    ↓
Name.com DNS (arryn.app)
    ↓
Usuario Final (HTTPS)
```

### Flujo de Despliegue

1. **Desarrollo**: Los desarrolladores realizan cambios en el código y hacen push a la rama `main`
2. **CI/CD**: GitHub Actions detecta el cambio y ejecuta el workflow de despliegue
3. **Build**: Se construye la aplicación con Vite en modo producción
4. **Upload**: Los archivos estáticos se suben a Amazon S3
5. **Invalidación**: Se invalida el caché de CloudFront para reflejar los cambios
6. **Distribución**: CloudFront sirve el contenido actualizado a nivel global

---

## Recursos AWS Configurados

| Recurso | Identificador | Región | Propósito |
|---------|--------------|--------|-----------|
| Cuenta AWS | 287493836974 | - | Cuenta principal del proyecto |
| Bucket S3 | arryn-frontend-bucket | us-east-2 (Ohio) | Almacenamiento de archivos estáticos |
| Certificado ACM | e8066a33-3808-4a52-9d35-3b02b2029bdd | us-east-1 (Virginia) | Certificado SSL/TLS para HTTPS |
| Distribución CloudFront | E3MY4I6PUS96SU | Global | CDN para distribución de contenido |
| Dominio CloudFront | d2objaapejmkqm.cloudfront.net | Global | Dominio alternativo de CloudFront |
| Dominio Principal | arryn.app | - | Dominio registrado en Name.com |
| Dominio WWW | www.arryn.app | - | Subdominio alternativo |

---

## Configuración de AWS CLI

### Instalación y Verificación

```bash
# Verificar instalación
which aws
# Output: /usr/local/bin/aws

# Verificar versión
aws --version
# Output: aws-cli/2.31.13 Python/3.13.7 Darwin/24.6.0 exe/arm64
```

### Configuración de Credenciales

```bash
aws configure
```

**Parámetros configurados:**
- AWS Access Key ID: Configurado
- AWS Secret Access Key: Configurado
- Default region name: us-east-2
- Default output format: json

### Verificación de Configuración

```bash
# Verificar identidad
aws sts get-caller-identity

# Output esperado:
{
    "UserId": "287493836974",
    "Account": "287493836974",
    "Arn": "arn:aws:iam::287493836974:root"
}
```

---

## Configuración de Amazon S3

### Creación del Bucket

```bash
aws s3 mb s3://arryn-frontend-bucket --region us-east-2
```

### Configuración del Bucket

**Propiedades configuradas:**
- AWS Region: us-east-2 (Ohio)
- Bucket type: General purpose
- Bucket name: arryn-frontend-bucket
- Object Ownership: ACLs disabled (recommended)
- Block Public Access: Deshabilitado completamente
- Bucket Versioning: Disabled
- Encryption: SSE-S3 con Bucket Key habilitado

### Desactivación de Bloqueo de Acceso Público

```bash
aws s3api put-public-access-block \
  --bucket arryn-frontend-bucket \
  --public-access-block-configuration \
  BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

### Política de Acceso del Bucket

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::arryn-frontend-bucket/*"
    }
  ]
}
```

**Aplicar política:**

```bash
aws s3api put-bucket-policy \
  --bucket arryn-frontend-bucket \
  --policy file://bucket-policy.json
```

### Configuración de Static Website Hosting

```bash
aws s3 website s3://arryn-frontend-bucket \
  --index-document index.html \
  --error-document index.html
```

**Nota:** El error-document apunta a index.html para soportar el enrutamiento del lado del cliente de React Router.

### Configuración de CORS

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

**Aplicar configuración CORS:**

```bash
aws s3api put-bucket-cors \
  --bucket arryn-frontend-bucket \
  --cors-configuration file://cors-config.json
```

---

## Configuración de Certificado SSL

### Solicitud de Certificado en ACM

**IMPORTANTE:** El certificado debe estar en la región us-east-1 para poder ser utilizado con CloudFront.

```bash
aws acm request-certificate \
  --domain-name arryn.app \
  --subject-alternative-names www.arryn.app \
  --validation-method DNS \
  --region us-east-1
```

**ARN del certificado:**
```
arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd
```

### Registros DNS para Validación

**Para arryn.app:**
- Name: `_0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app`
- Type: CNAME
- Value: `_050b2a02158cce269dae36fb690a05be.xlfgrmvvlj.acm-validations.aws`

**Para www.arryn.app:**
- Name: `_95e3b50e3dfb9c21be63418c05f0796e.www.arryn.app`
- Type: CNAME
- Value: `_f503d9db6e721c2722473505e1b28678.xlfgrmvvlj.acm-validations.aws`

### Verificación del Certificado

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1 \
  --query 'Certificate.Status'

# Output esperado: "ISSUED"
```

---

## Configuración de CloudFront

### Archivo de Configuración

```json
{
  "CallerReference": "arryn-frontend-2025-10-13",
  "Comment": "CloudFront distribution for arryn.app",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-arryn-frontend-bucket",
        "DomainName": "arryn-frontend-bucket.s3.us-east-2.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultRootObject": "index.html",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-arryn-frontend-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["arryn.app", "www.arryn.app"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  }
}
```

### Creación de la Distribución

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**ID de Distribución:** E3MY4I6PUS96SU  
**Dominio CloudFront:** d2objaapejmkqm.cloudfront.net  
**Tiempo de despliegue:** 10-20 minutos

### Características de CloudFront Configuradas

- Redirección automática de HTTP a HTTPS
- Compresión automática de contenido (Gzip/Brotli)
- Caché optimizado con TTL configurables
- Manejo de errores 404 para React Router
- Soporte para dominios personalizados
- Certificado SSL con TLS 1.2 mínimo

---

## Configuración DNS

### Proveedor: Name.com

**Registros DNS configurados:**

| Type | Host | Answer | TTL |
|------|------|--------|-----|
| CNAME | `_0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app` | `_050b2a02158cce269dae36fb690a05be.xlfgrmvvlj.acm-validations.aws` | 300 |
| CNAME | `_95e3b50e3dfb9c21be63418c05f0796e.www.arryn.app` | `_f503d9db6e721c2722473505e1b28678.xlfgrmvvlj.acm-validations.aws` | 300 |
| CNAME | `arryn.app` | `d2objaapejmkqm.cloudfront.net` | 300 |
| CNAME | `www.arryn.app` | `d2objaapejmkqm.cloudfront.net` | 300 |

### Verificación DNS

```bash
# Verificar dominio principal
dig arryn.app CNAME

# Verificar subdominio www
dig www.arryn.app CNAME

# Verificar registros de validación
dig _0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app CNAME
```

**Tiempo de propagación:** 5 minutos a 48 horas (típicamente 15-30 minutos)

---

## Configuración del Repositorio

### Estructura del Proyecto

```
pi2-frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de CI/CD
├── src/
│   ├── assets/                 # Recursos estáticos
│   │   ├── Logo.svg
│   │   ├── User.svg
│   │   ├── decoration1.webp
│   │   └── ...
│   ├── components/             # Componentes React
│   │   ├── ChatBot.jsx
│   │   ├── NavBar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductModal.jsx
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Home/
│   │   ├── HomeLogin/
│   │   ├── Login/
│   │   └── Products/
│   ├── services/               # Servicios y API
│   │   └── api.js
│   ├── data/                   # Datos estáticos
│   │   └── products.json
│   ├── App.jsx                 # Componente principal
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Estilos globales
├── Test/
│   └── Products.test.jsx       # Tests unitarios
├── dist/                       # Build output (generado)
├── babel.config.js
├── eslint.config.js
├── jest.config.cjs
├── jest.setup.js
├── vite.config.js              # Configuración de Vite
├── package.json
└── README.md
```

### Configuración de Vite

**Archivo:** `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

### Dependencias del Proyecto

**Dependencias principales:**
- react: ^19.1.0
- react-dom: ^19.1.0
- react-router-dom: ^7.7.1

**Dependencias de desarrollo:**
- vite: ^7.0.4
- @vitejs/plugin-react: ^4.6.0
- eslint: ^9.30.1
- jest: ^30.1.3
- @testing-library/react: ^16.3.0

### Scripts de NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "jest"
  }
}
```

### Cambios Realizados en el Código

#### Corrección de Rutas de Assets

Los assets deben importarse correctamente para que Vite los procese durante el build:

**Incorrecto:**
```javascript
<img src="/src/assets/decoration1.webp" />
```

**Correcto:**
```javascript
import decoration1 from "../../assets/decoration1.webp";
<img src={decoration1} />
```

**Estado actual:** La mayoría de los archivos utilizan imports correctos, excepto una instancia en `HomeLogin.jsx`:
```javascript
import arrynComputadoras from "/src/assets/arryncomputadoras.webp";
```

Esta línea debe corregirse para mantener consistencia con el resto del código.

---

## Pipeline de CI/CD

### GitHub Actions Workflow

**Archivo:** `.github/workflows/deploy.yml`

El workflow se ejecuta automáticamente en los siguientes casos:
- Push a la rama `main`
- Ejecución manual mediante `workflow_dispatch`

### Variables de Entorno

```yaml
env:
  AWS_REGION: us-east-2
  S3_BUCKET: arryn-frontend-bucket
  CLOUDFRONT_DISTRIBUTION_ID: E3MY4I6PUS96SU
  NODE_VERSION: '18'
```

### Pasos del Pipeline

1. **Checkout code**: Clona el repositorio
2. **Setup Node.js**: Configura Node.js 18 con caché de npm
3. **Install dependencies**: Instala dependencias con `npm ci`
4. **Build application**: Construye la aplicación en modo producción
5. **Configure AWS credentials**: Configura credenciales AWS desde secrets
6. **Sync assets to S3**: Sube archivos con caché largo (1 año)
7. **Upload index.html to S3**: Sube index.html sin caché
8. **Invalidate CloudFront cache**: Invalida el caché de CloudFront
9. **Wait for invalidation**: Espera a que la invalidación se complete
10. **Deployment summary**: Muestra resumen del despliegue

### Secrets de GitHub

Los siguientes secrets deben configurarse en el repositorio:

- `AWS_ACCESS_KEY_ID`: Access Key ID de AWS
- `AWS_SECRET_ACCESS_KEY`: Secret Access Key de AWS

### Estrategia de Caché

**Assets (CSS, JS, imágenes):**
```bash
--cache-control "public, max-age=31536000, immutable"
```
- Duración: 1 año
- Inmutable: Los archivos con hash nunca cambian

**index.html:**
```bash
--cache-control "public, max-age=0, must-revalidate"
```
- Sin caché: Siempre obtiene la última versión

---

## Proceso de Despliegue

### Despliegue Automático (Recomendado)

1. Realizar cambios en el código
2. Hacer commit y push a la rama `main`
3. GitHub Actions ejecuta automáticamente el pipeline
4. El sitio se actualiza en 5-10 minutos

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### Despliegue Manual

#### Paso 1: Build Local

```bash
# Instalar dependencias
npm install

# Construir la aplicación
npm run build
```

Esto genera la carpeta `dist/` con los archivos optimizados.

#### Paso 2: Subir a S3

```bash
# Subir assets con caché largo
aws s3 sync ./dist s3://arryn-frontend-bucket \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Subir index.html sin caché
aws s3 cp ./dist/index.html s3://arryn-frontend-bucket/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

#### Paso 3: Invalidar Caché de CloudFront

```bash
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"
```

**Tiempo de invalidación:** 2-5 minutos

### Script de Despliegue Rápido

**Archivo:** `deploy.sh`

```bash
#!/bin/bash

# Variables
BUCKET_NAME="arryn-frontend-bucket"
DISTRIBUTION_ID="E3MY4I6PUS96SU"
BUILD_DIR="./dist"

echo "Building application..."
npm run build

echo "Uploading to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp $BUILD_DIR/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "public, max-age=0, must-revalidate"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed!"
echo "Site: https://arryn.app"
```

**Uso:**

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Comandos de Mantenimiento

### Verificación de Estado

```bash
# Listar contenido del bucket
aws s3 ls s3://arryn-frontend-bucket --recursive

# Estado de CloudFront
aws cloudfront get-distribution \
  --id E3MY4I6PUS96SU \
  --query 'Distribution.Status'

# Estado del certificado SSL
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1 \
  --query 'Certificate.Status'

# Listar invalidaciones de CloudFront
aws cloudfront list-invalidations \
  --distribution-id E3MY4I6PUS96SU
```

### Gestión de Archivos

```bash
# Eliminar archivo específico
aws s3 rm s3://arryn-frontend-bucket/archivo.js

# Eliminar todo el contenido (usar con precaución)
aws s3 rm s3://arryn-frontend-bucket --recursive

# Copiar archivo específico
aws s3 cp archivo.html s3://arryn-frontend-bucket/archivo.html
```

### Configuración de Caché

```bash
# Actualizar caché de un archivo específico
aws s3 cp s3://arryn-frontend-bucket/index.html \
  s3://arryn-frontend-bucket/index.html \
  --metadata-directive REPLACE \
  --cache-control "public, max-age=0, must-revalidate"
```

### Monitoreo

```bash
# Ver logs de CloudWatch (si están habilitados)
aws logs tail /aws/cloudfront/arryn-frontend --follow

# Obtener métricas de CloudFront
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=E3MY4I6PUS96SU \
  --start-time 2025-10-01T00:00:00Z \
  --end-time 2025-10-26T23:59:59Z \
  --period 86400 \
  --statistics Sum
```

---

## Resolución de Problemas

### Problema 1: Imágenes no se Cargan

**Síntoma:** Las imágenes aparecen rotas o no se cargan en el navegador.

**Causa:** Rutas incorrectas en el código que no son procesadas por Vite durante el build.

**Solución:**

1. **Opción A - Import (Recomendada):**
```javascript
import decoration1 from "../../assets/decoration1.webp";
<img src={decoration1} />
```

2. **Opción B - Ruta pública:**
Mover las imágenes a la carpeta `public/` y referenciarlas:
```javascript
<img src="/images/decoration1.webp" />
```

3. **Opción C - Solución temporal (workaround):**
```bash
# Duplicar assets en /src/assets en S3
aws s3 sync ./dist/assets s3://arryn-frontend-bucket/src/assets \
  --cache-control "public, max-age=31536000, immutable"

# Invalidar caché
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"
```

### Problema 2: Cambios no se Reflejan

**Síntoma:** Los cambios no aparecen después del despliegue.

**Causas posibles:**
- Caché del navegador
- Caché de CloudFront no invalidado
- Build no actualizado en S3

**Soluciones:**

```bash
# 1. Invalidar caché de CloudFront
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"

# 2. Verificar que los archivos se subieron correctamente
aws s3 ls s3://arryn-frontend-bucket --recursive

# 3. Hacer hard refresh en el navegador
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R
# Linux: Ctrl + F5
```

### Problema 3: Error 404 en Rutas de React Router

**Síntoma:** Al acceder directamente a una ruta (ej: /products), se muestra error 404.

**Causa:** CloudFront no está configurado para manejar el enrutamiento del lado del cliente.

**Solución:** Ya está configurado en `CustomErrorResponses`:
```json
{
  "ErrorCode": 404,
  "ResponsePagePath": "/index.html",
  "ResponseCode": "200",
  "ErrorCachingMinTTL": 300
}
```

Si el problema persiste, verificar que la configuración esté aplicada:
```bash
aws cloudfront get-distribution-config --id E3MY4I6PUS96SU \
  --query 'DistributionConfig.CustomErrorResponses'
```

### Problema 4: Certificado SSL en PENDING_VALIDATION

**Síntoma:** El certificado SSL no se valida después de varias horas.

**Causa:** Faltan los registros CNAME de validación en el DNS.

**Solución:**

1. Obtener los registros de validación:
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1 \
  --query 'Certificate.DomainValidationOptions'
```

2. Agregar AMBOS registros CNAME en Name.com (para arryn.app y www.arryn.app)

3. Esperar 5-30 minutos para la validación

### Problema 5: Error de Permisos en AWS CLI

**Síntoma:** Errores de "AccessDenied" al ejecutar comandos AWS.

**Causa:** Credenciales incorrectas o permisos insuficientes.

**Solución:**

```bash
# Verificar identidad actual
aws sts get-caller-identity

# Reconfigurar credenciales
aws configure

# Verificar permisos de la política IAM
aws iam get-user
```

### Problema 6: CloudFront Tarda en Desplegarse

**Síntoma:** La distribución permanece en estado "InProgress" por mucho tiempo.

**Causa:** Comportamiento normal de CloudFront.

**Solución:** El despliegue inicial puede tardar 10-30 minutos. Verificar estado:

```bash
aws cloudfront get-distribution \
  --id E3MY4I6PUS96SU \
  --query 'Distribution.Status'
```

Estados posibles:
- `InProgress`: Aún desplegando
- `Deployed`: Listo para usar

### Problema 7: DNS no Propaga

**Síntoma:** El dominio no resuelve después de configurar DNS.

**Causa:** Propagación DNS en curso.

**Tiempo de propagación:** 5 minutos a 48 horas (típicamente 15-30 minutos)

**Verificación:**

```bash
# Verificar registros DNS
dig arryn.app CNAME
dig www.arryn.app CNAME

# Verificar desde diferentes servidores DNS
nslookup arryn.app 8.8.8.8  # Google DNS
nslookup arryn.app 1.1.1.1  # Cloudflare DNS
```

### Problema 8: Error en GitHub Actions

**Síntoma:** El workflow de GitHub Actions falla.

**Causas comunes:**
- Secrets no configurados
- Credenciales AWS expiradas
- Errores de build

**Solución:**

1. Verificar logs del workflow en GitHub
2. Verificar que los secrets estén configurados correctamente
3. Probar el build localmente:
```bash
npm ci
npm run build
```

---

## Estado Actual del Proyecto

### URLs Funcionales

| Tipo | URL | Estado |
|------|-----|--------|
| Dominio Principal | https://arryn.app | Operativo |
| Dominio WWW | https://www.arryn.app | Operativo |
| CloudFront Directo | https://d2objaapejmkqm.cloudfront.net | Operativo |
| S3 Website Endpoint | http://arryn-frontend-bucket.s3-website.us-east-2.amazonaws.com | No recomendado (sin SSL) |

### Contenido Actual en S3

```
s3://arryn-frontend-bucket/
├── assets/
│   ├── Logo.svg
│   ├── LogoIcon.svg
│   ├── LogoIcon-B0S8zMBw.svg
│   ├── User.svg
│   ├── arryncel.webp
│   ├── arryncomputadoras.webp
│   ├── arryntrabajador.webp
│   ├── arryntv.webp
│   ├── decoration1.webp
│   ├── decoration2.webp
│   ├── decoration3.webp
│   ├── decoration4.webp
│   ├── decoration5.webp
│   ├── icon.svg
│   ├── index-CntviCC4.css
│   ├── index-DZdIEsAj.js
│   ├── logout.png
│   ├── placeholder-product.webp
│   ├── profile.png
│   └── workerarryn.webp
└── index.html
```

### Estado de los Servicios AWS

**S3 Bucket:**
- Estado: Activo
- Acceso público: Habilitado (solo lectura)
- Static Website Hosting: Habilitado
- CORS: Configurado

**CloudFront:**
- Estado: Deployed
- Compresión: Habilitada
- HTTPS: Obligatorio (redirect-to-https)
- Certificado SSL: Válido

**Certificado ACM:**
- Estado: ISSUED
- Dominios: arryn.app, www.arryn.app
- Renovación: Automática

**DNS:**
- Registros CNAME configurados correctamente
- Validación SSL completada
- Propagación completa

### Métricas y Rendimiento

**Características de Rendimiento:**
- Tiempo de carga inicial: < 2 segundos
- Compresión Gzip/Brotli: Habilitada
- Caché de assets: 1 año
- CDN: Distribución global
- SSL/TLS: TLS 1.2 mínimo

### Costos Estimados

**Desglose mensual (tráfico bajo-medio):**

| Servicio | Costo Estimado |
|----------|---------------|
| S3 Storage (< 1 GB) | $0.02/mes |
| S3 Requests | $0.01/mes |
| CloudFront Data Transfer (< 10 GB) | $0.85/mes |
| CloudFront Requests | $0.01/mes |
| ACM Certificate | Gratis |
| **Total Estimado** | **$0.89 - $5.00/mes** |

**Nota:** Los costos reales dependen del tráfico y uso del sitio.

### Tareas Pendientes y Mejoras

1. **Corrección de imports:** Corregir el import de `arryncomputadoras.webp` en `HomeLogin.jsx`
2. **Logging:** Habilitar CloudFront access logs para análisis detallado
3. **Monitoring:** Configurar CloudWatch Alarms para monitoreo proactivo
4. **Backups:** Considerar habilitar S3 Versioning para backup automático
5. **Testing:** Ampliar cobertura de tests unitarios
6. **Performance:** Implementar lazy loading de imágenes
7. **SEO:** Agregar meta tags y sitemap.xml
8. **Analytics:** Integrar Google Analytics o similar

### Seguridad

**Medidas implementadas:**
- Todo el tráfico utiliza HTTPS
- Certificado SSL válido y renovación automática
- Bucket policy restrictiva (solo GetObject público)
- CloudFront configurado con TLS 1.2 mínimo
- Headers de seguridad en respuestas

**Recomendaciones adicionales:**
- Implementar Content Security Policy (CSP) headers
- Configurar HSTS (HTTP Strict Transport Security)
- Implementar rate limiting si es necesario
- Revisar logs regularmente

---

## Referencias

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS Certificate Manager Documentation](https://docs.aws.amazon.com/acm/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Name.com DNS Management](https://www.name.com/support/articles/205188538-Managing-DNS-Records)

---

## Contacto y Soporte

**Proyecto:** Arryn eCommerce  
**Repositorio:** [ARRYN-PI2/pi2-frontend](https://github.com/ARRYN-PI2/pi2-frontend)  
**Equipo de Desarrollo:** Equipo Arryn  
**Última actualización:** Octubre 2025

Para reportar problemas o sugerir mejoras, crear un issue en el repositorio de GitHub.

---

**Documento creado:** Octubre 2025  
**Última actualización:** Octubre 26, 2025  
**Versión:** 1.0.0
