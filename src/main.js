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
  const imageInput = document.getElementById('imageInput'); // 获取文件选择元素
  const imageContainer = document.getElementById('imageContainer'); // 获取原图容器
  const previewContainer = document.getElementById('previewContainer'); // 获取预览容器
  let uploadedDataURL = ''; // 已经上传的图片base64
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
      const { watermarkText, watermarkFont, watermarkSize, watermarkColor } =
        data;
      if (!uploadedDataURL) return;
      // 将DataURL转换为canvas
      const canvas = await imgToCanvas(uploadedDataURL);
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
      previewContainer.innerHTML = ''; // 清空预览容器
      // 将图片添加到页面中
      previewContainer.appendChild(imgData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 处理下载按钮的点击事件
  const handleDownload = async (data) => {
    try {
      const { watermarkText, watermarkFont, watermarkSize, watermarkColor } =
        data;
      if (!uploadedDataURL) return;
      // 将DataURL转换为canvas
      const canvas = await imgToCanvas(uploadedDataURL);
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
    // 3. 处理表单数据
    if (lastClickedButton === 'preview') {
      handlePreview(data);
    } else if (lastClickedButton === 'download') {
      handleDownload(data);
    }
  });

  // 为文件上传按钮添加监听器
  imageInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (isFileValid(file)) {
      // 读取文件内容并转换为DataURL
      const dataURL = await readFileAsDataURL(file);
      uploadedDataURL = dataURL; // 将DataURL保存到全局变量中
      const img = new Image(); // 创建一个新的Image对象
      img.src = dataURL; // 设置Image对象的src属性为DataURL
      imageContainer.innerHTML = ''; // 清空原图容器
      // 将图片添加到页面中
      imageContainer.appendChild(img);
    }
  });
})();
