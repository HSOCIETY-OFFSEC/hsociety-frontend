import mediaOne from '../../assets/images/services-images/beginner-offsec-training.webp';
import mediaTwo from '../../assets/images/services-images/community-integration.webp';
import mediaThree from '../../assets/images/services-images/penetration-tests.webp';

export const PUBLIC_CARD_MEDIA = [mediaOne, mediaTwo, mediaThree];

export const getPublicCardMedia = (index = 0) =>
  PUBLIC_CARD_MEDIA[index % PUBLIC_CARD_MEDIA.length];
