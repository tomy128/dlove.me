<template>
  <div class="emotion-configurator bg-white/95 backdrop-blur-xl border-r border-gray-200 h-full flex flex-col shadow-2xl">
    <!-- 头部：情感引导 -->
    <div class="p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-white">
      <h2 class="text-xl font-display font-bold text-gray-800 mb-1">定制你的专属回忆</h2>
      <p class="text-xs text-gray-500">填写下方内容，右侧将实时呈现效果</p>
    </div>

    <!-- 配置表单区域 -->
    <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
      <div v-for="(field, index) in schema.fields" :key="field.key" class="form-group animate-fade-in-up" :style="{ animationDelay: `${index * 0.05}s` }">
        
        <!-- 字段标题与描述 -->
        <div class="mb-3">
          <label class="text-sm font-bold text-gray-700 mb-1 flex items-center">
            {{ field.label }}
            <el-tooltip v-if="field.tip" :content="field.tip" placement="top">
              <el-icon class="ml-1 text-gray-400 cursor-help"><QuestionFilled /></el-icon>
            </el-tooltip>
          </label>
          <p v-if="field.description" class="text-xs text-gray-400">{{ field.description }}</p>
        </div>

        <!-- 文本输入 -->
        <div v-if="field.type === 'text'" class="relative group">
          <el-input
            v-model="formData[field.key]"
            :placeholder="field.placeholder"
            class="transition-all duration-300"
            @input="updateValue"
          >
            <template #prefix>
              <el-icon class="text-gray-400 group-hover:text-primary-500 transition-colors"><Edit /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 多行文本-->
        <div v-else-if="field.type === 'textarea'" class="relative">
          <el-input
            v-model="formData[field.key]"
            type="textarea"
            :rows="4"
            :placeholder="field.placeholder"
            resize="none"
            class="font-serif"
            @input="updateValue"
          />
          <div class="absolute bottom-2 right-2 text-xs text-gray-300">
            {{ formData[field.key]?.length || 0 }} / {{ field.maxLength || 500 }}
          </div>
        </div>

        <!-- 媒体上传 (图片/音频/视频) -->
        <div v-else-if="['image', 'audio', 'video'].includes(field.type)" class="media-uploader">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="(file) => handleMediaChange(file, field.key, field.type)"
            :accept="getAcceptType(field.type)"
          >
            <!-- 预览区域 -->
            <div v-if="formData[field.key]" class="relative w-full rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100 bg-gray-50">
              
              <!-- 图片预览 -->
              <img v-if="field.type === 'image'" :src="formData[field.key]" class="w-full aspect-video object-cover" />
              
              <!-- 音频预览 -->
              <div v-else-if="field.type === 'audio'" class="p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center shrink-0">
                  <el-icon class="text-lg"><Headset /></el-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-700 truncate mb-1">背景音乐</div>
                  <audio :src="formData[field.key]" controls class="w-full h-8 block" />
                </div>
              </div>

              <!-- 视频预览 -->
              <video v-else-if="field.type === 'video'" :src="formData[field.key]" class="w-full aspect-video bg-black" controls />

              <!-- 悬浮操作层 -->
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <span class="text-white text-sm flex items-center gap-2">
                  <el-icon v-if="isUploading[field.key]"><Loading /></el-icon>
                  <el-icon v-else><Refresh /></el-icon> 
                  {{ isUploading[field.key] ? '上传中...' : '更换文件' }}
                </span>
              </div>
              
              <!-- 上传进度条 -->
              <div v-if="isUploading[field.key]" class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full bg-primary-500 transition-all duration-300" :style="{ width: '100%' }"></div>
              </div>
            </div>

            <!-- 空状态上传按钮 -->
            <div v-else class="w-full p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 bg-gray-50 hover:bg-primary-50 transition-all flex flex-col items-center justify-center cursor-pointer group">
              <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <el-icon class="text-xl text-gray-400 group-hover:text-primary-500">
                  <component :is="getIconByType(field.type)" />
                </el-icon>
              </div>
              <span class="text-sm text-gray-500 group-hover:text-primary-600">点击上传{{ getLabelByType(field.type) }}</span>
              <span class="text-xs text-gray-400 mt-1">支持 {{ getAcceptType(field.type) }}</span>
            </div>
          </el-upload>
        </div>

        <!-- 颜色选择 -->
        <div v-else-if="field.type === 'color'" class="flex items-center gap-4">
          <el-color-picker v-model="formData[field.key]" show-alpha @change="updateValue" />
          <span class="text-sm text-gray-500 font-mono">{{ formData[field.key] }}</span>
        </div>

         <!-- 日期选择 -->
        <div v-else-if="field.type === 'date'" class="w-full">
          <el-date-picker
            v-model="formData[field.key]"
            type="date"
            placeholder="选择那一天"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            class="w-full"
            @change="updateValue"
          />
        </div>

        <!-- 列表类型 (Timeline/Gallery) -->
        <div v-else-if="field.type === 'list'" class="space-y-4">
            <div 
                v-for="(item, itemIndex) in formData[field.key] || []" 
                :key="itemIndex"
                class="relative bg-gray-50 rounded-xl p-4 border border-gray-100 group hover:border-primary-200 transition-colors"
            >
                <!-- 删除按钮 -->
                <div class="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <el-button 
                        type="danger" 
                        link 
                        :icon="Delete" 
                        @click="removeListItem(field.key, itemIndex)"
                    />
                </div>

                <div class="space-y-4">
                    <div v-for="subField in field.item_schema" :key="subField.key">
                         <!-- 子字段渲染逻辑 -->
                         <div class="text-xs font-medium text-gray-500 mb-1">{{ subField.label }}</div>
                         
                         <!-- 子字段：文本 -->
                         <el-input 
                            v-if="subField.type === 'text'"
                            v-model="item[subField.key]"
                            :placeholder="subField.label"
                            size="small"
                            @input="updateValue"
                         />

                         <!-- 子字段：文本域 -->
                         <el-input
                            v-else-if="subField.type === 'textarea'"
                            v-model="item[subField.key]"
                            type="textarea"
                            :rows="2"
                            size="small"
                            resize="none"
                            @input="updateValue"
                         />

                         <!-- 子字段：日期 -->
                         <el-date-picker
                            v-else-if="subField.type === 'date'"
                            v-model="item[subField.key]"
                            type="date"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                            size="small"
                            class="w-full"
                            @change="updateValue"
                         />

                         <!-- 子字段：图片 -->
                         <div v-else-if="subField.type === 'image'" class="relative group/upload">
                            <el-upload
                                action="#"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="(file) => handleListItemMediaChange(file, field.key, itemIndex, subField.key)"
                                accept="image/*"
                            >
                                <div v-if="item[subField.key]" class="relative w-full h-24 rounded-lg overflow-hidden bg-gray-100 cursor-pointer">
                                    <img :src="item[subField.key]" class="w-full h-full object-cover" />
                                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                        <el-icon class="text-white"><Refresh /></el-icon>
                                    </div>
                                </div>
                                <div v-else class="w-full h-24 rounded-lg border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-white transition-colors">
                                    <el-icon class="text-gray-400"><Plus /></el-icon>
                                </div>
                            </el-upload>
                         </div>
                    </div>
                </div>
            </div>

            <!-- 添加按钮 -->
            <el-button class="w-full border-dashed" :icon="Plus" @click="addListItem(field)">
                添加{{ field.label }}
            </el-button>
        </div>

      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="p-6 border-t border-gray-100 bg-white z-10">
      <div class="flex gap-3">
        <el-button class="flex-1" round @click="handleReset">
          <el-icon class="mr-1"><RefreshRight /></el-icon> 重置
        </el-button>
        <el-button type="primary" class="flex-1 shadow-lg shadow-primary-500/30" round @click="$emit('preview')">
          <el-icon class="mr-1"><View /></el-icon> 预览效果
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { QuestionFilled, Edit, Plus, Refresh, RefreshRight, Check, Headset, VideoCamera, Loading, Picture, View, Delete } from '@element-plus/icons-vue';
import { uploadFileDirect } from '@/api/oss';
import { ElMessage, ElMessageBox } from 'element-plus';

