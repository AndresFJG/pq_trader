/**
 * Axtral Widget - White Label Embeddable Component
 * 
 * Integración:
 * 
 * 1. Incluir el script en tu página:
 *    <script src="https://axtralquant.com/widget.js"></script>
 * 
 * 2. Crear un contenedor:
 *    <div id="axtral-widget"></div>
 * 
 * 3. Inicializar el widget:
 *    <script>
 *      AxtralWidget.init({
 *        container: 'axtral-widget',
 *        partnerId: 'TU_PARTNER_ID_AQUI',      // REQUERIDO: Tu clave de partner
 *        partnerName: 'Tu Empresa',             // REQUERIDO: Nombre de tu empresa
 *        width: '100%',                         // Opcional: Ancho del widget
 *        height: '800px',                       // Opcional: Alto del widget
 *        theme: {                               // Opcional: Personalización de colores
 *          primaryColor: '#4AA3F0',
 *          secondaryColor: '#60A5FA',
 *          backgroundColor: '#0B1520',
 *          logoUrl: 'https://tuempresa.com/logo.png'
 *        },
 *        features: {
 *          showBranding: false,                 // Opcional: Mostrar marca Axtral (false por defecto)
 *          allowRegistration: true,             // Opcional: Permitir registro (true por defecto)
 *          defaultView: 'seasonality'           // Opcional: Vista inicial
 *        }
 *      });
 *    </script>
 */

(function(window) {
  'use strict';
  
  // Detección automática de entorno
  // Si el widget se carga desde localhost, usar localhost
  // Si se carga desde producción o file://, usar producción
  const scriptSrc = document.currentScript?.src || '';
  const WIDGET_BASE_URL = scriptSrc.includes('localhost:3000') 
    ? 'http://localhost:3000'
    : 'https://axtralquant.com';
  
  /**
   * Constructor del Widget
   */
  function AxtralWidgetClass() {
    this.instances = [];
    this.version = '1.0.0';
  }
  
  /**
   * Inicializa una nueva instancia del widget
   */
  AxtralWidgetClass.prototype.init = function(options) {
    // Validación de opciones requeridas
    if (!options.container) {
      console.error('AxtralWidget Error: container is required');
      return null;
    }
    
    if (!options.partnerId) {
      console.error('AxtralWidget Error: partnerId is required. Contact support to get your Partner ID.');
      return null;
    }
    
    if (!options.partnerName) {
      console.error('AxtralWidget Error: partnerName is required');
      return null;
    }
    
    // Configuración por defecto
    const config = {
      container: options.container,
      partnerId: options.partnerId,
      partnerName: options.partnerName,
      width: options.width || '100%',
      height: options.height || '800px',
      theme: options.theme || {},
      features: {
        showBranding: options.features?.showBranding || false,
        allowRegistration: options.features?.allowRegistration !== false,
        defaultView: options.features?.defaultView || 'seasonality'
      }
    };
    
    // Crear iframe
    const iframe = this.createIframe(config);
    
    // Obtener contenedor
    const container = document.getElementById(config.container);
    if (!container) {
      console.error('AxtralWidget Error: Container element not found: ' + config.container);
      return null;
    }
    
    // Limpiar contenedor y agregar iframe
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Guardar instancia
    const instance = {
      id: this.instances.length,
      config: config,
      iframe: iframe,
      container: container
    };
    
    this.instances.push(instance);
    
    // Configurar comunicación postMessage
    this.setupMessageListener(instance);
    
    return instance;
  };
  
  /**
   * Crea el elemento iframe
   */
  AxtralWidgetClass.prototype.createIframe = function(config) {
    const iframe = document.createElement('iframe');
    
    // Construir URL con parámetros
    const params = new URLSearchParams({
      partnerId: config.partnerId,
      partnerName: config.partnerName,
      widget: 'true',
      view: config.features.defaultView
    });
    
    // Agregar parámetros de tema si existen
    if (config.theme.primaryColor) {
      params.append('primaryColor', config.theme.primaryColor);
    }
    if (config.theme.secondaryColor) {
      params.append('secondaryColor', config.theme.secondaryColor);
    }
    if (config.theme.backgroundColor) {
      params.append('backgroundColor', config.theme.backgroundColor);
    }
    if (config.theme.logoUrl) {
      params.append('logoUrl', config.theme.logoUrl);
    }
    
    // Cargar la página principal - el usuario puede navegar libremente
    // Los parámetros se preservan en sessionStorage y URL para auto-completar en registro
    iframe.src = `${WIDGET_BASE_URL}?${params.toString()}`;
    iframe.style.width = config.width;
    iframe.style.height = config.height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'clipboard-write');
    
    return iframe;
  };
  
  /**
   * Configura el listener de mensajes entre iframe y parent
   */
  AxtralWidgetClass.prototype.setupMessageListener = function(instance) {
    window.addEventListener('message', function(event) {
      // Validar origen
      if (event.origin !== WIDGET_BASE_URL && !event.origin.includes('localhost')) {
        return;
      }
      
      // Procesar mensajes del widget
      if (event.data.type === 'axtral-widget') {
        switch (event.data.action) {
          case 'resize':
            if (event.data.height) {
              instance.iframe.style.height = event.data.height + 'px';
            }
            break;
            
          case 'navigate':
            console.log('Widget navigation:', event.data.path);
            break;
            
          case 'user-registered':
            console.log('New user registered via widget:', event.data.userId);
            // Aquí puedes agregar lógica personalizada
            if (window.onAxtralUserRegistered) {
              window.onAxtralUserRegistered(event.data);
            }
            break;
            
          case 'user-login':
            console.log('User logged in via widget:', event.data.userId);
            if (window.onAxtralUserLogin) {
              window.onAxtralUserLogin(event.data);
            }
            break;
        }
      }
    });
  };
  
  /**
   * Remueve una instancia del widget
   */
  AxtralWidgetClass.prototype.destroy = function(instanceId) {
    const instance = this.instances[instanceId];
    if (instance) {
      instance.container.innerHTML = '';
      this.instances[instanceId] = null;
    }
  };
  
  /**
   * Envía un mensaje al widget
   */
  AxtralWidgetClass.prototype.sendMessage = function(instanceId, message) {
    const instance = this.instances[instanceId];
    if (instance && instance.iframe.contentWindow) {
      instance.iframe.contentWindow.postMessage({
        type: 'axtral-widget-command',
        ...message
      }, WIDGET_BASE_URL);
    }
  };
  
  // Exponer al objeto global
  window.AxtralWidget = new AxtralWidgetClass();
  
})(window);
