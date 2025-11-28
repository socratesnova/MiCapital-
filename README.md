# MiCapital 💰

**Mi Capital - Tu Gestor Financiero Personal Multiplataforma**

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-3ecf8e)](https://supabase.com/)

Una plataforma completa de gestión financiera personal con soporte web y móvil. Controla tus ingresos, gastos, presupuestos, metas de ahorro y préstamos todo en un solo lugar.

---

## 🌟 Características Principales

### ✅ Funcionalidades Core
- 📊 **Dashboard Inteligente** - Vista general de tus finanzas
- 💳 **Gestión de Transacciones** - Registra ingresos y gastos
- 📈 **Presupuestos** - Define y controla límites de gasto por categoría
- 🎯 **Metas de Ahorro** - Planifica y alcanza tus objetivos financieros
- 💰 **Calculadora de Préstamos** - Amortización completa con pagos extra
- 📉 **Reportes Avanzados** - Gráficos interactivos y análisis detallado

### 🎨 Diseño Premium
- 🌓 **Modo Oscuro/Claro** - Alterna según tu preferencia
- 📱 **Responsive Design** - Funciona en móvil, tablet y desktop
- ⚡ **Animaciones Suaves** - Experiencia de usuario fluida
- 🎯 **UI/UX Profesional** - Diseño moderno y elegante

### 🔐 Seguridad
- 🔒 **Autenticación con Supabase** - Login seguro
- 🛡️ **Datos Encriptados** - PostgreSQL seguro
- 👥 **Multi-Usuario** - Soporte para múltiples cuentas

---

## 🚀 Tecnologías

**Frontend:** Next.js 16, TypeScript, Tailwind CSS 4, Recharts  
**Backend:** PostgreSQL 15, PostgREST, Supabase  
**Infraestructura:** Docker, Vercel

---

## 📦 Instalación Rápida

```bash
# 1. Clonar
git clone https://github.com/socratesnova/MiCapital-.git
cd MiCapital-

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env.local

# 4. Iniciar base de datos
docker-compose up -d

# 5. Aplicar esquema
docker exec -i micapital_postgres psql -U postgres -d postgres < database/schema.sql

# 6. Desarrollar
npm run dev
```

Abre http://localhost:3000

---

## 🎯 Funcionalidades

- **Dashboard:** Métricas, transacciones recientes, presupuestos
- **Transacciones:** Lista completa con filtros y búsqueda
- **Presupuestos:** Gestión por categoría con alertas
- **Metas:** Indicadores de progreso y deadlines
- **Préstamos:** Calculadora con amortización
- **Reportes:** Gráficos interactivos (Ingresos/Gastos, Categorías, Net Worth)

---

## 📱 Roadmap Móvil

- [ ] App React Native (Q1 2025)
- [ ] Escaneo de recibos OCR
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Biometric login

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcion`)
3. Commit (`git commit -m 'Agrega nueva función'`)
4. Push (`git push origin feature/nueva-funcion`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Ver `LICENSE` para detalles

---

## 👨‍💻 Autor

**Socrates Nova** - [@socratesnova](https://github.com/socratesnova)

---

**¡Dale una ⭐ si te resulta útil!**
