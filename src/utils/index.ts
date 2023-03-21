// 过滤html标签，防止XSS攻击
const escapeHtml = (htmlStr: string | '') => {
  return htmlStr?.replace(/<[^>]+>/g, '') || ''
}


export default {
  escapeHtml
}