import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FloatingTriangles } from '@/components/FloatingTriangles';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const WEBHOOK_URL = import.meta.env.VITE_DISCORD_SPONSOR_WEBHOOK as
  | string
  | undefined;

type SponsorshipType =
  | 'Financial'
  | 'In-kind (products/services)'
  | 'Media / Promotion'
  | 'Other';

type FormState = {
  fullName: string;
  phoneNumber: string;
  companyName: string;
  companyRole: string;
  companyIndustry: string;
  supportType: string;
  preferredSponsorshipType: SponsorshipType | '';
  preferredSponsorshipOther: string;
  expectedReturn: string;
  companyWebsite: string;
  socialMediaLinks: string;
  sponsoredBefore: string;
};

type FieldConfig = {
  id: keyof FormState;
  label: string;
  type: 'text' | 'tel' | 'textarea';
  placeholder?: string;
  required?: boolean;
};

const baseFields: FieldConfig[] = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+40 7XX XXX XXX',
    required: true,
  },
  {
    id: 'companyName',
    label: 'Company Name',
    type: 'text',
    placeholder: 'Your company name',
    required: true,
  },
  {
    id: 'companyRole',
    label: 'Position / Role Within the Company',
    type: 'text',
    placeholder: 'Your role',
    required: true,
  },
  {
    id: 'companyIndustry',
    label: 'Company Industry / Domain',
    type: 'text',
    placeholder: 'Industry or domain',
    required: true,
  },
  {
    id: 'supportType',
    label: 'Type of Support Your Company Can Provide',
    type: 'textarea',
    placeholder: 'Describe the type of support',
    required: true,
  },
  {
    id: 'expectedReturn',
    label: 'What Does Your Company Expect in Return?',
    type: 'textarea',
    placeholder: 'Describe expectations',
    required: true,
  },
  {
    id: 'companyWebsite',
    label: 'Company Website',
    type: 'text',
    placeholder: 'https://',
    required: true,
  },
  {
    id: 'socialMediaLinks',
    label: 'Social Media Links',
    type: 'textarea',
    placeholder: 'LinkedIn, Instagram, Tiktok, etc.',
    required: true,
  },
  {
    id: 'sponsoredBefore',
    label: 'Has Your Company Sponsored Events Before?',
    type: 'textarea',
    placeholder: 'Share any past sponsorships',
    required: true,
  },
];

const sponsorshipTypes: SponsorshipType[] = [
  'Financial',
  'In-kind (products/services)',
  'Media / Promotion',
  'Other',
];

const initialFormState: FormState = {
  fullName: '',
  phoneNumber: '',
  companyName: '',
  companyRole: '',
  companyIndustry: '',
  supportType: '',
  preferredSponsorshipType: '',
  preferredSponsorshipOther: '',
  expectedReturn: '',
  companyWebsite: '',
  socialMediaLinks: '',
  sponsoredBefore: '',
};

export const BecomeSponsorPage: React.FC = () => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const isOtherSelected = formData.preferredSponsorshipType === 'Other';

  const embedFields = useMemo(
    () => [
      ...baseFields.map((field) => ({
        name: field.label,
        value: formData[field.id].trim() || '—',
        inline: false,
      })),
      {
        name: 'Preferred Sponsorship Type',
        value: formData.preferredSponsorshipType || '—',
        inline: false,
      },
      ...(isOtherSelected
        ? [
            {
              name: 'Preferred Sponsorship Type (Other)',
              value: formData.preferredSponsorshipOther.trim() || '—',
              inline: false,
            },
          ]
        : []),
    ],
    [formData, isOtherSelected]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSponsorshipTypeChange = (type: SponsorshipType) => {
    setFormData((prev) => ({
      ...prev,
      preferredSponsorshipType: type,
      preferredSponsorshipOther: type === 'Other' ? prev.preferredSponsorshipOther : '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.preferredSponsorshipType) {
      setIsError(true);
      setStatusMessage('Please select a preferred sponsorship type.');
      return;
    }

    if (isOtherSelected && !formData.preferredSponsorshipOther.trim()) {
      setIsError(true);
      setStatusMessage('Please describe your preferred sponsorship type.');
      return;
    }

    if (!WEBHOOK_URL) {
      setIsError(true);
      setStatusMessage(
        'Submission is not configured yet. Please set VITE_DISCORD_SPONSOR_WEBHOOK.'
      );
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setStatusMessage(null);

    const payload = {
      username: 'TEDx Sponsor Form',
      embeds: [
        {
          title: 'Become a Sponsor Submission',
          color: 0x7c3aed,
          fields: embedFields,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      setStatusMessage("Thanks! We'll be in touch soon.");
      setFormData(initialFormState);
    } catch (error) {
      setIsError(true);
      setStatusMessage('Something went wrong. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black section-padding pt-32">
      <FloatingTriangles density="medium" />

      <div className="container-custom relative z-10 w-full">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-white/80 hover:text-white transition-colors duration-300"
          >
            <span className="text-base leading-none">&lt;-</span>
            BACK
          </Link>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight"
          >
            Become a sponsor
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-text-secondary text-lg md:text-xl"
          >
            Tell us about your company and how you want to support the event.
          </motion.p>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 text-left"
          >
            {baseFields.slice(0, 6).map((field) => (
              <div
                key={field.id}
                className="rounded-2xl border border-white/10 bg-[#1f1430]/80 px-6 py-5"
              >
                <label
                  htmlFor={field.id}
                  className="text-base md:text-lg text-white"
                >
                  {field.label}
                  {field.required ? (
                    <span className="ml-2 text-sm text-purple-200/80">
                      *
                    </span>
                  ) : null}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={4}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                )}
              </div>
            ))}

            <div className="rounded-2xl border border-white/10 bg-[#1f1430]/80 px-6 py-5">
              <p className="text-base md:text-lg text-white">
                Preferred Sponsorship Type
                <span className="ml-2 text-sm text-purple-200/80">*</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {sponsorshipTypes.map((type) => {
                  const isSelected = formData.preferredSponsorshipType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleSponsorshipTypeChange(type)}
                      className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? 'border-purple-300 bg-purple-500/80 text-white'
                          : 'border-white/15 bg-black/30 text-white/80 hover:border-purple-300/70 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {isOtherSelected ? (
                <div className="mt-4">
                  <label
                    htmlFor="preferredSponsorshipOther"
                    className="text-sm text-white/80"
                  >
                    Please specify
                  </label>
                  <input
                    id="preferredSponsorshipOther"
                    name="preferredSponsorshipOther"
                    type="text"
                    value={formData.preferredSponsorshipOther}
                    onChange={handleChange}
                    placeholder="Describe the sponsorship type"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                </div>
              ) : null}
            </div>

            {baseFields.slice(6).map((field) => (
              <div
                key={field.id}
                className="rounded-2xl border border-white/10 bg-[#1f1430]/80 px-6 py-5"
              >
                <label
                  htmlFor={field.id}
                  className="text-base md:text-lg text-white"
                >
                  {field.label}
                  {field.required ? (
                    <span className="ml-2 text-sm text-purple-200/80">
                      *
                    </span>
                  ) : null}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={4}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    required={field.required}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                  />
                )}
              </div>
            ))}

            <div className="pt-2 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary shadow-lg shadow-purple-500/60 hover:shadow-purple-400/80 hover:scale-105 transition-transform ring-1 ring-purple-300/40 hover:ring-purple-200/80 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>

              {statusMessage ? (
                <p
                  className={`text-sm md:text-base ${
                    isError ? 'text-red-300' : 'text-purple-100/90'
                  }`}
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeSponsorPage;
