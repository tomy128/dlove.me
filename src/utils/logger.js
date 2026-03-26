// 全局日志控制工具
class LoggerController {
  constructor() {
    this.config = {
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      enabled: true
    }
    
    // 保存原始的 console 方法
    this.originalConsole = {
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      log: console.log.bind(console)
    }
    
    // 日志级别优先级
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }
    
    this.init()
  }
  
  init() {
    // 重写 console 方法
    console.debug = (...args) => {
      if (this.shouldLog('debug')) {
        this.originalConsole.debug('[DEBUG]', ...args)
      }
    }
    
    console.info = (...args) => {
      if (this.shouldLog('info')) {
        this.originalConsole.info('[INFO]', ...args)
      }
    }
    
    console.warn = (...args) => {
      if (this.shouldLog('warn')) {
        this.originalConsole.warn('[WARN]', ...args)
      }
    }
    
    console.error = (...args) => {
      if (this.shouldLog('error')) {
        this.originalConsole.error('[ERROR]', ...args)
      }
    }
    
    // console.log 保持不变，始终显示
    console.log = (...args) => {
      this.originalConsole.log(...args)
    }
    
    // 导出全局控制函数
    window.setLogLevel = (level) => {
      if (this.levels.hasOwnProperty(level)) {
        this.config.level = level
        console.log(`日志级别已设置为: ${level}`)
      } else {
        console.log(`无效的日志级别: ${level}，可用级别: debug, info, warn, error`)
      }
    }
    
    window.toggleLog = () => {
      this.config.enabled = !this.config.enabled
      console.log(`日志已${this.config.enabled ? '启用' : '禁用'}`)
    }
    
    window.getLogConfig = () => {
      console.log('当前日志配置:', this.config)
      return this.config
    }
  }
  
  shouldLog(level) {
    if (!this.config.enabled) return false
    return this.levels[level] >= this.levels[this.config.level]
  }
  
  // 恢复原始 console 方法（用于测试或特殊情况）
  restore() {
    Object.assign(console, this.originalConsole)
  }
}

// 创建全局实例
const loggerController = new LoggerController()

export default loggerController
