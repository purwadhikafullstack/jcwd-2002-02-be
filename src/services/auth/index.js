const { Op } = require("sequelize");
const { User, AccountVerificationToken } = require("../../lib/sequelize");
const Service = require("../service");
const mailer = require("../../lib/mailer");
const { nanoid } = require("nanoid");
const moment = require("moment");
const fs = require("fs");
const mustache = require("mustache");
const bcrypt = require("bcrypt");

class AuthService extends Service {
  static registerUser = async (username, email, name, password) => {
    try {
      const isUsernameOrEmailTaken = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUsernameOrEmailTaken) {
        return this.handleError({
          statusCode: 400,
          message: "Username or email has been taken!",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);

      const registerUser = await User.create({
        username,
        nama: name,
        email,
        password: hashedPassword,
      });

      const verifyAccountToken = nanoid(40);

      await AccountVerificationToken.create({
        token: verifyAccountToken,
        is_valid: true,
        valid_until: moment().add(1, "hour"),
        userId: registerUser.id,
      });

      const verifyUserLink = `http://localhost:2000/auth/verify/${verifyAccountToken}`;

      const emailTemplate = fs
        .readFileSync(__dirname + "/../../templates/verifyAccount.html")
        .toString();

      const renderedTemplate = mustache.render(emailTemplate, {
        name,
        verify_url: verifyUserLink,
      });

      await mailer({
        subject: "Verfiy your account!",
        to: email,
        html: renderedTemplate,
      });

      return this.handleSuccess({
        statusCode: 201,
        message:
          "Account Registered, please check your email to verify your account!",
        data: registerUser,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };

  static verifyUser = async (token) => {
    try {
      const verifyToken = await AccountVerificationToken.findOne({
        where: {
          token,
          is_valid: true,
          valid_until: {
            [Op.gt]: moment().utc(),
          },
        },
      });

      if (!verifyToken) {
        return this.handleError({
          message: "Token is not valid!",
          statusCode: 401,
        });
      }

      await User.update(
        { is_verified: true },
        {
          where: {
            id: verifyToken.userId,
          },
        }
      );

      await AccountVerificationToken.update(
        { is_valid: false },
        {
          where: {
            userId: verifyToken.userId,
          },
        }
      );

      return this.handleRedirect({
        url: `http://localhost:3000/verification-success?referral=${token}`,
      });
    } catch (err) {
      return this.handleError({
        message: "Server Error!",
        statusCode: 500,
      });
    }
  };

  static resendVerificationToken = async (req) => {
    try {
      const userId = req.token.id;

      const findUser = await User.findByPk(userId);

      if (findUser.is_verified) {
        return this.handleError({
          message: "Your account has been verified",
          statusCode: "400",
        });
      }

      const verifyAccountToken = nanoid(40);

      await AccountVerificationToken.create({
        token: verifyAccountToken,
        is_valid: true,
        valid_until: moment().add(1, "hour"),
        userId: findUser.id,
      });

      const verifyUserLink = `http://localhost:2000/auth/verify/${verifyAccountToken}`;

      const emailTemplate = fs
        .readFileSync(__dirname + "/../../templates/verifyAccount.html")
        .toString();

      const renderedTemplate = mustache.render(emailTemplate, {
        name: findUser.nama,
        verify_url: verifyUserLink,
      });

      await mailer({
        subject: "Verfiy your account!",
        to: findUser.email,
        html: renderedTemplate,
      });

      return this.handleSuccess({
        message: "Verification link has been sent!",
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Server error!",
        statusCode: 500,
      });
    }
  };
}

module.exports = AuthService;
