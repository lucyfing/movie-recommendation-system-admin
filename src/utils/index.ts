// 过滤html标签，防止XSS攻击
const escapeHtml = (htmlStr: string | '') => {
  return htmlStr?.replace(/<[^>]+>/g, '') || '';
};

// 邮箱校验
const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// 用户名校验
const validUsername = (username: string | undefined) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
  return !!username && usernameRegex.test(username);
};

// 密码校验
const validPassword = (password: string | undefined) => {
  const passwordRegex = /^[a-zA-Z0-9_]{5,15}$/;
  return !!password && passwordRegex.test(password);
};

export default {
  escapeHtml,
  validateEmail,
  validUsername,
  validPassword,
};
