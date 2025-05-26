document.addEventListener('DOMContentLoaded', function() {
  const blobContainer = document.createElement('div');
  blobContainer.className = 'blob-container';
  document.body.appendChild(blobContainer);
  
  const originalBlob = document.getElementById('moving-blob');
  if (originalBlob) {
    originalBlob.remove();
  }
  
  const blobConfig = {
    id: 'galaxy-blob-1',
    size: { width: '70vw', height: '60vh' },
    gradient: 'radial-gradient(ellipse at center,rgb(250, 223, 17) 0%, rgb(30, 27, 249) 34%, rgba(0, 0, 0, 1) 60%)',
    blur: '20px',
    opacity: 0.8,
    startPosition: { x: 90, y: 50 }
  };
  
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  styleEl.innerHTML = `
    @keyframes subtlePulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.9; }
      100% { opacity: 0.6; }
    }
    
    .blob-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: -1;
      pointer-events: none;
    }
    
    .galaxy-blob {
      position: absolute;
      border-radius: 70% / 100%;
      mix-blend-mode: screen;
      transform-origin: center center;
      will-change: transform, border-radius, left, top, width, height;
      transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation: subtlePulse 6s infinite alternate ease-in-out;
    }
  `;
  
  const blob = document.createElement('div');
  blob.id = blobConfig.id;
  blob.className = 'galaxy-blob';
  
  blob.style.width = blobConfig.size.width;
  blob.style.height = blobConfig.size.height;
  blob.style.background = blobConfig.gradient;
  blob.style.filter = `blur(${blobConfig.blur})`;
  blob.style.opacity = blobConfig.opacity;
  
  blob.style.left = `${blobConfig.startPosition.x}%`;
  blob.style.top = `${blobConfig.startPosition.y}%`;
  blob.style.transform = 'translate(-50%, -50%) rotate(-15deg)';
  
  blobContainer.appendChild(blob);
  
  let scrollY = window.scrollY;
  let ticking = false;
  let windowHeight = window.innerHeight;
  let documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  
  
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBlobPosition();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  window.addEventListener('resize', () => {
    windowHeight = window.innerHeight;
    documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    const newIsMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (newIsMobile !== (blobConfig.startPosition.y === 30)) {
      blobConfig.startPosition.y = newIsMobile ? 30 : 50;
    }
    
    updateBlobPosition();
  });
  
  updateBlobPosition();
  
  function updateBlobPosition() {
    const scrollableHeight = Math.max(documentHeight - windowHeight, 1);
    const scrollPercent = Math.min(scrollY / scrollableHeight, 1);
    
    const easedScrollPercent = easeInOutQuad(scrollPercent);
    
    const startX = blobConfig.startPosition.x;
    const startY = blobConfig.startPosition.y;
    const endX = 15;
    const endY = 85;
    
    const currentX = startX + (endX - startX) * easedScrollPercent;
    const currentY = startY + (endY - startY) * easedScrollPercent;
    
    const curveX = Math.sin(easedScrollPercent * Math.PI) * -12;
    const curveY = Math.cos(easedScrollPercent * Math.PI * 0.5) * 8;
    
    const finalX = currentX + curveX;
    const finalY = currentY + curveY;
    
    const baseWidth = 70;
    const baseHeight = 60;
    const sizeMultiplier = 1 + (easedScrollPercent * 0.8);
    const newWidth = baseWidth * sizeMultiplier;
    const newHeight = baseHeight * sizeMultiplier;
    
    const startRotation = -35;
    const endRotation = 45;
    const rotationFromPath = startRotation + (endRotation - startRotation) * easedScrollPercent;
    
    const baseRadius = 70;
    const radiusVariation = Math.sin(easedScrollPercent * Math.PI * 2) * 25;
    const borderRadius = baseRadius + radiusVariation;
    
    const dynamicOpacity = blobConfig.opacity * (0.7 + easedScrollPercent * 0.3);
    
    blob.style.left = `${finalX}%`;
    blob.style.top = `${finalY}%`;
    blob.style.width = `${newWidth}vw`;
    blob.style.height = `${newHeight}vh`;
    blob.style.opacity = dynamicOpacity;
    blob.style.borderRadius = `${borderRadius}% / ${borderRadius + 15}%`;
    blob.style.transform = `
      translate(-50%, -50%)
      rotate(${rotationFromPath}deg)
    `;
    
    const dynamicBlur = 15 + (sizeMultiplier * 12);
    blob.style.filter = `blur(${dynamicBlur}px)`;
  }
  
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
});
