<template>
  <span>
    <v-icon v-if="icon" :icon="icon" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    default: undefined
  }
})
</script>

<script lang="ts">
import { defineComponent, defineProps, defineEmits, Ref, ref, PropType } from 'vue'

export default defineComponent({
  name: 'CommonIcon'
})
</script>