import { readdirSync, statSync } from 'fs'
import path from 'path'

// Configuración: carpetas y extensiones a ignorar
const ignoreDirs = ['node_modules', 'dist', '.git', 'dev-dist', 'Recursos', 'scripts']
const ignoreExts = [
  '.log',
  '.md',
  '.lock',
  '.png',
  '.webp',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico'
] // extensiones a ignorar

/**
 * Función recursiva para imprimir el árbol
 * @param {string} dir - directorio actual
 * @param {string} prefix - prefijo para formato
 * @param {number} depth - niveles de profundidad
 */
function printTree(dir, prefix = '', depth = 2) {
  if (depth < 0) return

  const items = readdirSync(dir).filter((f) => !ignoreDirs.includes(f))

  items.forEach((item, index) => {
    const fullPath = path.join(dir, item)
    const isLast = index === items.length - 1
    const connector = isLast ? '└── ' : '├── '

    // Ignorar archivos según extensión
    if (
      statSync(fullPath).isFile() &&
      ignoreExts.includes(path.extname(item))
    ) {
      return
    }

    console.log(prefix + connector + item)

    // Si es carpeta, recursar
    if (statSync(fullPath).isDirectory()) {
      printTree(fullPath, prefix + (isLast ? '    ' : '│   '), depth - 1)
    }
  })
}

// Ejecutar en la raíz del proyecto
printTree('.', '', 10) // Cambia 3 por la profundidad que quieras