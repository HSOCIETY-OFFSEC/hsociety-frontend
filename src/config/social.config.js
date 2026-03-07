import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
  FaTelegram
} from 'react-icons/fa6';

export const SOCIAL_LINKS = [
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@hsocietyoffsec', icon: FaYoutube },
  { key: 'x', label: 'X', href: 'https://x.com/hsocietyoffsec', icon: FaXTwitter },
  { key: 'github', label: 'GitHub', href: 'https://github.com/hsocietyoffsec', icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/hsocietyoffsec/', icon: FaLinkedinIn },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5', icon: FaWhatsapp }
];

export const getSocialLinks = () => SOCIAL_LINKS.filter((link) => Boolean(link.href));

export default SOCIAL_LINKS;
