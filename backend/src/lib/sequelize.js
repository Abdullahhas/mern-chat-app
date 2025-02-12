import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize('mern', 'sa', 'root', {
  host: 'localhost',
  dialect: "mssql",
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  logging: false,
  port: process.env.SQL_PORT || 1433,
});

export const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize Connected to MS SQL Server");
  } catch (error) {
    console.error("Unable to connect to MS SQL Server:", error);
  }
};

export default sequelize;
