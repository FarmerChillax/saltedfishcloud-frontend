<template>
  <div
    ref="rootRef"
    @contextmenu="rootRClick"
    @click="rootLClick"
  >
    <!-- 鼠标框选组件 -->
    <select-area
      :scroll-anchor="scrollAnchor"
      :select-elements-getter="fileElementsGetter"
      @select-start="selectStart"
      @select-move="selectMove"
    />
    <!-- 文件右键菜单组件 -->
    <file-menu
      v-if="menu.length > 0"
      :container="$el"
      :menu="menu"
      :list-context="fileListContext"
      :loading-manager="loadingManager"
    />
    <!-- list类型的文件列表显示 -->
    <v-table
      v-if="type == 'list'"
      ref="tableRef"
      fixed-header
      class="file-table"
      color="background"
      style="overflow: hidden"
      :style="{'--table-width': tableWidth}"
      :height="height"
    >
      <thead>
        <tr>
          <th
            v-if="useSelect"
            width="72"
            class="file-checkbox"
            @click="toggleSelectAll"
          >
            <v-checkbox
              inline
              color="primary"
              hide-details
              :indeterminate="partInSelect"
              :model-value="allInSelect || partInSelect"
            />
          </th>
          <th class="file-col">
            文件名
          </th>
          <!-- <th width="128">
            大小
          </th> -->
          <slot name="thead" />
        </tr>
      </thead>
      <tbody>
        <tr v-if="showBack">
          <td v-if="useSelect" class="file-checkbox" @click="toggleSelectAll">
            <v-checkbox
              inline
              color="primary"
              hide-details
              :indeterminate="partInSelect"
              :model-value="allInSelect || partInSelect"
            />  
          </td>
          <td colspan="100" class="file-col" @click="emits('back')">
            <div class="file-icon-group">
              <v-icon class="d-flex back-icon" icon="mdi-keyboard-backspace" />
              <span>返回上一级</span>
            </div>
          </td>
        </tr>
        <tr v-show="fileList.length == 0">
          <td colspan="100">
            <empty-tip />
          </td>
        </tr>
        <tr
          v-for="(fileInfo, index) in fileList"
          :key="path + fileInfo.name"
          v-ripple
          file-item
          :class="{active: selectedFile[fileInfo.name + fileInfo.md5]}"
          @contextmenu.prevent="fileRClick($event, fileInfo)"
        >
          <td v-if="useSelect" class="file-checkbox" @click="checkClick($event ,fileInfo)">
            <v-checkbox
              inline
              hide-details
              color="primary"
              :model-value="!!selectedFile[fileInfo.name + fileInfo.md5]"
            />
          </td>
          <td class="file-col" @click="fileLClick($event, fileInfo)">
            <div class="file-icon-group">
              <file-icon
                width="32"
                height="32"
                :corner-icon="showMountIcon && fileInfo.mountId ? 'mdi-share' : undefined"
                style="flex-grow: 0;"
                :file-name="fileInfo.name"
                :is-dir="fileInfo.dir"
                :md5="fileInfo.md5"
                :custom-thumbnail-url="handler && handler.getCustomThumbnailUrl(path, fileInfo)"
              />
              <div class="file-detail">
                <div class="d-inline-block text-truncate file-name">
                  <span v-if="renameIndex != index">
                    {{ fileInfo.name }}
                  </span>
                  <div v-else @click.stop>
                    <input v-model="renameNewName" class="rename-input" @keypress.enter="doRename">
                    <v-icon icon="mdi-check" @click="doRename" />
                    <v-icon icon="mdi-close" @click="cancelRename" />
                  </div>
                </div>
                <div>
                  <span class="file-size">{{ fileInfo.size == -1 ? '-': formatSize(fileInfo.size) }}</span>
                </div>
              </div>
            </div>
          </td>
          <!-- <td>
            {{ fileInfo.size == -1 ? '-' : StringFormatter.toSize(fileInfo.size) }}
          </td> -->
          <slot name="tbody" :file-info="fileInfo" />
        </tr>
      </tbody>
    </v-table>
    <empty-tip v-if="type == 'grid' && fileList.length == 0" style="position: absolute;width: 100%;" />
    <!-- grid类型的文件显示 -->
    <grid-container
      v-if="type == 'grid'"
      ref="gridRef"
      :width="120"
      style="margin: 8px"
      class="grid-container"
    >
      <file-list-grid-item
        v-for="(fileInfo) in fileList"
        :key="path + fileInfo.name + fileInfo.md5"
        ref="gridItemRef"
        v-ripple
        :file-info="fileInfo"
        :corner-icon="showMountIcon && fileInfo.mountId ? 'mdi-share' : undefined"
        :active="!!selectedFile[fileInfo.name + fileInfo.md5]"
        :path="path"
        @click="fileLClick($event, fileInfo)"
        @contextmenu.prevent="fileRClick($event, fileInfo)"
        @check-change="toggleSelectFile(fileInfo)"
      />
    </grid-container>
  </div>
