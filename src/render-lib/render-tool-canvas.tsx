import { Polynomial } from "../interfaces";

export const render = (canvas: HTMLCanvasElement, polys: Polynomial[]) => {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    canvas.width = canvas.clientWidth;
    canvas.height = window.innerHeight;
    draw(canvas, ctx, polys);
  }
};

function drawAxis(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = 3;

  // smaller axis
  for (let i = 1; i < canvas.width; i++) {
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 - i * (canvas.height / 10));
    ctx.lineTo(canvas.width, canvas.height / 2 - i * (canvas.height / 10));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + i * (canvas.height / 10));
    ctx.lineTo(canvas.width, canvas.height / 2 + i * (canvas.height / 10));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - i * (canvas.height / 10), 0);
    ctx.lineTo(canvas.width / 2 - i * (canvas.height / 10), canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 + i * (canvas.height / 10), 0);
    ctx.lineTo(canvas.width / 2 + i * (canvas.height / 10), canvas.height);
    ctx.stroke();
  }

  // main axis
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  // x-axis
  for (let i = 1; i < canvas.width; i++) {
    drawTextBG(
      ctx,
      i.toString(),
      "20px Courier New",
      canvas.width / 2 +
        i * (canvas.height / 10) -
        ctx.measureText(i.toString()).width / 2,
      canvas.height / 2 + 5,
      "black",
      "white"
    );
  }

  for (let i = 1; i < canvas.width; i++) {
    drawTextBG(
      ctx,
      (-i).toString(),
      "20px Courier New",
      canvas.width / 2 -
        i * (canvas.height / 10) -
        ctx.measureText((-i).toString()).width / 2,
      canvas.height / 2 + 5,
      "black",
      "white"
    );
  }

  // y-axis
  for (let i = 0; i < canvas.width; i++) {
    drawTextBG(
      ctx,
      i.toString(),
      "20px Courier New",
      canvas.width / 2 - ctx.measureText(i.toString()).width * 1.5,
      canvas.height / 2 - i * (canvas.height / 10) + 5,
      "black",
      "white"
    );
  }

  for (let i = 1; i < canvas.width; i++) {
    drawTextBG(
      ctx,
      (-i).toString(),
      "20px Courier New",
      canvas.width / 2 - ctx.measureText(i.toString()).width * 2.5,
      canvas.height / 2 + i * (canvas.height / 10) + 5,
      "black",
      "white"
    );
  }
}

function drawTextBG(
  ctx: CanvasRenderingContext2D,
  txt: string,
  font: string,
  x: number,
  y: number,
  bgColor: string,
  fontColor: string
) {
  ctx.textBaseline = "top";

  ctx.fillStyle = bgColor;
  ctx.fillRect(
    x,
    y,
    ctx.measureText(txt).width,
    ctx.measureText(txt).actualBoundingBoxDescent
  );

  ctx.font = font;
  ctx.fillStyle = fontColor;
  ctx.fillText(txt, x, y);
}

function parsePoly(polyString: string) {
  for (let i = 0; i < polyString.length - 1; ++i) {
    if (isNumber(polyString.charAt(i)) && polyString[i + 1] === "x") {
      polyString = [
        polyString.slice(0, i + 1),
        "*",
        polyString.slice(i + 1),
      ].join("");
    }
    if (polyString[i] === "^") {
      polyString = [polyString.slice(0, i), "**", polyString.slice(i + 1)].join(
        ""
      );
    }
    if (polyString[i] === "x" && polyString[i + 1] !== "^") {
      polyString = [
        polyString.slice(0, i),
        "x**1",
        polyString.slice(i + 1),
      ].join("");
    }
  }
  if (polyString[polyString.length - 1] === "x") {
    polyString = [polyString, "**1"].join("");
  }
  return (x: string) => eval(polyString);
}

const isNumber = (charString: string) => {
  const charNumber = charString.charCodeAt(0);
  return charNumber >= 48 && charNumber <= 57;
};

function drawPoly(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  polynomialString: string,
  color: string
) {
  ctx.strokeStyle = color;

  let func = parsePoly(polynomialString);

  let arX = [];
  let xMax = 0;
  let xMin = 0;
  let resolution = 0.1;

  for (let i = 0; i < canvas.width; ++i) {
    let yVal = func(i.toString());
    if (yVal > 5 || yVal < -5) {
      xMax = i;
      break;
    }
  }

  for (let i = 0; i > -canvas.width; --i) {
    let yVal = func(i.toString());
    if (yVal > 5 || yVal < -5) {
      xMin = i;
      break;
    }
  }

  for (let i = xMin; i < xMax; i += resolution) {
    arX.push(i);
  }

  let arY = arX.map((x) => func(x.toString())); // put polynomial here

  for (let i = 0; i < arX.length - 1; ++i) {
    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 + (canvas.height / 10) * arX[i],
      canvas.height / 2 - (canvas.height / 10) * arY[i]
    );
    ctx.lineTo(
      canvas.width / 2 + (canvas.height / 10) * arX[i + 1],
      canvas.height / 2 - (canvas.height / 10) * arY[i + 1]
    );
    ctx.stroke();
  }
}

function draw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  polys: Polynomial[]
) {
  drawAxis(canvas, ctx);
  polys.map((poly) => drawPoly(canvas, ctx, poly.polyString, poly.color));
}
