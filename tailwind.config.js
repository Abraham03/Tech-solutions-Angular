/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Hacemos que Inter sea la fuente predeterminada de todo Tailwind
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#2979ff',       // Tu azul principal
          primaryHover: '#1c5ac2',  // Azul más oscuro para cuando pases el mouse
          accent: '#00e5ff',        // Cyan para destellos/neón
        },
        surface: {
          dark: '#12141d',          // Fondo principal (Body)
          paper: '#1e212b',         // Fondo de las tarjetas y menús
          border: '#2a2f42',        // Líneas separadoras sutiles
        },
        status: {
          success: '#10b981',       // Verde para "Activo"
          warning: '#f59e0b',       // Naranja para "Mantenimiento"
          error: '#ef4444',         // Rojo para "Pendiente/Error"
        }
      }
    },
  },
  plugins: [],
}