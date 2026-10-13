// Documents citizens can apply for online, with how to apply. English is the source;
// Hindi and Marathi text lives in src/data/documentTranslations.ts. Pictures are /assets/documents/<id>.jpg.

export type DocumentId =
  | 'aadhaar'
  | 'pan'
  | 'voter-id'
  | 'passport'
  | 'driving-licence'
  | 'abha'
  | 'birth-certificate'
  | 'death-certificate'
  | 'marriage-certificate'
  | 'income-certificate'
  | 'domicile-certificate'
  | 'caste-certificate'
  | 'ncl-certificate'
  | 'ews-certificate'
  | 'senior-citizen-certificate'
  | 'ration-card'
  | 'ayushman-card'
  | 'eshram-card'
  | 'udid-card'
  | 'vehicle-rc'
  | 'police-clearance'
  | 'satbara'
  | 'property-card'
  | 'udyam'
  | 'gst'
  | 'fssai'
  | 'digilocker';

export type DocumentCategory =
  | 'identity'
  | 'civil'
  | 'certificates'
  | 'welfare'
  | 'transport'
  | 'land'
  | 'business'
  | 'education';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'identity',
  'civil',
  'certificates',
  'welfare',
  'transport',
  'land',
  'business',
  'education',
];

export interface DocumentText {
  name: string;
  summary: string;
  issuedBy: string;
  portalName: string;
  whoCanApply: string;
  papers: string[];
  steps: string[];
  tip: string;
}

export interface DocumentGuide extends DocumentText {
  id: DocumentId;
  category: DocumentCategory;
  portalUrl: string;
}

const AAPLE_SARKAR = 'https://aaplesarkar.mahaonline.gov.in';
const PASSPORT_SEVA = 'https://www.passportindia.gov.in';
const CIVIL_REGISTRATION = 'https://crsorgi.gov.in';

