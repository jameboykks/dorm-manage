import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { StudentRegistration } from './pages/admin/StudentRegistration';
import { RoomRegistration } from './pages/admin/RoomRegistration';
import { StudentHome } from './pages/student/StudentHome';
import { StudentRoomRegistration } from './pages/student/StudentRoomRegistration';
import { AvailableRooms } from './pages/student/AvailableRooms';
import { AdminHome } from './pages/admin/AdminHome';
import { StudentList } from './pages/admin/StudentList';
import { RoomList } from './pages/admin/RoomList';
import { EditRoom } from './pages/admin/EditRoom';
import { RoomAssignment } from './pages/admin/RoomAssignment';
import PrivateRoute from './components/PrivateRoute';
import { EditStudent } from './pages/admin/EditStudent';
import RoomStudents from './pages/admin/RoomStudents';
import { RoomRegistrationRequests } from './pages/admin/RoomRegistrationRequests';
import { Notifications } from './pages/student/Notifications';
import { RoomInfo } from './pages/student/RoomInfo';
import { CreateNotification } from './pages/admin/CreateNotification';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentPayment } from './pages/student/StudentPayment';
import { PaymentManagement } from './pages/admin/PaymentManagement';
import { AddRoom } from './pages/admin/AddRoom';
import { RoomAssignments } from './pages/admin/RoomAssignments';
import { RoomHistory } from './pages/student/RoomHistory';
import { Chat } from './pages/student/Chat';
import { AdminChat } from './pages/admin/AdminChat';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute requireAdmin>
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/student-registration"
          element={
            <PrivateRoute requireAdmin>
              <StudentRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/student-list"
          element={
            <PrivateRoute requireAdmin>
              <StudentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/student/:id/edit"
          element={
            <PrivateRoute requireAdmin>
              <EditStudent />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room-registration"
          element={
            <PrivateRoute requireAdmin>
              <RoomRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room-list"
          element={
            <PrivateRoute requireAdmin>
              <RoomList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room/:id/edit"
          element={
            <PrivateRoute requireAdmin>
              <EditRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room-assignment"
          element={
            <PrivateRoute requireAdmin>
              <RoomAssignment />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room-registration-requests"
          element={
            <PrivateRoute>
              <RoomRegistrationRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/create-notification"
          element={
            <PrivateRoute requireAdmin>
              <CreateNotification />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/home"
          element={
            <PrivateRoute>
              <StudentHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/available-rooms"
          element={
            <PrivateRoute>
              <AvailableRooms />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/room-registration/:roomId"
          element={
            <PrivateRoute>
              <StudentRoomRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/room-info"
          element={
            <PrivateRoute>
              <RoomInfo />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <PrivateRoute>
              <StudentProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/payment"
          element={
            <PrivateRoute>
              <StudentPayment />
            </PrivateRoute>
          }
        />
        <Route path="/admin/room-students/:roomId" element={<RoomStudents />} />
        <Route
          path="/admin/payment-management"
          element={
            <PrivateRoute requireAdmin>
              <PaymentManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room/add"
          element={
            <PrivateRoute requireAdmin>
              <AddRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/room-assignments"
          element={
            <PrivateRoute requireAdmin>
              <RoomAssignments />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <PrivateRoute>
              <RoomHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <PrivateRoute requireAdmin>
              <AdminChat />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App; 