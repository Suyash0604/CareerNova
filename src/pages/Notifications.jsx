import { Bell } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { NotificationItem } from '../components/NotificationDropdown'
import { EmptyState } from '../components/Feedback'
import { useApp } from '../context/AppContext'

export default function Notifications() {
  const { myNotifications, markAllNotificationsRead, clearAllNotifications } = useApp()
  const hasUnread = myNotifications.some((n) => !n.read)

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Updates about your applications and new opportunities."
      actions={
        myNotifications.length > 0 && (
          <>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={markAllNotificationsRead}
              disabled={!hasUnread}
            >
              Mark all as read
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={clearAllNotifications}>
              Clear all
            </button>
          </>
        )
      }
    >
      {myNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" message="You're all caught up." />
      ) : (
        <ul className="card notif-list notif-page">
          {myNotifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </DashboardLayout>
  )
}
