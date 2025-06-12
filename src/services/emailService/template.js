export const verifyEmail = (code, appName) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 30px;">
        <h2 style="color: #333;">Добро пожаловать в ${appName}!</h2>
        <p>Пожалуйста, введите код подтверждения ниже в приложении:</p>
        <h1 style="letter-spacing: 4px; font-size: 36px; color: #414EF9;">${code}</h1>
        <p style="margin-top: 30px; font-size: 14px; color: #777;">
          Если вы не регистрировались — просто проигнорируйте это письмо.
        </p>
      </body>
    </html>
  `;
};

export const resetPassword = (url, appName) => {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 30px;">
        <h2 style="color: #333;">Сброс пароля для ${appName}</h2>
        <p>Кто-то (возможно вы) запросил сброс пароля. Вот ссылка:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #414EF9; color: white; text-decoration: none; border-radius: 5px;">Сбросить пароль</a>
        <p style="margin-top: 30px; font-size: 14px; color: #777;">
          Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
        </p>
      </body>
    </html>
  `;
};

export default {
  verifyEmail,
  resetPassword
};
