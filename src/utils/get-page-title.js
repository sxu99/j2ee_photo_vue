import defaultSettings from '@/settings'

const title = defaultSettings.title || '卫星图像管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
