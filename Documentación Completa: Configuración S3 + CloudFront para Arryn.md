# Documentación Completa: Configuración S3 + CloudFront para Arryn

**Proyecto:** Arryn - eCommerce Frontend  
**Fecha de Configuración:** Octubre 2025  
**Tecnología Frontend:** React + Vite  
**Cuenta AWS:** 287493836974  

---

## 📋 Tabla de Contenidos

1. [Información General](#información-general)
2. [Configuración de AWS CLI](#configuración-de-aws-cli)
3. [Configuración de S3](#configuración-de-s3)
4. [Configuración de Certificado SSL](#configuración-de-certificado-ssl)
5. [Configuración de CloudFront](#configuración-de-cloudfront)
6. [Configuración DNS](#configuración-dns)
7. [Deployment del Frontend](#deployment-del-frontend)
8. [Comandos de Mantenimiento](#comandos-de-mantenimiento)
9. [Troubleshooting](#troubleshooting)
10. [Variables y Recursos](#variables-y-recursos)

---

## 1. Información General

### Arquitectura Implementada

```
GitHub (React Build) 
    ↓
Amazon S3 (arryn-frontend-bucket)
    ↓
Amazon CloudFront (CDN Global)
    ↓
Name.com DNS (arryn.app)
    ↓
Usuario Final (HTTPS)
```

### Recursos AWS Utilizados

| Recurso | Identificador | Región | Propósito |
|---------|--------------|--------|-----------|
| Cuenta AWS | 287493836974 | - | Cuenta principal |
| Bucket S3 | arryn-frontend-bucket | us-east-2 (Ohio) | Almacenamiento de archivos estáticos |
| Certificado ACM | e8066a33-3808-4a52-9d35-3b02b2029bdd | us-east-1 (Virginia) | SSL/TLS para HTTPS |
| Distribución CloudFront | E3MY4I6PUS96SU | Global | CDN para distribución de contenido |
| Dominio | arryn.app, www.arryn.app | - | Dominio registrado en Name.com |

---

## 2. Configuración de AWS CLI

### Instalación

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

**Valores configurados:**
- AWS Access Key ID: `[CONFIGURADO]`
- AWS Secret Access Key: `[CONFIGURADO]`
- Default region name: `us-east-2`
- Default output format: `json`

### Verificación de Configuración

```bash
# Verificar identidad
aws sts get-caller-identity

# Output esperado:
# {
#     "UserId": "287493836974",
#     "Account": "287493836974",
#     "Arn": "arn:aws:iam::287493836974:root"
# }
```

---

## 3. Configuración de S3

### 3.1 Creación del Bucket

```bash
# Crear bucket
aws s3 mb s3://arryn-frontend-bucket --region us-east-2
```

**Configuraciones aplicadas en consola:**
- **AWS Region:** us-east-2 (Ohio)
- **Bucket type:** General purpose
- **Bucket name:** arryn-frontend-bucket
- **Object Ownership:** ACLs disabled (recommended)
- **Block Public Access:** Deshabilitado completamente
- **Bucket Versioning:** Disabled
- **Encryption:** SSE-S3 con Bucket Key habilitado

### 3.2 Desactivar Bloqueo de Acceso Público

```bash
aws s3api put-public-access-block \
  --bucket arryn-frontend-bucket \
  --public-access-block-configuration \
  BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

### 3.3 Aplicar Política de Bucket

**Archivo:** `bucket-policy.json`

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

### 3.4 Habilitar Static Website Hosting

```bash
aws s3 website s3://arryn-frontend-bucket \
  --index-document index.html \
  --error-document index.html
```

**Nota:** `error-document` apunta a `index.html` para soportar enrutamiento de React Router.

### 3.5 Configurar CORS

**Archivo:** `cors-config.json`

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

**Aplicar CORS:**

```bash
aws s3api put-bucket-cors \
  --bucket arryn-frontend-bucket \
  --cors-configuration file://cors-config.json
```

### 3.6 Verificación de Configuración S3

```bash
# Verificar política
aws s3api get-bucket-policy --bucket arryn-frontend-bucket

# Verificar CORS
aws s3api get-bucket-cors --bucket arryn-frontend-bucket

# Verificar website hosting
aws s3api get-bucket-website --bucket arryn-frontend-bucket

# Listar contenido
aws s3 ls s3://arryn-frontend-bucket --recursive
```

---

## 4. Configuración de Certificado SSL

### 4.1 Solicitar Certificado en ACM

⚠️ **CRÍTICO:** El certificado DEBE estar en `us-east-1` para CloudFront.

```bash
aws acm request-certificate \
  --domain-name arryn.app \
  --subject-alternative-names www.arryn.app \
  --validation-method DNS \
  --region us-east-1
```

**Output:**
```json
{
    "CertificateArn": "arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd"
}
```

### 4.2 Obtener Registros DNS para Validación

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1
```

### 4.3 Registros CNAME de Validación

**Para arryn.app:**
- **Name:** `_0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app`
- **Type:** CNAME
- **Value:** `_050b2a02158cce269dae36fb690a05be.xlfgrmvvlj.acm-validations.aws`

**Para www.arryn.app:**
- **Name:** `_95e3b50e3dfb9c21be63418c05f0796e.www.arryn.app`
- **Type:** CNAME
- **Value:** `_f503d9db6e721c2722473505e1b28678.xlfgrmvvlj.acm-validations.aws`

### 4.4 Verificar Estado del Certificado

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1 \
  --query 'Certificate.Status'

# Output esperado: "ISSUED"
```

---

## 5. Configuración de CloudFront

### 5.1 Archivo de Configuración

**Archivo:** `cloudfront-config.json`

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

### 5.2 Crear Distribución de CloudFront

```bash
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**Output:**
```json
{
    "Distribution": {
        "Id": "E3MY4I6PUS96SU",
        "ARN": "arn:aws:cloudfront::287493836974:distribution/E3MY4I6PUS96SU",
        "Status": "InProgress",
        "DomainName": "d2objaapejmkqm.cloudfront.net"
    }
}
```

### 5.3 Verificar Estado de CloudFront

```bash
aws cloudfront get-distribution \
  --id E3MY4I6PUS96SU \
  --query 'Distribution.Status'

# Output: "InProgress" o "Deployed"
```

**Tiempo de despliegue:** 10-20 minutos

---

## 6. Configuración DNS

### 6.1 Proveedor: Name.com

**Registros DNS configurados:**

| Type | Host | Answer | TTL |
|------|------|--------|-----|
| CNAME | `_0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app` | `_050b2a02158cce269dae36fb690a05be.xlfgrmvvlj.acm-validations.aws` | 300 |
| CNAME | `_95e3b50e3dfb9c21be63418c05f0796e.www.arryn.app` | `_f503d9db6e721c2722473505e1b28678.xlfgrmvvlj.acm-validations.aws` | 300 |
| CNAME | `arryn.app` | `d2objaapejmkqm.cloudfront.net` | 300 |
| CNAME | `www.arryn.app` | `d2objaapejmkqm.cloudfront.net` | 300 |

### 6.2 Verificación DNS

```bash
# Verificar registro de validación
dig _0dc011b7d5f39db8f6f49cde8a9f86d7.arryn.app CNAME

# Verificar dominio principal
dig arryn.app CNAME

# Verificar www
dig www.arryn.app CNAME
```

---

## 7. Deployment del Frontend

### 7.1 Estructura del Proyecto

```
pi2-frontend/
├── .github/workflows/
│   └── deploy.yml
├── dist/                    # Build output
│   ├── assets/
│   │   ├── *.webp
│   │   ├── *.svg
│   │   ├── *.css
│   │   └── *.js
│   └── index.html
├── src/
│   └── assets/
├── vite.config.js
└── package.json
```

### 7.2 Configuración de Vite

**Archivo:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 7.3 Build de Producción

```bash
# Desde la raíz del proyecto frontend
npm run build
```

**Output:** Genera la carpeta `dist/` con todos los archivos estáticos.

### 7.4 Subir Archivos a S3

**Opción 1: Subida Completa**

```bash
# Subir todo el contenido
aws s3 sync ./dist s3://arryn-frontend-bucket \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Subir index.html con caché diferente
aws s3 cp ./dist/index.html s3://arryn-frontend-bucket/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

**Opción 2: Subida Incremental**

```bash
# Solo assets
aws s3 sync ./dist/assets s3://arryn-frontend-bucket/assets \
  --cache-control "public, max-age=31536000, immutable"

# index.html
aws s3 cp ./dist/index.html s3://arryn-frontend-bucket/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

### 7.5 Invalidar Caché de CloudFront

```bash
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"
```

**Tiempo de invalidación:** 2-5 minutos

**Verificar invalidación:**

```bash
aws cloudfront list-invalidations \
  --distribution-id E3MY4I6PUS96SU
```

### 7.6 Contenido Actual en S3

```
s3://arryn-frontend-bucket/
├── assets/
│   ├── Logo.svg
│   ├── LogoIcon-B0S8zMBw.svg
│   ├── LogoIcon.svg
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

---

## 8. Comandos de Mantenimiento

### 8.1 Verificar Estado de Recursos

```bash
# Listar buckets
aws s3 ls

# Verificar contenido del bucket
aws s3 ls s3://arryn-frontend-bucket --recursive

# Estado de CloudFront
aws cloudfront get-distribution --id E3MY4I6PUS96SU

# Estado del certificado
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd \
  --region us-east-1
```

### 8.2 Script de Deployment Completo

**Archivo:** `deploy.sh`

```bash
#!/bin/bash

# Variables
BUCKET_NAME="arryn-frontend-bucket"
DISTRIBUTION_ID="E3MY4I6PUS96SU"
BUILD_DIR="./dist"

echo "🏗️  Building application..."
npm run build

echo "📤 Uploading to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp $BUILD_DIR/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "public, max-age=0, must-revalidate"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment completed!"
echo "🌐 Site: https://arryn.app"
```

**Hacer ejecutable:**

```bash
chmod +x deploy.sh
```

**Ejecutar:**

```bash
./deploy.sh
```

### 8.3 Limpiar Archivos Antiguos

```bash
# Eliminar todo el contenido del bucket
aws s3 rm s3://arryn-frontend-bucket --recursive

# Eliminar archivos específicos
aws s3 rm s3://arryn-frontend-bucket/old-file.js
```

---

## 9. Troubleshooting

### 9.1 Problema: Imágenes no Cargan

**Síntoma:** Las imágenes aparecen rotas en el sitio.

**Causa:** Rutas incorrectas en el código (usando `/src/assets/` en lugar de `/assets/`).

**Solución Temporal (sin cambiar código):**

```bash
# Duplicar assets en /src/assets
aws s3 sync ./dist/assets s3://arryn-frontend-bucket/src/assets \
  --cache-control "public, max-age=31536000, immutable"

# Invalidar caché
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"
```

**Solución Permanente (recomendada):**

En tu código React, cambia:

```javascript
// ❌ INCORRECTO
<img src="/src/assets/decoration1.webp" />

// ✅ CORRECTO - Opción 1: Import
import decoration1 from './assets/decoration1.webp'
<img src={decoration1} />

// ✅ CORRECTO - Opción 2: Ruta relativa al build
<img src="/assets/decoration1.webp" />
```

### 9.2 Problema: CloudShell no Funciona

**Síntoma:** Error "Unable to create the environment. Your account verification is in progress."

**Causa:** Cuenta AWS nueva (menos de 30 días) sin verificación completa.

**Solución:** Usar AWS CLI local en lugar de CloudShell (funciona correctamente).

### 9.3 Problema: No se Puede Crear CloudFront

**Síntoma:** Error "AccessDenied: Your account must be verified before you can add new CloudFront resources."

**Causa:** Restricciones en cuentas nuevas.

**Solución:**
1. Contactar AWS Support (gratis, plan Basic)
2. Crear caso: Account and Billing → Account Activation → Account Verification
3. Tiempo de respuesta: 24-48 horas

**Caso creado:** Case ID 176039506900457

### 9.4 Problema: Certificado SSL en PENDING_VALIDATION por Mucho Tiempo

**Síntoma:** Certificado no se valida después de 14+ horas.

**Causa:** Falta agregar el segundo registro CNAME para `www.arryn.app`.

**Solución:**
1. Obtener ambos registros de validación
2. Agregar AMBOS registros CNAME en Name.com
3. Esperar 5-30 minutos

### 9.5 Problema: Cambios no se Reflejan en el Sitio

**Causa:** Caché de CloudFront.

**Soluciones:**

```bash
# 1. Invalidar caché de CloudFront
aws cloudfront create-invalidation \
  --distribution-id E3MY4I6PUS96SU \
  --paths "/*"

# 2. Hard refresh en el navegador
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R

# 3. Verificar estado de invalidación
aws cloudfront list-invalidations \
  --distribution-id E3MY4I6PUS96SU
```

### 9.6 Problema: DNS no Propaga

**Síntoma:** Dominio no resuelve después de configurar DNS.

**Tiempo de propagación:** 5 minutos a 48 horas (típicamente 15-30 minutos).

**Verificar:**

```bash
# Verificar registros DNS
dig arryn.app
dig www.arryn.app

# Verificar desde diferentes servidores DNS
nslookup arryn.app 8.8.8.8
nslookup arryn.app 1.1.1.1
```

---

## 10. Variables y Recursos

### 10.1 Variables de Entorno y Configuración

| Variable | Valor | Descripción |
|----------|-------|-------------|
| AWS_ACCOUNT_ID | 287493836974 | ID de la cuenta AWS |
| AWS_REGION_S3 | us-east-2 | Región del bucket S3 |
| AWS_REGION_ACM | us-east-1 | Región del certificado SSL |
| S3_BUCKET_NAME | arryn-frontend-bucket | Nombre del bucket |
| CLOUDFRONT_DISTRIBUTION_ID | E3MY4I6PUS96SU | ID de distribución CloudFront |
| CLOUDFRONT_DOMAIN | d2objaapejmkqm.cloudfront.net | Dominio de CloudFront |
| CERTIFICATE_ARN | arn:aws:acm:us-east-1:287493836974:certificate/e8066a33-3808-4a52-9d35-3b02b2029bdd | ARN del certificado SSL |
| DOMAIN_NAME | arryn.app | Dominio principal |
| DOMAIN_WWW | www.arryn.app | Subdominio www |
| DNS_PROVIDER | Name.com | Proveedor de DNS |

### 10.2 URLs de Acceso

| Tipo | URL | Estado |
|------|-----|--------|
| CloudFront Directo | https://d2objaapejmkqm.cloudfront.net | ✅ Funcional |
| Dominio Principal | https://arryn.app | ✅ Funcional |
| Dominio WWW | https://www.arryn.app | ✅ Funcional |
| S3 Website Endpoint | http://arryn-frontend-bucket.s3-website.us-east-2.amazonaws.com | ⚠️ No usar (sin SSL) |

### 10.3 Archivos de Configuración

**Ubicación:** `~/aws-configs/`

```
aws-configs/
├── bucket-policy.json
├── cors-config.json
└── cloudfront-config.json
```

### 10.4 Costos Estimados

**S3:**
- Almacenamiento: ~$0.023/GB/mes
- Requests GET: $0.0004 por 1,000 requests
- Transfer a CloudFront: Gratis

**CloudFront:**
- Transfer OUT: $0.085/GB (primeros 10 TB/mes)
- Requests HTTP/HTTPS: $0.0075-0.0100 por 10,000 requests
- Invalidaciones: Primeras 1,000 gratis/mes

**ACM (Certificados SSL):**
- Gratis para certificados públicos

**Estimado mensual (tráfico bajo-medio):** $1-5 USD/mes

### 10.5 Límites y Cuotas

| Recurso | Límite |
|---------|--------|
| Buckets S3 por cuenta | 100 (soft limit) |
| Tamaño de objeto en S3 | 5 TB |
| Distribuciones CloudFront por cuenta | 200 (soft limit) |
| Invalidaciones CloudFront gratuitas | 1,000/mes |
| Certificados ACM por cuenta | 2,500 (soft limit) |
| Alias por distribución CloudFront | 100 |

---

## 📚 Referencias

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS ACM Documentation](https://docs.aws.amazon.com/acm/)
- [Vite Documentation](https://vitejs.dev/)
- [Name.com DNS Management](https://www.name.com/support/articles/205188538-Managing-DNS-Records)

---

## 📝 Notas Adicionales

### Seguridad

- ✅ Todo el tráfico usa HTTPS (certificado SSL válido)
- ✅ Bucket policy permite solo lectura pública (GetObject)
- ✅ CloudFront configurado con TLS 1.2 mínimo
- ✅ Headers de caché optimizados para seguridad

### Performance

- ✅ Compresión habilitada en CloudFront (Compress: true)
- ✅ Caché configurado con TTL optimizado
- ✅ Assets con caché agresivo (1 año)
- ✅ index.html sin caché para actualizaciones rápidas

### Mantenimiento Futuro

1. Renovación de certificado SSL: **Automática** (AWS ACM renueva automáticamente)
2. Backups: Habilitar versioning en S3 si es necesario
3. Monitoreo: Configurar CloudWatch para alertas
4. Logs: Habilitar logging de CloudFront si se requiere análisis detallado

---

**Documento creado:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Mantenedor:** Equipo de Desarrollo Arryn