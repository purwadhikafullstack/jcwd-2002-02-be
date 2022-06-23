const { Op } = require("sequelize");
const {
  User,
  AccountVerificationToken,
  Admin,
  AdminLoginSession,
  UserLoginSession,
} = require("../../lib/sequelize");
const Service = require("../service");
const mailer = require("../../lib/mailer");
const { nanoid } = require("nanoid");
const moment = require("moment");
const fs = require("fs");
const mustache = require("mustache");
const bcrypt = require("bcrypt");
// const { generateToken } = require("../../lib/jwt");

class AuthService extends Service {
  static registerUser = async (username, email, name, hashedPassword) => {
    try {
      const hashedPassword = bcrypt.hashSync(password, 5);
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
          "User Registered, please check your email to verify your account!",
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

  static registerAdmin = async (username, email, name, hashedPassword) => {
    try {
      const isUsernameOrEmailTaken = await Admin.findOne({
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

      const registerUser = await Admin.create({
        username,
        nama: name,
        email,
        password: hashedPassword,
      });
      return this.handleSuccess({
        statusCode: 201,
        message: "Admin Registered",
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

  static loginAdmin = async (username, password) => {
    try {
      const findUser = await Admin.findOne({
        where: {
          [Op.or]: [{ username }, { email: username }],
        },
      });
      if (!findUser) {
        return this.handleError({
          statusCode: 400,
          message: "Login credentials doesn't match!",
        });
      }
      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);
      if (!isPasswordCorrect) {
        return this.handleError({
          statusCode: 400,
          message: "Login credentials doesn't match!",
        });
      }
      delete findUser.dataValues.password;

      await AdminLoginSession.update(
        {
          is_valid: false,
        },
        {
          where: {
            admin_id: findUser.id,
            is_valid: true,
          },
        }
      );

      const sessionToken = nanoid(64);

      // Create new session for logged in user
      await AdminLoginSession.create({
        admin_id: findUser.id,
        is_valid: true,
        token: sessionToken,
        valid_until: moment().add(1, "day"),
      });

      return this.handleSuccess({
        statusCode: 200,
        message: "Welcome",
        data: {
          user: findUser,
          token: sessionToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };

  static keepLoginAdmin = async (token, admin) => {
    try {
      const renewedToken = nanoid(64);

      const findUser = await Admin.findByPk(admin.id);

      delete findUser.dataValues.password;

      await AdminLoginSession.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return this.handleSuccess({
        statusCode: 200,
        message: "Renewed user token",
        data: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };

  static keepLoginAdmin = async (token) => {
    try {
      const renewedToken = nanoid(64);

      const findUser = await Admin.findByPk(token.admin_id);

      delete findUser.dataValues.password;

      await AdminLoginSession.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return this.handleSuccess({
        statusCode: 200,
        message: "Renewed user token",
        data: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };

  static keepLoginAdmin = async (token) => {
    try {
      const renewedToken = nanoid(64);

      const findUser = await Admin.findByPk(token.admin_id);

      delete findUser.dataValues.password;

      await AdminLoginSession.update(
        {
          token: renewedToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return this.handleSuccess({
        statusCode: 200,
        message: "Renewed user token",
        data: {
          user: findUser,
          token: renewedToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };

  static editAvatarUser = async (id, file) => {
    try {
      const findUser = await User.findOne({
        where: {
          id,
        },
      });
      if (!findUser) {
        return this.handleError({
          statusCode: 400,
          message: "No user found!",
        });
      }
      const uploadFileDomain = process.env.UPLOAD_FILE_DOMAIN;
      const filePath = "avatar";
      const { filename } = file;

      const newAvatar = `${uploadFileDomain}/${filePath}/${filename}`;

      const updatedAvatar = await User.update(
        {
          photo_profile: newAvatar,
        },
        {
          where: {
            id,
          },
        }
      );

      const userInfo = await User.findByPk(id);

      return this.handleSuccess({
        statusCode: 200,
        message: "Avatar edited successfully!",
        data: userInfo,
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Server error!",
      });
    }
  };
  static loginUser = async (credential, password) => {
    try {
      const findUser = await User.findOne({
        where: {
          [Op.or]: [{ username: credential }, { email: credential }],
        },
      });

      const comparePassword = bcrypt.compareSync(password, findUser.password);

      if (!findUser || !comparePassword) {
        return this.handleError({
          message: "Wrong Username, email or password!",
          statusCode: 400,
        });
      }

      delete findUser.dataValues.password;

      await UserLoginSession.update(
        {
          is_valid: false,
        },
        {
          where: {
            userId: findUser.id,
            is_valid: true,
          },
        }
      );

      const sessionToken = nanoid(64);

      await UserLoginSession.create({
        token: sessionToken,
        userId: findUser.id,
        is_valid: true,
        valid_until: moment().add(1, "day"),
      });

      return this.handleSuccess({
        statusCode: 200,
        message: "Login Success!",
        data: {
          user: findUser,
          token: sessionToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        statusCode: 500,
        message: "Can't reach auth server",
      });
    }
  };

  static keepLoginUser = async (token, user) => {
    try {
      const newToken = nanoid(64);
      const findUser = await User.findByPk(user.id);

      delete findUser.dataValues.password;

      await UserLoginSession.update(
        {
          token: newToken,
          valid_until: moment().add(1, "day"),
        },
        {
          where: {
            id: token.id,
          },
        }
      );

      return this.handleSuccess({
        statusCode: 200,
        message: "Token just Updated!",
        data: {
          user: findUser,
          token: newToken,
        },
      });
    } catch (err) {
      console.log(err);
      return this.handleError({
        message: "Can't reach token server",
        statusCode: 500,
      });
    }
  };
}

module.exports = AuthService;
