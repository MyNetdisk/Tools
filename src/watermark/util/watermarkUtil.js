import { dataURItoBlob } from './fileUtil';

/**
 * 图片转canvas
 * @param {*} url
 * @returns
 */
export async function imgToCanvas(url) {
  // 创建img对象
  const img = new Image();
  img.src = url; // 加载图片
  // 等待图片加载完成
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  // 创建canvas对象
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // 将图片绘制到canvas上
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/**
 * canvas转图片
 * @param {*} canvas
 */
export function canvasToImg(canvas) {
  const { width, height } = canvas;
  const img = new Image();
  img.src = canvas.toDataURL();
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  return img;
}

/**
 * 下载图片
 * @param {*} canvas
 */
export function downloadImg(canvas) {
  try {
    // 从Canvas获取Base64编码的图片数据
    const base64 = canvas.toDataURL('image/png');
    // 将Base64转换为Blob对象
    const blob = dataURItoBlob(base64);
    // 创建下载链接
    const filename = 'watermark.png';
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    // 添加到DOM并触发点击
    document.body.appendChild(a);
    a.click();
    // 清理资源
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('下载图片失败', error);
  }
}

/**
 * 验证水印参数
 * @param {*} options
 */
function validateInput(options) {
  const { watermarkText, watermarkColor, watermarkSize, watermarkFont } =
    options;
  if (!watermarkText || !watermarkColor || !watermarkSize || !watermarkFont) {
    throw new Error('缺少水印参数');
  }
}

/**
 * 生成水印坐标点
 * @param {*} width
 * @param {*} height
 * @param {*} density
 * @returns
 */
function generateCoordinatePoints(width, height, density) {
  // 计算水印分布参数
  const maxDimension = Math.max(width, height); // 获取最大尺寸
  const stepSize = Math.floor(maxDimension / density); // 计算水印间距（密度控制）
  // 生成水印坐标数组（覆盖画布中心对称区域）
  const points = [0]; // 初始坐标点（中心原点）
  // 向正方向生成坐标点（0, step, 2step... 直至超过画布半径）
  while (points[points.length - 1] < maxDimension / 2) {
    points.push(points[points.length - 1] + stepSize);
  }
  // 向负方向生成对称坐标点（-step, -2step...）
  return [...points, ...points.slice(1).map((point) => -point)];
}

/**
 * 设置canvas上下文
 * @param {*} ctx
 * @param {*} options
 */
function setupCanvasContext(ctx, options) {
  ctx.font = `${options?.watermarkSize}px ${options?.watermarkFont}`; // 设置字体样式
  ctx.fillStyle = options?.watermarkColor; // 设置文本颜色
  ctx.textBaseline = 'middle'; // 设置文本基线为中间
  ctx.rotationRadians = options?.rotationRadians || 30; // 默认旋转30度
  ctx.globalAlpha = options?.watermarkOpacity || 0.5; // 设置透明度
}

/**
 * 生成文本配置
 * @param {*} options
 * @returns
 */
function createTextConfig(options) {
  const textArray = options?.watermarkText?.split('\n') || []; // 按行分割文本
  const MAX_TEXT_LINES = 3; // 最大行数
  const LINE_SPACING_OFFSET = 2; // 行间距偏移量
  return {
    lines: textArray.slice(0, MAX_TEXT_LINES), // 截取前3行
    fontSize: options?.watermarkSize, // 字体大小
    lineSpacing: LINE_SPACING_OFFSET, // 行间距
  };
}

/**
 * 绘制文本
 * @param {*} ctx
 * @param {*} drawingConfig
 */
function drawText(ctx, drawingConfig) {
  const { canvasSize, coordinatePoints, textConfig } = drawingConfig; // 获取绘制配置
  const { lines, fontSize, lineSpacing } = textConfig; // 获取文本配置
  const { width, height } = canvasSize; // 获取canvas的宽高
  // 双层循环平铺水印
  for (let x of coordinatePoints) {
    for (let y of coordinatePoints) {
      ctx.save(); // 保存当前绘图状态
      ctx.translate(width / 2, height / 2); // 移动坐标系原点至画布中心（准备旋转）
      // 旋转坐标系（水印整体倾斜效果）
      ctx.rotate((Math.PI / 180) * -ctx.rotationRadians); // 弧度转换（将度数转换为弧度）,转换为逆时针旋转
      // 绘制多行文本
      lines.forEach((line, index) => {
        // 计算行偏移（基行位置 + 行高×行号）
        const verticalOffset = fontSize * index + lineSpacing;
        // 在坐标点(arrayX[i], arrayX[j]+偏移)绘制
        ctx.fillText(line, x, y + verticalOffset);
      });
      // 恢复绘图状态（重置坐标系和旋转）
      ctx.restore();
    }
  }
}

/**
 * 绘制水印
 * @param {*} canvas
 * @param {*} options
 */
export function drawWarterMark(canvas, options) {
  // 验证参数
  validateInput(options);
  // 获取密度(水印密度系数（值越大水印越稀疏)
  const density = options?.density || 10.0;
  // 获取canvas的上下文
  const ctx = canvas.getContext('2d');
  // 设置canvas上下文
  setupCanvasContext(ctx, options);
  // 获取canvas的宽高
  const { width: canvasWidth, height: canvasHeight } = canvas;
  // 生成水印坐标点
  const coordinatePoints = generateCoordinatePoints(
    canvasWidth,
    canvasHeight,
    density
  );
  // 文字配置
  const textConfig = createTextConfig(options);
  // 绘制文本
  drawText(ctx, {
    canvasSize: {
      width: canvasWidth,
      height: canvasHeight,
    },
    coordinatePoints,
    textConfig,
  });
}
