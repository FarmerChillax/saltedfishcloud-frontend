<template>
  <div class="loading-mask use-transition" :class="{loading:inLoading, 'flex-center': type == 'circular'}" :style="{zIndex: (zIndex as number)}">
    <transition name="fade">
      <v-progress-linear
        v-show="type == 'linear' && inLoading"
        indeterminate
        color="primary"
      />
    </transition>
    <transition name="fade">
      <v-progress-circular
        v-show="type == 'circular' && inLoading"
        indeterminate
        color="primary"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  /**
   * 进度条类型：linear或circular
   */
  type: {
    type: String as PropType<'linear' | 'circular'>,
    default: 'linear'
  },
  loading: {
    type: Boolean,
    default: false
  },
  useTransition: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: [Number, String],
    default: 9999
  }
})


const loadCount = ref(0)
const inLoading = computed(() => {
  // return true
  return loadCount.value > 0 || props.loading
})
const startLoading = () => {
  loadCount.value++
}

const closeLoading = () => {
  if (loadCount.value > 0) {
    loadCount.value--
  }
}
defineExpose({
  startLoading,
  closeLoading
})
</script>

<script lang="ts">
import { defineComponent, defineProps, PropType, ref, } from 'vue'
import { context } from '@/core/context'
import { computed } from '@vue/reactivity'

export default defineComponent({
  name: 'LoadingMask'
})
</script>

<style lang="scss" scoped>
.loading-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba($color: var(--v-theme-background), $alpha: .4);
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}
.loading-mask.use-transition {
  transition: all .5s;
  transition-timing-function: cubic-bezier(0.2, 1.03, 0.93, 0.99);
}

.loading-mask.loading {
  opacity: 1;
  pointer-events: all;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>