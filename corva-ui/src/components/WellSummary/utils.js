const DIF_RADIUS = 4;
const DIF_ANGLE = 0.0416696814;

export function drawRadicalGradient(ctx, centerX, centerY, radius, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 8, startAngle, endAngle);
    ctx.closePath();
  
    const grd = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    grd.addColorStop(0, '#08345A00');
    grd.addColorStop(0.9, '#9FD2FF14');
    ctx.fillStyle = grd;
  
    ctx.fill();
  }
  
  function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle) {
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  }
  
  export function drawDonutSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color, isRounded) {
    // const diffAngle = 5 / radius;
    const difFlag = endAngle - startAngle > DIF_ANGLE * 2;
    const diffAngle = difFlag ? DIF_ANGLE : 0;
    const difRadius = difFlag ? DIF_RADIUS : 0;
    const roundRadius = 100 - difRadius;
  
    // NOTE: Draw arc
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle + diffAngle, endAngle - diffAngle);
    if (isRounded && difFlag) {
      // NOTE: Draw cicles
      const x1 = 100 + roundRadius * Math.cos(startAngle + diffAngle);
      const y1 = 100 + roundRadius * Math.sin(startAngle + diffAngle);
      drawPieSlice(ctx, x1, y1, difRadius, 0, Math.PI * 2, color);
  
      const x2 = 100 + roundRadius * Math.cos(endAngle - diffAngle);
      const y2 = 100 + roundRadius * Math.sin(endAngle - diffAngle);
      drawPieSlice(ctx, x2, y2, difRadius, 0, Math.PI * 2, color);
    }
    ctx.closePath();
  
    const grd = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, radius);
    grd.addColorStop(0, `${color}00`);
    grd.addColorStop(0.9, `${color}00`);
    grd.addColorStop(0.93, color);
    grd.addColorStop(1, color);
    ctx.fillStyle = grd;
  
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
  }