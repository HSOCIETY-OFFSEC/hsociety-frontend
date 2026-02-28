import {
  FaGithub,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
  FaTelegram
} from 'react-icons/fa6';

export const SOCIAL_LINKS = [
  { key: 'youtube', label: 'YouTube', href: 'https://youtube.com', icon: FaYoutube },
  { key: 'x', label: 'X', href: 'https://x.com', icon: FaXTwitter },
  { key: 'github', label: 'GitHub', href: 'https://github.com', icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://chat.whatsapp.com/Ja8pR0FZQAI2pceGjQpji5', icon: FaWhatsapp },
  { key: 'telegram', label: 'Telegram', href: 'https://t.me', icon: FaTelegram }
];

export const getSocialLinks = () => SOCIAL_LINKS.filter((link) => Boolean(link.href));

export default SOCIAL_LINKS;
