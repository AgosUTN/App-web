import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/DB/orm.js";

import { NotFoundError } from "@mikro-orm/core";
import { User } from "../users/user.entity.js";

const em = orm.em;

async function crearUsuarioUSER(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Endpoint temporal.
  try {
    const password_hash = await bcrypt.hash(req.body.password, 10);

    const user = em.create(User, {
      email: req.body.email as string,
      password_hash: password_hash,
      rol: "USER",
      miSocio: req.body.socio,
    });
    await em.persistAndFlush(user);
    return res.status(201).json({ message: "Usuario creado" });
  } catch (error: any) {
    // Error mail unique.
    next(error);
  }
}

async function crearUsuarioADMIN(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Endpoint temporal.
  try {
    const password_hash = await bcrypt.hash(req.body.password, 10);

    const user = em.create(User, {
      email: req.body.email as string,
      password_hash: password_hash,
      rol: "ADMIN",
      miSocio: req.body.socio,
    });
    await em.persistAndFlush(user);
    return res.status(201).json({ message: "ADMIN creado" });
  } catch (error: any) {
    // Error mail unique.
    next(error);
  }
}
async function loguearUsuario(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await em.findOneOrFail(
      User,
      {
        email: req.body.email,
        bajaLogica: false,
      },
      { populate: ["miSocio"] },
    );
    const isValid = await bcrypt.compare(req.body.password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrecta.",
        code: "INVALID_USER",
      });
    }
    let token;
    if (user.miSocio) {
      token = jwt.sign(
        {
          id: user.id,
          rol: user.rol,
          idSocio: user.miSocio.id,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
    } else {
      token = jwt.sign(
        {
          id: user.id,
          rol: user.rol,
          idSocio: null,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
      );
    }
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "PRODUCTION",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json({
        message: "Sesión iniciada",
        data: { rol: user.rol },
      });
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrecta." });
    }
    next(error);
  }
}

function logOut(req: Request, res: Response) {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Sesión cerrada" });
}

function verificarToken(req: Request, res: Response) {
  res.status(200).json({ message: "Token válido" }); // Si no es válido / ya expiro, el error lo retorna el middleware.
}

export {
  crearUsuarioADMIN,
  crearUsuarioUSER,
  loguearUsuario,
  logOut,
  verificarToken,
};