const props = defineProps({
  schema: {
    type: Object,
    required: true,
    default: () => ({ fields: [] })
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'save', 'preview', 'upload-status-change']);

const formData = ref({});
const isUploading = ref({}); // 记录每个字段的上传状态

// 辅助函数：获取文件类型对应的接受格式
const getAcceptType = (type) => {
  const map = {
    image: 'image/*',
    audio: 'audio/*',
    video: 'video/*'
  };
  return map[type] || '*';
};

// 辅助函数：获取文件类型对应的图标
const getIconByType = (type) => {
  const map = {
    image: 'Picture',
    audio: 'Headset',
    video: 'VideoCamera'
  };
  return map[type] || 'Plus';
};

// 辅助函数：获取文件类型对应的文案
const getLabelByType = (type) => {
  const map = {
    image: '照片',
    audio: '音乐',
    video: '视频'
  };
  return map[type] || '文件';
};

// 初始化表单数据
onMounted(() => {
  formData.value = { ...props.modelValue };
  
  // 填充默认值
  if (props.schema && props.schema.fields) {
    props.schema.fields.forEach(field => {
      if (formData.value[field.key] === undefined && field.default !== undefined) {
        formData.value[field.key] = field.default;
      }
    });
  }
});

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  formData.value = { ...newVal };
}, { deep: true });

