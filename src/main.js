import './style/main.css';
import {
  imgToCanvas,
  canvasToImg,
  drawWarterMark,
  downloadImg,
  isFileValid,
  readFileAsDataURL,
} from './util';

(async () => {
  const form = document.getElementById('form'); // 获取表单元素
  // 获取表单提交按钮
  const buttons = {
    preview: document.getElementById('preview'),
    download: document.getElementById('download'),
  };
  let lastClickedButton = null; // 用于记录最后一次点击的按钮
  // 为预览按钮添加点击事件监听器
  buttons.preview.addEventListener(
    'click',
    () => (lastClickedButton = 'preview')
  );
  // 为下载按钮添加点击事件监听器
  buttons.download.addEventListener(
    'click',
    () => (lastClickedButton = 'download')
  );

  // 处理预览按钮的点击事件
  const handlePreview = async (data) => {
    try {
      const {
        imageInput,
        watermarkText,
        watermarkFont,
        watermarkSize,
        watermarkColor,
      } = data;
      if (isFileValid(imageInput)) {
        // 读取文件内容并转换为DataURL
        const dataURL = await readFileAsDataURL(imageInput);
        console.log('dataURL', dataURL);
        // 将DataURL转换为canvas
        const canvas = await imgToCanvas(dataURL);
        // 绘制水印
        drawWarterMark(canvas, {
          watermarkText,
          watermarkColor,
          watermarkSize,
          watermarkFont,
          watermarkOpacity: 1,
        });
        // 将canvas转换为图片
        const imgData = canvasToImg(canvas);
        // 将图片添加到页面中
        document.getElementById('imageContainer').appendChild(imgData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 处理下载按钮的点击事件
  const handleDownload = async (data) => {
    console.log('handleDownload', data);
    try {
      const {
        imageInput,
        watermarkText,
        watermarkFont,
        watermarkSize,
        watermarkColor,
      } = data;
      if (isFileValid(imageInput)) {
        // 读取文件内容并转换为DataURL
        const dataURL = await readFileAsDataURL(imageInput);
        console.log('dataURL', dataURL);
        // 将DataURL转换为canvas
        const canvas = await imgToCanvas(dataURL);
        // 绘制水印
        drawWarterMark(canvas, {
          watermarkText,
          watermarkColor,
          watermarkSize,
          watermarkFont,
          watermarkOpacity: 1,
        });
        // 下载图片
        downloadImg(canvas);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 为表单添加提交事件监听器
  form.addEventListener('submit', (event) => {
    // 1. 阻止默认提交行为（刷新页面）
    event.preventDefault();
    // 2. 获取表单数据
    const formData = new FormData(event.target); // 获取表单数据
    const data = Object.fromEntries(formData.entries()); // 将 FormData 对象转换为普通对象
    console.log('lastClickedButton', lastClickedButton);
    // 3. 处理表单数据
    if (lastClickedButton === 'preview') {
      handlePreview(data);
    } else if (lastClickedButton === 'download') {
      handleDownload(data);
    }
  });
})();
