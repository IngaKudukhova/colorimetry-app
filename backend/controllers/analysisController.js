const Substance = require('../models/Substance')

function calculateArea(values) {
  const sin60 = Math.sin(Math.PI / 3)

  let sum = 0

  for (let i = 0; i < values.length; i++) {
    const current = values[i]

    const next = values[(i + 1) % values.length]

    sum += current * next
  }

  return 0.5 * sin60 * sum
}

function calculatePerimeter(values) {
  let sum = 0

  for (let i = 0; i < values.length; i++) {
    const r1 = values[i]

    const r2 = values[(i + 1) % values.length]

    const angle = Math.PI / 3

    const side = Math.sqrt(r1 * r1 + r2 * r2 - 2 * r1 * r2 * Math.cos(angle))

    sum += side
  }

  return sum
}

function solveQuadratic(y, a, b, c) {
  const D = b * b - 4 * a * (c - y)

  if (D < 0) return null

  const x1 = (-b + Math.sqrt(D)) / (2 * a)

  const x2 = (-b - Math.sqrt(D)) / (2 * a)

  return Math.max(x1, x2)
}

function calculateByEquation(y, equation) {
  switch (equation.type) {
    case 'linear':
      return (y - equation.b) / equation.a

    case 'power':
      return Math.pow(y / equation.a, 1 / equation.b)

    case 'polynomial':
      return solveQuadratic(y, equation.a, equation.b, equation.c)

    case 'exponential':
      return Math.log(y / equation.a) / equation.b

    default:
      return null
  }
}

exports.calculateAnalysis = async (req, res) => {
  try {
    const { rgb1, rgb2, substance } = req.body

    const values = [rgb1.r, rgb1.g, rgb1.b, rgb2.r, rgb2.g, rgb2.b]

    const area = calculateArea(values)

    const perimeter = calculatePerimeter(values)

    const foundSubstance = await Substance.findOne({
      name: substance,
    })

    if (!foundSubstance) {
      return res.status(404).json({
        message: 'Substance not found',
      })
    }

    const concentrationArea = calculateByEquation(area, foundSubstance.areaEquation)

    const concentrationPerimeter = calculateByEquation(perimeter, foundSubstance.perimeterEquation)
    res.json({
      area,

      perimeter,

      concentrationArea,

      concentrationPerimeter,

      areaR2: foundSubstance.areaEquation.r2,

      perimeterR2: foundSubstance.perimeterEquation.r2,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
