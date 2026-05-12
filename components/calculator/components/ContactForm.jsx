import { Briefcase, Building2, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'inbox.com',
  'me.com',
  'msn.com',
];

export const ContactForm = ({ totalCost, configurationProgress, totalQuestions }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    designation: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    company: '',
    designation: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [configError, setConfigError] = useState('');

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    const domain = email.split('@')[1]?.toLowerCase();
    if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
      return 'Please use a business email address';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      company: formData.company.trim() ? '' : 'Company is required',
      designation: formData.designation.trim() ? '' : 'Designation is required',
      email: validateEmail(formData.email),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (configurationProgress < totalQuestions) {
      setConfigError(`Please answer all questions (${configurationProgress}/${totalQuestions} completed)`);
      return;
    }

    setConfigError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', {
        ...formData,
        estimatedCost: totalCost,
      });
      setShowSuccessModal(true);
      setFormData({
        name: '',
        company: '',
        designation: '',
        email: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    window.close();
  };

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showSuccessModal]);

  return (
    <>
      {showSuccessModal && (
        <div className="!fixed !inset-0 !z-50 !flex !items-center !justify-center !p-4 !bg-black !bg-opacity-50">
          <div className="!bg-white !rounded-xl md:!rounded-2xl !shadow-2xl !max-w-md !w-full !p-6 md:!p-8 !transform !transition-all">
            <div className="!text-center">
              <div className="!mx-auto !flex !items-center !justify-center !h-14 !w-14 md:!h-16 md:!w-16 !rounded-full !bg-green-100 !mb-3 md:!mb-4">
                <svg className="!h-7 !w-7 md:!h-8 md:!w-8 !text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="!text-lg md:!text-xl !font-bold !text-slate-900 !mb-2 md:!mb-3">Success!</h3>
              <p className="!text-sm md:!text-base !text-slate-600 !mb-5 md:!mb-6">
                Your estimated investments have been emailed to the given email address
              </p>
              <button
                onClick={handleCloseModal}
                className="!w-full !px-6 !py-3 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 active:!scale-95 !text-white !font-semibold !rounded-lg !transition-all !shadow-md hover:!shadow-lg !min-h-[44px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="!bg-gradient-to-br !from-slate-50 !to-blue-50 !rounded-xl !shadow-md !border !border-slate-200 !p-4 md:!p-5">
        <div className="!mb-4">
          <h2 className="!text-base md:!text-[18px] !font-bold !text-slate-900 !mb-1">Get Your Detailed Estimate</h2>
          <p className="!text-[12px] md:!text-[14px] !text-slate-600 !leading-tight">
            Submit your information to receive a comprehensive migration estimate tailored to your requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="!space-y-3 md:!space-y-4">
          <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-3 md:!gap-4">
            <div>
              <label htmlFor="name" className="!block !text-[12px] !font-semibold !text-slate-700 !mb-1.5">
                <div className="!flex !items-center !gap-1.5"><User className="!w-3.5 !h-3.5" />Name *</div>
              </label>
              <input type="text" id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={`!w-full !px-3 !py-2.5 !text-[14px] !rounded-lg !border ${errors.name ? '!border-red-500 focus:!ring-red-500' : '!border-slate-300 focus:!ring-blue-500'} focus:!ring-2 focus:!outline-none !transition-all !min-h-[50px]`} placeholder="John Doe" />
              {errors.name && <p className="!mt-1 !text-[12px] !text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="company" className="!block !text-[12px] !font-semibold !text-slate-700 !mb-1.5">
                <div className="!flex !items-center !gap-1.5"><Building2 className="!w-3.5 !h-3.5" />Company *</div>
              </label>
              <input type="text" id="company" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} className={`!w-full !px-3 !py-2.5 !text-[14px] !rounded-lg !border ${errors.company ? '!border-red-500 focus:!ring-red-500' : '!border-slate-300 focus:!ring-blue-500'} focus:!ring-2 focus:!outline-none !transition-all !min-h-[50px]`} placeholder="Acme Corporation" />
              {errors.company && <p className="!mt-1 !text-[12px] !text-red-600">{errors.company}</p>}
            </div>

            <div>
              <label htmlFor="designation" className="!block !text-[12px] !font-semibold !text-slate-700 !mb-1.5">
                <div className="!flex !items-center !gap-1.5"><Briefcase className="!w-3.5 !h-3.5" />Designation *</div>
              </label>
              <input type="text" id="designation" value={formData.designation} onChange={(e) => handleChange('designation', e.target.value)} className={`!w-full !px-3 !py-2.5 !text-[14px] !rounded-lg !border ${errors.designation ? '!border-red-500 focus:!ring-red-500' : '!border-slate-300 focus:!ring-blue-500'} focus:!ring-2 focus:!outline-none !transition-all !min-h-[50px]`} placeholder="IT Manager" />
              {errors.designation && <p className="!mt-1 !text-[12px] !text-red-600">{errors.designation}</p>}
            </div>

            <div>
              <label htmlFor="email" className="!block !text-[12px] !font-semibold !text-slate-700 !mb-1.5">
                <div className="!flex !items-center !gap-1.5"><Mail className="!w-3.5 !h-3.5" />Business Email *</div>
              </label>
              <input type="email" id="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className={`!w-full !px-3 !py-2.5 !text-[14px] !rounded-lg !border ${errors.email ? '!border-red-500 focus:!ring-red-500' : '!border-slate-300 focus:!ring-blue-500'} focus:!ring-2 focus:!outline-none !transition-all !min-h-[50px]`} placeholder="john.doe@company.com" />
              {errors.email && <p className="!mt-1 !text-[12px] !text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="!flex !flex-col sm:!flex-row sm:!items-center sm:!justify-between !gap-3 !pt-3 !border-t !border-slate-200">
            {configError && <p className="!text-[12px] !text-red-600 !font-medium">{configError}</p>}
            {!configError && <div className="!hidden sm:!block" />}
            <button type="submit" disabled={isSubmitting} className={`btn  btn-btn !w-full sm:!w-auto !px-6 !py-2.5 !text-[14px] !rounded-lg !font-semibold !text-white !transition-all !min-h-[50px] ${isSubmitting ? '!bg-slate-400 !cursor-not-allowed' : 'btn btn-btn hover:!from-blue-700 hover:!to-blue-800 active:!scale-95 !shadow-md hover:!shadow-lg'}`}>
              {isSubmitting ? 'Submitting...' : 'Get Estimate'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
