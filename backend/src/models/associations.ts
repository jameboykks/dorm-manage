
import { Student } from './Student';
import { User } from './User';
import Room from './Room';
import { RoomAssignment } from './RoomAssignment';

// Define associations between User and Student
Student.belongsTo(User, { foreignKey: 'userId', as: 'userData' });
User.hasOne(Student, { foreignKey: 'userId', as: 'studentData' });

// Define associations between Student and RoomAssignment
Student.hasMany(RoomAssignment, { foreignKey: 'studentId', as: 'roomAssignments' });
RoomAssignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Define associations between Room and RoomAssignment
Room.hasMany(RoomAssignment, { foreignKey: 'roomId', as: 'roomAssignments' });
RoomAssignment.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });

export { Student, User, Room, RoomAssignment }; 