//console.log('Hello from -> Popup');

// Añadir efectos de hover y animaciones mejoradas
const addInteractiveEffects = () => {
  // Agregar efectos de hover a los steps
  document.querySelectorAll('.step').forEach((step, index) => {
    step.addEventListener('mouseenter', () => {
      step.style.transform = 'translateY(-4px) scale(1.02)';
      step.style.transition = 'all 0.3s ease';
    });
    
    step.addEventListener('mouseleave', () => {
      step.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Agregar animación suave al título
  const heading = document.querySelector('.heading');
  if (heading) {
    heading.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    heading.style.webkitBackgroundClip = 'text';
    heading.style.webkitTextFillColor = 'transparent';
    heading.style.backgroundClip = 'text';
  }

  // Agregar efectos sutiles a los iconos
  document.querySelectorAll('.step-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'rotate(10deg) scale(1.1)';
      icon.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'rotate(0deg) scale(1)';
    });
  });
};

window.onload = () => {
  // Inicializar efectos interactivos
  addInteractiveEffects();

  // Agregar animación de entrada escalonada
  setTimeout(() => {
    document.querySelectorAll('.step').forEach((step, index) => {
      step.style.opacity = '0';
      step.style.transform = 'translateY(20px)';
      step.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'translateY(0)';
      }, 100 + index * 150);
    });
  }, 100);
};

// Agregar efectos de ripple a botones
const addRippleEffect = () => {
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
};

const handleSwitchVersion = (version) => {
  document.querySelectorAll('.switch-version-btn').forEach((i) => {
    i.classList.remove('active');
    i.style.transform = 'scale(0.95)';
    setTimeout(() => {
      i.style.transform = 'scale(1)';
    }, 100);
  });
  
  if (version === '0.1.8') {
    localStorage.setItem('resources-saver-version', '0.1.8');
    const btn = document.getElementById('switch-version-1-8');
    if (btn) {
      btn.classList.add('active');
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 200);
    }
  }
  if (version === '0.1.9') {
    localStorage.setItem('resources-saver-version', '0.1.9');
    const btn = document.getElementById('switch-version-1-9');
    if (btn) {
      btn.classList.add('active');
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 200);
    }
  }
  if (version === '2') {
    localStorage.setItem('resources-saver-version', '2');
    const btn = document.getElementById('switch-version-2');
    if (btn) {
      btn.classList.add('active');
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 200);
    }
  }
  
  // Mostrar feedback visual
  showVersionChangeNotification(version);
};

const showVersionChangeNotification = (version) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  notification.textContent = `✅ Versión ${version} activada`;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
};

window.onload = () => {
  // Inicializar efectos interactivos
  addInteractiveEffects();
  addRippleEffect();
  
  // Event listeners para cambio de versión
  const version18Btn = document.getElementById('switch-version-1-8');
  const version19Btn = document.getElementById('switch-version-1-9');
  const version2Btn = document.getElementById('switch-version-2');
  
  if (version18Btn) {
    version18Btn.addEventListener('click', () => {
      handleSwitchVersion('0.1.8');
    });
  }

  if (version19Btn) {
    version19Btn.addEventListener('click', () => {
      handleSwitchVersion('0.1.9');
    });
  }

  if (version2Btn) {
    version2Btn.addEventListener('click', () => {
      handleSwitchVersion('2');
    });
  }

  // Establecer versión activa inicial
  const version = localStorage.getItem('resources-saver-version') || '2';

  if (version === '2' && version2Btn) {
    version2Btn.classList.add('active');
  } else if (version === '0.1.9' && version19Btn) {
    version19Btn.classList.add('active');
  } else if (version18Btn) {
    version18Btn.classList.add('active');
  }

  // Agregar animación de entrada escalonada
  setTimeout(() => {
    document.querySelectorAll('.step').forEach((step, index) => {
      step.style.animationDelay = `${0.1 + index * 0.1}s`;
    });
  }, 100);
};
