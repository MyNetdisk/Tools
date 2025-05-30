import './style/main.css';

// 示例：创建Tailwind样式的DOM元素
const app = document.getElementById('app');
app.innerHTML = `
  <h1 class="text-3xl font-bold text-center mt-8 color-blue-500">Welcome to Tailwind!</h1>
  <button class="btn-primary mt-4">点击我</button>
`;