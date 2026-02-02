import { Organization, WithContext, Course, FAQPage, BreadcrumbList } from 'schema-dts';

export function getOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PQ Trader',
    url: 'https://pqtraders.com',
    logo: 'https://pqtraders.com/icon.svg',
    description: 'Cursos y Mentorías de Trading Algorítmico. Aprende trading cuantitativo con expertos.',
    sameAs: [
      'https://twitter.com/pqtrader',
      'https://www.linkedin.com/company/pqtrader',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hola@pqtraders.com',
      contactType: 'Customer Service',
      availableLanguage: ['Spanish', 'English'],
    },
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ES',
    },
  };
}

export function getCourseSchema(course: {
  name: string;
  description: string;
  price: number;
  image?: string;
  instructor?: string;
}): WithContext<Course> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: 'PQ Trader',
      url: 'https://pqtraders.com',
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    ...(course.image && { image: course.image }),
    ...(course.instructor && {
      instructor: {
        '@type': 'Person',
        name: course.instructor,
      },
    }),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
