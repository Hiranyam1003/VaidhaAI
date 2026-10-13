import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useT } from '../i18n';

interface DocumentLibraryProps {
  onAskDoc: (docName: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ onAskDoc }) => {
  const t = useT();
  const documentsList = [
    {
      title: 'Tahsildar Income Certificate',
      authority: 'Revenue Department / Sub-Divisional Officer',
      validity: 'Valid for current financial year',
      requiredFor: 'EBC Scholarship, PMAY, Ration cards, Education fee-waivers',
      prerequisites: 'Ration card, Electricity bill, Patwari/Talathi verification report',
    },
    {
      title: 'State Domicile Certificate',
      authority: 'District Magistrate / Tahsildar',
      validity: 'Life-time validity (unless challenged)',
      requiredFor: 'State engineering CAP quota, State scholarships (MahaDBT)',
      prerequisites: 'Continuous 15-year residence proof, School Leaving Certificate',
    },
    {
      title: 'Aadhaar NPCI Bank Seeding (DBT Active)',
      authority: 'National Payments Corporation of India (NPCI) / Bank',
      validity: 'Active until changed',
      requiredFor: 'PM-KISAN, Namo Shetkari, Student scholarships, Housing subsidies',
      prerequisites: 'Aadhaar consent mandate submitted to bank branch or online IPPB',
    },
    {
      title: 'Non-Creamy Layer Certificate (NCL)',
      authority: 'Competent Revenue Officer / SDO',
      validity: '3 years or current financial year based on state rules',
      requiredFor: 'OBC/SBC/VJNT reservation benefits in educational admissions & schemes',
      prerequisites: 'Father’s 3 years income proof, Caste Certificate',
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        padding: '32px 24px 60px 24px',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
      }}
      className="fade-in"
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>
          {t('Official Document Library')}
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--workspace-text-muted)' }}>
          {t('Detailed guidance, issuing authorities, and prerequisites for key Indian documentation.')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {documentsList.map((doc, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--workspace-border)',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>
                  {t(doc.title)}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--workspace-text-subtle)' }}>
                  {t('Issuing Authority:')} {t(doc.authority)}
                </span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'var(--brand-sun-light)',
                  color: 'var(--brand-sun)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {t(doc.validity)}
              </span>
            </div>

            <div style={{ margin: '12px 0', fontSize: '13px', lineHeight: '1.5', color: 'var(--workspace-text-main)' }}>
              <p style={{ marginBottom: '4px' }}>
                <strong>{t('Commonly Required For:')}</strong> {t(doc.requiredFor)}
              </p>
              <p style={{ color: 'var(--workspace-text-muted)' }}>
                <strong>{t('Prerequisites:')}</strong> {t(doc.prerequisites)}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #f2eee8', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onAskDoc(t('What is the step-by-step process and timeline to obtain a {doc}?', { doc: t(doc.title) }))}
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--brand-sun)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {t('Ask Vaidha about process')} <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
