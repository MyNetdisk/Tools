import './style/main.css';

// 添加滚动动画效果
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('slide-in');
    }
  });
}, observerOptions);

// 观察所有需要动画的元素
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.tool-card, h2, .bg-white.rounded-3xl'
  );
  animatedElements.forEach((el) => observer.observe(el));
});

// 添加鼠标跟随效果
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    }
  });
});
