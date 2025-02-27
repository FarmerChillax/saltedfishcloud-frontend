<template>
  <base-form
    ref="formRef"
    :model-value="formData"
    :son-forms="sonForm"
    :label-width="labelWidth"
  >
    <v-row :align="'center'">
      <v-col class="form-label" style="max-width: 140px">
        <span>开启高级选项：</span>
      </v-col>
      <v-col>
        <v-switch
          v-model="useAdvanced"
          :readonly="readonly"
          hide-details
          color="primary"
        />
      </v-col>
    </v-row>
    <template v-if="useAdvanced">
      <v-row :align="'center'" class="form-row">
        <v-col class="mw-50">
          <v-row>
            <v-col class="form-label">
              <span>接受数量：</span>
            </v-col>
            <v-col>
              <form-select
                v-model="recvStrategy"
                :disabled="readonly"
                :items="recvOption"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="recvStrategy != '-1'">
          <v-row>
            <v-col>
              <text-input
                v-model="formData.allowMax"
                :readonly="readonly"
                label="最大接收数量"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row :align="'center'" class="form-row">
        <v-col class="mw-50">
          <v-row>
            <v-col class="form-label">
              大小限制：
            </v-col>
            <v-col>
              <form-select
                v-model="sizeStrategy"
                :disabled="readonly"
                :items="sizeOption"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col v-if="sizeStrategy != '-1'">
          <text-input
            v-model="sizeValue"
            :readonly="readonly"
            type="number"
            :label="'指定大小(' + sizeStrategy + ')'"
            :rules="validators.size"
          />
        </v-col>
      </v-row>
      <file-collection-type-strategy
        ref="sonformRef"
        :init-value="initValue"
        :readonly="readonly"
      />
    </template>
  </base-form>
</template>

<script setup lang="ts">
import BaseForm from '@/components/common/BaseForm.vue'
import FormSelect from '@/components/common/FormSelect.vue'
import TextInput from '@/components/common/TextInput.vue'
import FileCollectionTypeStrategy from './FileCollectionTypeStrategyForm.vue'
const formRef = ref()
const sonformRef = ref()
const sonForm = [sonformRef]
const useAdvanced = ref(false)
const props = defineProps({
  labelWidth: {
    type: String,
    default: '120px'
  },
  initValue: {
    type: Object as PropType<CollectionInfo>,
    default: undefined
  },
  readonly: {
    type: Boolean,
    default: false
  }
})
const recvOption: SelectOption[] = [
  {
    title: '无限制',
    value: '-1',
    action: () => { formData.allowMax = -1 }
  },
  {
    title: '手动指定',
    value: '1',
    action: () => { formData.allowMax = 100 }
  }
]
const sizeOption: SelectOption[] = [
  {
    title: '无限制',
    value: '-1'
  },
  {
    title: 'MiB',
    value: 'MiB'
  },
  {
    title: 'GiB',
    value: 'GiB'
  }
]
const recvStrategy = ref('-1')
const sizeStrategy = ref('-1')
const sizeValue = ref(10)
const formInst = defineForm({
  actions: {

  },
  formData: {
    allowMax: -1,
    maxSize: -1
  },
  formRef: formRef,
  validators: {
    size: [
      Validators.notNull('不能为空'),
      Validators.minLen('最少输入一位数', 1),
      (e: FormFieldType) => e == 0 ? '不能为零' : true,
      Validators.minNum(0),
      (e: FormFieldType) => {
        if (sizeStrategy.value == 'GiB') {
          return Validators.maxLen('GiB最大不能超过8位', 8)(e)
        } else if (sizeStrategy.value == 'MiB') {
          return Validators.maxLen('MiB最大不能超过11位', 11)(e)
        } else {
          return true
        }
      }
    ],
    num: [
      Validators.notNull('不能为空'),
      Validators.minLen('最少输入一位数', 1),
      (e: FormFieldType) => e == 0 ? '不能为零' : true,
      Validators.minNum(0)
    ]
  }
})
const { formData, validators } = formInst

/**
 * 恢复初始状态
 */
const initData = () => {
  formData.allowMax = -1
  formData.maxSize = -1
  recvStrategy.value = '-1'
  sizeStrategy.value = '-1'
}
defineExpose(formInst)
const originData = {
  recvStrategy: recvStrategy.value,
  sizeStrategy: sizeStrategy.value,
  formData: Object.assign({}, formData)
}

const updateMaxSize = () => {
  if (sizeStrategy.value == '-1') {
    formData.maxSize = -1
  } else if (sizeStrategy.value == 'GiB') {
    formData.maxSize = 1024*1024*1024*sizeValue.value
  } else if (sizeStrategy.value == 'MiB') {
    formData.maxSize = 1024*1024*sizeValue.value
  }
}

watch(sizeValue, updateMaxSize)
watch(sizeStrategy, updateMaxSize)



watch(useAdvanced, () => {
  if (useAdvanced.value) {

    // 开启选项，还原数据
    recvStrategy.value = originData.recvStrategy
    sizeStrategy.value = originData.sizeStrategy
    Object.assign(formData, originData.formData)
  } else {
    
    // 关闭选项，备份数据
    originData.recvStrategy = recvStrategy.value
    originData.sizeStrategy = sizeStrategy.value
    Object.assign(originData.formData, formData)
    initData()
  }
})


onMounted(async() => {
  if (props.initValue) {
    const obj = props.initValue
    if(obj.allowMax != -1 || obj.maxSize != -1 || obj.pattern) {
      useAdvanced.value = true
      await nextTick()
      if (obj.allowMax != -1) {
        recvStrategy.value = '1'
        await nextTick()
        formData.allowMax = obj.allowMax || 0
      }

      if (obj.maxSize != -1) {
        let size = (obj.maxSize / 1024 / 1024)
        if (size >= 1024) {
          sizeStrategy.value = 'GiB'
          size /= 1024
        } else {
          sizeStrategy.value = 'MiB'
        }
        
        await nextTick()
        sizeValue.value = parseFloat(size.toFixed(2))
      }
    }
  }
})
</script>

<script lang="ts">
import { defineComponent, defineProps, defineEmits, Ref, ref, PropType, watch, onMounted, nextTick } from 'vue'
import { SelectOption } from '@/core/model/Common'
import { defineForm, FormFieldType } from '@/utils/FormUtils'
import { Validators } from '@/core/helper/Validators'
import { CollectionInfo } from '@/core/model/FileCollection'

export default defineComponent({
  name: 'FileCollectionAdvancedOption'
})
</script>