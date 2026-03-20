import React from 'react';
import { ACCOUNT_UI } from '../../../data/static/account/accountUiData';

const AccountNotificationsList = ({ notifications = [], onOpen }) => {
  if (notifications.length === 0) {
    return <p className="account-notifications-empty">{ACCOUNT_UI.notifications.empty}</p>;
  }

  return (
    <div className="account-notifications-list">
      {notifications.slice(0, 5).map((item) => (
        <button
          key={item.id}
          type="button"
          className={`account-notification-item ${item.read ? 'is-read' : 'is-unread'}`}
          onClick={() => onOpen(item)}
        >
          <strong className="account-notification-title">{item.title}</strong>
          <span className="account-notification-message">{item.message}</span>
        </button>
      ))}
    </div>
  );
};

export default AccountNotificationsList;