export const DOCUMENTS: DocumentGuide[] = [
  {
    id: 'aadhaar',
    category: 'identity',
    portalUrl: 'https://myaadhaar.uidai.gov.in',
    name: 'Aadhaar card',
    summary: 'Your 12-digit identity number, used for almost every government service.',
    issuedBy: 'Unique Identification Authority of India (UIDAI)',
    portalName: 'myAadhaar',
    whoCanApply: 'Any resident of India, including children. A new Aadhaar needs a visit to an Aadhaar centre; many updates can be done fully online.',
    papers: [
      'Proof of identity (for example PAN, passport or voter ID)',
      'Proof of address (for example electricity bill, bank passbook or ration card)',
      'Proof of date of birth for a new Aadhaar (for example birth certificate)',
      'Mobile number linked to Aadhaar for online updates',
    ],
    steps: [
      'Open myAadhaar. For a new Aadhaar choose "Book an Appointment"; to update details, log in with your Aadhaar number and OTP.',
      'For a new Aadhaar or a photo/fingerprint update, pick a nearby Aadhaar Seva Kendra and a time slot.',
      'For an online address or document update, upload a clear scan of your proof and pay the fee shown.',
      'Save the Update Request Number (URN) or appointment slip to track your request.',
      'When it is ready, download your e-Aadhaar from the same portal.',
    ],
    tip: 'Keep your mobile number linked to Aadhaar. Most online services send an OTP to it.',
  },
  {
    id: 'pan',
    category: 'identity',
    portalUrl: 'https://www.incometax.gov.in/iec/foportal/',
    name: 'PAN card',
    summary: 'Permanent Account Number, needed for tax, bank accounts and large purchases.',
    issuedBy: 'Income Tax Department',
    portalName: 'Income Tax e-Filing portal',
    whoCanApply: 'Anyone, including students. If you have Aadhaar, you can get an instant e-PAN free of cost.',
    papers: [
      'Aadhaar number with a linked mobile number (for instant e-PAN)',
      'For a printed card: proof of identity, address and date of birth',
      'Passport-size photo (for a printed card)',
    ],
    steps: [
      'On the Income Tax e-Filing portal, choose "Instant e-PAN".',
      'Enter your Aadhaar number and confirm with the OTP sent to your linked mobile.',
      'Check the details taken from Aadhaar and submit.',
      'Download your e-PAN as a PDF once it is ready, usually within minutes.',
      'To get a printed PAN card, apply through the Protean (NSDL) or UTIITSL PAN service linked from the portal.',
    ],
    tip: 'An e-PAN is accepted everywhere a PAN card is asked for.',
  },
  {
    id: 'voter-id',
    category: 'identity',
    portalUrl: 'https://voters.eci.gov.in',
    name: 'Voter ID card (EPIC)',
    summary: 'Lets you vote and is accepted as proof of identity and address.',
    issuedBy: 'Election Commission of India',
    portalName: "Voters' Service Portal",
    whoCanApply: 'Indian citizens aged 18 or above. You can apply in advance from age 17.',
    papers: [
      'Passport-size photo',
      'Proof of age (for example birth certificate, school certificate or Aadhaar)',
      'Proof of address',
    ],
    steps: [
      "Sign up on the Voters' Service Portal with your mobile number.",
      'Choose "New registration for general electors" (Form 6).',
      'Fill in your details and upload your photo and proofs.',
      'Submit and note the reference number. A Booth Level Officer may visit to verify.',
      'Once approved, download your e-EPIC or wait for the card by post.',
    ],
    tip: 'You can also apply and track your application on the Voter Helpline app.',
  },
  {
    id: 'passport',
    category: 'identity',
    portalUrl: PASSPORT_SEVA,
    name: 'Passport',
    summary: 'Needed for travel abroad and accepted as proof of identity and address.',
    issuedBy: 'Ministry of External Affairs',
    portalName: 'Passport Seva',
    whoCanApply: 'Indian citizens of any age.',
    papers: [
      'Proof of address (for example Aadhaar or electricity bill)',
      'Proof of date of birth (for example birth certificate or PAN)',
      'Old passport, if you are renewing',
    ],
    steps: [
      'Register on Passport Seva and log in.',
      'Fill in the form for a fresh passport or a re-issue.',
      'Pay the fee online and book an appointment at a Passport Seva Kendra.',
      'Visit the Kendra with your original documents for photo, fingerprints and checks.',
      'Complete police verification. Your passport is sent to you by post.',
    ],
    tip: 'Use the mPassport Seva app to track your application.',
  },
  {
    id: 'driving-licence',
    category: 'identity',
    portalUrl: 'https://sarathi.parivahan.gov.in',
    name: 'Driving licence',
    summary: "Licence to drive. You first get a learner's licence, then the permanent licence.",
    issuedBy: 'Regional Transport Office (RTO)',
    portalName: 'Sarathi (Parivahan)',
    whoCanApply: 'Usually 18 or older. At 16 you can apply for gearless two-wheelers up to 50cc, with a parent\'s consent.',
    papers: [
      'Aadhaar (needed for the online learner\'s test in many states)',
      'Proof of age and address',
      'Passport-size photo and signature',
      'Medical certificate (Form 1A) if you are 40 or older, or for a commercial licence',
    ],
    steps: [
      "On Sarathi, choose your state and apply for a learner's licence.",
      "Upload your documents, pay the fee and take the learner's test (online from home in many states, using Aadhaar).",
      "Practise for at least 30 days with your learner's licence.",
      'Apply for the driving licence on Sarathi and book a driving test at the RTO.',
      'Pass the test. The licence is posted to you and also appears in DigiLocker.',
    ],
    tip: 'Your driving licence in DigiLocker is valid if traffic police ask to see it.',
  },
  {
    id: 'abha',
    category: 'identity',
    portalUrl: 'https://abha.abdm.gov.in',
    name: 'ABHA health ID',
    summary: 'A free 14-digit health ID that keeps your health records in one place.',
    issuedBy: 'National Health Authority (Ayushman Bharat Digital Mission)',
    portalName: 'ABHA',
    whoCanApply: 'Anyone in India.',
    papers: ['Aadhaar with a linked mobile number, or a driving licence', 'Mobile number'],
    steps: [
      'Open the ABHA website and choose "Create ABHA Number".',
      'Choose Aadhaar (or driving licence) and enter the number.',
      'Verify with the OTP sent to your mobile.',
      'Pick an easy ABHA address, like yourname@abdm.',
      'Download your ABHA card.',
    ],
    tip: 'Show your ABHA at hospitals to share past reports without carrying files.',
  },
  {
    id: 'birth-certificate',
    category: 'civil',
    portalUrl: CIVIL_REGISTRATION,
    name: 'Birth certificate',
    summary: 'Official record of a birth, needed for school admission, Aadhaar and passport.',
    issuedBy: 'Local registrar (municipal corporation, nagar panchayat or gram panchayat)',
    portalName: 'Civil Registration System',
    whoCanApply: 'Parents or relatives. A birth should be registered within 21 days.',
    papers: [
      'Hospital birth report or discharge summary',
      "Parents' ID proof (for example Aadhaar)",
      'Proof of address',
      'Affidavit for late registration, if more than a year has passed',
    ],
    steps: [
      'If the baby was born in a hospital, the hospital usually registers the birth. Ask them first.',
      'Otherwise, sign up on the Civil Registration System portal or your municipal corporation website.',
      'Fill in the birth details and upload the papers.',
      'Submit and note the application number.',
      'Download the digitally signed certificate once the registrar approves it.',
    ],
    tip: 'Registering within 21 days is free in most places.',
  },
  {
    id: 'death-certificate',
    category: 'civil',
    portalUrl: CIVIL_REGISTRATION,
    name: 'Death certificate',
    summary: 'Official record of a death, needed for pensions, insurance and property transfer.',
    issuedBy: 'Local registrar (municipal corporation, nagar panchayat or gram panchayat)',
    portalName: 'Civil Registration System',
    whoCanApply: 'A family member or relative. A death should be registered within 21 days.',
    papers: [
      "Hospital or doctor's certificate of the cause of death",
      'ID proof of the person who died and of the applicant',
      'Proof of address',
      'Cremation or burial receipt, if available',
    ],
    steps: [
      'If the death happened in a hospital, the hospital usually reports it. Ask them first.',
      'Otherwise, sign up on the Civil Registration System portal or your municipal corporation website.',
      'Fill in the details and upload the papers.',
      'Submit and note the application number.',
      'Download the digitally signed certificate once the registrar approves it.',
    ],
    tip: 'Ask for several copies. Banks, insurers and pension offices each keep one.',
  },
  {
    id: 'marriage-certificate',
    category: 'civil',
    portalUrl: AAPLE_SARKAR,
    name: 'Marriage certificate',
    summary: 'Legal proof of marriage, needed for name changes, visas and joint benefits.',
    issuedBy: 'Marriage registrar of your local body',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'Married couples. Late registration is usually possible with an extra fee.',
    papers: [
      'ID and address proof of both partners',
      'Age proof of both partners',
      'Wedding invitation card and wedding photos',
      'ID proof of the witnesses',
    ],
    steps: [
      'Log in to Aaple Sarkar (or your municipal corporation website) and find marriage registration.',
      'Fill in the details of both partners and the witnesses.',
      'Upload the documents and pay the fee.',
      "Visit the registrar's office on the given date with both partners and the witnesses.",
      'Collect or download the marriage certificate.',
    ],
    tip: 'Carry the original documents when you visit the registrar.',
  },
  {
    id: 'income-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'Income certificate',
    summary: "Shows your family's yearly income. Needed for scholarships, fee waivers and welfare schemes.",
    issuedBy: 'Tahsildar (Revenue Department)',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'Residents of Maharashtra.',
    papers: [
      'Aadhaar card',
      'Ration card',
      "Proof of income (salary slip, Form 16, or the Talathi's report for farmers)",
      'Proof of address',
      'Self-declaration form',
    ],
    steps: [
      'Register on Aaple Sarkar and log in.',
      'Open Revenue Department services and choose "Income Certificate".',
      'Fill in your family income details and upload the documents.',
      'Pay the fee and submit. Note the application ID.',
      'Download the digitally signed certificate once it is approved.',
    ],
    tip: 'An income certificate is usually valid for one financial year, so apply again each year.',
  },
  {
    id: 'domicile-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'Domicile certificate',
    summary: 'Proves you live in Maharashtra. Needed for state college quotas, jobs and scholarships.',
    issuedBy: 'Tahsildar / Sub-Divisional Officer',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'People who have lived in Maharashtra for many years (usually at least 10).',
    papers: [
      'Proof of living in Maharashtra for the required years (school records, old bills, rent agreements)',
      'Birth certificate or School Leaving Certificate',
      'Aadhaar card',
      'Ration card',
    ],
    steps: [
      'Log in to Aaple Sarkar and choose "Age, Nationality and Domicile Certificate".',
      'Fill in where you have lived and for how long.',
      'Upload the proofs and pay the fee.',
      'Submit and note the application ID.',
      'Download the certificate once it is approved.',
    ],
    tip: 'Collect old school records early. They are often the hardest proof to find.',
  },
  {
    id: 'caste-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'Caste certificate',
    summary: 'Proves you belong to SC, ST, OBC, VJNT or SBC. Needed for reservation and scholarships.',
    issuedBy: 'Sub-Divisional Officer (SDO)',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'People from reserved categories.',
    papers: [
      "Proof of caste of your father or a blood relative (for example a School Leaving Certificate that shows caste)",
      'Proof of residence',
      'Aadhaar card',
      'Family tree affidavit',
    ],
    steps: [
      'Log in to Aaple Sarkar and choose "Caste Certificate".',
      'Fill in your family and caste details.',
      'Upload the proofs and pay the fee.',
      'Submit and track the application.',
      'Download the certificate once the SDO approves it.',
    ],
    tip: 'For jobs and higher education you may also need a caste validity certificate from the Caste Scrutiny Committee.',
  },
  {
    id: 'ncl-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'Non-creamy layer certificate',
    summary: 'Needed by OBC, VJNT and SBC applicants to claim reservation benefits.',
    issuedBy: 'Sub-Divisional Officer (SDO)',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'OBC, VJNT and SBC families whose income is below the creamy-layer limit.',
    papers: ['Caste certificate', 'Family income proof for the last 3 years', 'Aadhaar card', 'Ration card'],
    steps: [
      'Log in to Aaple Sarkar and choose "Non-Creamy Layer Certificate".',
      'Fill in your family income details for the last 3 years.',
      'Upload the documents and pay the fee.',
      'Submit and track the application.',
      'Download the certificate once it is approved.',
    ],
    tip: 'Check how long the certificate must be valid for your admission or job before applying.',
  },
  {
    id: 'ews-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'EWS certificate',
    summary: 'Economically Weaker Section certificate for the 10% EWS reservation.',
    issuedBy: 'Tahsildar / Sub-Divisional Officer',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'General-category families with income below ₹8 lakh a year who also meet the property limits.',
    papers: ['Income proof', 'Details of land and property owned', 'Aadhaar card', 'Proof of residence', 'Self-declaration form'],
    steps: [
      'Log in to Aaple Sarkar and choose "EWS Certificate".',
      'Fill in your family income and property details.',
      'Upload the documents and pay the fee.',
      'Submit and track the application.',
      'Download the certificate once it is approved.',
    ],
    tip: 'An EWS certificate is issued for one financial year at a time.',
  },
  {
    id: 'senior-citizen-certificate',
    category: 'certificates',
    portalUrl: AAPLE_SARKAR,
    name: 'Senior citizen certificate',
    summary: 'Proves you are 60 or older. Used for travel concessions and other benefits.',
    issuedBy: 'Tahsildar (Revenue Department)',
    portalName: 'Aaple Sarkar',
    whoCanApply: 'Residents of Maharashtra aged 60 and above.',
    papers: ['Age proof (for example birth certificate, School Leaving Certificate or Aadhaar)', 'Proof of address', 'Passport-size photo'],
    steps: [
      'Log in to Aaple Sarkar and choose "Senior Citizen Certificate".',
      'Fill in your details.',
      'Upload your age and address proof and your photo.',
      'Pay the fee and submit.',
      'Download the certificate once it is approved.',
    ],
    tip: 'A family member can apply on your behalf using their own Aaple Sarkar login.',
  },
  {
    id: 'ration-card',
    category: 'welfare',
    portalUrl: 'https://rcms.mahafood.gov.in',
    name: 'Ration card',
    summary: 'Gives subsidised food grains and is also used as proof of family address.',
    issuedBy: 'Food, Civil Supplies and Consumer Protection Department, Maharashtra',
    portalName: 'Maharashtra ration card portal',
    whoCanApply: 'Families living in Maharashtra. The type of card depends on family income.',
    papers: [
      'Aadhaar of every family member',
      'Proof of address',
      'Income proof',
      'Passport-size photo of the head of the family',
      'Surrender certificate, if you had a ration card elsewhere',
    ],
    steps: [
      'Open the ration card portal and register with your mobile number.',
      'Choose "New Ration Card" and fill in every family member\'s details.',
      'Upload the documents and submit.',
      'The rationing office checks your application and may visit.',
      'Collect your card from the rationing office, or download it if offered.',
    ],
    tip: 'With One Nation One Ration Card you can take your ration from any fair price shop in India.',
  },
  {
    id: 'ayushman-card',
    category: 'welfare',
    portalUrl: 'https://beneficiary.nha.gov.in',
    name: 'Ayushman card',
    summary: 'Card for free hospital treatment up to ₹5 lakh a year per family under PM-JAY.',
    issuedBy: 'National Health Authority (NHA)',
    portalName: 'Ayushman beneficiary portal',
    whoCanApply: 'Families on the PM-JAY list, and all citizens aged 70 and above.',
    papers: ['Aadhaar card', 'Ration card or PM-JAY letter', 'Mobile number'],
    steps: [
      'Log in to the beneficiary portal or the Ayushman app with your mobile number and OTP.',
      'Search for your name using your state, district and Aadhaar or ration card number.',
      'If your name is listed, complete Aadhaar e-KYC using an OTP or face authentication.',
      'Upload a photo if asked and submit.',
      'Download your Ayushman card once it is approved.',
    ],
    tip: "Can't find your name? Ask at a Common Service Centre or the Ayushman desk of an empanelled hospital.",
  },
  {
    id: 'eshram-card',
    category: 'welfare',
    portalUrl: 'https://eshram.gov.in',
    name: 'e-Shram card',
    summary: 'Free registration card for unorganised workers, giving access to social security schemes.',
    issuedBy: 'Ministry of Labour and Employment',
    portalName: 'e-Shram',
    whoCanApply: 'Unorganised workers aged 16 to 59 who do not pay income tax and are not members of EPFO or ESIC.',
    papers: ['Aadhaar with a linked mobile number', 'Bank account details', 'Details of your work and skills'],
    steps: [
      'Open e-Shram and choose "Register on e-Shram".',
      'Enter your Aadhaar-linked mobile number and verify with the OTP.',
      'Confirm your Aadhaar details with another OTP.',
      'Fill in your address, education, work and bank details.',
      'Submit and download your e-Shram card.',
    ],
    tip: 'Registration is free. Never pay anyone to make your e-Shram card.',
  },
  {
    id: 'udid-card',
    category: 'welfare',
    portalUrl: 'https://www.swavlambancard.gov.in',
    name: 'UDID disability card',
    summary: 'One card that proves your disability for benefits anywhere in India.',
    issuedBy: 'Department of Empowerment of Persons with Disabilities',
    portalName: 'Swavlamban Card portal',
    whoCanApply: 'Persons with disabilities.',
    papers: ['Passport-size photo', 'Aadhaar card', 'Proof of address', 'Existing disability certificate, if you have one'],
    steps: [
      'Open the Swavlamban Card portal and choose "Apply for Disability Certificate & UDID Card".',
      'Fill in your personal and disability details and upload your photo and proofs.',
      'Submit and note your enrolment number.',
      'Visit the hospital or medical board when called for an assessment.',
      'Once approved, your UDID card is sent by post and can be downloaded.',
    ],
    tip: 'If you already have a disability certificate, upload it to get your UDID card faster.',
  },
  {
    id: 'vehicle-rc',
    category: 'transport',
    portalUrl: 'https://parivahan.gov.in',
    name: 'Vehicle registration (RC)',
    summary: "Online services for your vehicle's registration certificate: transfer of owner, change of address, duplicate RC.",
    issuedBy: 'Regional Transport Office (RTO)',
    portalName: 'Parivahan Sewa',
    whoCanApply: 'Vehicle owners.',
    papers: [
      'Current RC',
      'Valid insurance',
      'Pollution Under Control (PUC) certificate',
      'ID and address proof',
      'Forms 29 and 30, for transfer of ownership',
    ],
    steps: [
      'On Parivahan Sewa, open "Vehicle Related Services" and choose your state and RTO.',
      'Enter your vehicle registration number and pick the service you need.',
      'Fill in the forms, upload the documents and pay the fee.',
      'Book an RTO visit if the service asks for one.',
      'Track your application. The new RC is posted to you and appears in DigiLocker.',
    ],
    tip: 'New vehicles are usually registered by the dealer when you buy them.',
  },
  {
    id: 'police-clearance',
    category: 'transport',
    portalUrl: PASSPORT_SEVA,
    name: 'Police Clearance Certificate',
    summary: 'Confirms you have no criminal record. Needed for jobs, studies or visas abroad.',
    issuedBy: 'Regional Passport Office (Passport Seva)',
    portalName: 'Passport Seva',
    whoCanApply: 'Indian citizens who hold a passport.',
    papers: ['Valid passport', 'Proof of current address'],
    steps: [
      'Log in to Passport Seva and choose "Apply for Police Clearance Certificate".',
      'Fill in the form and pay the fee online.',
      'Book an appointment at a Passport Seva Kendra.',
      'Visit with your original passport and address proof.',
      'After police verification, collect your certificate.',
    ],
    tip: 'For local jobs, your state police may issue a character certificate instead.',
  },
  {
    id: 'satbara',
    category: 'land',
    portalUrl: 'https://bhulekh.mahabhumi.gov.in',
    name: '7/12 extract (Satbara)',
    summary: 'Land record showing the owner, area and crops of farmland in Maharashtra.',
    issuedBy: 'Revenue Department, Maharashtra (Talathi)',
    portalName: 'Mahabhumi Bhulekh',
    whoCanApply: 'Anyone can view a 7/12 extract. Landowners can download a digitally signed copy.',
    papers: ['Survey or gat number', 'Village, taluka and district name'],
    steps: [
      'Open Mahabhumi Bhulekh and choose your division.',
      'Select "7/12", then your district, taluka and village.',
      'Search by survey number or owner name.',
      'View the 7/12 extract on screen.',
      'For official use, download the digitally signed 7/12 from the Mahabhumi digital Satbara service (a small fee applies).',
    ],
    tip: 'A digitally signed 7/12 is accepted for official use without a Talathi stamp.',
  },
  {
    id: 'property-card',
    category: 'land',
    portalUrl: 'https://mahabhumi.gov.in',
    name: 'Property card',
    summary: 'Record of ownership for city plots and buildings in Maharashtra.',
    issuedBy: 'Land Records Department (City Survey Office)',
    portalName: 'Mahabhumi',
    whoCanApply: 'Anyone can view it. Owners can download a digitally signed copy.',
    papers: ['City survey (CTS) number', 'District, taluka and village or city name'],
    steps: [
      'Open Mahabhumi and go to the property card service.',
      'Choose your district, office and village or city.',
      'Enter the city survey (CTS) number.',
      'View the property card on screen.',
      'Download the digitally signed copy if you need it for official work.',
    ],
    tip: 'Check that the owner name matches your sale deed before buying property.',
  },
  {
    id: 'udyam',
    category: 'business',
    portalUrl: 'https://udyamregistration.gov.in',
    name: 'Udyam registration (MSME)',
    summary: 'Free registration for small businesses that opens up loans and government benefits.',
    issuedBy: 'Ministry of Micro, Small and Medium Enterprises',
    portalName: 'Udyam Registration portal',
    whoCanApply: 'Micro, small and medium businesses, including people running a business alone.',
    papers: ["Owner's Aadhaar", 'PAN of the owner or business', 'Bank account details', 'GSTIN, if you have one'],
    steps: [
      'Open the Udyam portal and choose "For New Entrepreneurs".',
      "Enter the owner's Aadhaar number and verify with the OTP.",
      'Verify your PAN.',
      'Fill in your business, bank and activity details.',
      'Submit. Your Udyam certificate is emailed to you and can be downloaded.',
    ],
    tip: 'Udyam registration is free on the official portal. Ignore websites that charge for it.',
  },
  {
    id: 'gst',
    category: 'business',
    portalUrl: 'https://www.gst.gov.in',
    name: 'GST registration',
    summary: 'Tax registration for businesses above the turnover limit or selling across states.',
    issuedBy: 'Goods and Services Tax Network (GSTN)',
    portalName: 'GST portal',
    whoCanApply: 'Businesses above the turnover limit, and most businesses that sell to other states or through online marketplaces.',
    papers: [
      'PAN of the business or owner',
      "Owner's Aadhaar and photo",
      'Proof of business address (for example electricity bill or rent agreement)',
      'Bank account details',
    ],
    steps: [
      'On the GST portal, go to Services, then Registration, then "New Registration".',
      'Fill in Part A with your PAN, mobile and email, and verify the OTPs to get a TRN.',
      'Log in with the TRN and fill in Part B: business, owner and bank details.',
      'Upload the documents and complete Aadhaar authentication.',
      'Submit. Once approved, you get your GSTIN and certificate on the portal.',
    ],
    tip: 'Keep the TRN safe. You need it to finish the application within the time allowed.',
  },
  {
    id: 'fssai',
    category: 'business',
    portalUrl: 'https://foscos.fssai.gov.in',
    name: 'FSSAI food licence',
    summary: 'Food registration or licence for anyone who makes, stores or sells food.',
    issuedBy: 'Food Safety and Standards Authority of India (FSSAI)',
    portalName: 'FoSCoS',
    whoCanApply: 'Food businesses. Small ones need basic registration; larger ones need a state or central licence.',
    papers: ['Photo ID of the owner', 'Proof of address of the business premises', 'List of food products', 'Passport-size photo'],
    steps: [
      'Open FoSCoS and choose "Apply for Licence/Registration".',
      'Pick your state, type of business and turnover to find the right licence.',
      'Fill in the form and upload the documents.',
      'Pay the fee and submit.',
      'Download your FSSAI certificate once it is approved.',
    ],
    tip: 'Show the 14-digit FSSAI number on your food packets and shop board.',
  },
  {
    id: 'digilocker',
    category: 'education',
    portalUrl: 'https://www.digilocker.gov.in',
    name: 'Marksheets and certificates (DigiLocker)',
    summary: 'Get board marksheets, degree certificates and other documents as official digital copies.',
    issuedBy: 'Ministry of Electronics and IT, with school boards and universities',
    portalName: 'DigiLocker',
    whoCanApply: 'Anyone with Aadhaar.',
    papers: ['Aadhaar with a linked mobile number', 'Roll number and year of passing (for marksheets)'],
    steps: [
      'Sign up on DigiLocker with your mobile number and link your Aadhaar.',
      'Go to "Search Documents" and choose your board or university (for example CBSE or Maharashtra State Board).',
      'Enter your roll number and year of passing.',
      'Fetch the document. It is saved in "Issued Documents".',
      'Download it or share it directly with colleges and employers.',
    ],
    tip: 'Documents in "Issued Documents" are legally valid, just like the originals.',
  },
];
