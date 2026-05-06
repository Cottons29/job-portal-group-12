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

export interface AppLanguage {
  lang: string;
  version: number;
  sidebar: Sidebar;
  navbar: Navbar;
  auth: Auth;
  footer: Footer;
  home: Home;
}
