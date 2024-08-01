import Sequelize from 'sequelize'
import { sequelize } from '../config/db'

export const User = sequelize.define(
  'users',
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: true },
    phone_number: { type: Sequelize.STRING, allowNull: false, unique: true },
    otp: { type: Sequelize.STRING },
    otp_attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
    otp_expires_at: { type: Sequelize.DATE },
    blocked_until: { type: Sequelize.DATE },
  },
  {
    timestamps: true,
    underscored: true,
  },
)