</template>

<script setup lang="ts">
import FileMenu from '../FileMenu.vue'
import FileIcon from '../FileIcon.vue'
import propsOptions from './props'
import { StringFormatter } from '@/utils/StringFormatter'
import SfcUtils from '@/utils/SfcUtils'
import FileListContextBuilder from './FileListContextBuilder'
import { LoadingControlPromise } from '@/utils/LoadingManager'
import EmptyTip from '../EmptyTip.vue'
import GridContainer from '@/components/layout/GridContainer.vue'
import FileListGridItem from './FileListGridItem.vue'
import SelectArea from '../SelectArea.vue'


const props = defineProps(propsOptions)

let lastClickFile: FileInfo | null | boolean = null
const selectedFile = reactive({}) as {[key:string]: FileInfo}
const renameNewName = ref('')
const renameIndex = ref(-1)
let renamePromiseResolve: ((value: string | PromiseLike<string>) => void) | null= null
let renamePromiseReject: ((value: string | PromiseLike<string>) => void) | null = null

// 执行重命名取消动作的函数，在grid和list模式下是不同的，动态赋值
let cancelRenameActionFun: Function
const tableWidth = ref('100%')
const rootRef = ref() as Ref<HTMLElement>
const tableRef = ref() as Ref<ComponentPublicInstance>
const gridRef = ref() as Ref<ComponentPublicInstance>
const gridItemRef = ref()

let inSelect = false

const partInSelect = computed(() => {
  return fileListContext.selectFileList.length > 0 && fileListContext.selectFileList.length != props.fileList.length
})
const allInSelect = computed(() => {
  return props.fileList.length != 0 && props.fileList.length == fileListContext.selectFileList.length
})
const scrollAnchor = computed(() => {
  if (props.type == 'list') {
    return tableRef.value?.$el.querySelector('.v-table__wrapper')
  } else {
    return gridRef.value?.$el
  }
})
const fileElementsGetter = () => {
  if (props.type == 'list') {
    return tableRef.value?.$el.querySelectorAll('tbody>tr[file-item=""]') as HTMLElement[]
  } else {
    return (gridRef as Ref<ComponentPublicInstance>).value?.$el.querySelectorAll('.file-grid-item')
  }
}
const selectMove = (e:SelectResult) => {
  if (!e.event.ctrlKey) {
    resetSelect()
  }
  
  e.index.forEach(index => {
    const fileInfo = props.fileList[index]
    const key = fileInfo.name + fileInfo.md5
    selectedFile[key] = fileInfo
  })
}
const selectStart = () => {
  inSelect = true
}

const rename = (name: string, md5: string) => {
  resetSelect()
  renameIndex.value = props.fileList.findIndex(e => e.name == name && e.md5 == md5)
  renameNewName.value = name
  if (props.type == 'grid') {
    const gridItemInst = gridItemRef.value[renameIndex.value]
    cancelRenameActionFun = gridItemInst.cancelRename
    // 针对grid模式的重命名
    return gridItemInst.rename().then((newName: string) => {
      const sameNameIndex = props.fileList.findIndex((e, idx) => e.name == newName && idx != renameIndex.value)
      if (sameNameIndex != -1) {
        renameIndex.value = -1
        SfcUtils.snackbar('存在同名文件')
        return Promise.reject('存在同名文件')
      } else {
        return handler.value.rename(props.path, props.fileList[renameIndex.value].name, newName).then(() => {
          return Promise.resolve(newName)
        })
      }
    }).finally(() => {
      renameIndex.value = -1
    })
  } else {
    cancelRenameActionFun = cancelRename
    // 针对list模式的重命名
    return new LoadingControlPromise<string>((resolve, reject) => {
      renamePromiseResolve = resolve
      renamePromiseReject = reject
      nextTick().then(() => {
        (rootRef.value.querySelector('.rename-input') as HTMLInputElement).select()
      })
    }, false)
  }
}
const emits = defineEmits<{
  (event: 'clickItem', ctx: FileListContext ,item: FileInfo): void,
  (event: 'back'): void,
  (event: 'refresh'): void,
  (event: 'update:file-list', fileList: FileInfo[]): void
}>()

const handler = inject<Ref<FileSystemHandler>>('fileSystemHandler', null as any) as Ref<FileSystemHandler>
const fileListContext: FileListContext = FileListContextBuilder.getFileListContext({
  props,
  emits,
  rename,
  handler,
  protocol: inject('protocol', ''),
  protocolParams: inject('protocolParams', () => {
    return { id: props.uid }
  })
})

const toggleSelectAll = () => {
  lastClickFile = true
  if (partInSelect.value || !allInSelect.value) {
    setSelectFile(...props.fileList)
  } else {
    setSelectFile()
  }
}
/**
 * 文件多选框勾选点击事件
 * @param e 鼠标事件
 * @param fileInfo 勾选的选择框所属的文件信息
 */
const checkClick = (e: MouseEvent, fileInfo: FileInfo) => {
  lastClickFile = fileInfo
  toggleSelectFile(fileInfo)
}

