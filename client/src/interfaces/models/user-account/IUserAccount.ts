export interface IUserAccount {
  _id: string;
  user_type_id: any; // Can be string or populated UserType object
  email: string;
  password: string;
  sms_notification_active: boolean;
  email_notification_active: boolean;
  registration_date: Date;
  createdAt: Date;
  updatedAt: Date;
}
