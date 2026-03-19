export const AUTH_FORM_CONTENT = {
  login: {
    titles: {
      default: 'Secure Login',
      pentester: 'Pentester Login',
    },
    subtitles: {
      step1: 'Enter your email or handle and password',
    },
    fields: {
      email: {
        label: 'Email or Handle',
        placeholder: 'you@example.com or h4ck3r10',
      },
      password: {
        label: 'Password',
        placeholder: 'Your password',
      },
    },
    buttons: {
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      useDifferent: 'Use a different account',
    },
    footer: {
      studentPrompt: 'Student access?',
      studentAction: 'Create a student account',
      corporatePrompt: 'Corporate access?',
      corporateAction: 'Create a corporate account',
      termsPrompt: 'By signing in you agree to the',
      termsAction: 'Terms & Conditions',
    },
    notice: 'Your security is our priority. All communications are encrypted.',
  },
  register: {
    header: {
      title: 'Create Account',
      subtitle: {
        defaultSwitch: 'Register as a corporate team or student and get started.',
        student:
          'Create a student account to join the community and training tracks.',
        corporate:
          'Create a corporate team account to request HSOCIETY services and client dashboards.',
      },
    },
    note: {
      corporate:
        'Corporate accounts power pentest requests, dashboards, and client tracking.',
    },
    footer: {
      loginPrompt: 'Already have an account?',
      loginAction: 'Login',
      corporatePrompt: 'Need a corporate account?',
      corporateAction: 'Register as corporate',
      studentPrompt: 'Looking for student access?',
      studentAction: 'Register as student',
      termsPrompt: 'By creating an account you agree to the',
      termsAction: 'Terms & Conditions',
    },
    notice: {
      student: 'Your registration data is encrypted in transit.',
      corporate:
        'HSOCIETY verifies each corporate registration before pentest access is granted.',
    },
    accountType: {
      label: 'Account Type',
      corporate: 'Corporate',
      student: 'Student',
      studentLabel: 'Student account',
      corporateLabel: 'Corporate account',
    },
    fields: {
      name: {
        label: 'Full Name',
        placeholder: 'Wunpini Andani',
      },
      handle: {
        label: 'Handle',
        placeholder: 'wsuits6',
        hint: 'This becomes your public profile URL: /@handle',
      },
      org: {
        studentLabel: 'School / Program',
        corporateLabel: 'Company',
        studentPlaceholder: 'University name',
        corporatePlaceholder: 'Company name',
      },
      email: {
        label: 'Email Address',
        placeholder: 'you@company.com',
      },
      password: {
        label: 'Password',
        placeholder: 'Create a secure password',
      },
      confirmPassword: {
        label: 'Confirm Password',
        placeholder: 'Repeat your password',
      },
      agree: {
        prefix: 'I have read the',
        link: 'HSOCIETY Terms & Conditions',
        suffix: 'and agree to the security policies.',
      },
    },
    button: {
      create: 'Create Account',
    },
  },
};

export default AUTH_FORM_CONTENT;
