import UserType from "../models/user/user-type.model";

export default class UserTypeSeeder {
  public static async run() {
    const data = [
      {
        user_type_name: "internship_seeker",
        user_type_display_name: "Internship Seeker",
      },
      {
        user_type_name: "company",
        user_type_display_name: "Company",
      },
    ];

    for (const userType of data) {
      const existingUserType = await UserType.findOne({
        user_type_name: userType.user_type_name,
      });

      if (!existingUserType) {
        await UserType.create({
          user_type_name: userType.user_type_name,
          user_type_display_name: userType.user_type_display_name,
        });
      }
    }
  }
}
