import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as UserService from './user.services'
import { sendError, sendSucces } from '../../utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validar entrada
    if (!email || !password) {
      return sendError(res, 'Email y contraseña son obligatorios', 400);
    }

    // 2. Buscar al usuario en nuestro "array" service
    const user = UserService.findByEmail(email);
    if (!user) {
      return sendError(res, 'Credenciales inválidas', 401);
    }

    // 3. Comparar la contraseña enviada con el Hash guardado
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return sendError(res, 'Credenciales inválidas', 401);
    }

    // 4. Si todo está ok, generamos el Token
    // Usamos el "!" porque ya validamos en el middleware que existe
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '4h' }
    );

    return sendSucces(res, { 
      message: "Bienvenido, Admin",
      token 
    });

  } catch (error) {
    return sendError(res, 'Error al intentar iniciar sesión', 500);
  }
};