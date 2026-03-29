import React from 'react';
import { ACCOUNT_UI } from '../../../data/static/account/accountUiData';

const AccountNotificationsList = ({ notifications = [], onOpen }) => {
  if (notifications.length === 0) {
    return <p className="text-sm text-text-secondary">{ACCOUNT_UI.notifications.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.slice(0, 5).map((item) => (
        <button
          key={item.id}
          type="button"
          className={`w-full rounded-md border px-3 py-2 text-left transition ${
            item.read
              ? 'border-border bg-bg-secondary'
              : 'border-brand/40 bg-card'
          }`}
          onClick={() => onOpen(item)}
        >
          <strong className="block text-sm font-semibold text-text-primary">{item.title}</strong>
          <span className="text-xs text-text-secondary">{item.message}</span>
        </button>
      ))}
    </div>
  );
};

export default AccountNotificationsList;
