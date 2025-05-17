import React, { useState, useEffect, useRef } from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import { Bell, Check, CheckAll } from 'react-bootstrap-icons';
import axios from 'axios';
import '../style/ToastNotification.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:9999/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Sắp xếp theo thời gian tạo mới nhất
      const sortedNotifications = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(sortedNotifications);
      
      // Đếm số thông báo chưa đọc
      const unread = sortedNotifications.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:9999/notifications/${id}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Cập nhật số lượng thông báo chưa đọc
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('http://localhost:9999/notifications/read-all', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Xử lý click bên ngoài dropdown để đóng
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Poll for new notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Render notification system
  return (
    <>
      {/* Icon thông báo trên menu */}
      <div className="notification-dropdown-container" ref={dropdownRef}>
        <div 
          className="notification-icon" 
          onClick={(e) => {
            e.stopPropagation();
            setShow(!show);
            // Nếu đang đóng, fetch lại thông báo khi mở
            if (!show) {
              fetchNotifications();
            }
          }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge 
              pill 
              bg="danger" 
              className="notification-badge"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
        
        {/* Dropdown thông báo */}
        {show && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <h6>Thông báo</h6>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                >
                  <CheckAll size={14} className="me-1" />
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
            
            <ListGroup className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">Không có thông báo nào</div>
              ) : (
                notifications.map((notification) => (
                  <ListGroup.Item 
                    key={notification._id}
                    className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{formatDate(notification.createdAt)}</div>
                    </div>
                    {!notification.isRead && (
                      <button 
                        className="mark-read"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                      >
                        <Check size={12} className="me-1" />
                        Đã đọc
                      </button>
                    )}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationSystem;
