//console.log('Hello from -> Popup');

// Añadir efectos de hover y animaciones mejoradas
const addInteractiveEffects = () => {
  // Efecto de partículas en el fondo (opcional)
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.6;
      animation: float 3s ease-in-out infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 3 + 's';
    
    return particle;
  };

  // Agregar efectos de hover a los steps
  document.querySelectorAll('.step').forEach((step, index) => {
    step.addEventListener('mouseenter', () => {
      step.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    step.addEventListener('mouseleave', () => {
      step.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Agregar efecto de ripple a los botones
  document.querySelectorAll('.switch-version-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
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
        background: rgba(255, 255, 255, 0.3);
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
