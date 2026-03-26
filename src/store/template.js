import { defineStore } from 'pinia'
import { 
  getTemplates, 
  getTemplateById, 
  getCategories
} from '@/api/template'
import {
  getAdminTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  updateTemplateStatus
} from '@/api/admin/templates'
import {
  getAdminCategories
} from '@/api/admin/categories'

export const useTemplateStore = defineStore('template', {
  state: () => ({
    templates: [],
    currentTemplate: null,
    categories: [],
    loading: false,
    filters: {
      category_id: '',
      search: '',
      sort: 'newest'
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0
    }
  }),
  
  getters: {
    filteredTemplates: (state) => {
      // 现在筛选是在后端完成的，直接返回templates数组
      return state.templates || []
    },
    
    paginatedTemplates: (state) => {
      // 现在分页是在后端完成的，直接返回filteredTemplates
      return state.filteredTemplates;
    },
    
    totalPages: (state) => {
      // 使用后端返回的总数计算总页数
      return Math.ceil(state.pagination.total / state.pagination.limit)
    }
  },
  
  actions: {
    async fetchTemplates() {
      this.loading = true
      
      try {
        // 构建查询参数，将筛选条件传递给后端API
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        // 添加筛选条件
        if (this.filters.category_id) params.category_id = this.filters.category_id
        if (this.filters.search) params.search = this.filters.search
        if (this.filters.sort) params.sort = this.filters.sort
        
        const response = await getTemplates(params)
        // 确保 items 存在，否则给空数组
        let items = response?.body?.items || response?.data?.items || []
        
        this.pagination.total = response.body?.total || response.data?.total || 0
        this.templates = items
        return Promise.resolve(response)
      } catch (error) {
        console.error('API fetch failed', error)
        this.templates = []
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchTemplateById(id, preview = false) {
      this.loading = true
      
      try {
        const response = await getTemplateById(id, preview)
        console.log(response)
        this.currentTemplate = response.body || response.data.data
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      this.loading = true
      
      try {
        const response = await getCategories()
        this.categories = response.body.data
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async fetchAdminCategories() {
      this.loading = true
      
      try {
        const response = await getAdminCategories()
        this.categories = response.data.data.data
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },
    
    setFilter(filters) {
      // 更新所有提供的过滤器
      if (filters.category_id !== undefined) this.filters.category_id = filters.category_id
      if (filters.search !== undefined) this.filters.search = filters.search
      if (filters.sort !== undefined) this.filters.sort = filters.sort
      
      // 重置到第一页，确保分页正确
      this.pagination.page = 1
    },
    
    setPage(page) {
      this.pagination.page = page
    },
    
    clearFilters() {
      // 完全重置筛选条件
      this.filters = {
        category_id: '',
        search: '',
        sort: 'newest'
      }
      
      // 重置分页
      this.pagination.page = 1
      
      // 注意：不需要手动清除 filteredTemplates，因为它是一个 getter
      // 会在筛选条件变化时自动重新计算
    },

    // 管理员相关方法
    async fetchAdminTemplates(params) {
      this.loading = true
      
      try {
        const response = await getAdminTemplates(params)
        this.templates = response.body.items
        this.pagination.total = response.body.total
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async createTemplate(templateData) {
      this.loading = true
      
      try {
        const response = await createTemplate(templateData)
        this.templates.unshift(response.data.data)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async updateTemplate(templateData) {
      this.loading = true
      
      try {
        const response = await updateTemplate(templateData)
        const index = this.templates.findIndex(t => t.id === templateData.id)
        if (index !== -1) {
          this.templates[index] = response.body
        }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async deleteTemplate(templateId) {
      this.loading = true
      
      try {
        const response = await deleteTemplate(templateId)
        this.templates = this.templates.filter(t => t.id !== templateId)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    },

    async updateTemplateStatus(templateId, status) {
      this.loading = true
      
      try {
        const response = await updateTemplateStatus(templateId, status)
        const index = this.templates.findIndex(t => t.id === templateId)
        if (index !== -1) {
          this.templates[index] = { ...this.templates[index], status }
        }
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
      }
    }
  }
})