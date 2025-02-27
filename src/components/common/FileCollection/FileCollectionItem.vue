<template>
  <v-card class="collection-item">
    <v-card-header>
      <v-card-header-text>
        <div class="d-flex justify-space-between align-center" style="width: 100%">
          <span class="title">{{ item?.title }}</span>
          <span class="state">状态：<span :class="isCollecting ? 'text-success' : 'text-error'">{{ isCollecting ? '收集中' : '已关闭' }}</span></span>
        </div>
      </v-card-header-text>
    </v-card-header>
    <v-divider class="card-divider" />
    <v-card-content class="content">
      <div>
        剩余可接受文件数：{{ item?.available == -1 ? '无限制' : item?.available }}
      </div>
      <div class="date text-blue-grey">
        创建日期：{{ formateDate(item?.createdAt || '') }}
      </div>
      <div class="date text-blue-grey">
        过期日期：{{ formateDate(item?.expiredAt || '') }}
      </div>
    </v-card-content>
    <v-card-actions>
      <v-btn color="primary" @click="emits('showDetail')">
        查看详情
      </v-btn>
      <v-spacer />
      <v-menu location="start">
        <template #activator="{ props: menuProps }">
          <v-btn icon="mdi-dots-horizontal" v-bind="menuProps" />
        </template>
        <v-list>
          <v-list-item v-if="item?.state == 'OPEN'" value="stop" @click="emits('close')">
            <v-list-item-icon start icon="mdi-stop" />
            <v-list-item-title>
              停止收集
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="item?.state == 'CLOSED'" value="start" @click="reopen">
            <v-list-item-icon start icon="mdi-play" />
            <v-list-item-title>
              重新开启
            </v-list-item-title>
          </v-list-item>
          <v-list-item value="delete" @click="emits('delete')">
            <v-list-item-icon start icon="mdi-delete" />
            <v-list-item-title>
              删除
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object as PropType<CollectionInfo>,
    default: undefined
  }
})
const emits = defineEmits(['reopen', 'close', 'delete', 'showDetail'])
const formateDate = StringFormatter.toDate
const reopen = () => {
  if (new Date().getTime() >= new Date(props.item?.expiredAt || 0).getTime()) {
    SfcUtils.alert('任务已过期，无法重新开启')
  } else {
    emits('reopen')
  }
}
const isCollecting = computed(() => {
  return props.item?.state == 'OPEN'
})
</script>

<script lang="ts">
import { defineComponent, defineProps, defineEmits, Ref, ref, PropType } from 'vue'
import { CollectionInfo } from '@/core/model/FileCollection'
import { computed } from '@vue/reactivity'
import { StringFormatter } from '@/utils/StringFormatter'
import SfcUtils from '@/utils/SfcUtils'
export default defineComponent({
  name: 'FileCollectionItem'
})
</script>

<style scoped lang="scss">
.state {
  font-size: 12px;
}

.title {
  font-size: 14px;
}

.card-divider {
  width: 90%;
  margin: 0 5%;
}

.date {
  font-size: 12px;
}

.content {
  font-size: 14px;
  &>* {
    margin-bottom: 6px;
  }
}

.collection-item {
  transition: all .3s;
  &:hover {
    box-shadow: 0px 3px 3px 0px darkgray;
  }
  
}
</style>