-- CreateTable
CREATE TABLE "Login" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "ssn" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "consultDate" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "saturation" DOUBLE PRECISION NOT NULL,
    "glycemia" DOUBLE PRECISION NOT NULL,
    "anamnesis" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "icdCode" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostConsultation" (
    "id" TEXT NOT NULL,
    "hoursDeclaration" BOOLEAN NOT NULL,
    "prescription" BOOLEAN NOT NULL,
    "medicalCertificate" BOOLEAN NOT NULL,
    "referral" BOOLEAN NOT NULL,
    "medicalReport" BOOLEAN NOT NULL,
    "consultationId" TEXT NOT NULL,

    CONSTRAINT "PostConsultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationHistory" (
    "id" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "medicalRecord" TEXT NOT NULL,
    "consultationId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "ConsultationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Login_doctorId_key" ON "Login"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseId_key" ON "Doctor"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_ssn_key" ON "Patient"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "PostConsultation_consultationId_key" ON "PostConsultation"("consultationId");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostConsultation" ADD CONSTRAINT "PostConsultation_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationHistory" ADD CONSTRAINT "ConsultationHistory_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationHistory" ADD CONSTRAINT "ConsultationHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
