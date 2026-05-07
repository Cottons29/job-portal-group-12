export interface Sidebar {
  home: string;
  search: string;
  messages: string;
  notifications: string;
  create: string;
  profile: string;
  settings: string;
  hideLabels: string;
  lightMode: string;
  darkMode: string;
}

export interface Navbar {
  browseJobs: string;
  forStudents: string;
  forEmployers: string;
  logIn: string;
}

export interface Auth {
  loginTitle: string;
  signupTitle: string;
  loginSubtitle: string;
  signupSubtitle: string;
  logIn: string;
  signUp: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  continue: string;
  createAccount: string;
  pleaseWait: string;
  orContinueWith: string;
  usePasskey: string;
  termsText: string;
  termsOfService: string;
  privacyPolicy: string;
  student: string;
  employer: string;
}

export interface Footer {
  brandDescription: string;
  explore: string;
  support: string;
  aboutUs: string;
  contact: string;
  copyright: string;
}

export interface Home {
  eyebrow: string;
  welcomeBack: string;
  searchPlaceholder: string;
  sharePlaceholder: string;
  post: string;
  jobAlert: string;
  company: string;
  hiringNow: string;
  campusOpportunity: string;
  applyNow: string;
  todayLabel: string;
  yourFocus: string;
  savedJobs: string;
  applications: string;
  profileStrength: string;
  suggestedForYou: string;
  follow: string;
}

export interface TextBlock {
  title: string;
  description: string;
}

export interface LabelValueOption {
  label: string;
  value: string;
}

export interface LandingPage {
  logIn: string;
  getStarted: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchJobs: string;
  featuredMatch: string;
  trustedNetwork: string;
  exploreRoles: string;
  howItWorks: string;
  latestOpportunities: string;
  startJourney: string;
  learnAboutFirstStep: string;
  quickChips: string[];
  partners: LabelValueOption[];
  stats: LabelValueOption[];
  categories: TextBlock[];
  steps: TextBlock[];
  jobs: TextBlock[];
  roleGaps: string[];
}

export interface AboutPage {
  eyebrow: string;
  title: string;
  subtitle: string;
  values: TextBlock[];
  mission: TextBlock;
  vision: TextBlock;
}

export interface ContactPage {
  eyebrow: string;
  title: string;
  subtitle: string;
  contactMethods: TextBlock[];
  formTitle: string;
  name: string;
  email: string;
  message: string;
  submit: string;
}

export interface LegalPage {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: TextBlock[];
}

export interface SetupPage {
  title: string;
  subtitle: string;
  steps: string[];
  back: string;
  next: string;
  finish: string;
  options: LabelValueOption[];
}

export interface SecureAccountPage {
  title: string;
  subtitle: string;
  passkeyTitle: string;
  passkeyDescription: string;
  skip: string;
  continue: string;
}

export interface AdminModerationDashboardPage {
  title: string;
  subtitle: string;
  stats: LabelValueOption[];
  filters: string[];
  approve: string;
  reject: string;
  viewDetails: string;
}

export interface SettingsPage {
  personalInfo: string;
  securitySignIn: string;
  dataPrivacy: string;
  languages: string;
  languageTitle: string;
  languageDescription: string;
  currentLanguage: string;
  logout: string;
  personal: {
    editTitle: string;
    enterField: string;
    cancel: string;
    saving: string;
    save: string;
    profilePicture: string;
    profilePicturePlaceholder: string;
    companyName: string;
    name: string;
    yourCompany: string;
    yourName: string;
    companyNamePlaceholder: string;
    namePlaceholder: string;
    username: string;
    blank: string;
    usernamePlaceholder: string;
    email: string;
    noEmailLinked: string;
    emailPlaceholder: string;
    phone: string;
    noPhoneNumber: string;
    phonePlaceholder: string;
    university: string;
    universityPlaceholder: string;
    major: string;
    majorPlaceholder: string;
    industry: string;
    industryPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    website: string;
    noWebsite: string;
    websitePlaceholder: string;
    notSet: string;
  };
  security: {
    editTitle: string;
    passkeyLogin: string;
    passkeyAdded: string;
    passkeysAdded: string;
    passkeyDescription: string;
    addingPasskey: string;
    addPasskey: string;
    password: string;
    currentPassword: string;
    currentPasswordPlaceholder: string;
    newPassword: string;
    newPasswordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    passwordRecommendation: string;
    cancel: string;
    updating: string;
    save: string;
  };
  privacy: {
    placeholder: string;
  };
  logoutSection: {
    title: string;
    description: string;
    loggingOut: string;
  };
}

export interface DashboardPageCard {
  title: string;
  description: string;
}

export interface DashboardPageContent {
  eyebrow: string;
  title: string;
  description?: string;
  cards?: DashboardPageCard[];
}

export interface DashboardPages {
  search: DashboardPageContent;
  messages: DashboardPageContent;
  notifications: DashboardPageContent;
  create: DashboardPageContent;
  profile: DashboardPageContent;
  settings: DashboardPageContent;
}

export interface CreatePostPage {
  newPost: string;
  shareWithNetwork: string;
  publishing: string;
  publishPost: string;
  title: string;
  titlePlaceholder: string;
  friendly: string;
  markdown: string;
  uploadingImages: string;
  uploadMarkdownImages: string;
  markdownPlaceholder: string;
  friendlyPlaceholder: string;
  preview: string;
  previewTitleFallback: string;
  postPhotoPreviewAlt: string;
  markdownTips: string;
  headingTip: string;
  emphasisTip: string;
  bulletTip: string;
  linkTip: string;
}

export interface ProfilePage {
  editProfile: string;
  lookingFor: string;
  connectionAvatarAlt: string;
  followedBy: string;
}

export interface AppLanguage {
  lang: string;
  version: number;
  sidebar: Sidebar;
  navbar: Navbar;
  auth: Auth;
  footer: Footer;
  home: Home;
  settings: SettingsPage;
  dashboardPages: DashboardPages;
  createPost: CreatePostPage;
  profilePage: ProfilePage;
  landing?: LandingPage;
  about?: AboutPage;
  contact?: ContactPage;
  privacyPolicy?: LegalPage;
  termsOfService?: LegalPage;
  studentSetup?: SetupPage;
  employerSetup?: SetupPage;
  secureAccount?: SecureAccountPage;
  adminModerationDashboard?: AdminModerationDashboardPage;
}
