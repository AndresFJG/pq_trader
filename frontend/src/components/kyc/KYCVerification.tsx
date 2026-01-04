'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle2, AlertCircle, Shield, FileText } from 'lucide-react';

interface KYCFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  idType: 'passport' | 'dni' | 'license';
  idNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface KYCStatus {
  status: 'pending' | 'verified' | 'rejected' | 'not_started';
  message?: string;
  verifiedAt?: Date;
}

export function KYCVerification() {
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    idType: 'passport',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [documents, setDocuments] = useState<{
    idFront?: File;
    idBack?: File;
    proofOfAddress?: File;
    selfie?: File;
  }>({});

  const [kycStatus, setKycStatus] = useState<KYCStatus>({
    status: 'not_started',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof KYCFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (field: string, file: File | undefined) => {
    setDocuments({ ...documents, [field]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (en producción, enviar a backend)
    setTimeout(() => {
      setKycStatus({
        status: 'pending',
        message: 'Tu documentación está siendo revisada. Te notificaremos en 24-48 horas.',
      });
      setIsSubmitting(false);
    }, 2000);
  };

  if (kycStatus.status === 'verified') {
    return (
      <Card className="border-2 border-profit">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-profit mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Identidad Verificada</h3>
          <p className="text-muted-foreground mb-4">
            Tu cuenta ha sido verificada exitosamente
          </p>
          <p className="text-sm text-muted-foreground">
            Verificado el {kycStatus.verifiedAt?.toLocaleDateString('es-ES')}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (kycStatus.status === 'pending') {
    return (
      <Card className="border-2 border-yellow-500/40">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Verificación en Proceso</h3>
          <p className="text-muted-foreground">
            {kycStatus.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-border">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-profit" />
          <div>
            <h2 className="text-2xl font-bold">Verificación de Identidad (KYC)</h2>
            <p className="text-sm text-muted-foreground">
              Requerido para acceder a funciones avanzadas y cumplir con regulaciones
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Apellidos</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Nacionalidad</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
            </div>
          </div>

          {/* ID Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Documento de Identidad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Documento</label>
                <select
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                >
                  <option value="passport">Pasaporte</option>
                  <option value="dni">DNI/Cédula</option>
                  <option value="license">Licencia de Conducir</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Número de Documento</label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dirección</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Dirección Completa</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Código Postal</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2 bg-surface/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-profit/40"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Documentos Requeridos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadCard
                title="Documento (Frontal)"
                description="Foto clara del frente de tu documento"
                file={documents.idFront}
                onFileSelect={(file) => handleFileUpload('idFront', file)}
              />
              <FileUploadCard
                title="Documento (Reverso)"
                description="Foto clara del reverso de tu documento"
                file={documents.idBack}
                onFileSelect={(file) => handleFileUpload('idBack', file)}
              />
              <FileUploadCard
                title="Comprobante de Domicilio"
                description="Recibo de servicios (máx. 3 meses)"
                file={documents.proofOfAddress}
                onFileSelect={(file) => handleFileUpload('proofOfAddress', file)}
              />
              <FileUploadCard
                title="Selfie con Documento"
                description="Foto tuya sosteniendo tu documento"
                file={documents.selfie}
                onFileSelect={(file) => handleFileUpload('selfie', file)}
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 bg-surface/30 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-profit flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold mb-1">Protección de Datos</p>
                <p className="text-xs text-muted-foreground">
                  Tus datos están protegidos con encriptación de grado bancario. Solo serán usados para 
                  verificación de identidad según regulaciones KYC/AML. Nunca compartiremos tu información 
                  con terceros sin tu consentimiento.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="profit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Verificación'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FileUploadCard({
  title,
  description,
  file,
  onFileSelect,
}: {
  title: string;
  description: string;
  file?: File;
  onFileSelect: (file: File | undefined) => void;
}) {
  return (
    <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-profit/40 transition-colors">
      <div className="text-center">
        {file ? (
          <>
            <CheckCircle2 className="h-8 w-8 text-profit mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">{file.name}</p>
            <p className="text-xs text-muted-foreground mb-2">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileSelect(undefined)}
            >
              Cambiar
            </Button>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">{title}</p>
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => onFileSelect(e.target.files?.[0])}
              />
              <span className="text-sm text-profit hover:underline">
                Seleccionar archivo
              </span>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
