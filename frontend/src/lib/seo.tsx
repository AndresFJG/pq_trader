// SEO utility functions for PQ Trader

interface Product {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

interface Organization {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    email: string;
    availableLanguage: string[];
  };
}

interface BreadcrumbList {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export function generateOrganizationSchema(): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PQ Trader',
    url: 'https://pqtrader.com',
    logo: 'https://pqtrader.com/logo.png',
    sameAs: [
      'https://twitter.com/pqtrader',
      'https://linkedin.com/company/pqtrader',
      'https://instagram.com/pqtrader',
      'https://youtube.com/@pqtrader',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34-XXX-XXX-XXX',
      contactType: 'customer service',
      email: 'info@pqtrader.com',
      availableLanguage: ['es', 'en'],
    },
  };
}

export function generateProductSchema(
  name: string,
  description: string,
  price: number,
  url: string,
  rating?: { value: number; count: number }
): Product {
  const product: Product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  if (rating) {
    product.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toString(),
      reviewCount: rating.count.toString(),
    };
  }

  return product;
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbList {
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

export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: string;
  price: number;
  duration: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
      url: 'https://pqtrader.com',
    },
    offers: {
      '@type': 'Offer',
      price: course.price.toString(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: course.url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      duration: course.duration,
    },
  };
}

export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
