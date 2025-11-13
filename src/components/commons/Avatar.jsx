import { useEffect, useState } from 'react'

const SIZE_MAP = {
  sm: { size: 32, font: 14 },
  md: { size: 48, font: 22 },
  lg: { size: 64, font: 28 },
  xl: { size: 96, font: 42 },
  xxl: { size: 128, font: 56 },
}

// Paleta estilo Google
const COLORS = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
]

// Lista de palabras que ignoramos para iniciales
const IGNORE_WORDS = ['de', 'del', 'de los', 'la', 'las', 'los', 'y']

// Función para normalizar letras: quita tildes, mantiene Ñ
function normalizeLetter(letter) {
  if (!letter) return ''
  return letter
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .toUpperCase()
}

// Obtiene la primera letra válida de una palabra (A-Z y Ñ)
function getFirstValidLetter(word) {
  if (!word) return ''
  const match = word.match(/[A-ZÑ]/i)
  return match ? normalizeLetter(match[0]) : ''
}

// Genera el avatar como antes
function generateAvatar(initials, size = 64, fontSize = 28) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  const colorIndex = initials.charCodeAt(0) % COLORS.length
  const bgColor = COLORS[colorIndex]

  ctx.fillStyle = bgColor
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#FFFFFF'
  ctx.font = `${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, size / 2, size / 2)

  return canvas.toDataURL('image/png')
}

export default function Avatar({
  name = '?',
  size = 'md',
  src,
  alt = 'Avatar',
}) {
  const [avatarURL, setAvatarURL] = useState(null)
  const s = SIZE_MAP[size] || SIZE_MAP.md

  useEffect(() => {
    if (!src && name) {
      const parts = name
        .trim()
        .split(/\s+/)
        .filter(p => !IGNORE_WORDS.includes(p.toLowerCase()))

      if (parts.length === 0) return

      let initials = ''

      if (parts.length >= 3) {
        // primera y tercera palabra
        initials = getFirstValidLetter(parts[0]) + getFirstValidLetter(parts[2])
      } else if (parts.length === 2) {
        // primera y segunda palabra
        initials = getFirstValidLetter(parts[0]) + getFirstValidLetter(parts[1])
      } else {
        // solo primera palabra
        initials = getFirstValidLetter(parts[0])
      }

      const generated = generateAvatar(initials, s.size, s.font)
      setAvatarURL(generated)
    }
  }, [name, src])

  return (
    <img
      src={src || avatarURL}
      alt={alt}
      width={s.size}
      height={s.size}
      className="rounded-full object-cover"
    />
  )
}
