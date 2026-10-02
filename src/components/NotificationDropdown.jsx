import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Check, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/helpers'

export function NotificationItem({ notification, onNavigate }) {
  const { markNotificationRead, clearNotification } = useApp()
  return (
    <li className={`notif-item ${notification.read ? '' : 'unread'}`}>
      <div className="notif-text">
        {notification.link ? (
          <Link
            to={notification.link}
            onClick={() => {
              markNotificationRead(notification.id)
              onNavigate?.()
            }}
          >
            {notification.message}
          </Link>
        ) : (
          <span>{notification.message}</span>
        )}
        <span className="muted small">{formatDate(notification.createdAt)}</span>
      </div>
      <div className="notif-actions">
        {!notification.read && (
          <button
            type="button"
            className="icon-btn"
            title="Mark as read"
            aria-label="Mark as read"
            onClick={() => markNotificationRead(notification.id)}
          >
            <Check size={15} />
          </button>
        )}
        <button
          type="button"
          className="icon-btn"
          title="Clear notification"
          aria-label="Clear notification"
          onClick={() => clearNotification(notification.id)}
        >
          <X size={15} />
        </button>
      </div>
    </li>
  )
}

export default function NotificationDropdown() {
  const { myNotifications } = useApp()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const { pathname } = useLocation()
  const unread = myNotifications.filter((n) => !n.read).length

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onClick = (event) => !wrapRef.current?.contains(event.target) && setOpen(false)
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn notif-btn"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell size={19} />
        {unread > 0 && <span className="notif-count">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="notif-panel">
          <div className="notif-panel-head">
            <strong>Notifications</strong>
            <Link to="/notifications">View all</Link>
          </div>
          {myNotifications.length === 0 ? (
            <p className="notif-empty muted">You have no notifications.</p>
          ) : (
            <ul className="notif-list">
              {myNotifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
