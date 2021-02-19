// export const drawCircle = ([x, y], diameter, options = {}) => {
//   let { color, lineColor = ctx.strokeStyle } = options;

//   ctx.beginPath();
//   ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
//   ctx.strokeStyle = lineColor;
//   ctx.stroke();
//   ctx.fillStyle = color;
//   if (color) ctx.fill();
// };

// export const drawOval = ([x, y], height, width, options = {}) => {
//   let { rotation = 0, color, lineColor = ctx.strokeStyle } = options;
//   if (rotation) rotation = __toRadians__(rotation);

//   ctx.beginPath();
//   ctx.ellipse(x, y, width, height, rotation, 0, 2 * Math.PI);
//   ctx.strokeStyle = lineColor;
//   ctx.stroke();
//   ctx.fillStyle = color;
//   if (color) ctx.fill();
// };

// export const drawSquare = ([x, y], diameter, options = {}) => {
//   drawRectangle([x, y], diameter, diameter, options);
// };

// export const drawRectangle = ([x, y], height, width, options = {}) => {
//   let { color, lineColor = ctx.strokeStyle, radius = 0, rotate = 0 } = options;

//   // if (width < 2 * radius) radius = width / 2;
//   // if (height < 2 * radius) radius = height / 2;

//   ctx.beginPath();
//   ctx.moveTo(x + radius, y);
//   let p1 = __rotatePoint__([x + width, y], [x, y], rotate);
//   let p2 = __rotatePoint__([x + width, y + height], [x, y], rotate);
//   ctx.arcTo(p1[0], p1[1], p2[0], p2[1], radius);

//   let p3 = __rotatePoint__([x + width, y + height], [x, y], rotate);
//   let p4 = __rotatePoint__([x, y + height], [x, y], rotate);
//   ctx.arcTo(p3[0], p3[1], p4[0], p4[1], radius);

//   let p5 = __rotatePoint__([x, y + height], [x, y], rotate);
//   let p6 = __rotatePoint__([x, y], [x, y], rotate);
//   ctx.arcTo(p5[0], p5[1], p6[0], p6[1], radius);

//   let p7 = __rotatePoint__([x, y], [x, y], rotate);
//   let p8 = __rotatePoint__([x + width, y], [x, y], rotate);
//   ctx.arcTo(p7[0], p7[1], p8[0], p8[1], radius);
//   ctx.closePath();

//   ctx.strokeStyle = lineColor;
//   ctx.stroke();
//   ctx.fillStyle = color;
//   if (color) ctx.fill();
// };

// export const drawLine = ([fromX, fromY], [toX, toY], options = {}) => {
//   let { lineColor = ctx.strokeStyle } = options;

//   ctx.beginPath();
//   ctx.moveTo(fromX, fromY);
//   ctx.lineTo(toX, toY);
//   ctx.strokeStyle = lineColor;
//   ctx.stroke();
// };

// export const drawPolygon = (points, options = {}) => {
//   let {
//     color,
//     lineColor = ctx.strokeStyle,
//     radius = 0,
//     close = false,
//   } = options;

//   function getRoundedPoint(x1, y1, x2, y2, radius, first) {
//     let total = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
//     let idx = first ? radius / total : (total - radius) / total;

//     return [x1 + idx * (x2 - x1), y1 + idx * (y2 - y1)];
//   }

//   function getRoundedPoints(pts, radius) {
//     let len = pts.length;
//     let res = new Array(len);

//     for (let i2 = 0; i2 < len; i2++) {
//       let i1 = i2 - 1;
//       let i3 = i2 + 1;

//       if (i1 < 0) i1 = len - 1;
//       if (i3 == len) i3 = 0;

//       let p1 = pts[i1];
//       let p2 = pts[i2];
//       let p3 = pts[i3];

//       let prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
//       let nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
//       res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
//     }
//     return res;
//   }

//   if (radius > 0) {
//     points = getRoundedPoints(points, radius);
//   }

//   let i,
//     pt,
//     len = points.length;
//   for (i = 0; i < len; i++) {
//     pt = points[i];
//     if (i == 0) {
//       ctx.beginPath();
//       ctx.moveTo(pt[0], pt[1]);
//     } else {
//       ctx.lineTo(pt[0], pt[1]);
//     }
//     if (radius > 0) {
//       ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
//     }
//   }

//   if (close) ctx.closePath();
//   ctx.strokeStyle = lineColor;
//   ctx.stroke();

//   ctx.fillStyle = color;
//   if (color) ctx.fill();
// };
