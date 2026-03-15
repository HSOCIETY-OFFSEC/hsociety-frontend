export const resolveNotificationTarget = (notification = {}) => {
  const metadata = notification?.metadata && typeof notification.metadata === 'object'
    ? notification.metadata
    : {};

  const meetUrl = metadata.meetUrl;
  if (meetUrl) return { type: 'external', url: meetUrl };

  const directUrl = metadata.url || metadata.link || metadata.href;
  if (directUrl) return { type: 'external', url: directUrl };

  const route = metadata.route || metadata.path;
  if (route) return { type: 'route', to: route };

  if (metadata.room && metadata.messageId) {
    const room = String(metadata.room || '').replace(/^#/, '');
    const messageId = String(metadata.messageId || '');
    if (room && messageId) {
      const params = new URLSearchParams({ room, messageId });
      return { type: 'route', to: `/community?${params.toString()}` };
    }
  }

  return null;
};

export const openNotificationTarget = (notification, navigate) => {
  const target = resolveNotificationTarget(notification);
  if (!target) return;
  if (target.type === 'external') {
    window.open(target.url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (target.type === 'route' && typeof navigate === 'function') {
    navigate(target.to);
  }
};

export default {
  resolveNotificationTarget,
  openNotificationTarget,
};
