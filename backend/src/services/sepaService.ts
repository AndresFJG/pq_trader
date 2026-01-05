// SEPA Transfer Service (Europe)

export class SEPAService {
  async createPayment(data: {
    amount: number;
    currency: string;
    iban?: string;
    name?: string;
    description: string;
  }) {
    console.log('[SEPA] Creating payment:', data);

    // En producción, usar Stripe SEPA Direct Debit o GoCardless
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: data.amount * 100,
    //   currency: data.currency.toLowerCase(),
    //   payment_method_types: ['sepa_debit'],
    //   payment_method_data: {
    //     sepa_debit: { iban: data.iban },
    //   },
    // });

    return {
      id: `sepa_${Date.now()}`,
      status: 'pending',
      bankDetails: {
        accountHolder: 'PQ Trader Ltd.',
        iban: 'ES1234567890123456789012',
        bic: 'XXXXXESXXXX',
        reference: `REF${Date.now()}`,
      },
      instructions: 'Por favor realiza la transferencia SEPA usando los detalles proporcionados.',
      processingTime: '1-3 días hábiles',
    };
  }

  async getPaymentStatus(paymentId: string) {
    console.log('[SEPA] Getting payment status:', paymentId);

    return {
      status: 'pending',
      amount: 0,
      currency: 'EUR',
    };
  }
}
