import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'mentor';
  avatar?: string;
  
  // Stripe
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'canceling';
  subscriptionTier?: 'free' | 'basic' | 'pro' | 'premium';
  
  // PayPal
  paypalSubscriptionId?: string;
  
  // Security fields
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  passwordChangedAt?: Date;
  loginAttempts: number;
  lockoutUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIP?: string;
  
  // 2FA
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  
  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  
  enrolledCourses: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(enteredPassword: string): Promise<boolean>;
  matchPassword(enteredPassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Por favor ingresa tu nombre'],
      trim: true,
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Por favor ingresa tu email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingresa un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Por favor ingresa una contraseña'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'mentor'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
    // Stripe
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'canceling'],
      default: 'inactive',
    },
    subscriptionTier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'premium'],
      default: 'free',
    },
    // PayPal
    paypalSubscriptionId: String,
    
    // Security fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    passwordChangedAt: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: Date,
    lastLoginAt: Date,
    lastLoginIP: String,
    
    // 2FA
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    
    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    enrolledCourses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  // Update passwordChangedAt
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000); // 1 segundo atrás para asegurar que el token sea válido
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Alias for backwards compatibility
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await this.comparePassword(enteredPassword);
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
  const lockoutDuration = parseInt(process.env.ACCOUNT_LOCKOUT_DURATION || '1800000'); // 30 minutos por defecto

  // Si ya está bloqueado y el tiempo expiró, resetear
  if (this.lockoutUntil && this.lockoutUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockoutUntil: 1 },
    });
    return;
  }

  // Incrementar intentos
  const updates: any = { $inc: { loginAttempts: 1 } };

  // Si alcanza el máximo, bloquear cuenta
  if (this.loginAttempts + 1 >= maxAttempts && !this.lockoutUntil) {
    updates.$set = { lockoutUntil: new Date(Date.now() + lockoutDuration) };
  }

  await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockoutUntil: 1 },
  });
};

export default mongoose.model<IUser>('User', userSchema);
