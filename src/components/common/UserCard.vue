<template>
  <div>
    <user-avatar :uid="uid" :name="name" :transition="false" />
    <span style="font-size: 14px;">{{ uid == 0 ? '[游客]' : name }}</span>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from './UserAvatar.vue'
const props = defineProps({
  uid: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: '[游客]'
  }
})
</script>

<script lang="ts">
import { defineComponent, computed, defineProps } from 'vue'
import { context } from '@/core/context'
import API from '@/api'
import axios from '@/plugins/axios'
export default defineComponent({
  name: 'UserCard'
})
</script>