/**
 * list模式的取消重命名
 */
const cancelRename = () => {
  renamePromiseReject && renamePromiseReject('重命名取消')
  renameIndex.value = -1
}

/**
 * list模式的执行重命名
 */
const doRename = async() => {
  const sameNameIndex = props.fileList.findIndex(e => e.name == renameNewName.value)
  
  // 如果在文件列表中找到文件名和新文件名相同
  if (sameNameIndex != -1) {

    // 同一个文件
    if (sameNameIndex == renameIndex.value) {
      renameIndex.value = -1
      renamePromiseResolve && renamePromiseResolve('')
      return false
    } else {

      // 其它文件存在同名
      renamePromiseReject && renamePromiseReject('存在同名文件')
      return Promise.reject()
    }
  }
  await handler?.value.rename(props.path, props.fileList[renameIndex.value].name, renameNewName.value)
  renameIndex.value = -1
  renamePromiseResolve && renamePromiseResolve(renameNewName.value)
}
/**
 * 整个组件的点击事件回调
 * @param e 鼠标事件
 */
const rootLClick = (e: MouseEvent) => {
  if (!lastClickFile && !e.ctrlKey && !inSelect) {
    resetSelect()
  }
  lastClickFile = null
  inSelect = false
  if (renameIndex.value != -1) {
    renameIndex.value = -1
    SfcUtils.snackbar('重命名已取消', 1000, {outClose: true})
    cancelRenameActionFun && cancelRenameActionFun()
  }
}
/**
 * 整个组件的右键/打开菜单事件
 */
const rootRClick = () => {
  // 如果是在文件项目上触发的事件，则清除标志位，否则重置已选择文件
  if (lastClickFile) {
    lastClickFile = null
  } else {
    resetSelect()
  }
}
/**
 * 文件项的右键/打开菜单事件
 * 会和rootClick一起触发，且会先于rootClick。
 * 通过设置lastClickFile属性来让rootClick判断是否是点击了文件项。
 */
const fileRClick = (e: MouseEvent, fileInfo: FileInfo) => {
  lastClickFile = fileInfo
  if(!selectedFile[fileInfo.name + fileInfo.md5] && !e.ctrlKey) {
    setSelectFile(fileInfo)
  }
  
}
const fileLClick = (e: MouseEvent, fileInfo: FileInfo) => {
  if (e.ctrlKey) {
    toggleSelectFile(fileInfo)
  } else {
    emits('clickItem', fileListContext, fileInfo)
  }
  
}
const setSelectFile = (...fileInfos: FileInfo[]) => {
  resetSelect()
  fileInfos.forEach(fileInfo => {
    const key = fileInfo.name + fileInfo.md5
    selectedFile[key] = fileInfo
  })
}
const toggleSelectFile = (...fileInfos: FileInfo[]) => {
  fileInfos.forEach(fileInfo => {
    const key = fileInfo.name + fileInfo.md5
    if (selectedFile[key]) {
      delete selectedFile[key]
    } else {
      selectedFile[key] = fileInfo
    }
  })
}

/**
 * 重置已选择的文件，清空
 */
const resetSelect = () => {
  Object.keys(selectedFile).forEach(key => {
    delete selectedFile[key]
  })
  cancelRenameActionFun && cancelRenameActionFun()
}

const updateWidth = () => {
  const el = rootRef.value as HTMLElement
  tableWidth.value = (el.clientWidth - 128)+ 'px'
}

const containerHeight = computed(() => {
  return props.height ? ((props.height - 16) + 'px') : 'auto'
})

const formatSize = (size: number) => {
  return StringFormatter.toSize(size)
}
watch(() => props.readOnly, () => {
  fileListContext.readonly = props.readOnly
})

watch(() => props.fileList, () => {
  fileListContext.fileList = props.fileList
  resetSelect()
})
watch(selectedFile, () => {
  fileListContext.selectFileList = Object.values(selectedFile)
})
watch(() => props.path, () => {
  fileListContext.path = props.path
})
watch(() => props.uid, () => {
  fileListContext.uid = props.uid
})

onMounted(() => {
  fileListContext.uid = props.uid
  window.addEventListener('resize', updateWidth)
  updateWidth()
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
defineExpose({
  context: fileListContext
})
</script>

<script lang="ts">
import { FileSystemHandler } from '@/core/serivce/FileSystemHandler'
import { FileListContext,FileInfo } from '@/core/model'
import { defineExpose ,defineComponent, Ref, reactive, PropType, inject, watch, getCurrentInstance, ref, onMounted, onUnmounted, computed, nextTick, ComponentPublicInstance } from 'vue'
import { SelectResult } from '@/core/model/component/SelectArea'
import API from '@/api'

export default defineComponent({
  name: 'FileList'
})
</script>


<style lang="scss" scoped>
@import './style.scss';
.grid-container {
  height: v-bind(containerHeight);
  padding: 6px 0;
  overflow: auto;
}
</style>