
import { AppDataSource } from "./database";
import { User } from "../models/User";

export const seedDatabase = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Kiểm tra xem đã có tài khoản admin chưa
    const existingAdmin = await userRepository.findOne({ where: { username: "admin" } });
    if (!existingAdmin) {
      console.log("Creating admin account...");
      const admin = new User();
      admin.username = "admin";
      admin.email = "admin@example.com";
      admin.password = "admin123";
      admin.role = "admin";
      await admin.hashPassword();
      await userRepository.save(admin);
      console.log("Admin account created successfully!");
    } else {
      console.log("Admin account already exists");
    }

    // Kiểm tra xem đã có tài khoản user chưa
    const existingUser = await userRepository.findOne({ where: { username: "user" } });
    if (!existingUser) {
      console.log("Creating user account...");
      const user = new User();
      user.username = "user";
      user.email = "user@example.com";
      user.password = "user123";
      user.role = "user";
      await user.hashPassword();
      await userRepository.save(user);
      console.log("User account created successfully!");
    } else {
      console.log("User account already exists");
    }

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}; 