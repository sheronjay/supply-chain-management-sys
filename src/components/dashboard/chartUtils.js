export const createPoints = (values, width, height) => {
    if (values.length === 1) {
      return [{ x: width / 2, y: height / 2 }]
    }
  
    const maxValue = Math.max(...values) * 1.15
    const stepX = width / (values.length - 1)
  
    return values.map((value, index) => {
      const clamped = Math.max(0, value)
      const ratio = clamped / maxValue
      const x = index * stepX
      const y = height - ratio * height
      return { x, y }
    })
  }
  
  export const buildLinePath = (points) =>
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
      .join(' ')
  
  export const buildAreaPath = (points, width, height) =>
    `M0,${height} ${points.map((point) => `L${point.x},${point.y}`).join(' ')} L${width},${height} Z`