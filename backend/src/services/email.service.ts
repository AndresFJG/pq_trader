import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`Email sent to ${options.to}`);
    } catch (error: any) {
      console.error('Error sending email:', error.message);
      throw new Error('Error al enviar el email');
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: '¡Bienvenido a PQ Trader!',
      html: `
        <h1>¡Hola ${name}!</h1>
        <p>Gracias por unirte a PQ Trader.</p>
        <p>Estamos emocionados de ayudarte en tu camino hacia el trading algorítmico.</p>
        <p>Comienza explorando nuestros cursos y mentorías.</p>
        <br>
        <p>Saludos,<br>El equipo de PQ Trader</p>
      `,
    });
  }

  /**
   * Send course enrollment confirmation
   */
  async sendEnrollmentEmail(
    name: string,
    email: string,
    courseTitle: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `Te has inscrito en: ${courseTitle}`,
      html: `
        <h1>¡Felicidades ${name}!</h1>
        <p>Te has inscrito exitosamente en el curso: <strong>${courseTitle}</strong></p>
        <p>Ya puedes comenzar a aprender. Accede a tu dashboard para empezar.</p>
        <br>
        <p>¡Buena suerte en tu aprendizaje!</p>
        <p>El equipo de PQ Trader</p>
      `,
    });
  }

  /**
   * Send subscription confirmation
   */
  async sendSubscriptionEmail(
    name: string,
    email: string,
    plan: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Suscripción Confirmada',
      html: `
        <h1>¡Gracias ${name}!</h1>
        <p>Tu suscripción al plan <strong>${plan}</strong> ha sido confirmada.</p>
        <p>Ahora tienes acceso completo a todos nuestros cursos y recursos.</p>
        <br>
        <p>El equipo de PQ Trader</p>
      `,
    });
  }

  /**
   * Send mentorship booking confirmation
   */
  async sendBookingEmail(
    name: string,
    email: string,
    mentorshipTitle: string,
    date: Date
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: 'Mentoría Confirmada',
      html: `
        <h1>¡Hola ${name}!</h1>
        <p>Tu mentoría <strong>${mentorshipTitle}</strong> ha sido confirmada.</p>
        <p>Fecha y hora: ${date.toLocaleString('es-ES')}</p>
        <p>Recibirás el enlace de la sesión por email antes de la hora programada.</p>
        <br>
        <p>Nos vemos pronto,<br>El equipo de PQ Trader</p>
      `,
    });
  }
}

export default new EmailService();