// 监听上传状态变化
watch(isUploading, (newVal) => {
  const isBusy = Object.values(newVal).some(status => status === true);
  emit('upload-status-change', isBusy);
}, { deep: true });

// 更新值
const updateValue = () => {
  emit('update:modelValue', formData.value);
  emit('change', formData.value);
};

// 重置表单
const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有配置吗？这将清除你当前的所有修改。',
      '重置确认',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 执行重置逻辑：恢复到 schema 定义的默认值
    const newData = {};
    if (props.schema && props.schema.fields) {
      props.schema.fields.forEach(field => {
        if (field.default !== undefined) {
          newData[field.key] = field.default;
        }
      });
    }
    formData.value = newData;
    updateValue();
    ElMessage.success('配置已重置');
  } catch (error) {
    // 用户取消或报错，不做处理
  }
};

// 处理媒体文件变更 (图片/音频/视频)
const handleMediaChange = async (file, key, type) => {
  if (!file.raw) return;

  // 1. 转 Base64 用于预览 (解决跨域问题)
  // 使用 Promise 封装 FileReader
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  try {
    // 只有文件不太大时才转 Base64 (例如 < 10MB)，防止浏览器卡顿
    // 如果太大，我们可能需要等待 OSS 上传完成直接用 OSS URL
    if (file.size < 10 * 1024 * 1024) {
      const base64 = await toBase64(file.raw);
      formData.value[key] = base64;
      updateValue(); // 触发右侧 iframe 更新
    } else {
      // 文件过大，暂时显示 loading 或占位符
      // 等 OSS 上传完了，我们会拿到真实的 URL (如果后端支持返回的话)
      // 或者这里先不更新预览，等上传完再更新
    }
  } catch (e) {
    console.error('Base64 conversion failed', e);
  }

  // 2. 静默上传到 OSS
  isUploading.value[key] = true;
  try {
    const { fileKey } = await uploadFileDirect(file.raw);
    // 3. 上传成功
    // 策略：我们把 key 存在 formData 里的一个隐藏属性里
    // 强制使用新对象触发响应式更新，确保 _oss_key 被 Vue 追踪到
    // const newData = { ...formData.value };
    // newData[`_${key}_oss_key`] = fileKey;
    // formData.value = newData;
    formData.value[`_${key}_oss_key`] = fileKey;
    
    // 如果之前因为文件太大没转 Base64，这里是不是应该想办法预览？
    // 遗憾的是 uploadFileDirect 目前只返回了 file_key。
    // 如果需要，我们可以调用 getFileURL(file_key) 来获取一个临时访问链接
    // 但通常 Base64 足够覆盖大部分图片/短音频场景
    
    updateValue();
    console.log(`[Editor] ${type} uploaded:`, fileKey);
  } catch (error) {
    console.error('Upload failed:', error);
    ElMessage.error('文件上传失败，请重试');
  } finally {
    isUploading.value[key] = false;
  }
};

// 列表项操作
const addListItem = (field) => {
    if (!formData.value[field.key]) {
        formData.value[field.key] = [];
    }
    
    // 根据 schema 创建空对象
    const newItem = {};
    if (field.item_schema) {
        field.item_schema.forEach(subField => {
            newItem[subField.key] = subField.default || '';
        });
    }
    
    formData.value[field.key].push(newItem);
    updateValue();
};

const removeListItem = (key, index) => {
    if (formData.value[key]) {
        formData.value[key].splice(index, 1);
        updateValue();
    }
};

const handleListItemMediaChange = async (file, parentKey, index, childKey) => {
    if (!file.raw) return;

    // 1. 转 Base64 用于预览
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    try {
        if (file.size < 10 * 1024 * 1024) {
            const base64 = await toBase64(file.raw);
            if (!formData.value[parentKey][index]) return;
            formData.value[parentKey][index][childKey] = base64;
            updateValue();
        }
    } catch (e) {
        console.error('Base64 conversion failed', e);
    }

    // 2. 静默上传 (Key 构造逻辑需要注意唯一性)
    // 列表项的上传状态暂时没做精细化控制（loading），可以后续优化
    try {
        const { fileKey } = await uploadFileDirect(file.raw);
        if (!formData.value[parentKey][index]) return;
        
        // 存储 OSS Key
        // 这里需要注意：子项的 OSS Key 存储方式。
        // 为了简单起见，我们假设 item 对象里可以存 _oss_key 后缀字段
        formData.value[parentKey][index][`_${childKey}_oss_key`] = fileKey;
        
        updateValue();
        console.log(`[Editor] List item image uploaded:`, fileKey);
    } catch (error) {
        console.error('Upload failed:', error);
        ElMessage.error('文件上传失败，请重试');
    }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

.form-group {
  transition: all 0.3s ease;
}
.form-group:hover {
  transform: translateX(4px);
}
</style>
