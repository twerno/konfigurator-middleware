const dimensionX = 1
const dimensionY = 2
// width | height < widthLength | heightLength < xStart => xEnd | yStart => yEnd < aspectRatio
// 100 | 50  < 25  | 50  < 37.5 => 62.5 | 0   => 50  < 4
// 100 | 100 < 50  | 100 < 25 => 75     | 0   => 100 < 2
// 100 | 200 < 100 | 200 < 0  => 100    | 0   => 200 < 1     | 100 - 100
// 100 | 300 < 100 | 200 < 0  => 100    | 50  => 150 < 0.[6] | 150 - 100
// 100 | 400 < 100 | 200 < 0  => 100    | 100 => 300 < 0.5 | 200 - 100
// 100 | 550 < 100 | 200 < 0  => 100    | 125 => 325 < 0.[4] 
// 100 | 500 < 100 | 200 < 0  => 100    | 150 => 350 < 0.4   | 250 - 100

// 200 | 100 < 50  | 100 < 75 => 125    | 0   => 100 < 4
// 200 | 200 < 100 | 200 < 50 => 150    | 0   => 200 < 2
// 200 | 400 < 200 | 400 < 0  => 200    | 0   => 400 < 1
// 200 | 500 < 200 | 400 < 0  => 200    | 50  => 450 < 0.[6] | 250 - 200

// 300 | 300 < 150 | 300 < 75 => 225    | 0   => 300 < 2
// 300 | 600 < 300 | 600 < 0  => 300    | 0   => 600 < 1
// 300 | 700 < 300 | 600 < 0  => 300    | 50  => 650 < 0.[6]

// xEnd = width - xStart
// yEnd = height - yStart
// xStart = ? | yStart = ?

// xStart = Math.max((width/2) - (width/(2*aspectRatio)) ,0) 
// yStart = Math.max(height/2 - width ,0)


export const previewBuilder = (width: number, height: number, className?: string) => {

    const tempAspectRatio = (width / dimensionX) / (height / dimensionY)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    if (className) canvas.className = className

    const padding = Math.min(height / 10 / dimensionY, width / 10 / Math.max(tempAspectRatio, 1))

    const outerStrokeYPosition = Math.max(height / 2 - width, 0) //yStart
    const outerStrokeYPositionEnd = height - outerStrokeYPosition
    const outerStrokeXPosition = Math.max((width / 2) - (width / (2 * tempAspectRatio)), 0) //xStart
    const outerStrokeXPositionEnd = (width - outerStrokeXPosition)

    const innerStrokeYPosition = outerStrokeYPosition + padding
    const innerStrokeYPositionEnd = height - outerStrokeYPosition - padding / 2
    const innerStrokeXPosition = outerStrokeXPosition + padding
    const innerStrokeXPositionEnd = width - innerStrokeXPosition

    const handleYPosition = height / 2
    const handleXPosition = outerStrokeXPosition + padding * 1.5
    const handleLength = padding

    const canvasContext = canvas.getContext("2d")
    canvasContext?.moveTo(outerStrokeXPosition, outerStrokeYPositionEnd)
    canvasContext?.lineTo(outerStrokeXPosition, outerStrokeYPosition)
    canvasContext?.lineTo(outerStrokeXPositionEnd, outerStrokeYPosition)
    canvasContext?.lineTo(outerStrokeXPositionEnd, outerStrokeYPositionEnd)

    canvasContext?.moveTo(innerStrokeXPosition, innerStrokeYPositionEnd)
    canvasContext?.lineTo(innerStrokeXPosition, innerStrokeYPosition)
    canvasContext?.lineTo(innerStrokeXPositionEnd, innerStrokeYPosition)
    canvasContext?.lineTo(innerStrokeXPositionEnd, innerStrokeYPositionEnd)

    canvasContext?.moveTo(handleXPosition, handleYPosition)
    canvasContext?.lineTo(handleXPosition + handleLength, handleYPosition)

    canvasContext?.stroke()

    return canvas
}