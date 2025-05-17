import React, { useState, useEffect } from 'react';
import { Badge, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import { Bell, Check, CheckAll } from 'react-bootstrap-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationPanel = () => {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:9999/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(response.data);
      
      // Count unread notifications
      const unread = response.data.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể cập nhật trạng thái thông báo.');
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
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Không thể cập nhật trạng thái thông báo.');
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

  // Poll for new notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Button 
        variant="light" 
        className="position-relative me-3" 
        onClick={handleShow}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge 
            pill 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Thông báo</Offcanvas.Title>
          {unreadCount > 0 && (
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={markAllAsRead}
              className="ms-auto me-2"
            >
              <CheckAll /> Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-center text-muted">Không có thông báo nào</p>
          ) : (
            <ListGroup>
              {notifications.map((notification) => (
                <ListGroup.Item 
                  key={notification._id}
                  className={`d-flex justify-content-between align-items-start ${!notification.isRead ? 'bg-light' : ''}`}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{notification.message}</div>
                    <small className="text-muted">{formatDate(notification.createdAt)}</small>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="outline-success" 
                      size="sm" 
                      onClick={() => markAsRead(notification._id)}
                    >
                      <Check /> Đã đọc
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NotificationPanel;
