export const getMentors = (language: string) => [
  {
    id: '1',
    name: 'Carlos Martínez',
    title: language === 'es' ? 'Fundador & CEO' : 'Founder & CEO',
    subtitle: language === 'es' ? 'Especialista en Trading Algorítmico' : 'Algorithmic Trading Specialist',
    bio: language === 'es' 
      ? 'Más de 12 años de experiencia en mercados financieros. Ex-trader en Goldman Sachs y fundador de PQ Trader. Profesor de Trading Cuantitativo en la Universidad Tecnológica. Ha desarrollado más de 500 estrategias algorítmicas verificadas.'
      : 'Over 12 years of experience in financial markets. Ex-trader at Goldman Sachs and founder of PQ Trader. Professor of Quantitative Trading at the Technological University. Has developed over 500 verified algorithmic strategies.',
    quote: language === 'es' 
      ? 'El éxito en trading algorítmico está en los datos, no en las emociones.'
      : 'Success in algorithmic trading is in the data, not in emotions.',
    specialties: language === 'es' ? [
      'Trading en General',
      'Python para Trading',
      'MetaTrader 4/5',
      'MQL5',
      'Performance y Darwinex'
    ] : [
      'General Trading',
      'Python for Trading',
      'MetaTrader 4/5',
      'MQL5',
      'Performance & Darwinex'
    ],
    experience: language === 'es' ? '12+ años' : '12+ years',
    students: 2500,
    rating: 4.9,
    sessions: 450,
    price: 150,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    linkedin: 'https://linkedin.com',
    email: 'carlos@pqtrader.com',
    achievements: language === 'es' ? [
      'Ex-Quant Trader Goldman Sachs',
      'Profesor Universitario',
      '500+ estrategias desarrolladas',
      'Speaker internacional'
    ] : [
      'Ex-Quant Trader Goldman Sachs',
      'University Professor',
      '500+ strategies developed',
      'International Speaker'
    ]
  },
  {
    id: '2',
    name: 'Ana García',
    title: 'Head of Machine Learning',
    subtitle: language === 'es' ? 'Experta en IA aplicada al Trading' : 'AI Expert Applied to Trading',
    bio: language === 'es'
      ? 'PhD en Ciencias de la Computación con especialización en Machine Learning. 8 años desarrollando modelos predictivos para fondos hedge. Pionera en aplicación de Deep Learning a mercados financieros.'
      : 'PhD in Computer Science with specialization in Machine Learning. 8 years developing predictive models for hedge funds. Pioneer in applying Deep Learning to financial markets.',
    quote: language === 'es' 
      ? 'La IA no reemplaza al trader, lo potencia.'
      : 'AI doesn\'t replace the trader, it empowers them.',
    specialties: language === 'es' ? [
      'fxDreema Builder',
      'StrategyQuant X',
      'PineScript y TradingView',
      'Automatización Visual',
      'Optimización de Estrategias'
    ] : [
      'fxDreema Builder',
      'StrategyQuant X',
      'PineScript & TradingView',
      'Visual Automation',
      'Strategy Optimization'
    ],
    experience: language === 'es' ? '8+ años' : '8+ years',
    students: 1800,
    rating: 4.8,
    sessions: 320,
    price: 150,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    linkedin: 'https://linkedin.com',
    email: 'ana@pqtrader.com',
    achievements: language === 'es' ? [
      'PhD Computer Science',
      'Ex-Citadel Securities',
      '15+ papers publicados',
      'TensorFlow Contributor'
    ] : [
      'PhD Computer Science',
      'Ex-Citadel Securities',
      '15+ papers published',
      'TensorFlow Contributor'
    ]
  },
  {
    id: '3',
    name: 'Luis Rodríguez',
    title: language === 'es' ? 'Estratega de Riesgo' : 'Risk Strategist',
    subtitle: language === 'es' ? 'Especialista en Gestión de Cartera' : 'Portfolio Management Specialist',
    bio: language === 'es'
      ? 'Ex-Risk Manager de JP Morgan con especialización en derivados. 12+ años en gestión de riesgo en instituciones financieras de primer nivel. Certificado CFA Charterholder.'
      : 'Ex-Risk Manager at JP Morgan with derivatives specialization. 12+ years in risk management at top-tier financial institutions. CFA Charterholder.',
    quote: language === 'es'
      ? 'No importa cuán buena sea tu estrategia si no sabes gestionar el riesgo.'
      : 'No matter how good your strategy is if you don\'t know how to manage risk.',
    specialties: language === 'es' ? [
      'Gestión de Riesgo',
      'Portfolio Optimization',
      'Value at Risk (VaR)',
      'Derivados',
      'Compliance'
    ] : [
      'Risk Management',
      'Portfolio Optimization',
      'Value at Risk (VaR)',
      'Derivatives',
      'Compliance'
    ],
    experience: language === 'es' ? '12+ años' : '12+ years',
    students: 1200,
    rating: 4.9,
    sessions: 520,
    price: 70,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luis',
    linkedin: 'https://linkedin.com',
    email: 'luis@pqtrader.com',
    achievements: language === 'es' ? [
      'Ex-JP Morgan Risk Manager',
      'CFA Charterholder',
      '$500M+ gestionados',
      'Consultor FMI'
    ] : [
      'Ex-JP Morgan Risk Manager',
      'CFA Charterholder',
      '$500M+ managed',
      'IMF Consultant'
    ]
  },
  {
    id: '4',
    name: 'Laura Chen',
    title: language === 'es' ? 'Experta en HFT' : 'HFT Expert',
    subtitle: language === 'es' ? 'Especialista en Trading de Alta Frecuencia' : 'High-Frequency Trading Specialist',
    bio: language === 'es'
      ? 'FPGA Developer y especialista en HFT. Trabajó en Jane Street Capital optimizando latencia de microsegundos. Desarrolladora de sistemas de trading de ultra-baja latencia.'
      : 'FPGA Developer and HFT specialist. Worked at Jane Street Capital optimizing microsecond latency. Ultra-low latency trading systems developer.',
    quote: language === 'es'
      ? 'En HFT, cada microsegundo cuenta.'
      : 'In HFT, every microsecond counts.',
    specialties: language === 'es' ? [
      'High-Frequency Trading',
      'FPGA Development',
      'Optimización de Latencia',
      'Sistemas de Trading',
      'Market Microstructure'
    ] : [
      'High-Frequency Trading',
      'FPGA Development',
      'Latency Optimization',
      'Trading Systems',
      'Market Microstructure'
    ],
    experience: language === 'es' ? '10+ años' : '10+ years',
    students: 950,
    rating: 4.7,
    sessions: 380,
    price: 70,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    linkedin: 'https://linkedin.com',
    email: 'laura@pqtrader.com',
    achievements: language === 'es' ? [
      'Ex-Jane Street Capital',
      'FPGA Developer',
      'Latency < 100 nanosec',
      'Patent holder'
    ] : [
      'Ex-Jane Street Capital',
      'FPGA Developer',
      'Latency < 100 nanosec',
      'Patent holder'
    ]
  },
  {
    id: '5',
    name: 'David López',
    title: language === 'es' ? 'Experto en Crypto' : 'Crypto Expert',
    subtitle: language === 'es' ? 'Especialista en Trading de Criptomonedas' : 'Cryptocurrency Trading Specialist',
    bio: language === 'es'
      ? 'Market Maker en Binance y fundador de protocolo DeFi. Crypto enthusiast desde 2017 con experiencia en trading algorítmico de activos digitales. Auditor de Smart Contracts.'
      : 'Market Maker at Binance and DeFi Protocol founder. Crypto enthusiast since 2017 with experience in algorithmic trading of digital assets. Smart Contract Auditor.',
    quote: language === 'es'
      ? 'El futuro del trading es descentralizado.'
      : 'The future of trading is decentralized.',
    specialties: language === 'es' ? [
      'Crypto Trading',
      'DeFi Protocols',
      'Smart Contracts',
      'Market Making',
      'Arbitrage'
    ] : [
      'Crypto Trading',
      'DeFi Protocols',
      'Smart Contracts',
      'Market Making',
      'Arbitrage'
    ],
    experience: language === 'es' ? '7+ años' : '7+ years',
    students: 1500,
    rating: 4.8,
    sessions: 380,
    price: 190,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan',
    linkedin: 'https://linkedin.com',
    email: 'david@pqtrader.com',
    achievements: language === 'es' ? [
      'Market Maker Binance',
      'DeFi Protocol Founder',
      'Smart Contract Auditor',
      'Crypto OG since 2017'
    ] : [
      'Market Maker Binance',
      'DeFi Protocol Founder',
      'Smart Contract Auditor',
      'Crypto OG since 2017'
    ]
  }
];

export const getMentorById = (id: string, language: string) => {
  const mentors = getMentors(language);
  return mentors.find(m => m.id === id);
};
